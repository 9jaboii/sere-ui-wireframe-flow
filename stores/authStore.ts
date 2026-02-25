import { create } from 'zustand';
import { Session, User as AuthUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types/database';

interface AuthState {
  session: Session | null;
  user: User | null;
  authUser: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<{ error: Error | null; generatedPassword?: string }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithApple: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<{ error: Error | null }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  authUser: null,
  isLoading: true,
  isInitialized: false,

  initialize: async () => {
    try {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Fetch user profile from our users table
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({
          session,
          authUser: session.user,
          user,
          isLoading: false,
          isInitialized: true,
        });
      } else {
        set({
          session: null,
          authUser: null,
          user: null,
          isLoading: false,
          isInitialized: true,
        });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          set({
            session,
            authUser: session.user,
            user,
          });
        } else {
          set({
            session: null,
            authUser: null,
            user: null,
          });
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false, isInitialized: true });
    }
  },

  signInWithEmail: async (email, password) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ isLoading: false });
        return { error };
      }

      // User data will be set by onAuthStateChange listener
      set({ isLoading: false });
      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      return { error: error as Error };
    }
  },

  signUpWithEmail: async (email, password, firstName, lastName) => {
    set({ isLoading: true });
    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        set({ isLoading: false });
        return { error };
      }

      // The user profile will be created by a database trigger
      // User data will be set by onAuthStateChange listener
      set({ isLoading: false });
      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      return { error: error as Error };
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'sere://auth/callback',
        },
      });

      if (error) {
        set({ isLoading: false });
        return { error };
      }

      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      return { error: error as Error };
    }
  },

  signInWithApple: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: 'sere://auth/callback',
        },
      });

      if (error) {
        set({ isLoading: false });
        return { error };
      }

      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      return { error: error as Error };
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
      set({
        session: null,
        authUser: null,
        user: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      set({ isLoading: false });
    }
  },

  refreshUser: async () => {
    const { session } = get();
    if (!session?.user) return;

    try {
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (user) {
        set({ user });
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  },

  updateUser: async (updates) => {
    const { user } = get();
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        return { error };
      }

      // Refresh user data
      await get().refreshUser();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },
}));
