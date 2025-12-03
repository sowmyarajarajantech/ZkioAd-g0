export interface Profile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  xp_points: number
  total_xp: number
  current_streak: number
  longest_streak: number
  last_activity_date: string | null
  is_profile_public: boolean
  is_public: boolean
  show_streak: boolean
  show_badges: boolean
  created_at: string
  updated_at: string
}

export interface Roadmap {
  id: string
  title: string
  description: string | null
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimated_hours: number | null
  icon: string | null
  color: string | null
  is_official: boolean
  creator_id: string | null
  is_public: boolean
  total_topics: number
  created_at: string
  updated_at: string
}

export interface RoadmapSection {
  id: string
  roadmap_id: string
  title: string
  description: string | null
  order_index: number
  created_at: string
}

export interface Topic {
  id: string
  section_id: string
  roadmap_id: string
  title: string
  description: string | null
  order_index: number
  xp_reward: number
  estimated_minutes: number | null
  created_at: string
}

export interface Resource {
  id: string
  topic_id: string
  title: string
  url: string
  platform: "youtube" | "udemy" | "coursera" | "documentation" | "article" | "other"
  resource_type: "video" | "course" | "article" | "documentation" | "project"
  is_free: boolean
  duration_minutes: number | null
  created_at: string
}

export interface UserRoadmapProgress {
  id: string
  user_id: string
  roadmap_id: string
  started_at: string
  completed_at: string | null
  is_active: boolean
}

export interface TopicCompletion {
  id: string
  user_id: string
  topic_id: string
  roadmap_id: string
  completed_at: string
  xp_earned: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: "streak" | "completion" | "milestone" | "special"
  requirement_type: string
  requirement_value: number
  xp_reward: number
  created_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  badge?: Badge
}

export interface DailyActivity {
  id: string
  user_id: string
  activity_date: string
  topics_completed: number
  xp_earned: number
}

export interface RoadmapWithProgress extends Roadmap {
  sections?: (RoadmapSection & { topics: Topic[] })[]
  user_progress?: UserRoadmapProgress | null
  completed_topics_count?: number
}

export interface LeaderboardEntry {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  xp_points: number
  current_streak: number
  rank?: number
}
