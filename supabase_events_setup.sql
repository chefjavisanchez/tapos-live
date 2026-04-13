-- 1. Create the EVENTS table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    date_text TEXT,
    time_text TEXT,
    address TEXT,
    slug TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add event_id to LEADS table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id) ON DELETE SET NULL;

-- 3. Enable RLS (Row Level Security)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Everyone can view active events
CREATE POLICY "Public Events are viewable by everyone" 
ON public.events FOR SELECT 
USING (is_active = true OR (auth.uid() IS NOT NULL AND auth.uid() = owner_id));

-- Only owners can insert/update/delete their own events
CREATE POLICY "Users can create their own events" 
ON public.events FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own events" 
ON public.events FOR UPDATE 
USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own events" 
ON public.events FOR DELETE 
USING (auth.uid() = owner_id);

-- 5. Add event_id to CARDS table (to track which event a passport card belongs to)
ALTER TABLE public.cards
ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id) ON DELETE SET NULL;
