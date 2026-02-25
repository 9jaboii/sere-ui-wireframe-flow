import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const availableColors = [
  '#3B82F6',
  '#A855F7',
  '#22C55E',
  '#EC4899',
  '#F97316',
  '#14B8A6',
  '#EF4444',
  '#6366F1',
];

const mockFavoriteHosts = [
  {
    id: '1',
    name: 'Sarah Johnson',
    initials: 'SJ',
    avatarColor: '#A855F7',
    upcomingEvents: [
      {
        id: 'e1',
        title: 'Morning Yoga Session',
        category: 'Sport / Gym',
        date: 'Tomorrow',
        time: '8:00 AM',
        location: 'Central Park, NYC',
      },
      {
        id: 'e2',
        title: 'Weekend Hiking Trip',
        category: 'Sport / Gym',
        date: 'Saturday',
        time: '9:00 AM',
        location: 'Bear Mountain State Park',
      },
    ],
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    initials: 'MR',
    avatarColor: '#22C55E',
    upcomingEvents: [
      {
        id: 'e3',
        title: 'Basketball Pickup Game',
        category: 'Sport / Gym',
        date: 'Friday',
        time: '6:00 PM',
        location: 'Rucker Park',
      },
    ],
  },
];

export default function ProfileScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarColor, setAvatarColor] = useState('#3B82F6');
  const [favorites, setFavorites] = useState(mockFavoriteHosts);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => navigation.replace('Auth') },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. This will permanently delete your account and remove all your data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted.', [
              { text: 'OK', onPress: () => navigation.replace('Auth') },
            ]);
          },
        },
      ]
    );
  };

  const handleRemoveFavorite = (hostId: string) => {
    setFavorites(favorites.filter((host) => host.id !== hostId));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={[styles.profileAvatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.profileAvatarText}>AC</Text>
        </View>
        <Text style={styles.profileName}>Alex Chen</Text>
        <Text style={styles.profileEmail}>alex.chen@email.com</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.tabActive]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.tabActive]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.tabTextActive]}>
            Favorites
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'account' && styles.tabActive]}
          onPress={() => setActiveTab('account')}
        >
          <Text style={[styles.tabText, activeTab === 'account' && styles.tabTextActive]}>
            Account
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Avatar Color</Text>
              <Text style={styles.sectionSubtitle}>Choose a color for your avatar</Text>
              <View style={styles.colorGrid}>
                {availableColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      avatarColor === color && styles.colorButtonActive,
                    ]}
                    onPress={() => setAvatarColor(color)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>alex.chen@email.com</Text>
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>+1 (555) 123-4567</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <View>
            {favorites.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="star-outline" size={64} color="#ccc" />
                <Text style={styles.emptyStateText}>No favorite hosts yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Favorite hosts to quickly see their upcoming events
                </Text>
              </View>
            ) : (
              favorites.map((host) => (
                <View key={host.id} style={styles.favoriteCard}>
                  <View style={styles.favoriteHeader}>
                    <View style={styles.favoriteHostInfo}>
                      <View style={[styles.favoriteAvatar, { backgroundColor: host.avatarColor }]}>
                        <Text style={styles.favoriteAvatarText}>{host.initials}</Text>
                      </View>
                      <View>
                        <Text style={styles.favoriteHostName}>{host.name}</Text>
                        <Text style={styles.favoriteEventCount}>
                          {host.upcomingEvents.length} upcoming event
                          {host.upcomingEvents.length !== 1 ? 's' : ''}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => handleRemoveFavorite(host.id)}>
                      <Ionicons name="star" size={24} color="#FCD34D" />
                    </TouchableOpacity>
                  </View>

                  {host.upcomingEvents.map((event) => (
                    <View key={event.id} style={styles.eventCard}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <View style={styles.eventBadge}>
                        <Text style={styles.eventBadgeText}>{event.category}</Text>
                      </View>
                      <View style={styles.eventDetails}>
                        <View style={styles.eventDetailRow}>
                          <Ionicons name="calendar-outline" size={14} color="#666" />
                          <Text style={styles.eventDetailText}>
                            {event.date} at {event.time}
                          </Text>
                        </View>
                        <View style={styles.eventDetailRow}>
                          <Ionicons name="location-outline" size={14} color="#666" />
                          <Text style={styles.eventDetailText}>{event.location}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ))
            )}
          </View>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Settings</Text>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="settings-outline" size={20} color="#000" />
                <Text style={styles.menuItemText}>Settings</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="mail-outline" size={20} color="#000" />
                <Text style={styles.menuItemText}>Contact Us</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
              <View style={styles.separator} />
              <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Sign Out</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            </View>

            <View style={[styles.section, styles.dangerSection]}>
              <View style={styles.dangerHeader}>
                <Ionicons name="warning-outline" size={20} color="#EF4444" />
                <Text style={styles.dangerTitle}>Danger Zone</Text>
              </View>
              <Text style={styles.dangerText}>
                Once you delete your account, there is no going back. This action cannot be undone.
              </Text>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                <Ionicons name="trash-outline" size={18} color="#fff" />
                <Text style={styles.deleteButtonText}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>[şere] - Never go alone</Text>
          <Text style={styles.footerVersion}>Version 0.1.0 MVP</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileAvatarText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '600',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
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
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  colorButtonActive: {
    borderWidth: 4,
    borderColor: '#000000',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginVertical: 4,
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
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  favoriteCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginTop: 12,
  },
  favoriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  favoriteHostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  favoriteAvatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteHostName: {
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteEventCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  eventCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  eventBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 8,
  },
  eventBadgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  eventDetails: {
    gap: 4,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDetailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 12,
    fontWeight: '500',
  },
  dangerSection: {
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  dangerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
    color: '#999',
  },
});
