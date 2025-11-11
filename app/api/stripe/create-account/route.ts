import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    RATE_LIMITS.STRIPE,
    async () => {
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

        // Get vendor profile
        const { data: vendor, error: vendorError } = await supabase
          .from('vendors')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (vendorError || !vendor) {
          return NextResponse.json(
            { error: 'Vendor profile not found. Please create your profile first.' },
            { status: 404 }
          );
        }

        const vendorData = vendor as any;

        // Check if vendor already has a Stripe account
        if (vendorData.stripe_account_id) {
          // Return existing account ID
          return NextResponse.json({
            accountId: vendorData.stripe_account_id,
            exists: true,
          });
        }

        // Get user profile for email
        const { data: userProfile } = await supabase
          .from('users')
          .select('email, full_name')
          .eq('id', user.id)
          .single();

        const userProfileData = userProfile as any;

        // Create Stripe Connect Express account
        const account = await stripe.accounts.create({
          type: 'express',
          country: 'US',
          email: userProfileData?.email,
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          business_type: 'individual',
          business_profile: {
            mcc: '1799', // Special Trade Contractors
            name: vendorData.business_name,
            product_description: vendorData.description,
          },
        });

        // Save Stripe account ID to vendor profile
        const query = supabase.from('vendors');
        // @ts-expect-error - Supabase type inference issue with update
        const { error: updateError } = await query.update({ stripe_account_id: account.id }).eq('id', vendorData.id);

        if (updateError) {
          console.error('Failed to save Stripe account ID:', updateError);
          // Note: We don't fail the request, as the account was created successfully
        }

        return NextResponse.json({
          accountId: account.id,
          exists: false,
        });
      } catch (error: any) {
        console.error('Stripe account creation error:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to create Stripe account' },
          { status: 500 }
        );
      }
    }
  );
}
