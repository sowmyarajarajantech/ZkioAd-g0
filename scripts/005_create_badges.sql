-- Badge definitions
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  category TEXT CHECK (category IN ('streak', 'completion', 'milestone', 'special')),
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "badges_select_all" ON public.badges FOR SELECT USING (true);

-- User earned badges
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_badges_select_own" ON public.user_badges FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "user_badges_select_public" ON public.user_badges FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND is_profile_public = true));
CREATE POLICY "user_badges_insert_own" ON public.user_badges FOR INSERT WITH CHECK (user_id = auth.uid());

-- Daily activity log for streaks
CREATE TABLE IF NOT EXISTS public.daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  topics_completed INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  UNIQUE(user_id, activity_date)
);

ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activity_select_own" ON public.daily_activity FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "activity_insert_own" ON public.daily_activity FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "activity_update_own" ON public.daily_activity FOR UPDATE USING (user_id = auth.uid());
