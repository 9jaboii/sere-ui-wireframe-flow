-- SERE MVP - Test Seed Data
-- Run this in Supabase SQL Editor (requires service_role access)
-- Prerequisites: 001_initial_schema.sql applied, jamesprofile1@outlook.com signed up
--
-- This script:
--   1. Finds the existing test user
--   2. Creates 4 additional test users (with auth entries)
--   3. Creates 8 activities across categories
--   4. Creates join requests and accepted attendees

-- ============================================
-- Step 1: Generate deterministic UUIDs for test users
-- ============================================
DO $$
DECLARE
  v_main_user_id UUID;
  v_user2_id UUID := 'a1111111-1111-1111-1111-111111111111';
  v_user3_id UUID := 'a2222222-2222-2222-2222-222222222222';
  v_user4_id UUID := 'a3333333-3333-3333-3333-333333333333';
  v_user5_id UUID := 'a4444444-4444-4444-4444-444444444444';
  v_activity1_id UUID;
  v_activity2_id UUID;
  v_activity3_id UUID;
  v_activity4_id UUID;
  v_activity5_id UUID;
  v_activity6_id UUID;
  v_activity7_id UUID;
  v_activity8_id UUID;
BEGIN

-- ============================================
-- Step 2: Get the existing test user
-- ============================================
SELECT id INTO v_main_user_id FROM auth.users WHERE email = 'jamesprofile1@outlook.com';

IF v_main_user_id IS NULL THEN
  RAISE EXCEPTION 'Test user jamesprofile1@outlook.com not found in auth.users. Please sign up first.';
END IF;

RAISE NOTICE 'Found main test user: %', v_main_user_id;

