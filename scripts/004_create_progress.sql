-- User progress on roadmaps
CREATE TABLE IF NOT EXISTS public.user_roadmap_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, roadmap_id)
);

ALTER TABLE public.user_roadmap_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "progress_select_own" ON public.user_roadmap_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "progress_select_public" ON public.user_roadmap_progress FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND is_profile_public = true));
CREATE POLICY "progress_insert_own" ON public.user_roadmap_progress FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "progress_update_own" ON public.user_roadmap_progress FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "progress_delete_own" ON public.user_roadmap_progress FOR DELETE USING (user_id = auth.uid());

-- Topic completion tracking
CREATE TABLE IF NOT EXISTS public.topic_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  xp_earned INTEGER DEFAULT 0,
  UNIQUE(user_id, topic_id)
);

ALTER TABLE public.topic_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "completions_select_own" ON public.topic_completions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "completions_select_public" ON public.topic_completions FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND is_profile_public = true));
CREATE POLICY "completions_insert_own" ON public.topic_completions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "completions_delete_own" ON public.topic_completions FOR DELETE USING (user_id = auth.uid());
