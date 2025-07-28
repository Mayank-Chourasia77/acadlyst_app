
-- Add 'rising_star' to the badge_type enum
ALTER TYPE public.badge_type ADD VALUE IF NOT EXISTS 'rising_star';

-- Update the function to award the new badge
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
    -- Rising Star badge for 10 uploads
    IF NOT EXISTS (
      SELECT 1 FROM public.user_badges
      WHERE user_id = user_uuid AND badge_type = 'rising_star'
    ) THEN
      INSERT INTO public.user_badges (user_id, badge_type, description, icon)
      VALUES (user_uuid, 'rising_star', '10+ uploads', '🌟');
    END IF;

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
