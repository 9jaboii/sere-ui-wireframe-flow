import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface FavoriteState {
  favoriteIds: Set<string>;
  isLoading: boolean;

  fetchFavorites: (userId: string) => Promise<void>;
  toggleFavorite: (userId: string, activityId: string) => Promise<void>;
  isFavorited: (activityId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favoriteIds: new Set(),
  isLoading: false,

  fetchFavorites: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('activity_id')
        .eq('user_id', userId);

      if (error) throw error;
      set({ favoriteIds: new Set((data || []).map((f) => f.activity_id)) });
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  },

  toggleFavorite: async (userId, activityId) => {
    const { favoriteIds } = get();
    const isFav = favoriteIds.has(activityId);

    // Optimistic update
    const newSet = new Set(favoriteIds);
    if (isFav) {
      newSet.delete(activityId);
    } else {
      newSet.add(activityId);
    }
    set({ favoriteIds: newSet });

    try {
      if (isFav) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('activity_id', activityId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: userId, activity_id: activityId });
        if (error) throw error;
      }
    } catch (error) {
      // Revert optimistic update
      console.error('Error toggling favorite:', error);
      set({ favoriteIds });
    }
  },

  isFavorited: (activityId) => {
    return get().favoriteIds.has(activityId);
  },
}));
