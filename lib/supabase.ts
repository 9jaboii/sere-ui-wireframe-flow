import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { Database } from '../types/database';
import { storageAdapter } from './storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Session persistence strategy:
// - Access token: 1hr expiry, auto-refreshed by Supabase client (autoRefreshToken: true)
// - Refresh token: 7 days expiry, stored in SecureStore via storageAdapter (persistSession: true)
// - On refresh failure (e.g., 7+ days inactive): user is signed out via onAuthStateChange in authStore
// - JWT expiry settings are configured in the Supabase dashboard (see constants/index.ts for reference values)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
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
