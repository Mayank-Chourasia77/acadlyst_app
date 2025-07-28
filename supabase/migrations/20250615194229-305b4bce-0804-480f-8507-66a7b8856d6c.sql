
-- This function updates the logic for hiding and un-hiding content based on the number of flags.
-- The threshold for hiding content is increased from 3 to 5 flags.
CREATE OR REPLACE FUNCTION public.update_upload_flags()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.uploads 
    SET flags = flags + 1 
    WHERE id = NEW.upload_id;
    
    -- Auto-hide if 5 or more flags
    UPDATE public.uploads 
    SET is_hidden = true 
    WHERE id = NEW.upload_id AND flags >= 5;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.uploads 
    SET flags = flags - 1 
    WHERE id = OLD.upload_id;
    
    -- Un-hide if flags drop below 5
    UPDATE public.uploads 
    SET is_hidden = false 
    WHERE id = OLD.upload_id AND flags < 5;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
