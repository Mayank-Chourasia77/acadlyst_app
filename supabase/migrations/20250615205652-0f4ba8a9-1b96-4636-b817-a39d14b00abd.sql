
ALTER TABLE public.uploads
ADD COLUMN creator_name TEXT,
ADD COLUMN platform TEXT;

ALTER TABLE public.uploads
ALTER COLUMN university DROP NOT NULL;
