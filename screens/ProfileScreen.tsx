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
import { useAuthStore } from '../stores/authStore';
import { getInitials, AVATAR_COLORS } from '../constants';

export default function ProfileScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('profile');

  const { user, signOut, updateUser } = useAuthStore();

  const userName = user ? `${user.first_name} ${user.last_name}` : 'User';
  const userEmail = user?.email || '';
  const userInitials = user ? getInitials(user.first_name, user.last_name) : '??';
  const avatarColor = user?.avatar_color || '#3B82F6';

  const handleColorChange = async (color: string) => {
    await updateUser({ avatar_color: color });
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
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
              {
                text: 'OK',
                onPress: async () => {
                  await signOut();
                },
              },
            ]);
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
          <Text style={styles.footerText}>[sere] - Never go alone</Text>
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