-- ============================================
-- Step 3: Create test auth users
-- ============================================
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES
  ('00000000-0000-0000-0000-000000000000', v_user2_id, 'authenticated', 'authenticated',
   'maya.rodriguez@test.com', crypt('TestPass123!', gen_salt('bf')), NOW(), NOW(), NOW(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"first_name":"Maya","last_name":"Rodriguez"}'::jsonb),

  ('00000000-0000-0000-0000-000000000000', v_user3_id, 'authenticated', 'authenticated',
   'jordan.kim@test.com', crypt('TestPass123!', gen_salt('bf')), NOW(), NOW(), NOW(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"first_name":"Jordan","last_name":"Kim"}'::jsonb),

  ('00000000-0000-0000-0000-000000000000', v_user4_id, 'authenticated', 'authenticated',
   'sarah.williams@test.com', crypt('TestPass123!', gen_salt('bf')), NOW(), NOW(), NOW(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"first_name":"Sarah","last_name":"Williams"}'::jsonb),

  ('00000000-0000-0000-0000-000000000000', v_user5_id, 'authenticated', 'authenticated',
   'mike.davis@test.com', crypt('TestPass123!', gen_salt('bf')), NOW(), NOW(), NOW(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"first_name":"Mike","last_name":"Davis"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Step 4: Create public.users profiles
-- ============================================
-- Ensure main user has a profile
INSERT INTO users (id, first_name, last_name, email, avatar_color, is_verified)
VALUES (v_main_user_id, 'James', 'Profile', 'jamesprofile1@outlook.com', '#3B82F6', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, first_name, last_name, email, avatar_color, is_verified)
VALUES
  (v_user2_id, 'Maya', 'Rodriguez', 'maya.rodriguez@test.com', '#A855F7', true),
  (v_user3_id, 'Jordan', 'Kim', 'jordan.kim@test.com', '#22C55E', true),
  (v_user4_id, 'Sarah', 'Williams', 'sarah.williams@test.com', '#EC4899', true),
  (v_user5_id, 'Mike', 'Davis', 'mike.davis@test.com', '#F97316', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Step 5: Create test activities
-- ============================================

-- Activity 1: Sport by Maya (tomorrow)
INSERT INTO activities (host_user_id, category, skill_level, description, event_date, event_time, location_text, spots_total, spots_filled, status)
VALUES (v_user2_id, 'sport_gym', 'intermediate',
  'Who wants to play tennis at Rock Creek Park? Bringing extra rackets!',
  CURRENT_DATE + INTERVAL '1 day', '18:00:00',
  'Rock Creek Park, DC', 4, 1, 'active')
RETURNING id INTO v_activity1_id;

-- Activity 2: Party by Jordan (this weekend)
INSERT INTO activities (host_user_id, category, description, event_date, event_time, location_text, spots_total, spots_filled, external_link, status)
VALUES (v_user3_id, 'party',
  'Drake is performing tonight, who''s going? Let''s pregame in Silver Spring at 6pm.',
  CURRENT_DATE + INTERVAL '2 days', '18:00:00',
  'Silver Spring, MD', 10, 3, 'https://ticketmaster.com/example', 'active')
RETURNING id INTO v_activity2_id;

-- Activity 3: Casual hangout by Sarah (tomorrow morning)
INSERT INTO activities (host_user_id, category, description, event_date, event_time, location_text, spots_total, spots_filled, status)
VALUES (v_user4_id, 'casual_hangout',
  'Anyone want to grab coffee and work at a cafe in Capitol Hill?',
  CURRENT_DATE + INTERVAL '1 day', '10:00:00',
  'Capitol Hill, DC', 3, 0, 'active')
RETURNING id INTO v_activity3_id;

-- Activity 4: Sport by Mike (3 days out)
INSERT INTO activities (host_user_id, category, skill_level, description, event_date, event_time, location_text, spots_total, spots_filled, status)
VALUES (v_user5_id, 'sport_gym', 'beginner',
  'Pickup basketball at Rucker Park. All levels welcome, just come have fun!',
  CURRENT_DATE + INTERVAL '3 days', '17:00:00',
  'Rucker Park, NYC', 8, 2, 'active')
RETURNING id INTO v_activity4_id;

-- Activity 5: Hosted by main test user (tomorrow evening)
INSERT INTO activities (host_user_id, category, skill_level, description, event_date, event_time, location_text, spots_total, spots_filled, status)
VALUES (v_main_user_id, 'sport_gym', 'just_for_fun',
  'Morning yoga session in the park. Bring your own mat!',
  CURRENT_DATE + INTERVAL '1 day', '08:00:00',
  'Central Park, NYC', 6, 2, 'active')
RETURNING id INTO v_activity5_id;

-- Activity 6: Hosted by main test user (weekend)
INSERT INTO activities (host_user_id, category, description, event_date, event_time, location_text, spots_total, spots_filled, status)
VALUES (v_main_user_id, 'casual_hangout',
  'Board game night at my place! Bringing Catan, Ticket to Ride, and more.',
  CURRENT_DATE + INTERVAL '4 days', '19:00:00',
  'Downtown, DC', 5, 1, 'active')
RETURNING id INTO v_activity6_id;

-- Activity 7: Other category by Maya
INSERT INTO activities (host_user_id, category, description, event_date, event_time, location_text, spots_total, spots_filled, status)
VALUES (v_user2_id, 'other',
  'Study group for AWS certification exam. Let''s prep together!',
  CURRENT_DATE + INTERVAL '2 days', '14:00:00',
  'Library of Congress, DC', 4, 1, 'active')
RETURNING id INTO v_activity7_id;

-- Activity 8: Party by Sarah (next week)
INSERT INTO activities (host_user_id, category, description, event_date, event_time, location_text, spots_total, spots_filled, external_link, status)
VALUES (v_user4_id, 'party',
  'Rooftop happy hour! Great views, good vibes. First drink on me.',
  CURRENT_DATE + INTERVAL '5 days', '17:30:00',
  'The Rooftop Bar, Georgetown, DC', 8, 0, 'https://rooftopbar.com', 'active')
RETURNING id INTO v_activity8_id;

-- ============================================
-- Step 6: Create join requests
-- ============================================

-- Main user joined Maya's tennis (accepted)
INSERT INTO join_requests (activity_id, requester_id, status, decided_at)
VALUES (v_activity1_id, v_main_user_id, 'accepted', NOW())
ON CONFLICT (activity_id, requester_id) DO NOTHING;

-- Main user joined Jordan's party (accepted)
INSERT INTO join_requests (activity_id, requester_id, status, decided_at)
VALUES (v_activity2_id, v_main_user_id, 'accepted', NOW())
ON CONFLICT (activity_id, requester_id) DO NOTHING;

-- Main user requested to join Mike's basketball (pending)
INSERT INTO join_requests (activity_id, requester_id, status)
VALUES (v_activity4_id, v_main_user_id, 'pending')
ON CONFLICT (activity_id, requester_id) DO NOTHING;

-- Sarah joined main user's yoga (accepted)
INSERT INTO join_requests (activity_id, requester_id, status, decided_at)
VALUES (v_activity5_id, v_user4_id, 'accepted', NOW())
ON CONFLICT (activity_id, requester_id) DO NOTHING;

-- Mike joined main user's yoga (accepted)
INSERT INTO join_requests (activity_id, requester_id, status, decided_at)
VALUES (v_activity5_id, v_user5_id, 'accepted', NOW())
ON CONFLICT (activity_id, requester_id) DO NOTHING;

-- Jordan wants to join main user's board game night (pending - for host to review)
INSERT INTO join_requests (activity_id, requester_id, status)
VALUES (v_activity6_id, v_user3_id, 'pending')
ON CONFLICT (activity_id, requester_id) DO NOTHING;

-- Mike joined main user's board game night (accepted)
INSERT INTO join_requests (activity_id, requester_id, status, decided_at)
VALUES (v_activity6_id, v_user5_id, 'accepted', NOW())
ON CONFLICT (activity_id, requester_id) DO NOTHING;

-- Maya joined Jordan's party (accepted)
INSERT INTO join_requests (activity_id, requester_id, status, decided_at)
VALUES (v_activity2_id, v_user2_id, 'accepted', NOW())
ON CONFLICT (activity_id, requester_id) DO NOTHING;

-- Sarah joined Jordan's party (accepted)
INSERT INTO join_requests (activity_id, requester_id, status, decided_at)
VALUES (v_activity2_id, v_user4_id, 'accepted', NOW())
ON CONFLICT (activity_id, requester_id) DO NOTHING;

-- Mike joined Mike's own basketball attendees
INSERT INTO join_requests (activity_id, requester_id, status, decided_at)
VALUES (v_activity4_id, v_user2_id, 'accepted', NOW())
ON CONFLICT (activity_id, requester_id) DO NOTHING;

INSERT INTO join_requests (activity_id, requester_id, status, decided_at)
VALUES (v_activity4_id, v_user3_id, 'accepted', NOW())
ON CONFLICT (activity_id, requester_id) DO NOTHING;

-- Maya joined her own study group attendee
INSERT INTO join_requests (activity_id, requester_id, status, decided_at)
VALUES (v_activity7_id, v_user5_id, 'accepted', NOW())
ON CONFLICT (activity_id, requester_id) DO NOTHING;

RAISE NOTICE 'Seed data created successfully!';
RAISE NOTICE 'Activities created: 8 (2 by main user, 6 by test users)';
RAISE NOTICE 'Join requests: main user joined 2 activities, has 1 pending request';
RAISE NOTICE 'Main user''s activities have incoming join requests to review';

END $$;
