# SERE Mobile App - Project Instructions

## On Project Open
- Read `tasklist.txt` to load the current task list and project progress
- Current progress: 20/38 tasks completed (53%)

## Project Overview
SERE is a social app that helps people find others ready to play sports, hang out, or attend events together. Built with Expo/React Native and Supabase.

## Tech Stack
- **Framework:** Expo SDK 52, React Native 0.76
- **State Management:** Zustand
- **Backend:** Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Navigation:** React Navigation (native-stack)
- **Language:** TypeScript

## Key Files
- `tasklist.txt` - Full task list with completed and pending items
- `SERE_MVP_Technical_Specification.md` - Detailed MVP specification
- `supabase/migrations/001_initial_schema.sql` - Database schema

## Development Commands
```bash
npm install          # Install dependencies
npm start            # Start Expo dev server
npm run ios          # Run on iOS simulator
npm run android      # Run on Android emulator
```

## Environment Setup
Copy `.env.example` to `.env` and fill in:
- EXPO_PUBLIC_SUPABASE_URL
- EXPO_PUBLIC_SUPABASE_ANON_KEY
