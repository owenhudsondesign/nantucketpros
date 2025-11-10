-- ==============================================================================
-- IMPORTANT: Run this SQL in your Supabase SQL Editor to fix the infinite recursion error
-- ==============================================================================

-- Step 1: Create a helper function that uses SECURITY DEFINER to avoid recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- Step 2: Drop the problematic admin policy
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Step 3: Recreate the admin policy using the helper function
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (is_admin());

-- ==============================================================================
-- After running this, your profile page should load correctly!
-- ==============================================================================
