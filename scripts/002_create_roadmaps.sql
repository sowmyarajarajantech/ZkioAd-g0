-- Create roadmaps table (preloaded and custom)
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_hours INTEGER,
  icon TEXT,
  color TEXT,
  is_official BOOLEAN DEFAULT false,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT true,
  total_topics INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;

-- RLS policies for roadmaps
CREATE POLICY "roadmaps_select_public" ON public.roadmaps FOR SELECT USING (is_public = true OR is_official = true);
CREATE POLICY "roadmaps_select_own" ON public.roadmaps FOR SELECT USING (creator_id = auth.uid());
CREATE POLICY "roadmaps_insert_own" ON public.roadmaps FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "roadmaps_update_own" ON public.roadmaps FOR UPDATE USING (creator_id = auth.uid() AND is_official = false);
CREATE POLICY "roadmaps_delete_own" ON public.roadmaps FOR DELETE USING (creator_id = auth.uid() AND is_official = false);

-- Create sections within roadmaps
CREATE TABLE IF NOT EXISTS public.roadmap_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.roadmap_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sections_select_all" ON public.roadmap_sections FOR SELECT USING (true);
CREATE POLICY "sections_insert_own" ON public.roadmap_sections FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.roadmaps WHERE id = roadmap_id AND (creator_id = auth.uid() OR is_official = false)));
CREATE POLICY "sections_update_own" ON public.roadmap_sections FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.roadmaps WHERE id = roadmap_id AND creator_id = auth.uid()));
CREATE POLICY "sections_delete_own" ON public.roadmap_sections FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.roadmaps WHERE id = roadmap_id AND creator_id = auth.uid()));

-- Create topics within sections
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.roadmap_sections(id) ON DELETE CASCADE,
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 10,
  estimated_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "topics_select_all" ON public.topics FOR SELECT USING (true);
CREATE POLICY "topics_insert_own" ON public.topics FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.roadmaps WHERE id = roadmap_id AND creator_id = auth.uid()));
CREATE POLICY "topics_update_own" ON public.topics FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.roadmaps WHERE id = roadmap_id AND creator_id = auth.uid()));
CREATE POLICY "topics_delete_own" ON public.topics FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.roadmaps WHERE id = roadmap_id AND creator_id = auth.uid()));
