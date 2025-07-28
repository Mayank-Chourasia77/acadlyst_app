
-- Check current structure and apply only necessary changes
DO $$ 
BEGIN
  -- Only add external_link column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'uploads' AND column_name = 'external_link') THEN
    ALTER TABLE public.uploads ADD COLUMN external_link TEXT;
  END IF;
  
  -- Drop the old link column if it exists and is different from external_link
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'uploads' AND column_name = 'link') 
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'uploads' AND column_name = 'external_link') THEN
    -- Copy data from link to external_link if external_link is empty
    UPDATE public.uploads SET external_link = link WHERE external_link IS NULL AND link IS NOT NULL;
    -- Drop the old link column
    ALTER TABLE public.uploads DROP COLUMN link;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'uploads' AND column_name = 'link') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'uploads' AND column_name = 'external_link') THEN
    -- Rename link to external_link
    ALTER TABLE public.uploads RENAME COLUMN link TO external_link;
  END IF;
END $$;

-- Update votes table to ensure proper constraints
ALTER TABLE public.votes DROP CONSTRAINT IF EXISTS votes_value_check;
ALTER TABLE public.votes ADD CONSTRAINT votes_value_check CHECK (value IN (-1, 1));

-- Create flags table for reporting content
CREATE TABLE IF NOT EXISTS public.flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  upload_id UUID NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, upload_id)
);

-- Enable RLS on flags table
ALTER TABLE public.flags ENABLE ROW LEVEL SECURITY;

-- RLS policies for flags
DROP POLICY IF EXISTS "Users can view flags on uploads" ON public.flags;
DROP POLICY IF EXISTS "Users can create flags" ON public.flags;

CREATE POLICY "Users can view flags on uploads" ON public.flags FOR SELECT USING (true);
CREATE POLICY "Users can create flags" ON public.flags FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update flag count and auto-hide
CREATE OR REPLACE FUNCTION public.update_upload_flags()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.uploads 
    SET flags = flags + 1 
    WHERE id = NEW.upload_id;
    
    -- Auto-hide if 3 or more flags
    UPDATE public.uploads 
    SET is_hidden = true 
    WHERE id = NEW.upload_id AND flags >= 3;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.uploads 
    SET flags = flags - 1 
    WHERE id = OLD.upload_id;
    
    -- Un-hide if flags drop below 3
    UPDATE public.uploads 
    SET is_hidden = false 
    WHERE id = OLD.upload_id AND flags < 3;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for flag updates
DROP TRIGGER IF EXISTS update_upload_flags_trigger ON public.flags;
CREATE TRIGGER update_upload_flags_trigger
  AFTER INSERT OR DELETE ON public.flags
  FOR EACH ROW EXECUTE FUNCTION public.update_upload_flags();

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_flags_upload_id ON public.flags(upload_id);
