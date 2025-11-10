# NantucketPros Testing Guide

Complete guide for testing the NantucketPros platform locally before deployment.

## Prerequisites

Before testing, you'll need to set up accounts and obtain API keys for:

1. **Supabase** - Database, Auth, and Storage
2. **Stripe** - Payment processing and Connect
3. **Resend** (Optional) - Email notifications

## Setup Steps

### 1. Supabase Setup

1. **Create a Supabase Project**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Click "New Project"
   - Name it "nantucketpros" or similar
   - Choose a strong database password
   - Select a region close to your users

2. **Run the Database Migration**
   - In Supabase Dashboard, go to SQL Editor
   - Copy the entire contents of `supabase/migrations/00001_initial_schema.sql`
   - Paste into a new query and click "Run"
   - Verify all tables were created (check the Table Editor)

3. **Configure Authentication**
   - Go to Authentication > Settings
   - Under "Site URL", add `http://localhost:3000`
   - Under "Redirect URLs", add `http://localhost:3000/auth/callback`
   - Disable email confirmations for testing (or configure email provider)
   - Save changes

4. **Get API Keys**
   - Go to Settings > API
   - Copy the following:
     - Project URL (looks like `https://xxxxx.supabase.co`)
     - `anon` public key
     - `service_role` secret key (keep this secure!)

### 2. Stripe Setup

