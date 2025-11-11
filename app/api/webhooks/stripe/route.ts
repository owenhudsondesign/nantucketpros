import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { logger } from '@/lib/logger';

// Disable body parsing, need raw body for webhook signature verification
export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    logger.error('Webhook signature verification failed', err);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          logger.info('PaymentIntent succeeded', { paymentIntentId: paymentIntent.id });

          // Update booking with payment confirmation
          const bookingId = paymentIntent.metadata.booking_id;
          if (bookingId) {
            const query = supabase.from('bookings');
            // @ts-expect-error - Supabase type inference issue with update
            const { error } = await query.update({
              stripe_payment_intent_id: paymentIntent.id,
            }).eq('id', bookingId);

            if (error) {
              logger.error('Failed to update booking', error, { bookingId });
            } else {
              logger.info('Booking updated with payment', { bookingId });
              // TODO: Send email notification to vendor
            }
          }
        }
        break;

      case 'payment_intent.payment_failed':
        {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          logger.warn('PaymentIntent failed', { paymentIntentId: paymentIntent.id });

          // TODO: Notify customer and vendor about payment failure
          // Optionally update booking status or add a note
        }
        break;

      case 'account.updated':
        {
          const account = event.data.object as Stripe.Account;
          logger.info('Account updated', { accountId: account.id });

          // Update vendor onboarding status
          const query2 = supabase.from('vendors');
          // @ts-expect-error - Supabase type inference issue with update
          const { error } = await query2.update({
            stripe_onboarding_complete: account.details_submitted || false,
          }).eq('stripe_account_id', account.id);

          if (error) {
            logger.error('Failed to update vendor account status', error, { accountId: account.id });
          }
        }
        break;

      case 'charge.succeeded':
        {
          const charge = event.data.object as Stripe.Charge;
          logger.info('Charge succeeded', { chargeId: charge.id });
          // Additional tracking or analytics
        }
        break;

      case 'charge.failed':
        {
          const charge = event.data.object as Stripe.Charge;
          logger.warn('Charge failed', { chargeId: charge.id });
          // TODO: Handle failed charges
        }
        break;

      // Note: Additional event types can be handled here
      // such as transfer.created, payout.paid, etc.
      // These are logged but not critical for core functionality

      default:
        logger.debug('Unhandled event type', { eventType: event.type });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    logger.error('Webhook handler error', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
