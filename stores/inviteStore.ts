import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Invite } from '../types/database';

interface InviteState {
  invites: Invite[];
  isLoading: boolean;

  createInvite: (userId: string) => Promise<{ token: string | null; error: Error | null }>;
  fetchMyInvites: (userId: string) => Promise<void>;
}

export const useInviteStore = create<InviteState>((set) => ({
  invites: [],
  isLoading: false,

  createInvite: async (userId) => {
    try {
      const token = Array.from({ length: 32 }, () =>
        Math.random().toString(36).charAt(2)
      ).join('');

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error } = await supabase.from('invites').insert({
        inviter_id: userId,
        token,
        expires_at: expiresAt.toISOString(),
      });

      if (error) throw error;
      return { token, error: null };
    } catch (error) {
      console.error('Error creating invite:', error);
      return { token: null, error: error as Error };
    }
  },

  fetchMyInvites: async (userId) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('invites')
        .select('*')
        .eq('inviter_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ invites: data || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching invites:', error);
      set({ isLoading: false });
    }
  },
}));
