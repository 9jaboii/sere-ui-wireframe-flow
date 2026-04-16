import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { MessageWithUser } from '../types/database';

export interface ChatRoomWithDetails {
  id: string;
  activity_id: string;
  activity_name: string;
  created_at: string;
  expires_at: string;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
}

interface ChatState {
  chatRooms: ChatRoomWithDetails[];
  messages: MessageWithUser[];
  isLoading: boolean;
  error: string | null;

  fetchChatRooms: (userId: string) => Promise<void>;
  fetchMessages: (roomId: string) => Promise<void>;
  sendMessage: (roomId: string, userId: string, content: string) => Promise<{ error: Error | null }>;
  getOrCreateChatRoom: (activityId: string, userId: string) => Promise<{ roomId: string | null; error: Error | null }>;
  subscribeToMessages: (roomId: string) => () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chatRooms: [],
  messages: [],
  isLoading: false,
  error: null,

  fetchChatRooms: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // Get rooms the user is a member of
      const { data: memberships, error: memberError } = await supabase
        .from('chat_members')
        .select('room_id')
        .eq('user_id', userId);

      if (memberError) throw memberError;

      if (!memberships || memberships.length === 0) {
        set({ chatRooms: [], isLoading: false });
        return;
      }

      const roomIds = memberships.map((m) => m.room_id);

      // Get room details with activity info
      const { data: rooms, error: roomError } = await supabase
        .from('chat_rooms')
        .select(`
          id,
          activity_id,
          created_at,
          expires_at,
          activity:activities!activity_id (
            description,
            category
          )
        `)
        .in('id', roomIds)
        .order('created_at', { ascending: false });

      if (roomError) throw roomError;

      // Get last message for each room
      const chatRooms: ChatRoomWithDetails[] = await Promise.all(
        (rooms || []).map(async (room: any) => {
          const { data: lastMsg } = await supabase
            .from('messages')
            .select('content, sent_at')
            .eq('room_id', room.id)
            .order('sent_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          const activityDesc = room.activity?.description || 'Activity Chat';
          // Use first 40 chars of description as chat name
          const activityName = activityDesc.length > 40
            ? activityDesc.substring(0, 40) + '...'
            : activityDesc;

          return {
            id: room.id,
            activity_id: room.activity_id,
            activity_name: activityName,
            created_at: room.created_at,
            expires_at: room.expires_at,
            last_message: lastMsg?.content || null,
            last_message_at: lastMsg?.sent_at || null,
            unread_count: 0,
          };
        })
      );

      // Sort by last message time
      chatRooms.sort((a, b) => {
        const aTime = a.last_message_at || a.created_at;
        const bTime = b.last_message_at || b.created_at;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });

      set({ chatRooms, isLoading: false });
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchMessages: async (roomId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          user:users!user_id (
            id,
            first_name,
            last_name,
            avatar_color
          )
        `)
        .eq('room_id', roomId)
        .order('sent_at', { ascending: true });

      if (error) throw error;
      set({ messages: (data as MessageWithUser[]) || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching messages:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  sendMessage: async (roomId, userId, content) => {
    try {
      const { error } = await supabase.from('messages').insert({
        room_id: roomId,
        user_id: userId,
        content,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error sending message:', error);
      return { error: error as Error };
    }
  },

  getOrCreateChatRoom: async (activityId, userId) => {
    try {
      // Check if a chat room already exists for this activity
      const { data: existingRoom, error: lookupError } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('activity_id', activityId)
        .maybeSingle();

      if (lookupError) throw lookupError;

      let roomId: string;

      if (existingRoom) {
        roomId = existingRoom.id;
      } else {
        // Create a new chat room
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 10); // 10-day expiry

        const { data: newRoom, error: createError } = await supabase
          .from('chat_rooms')
          .insert({
            activity_id: activityId,
            expires_at: expiresAt.toISOString(),
          })
          .select('id')
          .single();

        if (createError) {
          // Handle UNIQUE constraint violation — another user created it concurrently
          if (createError.code === '23505') {
            const { data: retryRoom, error: retryError } = await supabase
              .from('chat_rooms')
              .select('id')
              .eq('activity_id', activityId)
              .maybeSingle();
            if (retryError || !retryRoom) throw retryError || new Error('Chat room not found after conflict');
            roomId = retryRoom.id;
          } else {
            throw createError;
          }
        } else {
          roomId = newRoom.id;
        }
      }

      // Ensure user is a member
      const { data: existingMember } = await supabase
        .from('chat_members')
        .select('id')
        .eq('room_id', roomId)
        .eq('user_id', userId)
        .maybeSingle();

      if (!existingMember) {
        const { error: memberError } = await supabase
          .from('chat_members')
          .insert({ room_id: roomId, user_id: userId });

        if (memberError) throw memberError;
      }

      return { roomId, error: null };
    } catch (error) {
      console.error('Error getting/creating chat room:', error);
      return { roomId: null, error: error as Error };
    }
  },

  subscribeToMessages: (roomId) => {
    const channel = supabase
      .channel(`messages:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          // Fetch the full message with user data
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              user:users!user_id (
                id,
                first_name,
                last_name,
                avatar_color
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            const current = get().messages;
            // Avoid duplicates
            if (!current.find((m) => m.id === data.id)) {
              set({ messages: [...current, data as MessageWithUser] });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
