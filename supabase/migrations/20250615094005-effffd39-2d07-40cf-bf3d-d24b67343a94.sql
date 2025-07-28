
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_caller_admin boolean;
BEGIN
  -- First, check if the user calling this function is an admin.
  SELECT is_admin INTO is_caller_admin FROM public.users WHERE id = auth.uid();

  IF NOT is_caller_admin THEN
    RAISE EXCEPTION 'You do not have permission to perform this action.';
  END IF;

  -- If the caller is an admin, proceed to promote the target user.
  UPDATE public.users
  SET is_admin = TRUE
  WHERE id = target_user_id;
END;
$$;
