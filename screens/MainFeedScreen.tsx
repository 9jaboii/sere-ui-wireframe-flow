import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useActivityStore } from '../stores/activityStore';
import { useAuthStore } from '../stores/authStore';
import { ActivityWithHost } from '../types/database';
import { getCategoryLabel, getInitials } from '../constants';

export default function MainFeedScreen({ navigation, route }: any) {
  const [activeTab, setActiveTab] = useState('feed');
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuthStore();
  const {
    activities,
    myActivities,
    joinedActivities,
    isLoading,
    fetchFeed,
    fetchMyActivities,
    fetchJoinedActivities,
  } = useActivityStore();

  const userId = user?.id;

  // Handle tab param from navigation (e.g. after creating a post)
  useEffect(() => {
    const tab = route?.params?.tab;
    if (tab) {
      setActiveTab(tab);
      // Clear the param so it doesn't re-trigger
      navigation.setParams({ tab: undefined });
    }
  }, [route?.params?.tab]);

  // Fetch feed on mount
  useEffect(() => {
    if (userId) {
      fetchFeed(userId);
    }
  }, [userId]);

  // Fetch tab-specific data when switching tabs
  useEffect(() => {
    if (!userId) return;
    if (activeTab === 'feed') {
      fetchFeed(userId);
    } else if (activeTab === 'my-posts') {
      fetchMyActivities(userId);
    } else if (activeTab === 'joined') {
      fetchJoinedActivities(userId);
    }
  }, [activeTab, userId]);

  const onRefresh = useCallback(async () => {
    if (!userId) return;
    setRefreshing(true);
    if (activeTab === 'feed') {
      await fetchFeed(userId);
    } else if (activeTab === 'my-posts') {
      await fetchMyActivities(userId);
    } else if (activeTab === 'joined') {
      await fetchJoinedActivities(userId);
    }
    setRefreshing(false);
  }, [activeTab, userId]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const renderPost = (activity: ActivityWithHost) => {
    if (!activity.host) return null;
    const hostName = `${activity.host.first_name} ${activity.host.last_name}`;
    const initials = getInitials(activity.host.first_name, activity.host.last_name);
    const categoryLabel = getCategoryLabel(activity.category);
    const skillLabel = activity.skill_level
      ? activity.skill_level.charAt(0).toUpperCase() + activity.skill_level.slice(1).replace('_', ' ')
      : null;
    const isHost = userId === activity.host_user_id;

    return (
      <TouchableOpacity
        key={activity.id}
        style={styles.postCard}
        onPress={() => navigation.navigate('ActivityDetail', { postId: activity.id })}
      >
        <View style={styles.postHeader}>
          <View style={[styles.avatar, { backgroundColor: activity.host.avatar_color || '#3B82F6' }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.postHeaderInfo}>
            <Text style={styles.userName}>{hostName}</Text>
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
          </View>
        </View>

        {activity.photo_url ? (
          <View style={styles.postImageContainer}>
            <Image source={{ uri: activity.photo_url }} style={styles.postImage} />
            <View style={styles.postImageOverlay}>
              <Text style={styles.postImageOverlayText}>{categoryLabel}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.postImagePlaceholder}>
            <Text style={styles.postImagePlaceholderText}>{categoryLabel}</Text>
          </View>
        )}

        <Text style={styles.postDescription}>{activity.description}</Text>

        <View style={styles.postDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{activity.location_text}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {formatDate(activity.event_date)} {formatTime(activity.event_time)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {activity.spots_filled}/{activity.spots_total} going
            </Text>
          </View>
        </View>

        {!isHost && (
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>+1 Join</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.messageButton}
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate('ChatRoom', { activityId: activity.id });
              }}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const getActiveData = (): ActivityWithHost[] => {
    switch (activeTab) {
      case 'my-posts':
        return myActivities;
      case 'joined':
        return joinedActivities;
      default:
        return activities;
    }
  };

  const activeData = getActiveData();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>[sere]</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('CreatePost')}
          >
            <Ionicons name="add-circle-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Chats')}
          >
            <Ionicons name="chatbubble-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'feed' && styles.tabActive]}
          onPress={() => setActiveTab('feed')}
        >
          <Text style={[styles.tabText, activeTab === 'feed' && styles.tabTextActive]}>
            Activities
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my-posts' && styles.tabActive]}
          onPress={() => setActiveTab('my-posts')}
        >
          <Text style={[styles.tabText, activeTab === 'my-posts' && styles.tabTextActive]}>
            My Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'joined' && styles.tabActive]}
          onPress={() => setActiveTab('joined')}
        >
          <Text style={[styles.tabText, activeTab === 'joined' && styles.tabTextActive]}>
            Joined
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#000" />
        }
      >
        {isLoading && !refreshing && activeData.length === 0 ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : activeData.length > 0 ? (
          activeData.map(renderPost)
        ) : (
          <View style={styles.emptyState}>
            {activeTab === 'feed' && (
              <>
                <Ionicons name="compass-outline" size={64} color="#ccc" />
                <Text style={styles.emptyStateText}>No activities yet.</Text>
                <Text style={styles.emptyStateSubtext}>Be the first to post one!</Text>
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={() => navigation.navigate('CreatePost')}
                >
                  <Text style={styles.emptyStateButtonText}>Create Activity</Text>
                </TouchableOpacity>
              </>
            )}
            {activeTab === 'my-posts' && (
              <>
                <Ionicons name="add-circle-outline" size={64} color="#ccc" />
                <Text style={styles.emptyStateText}>You haven't created any activities yet.</Text>
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={() => navigation.navigate('CreatePost')}
                >
                  <Text style={styles.emptyStateButtonText}>Create Your First Activity</Text>
                </TouchableOpacity>
              </>
            )}
            {activeTab === 'joined' && (
              <>
                <Ionicons name="people-outline" size={64} color="#ccc" />
                <Text style={styles.emptyStateText}>You haven't joined any activities yet.</Text>
                <Text style={styles.emptyStateSubtext}>Browse the feed to find activities!</Text>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#000000',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingState: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  postCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  postHeaderInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
  },
  badgeSecondary: {
    backgroundColor: '#f0f0f0',
    borderColor: '#d0d0d0',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  postImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  postImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  postImageOverlayText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  postImagePlaceholder: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  postImagePlaceholderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  postDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    color: '#333',
  },
  postDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  postActions: {
    flexDirection: 'row',
    gap: 8,
  },
  joinButton: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  messageButton: {
    width: 44,
    height: 44,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
  emptyStateButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});
