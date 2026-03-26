// Database types generated from Supabase schema
// Based on SERE MVP PRD - 12 Modules

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Enums
export type AuthProvider = 'email' | 'google' | 'apple';
export type ActivityCategory = 'sport_gym' | 'casual_hangout' | 'party' | 'other';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'just_for_fun';
export type ActivityStatus = 'active' | 'canceled' | 'completed';
export type FriendshipStatus = 'pending' | 'accepted';
export type RequestStatus = 'pending' | 'accepted';
export type Platform = 'ios' | 'android';
export type NotificationType =
  | 'request_received'
  | 'request_accepted'
  | 'activity_updated'
  | 'activity_canceled'
  | 'reminder'
  | 'completion_confirmation';
export type CompletionStatus = 'occurred' | 'did_not_occur' | 'unconfirmed';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          avatar_color: string;
          is_verified: boolean;
          auth_provider: AuthProvider;
          created_at: string;
          last_login: string | null;
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          avatar_color?: string;
          is_verified?: boolean;
          auth_provider?: AuthProvider;
          created_at?: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          avatar_color?: string;
          is_verified?: boolean;
          auth_provider?: AuthProvider;
          last_login?: string | null;
        };
      };
      friendships: {
        Row: {
          id: string;
          user_id: string;
          friend_id: string;
          status: FriendshipStatus;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          friend_id: string;
          status?: FriendshipStatus;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          status?: FriendshipStatus;
          updated_at?: string | null;
        };
      };
      invites: {
        Row: {
          id: string;
          inviter_id: string;
          token: string;
          expires_at: string;
          used_by: string | null;
          used_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          inviter_id: string;
          token: string;
          expires_at: string;
          used_by?: string | null;
          used_at?: string | null;
          created_at?: string;
        };
        Update: {
          used_by?: string | null;
          used_at?: string | null;
        };
      };
      activities: {
        Row: {
          id: string;
          host_user_id: string;
          category: ActivityCategory;
          skill_level: SkillLevel | null;
          description: string;
          event_date: string;
          event_time: string;
          location_text: string;
          spots_total: number;
          spots_filled: number;
          external_link: string | null;
          photo_url: string | null;
          status: ActivityStatus;
          edit_count: number;
          first_acceptance_at: string | null;
          completion_status: CompletionStatus | null;
          completion_confirmed_at: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          host_user_id: string;
          category: ActivityCategory;
          skill_level?: SkillLevel | null;
          description: string;
          event_date: string;
          event_time: string;
          location_text: string;
          spots_total: number;
          spots_filled?: number;
          external_link?: string | null;
          photo_url?: string | null;
          status?: ActivityStatus;
          edit_count?: number;
          first_acceptance_at?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          category?: ActivityCategory;
          skill_level?: SkillLevel | null;
          description?: string;
          event_date?: string;
          event_time?: string;
          location_text?: string;
          spots_total?: number;
          spots_filled?: number;
          external_link?: string | null;
          photo_url?: string | null;
          status?: ActivityStatus;
          edit_count?: number;
          first_acceptance_at?: string | null;
          completion_status?: CompletionStatus | null;
          completion_confirmed_at?: string | null;
          updated_at?: string | null;
        };
      };
      join_requests: {
        Row: {
          id: string;
          activity_id: string;
          requester_id: string;
          status: RequestStatus;
          requested_at: string;
          decided_at: string | null;
        };
        Insert: {
          id?: string;
          activity_id: string;
          requester_id: string;
          status?: RequestStatus;
          requested_at?: string;
          decided_at?: string | null;
        };
        Update: {
          status?: RequestStatus;
          decided_at?: string | null;
        };
      };
      chat_rooms: {
        Row: {
          id: string;
          activity_id: string;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          activity_id: string;
          created_at?: string;
          expires_at: string;
        };
        Update: {
          expires_at?: string;
        };
      };
      chat_members: {
        Row: {
          id: string;
          room_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: {};
      };
      messages: {
        Row: {
          id: string;
          room_id: string;
          user_id: string;
          content: string;
          sent_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          user_id: string;
          content: string;
          sent_at?: string;
        };
        Update: {
          content?: string;
        };
      };
      device_tokens: {
        Row: {
          id: string;
          user_id: string;
          token: string;
          platform: Platform;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          token: string;
          platform: Platform;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          token?: string;
          updated_at?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: NotificationType;
          title: string;
          body: string;
          payload: Json | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: NotificationType;
          title: string;
          body: string;
          payload?: Json | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          read_at?: string | null;
        };
      };
      verification_tokens: {
        Row: {
          id: string;
          user_id: string;
          token_hash: string;
          expires_at: string;
          used_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          token_hash: string;
          expires_at: string;
          used_at?: string | null;
          created_at?: string;
        };
        Update: {
          used_at?: string | null;
        };
      };
      feedback: {
        Row: {
          id: string;
          user_id: string | null;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          message: string;
          created_at?: string;
        };
        Update: {};
      };
    };
    Functions: {
      get_visible_activities: {
        Args: { current_user_id: string };
        Returns: Database['public']['Tables']['activities']['Row'][];
      };
      can_request_join: {
        Args: { activity_id: string };
        Returns: boolean;
      };
    };
  };
}

// Convenience types
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type Activity = Database['public']['Tables']['activities']['Row'];
export type ActivityInsert = Database['public']['Tables']['activities']['Insert'];
export type ActivityUpdate = Database['public']['Tables']['activities']['Update'];

export type Friendship = Database['public']['Tables']['friendships']['Row'];
export type Invite = Database['public']['Tables']['invites']['Row'];
export type JoinRequest = Database['public']['Tables']['join_requests']['Row'];
export type ChatRoom = Database['public']['Tables']['chat_rooms']['Row'];
export type ChatMember = Database['public']['Tables']['chat_members']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type DeviceToken = Database['public']['Tables']['device_tokens']['Row'];

// Extended types with relations
export type ActivityWithHost = Activity & {
  host: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar_color'>;
};

export type MessageWithUser = Message & {
  user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar_color'>;
};

export type JoinRequestWithUser = JoinRequest & {
  requester: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar_color'>;
};
