
-- 1. Create an enum type for application roles
-- This defines the possible roles in the application ('admin' and 'user').
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'user');
    END IF;
END$$;

-- 2. Create a table to store user roles
-- This table will link users from Supabase Auth to their specific roles.
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- 3. Enable Row-Level Security on the new user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy for user_roles: Users can view their own roles.
-- Policies for admins to manage roles will be added securely as we build the admin panel.
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- 5. Create a helper function to check a user's role
-- This function will be essential for creating admin-only access policies on other tables.
-- It uses SECURITY DEFINER to safely check roles without running into permissions issues.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- 6. Clean up demo data from the 'groups' table
DELETE FROM public.groups WHERE name LIKE '%(Demo)%';

-- 7. Truncate content tables to ensure a clean slate for production
-- This removes all existing notes, lectures, placements, votes, flags, etc.
TRUNCATE 
    public.uploads, 
    public.group_members, 
    public.votes, 
    public.flags, 
    public.referrals, 
    public.user_badges 
RESTART IDENTITY CASCADE;

