-- ============================================
-- SNAPSTUDY DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read all profiles
CREATE POLICY "Users can view all profiles"
  ON users FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- REELS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  video_url TEXT NOT NULL,
  thumbnail_url TEXT DEFAULT '',
  duration INTEGER DEFAULT 60, -- in seconds
  tags TEXT[] DEFAULT '{}',
  micro_course_id UUID, -- nullable, references micro_courses
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_reels_creator ON reels(creator_id);
CREATE INDEX idx_reels_created_at ON reels(created_at DESC);
CREATE INDEX idx_reels_tags ON reels USING GIN(tags);
CREATE INDEX idx_reels_micro_course ON reels(micro_course_id);

-- Enable RLS
ALTER TABLE reels ENABLE ROW LEVEL SECURITY;

-- Anyone can view reels
CREATE POLICY "Anyone can view reels"
  ON reels FOR SELECT
  USING (true);

-- Authenticated users can create reels
CREATE POLICY "Authenticated users can create reels"
  ON reels FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Creators can update their own reels
CREATE POLICY "Creators can update own reels"
  ON reels FOR UPDATE
  USING (auth.uid() = creator_id);

-- Creators can delete their own reels
CREATE POLICY "Creators can delete own reels"
  ON reels FOR DELETE
  USING (auth.uid() = creator_id);

-- ============================================
-- MICRO COURSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS micro_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_micro_courses_creator ON micro_courses(creator_id);
CREATE INDEX idx_micro_courses_tags ON micro_courses USING GIN(tags);

-- Enable RLS
ALTER TABLE micro_courses ENABLE ROW LEVEL SECURITY;

-- Anyone can view courses
CREATE POLICY "Anyone can view courses"
  ON micro_courses FOR SELECT
  USING (true);

-- Authenticated users can create courses
CREATE POLICY "Authenticated users can create courses"
  ON micro_courses FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Creators can update their own courses
CREATE POLICY "Creators can update own courses"
  ON micro_courses FOR UPDATE
  USING (auth.uid() = creator_id);

-- Creators can delete their own courses
CREATE POLICY "Creators can delete own courses"
  ON micro_courses FOR DELETE
  USING (auth.uid() = creator_id);

-- Add foreign key to reels table
ALTER TABLE reels
  ADD CONSTRAINT fk_reels_micro_course
  FOREIGN KEY (micro_course_id)
  REFERENCES micro_courses(id)
  ON DELETE SET NULL;

-- ============================================
-- MICRO COURSE LESSONS TABLE (Join table)
-- ============================================
CREATE TABLE IF NOT EXISTS micro_course_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES micro_courses(id) ON DELETE CASCADE,
  reel_id UUID NOT NULL REFERENCES reels(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, reel_id)
);

-- Indexes
CREATE INDEX idx_lessons_course ON micro_course_lessons(course_id);
CREATE INDEX idx_lessons_reel ON micro_course_lessons(reel_id);
CREATE INDEX idx_lessons_position ON micro_course_lessons(course_id, position);

-- Enable RLS
ALTER TABLE micro_course_lessons ENABLE ROW LEVEL SECURITY;

-- Anyone can view lessons
CREATE POLICY "Anyone can view lessons"
  ON micro_course_lessons FOR SELECT
  USING (true);

-- Course creators can manage lessons
CREATE POLICY "Course creators can manage lessons"
  ON micro_course_lessons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM micro_courses
      WHERE id = micro_course_lessons.course_id
      AND creator_id = auth.uid()
    )
  );

-- ============================================
-- PLAYLISTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_playlists_user ON playlists(user_id);

-- Enable RLS
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

-- Users can view their own playlists
CREATE POLICY "Users can view own playlists"
  ON playlists FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create playlists
CREATE POLICY "Users can create playlists"
  ON playlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own playlists
CREATE POLICY "Users can update own playlists"
  ON playlists FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own playlists
CREATE POLICY "Users can delete own playlists"
  ON playlists FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- PLAYLIST ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS playlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  reel_id UUID NOT NULL REFERENCES reels(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(playlist_id, reel_id)
);

-- Indexes
CREATE INDEX idx_playlist_items_playlist ON playlist_items(playlist_id);
CREATE INDEX idx_playlist_items_reel ON playlist_items(reel_id);

-- Enable RLS
ALTER TABLE playlist_items ENABLE ROW LEVEL SECURITY;

-- Users can view items in their playlists
CREATE POLICY "Users can view own playlist items"
  ON playlist_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE id = playlist_items.playlist_id
      AND user_id = auth.uid()
    )
  );

-- Users can add items to their playlists
CREATE POLICY "Users can add to own playlists"
  ON playlist_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE id = playlist_items.playlist_id
      AND user_id = auth.uid()
    )
  );

-- Users can remove items from their playlists
CREATE POLICY "Users can remove from own playlists"
  ON playlist_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE id = playlist_items.playlist_id
      AND user_id = auth.uid()
    )
  );

-- ============================================
-- LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reel_id UUID NOT NULL REFERENCES reels(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, reel_id)
);

-- Indexes
CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_reel ON likes(reel_id);

-- Enable RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Anyone can view likes
CREATE POLICY "Anyone can view likes"
  ON likes FOR SELECT
  USING (true);

-- Users can like reels
CREATE POLICY "Users can like reels"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can unlike reels
CREATE POLICY "Users can unlike reels"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FOLLOWERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS followers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  followee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, followee_id),
  CHECK (follower_id != followee_id)
);

-- Indexes
CREATE INDEX idx_followers_follower ON followers(follower_id);
CREATE INDEX idx_followers_followee ON followers(followee_id);

-- Enable RLS
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;

-- Anyone can view followers
CREATE POLICY "Anyone can view followers"
  ON followers FOR SELECT
  USING (true);

-- Users can follow others
CREATE POLICY "Users can follow others"
  ON followers FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Users can unfollow others
CREATE POLICY "Users can unfollow others"
  ON followers FOR DELETE
  USING (auth.uid() = follower_id);

-- ============================================
-- COURSE PROGRESS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES micro_courses(id) ON DELETE CASCADE,
  completed_lessons UUID[] DEFAULT '{}',
  progress_percentage INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Indexes
CREATE INDEX idx_course_progress_user ON course_progress(user_id);
CREATE INDEX idx_course_progress_course ON course_progress(course_id);

-- Enable RLS
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own progress
CREATE POLICY "Users can view own progress"
  ON course_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
  ON course_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reels_updated_at
  BEFORE UPDATE ON reels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_micro_courses_updated_at
  BEFORE UPDATE ON micro_courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON playlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_progress_updated_at
  BEFORE UPDATE ON course_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
