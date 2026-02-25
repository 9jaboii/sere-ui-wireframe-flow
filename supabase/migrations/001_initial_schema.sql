-- SERE MVP Database Schema
-- Based on PRD Modules 1-12
-- Run this in your Supabase SQL Editor

-- ============================================
-- Module 1: Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_color TEXT DEFAULT '#3B82F6',
  is_verified BOOLEAN DEFAULT FALSE,
  auth_provider TEXT DEFAULT 'email' CHECK (auth_provider IN ('email', 'google', 'apple')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can read basic info of other users (for displaying names/avatars)
CREATE POLICY "Users can read others basic info" ON users
  FOR SELECT USING (true);

-- ============================================
-- Module 2: Verification Tokens
-- ============================================
CREATE TABLE IF NOT EXISTS verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own verification tokens" ON verification_tokens
  FOR ALL USING (auth.uid() = user_id);

-- Rate limiting table
CREATE TABLE IF NOT EXISTS verification_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Module 5: Friendships & Invites
-- ============================================
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, friend_id)
);

CREATE INDEX idx_friendships_user_id ON friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);

ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own friendships" ON friendships
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friendships" ON friendships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update friendships they're part of" ON friendships
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Invites table
CREATE TABLE IF NOT EXISTS invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_by UUID REFERENCES users(id),
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_invites_token ON invites(token);

ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own invites" ON invites
  FOR SELECT USING (auth.uid() = inviter_id);

CREATE POLICY "Users can create invites" ON invites
  FOR INSERT WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Anyone can read invite by token for claiming" ON invites
  FOR SELECT USING (true);

-- ============================================
-- Module 6: Activities
-- ============================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('sport_gym', 'casual_hangout', 'party', 'other')),
  skill_level TEXT CHECK (
    (category = 'sport_gym' AND skill_level IN ('beginner', 'intermediate', 'advanced', 'just_for_fun'))
    OR (category != 'sport_gym' AND skill_level IS NULL)
  ),
  description TEXT NOT NULL CHECK (char_length(description) <= 200),
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location_text TEXT NOT NULL,
  spots_total INTEGER NOT NULL CHECK (spots_total BETWEEN 1 AND 12),
  spots_filled INTEGER DEFAULT 0,
  external_link TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'completed')),
  edit_count INTEGER DEFAULT 0,
  first_acceptance_at TIMESTAMP WITH TIME ZONE,
  completion_status TEXT CHECK (completion_status IN ('occurred', 'did_not_occur', 'unconfirmed')),
  completion_confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_activities_date_status ON activities(event_date, status) WHERE status = 'active';
CREATE INDEX idx_activities_host ON activities(host_user_id);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Anyone can read active activities (feed visibility handled in queries)
CREATE POLICY "Anyone can read active activities" ON activities
  FOR SELECT USING (status = 'active');

-- Hosts can read all their activities
CREATE POLICY "Hosts can read own activities" ON activities
  FOR SELECT USING (auth.uid() = host_user_id);

-- Authenticated users can create activities
CREATE POLICY "Authenticated users can create activities" ON activities
  FOR INSERT WITH CHECK (auth.uid() = host_user_id);

-- Hosts can update their own activities
CREATE POLICY "Hosts can update own activities" ON activities
  FOR UPDATE USING (auth.uid() = host_user_id);

-- ============================================
-- Module 8: Join Requests
-- ============================================
CREATE TABLE IF NOT EXISTS join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  decided_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(activity_id, requester_id)
);

CREATE INDEX idx_join_requests_activity ON join_requests(activity_id, status);

ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;

-- Requesters can read their own requests
CREATE POLICY "Requesters can read own requests" ON join_requests
  FOR SELECT USING (auth.uid() = requester_id);

-- Hosts can read requests for their activities
CREATE POLICY "Hosts can read requests for their activities" ON join_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM activities
      WHERE activities.id = join_requests.activity_id
      AND activities.host_user_id = auth.uid()
    )
  );

-- Authenticated users can create requests
CREATE POLICY "Authenticated users can create requests" ON join_requests
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

