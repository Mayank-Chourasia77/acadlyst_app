
-- 1. Create the 'groups' table
CREATE TABLE public.groups (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    university text,
    telegram_link text,
    whatsapp_link text,
    is_official boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 2. Create the 'group_members' table
CREATE TABLE public.group_members (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT group_members_user_group_key UNIQUE (user_id, group_id)
);

-- 3. Enable RLS for the new tables
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for 'groups' (readable by everyone)
CREATE POLICY "Public can view all groups" ON public.groups FOR SELECT USING (true);

-- 5. RLS Policies for 'group_members' (users can join and see their memberships)
CREATE POLICY "Users can view their own memberships" ON public.group_members FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can join groups" ON public.group_members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Insert Demo Data
INSERT INTO public.groups (name, description, telegram_link, is_official, whatsapp_link) VALUES
('DSA Wizards (Demo)', 'A demo group for practicing Data Structures & Algorithms.', 'https://t.me/demo', true, null),
('CAT 2025 Prep (Demo)', 'A demo group for CAT 2025 aspirants to prepare together.', 'https://t.me/demo', false, 'https://chat.whatsapp.com/demo'),
('UPSC Masters (Demo)', 'Demo group for UPSC Civil Services Examination preparation.', null, true, 'https://chat.whatsapp.com/demo');

-- 7. Create a function to get all groups a user has joined
CREATE OR REPLACE FUNCTION get_user_joined_groups(p_user_id uuid)
RETURNS TABLE(
    id uuid,
    name text,
    description text,
    university text,
    telegram_link text,
    whatsapp_link text,
    is_official boolean,
    created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT g.id, g.name, g.description, g.university, g.telegram_link, g.whatsapp_link, g.is_official, g.created_at
  FROM public.groups g
  JOIN public.group_members gm ON g.id = gm.group_id
  WHERE gm.user_id = p_user_id
  ORDER BY gm.joined_at DESC;
END;
$$;
