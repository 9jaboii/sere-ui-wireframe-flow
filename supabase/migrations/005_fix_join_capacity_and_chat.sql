-- Migration 005: Fix join capacity logic, chat room SELECT policy, activity DELETE policy
-- Date: 2026-04-16

-- ========== 1. Fix can_request_join capacity logic ==========
-- Previously compared (pending + accepted) count against spots_total * 2.
-- Now: only accepted count is checked against spots_total for capacity.
-- Pending requests are allowed beyond accepted capacity.

CREATE OR REPLACE FUNCTION can_request_join(p_activity_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_spots_total INTEGER;
  v_accepted_count INTEGER;
BEGIN
  SELECT spots_total INTO v_spots_total FROM activities WHERE id = p_activity_id;

  IF v_spots_total IS NULL THEN
    RETURN FALSE;
  END IF;

  SELECT COUNT(*) INTO v_accepted_count FROM join_requests
    WHERE activity_id = p_activity_id AND status = 'accepted';

  RETURN v_accepted_count < v_spots_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========== 2. Chat room SELECT policy for activity lookup ==========
-- Allow authenticated users to check if a chat room exists for an activity.
-- Without this, non-members can't discover existing rooms and hit UNIQUE violations.

CREATE POLICY "Authenticated users can view chat rooms by activity" ON chat_rooms
  FOR SELECT USING (auth.role() = 'authenticated');

-- ========== 3. Activity DELETE policy ==========
-- Allow hosts to delete their own activities.

CREATE POLICY "Hosts can delete own activities" ON activities
  FOR DELETE USING (auth.uid() = host_user_id);
