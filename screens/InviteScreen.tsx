import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { showAlert } from '../lib/alert';
import { useAuthStore } from '../stores/authStore';
import { useInviteStore } from '../stores/inviteStore';

export default function InviteScreen({ navigation }: any) {
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuthStore();
  const { invites, isLoading, createInvite, fetchMyInvites } = useInviteStore();
  const userId = user?.id;

  useEffect(() => {
    if (userId) fetchMyInvites(userId);
  }, [userId]);

  const handleCreateInvite = async () => {
    if (!userId) return;
    setIsCreating(true);
    const { token, error } = await createInvite(userId);
    setIsCreating(false);

    if (error) {
      showAlert('Error', 'Failed to create invite.');
      return;
    }

    const link = `https://sere.app/invite/${token}`;
    fetchMyInvites(userId);

    try {
      await Share.share({ message: `Join me on SERE! ${link}` });
    } catch {
      // User cancelled share
    }
  };

  const handleCopyLink = async (token: string) => {
    const link = `https://sere.app/invite/${token}`;
    try {
      await Clipboard.setStringAsync(link);
      showAlert('Copied', 'Invite link copied to clipboard.');
    } catch {
      showAlert('Error', 'Failed to copy link.');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isExpired = (dateStr: string) => new Date(dateStr) < new Date();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite Friends</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.createSection}>
        <Text style={styles.createTitle}>Invite someone to SERE</Text>
        <Text style={styles.createSubtitle}>Generate a link to share with friends. Links expire after 7 days.</Text>
        <TouchableOpacity
          style={[styles.createButton, isCreating && { opacity: 0.6 }]}
          onPress={handleCreateInvite}
          disabled={isCreating}
        >
          {isCreating ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Ionicons name="link-outline" size={20} color="#000" />
              <Text style={styles.createButtonText}>Generate & Share Link</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Sent Invites ({invites.length})</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000" style={{ paddingVertical: 40 }} />
        ) : invites.length > 0 ? (
          invites.map((invite) => {
            const expired = isExpired(invite.expires_at);
            const used = !!invite.used_by;
            return (
              <View key={invite.id} style={styles.inviteRow}>
                <View style={styles.inviteInfo}>
                  <Text style={styles.inviteToken} numberOfLines={1}>
                    sere.app/invite/{invite.token.substring(0, 8)}...
                  </Text>
                  <Text style={styles.inviteDate}>
                    Created {formatDate(invite.created_at)}
                    {used ? ' · Used' : expired ? ' · Expired' : ` · Expires ${formatDate(invite.expires_at)}`}
                  </Text>
                </View>
                <View style={[styles.statusBadge, used ? styles.usedBadge : expired ? styles.expiredBadge : styles.activeBadge]}>
                  <Text style={styles.statusText}>{used ? 'Used' : expired ? 'Expired' : 'Active'}</Text>
                </View>
                {!expired && !used && (
                  <TouchableOpacity style={styles.copyButton} onPress={() => handleCopyLink(invite.token)}>
                    <Ionicons name="copy-outline" size={18} color="#000" />
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="paper-plane-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No invites sent yet</Text>
          </View>
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
  createSection: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#e5e5e5', alignItems: 'center' },
  createTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  createSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  createButton: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 2,
    borderColor: '#000', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8,
  },
  createButtonText: { fontSize: 14, fontWeight: '600' },
  content: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  inviteRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', gap: 8 },
  inviteInfo: { flex: 1 },
  inviteToken: { fontSize: 13, fontWeight: '500', color: '#333' },
  inviteDate: { fontSize: 11, color: '#666', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  activeBadge: { backgroundColor: '#DCFCE7' },
  usedBadge: { backgroundColor: '#E0E7FF' },
  expiredBadge: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 11, fontWeight: '600' },
  copyButton: { padding: 8 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 14, color: '#666', marginTop: 12 },
});
