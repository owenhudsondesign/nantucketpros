import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    RATE_LIMITS.BOOKING,
    async () => {
      try {
        const { booking_id, price } = await request.json();

        if (!booking_id || !price) {
          return NextResponse.json(
            { error: 'Booking ID and price are required' },
            { status: 400 }
          );
        }

        const supabase = await createClient();

        // Get authenticated user
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get vendor profile
        const { data: vendor, error: vendorError } = await supabase
          .from('vendors')
          .select('id, stripe_account_id, stripe_onboarding_complete')
          .eq('user_id', user.id)
          .single();

        if (vendorError || !vendor) {
          return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 });
        }

        // Check if Stripe onboarding is complete
        if (!vendor.stripe_account_id || !vendor.stripe_onboarding_complete) {
          return NextResponse.json(
            { error: 'Please complete Stripe Connect onboarding first' },
            { status: 400 }
          );
        }

        // Get booking details
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', booking_id)
          .eq('vendor_id', vendor.id)
          .eq('status', 'pending')
          .single();

        if (bookingError || !booking) {
          return NextResponse.json(
            { error: 'Booking not found or already processed' },
            { status: 404 }
          );
        }

        // Get platform commission rate
        const { data: commissionSetting } = await supabase
          .from('admin_settings')
          .select('value')
          .eq('key', 'commission_rate')
          .single();

        const commissionRate = commissionSetting
          ? parseFloat(commissionSetting.value as string)
          : 0.15; // Default 15%

        // Create Stripe Payment Intent with application fee
        const amountInCents = Math.round(price * 100);
        const applicationFeeAmount = Math.round(amountInCents * commissionRate);

        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: 'usd',
          application_fee_amount: applicationFeeAmount,
          transfer_data: {
            destination: vendor.stripe_account_id,
          },
          metadata: {
            booking_id: booking_id,
            vendor_id: vendor.id,
            customer_id: booking.customer_id,
          },
          // Automatically capture payment (can change to manual if needed)
          capture_method: 'automatic',
        });

        // Update booking with price and payment intent
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: 'confirmed',
            price: price,
            stripe_payment_intent_id: paymentIntent.id,
          })
          .eq('id', booking_id);

        if (updateError) {
          console.error('Failed to update booking:', updateError);
          // Note: Payment intent was created, but booking update failed
          // In production, you'd want to handle this edge case
          return NextResponse.json(
            { error: 'Failed to update booking status' },
            { status: 500 }
          );
        }

        // Send email notification to customer
        try {
          const { data: customer } = await supabase
            .from('users')
            .select('email, full_name')
            .eq('id', booking.customer_id)
            .single();

          const { data: vendorUser } = await supabase
            .from('users')
            .select('full_name')
            .eq('id', user.id)
            .single();

          const { data: vendorProfile } = await supabase
            .from('vendors')
            .select('business_name')
            .eq('id', vendor.id)
            .single();

          if (customer && vendorProfile) {
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emails/send`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'booking_confirmed',
                data: {
                  customerName: customer.full_name,
                  customerEmail: customer.email,
                  vendorName: vendorProfile.business_name,
                  serviceType: booking.service_type,
                  price: price,
                  bookingId: booking_id,
                },
              }),
            });
          }
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
          // Don't fail the request if email fails
        }

        return NextResponse.json({
          success: true,
          payment_intent_id: paymentIntent.id,
          client_secret: paymentIntent.client_secret,
        });
      } catch (error: any) {
        console.error('Booking acceptance error:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to accept booking' },
          { status: 500 }
        );
      }
    }
  );
}
