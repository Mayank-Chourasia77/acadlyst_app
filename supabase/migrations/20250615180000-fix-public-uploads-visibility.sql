
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;

-- This policy allows anyone to view uploads that are not marked as hidden.
-- This is essential for public profile pages.
CREATE POLICY "Public can view non-hidden uploads"
ON public.uploads
FOR SELECT
USING (is_hidden = false);

-- This policy ensures that users can always view all of their own uploads,
-- including those that might be hidden from the public.
CREATE POLICY "Users can view their own uploads"
ON public.uploads
FOR SELECT
USING (auth.uid() = user_id);
