import React, { useState } from 'react';
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

const mockPosts = [
  {
    id: '1',
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
    image: 'https://images.unsplash.com/photo-1564769353575-73f33a36d84f?w=400',
  },
  {
    id: '2',
    user: {
      name: 'Maya Rodriguez',
      initials: 'MR',
      avatarColor: '#A855F7',
    },
    category: 'Party',
    description: "Drake's performing tonight, who's going? Let's pregame in Silver Spring at 6pm.",
    location: 'Silver Spring, MD',
    date: 'Tonight',
    time: '6:00 PM',
    spotsNeeded: 3,
    maxAttendees: 10,
    image: 'https://images.unsplash.com/photo-1743791022256-40413c5f019b?w=400',
  },
  {
    id: '3',
    user: {
      name: 'Jordan Kim',
      initials: 'JK',
      avatarColor: '#22C55E',
    },
    category: 'Casual Hangout',
    description: 'Anyone want to grab coffee and work at a cafe in Capitol Hill?',
    location: 'Capitol Hill, DC',
    date: 'Tomorrow',
    time: '10:00 AM',
    spotsNeeded: 2,
    maxAttendees: 3,
  },
];

export default function MainFeedScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('feed');

  const renderPost = (post: any) => (
    <TouchableOpacity
      key={post.id}
      style={styles.postCard}
      onPress={() => navigation.navigate('ActivityDetail', { postId: post.id })}
    >
      <View style={styles.postHeader}>
        <View style={[styles.avatar, { backgroundColor: post.user.avatarColor }]}>
          <Text style={styles.avatarText}>{post.user.initials}</Text>
        </View>
        <View style={styles.postHeaderInfo}>
          <Text style={styles.userName}>{post.user.name}</Text>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{post.category}</Text>
            </View>
            {post.skillLevel && (
              <View style={[styles.badge, styles.badgeSecondary]}>
                <Text style={styles.badgeText}>{post.skillLevel}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      )}

      <Text style={styles.postDescription}>{post.description}</Text>

      <View style={styles.postDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{post.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{post.date} {post.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            {post.maxAttendees - post.spotsNeeded}/{post.maxAttendees} going
          </Text>
        </View>
      </View>

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>+1 Join</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>[şere]</Text>
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
            Nearby
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
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'feed' && mockPosts.map(renderPost)}
        
        {activeTab === 'my-posts' && (
          <View style={styles.emptyState}>
            <Ionicons name="add-circle-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>You haven't created any activities yet.</Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => navigation.navigate('CreatePost')}
            >
              <Text style={styles.emptyStateButtonText}>Create Your First Activity</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'joined' && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>You haven't joined any activities yet.</Text>
            <Text style={styles.emptyStateSubtext}>Browse the feed to find activities!</Text>
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
  postImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
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
