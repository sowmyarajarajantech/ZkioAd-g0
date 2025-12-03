-- Community features: Following, sharing, and peer visibility

-- User follows table
CREATE TABLE IF NOT EXISTS user_follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Roadmap likes/saves
CREATE TABLE IF NOT EXISTS roadmap_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, roadmap_id)
);

-- Activity feed for community
CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'completed_topic', 'earned_badge', 'completed_roadmap', 'created_roadmap', 'streak_milestone'
  metadata JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view follows" ON user_follows FOR SELECT USING (true);
CREATE POLICY "Users can manage their follows" ON user_follows FOR ALL USING (auth.uid() = follower_id);

CREATE POLICY "Users can view saves" ON roadmap_saves FOR SELECT USING (true);
CREATE POLICY "Users can manage their saves" ON roadmap_saves FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view public activities" ON activity_feed FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can manage their activities" ON activity_feed FOR ALL USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_activity_feed_user ON activity_feed(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON activity_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);
