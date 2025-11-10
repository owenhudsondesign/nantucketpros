-- ==============================================================================
-- BETTER FIX: Drop the admin policy entirely and rely on service role for admin access
-- ==============================================================================

-- Step 1: Drop all existing admin-related policies on users table
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP FUNCTION IF EXISTS is_admin();

-- Step 2: Only allow users to see their own profile
-- Admins will need to use the service role key for admin operations
-- This completely avoids the recursion issue

-- The existing policies should be sufficient:
-- "Users can view own profile" - allows users to see themselves
-- "Users can update own profile" - allows users to update themselves
-- "Users can insert own profile" - allows signup

-- ==============================================================================
-- ALTERNATIVE: If you really need admins to see all users in the client,
-- use auth.jwt() which doesn't query the database
-- ==============================================================================

-- Create a policy that checks the JWT directly (no database query)
CREATE POLICY "Admins can view all users via JWT"
  ON users FOR SELECT
  USING (
    COALESCE(
      (current_setting('request.jwt.claims', true)::json->>'role')::text,
      ''
    ) = 'admin'
  );

-- ==============================================================================
-- After running this, the infinite recursion should be fixed
-- ==============================================================================
