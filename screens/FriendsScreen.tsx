import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { showAlert } from '../lib/alert';
import { useAuthStore } from '../stores/authStore';
import { useFriendStore } from '../stores/friendStore';
import { getInitials } from '../constants';
import { supabase } from '../lib/supabase';

export default function FriendsScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { user } = useAuthStore();
  const { friends, requests, isLoading, fetchFriends, fetchRequests, sendRequest, acceptRequest, removeFriend } = useFriendStore();
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      fetchFriends(userId);
      fetchRequests(userId);
    }
  }, [userId]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !userId) return;
    setIsSearching(true);
    const { data } = await supabase
      .from('users')
      .select('id, first_name, last_name, avatar_color')
      .neq('id', userId)
      .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`)
      .limit(10);
    setSearchResults(data || []);
    setIsSearching(false);
  };

  const handleSendRequest = async (friendId: string) => {
    if (!userId) return;
    const { error } = await sendRequest(userId, friendId);
    if (error) {
      showAlert('Error', error.message || 'Failed to send friend request.');
    } else {
      showAlert('Sent', 'Friend request sent!');
      setSearchResults([]);
      setSearchQuery('');
    }
  };

  const handleAccept = async (friendshipId: string) => {
    const { error } = await acceptRequest(friendshipId);
    if (error) {
      showAlert('Error', 'Failed to accept request.');
    } else if (userId) {
      fetchFriends(userId);
      fetchRequests(userId);
    }
  };

  const handleReject = async (friendshipId: string) => {
    const { error } = await removeFriend(friendshipId);
    if (error) {
      showAlert('Error', 'Failed to reject request.');
    } else if (userId) {
      fetchRequests(userId);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Friends</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <View style={styles.searchResults}>
          {searchResults.map((u) => (
            <View key={u.id} style={styles.userRow}>
              <View style={[styles.avatar, { backgroundColor: u.avatar_color || '#3B82F6' }]}>
                <Text style={styles.avatarText}>{getInitials(u.first_name, u.last_name)}</Text>
              </View>
              <Text style={styles.userName}>{u.first_name} {u.last_name}</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => handleSendRequest(u.id)}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.tabTextActive]}>
            Friends ({friends.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
            Requests ({requests.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : activeTab === 'friends' ? (
          friends.length > 0 ? (
            friends.map((f) => (
              <View key={f.id} style={styles.userRow}>
                <View style={[styles.avatar, { backgroundColor: f.user.avatar_color || '#3B82F6' }]}>
                  <Text style={styles.avatarText}>{getInitials(f.user.first_name, f.user.last_name)}</Text>
                </View>
                <Text style={styles.userName}>{f.user.first_name} {f.user.last_name}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No friends yet. Search to add some!</Text>
            </View>
          )
        ) : (
          requests.length > 0 ? (
            requests.map((r) => (
              <View key={r.id} style={styles.userRow}>
                <View style={[styles.avatar, { backgroundColor: r.user.avatar_color || '#3B82F6' }]}>
                  <Text style={styles.avatarText}>{getInitials(r.user.first_name, r.user.last_name)}</Text>
                </View>
                <Text style={[styles.userName, { flex: 1 }]}>{r.user.first_name} {r.user.last_name}</Text>
                <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(r.id)}>
                  <Text style={styles.acceptBtnText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(r.id)}>
                  <Text style={styles.rejectBtnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="person-add-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No pending requests</Text>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    backgroundColor: '#000', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  searchContainer: { flexDirection: 'row', padding: 12, gap: 8, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
  searchInput: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, borderWidth: 1, borderColor: '#e5e5e5' },
  searchButton: { width: 44, height: 44, backgroundColor: '#000', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  searchResults: { borderBottomWidth: 1, borderBottomColor: '#e5e5e5', backgroundColor: '#f9f9f9', paddingHorizontal: 12 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#000' },
  tabText: { fontSize: 14, color: '#666', fontWeight: '500' },
  tabTextActive: { color: '#000', fontWeight: '600' },
  content: { flex: 1 },
  loadingState: { paddingVertical: 40, alignItems: 'center' },
  userRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  userName: { fontSize: 14, fontWeight: '500' },
  addButton: { backgroundColor: '#000', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, marginLeft: 'auto' },
  addButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  acceptBtn: { backgroundColor: '#000', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6 },
  acceptBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  rejectBtn: { borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6 },
  rejectBtnText: { color: '#666', fontSize: 12, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 14, color: '#666', marginTop: 12 },
});
