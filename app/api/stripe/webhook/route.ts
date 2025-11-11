import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.booking_id;

        if (bookingId) {
          // Update booking status to paid
          const query = supabase.from("bookings");
          // @ts-expect-error - Supabase type inference issue with update
          const { error: updateError } = await query.update({
            status: "confirmed",
            payment_status: "paid",
            stripe_payment_intent_id: session.payment_intent as string,
            updated_at: new Date().toISOString(),
          }).eq("id", bookingId);

          if (updateError) {
            console.error("Failed to update booking:", updateError);
          } else {
            console.log(`Booking ${bookingId} payment confirmed`);
          }
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata?.booking_id;

        if (bookingId) {
          console.log(`Payment succeeded for booking ${bookingId}`);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata?.booking_id;

        if (bookingId) {
          // Update booking payment status to failed
          const query2 = supabase.from("bookings");
          // @ts-expect-error - Supabase type inference issue with update
          const { error: updateError } = await query2.update({
            payment_status: "failed",
            updated_at: new Date().toISOString(),
          }).eq("id", bookingId);

          if (updateError) {
            console.error("Failed to update booking:", updateError);
          } else {
            console.log(`Payment failed for booking ${bookingId}`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook handler failed" },
      { status: 500 }
    );
  }
}
