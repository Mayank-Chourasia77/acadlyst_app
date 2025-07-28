
-- Create a new ENUM type for different kinds of notifications
CREATE TYPE public.notification_type AS ENUM (
    'new_vote',
    'content_flagged',
    'new_badge'
);

-- Create the notifications table
CREATE TABLE public.notifications (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type public.notification_type NOT NULL,
    data jsonb,
    is_read boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add an index on user_id for faster queries
CREATE INDEX ON public.notifications (user_id);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own notifications (e.g., to mark as read)
CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);


-- Create a function to send a notification when an upload gets a new vote
CREATE OR REPLACE FUNCTION public.handle_new_vote_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  upload_owner_id uuid;
  upload_title text;
BEGIN
  -- Get the owner and title of the upload that was voted on
  SELECT user_id, title INTO upload_owner_id, upload_title FROM public.uploads WHERE id = NEW.upload_id;

  -- Do not send a notification if a user votes on their own content
  IF upload_owner_id != NEW.user_id THEN
    -- Insert a notification for the upload owner
    INSERT INTO public.notifications (user_id, type, data)
    VALUES (
      upload_owner_id,
      'new_vote',
      jsonb_build_object(
        'upload_id', NEW.upload_id,
        'upload_title', upload_title,
        'voter_id', NEW.user_id
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create a trigger that executes the function after a new vote is inserted
CREATE TRIGGER on_new_vote
AFTER INSERT ON public.votes
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_vote_notification();
