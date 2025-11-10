import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get vendor profile with Stripe account ID
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('stripe_account_id, stripe_onboarding_complete')
      .eq('user_id', user.id)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    if (!vendor.stripe_account_id) {
      return NextResponse.json({
        accountExists: false,
        onboardingComplete: false,
        chargesEnabled: false,
        payoutsEnabled: false,
      });
    }

    // Retrieve account details from Stripe
    const account = await stripe.accounts.retrieve(vendor.stripe_account_id);

    const onboardingComplete = account.details_submitted || false;
    const chargesEnabled = account.charges_enabled || false;
    const payoutsEnabled = account.payouts_enabled || false;

    // Update onboarding status in database if it changed
    if (onboardingComplete !== vendor.stripe_onboarding_complete) {
      await supabase
        .from('vendors')
        .update({ stripe_onboarding_complete: onboardingComplete })
        .eq('user_id', user.id);
    }

    return NextResponse.json({
      accountExists: true,
      accountId: vendor.stripe_account_id,
      onboardingComplete,
      chargesEnabled,
      payoutsEnabled,
      requiresAction: !onboardingComplete,
    });
  } catch (error: any) {
    console.error('Account status check error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check account status' },
      { status: 500 }
    );
  }
}
