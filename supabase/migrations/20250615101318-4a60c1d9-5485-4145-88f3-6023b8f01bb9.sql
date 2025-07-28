
-- Create an enum type for placement difficulty
CREATE TYPE public.upload_difficulty AS ENUM ('Easy', 'Medium', 'Hard');

-- Add new columns to the uploads table for placement tagging
ALTER TABLE public.uploads
ADD COLUMN company_name TEXT,
ADD COLUMN company_role TEXT,
ADD COLUMN difficulty public.upload_difficulty;
