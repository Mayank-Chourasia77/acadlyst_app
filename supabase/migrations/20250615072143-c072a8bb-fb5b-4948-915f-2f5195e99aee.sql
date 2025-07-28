
-- Create custom types
CREATE TYPE upload_type AS ENUM ('note', 'lecture', 'placement');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  badge_level INTEGER DEFAULT 0,
  upi_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Uploads table
CREATE TABLE public.uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type upload_type NOT NULL,
  link TEXT NOT NULL UNIQUE, -- Prevents duplicate submissions
  course TEXT NOT NULL,
  subject TEXT NOT NULL,
  university TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  flags INTEGER DEFAULT 0,
  is_hidden BOOLEAN DEFAULT false, -- Auto-hide at 3+ flags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Votes table
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  upload_id UUID NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
  value INTEGER NOT NULL CHECK (value IN (-1, 1)), -- upvote or downvote
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, upload_id) -- One vote per user per upload
);

-- User badges table
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  badge_slug TEXT NOT NULL,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, badge_slug) -- One badge per user
);

-- Referrals table
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(referred_id) -- Each user can only be referred once
);

-- AI queries table (for caching)
CREATE TABLE public.ai_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  thumbs_up BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_queries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for uploads table
CREATE POLICY "Anyone can view non-hidden uploads" ON public.uploads FOR SELECT USING (NOT is_hidden);
CREATE POLICY "Users can insert own uploads" ON public.uploads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own uploads" ON public.uploads FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for votes table
CREATE POLICY "Anyone can view votes" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Users can insert own votes" ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes" ON public.votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON public.votes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_badges table
CREATE POLICY "Anyone can view badges" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Only system can insert badges" ON public.user_badges FOR INSERT WITH CHECK (false); -- Will be handled by functions

-- RLS Policies for referrals table
CREATE POLICY "Users can view referrals they're involved in" ON public.referrals 
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "Users can insert referrals they make" ON public.referrals 
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- RLS Policies for ai_queries table
CREATE POLICY "Users can view own AI queries" ON public.ai_queries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own AI queries" ON public.ai_queries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own AI queries" ON public.ai_queries FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_uploads_type ON public.uploads(type);
CREATE INDEX idx_uploads_course ON public.uploads(course);
CREATE INDEX idx_uploads_subject ON public.uploads(subject);
CREATE INDEX idx_uploads_university ON public.uploads(university);
CREATE INDEX idx_uploads_votes ON public.uploads(votes DESC);
CREATE INDEX idx_uploads_created_at ON public.uploads(created_at DESC);
CREATE INDEX idx_votes_upload_id ON public.votes(upload_id);
CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update vote count on uploads
CREATE OR REPLACE FUNCTION public.update_upload_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.uploads 
    SET votes = votes + NEW.value 
    WHERE id = NEW.upload_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.uploads 
    SET votes = votes + (NEW.value - OLD.value)
    WHERE id = NEW.upload_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.uploads 
    SET votes = votes - OLD.value 
    WHERE id = OLD.upload_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update vote counts
CREATE TRIGGER update_upload_votes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.update_upload_votes();

-- Function to auto-hide uploads with 3+ flags
CREATE OR REPLACE FUNCTION public.check_upload_flags()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.flags >= 3 AND NOT NEW.is_hidden THEN
    NEW.is_hidden = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-hide flagged uploads
CREATE TRIGGER check_upload_flags_trigger
  BEFORE UPDATE ON public.uploads
  FOR EACH ROW EXECUTE FUNCTION public.check_upload_flags();