1. **Create a Stripe Account**
   - Go to [stripe.com](https://stripe.com)
   - Sign up for a new account
   - Complete business verification (can skip for testing)

2. **Get Test API Keys**
   - Go to Developers > API Keys
   - Copy the "Publishable key" (starts with `pk_test_`)
   - Reveal and copy the "Secret key" (starts with `sk_test_`)

3. **Enable Stripe Connect**
   - Go to Connect > Get Started
   - Select "Platform or marketplace"
   - Choose "Express" for connected account type
   - Complete the onboarding

4. **Set Up Webhook**
   - For local testing, use Stripe CLI:
     ```bash
     # Install Stripe CLI
     brew install stripe/stripe-brew/stripe

     # Login to Stripe
     stripe login

     # Forward webhooks to local server
     stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
     ```
   - The CLI will output a webhook signing secret (starts with `whsec_`)
   - For production, create webhook in Dashboard > Developers > Webhooks

### 3. Environment Variables

1. **Copy the example file**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your values**
   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

   # Stripe
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...  # From Stripe CLI

   # App
   NEXT_PUBLIC_SITE_URL=http://localhost:3000

   # Email (optional for initial testing)
   RESEND_API_KEY=re_...
   RESEND_FROM_EMAIL=noreply@nantucketpros.com

   # Platform
   PLATFORM_COMMISSION_RATE=0.15
   ```

### 4. Install and Run

```bash
# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing Workflows

### Test 1: Homeowner Registration & Vendor Discovery

1. **Sign Up as Homeowner**
   - Go to http://localhost:3000
   - Click "Get Started"
   - Enter email and select "Homeowner"
   - Check your email for magic link
   - Click link to complete signup
   - You should be redirected to `/homeowner/dashboard`

2. **Browse Vendors**
   - Click "Browse Vendors" or go to `/vendors`
   - You should see "No vendors found" (normal - none verified yet)

### Test 2: Vendor Registration & Profile Setup

1. **Sign Up as Vendor**
   - Open an incognito/private window
   - Go to http://localhost:3000/signup
   - Enter a different email and select "Service vendor"
   - Complete magic link authentication
   - You should be redirected to `/vendor/dashboard`

2. **Create Vendor Profile**
   - Click "Complete Profile Setup" or go to `/vendor/profile`
   - Fill in all required fields:
     - Business name: "Nantucket Plumbing Co"
     - Category: "Plumbing"
     - Description: (minimum 50 characters)
     - Services: Add multiple services
     - Hourly rate: $75 (optional)
     - Service area: Select "Town" and "All of Nantucket"
     - License: "MA-12345" (optional)
   - Click "Create Profile"
   - You should be redirected to Stripe onboarding

3. **Complete Stripe Connect Onboarding**
   - You'll be redirected to Stripe
   - Use Stripe's test mode data:
     - Business type: Individual
     - Email: Use the same email as your vendor account
     - Phone: Any valid format
     - SSN: Use test SSN `000-00-0000`
     - DOB: Any past date
     - Address: Any valid US address
     - Bank account: Use test routing `110000000` and account `000123456789`
   - Complete all steps
   - You should be redirected back to `/vendor/onboarding/complete`
   - Verify "Onboarding Complete" message

4. **Verify Vendor** (As Admin)
   - You'll need to manually update the database for testing
   - In Supabase Dashboard > Table Editor > vendors
   - Find your vendor and set `is_verified` to `true`
   - Now the vendor will appear in public directory

### Test 3: Booking Request Flow

1. **Request a Booking** (As Homeowner)
   - Log in as the homeowner
   - Go to `/vendors` and you should now see the verified vendor
   - Click "View Profile" on the vendor
   - Click "Request Booking"
   - Fill in booking details:
     - Service: Select one of the vendor's services
     - Description: Detailed description (minimum 20 characters)
     - Preferred Date: Pick a future date
   - Click "Send Booking Request"
   - Verify success message

2. **View Booking Request** (As Vendor)
   - Switch to vendor account (incognito window)
   - Go to `/vendor/bookings`
   - You should see the pending booking request
   - Review the details

3. **Accept Booking** (As Vendor)
   - Click "Accept & Set Price"
   - Enter price: $150
   - Note the platform fee calculation (15% = $22.50)
   - Click "Accept Booking"
   - Verify success message
   - Booking status should change to "Confirmed"

### Test 4: Payment Processing

1. **Complete Payment** (As Homeowner)
   - Switch back to homeowner account
   - Go to `/homeowner/bookings`
   - You should see the confirmed booking with "Pay Now" button
   - Click "Pay Now"
   - You'll be redirected to the checkout page
   - Fill in Stripe test card details:
     - Card: `4242 4242 4242 4242`
     - Expiry: Any future date (e.g., `12/34`)
     - CVC: Any 3 digits (e.g., `123`)
     - ZIP: Any 5 digits (e.g., `12345`)
   - Click "Pay $150.00"
   - Wait for payment processing
   - You should be redirected to success page

2. **Verify Payment** (As Vendor)
   - Switch to vendor account
   - Go to `/vendor/bookings`
   - The booking should show "Payment received!"
   - You should see "Mark as Completed" button

### Test 5: Complete Booking

1. **Mark as Completed** (As Vendor)
   - Click "Mark as Completed"
   - Confirm the action
   - Booking status changes to "Completed"
   - Note about funds transfer within 2-7 days

2. **Verify in Stripe Dashboard**
   - Go to Stripe Dashboard > Payments
   - You should see the $150 payment
   - Check the application fee ($22.50 = 15%)
   - Go to Connect > Accounts
   - View your vendor account and verify pending transfer

### Test 6: Webhook Testing

With Stripe CLI running (`stripe listen --forward-to http://localhost:3000/api/webhooks/stripe`):

1. Monitor webhook events in the terminal
2. Complete a payment (Test 4 above)
3. You should see events like:
   - `payment_intent.created`
   - `payment_intent.succeeded`
   - `charge.succeeded`
4. Check your application logs for webhook handling

## Test Card Numbers

Stripe provides test cards for various scenarios:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`
- **Insufficient Funds**: `4000 0000 0000 9995`

See [Stripe Test Cards](https://stripe.com/docs/testing#cards) for more.

## Troubleshooting

### Authentication Issues

**Problem**: Magic link not working
- **Solution**: Check Supabase auth settings, ensure Site URL is correct
- **Alternative**: Disable email confirmation in Supabase auth settings for testing

**Problem**: Redirected to wrong dashboard
- **Solution**: Check user role in Supabase `users` table

### Stripe Issues

**Problem**: Webhook not receiving events
- **Solution**: Ensure Stripe CLI is running and forwarding to correct URL
- **Check**: Run `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe`

**Problem**: Payment fails
- **Solution**: Check Stripe logs in Dashboard > Developers > Logs
- **Verify**: Correct publishable and secret keys in `.env.local`

**Problem**: Vendor can't complete onboarding
- **Solution**: Use test data, don't use real SSN or bank info
- **Test SSN**: `000-00-0000`
- **Test Routing**: `110000000`

### Database Issues

**Problem**: RLS policy blocking queries
- **Solution**: Check Supabase logs in Dashboard > Database > Logs
- **Verify**: User is authenticated and has correct role

**Problem**: Tables not found
- **Solution**: Re-run migration SQL script
- **Check**: Table Editor to ensure all tables exist

## Manual Database Updates (for Testing)

Sometimes you need to manually update data for testing:

### Verify a Vendor
```sql
UPDATE vendors
SET is_verified = true
WHERE user_id = 'xxx-xxx-xxx';
```

### Change User Role
```sql
UPDATE users
SET role = 'admin'
WHERE id = 'xxx-xxx-xxx';
```

### View All Bookings
```sql
SELECT
  b.*,
  v.business_name,
  u.email as customer_email
FROM bookings b
JOIN vendors v ON b.vendor_id = v.id
JOIN users u ON b.customer_id = u.id
ORDER BY b.created_at DESC;
```

## Checklist Before Production

- [ ] Update all environment variables with production values
- [ ] Set up production Stripe webhook endpoint
- [ ] Configure Resend or email provider
- [ ] Enable Supabase email confirmations
- [ ] Review and test all RLS policies
- [ ] Set up error monitoring (Sentry)
- [ ] Add analytics (PostHog/Plausible)
- [ ] Test on mobile devices
- [ ] Load test with multiple concurrent users
- [ ] Review Stripe Connect compliance requirements
- [ ] Create admin account and test admin panel
- [ ] Test dispute/refund flows
- [ ] Back up database before going live

## Support

If you encounter issues:
1. Check application logs (`npm run dev` output)
2. Check Supabase logs (Dashboard > Database > Logs)
3. Check Stripe logs (Dashboard > Developers > Logs)
4. Verify all environment variables are set correctly
5. Ensure Stripe CLI is running for local webhook testing

---

Happy Testing! 🚀
