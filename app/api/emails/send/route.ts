import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email';
import {
  newBookingRequestEmail,
  bookingConfirmedEmail,
  paymentReceivedEmail,
  bookingCompletedEmail,
  newMessageEmail,
  vendorVerifiedEmail,
  bookingCancelledEmail,
} from '@/lib/email-templates';
import { withRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    RATE_LIMITS.EMAIL,
    async () => {
      try {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { type, data } = body;

        let emailHtml: string;
        let subject: string;
        let to: string;

        switch (type) {
          case 'new_booking_request':
            subject = 'New Booking Request';
            to = data.vendorEmail;
            emailHtml = newBookingRequestEmail(data);
            break;

          case 'booking_confirmed':
            subject = 'Booking Confirmed - Payment Required';
            to = data.customerEmail;
            emailHtml = bookingConfirmedEmail(data);
            break;

          case 'payment_received':
            subject = 'Payment Received for Your Service';
            to = data.vendorEmail;
            emailHtml = paymentReceivedEmail(data);
            break;

          case 'booking_completed':
            subject = 'Service Completed - Please Leave a Review';
            to = data.customerEmail;
            emailHtml = bookingCompletedEmail(data);
            break;

          case 'new_message':
            subject = `New Message from ${data.senderName}`;
            to = data.recipientEmail;
            emailHtml = newMessageEmail(data);
            break;

          case 'vendor_verified':
            subject = 'Your Vendor Profile Has Been Verified!';
            to = data.vendorEmail;
            emailHtml = vendorVerifiedEmail(data);
            break;

          case 'booking_cancelled':
            subject = 'Booking Cancelled';
            to = data.recipientEmail;
            emailHtml = bookingCancelledEmail(data);
            break;

          default:
            return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
        }

        const result = await sendEmail({
          to,
          subject,
          html: emailHtml,
        });

        if (!result.success) {
          return NextResponse.json(
            { error: 'Failed to send email', details: result.error },
            { status: 500 }
          );
        }

        return NextResponse.json({ success: true, data: result.data });
      } catch (error: any) {
        console.error('Email API error:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to send email' },
          { status: 500 }
        );
      }
    }
  );
}
