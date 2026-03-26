import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { Database } from '../types/database';
import { storageAdapter } from './storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const isWeb = Platform.OS === 'web';

// No-op lock that bypasses navigator.locks (which can deadlock in Expo web)
const lockNoOp = async (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => {
  return await fn();
};

// Session persistence strategy:
// - Access token: 1hr expiry, auto-refreshed by Supabase client (autoRefreshToken: true)
// - Refresh token: 7 days expiry, stored in SecureStore via storageAdapter (persistSession: true)
// - On refresh failure (e.g., 7+ days inactive): user is signed out via onAuthStateChange in authStore
// - JWT expiry settings are configured in the Supabase dashboard (see constants/index.ts for reference values)
// - On web: use localStorage + no-op lock to avoid navigator.locks deadlock
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isWeb ? globalThis.localStorage : storageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: isWeb,
    ...(isWeb ? { lock: lockNoOp as any } : {}),
  },
});

// Helper to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper to get current session
export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
