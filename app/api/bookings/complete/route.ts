import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { booking_id } = await request.json();

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

    // Get vendor profile
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 });
    }

    const vendorData = vendor as any;

    // Get booking and verify it's confirmed with payment
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .eq('vendor_id', vendorData.id)
      .eq('status', 'confirmed')
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found or cannot be completed' },
        { status: 404 }
      );
    }

    const bookingData = booking as any;

    // Check if payment was received
    if (!bookingData.stripe_payment_intent_id) {
      return NextResponse.json(
        { error: 'Payment not yet received for this booking' },
        { status: 400 }
      );
    }

    // Update booking status to completed
    const query = supabase.from('bookings');
    // @ts-expect-error - Supabase type inference issue with update
    const { error: updateError } = await query.update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    }).eq('id', booking_id);

    if (updateError) {
      console.error('Failed to update booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to complete booking' },
        { status: 500 }
      );
    }

    // Send email notification to customer requesting review
    try {
      const { data: customer } = await supabase
        .from('users')
        .select('email, full_name')
        .eq('id', bookingData.customer_id)
        .single();

      const { data: vendorProfile } = await supabase
        .from('vendors')
        .select('business_name')
        .eq('id', vendorData.id)
        .single();

      const customerData = customer as any;
      const vendorProfileData = vendorProfile as any;

      if (customer && vendorProfile) {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emails/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'booking_completed',
            data: {
              customerName: customerData.full_name,
              customerEmail: customerData.email,
              vendorName: vendorProfileData.business_name,
              serviceType: bookingData.service_type,
              bookingId: booking_id,
            },
          }),
        });
      }
    } catch (emailError) {
      console.error('Failed to send completion email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Booking marked as completed',
    });
  } catch (error: any) {
    console.error('Booking completion error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete booking' },
      { status: 500 }
    );
  }
}
