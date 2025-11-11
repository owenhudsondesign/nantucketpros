import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId, vendorStripeAccountId } = await request.json();

    if (!bookingId || !vendorStripeAccountId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Fetch booking details
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(`
        *,
        vendor:vendors(business_name, stripe_account_id)
      `)
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const bookingData = booking as any;

    // Verify user is the customer
    if (bookingData.customer_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Verify booking has a price
    if (!bookingData.price || bookingData.price <= 0) {
      return NextResponse.json(
        { error: "Booking must have a valid price" },
        { status: 400 }
      );
    }

    // Calculate platform fee (5% of total)
    const platformFeeAmount = Math.round(bookingData.price * 100 * 0.05);
    const totalAmount = Math.round(bookingData.price * 100);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${bookingData.service_type} - ${bookingData.vendor.business_name}`,
              description: bookingData.description,
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/homeowner/bookings/${bookingId}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/homeowner/bookings/${bookingId}?payment=cancelled`,
      metadata: {
        booking_id: bookingId,
        customer_id: user.id,
        vendor_id: bookingData.vendor_id,
      },
      payment_intent_data: {
        application_fee_amount: platformFeeAmount,
        transfer_data: {
          destination: vendorStripeAccountId,
        },
        metadata: {
          booking_id: bookingId,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout session error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
