
-- Create chat_history table
CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create chat_feedback table
CREATE TABLE IF NOT EXISTS public.chat_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id UUID REFERENCES public.chat_history(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    feedback TEXT NOT NULL CHECK (feedback IN ('up', 'down')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(chat_id, user_id)
);

-- Enable RLS
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_feedback ENABLE ROW LEVEL SECURITY;

-- RLS policies for chat_history
CREATE POLICY "Users can view their own chat history" ON public.chat_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat history" ON public.chat_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for chat_feedback
CREATE POLICY "Users can view their own feedback" ON public.chat_feedback
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback" ON public.chat_feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback" ON public.chat_feedback
    FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_chat_history_user_id ON public.chat_history(user_id);
CREATE INDEX idx_chat_history_created_at ON public.chat_history(created_at);
CREATE INDEX idx_chat_feedback_chat_id ON public.chat_feedback(chat_id);
CREATE INDEX idx_chat_feedback_user_id ON public.chat_feedback(user_id);
