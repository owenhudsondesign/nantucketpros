import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { accountId } = await request.json();

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the account belongs to this user
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('stripe_account_id')
      .eq('user_id', user.id)
      .single();

    if (vendorError || !vendor || vendor.stripe_account_id !== accountId) {
      return NextResponse.json({ error: 'Invalid account' }, { status: 403 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${siteUrl}/vendor/onboarding?refresh=true`,
      return_url: `${siteUrl}/vendor/onboarding/complete`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error: any) {
    console.error('Account link creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create account link' },
      { status: 500 }
    );
  }
}
