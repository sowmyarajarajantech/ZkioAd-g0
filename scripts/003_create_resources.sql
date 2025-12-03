-- Create resources linked to topics
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('youtube', 'udemy', 'coursera', 'documentation', 'article', 'other')),
  resource_type TEXT CHECK (resource_type IN ('video', 'course', 'article', 'documentation', 'project')),
  is_free BOOLEAN DEFAULT true,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "resources_select_all" ON public.resources FOR SELECT USING (true);
CREATE POLICY "resources_insert_own" ON public.resources FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.topics t 
    JOIN public.roadmaps r ON t.roadmap_id = r.id 
    WHERE t.id = topic_id AND r.creator_id = auth.uid()
  ));
