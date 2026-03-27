// Avatar color palette - 12 distinct, accessible colors
export const AVATAR_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#22C55E', // Green
  '#F59E0B', // Amber
  '#A855F7', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#84CC16', // Lime
  '#06B6D4', // Cyan
  '#8B5CF6', // Violet
] as const;

// Activity categories
export const ACTIVITY_CATEGORIES = [
  { value: 'sport_gym', label: 'Sport / Gym', icon: 'fitness-outline' },
  { value: 'casual_hangout', label: 'Casual Hangout', icon: 'cafe-outline' },
  { value: 'party', label: 'Party', icon: 'musical-notes-outline' },
  { value: 'other', label: 'Other', icon: 'ellipsis-horizontal-outline' },
] as const;

// Skill levels (for sport_gym category)
export const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'just_for_fun', label: 'Just for fun' },
] as const;

// App configuration
export const APP_CONFIG = {
  // Invite token expiry (7 days)
  INVITE_EXPIRY_DAYS: 7,

  // OTP expiry (10 minutes)
  OTP_EXPIRY_MINUTES: 10,

  // OTP resend cooldown (60 seconds)
  OTP_RESEND_COOLDOWN_SECONDS: 60,

  // Max spots per activity
  MAX_SPOTS_PER_ACTIVITY: 12,

  // Request cap multiplier (2x spots)
  REQUEST_CAP_MULTIPLIER: 2,

  // Chat expiry after event (10 days)
  CHAT_EXPIRY_DAYS: 10,

  // Max description length
  MAX_DESCRIPTION_LENGTH: 200,

  // JWT expiry
  JWT_ACCESS_EXPIRY_HOURS: 1,
  JWT_REFRESH_EXPIRY_DAYS: 7,
} as const;

// Notification types
export const NOTIFICATION_TYPES = {
  REQUEST_RECEIVED: 'request_received',
  REQUEST_ACCEPTED: 'request_accepted',
  ACTIVITY_UPDATED: 'activity_updated',
  ACTIVITY_CANCELED: 'activity_canceled',
  REMINDER: 'reminder',
  COMPLETION_CONFIRMATION: 'completion_confirmation',
} as const;

// Helper function to get random avatar color
export const getRandomAvatarColor = (): string => {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
};

// Helper function to get initials from name
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

// Helper function to get category icon
export const getCategoryIcon = (category: string): string => {
  const found = ACTIVITY_CATEGORIES.find(c => c.value === category);
  return found?.icon || 'ellipsis-horizontal-outline';
};

// Helper function to get skill level label
export const getSkillLabel = (skillLevel: string): string => {
  const found = SKILL_LEVELS.find(s => s.value === skillLevel);
  return found?.label || skillLevel;
};

// Helper function to get category label
export const getCategoryLabel = (category: string): string => {
  const found = ACTIVITY_CATEGORIES.find(c => c.value === category);
  return found?.label || 'Other';
};
