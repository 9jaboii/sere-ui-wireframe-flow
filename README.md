# [şere] - React Native Mobile App

Never go alone - Find people ready to play sports, hang out, or attend events together.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (iOS/Android)
- Supabase account (free tier works)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```
Then edit `.env` with your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Set up the database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and run the contents of `supabase/migrations/001_initial_schema.sql`

4. Start the development server:
```bash
npm start
```

5. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

## 📱 Features (MVP - 12 Modules)

### Core Features
- **Authentication** (Module 1): Email/password + Google/Apple OAuth
- **Email Verification** (Module 2): 6-digit OTP verification
- **Avatar Generation** (Module 3): Initials with random colors
- **Session Management** (Module 4): Secure token handling
- **Trusted Circle** (Module 5): Friend connections via invite links
- **Activity Management** (Module 6): Create, edit, cancel activities
- **Activity Feed** (Module 7): See friends' and friends-of-friends' activities
- **Join Requests** (Module 8): Request to join with host approval
- **Group Chat** (Module 9): Real-time activity chats (auto-delete after 10 days)
- **Notifications** (Module 10): Push notifications for requests/updates
- **User Profile** (Module 11): Profile management
- **Completion Tracking** (Module 12): Post-activity confirmation

### Activity Categories
- Sport/Gym (with skill levels: Beginner, Intermediate, Advanced, Just for fun)
- Casual Hangout
- Party
- Other

## 📂 Project Structure

```
/
├── App.tsx                 # Main app entry with navigation
├── screens/                # Screen components
│   ├── AuthScreen.tsx
│   ├── MainFeedScreen.tsx
│   ├── CreatePostScreen.tsx
│   ├── ActivityDetailScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── ChatsScreen.tsx
│   └── NotificationsScreen.tsx
├── components/             # Reusable components
│   └── Avatar.tsx
├── lib/                    # Core libraries
│   └── supabase.ts        # Supabase client configuration
├── stores/                 # State management (Zustand)
│   ├── authStore.ts
│   └── activityStore.ts
├── types/                  # TypeScript types
│   └── database.ts        # Supabase database types
├── constants/              # App constants
│   └── index.ts
├── hooks/                  # Custom React hooks
├── services/               # API services
├── supabase/              # Database migrations
│   └── migrations/
│       └── 001_initial_schema.sql
├── assets/                 # Images, icons, etc.
├── web-reference/          # Original web UI (for reference)
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── babel.config.js        # Babel config
└── .env.example           # Environment template
```

## 🛠 Technology Stack

- **React Native** - Mobile framework
- **Expo** (v52) - Development platform
- **TypeScript** - Type safety
- **Supabase** - Backend (Auth, Database, Realtime)
- **React Navigation** - Navigation system
- **Zustand** - State management
- **Expo Secure Store** - Secure token storage
- **Expo Notifications** - Push notifications

## 🗃️ Database Schema

| Table | Description |
|-------|-------------|
| `users` | User profiles linked to Supabase Auth |
| `friendships` | Bidirectional friend connections |
| `invites` | Invite tokens for friend links |
| `activities` | Activity posts |
| `join_requests` | Requests to join activities |
| `chat_rooms` | Activity group chats |
| `chat_members` | Chat room membership |
| `messages` | Chat messages |
| `notifications` | In-app notifications |
| `device_tokens` | Push notification tokens |
| `verification_tokens` | Email OTP tokens |
| `feedback` | User feedback |

## 🔐 Authentication Flow

1. **Email Sign-up**: User enters email → System generates password → User confirms saved → Email OTP sent → User verifies → Access granted
2. **OAuth Sign-up**: User taps Google/Apple → OAuth flow → Auto-verified → Access granted

## 📋 Feed Visibility

Users can see activities from:
- Direct friends (1st degree)
- Friends of friends (2nd degree)
- Their own activities

No public activities - invite-only network.

## 🎨 Design System

### Colors
- **Primary**: Black (#000000)
- **Background**: White (#FFFFFF)
- **Avatar Palette**: 12 distinct colors (Blue, Red, Green, Amber, Purple, Pink, Teal, Orange, Indigo, Lime, Cyan, Violet)

### Typography
- **Headers**: 18-20px, semi-bold
- **Body**: 14-16px, regular
- **Small**: 12px, regular

## 📦 Building for Production

### Using EAS Build
```bash
npx eas build --platform ios
npx eas build --platform android
```

### Local Development Builds
```bash
npx expo run:ios
npx expo run:android
```

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache
```bash
npx expo start -c
```

2. **Module not found**: Reinstall dependencies
```bash
rm -rf node_modules && npm install
```

3. **Supabase connection issues**: Check `.env` file and ensure credentials are correct

4. **iOS simulator issues**: Reset simulator
```bash
xcrun simctl erase all
```

## 📝 Development Notes

- The `web-reference/` folder contains the original React web UI for design reference
- Database migrations are in `supabase/migrations/` - run them in order
- Realtime is enabled for the `messages` table for live chat

## 📄 License

Private - All rights reserved

## 👥 Support

For issues or questions, contact support@sere.app

---

**[şere]** - Version 0.1.0 MVP
Never go alone 🎉
