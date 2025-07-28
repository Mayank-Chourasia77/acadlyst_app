
-- Create enum for badge types
CREATE TYPE badge_type AS ENUM (
  'contributor', 'veteran', 'expert', 'legend', 'champion',
  'upvote_hunter', 'consistent_creator', 'lecture_master', 'referral_king'
);

-- Update user_badges table to use the new enum and add more details
ALTER TABLE public.user_badges DROP CONSTRAINT IF EXISTS user_badges_badge_slug_check;
ALTER TABLE public.user_badges ALTER COLUMN badge_slug TYPE badge_type USING badge_slug::badge_type;
ALTER TABLE public.user_badges RENAME COLUMN badge_slug TO badge_type;
ALTER TABLE public.user_badges ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.user_badges ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '🏆';

-- Add computed columns to users table for leaderboard
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS total_uploads INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS total_votes INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS upload_streak INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_upload_date DATE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Create function to update user stats
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total uploads and votes
  UPDATE public.users 
  SET 
    total_uploads = (
      SELECT COUNT(*) FROM public.uploads 
      WHERE user_id = NEW.user_id AND NOT is_hidden
    ),
    total_votes = (
      SELECT COALESCE(SUM(votes), 0) FROM public.uploads 
      WHERE user_id = NEW.user_id AND NOT is_hidden
    )
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update user stats when uploads change
DROP TRIGGER IF EXISTS update_user_stats_trigger ON public.uploads;
CREATE TRIGGER update_user_stats_trigger
  AFTER INSERT OR UPDATE ON public.uploads
  FOR EACH ROW EXECUTE FUNCTION public.update_user_stats();

-- Function to check and award badges
CREATE OR REPLACE FUNCTION public.check_and_award_badges(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  user_uploads INTEGER;
  user_votes INTEGER;
  lecture_count INTEGER;
  referral_count INTEGER;
BEGIN
  -- Get user stats
  SELECT total_uploads, total_votes INTO user_uploads, user_votes
  FROM public.users WHERE id = user_uuid;
  
  -- Count specific stats
  SELECT COUNT(*) INTO lecture_count 
  FROM public.uploads 
  WHERE user_id = user_uuid AND type = 'lecture' AND NOT is_hidden;
  
  SELECT COUNT(*) INTO referral_count 
  FROM public.referrals 
  WHERE referrer_id = user_uuid;
  
  -- Only award badges if user has 10+ uploads
  IF user_uploads >= 10 THEN
    -- Upload-based badges
    IF user_uploads >= 50 AND NOT EXISTS (
      SELECT 1 FROM public.user_badges 
      WHERE user_id = user_uuid AND badge_type = 'contributor'
    ) THEN
      INSERT INTO public.user_badges (user_id, badge_type, description, icon)
      VALUES (user_uuid, 'contributor', '50+ uploads', '📚');
    END IF;
    
    IF user_uploads >= 100 AND NOT EXISTS (
      SELECT 1 FROM public.user_badges 
      WHERE user_id = user_uuid AND badge_type = 'veteran'
    ) THEN
      INSERT INTO public.user_badges (user_id, badge_type, description, icon)
      VALUES (user_uuid, 'veteran', '100+ uploads', '🎖️');
    END IF;
    
    -- Vote-based badges
    IF user_votes >= 500 AND NOT EXISTS (
      SELECT 1 FROM public.user_badges 
      WHERE user_id = user_uuid AND badge_type = 'upvote_hunter'
    ) THEN
      INSERT INTO public.user_badges (user_id, badge_type, description, icon)
      VALUES (user_uuid, 'upvote_hunter', '500+ total votes', '⬆️');
    END IF;
    
    -- Lecture master badge
    IF lecture_count >= 20 AND NOT EXISTS (
      SELECT 1 FROM public.user_badges 
      WHERE user_id = user_uuid AND badge_type = 'lecture_master'
    ) THEN
      INSERT INTO public.user_badges (user_id, badge_type, description, icon)
      VALUES (user_uuid, 'lecture_master', '20+ lectures', '🎓');
    END IF;
    
    -- Referral king badge
    IF referral_count >= 5 AND NOT EXISTS (
      SELECT 1 FROM public.user_badges 
      WHERE user_id = user_uuid AND badge_type = 'referral_king'
    ) THEN
      INSERT INTO public.user_badges (user_id, badge_type, description, icon)
      VALUES (user_uuid, 'referral_king', '5+ referrals', '👑');
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to check badges after user stats update
CREATE OR REPLACE FUNCTION public.trigger_badge_check()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.check_and_award_badges(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_badges_trigger ON public.users;
CREATE TRIGGER check_badges_trigger
  AFTER UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.trigger_badge_check();

-- Function to check UPI unlock eligibility
CREATE OR REPLACE FUNCTION public.can_unlock_upi(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_uploads INTEGER;
  user_votes INTEGER;
BEGIN
  SELECT total_uploads, total_votes INTO user_uploads, user_votes
  FROM public.users WHERE id = user_uuid;
  
  RETURN (user_uploads >= 10 AND user_votes >= 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing users with usernames (using name field initially)
UPDATE public.users 
SET username = LOWER(REPLACE(name, ' ', '_')) || '_' || SUBSTRING(id::text, 1, 8)
WHERE username IS NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_total_votes ON public.users(total_votes DESC);
CREATE INDEX IF NOT EXISTS idx_users_total_uploads ON public.users(total_uploads DESC);
CREATE INDEX IF NOT EXISTS idx_users_badge_level ON public.users(badge_level DESC);
