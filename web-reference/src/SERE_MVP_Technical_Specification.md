# SERE - MVP Technical Specification

**Version:** 1.0  
**Last Updated:** October 13, 2025  
**Document Owner:** Product & Engineering Team

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [Technical Stack](#3-technical-stack)
4. [System Architecture](#4-system-architecture)
5. [User Flow & Navigation](#5-user-flow--navigation)
6. [Database Schema & Data Models](#6-database-schema--data-models)
7. [API Endpoints](#7-api-endpoints)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [Features by Screen](#9-features-by-screen)
10. [Safety & Trust System](#10-safety--trust-system)
11. [Real-time Features](#11-real-time-features)
12. [Location & Search](#12-location--search)
13. [Notifications System](#13-notifications-system)
14. [Frontend Architecture](#14-frontend-architecture)
15. [Security & Privacy](#15-security--privacy)
16. [Performance Requirements](#16-performance-requirements)
17. [Testing Strategy](#17-testing-strategy)
18. [Deployment & Infrastructure](#18-deployment--infrastructure)
19. [Analytics & Metrics](#19-analytics--metrics)
20. [Future Enhancements](#20-future-enhancements)

---

## 1. Executive Summary

SERE is a social app that helps people find others ready to play sports, hang out, or attend events together, with a strong emphasis on safety and trust. The app enables users to create and join activities in real-time, while building community trust through a post-activity rating system.

### Core Value Proposition
- **Instant Connection:** Find people ready to do activities *today*
- **Safety First:** Verification system, trust scores, and safety reminders
- **Community Trust:** Post-activity rating system (like Uber/Airbnb)
- **Flexible Activities:** Sports (with skill levels), social hangouts, and events

### MVP Goals
1. Launch with full user registration and profile setup
2. Enable activity creation and discovery
3. Implement basic messaging between users
4. Build trust system with post-activity ratings
5. Establish safety features and verification system

---

## 2. Product Overview

### 2.1 Target Audience
- Ages 18-45
- Urban and suburban residents
- People looking for:
  - Sports partners with similar skill levels
  - Social connections and meetups
  - Event companions
  - Study/work buddies

### 2.2 Key Differentiators
1. **Time-sensitive focus:** Activities happening today/this week
2. **Trust & Safety:** Built-in verification and rating system
3. **Skill-level matching:** For sports activities
4. **Public meetup emphasis:** Constant safety reminders

### 2.3 MVP Scope

#### In Scope
- User authentication (email/password + optional social)
- Profile creation with verification options
- Activity posting and browsing
- Filtering by category, location, and skill level
- In-app messaging
- Post-activity rating system
- Trust score calculation
- Safety guidelines and reporting

#### Out of Scope (Future)
- Payment integration
- Video chat
- Live location sharing
- Advanced matching algorithms
- Premium features/subscriptions
- Push notifications (web notifications only)
- Native mobile apps

---

## 3. Technical Stack

### 3.1 Frontend
- **Framework:** React 18+ with TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/ui component library
- **Icons:** Lucide React
- **State Management:** React hooks (useState, useContext)
- **Form Handling:** React Hook Form with Zod validation
- **Routing:** React Router v6
- **Real-time:** Socket.io client or Supabase Realtime

### 3.2 Backend
**Primary Recommendation: Supabase**
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth (email/password, OAuth)
- **Real-time:** Supabase Realtime subscriptions
- **Storage:** Supabase Storage (for user photos)
- **API:** Supabase REST API + PostgreSQL functions

**Alternative: Custom Backend**
- **Runtime:** Node.js with Express or Nest.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with Passport.js
- **Real-time:** Socket.io
- **Storage:** AWS S3 or Cloudinary

### 3.3 Infrastructure & Tools
- **Hosting:** Vercel (frontend) + Supabase (backend/DB)
- **Version Control:** Git + GitHub
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry for error tracking
- **Analytics:** Mixpanel or PostHog

---

## 4. System Architecture

### 4.1 High-Level Architecture

```
┌─────────────┐
│   Client    │
│  (React)    │
└──────┬──────┘
       │
       ├─── REST API
       ├─── WebSocket (Real-time)
       └─── File Upload
       │
┌──────▼──────────────────┐
│   Supabase Backend      │
│  ┌──────────────────┐   │
│  │  PostgreSQL DB   │   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │   Auth Service   │   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │  Realtime Subs   │   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │     Storage      │   │
│  └──────────────────┘   │
└─────────────────────────┘
       │
┌──────▼──────────────────┐
│   External Services     │
│  - Email (SendGrid)     │
│  - SMS (Twilio)         │
│  - Image CDN            │
└─────────────────────────┘
```

### 4.2 Component Architecture

```
/components
  /ui (Shadcn components)
  /features
    /auth (AuthForms)
    /profile (ProfileSetup)
    /feed (MainFeed)
    /activities (CreatePost, ActivityDetails)
    /messaging (Chats)
    /notifications (NotificationsPage)
    /ratings (RatingSystem)
    /safety (VerificationSafety)
```

---

## 5. User Flow & Navigation

### 5.1 Primary User Flows

#### Flow 1: New User Signup
```
Landing Page → Sign Up Form → Profile Setup → Main Feed
```

#### Flow 2: Returning User Login
```
Landing Page → Login Form → Main Feed
```

#### Flow 3: Create Activity
```
Main Feed → Create Post → Fill Form → Preview → Post → Back to Feed
```

#### Flow 4: Join Activity
```
Main Feed → Activity Details → Join → Group Chat → Activity → Rating
```

#### Flow 5: Complete Profile Verification
```
Main Feed → Profile Icon → Verification Tab → Complete Verifications → Badge Earned
```

### 5.2 Screen Navigation Map

```
Landing Page
├── Login
│   └── Main Feed
└── Sign Up
    └── Profile Setup
        └── Main Feed
            ├── Create Post
            │   └── (back to) Main Feed
            ├── Activity Details
            │   └── Rating System
            │       └── (back to) Main Feed
            ├── Notifications
            │   └── (back to) Main Feed
            ├── Chats
            │   └── (back to) Main Feed
            └── Verification & Safety
                └── (back to) Main Feed
```

---

## 6. Database Schema & Data Models

### 6.1 Core Tables

#### Table: `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- Nullable for OAuth users
  name VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  bio TEXT,
  profile_photo_url TEXT,
  additional_photos TEXT[], -- Array of photo URLs
  interests TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Indexes
CREATE INDEX idx_users_location ON users(location);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### Table: `user_sports`
```sql
CREATE TABLE user_sports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sport VARCHAR(100) NOT NULL,
  skill_level VARCHAR(50) NOT NULL, -- beginner, intermediate, advanced, casual
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, sport)
);

-- Indexes
CREATE INDEX idx_user_sports_user_id ON user_sports(user_id);
CREATE INDEX idx_user_sports_sport ON user_sports(sport);
```

#### Table: `verifications`
```sql
CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  verification_type VARCHAR(50) NOT NULL, -- phone, linkedin, id, photo
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  verification_data JSONB, -- Store verification metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, verification_type)
);

-- Indexes
CREATE INDEX idx_verifications_user_id ON verifications(user_id);
```

#### Table: `trust_scores`
```sql
CREATE TABLE trust_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  level VARCHAR(50) DEFAULT 'new', -- new, reliable, super_reliable
  activities_completed INTEGER DEFAULT 0,
  activities_hosted INTEGER DEFAULT 0,
  no_shows INTEGER DEFAULT 0,
  positive_ratings INTEGER DEFAULT 0,
  negative_ratings INTEGER DEFAULT 0,
  last_calculated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_trust_scores_user_id ON trust_scores(user_id);
CREATE INDEX idx_trust_scores_level ON trust_scores(level);
```

#### Table: `activities`
```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  activity_type VARCHAR(100) NOT NULL, -- Tennis, Coffee, Concert, etc.
  category VARCHAR(100) NOT NULL, -- Sports, Social, Events, etc.
  skill_level VARCHAR(50), -- For sports: beginner, intermediate, advanced, casual, all
  location VARCHAR(255) NOT NULL,
  full_address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  activity_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  max_attendees INTEGER NOT NULL,
  current_attendees INTEGER DEFAULT 1, -- Host counts as 1
  event_link TEXT,
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'active', -- active, cancelled, completed, full
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_activities_host_id ON activities(host_id);
CREATE INDEX idx_activities_activity_date ON activities(activity_date);
CREATE INDEX idx_activities_location ON activities(location);
CREATE INDEX idx_activities_activity_type ON activities(activity_type);
CREATE INDEX idx_activities_category ON activities(category);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_created_at ON activities(created_at);

-- Geospatial index for location-based queries
CREATE INDEX idx_activities_location_geo ON activities USING GIST (
  ll_to_earth(latitude, longitude)
);
```

#### Table: `activity_participants`
```sql
CREATE TABLE activity_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'joined', -- joined, left, removed
  UNIQUE(activity_id, user_id)
);

-- Indexes
CREATE INDEX idx_activity_participants_activity_id ON activity_participants(activity_id);
CREATE INDEX idx_activity_participants_user_id ON activity_participants(user_id);
CREATE INDEX idx_activity_participants_status ON activity_participants(status);
```

#### Table: `messages`
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL for group messages
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_messages_activity_id ON messages(activity_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

#### Table: `ratings`
```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  rater_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rated_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  showed_up BOOLEAN NOT NULL, -- true: yes, false: no
  was_late BOOLEAN DEFAULT FALSE,
  review TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(activity_id, rater_id, rated_user_id),
  CHECK (rater_id != rated_user_id) -- Can't rate yourself
);

-- Indexes
CREATE INDEX idx_ratings_activity_id ON ratings(activity_id);
CREATE INDEX idx_ratings_rater_id ON ratings(rater_id);
CREATE INDEX idx_ratings_rated_user_id ON ratings(rated_user_id);
```

#### Table: `notifications`
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL, -- rsvp_confirmation, new_message, activity_reminder, etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  related_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

#### Table: `reports`
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  reason VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, investigating, resolved, dismissed
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_reports_reported_user_id ON reports(reported_user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at);
```

### 6.2 Views

#### View: `activity_feed`
```sql
CREATE VIEW activity_feed AS
SELECT 
  a.*,
  u.name as host_name,
  u.profile_photo_url as host_photo,
  ts.level as host_trust_level,
  EXISTS(SELECT 1 FROM verifications v WHERE v.user_id = a.host_id AND v.is_verified = TRUE) as host_verified,
  (a.max_attendees - a.current_attendees) as spots_available
FROM activities a
JOIN users u ON a.host_id = u.id
JOIN trust_scores ts ON ts.user_id = u.id
WHERE a.status = 'active'
  AND a.activity_date >= CURRENT_DATE
ORDER BY a.activity_date, a.start_time;
```

---

## 7. API Endpoints

### 7.1 Authentication Endpoints

#### POST `/api/auth/signup`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

#### POST `/api/auth/login`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** Same as signup

#### POST `/api/auth/logout`
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

#### POST `/api/auth/oauth/{provider}`
Providers: google, linkedin
Redirect-based OAuth flow

### 7.2 User Profile Endpoints

#### GET `/api/users/me`
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "location": "San Francisco, CA",
  "bio": "Love playing tennis!",
  "profile_photo_url": "https://...",
  "additional_photos": ["https://...", "https://..."],
  "interests": ["Music", "Tennis", "Coffee"],
  "sports": [
    {
      "sport": "Tennis",
      "skill_level": "intermediate"
    }
  ],
  "trust_score": {
    "level": "reliable",
    "activities_completed": 12
  },
  "verifications": {
    "phone": true,
    "linkedin": false,
    "id": false,
    "photo": true
  },
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### PATCH `/api/users/me`
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "John Doe",
  "location": "San Francisco, CA",
  "bio": "Updated bio",
  "interests": ["Music", "Tennis", "Coffee", "Hiking"]
}
```

**Response:** Updated user object (same as GET)

#### POST `/api/users/me/sports`
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "sport": "Basketball",
  "skill_level": "beginner"
}
```

**Response:**
```json
{
  "id": "uuid",
  "sport": "Basketball",
  "skill_level": "beginner"
}
```

#### POST `/api/users/me/photos`
**Headers:** `Authorization: Bearer {token}`
**Content-Type:** `multipart/form-data`

**Request:**
```
photo: [file]
type: "profile" | "additional"
```

**Response:**
```json
{
  "url": "https://storage.url/photo.jpg"
}
```

### 7.3 Activity Endpoints

#### GET `/api/activities`
**Query Parameters:**
- `category`: String (optional) - "Sports - Beginner", "Social", etc.
- `location`: String (optional) - Filter by location
- `date`: Date (optional) - Filter by date
- `lat`: Float (optional) - Latitude for nearby search
- `lng`: Float (optional) - Longitude for nearby search
- `radius`: Integer (optional) - Radius in miles (default: 10)
- `page`: Integer (optional) - Page number (default: 1)
- `limit`: Integer (optional) - Items per page (default: 20)

**Response:**
```json
{
  "activities": [
    {
      "id": "uuid",
      "title": "Tennis at Rock Creek Park",
      "description": "Looking for tennis partners...",
      "activity_type": "Tennis",
      "category": "Sports",
      "skill_level": "intermediate",
      "location": "Rock Creek Park, DC",
      "activity_date": "2024-10-15",
      "start_time": "18:00:00",
      "end_time": "20:00:00",
      "max_attendees": 4,
      "current_attendees": 3,
      "spots_available": 1,
      "image_url": "https://...",
      "host": {
        "id": "uuid",
        "name": "Alex Chen",
        "profile_photo_url": "https://...",
        "trust_level": "reliable",
        "is_verified": true
      },
      "created_at": "2024-10-13T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

#### GET `/api/activities/{id}`
**Response:**
```json
{
  "id": "uuid",
  "title": "Tennis at Rock Creek Park",
  "description": "Looking for tennis partners...",
  "activity_type": "Tennis",
  "category": "Sports",
  "skill_level": "intermediate",
  "location": "Rock Creek Park Tennis Courts, DC",
  "full_address": "5200 Glover Rd NW, Washington, DC 20015",
  "latitude": 38.9583,
  "longitude": -77.0620,
  "activity_date": "2024-10-15",
  "start_time": "18:00:00",
  "end_time": "20:00:00",
  "max_attendees": 4,
  "current_attendees": 3,
  "event_link": null,
  "image_url": "https://...",
  "status": "active",
  "host": {
    "id": "uuid",
    "name": "Alex Chen",
    "profile_photo_url": "https://...",
    "trust_level": "reliable",
    "is_verified": true,
    "activities_completed": 12,
    "member_since": "2024-08-01"
  },
  "participants": [
    {
      "id": "uuid",
      "name": "Jamie Smith",
      "profile_photo_url": "https://...",
      "joined_at": "2024-10-13T14:20:00Z"
    }
  ],
  "is_joined": false,
  "created_at": "2024-10-13T10:30:00Z"
}
```

#### POST `/api/activities`
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "title": "Tennis at Rock Creek Park",
  "description": "Looking for tennis partners...",
  "activity_type": "Tennis",
  "skill_level": "intermediate",
  "location": "Rock Creek Park Tennis Courts, DC",
  "full_address": "5200 Glover Rd NW, Washington, DC 20015",
  "latitude": 38.9583,
  "longitude": -77.0620,
  "activity_date": "2024-10-15",
  "start_time": "18:00:00",
  "end_time": "20:00:00",
  "max_attendees": 4,
  "event_link": null
}
```

**Response:** Created activity object (same as GET)

#### POST `/api/activities/{id}/join`
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "message": "Successfully joined activity",
  "participant": {
    "id": "uuid",
    "activity_id": "uuid",
    "user_id": "uuid",
    "joined_at": "2024-10-13T15:00:00Z"
  }
}
```

**Error Responses:**
- 409: Activity is full
- 400: User already joined
- 404: Activity not found

#### DELETE `/api/activities/{id}/leave`
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "message": "Successfully left activity"
}
```

#### GET `/api/activities/me/created`
**Headers:** `Authorization: Bearer {token}`

**Response:** Array of activities created by the user

#### GET `/api/activities/me/joined`
**Headers:** `Authorization: Bearer {token}`

**Response:** Array of activities user has joined

### 7.4 Messaging Endpoints

#### GET `/api/messages/conversations`
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "conversations": [
    {
      "id": "uuid",
      "activity_id": "uuid",
      "activity_title": "Tennis at Rock Creek Park",
      "other_user": {
        "id": "uuid",
        "name": "Sarah Johnson",
        "profile_photo_url": "https://...",
        "is_online": true
      },
      "last_message": {
        "content": "Looking forward to tomorrow!",
        "sent_at": "2024-10-13T16:30:00Z",
        "is_read": false
      },
      "unread_count": 2
    }
  ]
}
```

#### GET `/api/messages/conversation/{activityId}/{userId}`
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "sender_id": "uuid",
      "sender_name": "Sarah Johnson",
      "content": "Hi! Looking forward to the match.",
      "is_current_user": false,
      "created_at": "2024-10-13T14:30:00Z"
    }
  ]
}
```

#### POST `/api/messages`
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "activity_id": "uuid",
  "recipient_id": "uuid",
  "content": "Great! See you then."
}
```

**Response:**
```json
{
  "id": "uuid",
  "activity_id": "uuid",
  "sender_id": "uuid",
  "recipient_id": "uuid",
  "content": "Great! See you then.",
  "created_at": "2024-10-13T16:35:00Z"
}
```

### 7.5 Rating Endpoints

#### POST `/api/ratings`
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "activity_id": "uuid",
  "rated_user_id": "uuid",
  "showed_up": true,
  "was_late": false,
  "review": "Great player, very friendly!"
}
```

**Response:**
```json
{
  "id": "uuid",
  "activity_id": "uuid",
  "rated_user_id": "uuid",
  "showed_up": true,
  "was_late": false,
  "review": "Great player, very friendly!",
  "created_at": "2024-10-15T20:30:00Z"
}
```

#### GET `/api/activities/{id}/pending-ratings`
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "activity": {
    "id": "uuid",
    "title": "Tennis at Rock Creek Park",
    "activity_date": "2024-10-15"
  },
  "participants_to_rate": [
    {
      "id": "uuid",
      "name": "Alex Chen",
      "profile_photo_url": "https://..."
    }
  ]
}
```

### 7.6 Verification Endpoints

#### POST `/api/verifications/phone`
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "phone_number": "+1234567890"
}
```

**Response:**
```json
{
  "message": "Verification code sent",
  "verification_id": "uuid"
}
```

#### POST `/api/verifications/phone/confirm`
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "verification_id": "uuid",
  "code": "123456"
}
```

**Response:**
```json
{
  "verified": true,
  "verification": {
    "type": "phone",
    "verified_at": "2024-10-13T17:00:00Z"
  }
}
```

#### POST `/api/verifications/linkedin`
**Headers:** `Authorization: Bearer {token}`
OAuth redirect flow

#### POST `/api/verifications/id`
**Headers:** `Authorization: Bearer {token}`
**Content-Type:** `multipart/form-data`

**Request:**
```
id_document: [file]
```

**Response:**
```json
{
  "message": "ID submitted for review",
  "verification_id": "uuid"
}
```

### 7.7 Notification Endpoints

#### GET `/api/notifications`
**Headers:** `Authorization: Bearer {token}`
**Query Parameters:**
- `type`: String (optional) - Filter by notification type
- `unread_only`: Boolean (optional) - Only unread notifications

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "rsvp_confirmation",
      "title": "RSVP Confirmed",
      "message": "You're confirmed for Tennis at Rock Creek Park...",
      "related_activity_id": "uuid",
      "is_read": false,
      "created_at": "2024-10-13T15:00:00Z"
    }
  ],
  "unread_count": 5
}
```

#### PATCH `/api/notifications/{id}/read`
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "message": "Notification marked as read"
}
```

#### POST `/api/notifications/mark-all-read`
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "message": "All notifications marked as read"
}
```

### 7.8 Report Endpoints

#### POST `/api/reports`
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "reported_user_id": "uuid",
  "activity_id": "uuid",
  "reason": "inappropriate_behavior",
  "description": "User was aggressive and made me feel unsafe..."
}
```

**Response:**
```json
{
  "id": "uuid",
  "message": "Report submitted successfully. We'll review this within 24 hours."
}
```

---

## 8. Authentication & Authorization

### 8.1 Authentication Methods

#### Primary: Email/Password
- Minimum password requirements: 8 characters, 1 uppercase, 1 number
- Passwords hashed using bcrypt (cost factor: 12)
- JWT tokens for session management

#### Optional: OAuth
- Google OAuth 2.0
- LinkedIn OAuth 2.0

### 8.2 Session Management

#### JWT Token Structure
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "iat": 1697203200,
  "exp": 1697289600
}
```

- **Access Token:** 24 hours expiry
- **Refresh Token:** 30 days expiry
- Stored in httpOnly cookies (primary) or localStorage (fallback)

### 8.3 Authorization Levels

#### Public (No Auth Required)
- Landing page
- Login/Signup pages

#### Authenticated Users
- All other screens and API endpoints
- Can view and join activities
- Can create activities
- Can message other participants
- Can rate activities they attended

#### Activity Hosts (Additional Permissions)
- Can edit their own activities
- Can remove participants (if inappropriate behavior)
- Can cancel activities

#### Admin (Future)
- View and action reports
- Ban users
- Edit/delete any content

### 8.4 Row-Level Security (RLS) Policies

If using Supabase, implement these RLS policies:

```sql
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Anyone authenticated can read activities
CREATE POLICY "Authenticated users can view activities" ON activities
  FOR SELECT USING (auth.role() = 'authenticated');

-- Users can create activities
CREATE POLICY "Users can create activities" ON activities
  FOR INSERT WITH CHECK (auth.uid() = host_id);

-- Users can only read messages where they are sender or recipient
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (
    auth.uid() = sender_id OR 
    auth.uid() = recipient_id OR
    EXISTS (
      SELECT 1 FROM activity_participants 
      WHERE activity_id = messages.activity_id 
      AND user_id = auth.uid()
    )
  );
```

---

## 9. Features by Screen

### 9.1 Landing Page

#### Components
- Hero section with value proposition
- Feature highlights (3-4 cards)
- How it works (3-step process)
- CTA buttons (Sign Up, Log In)

#### Key Messages
- "Find people ready to play sports, hang out, or attend events together"
- Emphasis on safety and trust
- Today/this week focus

### 9.2 Login/Signup

#### Login Form Fields
- Email (required, validation)
- Password (required)
- "Remember me" checkbox
- "Forgot password" link
- Social auth buttons (Google, LinkedIn)

#### Signup Form Fields
- Email (required, unique, validation)
- Password (required, strength indicator)
- Confirm password (required, match validation)
- Name (required, 2-50 characters)
- Terms of service acceptance (required)
- Social auth buttons (Google, LinkedIn)

#### Validations
- Email format validation
- Password strength requirements
- Duplicate email checking
- Rate limiting on submit

### 9.3 Profile Setup

#### Step 1: Basic Information
- Name (pre-filled from signup)
- Location (required, autocomplete)
- Interests selection
  - Predefined tags (clickable)
  - Custom interest input
  - Minimum 1 interest required
- Profile photo (required, max 5MB)
- Additional photos (optional, max 2, max 5MB each)

#### Step 2: Sports & Fitness
- "Interested in sports?" toggle
- If yes:
  - Multi-select sport types (grid layout)
  - Skill level dropdown for each selected sport
  - Options: Beginner, Intermediate, Advanced, Just for fun

#### Step 3: Optional Verification
- Phone verification (SMS code)
- LinkedIn connection (OAuth)
- ID upload (manual review)
- Benefits explanation

#### Submit
- All required fields completed
- Create trust score record (starting level: "New")
- Redirect to main feed

### 9.4 Main Feed

#### Header
- App logo/name
- Icons: Messages, Notifications, Profile, Settings

#### Create Activity Button
- Prominent placement
- Fixed/sticky on scroll

#### Filters
- Compact filter icon + dropdown
- Location search input
- Category dropdown:
  - All Categories
  - Sports - Beginner
  - Sports - Intermediate
  - Sports - Advanced
  - Sports - Just for fun
  - Sports - Competitive
  - Social
  - Events
  - Food & Drink
  - Study
  - Outdoors
- Clear all button (when filters active)
- Active filters displayed as badges

#### Tabs
1. **Nearby Feed** (default)
   - Shows all activities matching filters
   - Sorted by date/time
   - Card view with:
     - Host info (name, avatar, trust badge, verified badge)
     - Activity type badge
     - Skill level badge (if sports)
     - Optional image
     - Description
     - Location, time, attendee count
     - "Join" button + "Message" icon
2. **My Posts**
   - Activities user created
   - Empty state if none
3. **Joined**
   - Activities user joined
   - Empty state if none

#### Activity Card Details
- Host avatar and name
- Verification badge (green shield if verified)
- Trust score badge (New, Reliable, Super Reliable)
- Activity type badge
- Skill level badge (for sports only)
- Activity image (if provided)
- Description text
- Location (with pin icon)
- Date/time (with clock icon)
- Attendees count (X/Y people going)
- Join button (primary CTA)
- Message button (secondary)

#### Interactions
- Click card → Navigate to activity details
- Click join → Navigate to activity details first
- Click message → Open direct message (if joined)

### 9.5 Create Post

#### Form Sections

**Section 1: Activity Details**
- Activity type dropdown (required)
  - Tennis, Basketball, Soccer, Running, Hiking, Gym, Coffee, Drinks, Dinner, Concert, Movie, etc.
  - "Other" option with custom text input
- Skill level dropdown (conditional: shown only for sports)
  - All skill levels welcome
  - Beginners only
  - Intermediate players
  - Advanced players
  - Just for fun (any level)
- Description textarea (required, 20-500 characters)

**Section 2: When & Where**
- Location input (required, autocomplete with Google Places API)
  - Tooltip: "Pick a safe, public place"
- Date picker (required, today or future)
- Time picker (required, start time)
- Max attendees dropdown (required)
  - Just 1 person (one-on-one)
  - 2-20 people
- Event link input (optional, URL validation)

**Preview Section**
- Real-time preview of how post will appear
- Shows all entered information
- Updates as user types

**Verification Reminder Banner**
- Shown at top
- "Verified members get more responses"
- "Verify Now" button

**Submit Button**
- Disabled until all required fields complete
- "Post Activity" text

#### Validations
- All required fields
- Date cannot be in past
- Location must be selected from autocomplete
- Description length limits
- URL format for event link

### 9.6 Activity Details

#### Safety Banner
- Yellow/amber background
- Shield icon
- "Meet in public spaces. Report suspicious users if something feels wrong."

#### Activity Image
- Full-width hero image (if provided)
- Fallback to placeholder if none

#### Activity Header
- Activity type badge
- Title
- Spots remaining count
- Description

#### Event Details
- Location (with full address)
- Date and time range
- Attendee count
- Event link (if provided, opens in new tab)

#### Host Section (Card)
- Host avatar
- Name
- Verification badge
- Trust score badge
- "Member since [date]"
- "X activities completed"
- "View Profile" button

#### Attendees Section (Card)
- "Who's Going (X)" header
- List of participants:
  - Avatar
  - Name
  - "Host" badge for host

#### Group Chat (Conditional: Only if User Joined)
- "Group Chat" header with message icon
- Sample messages from other participants
- Message input field
- Send button

#### Action Buttons (Sticky Footer)

**If NOT Joined:**
- "+1 Join Activity" button (primary, full width)
- Message icon button (secondary)
- Disabled if activity full

**If Joined:**
- "You're going!" message with checkmark
- "Leave Activity" button (outline)
- "Chat" button (primary)

#### Interactions
- Join → Join activity, enable chat, trigger notification
- Message → Open direct message with host
- Leave → Confirm dialog, then leave activity
- Report flag icon → Report user/activity

### 9.7 Rating System

#### Trigger
- Shown after activity completion (next day or when user opens app)
- Can be accessed from notifications

#### Activity Summary
- Activity title
- Date
- Host name and avatar

#### Rating Form (For Each Participant)
- Participant avatar and name
- "Did they show up?" radio buttons:
  - ✓ Yes (+1 Trust)
  - ✗ No (-1 Trust)
  - ~ Late but showed up (No change)
- Optional review textarea
  - Placeholder: "Great teammate, very punctual, fun to hang out with..."
  - Character limit: 200
  - Guidance: "Keep reviews constructive and helpful"

#### Trust Score Info Banner
- Explanation of trust levels:
  - New → Starting level
  - Reliable → 5+ successful activities
  - Super Reliable → 15+ successful activities

#### Submit Button
- Disabled until all participants rated
- "Submit Ratings"

#### Success Screen
- Checkmark animation
- "Thanks for your feedback!"
- "Your ratings help build a trusted community"
- Trust score updates:
  - ✓ Trust scores updated
  - ✓ Your reliability score increased
- Auto-redirect to feed after 2 seconds

### 9.8 Chats/Messages

#### Layout
- Two-column layout (desktop)
- Single view with navigation (mobile)

#### Left Panel: Conversation List
- Search bar (search by name or activity)
- Conversation previews:
  - Avatar (with online indicator dot)
  - Name
  - Last message preview
  - Timestamp
  - Unread count badge
  - Activity title badge
- Sorted by most recent message

#### Right Panel: Message Thread
- Header:
  - Back button (mobile)
  - Avatar
  - Name
  - Activity title (smaller text)
  - Online status badge
  - Options menu
- Safety warning banner at top
- Message thread:
  - Messages grouped by sender
  - Timestamp
  - Current user messages (right, primary color)
  - Other user messages (left, muted color)
- Message input:
  - Text input field
  - Send button (disabled if empty)
  - Enter to send

#### Empty States
- No conversations: "Start chatting with activity participants"
- No conversation selected: "Select a conversation to start messaging"

#### Real-time Features
- Online status indicators
- Typing indicators (future)
- Message delivery status (future)

### 9.9 Notifications

#### Tabs
1. **Recent** - All recent notifications
2. **Reminders** - Activity reminders and safety checks
3. **Activity** - Activity-specific updates

#### Notification Types

**Recent:**
- RSVP confirmations
- New messages
- Activity reminders
- Someone joined your activity
- Activity updates/changes

**Reminders:**
- Safety check (1 hour before activity)
- Activity starting soon (30 min before)
- Rate activity prompt (day after)

**Activity:**
- Someone joined your activity (with avatar)
- Someone left your activity
- Activity cancelled by host
- Rate activity prompt (with action button)

#### Notification Card
- Icon with color-coded background
- Title
- Message text
- Timestamp
- Action button (some notifications)
- Click to navigate to related activity/message

#### Actions
- "Mark All Read" button in header
- Individual click to mark as read
- Click notification to navigate to related content

### 9.10 Verification & Safety

#### Tabs
1. **Profile** - User profile information
2. **Verification** - Verification options and progress
3. **Safety Tips** - Safety guidelines

#### Profile Tab
- Name, location, bio
- Interests tags
- Sports & skill levels section
  - Each sport listed with skill level badge
  - Pro tip about including skill levels

#### Verification Tab

**Progress Card:**
- Progress bar (X/4 completed)
- Current status badge (Verified/Unverified)
- Trust score badge

**Verification Options:**
- Phone Number
  - Icon, description
  - "Verify" button → SMS verification flow
  - Checkmark when complete
- LinkedIn Profile
  - Icon, description
  - "Connect" button → OAuth flow
  - Checkmark when complete
- ID Verification
  - Icon, description
  - "Upload" button → File upload
  - "Under Review" status
- Profile Photos
  - Icon, description
  - Checkmark (completed in profile setup)

**Benefits Card:**
- Gradient background
- List of benefits:
  - ✓ Get verified badge
  - ✓ Appear higher in searches
  - ✓ Get more responses
  - ✓ Build trust

#### Safety Tips Tab

**Safety Guidelines Card:**
- Meet in Public Places
  - Icon, title, description
  - "Always choose busy, well-lit public locations"
- Share Your Plans
  - Icon, title, description
  - "Tell a friend where you're going"
- Use In-App Communication
  - Icon, title, description
  - "Keep conversations on SERE until comfortable"
- Trust Your Instincts
  - Icon, title, description
  - "If something feels off, it's okay to cancel"

**Red Flags Card:**
- Red/amber styling
- Warning icon
- List of red flags:
  - Asking to meet in private
  - Pressuring for personal info
  - Inconsistent stories
  - Aggressive messages
  - Refusing to meet in public
  - No verification badges

**Reporting Card:**
- Flag icon
- "Report Suspicious Users"
- Description of reporting process
- "Report a User" button

**Emergency Card:**
- Amber background
- "In Case of Emergency"
- "Call 911 if in immediate danger"

#### Account Section
- Sign Out button (destructive styling)

---

## 10. Safety & Trust System

### 10.1 Trust Score Calculation

#### Initial State
- New users start with trust level: "New"
- Score: 0
- Displayed on all user profiles and activity cards

#### Trust Score Events

| Event | Score Change |
|-------|--------------|
| Activity completed + positive rating | +2 points |
| Activity completed + late rating | +1 point |
| Activity completed + no-show rating | -3 points |
| Hosted activity completed successfully | +1 point |
| Multiple no-shows (3+) | Account review |
| Positive review left by others | +0.5 points |

#### Trust Levels

| Level | Requirements | Badge Color |
|-------|-------------|-------------|
| New | Starting level | Secondary/Gray |
| Reliable | 5+ completed activities, score ≥ 10 | Secondary/Blue |
| Super Reliable | 15+ completed activities, score ≥ 30 | Primary/Green |

#### Trust Score Updates
- Calculated in real-time when ratings submitted
- Background job recalculates daily at 2 AM UTC
- Database function `calculate_trust_score(user_id)`

```sql
CREATE OR REPLACE FUNCTION calculate_trust_score(target_user_id UUID)
RETURNS void AS $$
DECLARE
  total_score INTEGER := 0;
  completed_count INTEGER;
  positive_count INTEGER;
  negative_count INTEGER;
  new_level VARCHAR(50);
BEGIN
  -- Count completed activities
  SELECT COUNT(*) INTO completed_count
  FROM activity_participants ap
  JOIN activities a ON a.id = ap.activity_id
  WHERE ap.user_id = target_user_id
    AND a.status = 'completed'
    AND a.activity_date < CURRENT_DATE;
  
  -- Count ratings
  SELECT 
    COUNT(*) FILTER (WHERE showed_up = TRUE AND was_late = FALSE),
    COUNT(*) FILTER (WHERE showed_up = FALSE)
  INTO positive_count, negative_count
  FROM ratings
  WHERE rated_user_id = target_user_id;
  
  -- Calculate score
  total_score := (positive_count * 2) - (negative_count * 3);
  
  -- Determine level
  IF completed_count >= 15 AND total_score >= 30 THEN
    new_level := 'super_reliable';
  ELSIF completed_count >= 5 AND total_score >= 10 THEN
    new_level := 'reliable';
  ELSE
    new_level := 'new';
  END IF;
  
  -- Update trust score
  UPDATE trust_scores
  SET 
    score = total_score,
    level = new_level,
    activities_completed = completed_count,
    positive_ratings = positive_count,
    negative_ratings = negative_count,
    last_calculated_at = NOW(),
    updated_at = NOW()
  WHERE user_id = target_user_id;
END;
$$ LANGUAGE plpgsql;
```

### 10.2 Verification System

#### Phone Verification
1. User enters phone number
2. System sends 6-digit SMS code via Twilio
3. User enters code
4. If valid, phone verification marked complete
5. Timeout: 10 minutes

#### LinkedIn Verification
1. User clicks "Connect LinkedIn"
2. OAuth flow with LinkedIn API
3. Verify profile exists and is legitimate
4. Store connection, mark verified
5. Optionally import profile data

#### ID Verification
1. User uploads government-issued ID photo
2. Stored securely, encrypted
3. Manual review by admin (future: automated via Onfido)
4. Approval/rejection within 24 hours
5. ID images deleted after verification

#### Photo Verification
- Automatically verified when profile photos uploaded
- At least 1 clear photo of face required
- Future: Add liveness detection

### 10.3 Safety Features

#### Pre-Activity
- Safety reminder banner on all activity pages
- Location guidelines (public places only)
- "Share your plans" prompt
- Notification 1 hour before: "Remember to meet in a public place"

#### During Activity
- In-app check-in button (future)
- Emergency button (future)

#### Post-Activity
- Rating system to report no-shows
- Report user option
- Trust score adjustment

#### Reporting System
- Report button on user profiles and activities
- Report reasons:
  - Inappropriate behavior
  - Didn't show up
  - Made me feel unsafe
  - Spam/scam
  - Other (with text description)
- Admin review queue
- Actions: Warning, suspension, ban

### 10.4 Privacy Protections
- Real phone numbers never shared (in-app messaging only)
- Last names optional
- Exact home addresses never required
- Block user feature
- Report anonymous to reported user

---

## 11. Real-time Features

### 11.1 Real-time Messaging

#### Technology
- **Primary:** Supabase Realtime subscriptions
- **Alternative:** Socket.io with Redis pub/sub

#### Implementation (Supabase)
```javascript
// Subscribe to new messages
const subscription = supabase
  .channel(`messages:activity:${activityId}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `activity_id=eq.${activityId}`
    },
    (payload) => {
      // Add new message to UI
      addMessage(payload.new);
    }
  )
  .subscribe();
```

#### Features
- Instant message delivery
- Online/offline status indicators
- Message read receipts (future)
- Typing indicators (future)

### 11.2 Live Activity Updates

#### Subscriptions
- New participant joins activity
- Participant leaves activity
- Activity details updated
- Activity cancelled
- Message posted to group

#### Implementation
```javascript
// Subscribe to activity updates
const subscription = supabase
  .channel(`activity:${activityId}`)
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'activities',
      filter: `id=eq.${activityId}`
    },
    (payload) => {
      // Update activity details in UI
      updateActivity(payload.new);
    }
  )
  .subscribe();
```

### 11.3 Presence System

#### Online Status
- Users marked online when active in app
- Heartbeat every 30 seconds
- Offline after 2 minutes of inactivity

#### Implementation (Supabase Presence)
```javascript
const channel = supabase.channel('online-users');

// Track presence
channel
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState();
    // Update UI with online users
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({
        user_id: currentUser.id,
        online_at: new Date().toISOString()
      });
    }
  });
```

---

## 12. Location & Search

### 12.1 Location Services

#### Geolocation
- Request user's current location on first app use
- Store in localStorage for subsequent visits
- Allow manual location change

#### Address Autocomplete
- Use Google Places Autocomplete API
- When creating activity, location field uses autocomplete
- Store:
  - Display location (e.g., "Rock Creek Park, DC")
  - Full address
  - Latitude/longitude

#### Nearby Search
- Default: 10-mile radius
- User can adjust radius: 5, 10, 25, 50 miles
- Uses PostGIS/earthdistance for database queries

### 12.2 Search Functionality

#### Activity Search Query
```sql
SELECT a.*, 
  earth_distance(
    ll_to_earth(a.latitude, a.longitude),
    ll_to_earth($1, $2)
  ) / 1609.34 AS distance_miles
FROM activities a
WHERE earth_box(ll_to_earth($1, $2), $3 * 1609.34) @> ll_to_earth(a.latitude, a.longitude)
  AND a.status = 'active'
  AND a.activity_date >= CURRENT_DATE
  AND ($4 IS NULL OR a.category = $4)
ORDER BY a.activity_date, a.start_time
LIMIT 20 OFFSET $5;

-- Parameters:
-- $1 = user latitude
-- $2 = user longitude
-- $3 = radius in miles
-- $4 = category filter (optional)
-- $5 = offset for pagination
```

#### Search Features
- Filter by location (text search)
- Filter by category/activity type
- Filter by skill level
- Filter by date range
- Sort by: Date, Distance, Popularity

---

## 13. Notifications System

### 13.1 Notification Types

#### Real-time In-App Notifications
- Badge count on bell icon
- Notification panel with tabs
- Toast notifications for important events

#### Email Notifications (Future)
- Activity reminders (1 day before, 1 hour before)
- New messages
- Someone joined your activity
- Weekly activity digest

#### Push Notifications (Future Phase)
- Mobile app only
- Same triggers as email

### 13.2 Notification Triggers

| Trigger Event | Type | Timing |
|--------------|------|--------|
| User joins your activity | activity_update | Immediate |
| New message received | new_message | Immediate |
| Activity in 1 hour | activity_reminder | 1 hour before |
| Activity tomorrow | activity_reminder | 1 day before |
| Please rate activity | rate_activity | 1 day after |
| Activity cancelled | activity_update | Immediate |
| Verification approved | verification_update | Immediate |

### 13.3 Notification Database Trigger

```sql
-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'activity_participants' AND TG_OP = 'INSERT' THEN
    -- Notify host when someone joins
    INSERT INTO notifications (user_id, type, title, message, related_activity_id, related_user_id)
    SELECT 
      a.host_id,
      'someone_joined',
      'Someone Joined Your Activity',
      u.name || ' joined ' || a.title,
      NEW.activity_id,
      NEW.user_id
    FROM activities a
    JOIN users u ON u.id = NEW.user_id
    WHERE a.id = NEW.activity_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on activity_participants
CREATE TRIGGER notification_trigger
AFTER INSERT ON activity_participants
FOR EACH ROW
EXECUTE FUNCTION create_notification();
```

### 13.4 Notification Scheduling

Use a background job scheduler (pg_cron for PostgreSQL or external like node-cron):

```javascript
// Example: Daily job to send activity reminders
cron.schedule('0 * * * *', async () => {
  // Find activities starting in 1 hour
  const upcomingActivities = await db.query(`
    SELECT a.*, ap.user_id
    FROM activities a
    JOIN activity_participants ap ON ap.activity_id = a.id
    WHERE a.activity_date = CURRENT_DATE
      AND a.start_time BETWEEN NOW() AND NOW() + INTERVAL '1 hour'
      AND a.status = 'active'
  `);
  
  // Create notifications
  for (const activity of upcomingActivities) {
    await createNotification({
      user_id: activity.user_id,
      type: 'activity_reminder',
      title: 'Activity Starting Soon',
      message: `${activity.title} starts in 1 hour`,
      related_activity_id: activity.id
    });
  }
});
```

---

## 14. Frontend Architecture

### 14.1 Component Structure

```
/src
  /components
    /features
      /auth
        AuthForms.tsx (Login/Signup)
      /profile
        ProfileSetup.tsx
        ProfileView.tsx
      /activities
        MainFeed.tsx
        ActivityCard.tsx
        ActivityFilters.tsx
        CreatePost.tsx
        ActivityDetails.tsx
      /messaging
        Chats.tsx
        ConversationList.tsx
        MessageThread.tsx
      /notifications
        NotificationsPage.tsx
        NotificationItem.tsx
      /ratings
        RatingSystem.tsx
        RatingForm.tsx
      /safety
        VerificationSafety.tsx
        SafetyBanner.tsx
    /ui (Shadcn components)
    /layout
      Header.tsx
      Navigation.tsx
      Footer.tsx
    /shared
      LoadingSpinner.tsx
      ErrorBoundary.tsx
      EmptyState.tsx
  /contexts
    AuthContext.tsx
    NotificationContext.tsx
  /hooks
    useAuth.ts
    useActivities.ts
    useMessages.ts
    useNotifications.ts
    useLocation.ts
  /lib
    supabase.ts (or api.ts)
    utils.ts
  /types
    index.ts
  App.tsx
  main.tsx
```

### 14.2 State Management

#### Global State (Context API)
- Authentication state
- Current user profile
- Notification count
- Online status

```typescript
// AuthContext.tsx
interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({});
```

#### Local State (useState)
- Form inputs
- UI state (modals, dropdowns, etc.)
- Filters and search

#### Server State (React Query - Recommended)
- Fetch and cache API data
- Automatic refetching
- Optimistic updates

```typescript
// useActivities.ts
export function useActivities(filters: ActivityFilters) {
  return useQuery({
    queryKey: ['activities', filters],
    queryFn: () => fetchActivities(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### 14.3 Routing

Using React Router v6:

```typescript
// App.tsx routes
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<AuthForms isLogin />} />
  <Route path="/signup" element={<AuthForms />} />
  
  {/* Protected routes */}
  <Route element={<ProtectedRoute />}>
    <Route path="/profile-setup" element={<ProfileSetup />} />
    <Route path="/feed" element={<MainFeed />} />
    <Route path="/create" element={<CreatePost />} />
    <Route path="/activity/:id" element={<ActivityDetails />} />
    <Route path="/messages" element={<Chats />} />
    <Route path="/notifications" element={<NotificationsPage />} />
    <Route path="/rate/:activityId" element={<RatingSystem />} />
    <Route path="/profile" element={<VerificationSafety />} />
  </Route>
</Routes>
```

### 14.4 Error Handling

#### Error Boundary
```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

#### API Error Handling
```typescript
try {
  const response = await api.createActivity(data);
  toast.success('Activity created!');
} catch (error) {
  if (error.status === 401) {
    // Handle auth error
    signOut();
  } else if (error.status === 400) {
    // Handle validation error
    toast.error(error.message);
  } else {
    // Handle unexpected error
    toast.error('Something went wrong. Please try again.');
  }
}
```

### 14.5 Performance Optimizations

#### Code Splitting
```typescript
// Lazy load routes
const MainFeed = lazy(() => import('./components/MainFeed'));
const ActivityDetails = lazy(() => import('./components/ActivityDetails'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    {/* ... */}
  </Routes>
</Suspense>
```

#### Image Optimization
- Use `ImageWithFallback` component
- Lazy load images below fold
- Use appropriate image formats (WebP)
- Serve different sizes for different devices

#### Memoization
```typescript
const filteredActivities = useMemo(() => {
  return activities.filter(/* ... */);
}, [activities, filters]);
```

---

## 15. Security & Privacy

### 15.1 Security Measures

#### API Security
- **HTTPS only** in production
- **CORS configuration** - whitelist frontend domain
- **Rate limiting** - Prevent abuse (e.g., 100 requests/minute per IP)
- **SQL injection prevention** - Use parameterized queries
- **XSS prevention** - Sanitize user input, use Content Security Policy
- **CSRF protection** - Use CSRF tokens for state-changing requests

#### Authentication Security
- **Password requirements** - Min 8 chars, 1 uppercase, 1 number, 1 special char
- **Password hashing** - bcrypt with cost factor 12
- **JWT security** - Short expiry, httpOnly cookies
- **OAuth security** - Verify OAuth tokens, validate state parameter
- **Account lockout** - After 5 failed login attempts (15 min lockout)

#### File Upload Security
- **File type validation** - Only allow images (JPEG, PNG, WebP)
- **File size limits** - Max 5MB per image
- **Virus scanning** - Scan uploads with ClamAV
- **CDN delivery** - Serve files from CDN with signed URLs

### 15.2 Privacy Measures

#### Data Collection
- **Minimal data** - Only collect what's necessary
- **Explicit consent** - Terms of service and privacy policy
- **Data retention** - Delete inactive accounts after 2 years

#### User Privacy
- **Optional last names** - Only first names required
- **No phone number sharing** - All messaging in-app
- **Location privacy** - Only share approximate location (neighborhood, not exact address)
- **Profile visibility** - Only visible to verified users
- **Block/report** - Users can block others

#### GDPR Compliance (if applicable)
- **Right to access** - Users can download their data
- **Right to deletion** - Users can delete their account and data
- **Data portability** - Export data in JSON format
- **Cookie consent** - Banner for EU users

### 15.3 Data Encryption

#### At Rest
- Database encryption (managed by Supabase/AWS)
- Encrypted file storage
- ID documents encrypted with AES-256

#### In Transit
- TLS 1.3 for all API requests
- WSS (WebSocket Secure) for real-time connections

### 15.4 Security Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
Referrer-Policy: strict-origin-when-cross-origin
```

---

## 16. Performance Requirements

### 16.1 Response Time Targets

| Operation | Target | Max Acceptable |
|-----------|--------|----------------|
| Page load (initial) | < 2s | 3s |
| Page load (subsequent) | < 1s | 2s |
| API request | < 500ms | 1s |
| Real-time message | < 100ms | 300ms |
| Image load | < 1s | 2s |

### 16.2 Scalability Targets

#### MVP Phase (Months 0-6)
- **Users:** 1,000 - 10,000
- **Daily active users:** 100 - 500
- **Activities created/day:** 50 - 200
- **Messages/day:** 500 - 2,000

#### Growth Phase (Months 6-12)
- **Users:** 10,000 - 50,000
- **Daily active users:** 1,000 - 5,000
- **Activities created/day:** 500 - 2,000
- **Messages/day:** 5,000 - 20,000

### 16.3 Database Performance

#### Indexes
All critical queries must use indexes (listed in schema section)

#### Query Performance
- No query should take > 500ms
- Use EXPLAIN ANALYZE to optimize slow queries
- Implement query result caching for frequently accessed data

#### Connection Pooling
- Use PgBouncer or similar
- Min 10 connections, max 100 connections

### 16.4 Frontend Performance

#### Lighthouse Scores (Target)
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90

#### Bundle Size
- Initial bundle: < 200KB gzipped
- Total JS: < 500KB gzipped

#### Optimization Techniques
- Code splitting by route
- Tree shaking
- Lazy loading images
- Service worker caching (future)

---

## 17. Testing Strategy

### 17.1 Unit Testing

#### Frontend (Jest + React Testing Library)
- **Components:** Test rendering, user interactions, state changes
- **Hooks:** Test custom hooks in isolation
- **Utils:** Test utility functions

```typescript
// Example: ActivityCard.test.tsx
describe('ActivityCard', () => {
  it('should render activity details correctly', () => {
    render(<ActivityCard activity={mockActivity} />);
    expect(screen.getByText(mockActivity.title)).toBeInTheDocument();
  });
  
  it('should call onJoin when join button clicked', () => {
    const onJoin = jest.fn();
    render(<ActivityCard activity={mockActivity} onJoin={onJoin} />);
    fireEvent.click(screen.getByText('Join'));
    expect(onJoin).toHaveBeenCalledWith(mockActivity.id);
  });
});
```

#### Backend (Jest or Vitest)
- **API endpoints:** Test request/response handling
- **Database functions:** Test trust score calculation, etc.
- **Authentication:** Test JWT generation, validation

```typescript
// Example: activities.test.ts
describe('POST /api/activities', () => {
  it('should create activity with valid data', async () => {
    const response = await request(app)
      .post('/api/activities')
      .set('Authorization', `Bearer ${validToken}`)
      .send(validActivityData);
    
    expect(response.status).toBe(201);
    expect(response.body.title).toBe(validActivityData.title);
  });
  
  it('should return 401 if not authenticated', async () => {
    const response = await request(app)
      .post('/api/activities')
      .send(validActivityData);
    
    expect(response.status).toBe(401);
  });
});
```

### 17.2 Integration Testing

#### API Integration Tests
- Test full request/response cycle
- Test database interactions
- Test real-time updates

#### E2E Critical Flows
1. Sign up → Profile setup → Create activity
2. Login → Browse activities → Join activity → Message
3. Complete activity → Rate participants
4. Profile verification flow

### 17.3 E2E Testing (Playwright or Cypress)

```typescript
// Example: activity-creation.spec.ts
test('user can create an activity', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await page.click('text=Create New Activity');
  await page.selectOption('select[name="activity"]', 'Tennis');
  await page.fill('[name="description"]', 'Looking for tennis partners');
  await page.fill('[name="location"]', 'Central Park');
  // ... fill other fields
  
  await page.click('text=Post Activity');
  await expect(page).toHaveURL('/feed');
  await expect(page.locator('text=Looking for tennis partners')).toBeVisible();
});
```

### 17.4 Performance Testing

#### Load Testing (Artillery or k6)
- Simulate 100-1000 concurrent users
- Test peak load scenarios (e.g., Friday evening when most activities posted)
- Measure response times under load

```yaml
# artillery-config.yml
config:
  target: 'https://api.sere.com'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
  
scenarios:
  - name: 'Browse activities'
    flow:
      - get:
          url: '/api/activities'
```

### 17.5 Security Testing

- **OWASP Top 10** - Test for common vulnerabilities
- **Penetration testing** - Before launch and quarterly
- **Dependency scanning** - Automated with Snyk or Dependabot
- **SQL injection testing** - Automated with SQLMap

### 17.6 Testing Coverage Goals

- **Unit tests:** > 80% code coverage
- **Integration tests:** All critical API endpoints
- **E2E tests:** All primary user flows
- **Performance tests:** All major pages and API endpoints

---

## 18. Deployment & Infrastructure

### 18.1 Deployment Architecture

#### Frontend
- **Hosting:** Vercel (recommended) or Netlify
- **Advantages:** 
  - Automatic builds on Git push
  - Global CDN
  - Preview deployments for PRs
  - Zero-downtime deployments

#### Backend (Supabase)
- **Hosting:** Managed by Supabase
- **Regions:** Choose closest to target users
- **Database:** PostgreSQL managed by Supabase
- **Storage:** Supabase Storage for user photos

#### Alternative Backend (Custom)
- **App Server:** AWS ECS/Fargate or Heroku
- **Database:** AWS RDS (PostgreSQL)
- **Storage:** AWS S3
- **Load Balancer:** AWS ALB

### 18.2 Environments

#### Development
- **URL:** `http://localhost:3000`
- **Backend:** Local Supabase or dev Supabase project
- **Data:** Mock data and test accounts

#### Staging
- **URL:** `https://staging.sere.com`
- **Backend:** Supabase staging project
- **Data:** Copy of production data (anonymized)
- **Purpose:** Test before production deploy

#### Production
- **URL:** `https://sere.com` and `https://www.sere.com`
- **Backend:** Supabase production project
- **Data:** Real user data
- **Monitoring:** Full logging and alerting

### 18.3 CI/CD Pipeline

#### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run lint
  
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 18.4 Database Migrations

#### Migration Tool
- Supabase CLI or Prisma Migrate

#### Migration Workflow
1. Create migration file
2. Test in local environment
3. Apply to staging
4. Test in staging
5. Apply to production (with rollback plan)

```sql
-- Example migration: 20241015_add_skill_levels.sql
-- Add skill_level column to activities table
ALTER TABLE activities 
ADD COLUMN skill_level VARCHAR(50);

-- Create index
CREATE INDEX idx_activities_skill_level ON activities(skill_level);
```

### 18.5 Monitoring & Logging

#### Error Tracking
- **Sentry** for frontend and backend errors
- Alert on critical errors
- Weekly error review

#### Application Monitoring
- **Vercel Analytics** for page performance
- **Supabase Dashboard** for database performance
- **Custom dashboards** for business metrics

#### Logging
- **Application logs:** Structured JSON logs
- **Database logs:** Query logs for slow queries (> 1s)
- **Access logs:** Request logs with IP, endpoint, response time
- **Retention:** 30 days

#### Alerts
- **Error rate > 5%** → Slack/email alert
- **API response time > 2s** → Slack alert
- **Database CPU > 80%** → Email alert
- **Disk usage > 85%** → Email alert

### 18.6 Backup & Disaster Recovery

#### Database Backups
- **Automated daily backups** (Supabase)
- **Retention:** 30 days
- **Testing:** Monthly restore test

#### Disaster Recovery Plan
1. Restore from most recent backup
2. Verify data integrity
3. Update DNS if necessary
4. Notify users if downtime > 15 minutes

#### RTO/RPO Targets
- **Recovery Time Objective (RTO):** 4 hours
- **Recovery Point Objective (RPO):** 24 hours

---

## 19. Analytics & Metrics

### 19.1 Key Performance Indicators (KPIs)

#### User Acquisition
- New signups/day
- Signup conversion rate (landing page visitors → signups)
- Signup source (organic, social, referral)

#### User Engagement
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Monthly Active Users (MAU)
- DAU/MAU ratio (stickiness)
- Average session duration
- Activities created per user
- Activities joined per user

#### Trust & Safety
- Verification completion rate
- Trust score distribution
- Rating submission rate
- Reports filed/week
- No-show rate

#### Retention
- Day 1, Day 7, Day 30 retention
- Churn rate
- Reactivation rate

#### Business Metrics (Future)
- Revenue (if monetization added)
- Conversion to premium (if tiered pricing)
- Lifetime value (LTV)

### 19.2 Event Tracking

#### Key Events to Track

**Authentication:**
- `signup_started`
- `signup_completed`
- `login_completed`
- `oauth_login` (with provider)

**Profile:**
- `profile_setup_started`
- `profile_setup_completed`
- `profile_photo_uploaded`
- `sport_added`
- `verification_started` (with type)
- `verification_completed` (with type)

**Activities:**
- `activity_created` (with category)
- `activity_viewed`
- `activity_joined`
- `activity_left`
- `activity_search` (with filters)
- `activity_filtered` (with filter type)

**Messaging:**
- `message_sent`
- `conversation_started`

**Ratings:**
- `rating_submitted` (with showed_up value)
- `rating_reminder_viewed`

**Safety:**
- `report_submitted` (with reason)
- `safety_guidelines_viewed`

### 19.3 Analytics Implementation

#### Tools
- **Mixpanel** or **PostHog** for product analytics
- **Google Analytics 4** for web analytics
- **Vercel Analytics** for performance

#### Example Implementation

```typescript
// analytics.ts
export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    // Mixpanel
    mixpanel.track(event, properties);
    
    // Google Analytics
    gtag('event', event, properties);
  },
  
  identify: (userId: string, traits?: Record<string, any>) => {
    mixpanel.identify(userId);
    mixpanel.people.set(traits);
  }
};

// Usage
analytics.track('activity_created', {
  category: 'Sports',
  activity_type: 'Tennis',
  has_skill_level: true
});
```

### 19.4 Dashboards

#### Product Dashboard
- MAU, WAU, DAU trends
- New signups/day
- Activities created/joined per day
- Verification rate
- Retention cohorts

#### Operations Dashboard
- API response times
- Error rates
- Database performance
- Active real-time connections

#### Safety Dashboard
- Reports filed/day
- Report resolution time
- No-show rate by user
- Trust score distribution

---

## 20. Future Enhancements

### 20.1 Phase 2 Features (Months 3-6)

#### Payments Integration
- **Use case:** Paid activities (e.g., split concert tickets)
- **Implementation:** Stripe Connect
- **Features:**
  - Host can set activity price
  - Payment held in escrow until activity completes
  - Automatic refunds for no-shows

#### Advanced Matching
- **Algorithm:** Suggest activities based on:
  - User interests and sports
  - Past activity history
  - Location preferences
  - Trust score
- **UI:** "Recommended for You" section

#### Video Chat
- **Use case:** Virtual activities (e.g., online study sessions)
- **Implementation:** Twilio Video or Daily.co
- **Features:**
  - Schedule video calls
  - In-app video rooms
  - Screen sharing

#### Native Mobile Apps
- React Native apps for iOS and Android
- Push notifications
- Location services
- Camera integration

### 20.2 Phase 3 Features (Months 6-12)

#### Premium Subscription
- **Price:** $9.99/month or $99/year
- **Features:**
  - Priority visibility in search
  - Unlimited messages
  - Advanced filters
  - See who viewed your profile
  - Activity analytics

#### Activity Recurring Events
- Host can mark activities as recurring (weekly, biweekly)
- Auto-create instances
- Participants auto-added to future instances

#### Group/Team Creation
- Users can create private groups
- Private group activities
- Team leaderboards

#### Achievements & Gamification
- Badges for milestones (10 activities, 50 activities, etc.)
- Streak tracking (activities per week)
- Leaderboards by city

### 20.3 Phase 4 Features (Year 2+)

#### Live Location Sharing
- Opt-in feature for participants
- Share live location 1 hour before activity
- Safety feature: "I arrived" check-in

#### AI-Powered Recommendations
- Machine learning for activity suggestions
- Optimal times/locations based on user behavior
- Smart notifications (best time to create activity)

#### Partnerships
- Partner with local businesses (gyms, cafes, etc.)
- Sponsored activities
- Discounts for SERE users

#### International Expansion
- Multi-language support
- Currency localization
- Region-specific activity types

### 20.4 Technical Debt & Improvements

#### Performance
- Implement Redis caching layer
- Database query optimization
- CDN for static assets

#### Testing
- Increase unit test coverage to 90%
- Automated E2E tests in CI
- Visual regression testing

#### Infrastructure
- Multi-region deployment
- Auto-scaling based on load
- Blue-green deployments

#### Code Quality
- Migrate to TypeScript (if not already)
- Implement design system
- Code splitting optimization

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Activity** | An event or meetup created by a user |
| **Host** | User who created an activity |
| **Participant** | User who joined an activity |
| **Trust Score** | Numerical score representing user reliability |
| **Trust Level** | Badge level: New, Reliable, Super Reliable |
| **Verification** | Process to confirm user identity (phone, LinkedIn, ID) |
| **No-show** | When a user doesn't attend an activity they joined |
| **Rating** | Post-activity feedback on participants |
| **Skill Level** | Sports proficiency: Beginner, Intermediate, Advanced, Casual |

---

## Appendix B: API Response Examples

### Example: Activity Feed Response

```json
GET /api/activities?lat=38.9072&lng=-77.0369&radius=10

{
  "activities": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Tennis at Rock Creek Park",
      "description": "Looking for intermediate players for doubles. I have extra rackets!",
      "activity_type": "Tennis",
      "category": "Sports",
      "skill_level": "intermediate",
      "location": "Rock Creek Park Tennis Courts, DC",
      "full_address": "5200 Glover Rd NW, Washington, DC 20015",
      "latitude": 38.9583,
      "longitude": -77.0620,
      "activity_date": "2024-10-15",
      "start_time": "18:00:00",
      "end_time": "20:00:00",
      "max_attendees": 4,
      "current_attendees": 3,
      "spots_available": 1,
      "event_link": null,
      "image_url": "https://storage.sere.com/activities/tennis-1.jpg",
      "status": "active",
      "host": {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "Alex Chen",
        "profile_photo_url": "https://storage.sere.com/users/alex-chen.jpg",
        "trust_level": "reliable",
        "is_verified": true,
        "activities_completed": 12,
        "member_since": "2024-08-01T00:00:00Z"
      },
      "participants": [
        {
          "id": "770e8400-e29b-41d4-a716-446655440002",
          "name": "Jamie Smith",
          "profile_photo_url": "https://storage.sere.com/users/jamie-smith.jpg",
          "joined_at": "2024-10-13T14:20:00Z"
        },
        {
          "id": "880e8400-e29b-41d4-a716-446655440003",
          "name": "Sam Wilson",
          "profile_photo_url": "https://storage.sere.com/users/sam-wilson.jpg",
          "joined_at": "2024-10-13T15:45:00Z"
        }
      ],
      "is_joined": false,
      "created_at": "2024-10-13T10:30:00Z",
      "updated_at": "2024-10-13T15:45:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "total_pages": 3,
    "has_more": true
  }
}
```

---

## Appendix C: Database Schema Diagram

```
users
  ├─ id (PK)
  ├─ email
  ├─ password_hash
  ├─ name
  ├─ location
  ├─ profile_photo_url
  └─ ...

user_sports
  ├─ id (PK)
  ├─ user_id (FK → users)
  ├─ sport
  └─ skill_level

trust_scores
  ├─ id (PK)
  ├─ user_id (FK → users)
  ├─ score
  ├─ level
  └─ ...

verifications
  ├─ id (PK)
  ├─ user_id (FK → users)
  ├─ verification_type
  └─ is_verified

activities
  ├─ id (PK)
  ├─ host_id (FK → users)
  ├─ title
  ├─ description
  ├─ activity_type
  ├─ category
  ├─ skill_level
  ├─ location
  ├─ activity_date
  ├─ start_time
  └─ ...

activity_participants
  ├─ id (PK)
  ├─ activity_id (FK → activities)
  ├─ user_id (FK → users)
  └─ joined_at

messages
  ├─ id (PK)
  ├─ activity_id (FK → activities)
  ├─ sender_id (FK → users)
  ├─ recipient_id (FK → users)
  └─ content

ratings
  ├─ id (PK)
  ├─ activity_id (FK → activities)
  ├─ rater_id (FK → users)
  ├─ rated_user_id (FK → users)
  ├─ showed_up
  └─ review

notifications
  ├─ id (PK)
  ├─ user_id (FK → users)
  ├─ type
  ├─ message
  └─ related_activity_id (FK → activities)

reports
  ├─ id (PK)
  ├─ reporter_id (FK → users)
  ├─ reported_user_id (FK → users)
  ├─ activity_id (FK → activities)
  └─ reason
```

---

## Document Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2024-10-13 | Initial specification document | Product Team |

---

**End of Document**
