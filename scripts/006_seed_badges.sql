-- Insert default badges
INSERT INTO public.badges (name, description, icon, color, category, requirement_type, requirement_value, xp_reward) VALUES
-- Streak badges
('First Flame', 'Complete your first day of learning', 'flame', 'orange', 'streak', 'streak_days', 1, 10),
('Week Warrior', 'Maintain a 7-day streak', 'fire', 'orange', 'streak', 'streak_days', 7, 50),
('Fortnight Focus', 'Maintain a 14-day streak', 'zap', 'yellow', 'streak', 'streak_days', 14, 100),
('Month Master', 'Maintain a 30-day streak', 'trophy', 'gold', 'streak', 'streak_days', 30, 250),
('Century Champion', 'Maintain a 100-day streak', 'crown', 'purple', 'streak', 'streak_days', 100, 1000),

-- Completion badges
('First Steps', 'Complete your first topic', 'footprints', 'green', 'completion', 'topics_completed', 1, 10),
('Getting Started', 'Complete 10 topics', 'rocket', 'blue', 'completion', 'topics_completed', 10, 50),
('Rising Star', 'Complete 50 topics', 'star', 'yellow', 'completion', 'topics_completed', 50, 150),
('Knowledge Seeker', 'Complete 100 topics', 'book-open', 'indigo', 'completion', 'topics_completed', 100, 300),
('Master Learner', 'Complete 500 topics', 'graduation-cap', 'purple', 'completion', 'topics_completed', 500, 1000),

-- Milestone badges
('Pathfinder', 'Complete your first roadmap', 'map', 'teal', 'milestone', 'roadmaps_completed', 1, 100),
('Explorer', 'Complete 3 roadmaps', 'compass', 'cyan', 'milestone', 'roadmaps_completed', 3, 300),
('Polymath', 'Complete 5 roadmaps', 'brain', 'pink', 'milestone', 'roadmaps_completed', 5, 500),

-- XP badges
('Rookie', 'Earn 100 XP', 'award', 'bronze', 'milestone', 'total_xp', 100, 0),
('Apprentice', 'Earn 500 XP', 'medal', 'silver', 'milestone', 'total_xp', 500, 0),
('Expert', 'Earn 2000 XP', 'trophy', 'gold', 'milestone', 'total_xp', 2000, 0),
('Legend', 'Earn 10000 XP', 'crown', 'diamond', 'milestone', 'total_xp', 10000, 0)
ON CONFLICT (name) DO NOTHING;
