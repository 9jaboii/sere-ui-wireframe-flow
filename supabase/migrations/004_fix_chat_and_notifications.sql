-- Migration 004: Chat RLS fix, notification triggers, favorites table, waitlist expansion
-- Date: 2026-03-27

-- ========== 1a. Chat RLS Fix ==========
-- Allow authenticated users to create chat rooms and join them

CREATE POLICY "Authenticated users can create chat rooms" ON chat_rooms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can join chat rooms" ON chat_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========== 1b. Notification Triggers ==========

-- INSERT policy on notifications table (allow triggers and server to insert)
CREATE POLICY "Allow insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Trigger: notify host when someone requests to join their activity
CREATE OR REPLACE FUNCTION notify_host_on_join_request()
RETURNS TRIGGER AS $$
DECLARE
  v_host_id UUID;
  v_requester_name TEXT;
  v_activity_desc TEXT;
BEGIN
  SELECT a.host_user_id, a.description INTO v_host_id, v_activity_desc
  FROM activities a WHERE a.id = NEW.activity_id;

  SELECT (u.first_name || ' ' || u.last_name) INTO v_requester_name
  FROM users u WHERE u.id = NEW.requester_id;

  INSERT INTO notifications (user_id, type, title, body, payload)
  VALUES (
    v_host_id,
    'request_received',
    'New Join Request',
    v_requester_name || ' wants to join your activity: ' || LEFT(v_activity_desc, 50),
    jsonb_build_object('activity_id', NEW.activity_id, 'request_id', NEW.id)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_notify_host_on_join_request
  AFTER INSERT ON join_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_host_on_join_request();

-- Trigger: notify requester when their request is accepted
CREATE OR REPLACE FUNCTION notify_requester_on_accept()
RETURNS TRIGGER AS $$
DECLARE
  v_activity_desc TEXT;
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    SELECT LEFT(a.description, 50) INTO v_activity_desc
    FROM activities a WHERE a.id = NEW.activity_id;

    INSERT INTO notifications (user_id, type, title, body, payload)
    VALUES (
      NEW.requester_id,
      'request_accepted',
      'Request Accepted!',
      'You''ve been accepted to join: ' || v_activity_desc,
      jsonb_build_object('activity_id', NEW.activity_id)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_notify_requester_on_accept
  AFTER UPDATE ON join_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_requester_on_accept();

-- Trigger: notify chat room members when a new message is sent
CREATE OR REPLACE FUNCTION notify_on_new_message()
RETURNS TRIGGER AS $$
DECLARE
  v_sender_name TEXT;
  v_activity_id UUID;
  v_member RECORD;
BEGIN
  SELECT (u.first_name || ' ' || u.last_name) INTO v_sender_name
  FROM users u WHERE u.id = NEW.user_id;

  SELECT cr.activity_id INTO v_activity_id
  FROM chat_rooms cr WHERE cr.id = NEW.room_id;

  FOR v_member IN
    SELECT cm.user_id FROM chat_members cm
    WHERE cm.room_id = NEW.room_id AND cm.user_id != NEW.user_id
  LOOP
    INSERT INTO notifications (user_id, type, title, body, payload)
    VALUES (
      v_member.user_id,
      'activity_updated',
      'New Message',
      v_sender_name || ': ' || LEFT(NEW.content, 80),
      jsonb_build_object('activity_id', v_activity_id, 'room_id', NEW.room_id)
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_notify_on_new_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_new_message();

-- ========== 1c. Favorites Table ==========

CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, activity_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- ========== 1d. Waitlist Expansion ==========

ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS location TEXT;
