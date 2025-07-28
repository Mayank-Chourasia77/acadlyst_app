-- Create storage bucket for uploaded note files
INSERT INTO storage.buckets (id, name, public) VALUES ('notes', 'notes', true);

-- Create storage policies for note uploads
CREATE POLICY "Users can upload their own notes"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own notes"
ON storage.objects
FOR SELECT
USING (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own notes"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own notes"
ON storage.objects
FOR DELETE
USING (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add a new column to uploads table to store file path for uploaded files
ALTER TABLE public.uploads ADD COLUMN file_path TEXT;

-- Make external_link optional when file_path is provided
ALTER TABLE public.uploads ADD CONSTRAINT check_link_or_file 
CHECK (
  (external_link IS NOT NULL AND file_path IS NULL) OR 
  (external_link IS NULL AND file_path IS NOT NULL)
);