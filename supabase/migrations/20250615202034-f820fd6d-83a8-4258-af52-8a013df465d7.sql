
-- Grant administrators full access to manage uploads.
-- These policies will allow users with the 'admin' role to perform
-- select, update, and delete operations on any record in the 'uploads' table.

-- This policy allows admins to view all uploads, including those that are hidden.
CREATE POLICY "Admins can view all uploads"
ON public.uploads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- This policy allows admins to update any upload, for actions like toggling visibility or editing details.
CREATE POLICY "Admins can update any upload"
ON public.uploads
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- This policy allows admins to delete any upload from the system.
CREATE POLICY "Admins can delete any upload"
ON public.uploads
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

