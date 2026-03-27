import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Activity, ActivityInsert, ActivityWithHost, JoinRequest } from '../types/database';

interface ActivityState {
  activities: ActivityWithHost[];
  myActivities: ActivityWithHost[];
  joinedActivities: ActivityWithHost[];
  currentActivity: ActivityWithHost | null;
  pendingRequests: JoinRequest[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchFeed: (userId: string) => Promise<void>;
  fetchMyActivities: (userId: string) => Promise<void>;
  fetchJoinedActivities: (userId: string) => Promise<void>;
  fetchActivity: (activityId: string) => Promise<void>;
  createActivity: (activity: ActivityInsert) => Promise<{ error: Error | null; data: Activity | null }>;
  updateActivity: (activityId: string, updates: Partial<Activity>) => Promise<{ error: Error | null }>;
  cancelActivity: (activityId: string) => Promise<{ error: Error | null }>;
  requestToJoin: (activityId: string, userId: string) => Promise<{ error: Error | null }>;
  acceptRequest: (requestId: string) => Promise<{ error: Error | null }>;
  rejectRequest: (requestId: string) => Promise<{ error: Error | null }>;
  fetchPendingRequests: (activityId: string) => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  myActivities: [],
  joinedActivities: [],
  currentActivity: null,
  pendingRequests: [],
  isLoading: false,
  error: null,

  fetchFeed: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // Get visible activity IDs via RPC (own + friends + friends-of-friends)
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_visible_activities', { current_user_id: userId })
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true });

      if (!rpcError && rpcData && rpcData.length > 0) {
        // Re-fetch with host join so renderPost has the data it needs
        const activityIds = rpcData.map((a: any) => a.id);
        const { data, error } = await supabase
          .from('activities')
          .select(`
            *,
            host:users!host_user_id (
              id,
              first_name,
              last_name,
              avatar_color
            )
          `)
          .in('id', activityIds)
          .order('event_date', { ascending: true })
          .order('event_time', { ascending: true });

        if (error) throw error;
        set({ activities: data || [], isLoading: false });
        return;
      }

      // Fallback: fetch all active activities (includes own)
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('activities')
        .select(`
          *,
          host:users!host_user_id (
            id,
            first_name,
            last_name,
            avatar_color
          )
        `)
        .eq('status', 'active')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true });

      if (fallbackError) throw fallbackError;
      set({ activities: fallbackData || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching feed:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchMyActivities: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          host:users!host_user_id (
            id,
            first_name,
            last_name,
            avatar_color
          )
        `)
        .eq('host_user_id', userId)
        .order('event_date', { ascending: true });

      if (error) throw error;
      set({ myActivities: data || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching my activities:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchJoinedActivities: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('join_requests')
        .select(`
          activity:activities (
            *,
            host:users!host_user_id (
              id,
              first_name,
              last_name,
              avatar_color
            )
          )
        `)
        .eq('requester_id', userId)
        .eq('status', 'accepted');

      if (error) throw error;

      const activities = data
        ?.map((item) => item.activity)
        .filter((a): a is ActivityWithHost => a !== null) || [];

      set({ joinedActivities: activities, isLoading: false });
    } catch (error) {
      console.error('Error fetching joined activities:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchActivity: async (activityId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          host:users!host_user_id (
            id,
            first_name,
            last_name,
            avatar_color
          )
        `)
        .eq('id', activityId)
        .single();

      if (error) throw error;
      set({ currentActivity: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching activity:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createActivity: async (activity) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert(activity)
        .select()
        .single();

      if (error) throw error;
      set({ isLoading: false });
      return { error: null, data };
    } catch (error) {
      console.error('Error creating activity:', error);
      set({ error: (error as Error).message, isLoading: false });
      return { error: error as Error, data: null };
    }
  },

  updateActivity: async (activityId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('activities')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', activityId);

      if (error) throw error;
      set({ isLoading: false });
      return { error: null };
    } catch (error) {
      console.error('Error updating activity:', error);
      set({ error: (error as Error).message, isLoading: false });
      return { error: error as Error };
    }
  },

  cancelActivity: async (activityId) => {
    return get().updateActivity(activityId, { status: 'canceled' });
  },

  requestToJoin: async (activityId, userId) => {
    set({ isLoading: true, error: null });
    try {
      // Check if can still request (capacity check)
      const { data: canRequest } = await supabase
        .rpc('can_request_join', { activity_id: activityId });

      if (!canRequest) {
        throw new Error('Activity is full');
      }

      // Check if already requested
      const { data: existingRequest } = await supabase
        .from('join_requests')
        .select('id')
        .eq('activity_id', activityId)
        .eq('requester_id', userId)
        .single();

      if (existingRequest) {
        throw new Error('Already requested to join');
      }

      const { error } = await supabase
        .from('join_requests')
        .insert({
          activity_id: activityId,
          requester_id: userId,
        });

      if (error) throw error;
      set({ isLoading: false });
      return { error: null };
    } catch (error) {
      console.error('Error requesting to join:', error);
      set({ error: (error as Error).message, isLoading: false });
      return { error: error as Error };
    }
  },

  acceptRequest: async (requestId) => {
    set({ isLoading: true, error: null });
    try {
      const { data: request, error: fetchError } = await supabase
        .from('join_requests')
        .select('activity_id')
        .eq('id', requestId)
        .single();

      if (fetchError) throw fetchError;

      // Update request status
      const { error } = await supabase
        .from('join_requests')
        .update({
          status: 'accepted',
          decided_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      // Update spots_filled and first_acceptance_at
      const { data: activity } = await supabase
        .from('activities')
        .select('spots_filled, first_acceptance_at')
        .eq('id', request.activity_id)
        .single();

      await supabase
        .from('activities')
        .update({
          spots_filled: (activity?.spots_filled || 0) + 1,
          first_acceptance_at: activity?.first_acceptance_at || new Date().toISOString(),
        })
        .eq('id', request.activity_id);

      set({ isLoading: false });
      return { error: null };
    } catch (error) {
      console.error('Error accepting request:', error);
      set({ error: (error as Error).message, isLoading: false });
      return { error: error as Error };
    }
  },

  rejectRequest: async (requestId) => {
    try {
      const { error } = await supabase
        .from('join_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error rejecting request:', error);
      return { error: error as Error };
    }
  },

  fetchPendingRequests: async (activityId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('join_requests')
        .select(`
          *,
          requester:users!requester_id (
            id,
            first_name,
            last_name,
            avatar_color
          )
        `)
        .eq('activity_id', activityId)
        .eq('status', 'pending');

      if (error) throw error;
      set({ pendingRequests: data || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
