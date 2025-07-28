
ALTER TABLE public.users
ADD COLUMN is_upi_public BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.users.is_upi_public IS 'Controls whether the UPI link is visible on public profiles.';
