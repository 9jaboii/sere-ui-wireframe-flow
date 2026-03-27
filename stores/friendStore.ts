import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '../types/database';

interface FriendWithUser {
  id: string;
  user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar_color'>;
}

interface FriendState {
  friends: FriendWithUser[];
  requests: FriendWithUser[];
  isLoading: boolean;

  fetchFriends: (userId: string) => Promise<void>;
  fetchRequests: (userId: string) => Promise<void>;
  sendRequest: (userId: string, friendId: string) => Promise<{ error: Error | null }>;
  acceptRequest: (friendshipId: string) => Promise<{ error: Error | null }>;
  removeFriend: (friendshipId: string) => Promise<{ error: Error | null }>;
}

export const useFriendStore = create<FriendState>((set) => ({
  friends: [],
  requests: [],
  isLoading: false,

  fetchFriends: async (userId) => {
    set({ isLoading: true });
    try {
      // Friends where I'm user_id
      const { data: asUser } = await supabase
        .from('friendships')
        .select(`
          id,
          user:users!friend_id (id, first_name, last_name, avatar_color)
        `)
        .eq('user_id', userId)
        .eq('status', 'accepted');

      // Friends where I'm friend_id
      const { data: asFriend } = await supabase
        .from('friendships')
        .select(`
          id,
          user:users!user_id (id, first_name, last_name, avatar_color)
        `)
        .eq('friend_id', userId)
        .eq('status', 'accepted');

      const all: FriendWithUser[] = [
        ...((asUser || []) as any[]),
        ...((asFriend || []) as any[]),
      ];

      set({ friends: all, isLoading: false });
    } catch (error) {
      console.error('Error fetching friends:', error);
      set({ isLoading: false });
    }
  },

  fetchRequests: async (userId) => {
    set({ isLoading: true });
    try {
      const { data } = await supabase
        .from('friendships')
        .select(`
          id,
          user:users!user_id (id, first_name, last_name, avatar_color)
        `)
        .eq('friend_id', userId)
        .eq('status', 'pending');

      set({ requests: (data || []) as any[], isLoading: false });
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      set({ isLoading: false });
    }
  },

  sendRequest: async (userId, friendId) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({ user_id: userId, friend_id: friendId });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error sending friend request:', error);
      return { error: error as Error };
    }
  },

  acceptRequest: async (friendshipId) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', friendshipId);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error accepting friend request:', error);
      return { error: error as Error };
    }
  },

  removeFriend: async (friendshipId) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error removing friend:', error);
      return { error: error as Error };
    }
  },
}));
