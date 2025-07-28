
-- 1. Add 'is_admin' column to the 'users' table
-- This column will be used to identify administrators.
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Update the 'has_role' function to use the new 'is_admin' column for admin checks
-- This function is called by the useAdmin hook to check for admin privileges.
-- We are changing it to check the 'is_admin' flag on the 'users' table
-- when the role is 'admin', instead of the 'user_roles' table.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _role = 'admin' THEN
    -- For 'admin' role, check the 'is_admin' flag on the users table.
    RETURN EXISTS (SELECT 1 FROM public.users WHERE id = _user_id AND is_admin = TRUE);
  ELSE
    -- For other roles, continue checking the user_roles table.
    -- This maintains flexibility for future role-based logic.
    RETURN EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = _user_id AND role = _role
    );
  END IF;
END;
$$;