-- Hosts can update requests for their activities
CREATE POLICY "Hosts can update requests" ON join_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM activities
      WHERE activities.id = join_requests.activity_id
      AND activities.host_user_id = auth.uid()
    )
  );

-- ============================================
-- Module 9: Chat System
-- ============================================
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_chat_rooms_expires ON chat_rooms(expires_at);

ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS chat_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

ALTER TABLE chat_members ENABLE ROW LEVEL SECURITY;

-- Members can read rooms they're in
CREATE POLICY "Members can read their chat rooms" ON chat_rooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_members
      WHERE chat_members.room_id = chat_rooms.id
      AND chat_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can read chat membership" ON chat_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_members cm
      WHERE cm.room_id = chat_members.room_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_room_time ON messages(room_id, sent_at DESC);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Members can read messages in their rooms
CREATE POLICY "Members can read messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_members
      WHERE chat_members.room_id = messages.room_id
      AND chat_members.user_id = auth.uid()
    )
  );

-- Members can insert messages
CREATE POLICY "Members can send messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM chat_members
      WHERE chat_members.room_id = messages.room_id
      AND chat_members.user_id = auth.uid()
    )
  );

-- ============================================
-- Module 10: Notifications
-- ============================================
CREATE TABLE IF NOT EXISTS device_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, token)
);

ALTER TABLE device_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own device tokens" ON device_tokens
  FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  payload JSONB,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- Module 11: Feedback
-- ============================================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can submit feedback" ON feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Functions
-- ============================================

-- Function to check if activity can accept more requests
CREATE OR REPLACE FUNCTION can_request_join(p_activity_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_spots_needed INTEGER;
  v_request_count INTEGER;
BEGIN
  SELECT spots_total INTO v_spots_needed FROM activities WHERE id = p_activity_id;
  SELECT COUNT(*) INTO v_request_count FROM join_requests
    WHERE activity_id = p_activity_id AND status IN ('pending', 'accepted');

  RETURN v_request_count < (v_spots_needed * 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get visible activities (friends + friends-of-friends)
CREATE OR REPLACE FUNCTION get_visible_activities(current_user_id UUID)
RETURNS SETOF activities AS $$
BEGIN
  RETURN QUERY
  WITH visible_hosts AS (
    -- Direct friends
    SELECT friend_id AS host_id FROM friendships
    WHERE user_id = current_user_id AND status = 'accepted'

    UNION

    -- Friends of friends (2nd degree)
    SELECT DISTINCT f2.friend_id
    FROM friendships f1
    JOIN friendships f2 ON f1.friend_id = f2.user_id
    WHERE f1.user_id = current_user_id
    AND f1.status = 'accepted'
    AND f2.status = 'accepted'
    AND f2.friend_id != current_user_id

    UNION

    -- Own activities
    SELECT current_user_id AS host_id
  )
  SELECT a.*
  FROM activities a
  WHERE a.host_user_id IN (SELECT host_id FROM visible_hosts)
    AND a.event_date >= CURRENT_DATE
    AND a.status = 'active'
  ORDER BY a.event_date ASC, a.event_time ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Triggers
-- ============================================

-- Trigger to create user profile after auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_avatar_colors TEXT[] := ARRAY['#3B82F6', '#EF4444', '#22C55E', '#F59E0B', '#A855F7', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16', '#06B6D4', '#8B5CF6'];
  v_random_color TEXT;
  v_auth_provider TEXT;
BEGIN
  -- Select random color
  v_random_color := v_avatar_colors[1 + floor(random() * 12)::int];

  -- Determine auth provider
  IF NEW.raw_app_meta_data->>'provider' = 'google' THEN
    v_auth_provider := 'google';
  ELSIF NEW.raw_app_meta_data->>'provider' = 'apple' THEN
    v_auth_provider := 'apple';
  ELSE
    v_auth_provider := 'email';
  END IF;

  INSERT INTO public.users (id, first_name, last_name, email, avatar_color, is_verified, auth_provider)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    v_random_color,
    CASE WHEN v_auth_provider IN ('google', 'apple') THEN true ELSE false END,
    v_auth_provider
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER friendships_updated_at
  BEFORE UPDATE ON friendships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Enable Realtime for chat
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
