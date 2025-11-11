import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  return withRateLimit(
    request,
    RATE_LIMITS.STRIPE,
    async () => {
      try {
        const { searchParams } = new URL(request.url);
        const booking_id = searchParams.get('booking_id');

        if (!booking_id) {
          return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
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

        // Get booking and verify customer owns it
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .select('*, vendor:vendors(business_name)')
          .eq('id', booking_id)
          .eq('customer_id', user.id)
          .single();

        if (bookingError || !booking) {
          return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        const bookingData = booking as any;

        // Check if booking has a payment intent
        if (!bookingData.stripe_payment_intent_id) {
          return NextResponse.json(
            { error: 'No payment required for this booking yet' },
            { status: 400 }
          );
        }

        // Retrieve payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(
          bookingData.stripe_payment_intent_id
        );

        return NextResponse.json({
          client_secret: paymentIntent.client_secret,
          amount: paymentIntent.amount,
          status: paymentIntent.status,
          booking: {
            id: bookingData.id,
            service_type: bookingData.service_type,
            vendor_name: bookingData.vendor?.business_name,
            price: bookingData.price,
          },
        });
      } catch (error: any) {
        console.error('Payment intent retrieval error:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to retrieve payment information' },
          { status: 500 }
        );
      }
    }
  );
}
