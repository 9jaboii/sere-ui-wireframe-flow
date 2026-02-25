import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const mockNotifications = [
  {
    id: '1',
    type: 'request',
    userName: 'Sarah Williams',
    userInitials: 'SW',
    userColor: '#EC4899',
    activityName: 'Tennis at Rock Creek Park',
    message: 'wants to join your activity',
    time: '5m ago',
    unread: true,
  },
  {
    id: '2',
    type: 'accepted',
    userName: 'Mike Davis',
    userInitials: 'MD',
    userColor: '#F97316',
    activityName: 'Basketball Pickup Game',
    message: 'accepted your join request',
    time: '1h ago',
    unread: true,
  },
  {
    id: '3',
    type: 'message',
    userName: 'Jordan Kim',
    userInitials: 'JK',
    userColor: '#22C55E',
    activityName: 'Coffee & Work',
    message: 'sent a message in',
    time: '3h ago',
    unread: false,
  },
  {
    id: '4',
    type: 'reminder',
    activityName: 'Concert Pregame',
    message: 'Activity starts in 2 hours',
    time: 'Today',
    unread: false,
  },
];

export default function NotificationsScreen({ navigation }: any) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'request':
        return 'person-add-outline';
      case 'accepted':
        return 'checkmark-circle-outline';
      case 'message':
        return 'chatbubble-outline';
      case 'reminder':
        return 'time-outline';
      default:
        return 'notifications-outline';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markAllRead}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mockNotifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationItem,
              notification.unread && styles.notificationItemUnread,
            ]}
          >
            <View style={styles.notificationIcon}>
              {notification.type === 'reminder' ? (
                <Ionicons name={getIcon(notification.type)} size={24} color="#000" />
              ) : (
                <View style={[styles.userAvatar, { backgroundColor: notification.userColor }]}>
                  <Text style={styles.userAvatarText}>{notification.userInitials}</Text>
                </View>
              )}
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationText}>
                {notification.userName && (
                  <Text style={styles.userName}>{notification.userName} </Text>
                )}
                {notification.message}{' '}
                <Text style={styles.activityName}>{notification.activityName}</Text>
              </Text>
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
            {notification.unread && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}
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
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
    color: '#333',
  },
  userName: {
    fontWeight: '600',
    color: '#000',
  },
  activityName: {
    fontWeight: '500',
    color: '#000',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    alignSelf: 'center',
  },
});
