import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ActivityDetailScreen({ navigation, route }: any) {
  const { postId } = route.params;

  // Mock data
  const activity = {
    id: postId,
    user: {
      name: 'Alex Chen',
      initials: 'AC',
      avatarColor: '#3B82F6',
    },
    category: 'Sport / Gym',
    skillLevel: 'Intermediate',
    description: 'Who wants to play tennis at Rock Creek Park at 6pm?',
    location: 'Rock Creek Park, DC',
    date: 'Today',
    time: '6:00 PM',
    spotsNeeded: 1,
    maxAttendees: 4,
    image: 'https://images.unsplash.com/photo-1564769353575-73f33a36d84f?w=600',
    attendees: [
      { name: 'Mike Davis', initials: 'MD', avatarColor: '#F97316' },
      { name: 'Sarah Williams', initials: 'SW', avatarColor: '#EC4899' },
      { name: 'Jordan Kim', initials: 'JK', avatarColor: '#22C55E' },
    ],
  };

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
        {/* Image */}
        {activity.image && (
          <Image source={{ uri: activity.image }} style={styles.image} />
        )}

        {/* Host Info */}
        <View style={styles.section}>
          <View style={styles.hostRow}>
            <View style={[styles.avatar, { backgroundColor: activity.user.avatarColor }]}>
              <Text style={styles.avatarText}>{activity.user.initials}</Text>
            </View>
            <View style={styles.hostInfo}>
              <Text style={styles.hostLabel}>Hosted by</Text>
              <Text style={styles.hostName}>{activity.user.name}</Text>
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
              <Text style={styles.badgeText}>{activity.category}</Text>
            </View>
            {activity.skillLevel && (
              <View style={[styles.badge, styles.badgeSecondary]}>
                <Text style={styles.badgeText}>{activity.skillLevel}</Text>
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
                <Text style={styles.detailValue}>{activity.location}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="calendar" size={20} color="#000" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>
                  {activity.date} at {activity.time}
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
                  {activity.maxAttendees - activity.spotsNeeded}/{activity.maxAttendees} spots filled
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Attendees */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Who's Going ({activity.attendees.length})
          </Text>
          {activity.attendees.map((attendee, index) => (
            <View key={index} style={styles.attendeeRow}>
              <View style={[styles.attendeeAvatar, { backgroundColor: attendee.avatarColor }]}>
                <Text style={styles.attendeeAvatarText}>{attendee.initials}</Text>
              </View>
              <Text style={styles.attendeeName}>{attendee.name}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.messageButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Request to Join</Text>
        </TouchableOpacity>
      </View>
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
  image: {
    width: '100%',
    height: 250,
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
  joinButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
