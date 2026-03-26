import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useActivityStore } from '../stores/activityStore';
import { useAuthStore } from '../stores/authStore';
import { getCategoryLabel, getInitials } from '../constants';
import { JoinRequestWithUser } from '../types/database';
import { supabase } from '../lib/supabase';

export default function ActivityDetailScreen({ navigation, route }: any) {
  const { postId } = route.params;
  const [attendees, setAttendees] = useState<JoinRequestWithUser[]>([]);
  const [isJoining, setIsJoining] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  const { user } = useAuthStore();
  const { currentActivity, isLoading, fetchActivity, requestToJoin } = useActivityStore();

  useEffect(() => {
    fetchActivity(postId);
    fetchAttendees();
    checkExistingRequest();
  }, [postId]);

  const fetchAttendees = async () => {
    const { data } = await supabase
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
      .eq('activity_id', postId)
      .eq('status', 'accepted');

    if (data) {
      setAttendees(data as JoinRequestWithUser[]);
    }
  };

  const checkExistingRequest = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('join_requests')
      .select('id')
      .eq('activity_id', postId)
      .eq('requester_id', user.id)
      .maybeSingle();

    setHasRequested(!!data);
  };

  const handleJoinRequest = async () => {
    if (!user) return;
    if (hasRequested) {
      Alert.alert('Already Requested', 'You have already requested to join this activity.');
      return;
    }

    setIsJoining(true);
    const { error } = await requestToJoin(postId, user.id);
    setIsJoining(false);

    if (error) {
      Alert.alert('Error', error.message || 'Failed to request to join.');
    } else {
      setHasRequested(true);
      Alert.alert('Request Sent!', 'The host will review your request.');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  if (isLoading && !currentActivity) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Activity Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  if (!currentActivity) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Activity Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingState}>
          <Text style={styles.errorText}>Activity not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const activity = currentActivity;
  const hostName = `${activity.host.first_name} ${activity.host.last_name}`;
  const hostInitials = getInitials(activity.host.first_name, activity.host.last_name);
  const categoryLabel = getCategoryLabel(activity.category);
  const skillLabel = activity.skill_level
    ? activity.skill_level.charAt(0).toUpperCase() + activity.skill_level.slice(1).replace('_', ' ')
    : null;
  const isHost = user?.id === activity.host_user_id;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity Details</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Host Info */}
        <View style={styles.section}>
          <View style={styles.hostRow}>
            <View style={[styles.avatar, { backgroundColor: activity.host.avatar_color || '#3B82F6' }]}>
              <Text style={styles.avatarText}>{hostInitials}</Text>
            </View>
            <View style={styles.hostInfo}>
              <Text style={styles.hostLabel}>Hosted by</Text>
              <Text style={styles.hostName}>{hostName}</Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="star-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Activity Info */}
        <View style={styles.section}>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{categoryLabel}</Text>
            </View>
            {skillLabel && (
              <View style={[styles.badge, styles.badgeSecondary]}>
                <Text style={styles.badgeText}>{skillLabel}</Text>
              </View>
            )}
          </View>

          <Text style={styles.description}>{activity.description}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="location" size={20} color="#000" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{activity.location_text}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="calendar" size={20} color="#000" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>
                  {formatDate(activity.event_date)} at {formatTime(activity.event_time)}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="people" size={20} color="#000" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>People</Text>
                <Text style={styles.detailValue}>
                  {activity.spots_filled}/{activity.spots_total} spots filled
                </Text>
              </View>
            </View>

            {activity.external_link && (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="link" size={20} color="#000" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Link</Text>
                  <Text style={[styles.detailValue, { color: '#3B82F6' }]}>
                    {activity.external_link}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Attendees */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Who's Going ({attendees.length})
          </Text>
          {attendees.length > 0 ? (
            attendees.map((req) => {
              const name = `${req.requester.first_name} ${req.requester.last_name}`;
              const initials = getInitials(req.requester.first_name, req.requester.last_name);
              return (
                <View key={req.id} style={styles.attendeeRow}>
                  <View style={[styles.attendeeAvatar, { backgroundColor: req.requester.avatar_color || '#3B82F6' }]}>
                    <Text style={styles.attendeeAvatarText}>{initials}</Text>
                  </View>
                  <Text style={styles.attendeeName}>{name}</Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.noAttendeesText}>No one has joined yet. Be the first!</Text>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      {!isHost && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => navigation.navigate('ChatRoom', { activityId: activity.id })}
          >
            <Ionicons name="chatbubble-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.joinButton,
              hasRequested && styles.joinButtonDisabled,
            ]}
            onPress={handleJoinRequest}
            disabled={hasRequested || isJoining}
          >
            {isJoining ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.joinButtonText}>
                {hasRequested ? 'Request Sent' : 'Request to Join'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  hostInfo: {
    flex: 1,
    marginLeft: 12,
  },
  hostLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  hostName: {
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteButton: {
    padding: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#000',
  },
  badgeSecondary: {
    backgroundColor: '#f0f0f0',
    borderColor: '#d0d0d0',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: '#333',
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  attendeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attendeeAvatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  attendeeName: {
    fontSize: 14,
    fontWeight: '500',
  },
  noAttendeesText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    backgroundColor: '#ffffff',
    gap: 12,
  },
  messageButton: {
    width: 56,
    height: 56,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinButton: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
  },
  joinButtonDisabled: {
    backgroundColor: '#666',
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
