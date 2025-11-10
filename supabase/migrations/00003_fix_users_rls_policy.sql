-- Fix infinite recursion in users table RLS policy
-- The issue is that the admin policy queries the users table while checking access to the users table

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Recreate the admin policy using auth.jwt() instead of querying users table
-- This avoids the infinite recursion by checking the JWT claim directly
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Also add a simplified version that checks if there's a users record with admin role
-- but uses a SECURITY DEFINER function to avoid recursion
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

-- Drop and recreate the admin policy using the helper function
DROP POLICY IF EXISTS "Admins can view all users" ON users;

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (is_admin());
