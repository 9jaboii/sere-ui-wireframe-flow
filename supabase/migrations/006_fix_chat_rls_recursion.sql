-- Migration 006: Fix infinite recursion in chat RLS policies
-- Date: 2026-04-28
--
-- Postgres error 42P17 — "infinite recursion detected in policy for relation
-- chat_members" — was firing on every chat-room open because the SELECT
-- policy on chat_members did a sub-SELECT against chat_members itself, which
-- re-evaluated the same policy. The chat_rooms and messages SELECT policies
-- referenced chat_members as well, so they also hit the recursion.
--
-- Fix: use a SECURITY DEFINER helper function. Functions owned by a role
-- with BYPASSRLS (postgres, by default in Supabase) skip RLS when the
-- function body runs, breaking the recursion.

-- 1. Drop the recursive policies
DROP POLICY IF EXISTS "Members can read chat membership" ON chat_members;
DROP POLICY IF EXISTS "Members can read their chat rooms" ON chat_rooms;
DROP POLICY IF EXISTS "Members can read messages" ON messages;
DROP POLICY IF EXISTS "Members can send messages" ON messages;

-- 2. Membership check that bypasses RLS
CREATE OR REPLACE FUNCTION is_chat_member(p_room_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM chat_members
    WHERE room_id = p_room_id AND user_id = p_user_id
  );
$$;

GRANT EXECUTE ON FUNCTION is_chat_member(UUID, UUID) TO authenticated;

-- 3. Non-recursive replacements
CREATE POLICY "Members can read chat membership" ON chat_members
  FOR SELECT USING (is_chat_member(room_id, auth.uid()));

CREATE POLICY "Members can read their chat rooms" ON chat_rooms
  FOR SELECT USING (is_chat_member(id, auth.uid()));

CREATE POLICY "Members can read messages" ON messages
  FOR SELECT USING (is_chat_member(room_id, auth.uid()));

CREATE POLICY "Members can send messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND is_chat_member(room_id, auth.uid())
  );
