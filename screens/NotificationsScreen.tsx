import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { showAlert } from '../lib/alert';
import { useNotificationStore } from '../stores/notificationStore';
import { useActivityStore } from '../stores/activityStore';
import { useAuthStore } from '../stores/authStore';
import { Notification, NotificationType } from '../types/database';

const getIcon = (type: NotificationType): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case 'request_received':
      return 'person-add-outline';
    case 'request_accepted':
      return 'checkmark-circle-outline';
    case 'activity_updated':
      return 'create-outline';
    case 'activity_canceled':
      return 'close-circle-outline';
    case 'reminder':
      return 'time-outline';
    case 'completion_confirmation':
      return 'trophy-outline';
    default:
      return 'notifications-outline';
  }
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function NotificationsScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const {
    notifications,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    subscribeToNotifications,
  } = useNotificationStore();
  const { acceptRequest, rejectRequest } = useActivityStore();

  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    fetchNotifications(userId);
    const unsubscribe = subscribeToNotifications(userId);
    return unsubscribe;
  }, [userId]);

  const onRefresh = useCallback(async () => {
    if (userId) await fetchNotifications(userId);
  }, [userId]);

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.read_at) {
      await markAsRead(notification.id);
    }
    const payload = notification.payload as { activity_id?: string } | null;
    if (payload?.activity_id) {
      navigation.navigate('ActivityDetail', { postId: payload.activity_id });
    }
  };

  const handleMarkAllRead = () => {
    if (userId) markAllAsRead(userId);
  };

  const handleAccept = async (notification: Notification) => {
    const payload = notification.payload as { request_id?: string } | null;
    if (!payload?.request_id) return;
    const { error } = await acceptRequest(payload.request_id);
    if (error) {
      showAlert('Error', 'Failed to accept request.');
    } else {
      markAsRead(notification.id);
      if (userId) fetchNotifications(userId);
    }
  };

  const handleReject = async (notification: Notification) => {
    const payload = notification.payload as { request_id?: string } | null;
    if (!payload?.request_id) return;
    const { error } = await rejectRequest(payload.request_id);
    if (error) {
      showAlert('Error', 'Failed to reject request.');
    } else {
      markAsRead(notification.id);
      if (userId) fetchNotifications(userId);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={handleMarkAllRead}>
          <Text style={styles.markAllRead}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor="#000" />
        }
      >
        {!isLoading && notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No notifications yet</Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                !notification.read_at && styles.notificationItemUnread,
              ]}
              onPress={() => handleNotificationPress(notification)}
            >
              <View style={styles.notificationIcon}>
                <Ionicons name={getIcon(notification.type)} size={24} color="#000" />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationText}>{notification.body}</Text>
                <Text style={styles.notificationTime}>{formatTime(notification.created_at)}</Text>

                {/* Inline Accept/Reject for join requests */}
                {notification.type === 'request_received' && !notification.read_at && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => handleAccept(notification)}
                    >
                      <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => handleReject(notification)}
                    >
                      <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {!notification.read_at && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  markAllRead: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  content: {
    flex: 1,
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
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#ffffff',
  },
  notificationItemUnread: {
    backgroundColor: '#f9f9f9',
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  notificationText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
    color: '#333',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  acceptButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  rejectButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  rejectButtonText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    alignSelf: 'center',
  },
});
