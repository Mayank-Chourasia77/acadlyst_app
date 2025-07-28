
-- This policy allows admins to create new groups.
CREATE POLICY "Admins can create groups"
ON public.groups
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- This policy allows admins to update existing groups.
CREATE POLICY "Admins can update groups"
ON public.groups
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- This policy allows admins to delete groups.
CREATE POLICY "Admins can delete groups"
ON public.groups
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
