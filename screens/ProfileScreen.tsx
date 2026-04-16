import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { showAlert } from '../lib/alert';
import { useAuthStore } from '../stores/authStore';
import { useFavoriteStore } from '../stores/favoriteStore';
import { ActivityWithHost } from '../types/database';
import { getInitials, getCategoryLabel, getSkillLabel, AVATAR_COLORS } from '../constants';

export default function ProfileScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const { user, signOut, deleteAccount, updateUser } = useAuthStore();
  const { favoriteActivities, isLoading: favLoading, fetchFavoriteActivities } = useFavoriteStore();

  useEffect(() => {
    if (user?.id && activeTab === 'favorites') {
      fetchFavoriteActivities(user.id);
    }
  }, [activeTab, user?.id]);

  const userName = user ? `${user.first_name} ${user.last_name}` : 'User';
  const userEmail = user?.email || '';
  const userInitials = user ? getInitials(user.first_name, user.last_name) : '??';
  const avatarColor = user?.avatar_color || '#3B82F6';

  const handleColorChange = async (color: string) => {
    await updateUser({ avatar_color: color });
  };

  const handleSignOut = () => {
    showAlert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    showAlert(
      'Delete Account',
      'This action cannot be undone. This will permanently delete your account and remove all your data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            setIsDeletingAccount(true);
            const { error } = await deleteAccount();
            setIsDeletingAccount(false);

            if (error) {
              showAlert('Error', 'Failed to delete account. Please try again.');
            }
          },
        },
      ]
    );
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
          <Text style={styles.profileAvatarText}>{userInitials}</Text>
        </View>
        <Text style={styles.profileName}>{userName}</Text>
        <Text style={styles.profileEmail}>{userEmail}</Text>
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="create-outline" size={16} color="#000" />
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
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
                {AVATAR_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      avatarColor === color && styles.colorButtonActive,
                    ]}
                    onPress={() => handleColorChange(color)}
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
                  <Text style={styles.infoValue}>{userEmail}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <View style={styles.favoritesContainer}>
            {favLoading ? (
              <View style={styles.favLoadingState}>
                <ActivityIndicator size="large" color="#000" />
              </View>
            ) : favoriteActivities.length > 0 ? (
              favoriteActivities.map((activity) => {
                if (!activity.host) return null;
                const hostName = `${activity.host.first_name} ${activity.host.last_name}`;
                const initials = getInitials(activity.host.first_name, activity.host.last_name);
                const categoryLabel = getCategoryLabel(activity.category);
                return (
                  <TouchableOpacity
                    key={activity.id}
                    style={styles.favCard}
                    onPress={() => navigation.navigate('ActivityDetail', { postId: activity.id })}
                  >
                    <View style={styles.favCardHeader}>
                      <View style={[styles.favAvatar, { backgroundColor: activity.host.avatar_color || '#3B82F6' }]}>
                        <Text style={styles.favAvatarText}>{initials}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.favHostName}>{hostName}</Text>
                        <Text style={styles.favCategory}>{categoryLabel}</Text>
                      </View>
                      <Ionicons name="star" size={18} color="#F59E0B" />
                    </View>
                    <Text style={styles.favDescription} numberOfLines={2}>{activity.description}</Text>
                    <View style={styles.favDetails}>
                      <Ionicons name="location-outline" size={14} color="#666" />
                      <Text style={styles.favDetailText}>{activity.location_text}</Text>
                      <Ionicons name="people-outline" size={14} color="#666" style={{ marginLeft: 12 }} />
                      <Text style={styles.favDetailText}>
                        {activity.spots_filled}/{activity.spots_total}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.favEmptyState}>
                <Ionicons name="star-outline" size={64} color="#ccc" />
                <Text style={styles.favEmptyText}>No favorites yet</Text>
                <Text style={styles.favEmptySubtext}>
                  Star activities from the feed to save them here
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Settings</Text>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
                <Ionicons name="settings-outline" size={20} color="#000" />
                <Text style={styles.menuItemText}>Settings</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Friends')}>
                <Ionicons name="people-outline" size={20} color="#000" />
                <Text style={styles.menuItemText}>Friends</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Invite')}>
                <Ionicons name="paper-plane-outline" size={20} color="#000" />
                <Text style={styles.menuItemText}>Invite Friends</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => Linking.openURL('mailto:support@sere.app')}>
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
              <TouchableOpacity
                style={[styles.deleteButton, isDeletingAccount && { opacity: 0.7 }]}
                onPress={handleDeleteAccount}
                disabled={isDeletingAccount}
              >
                {isDeletingAccount ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                    <Text style={styles.deleteButtonText}>Delete Account</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Image source={require('../assets/sere_black.png')} style={styles.footerLogo} />
          <Text style={styles.footerText}>Never go alone</Text>
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
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
  },
  editProfileButtonText: {
    fontSize: 13,
    fontWeight: '600',
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
  favoritesContainer: {
    padding: 16,
  },
  favLoadingState: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  favCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  favCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  favAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  favAvatarText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
  favHostName: {
    fontSize: 14,
    fontWeight: '600',
  },
  favCategory: {
    fontSize: 12,
    color: '#666',
  },
  favDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 8,
  },
  favDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favDetailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  favEmptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  favEmptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  favEmptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerLogo: {
    width: 80,
    height: 30,
    resizeMode: 'contain',
    marginBottom: 4,
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
