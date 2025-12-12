import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import api from '../api';

const { width } = Dimensions.get('window');

export default function CollaboratorHomeScreen({ navigation }: any) {
  const [stats, setStats] = useState<any>(null);
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, collabRes, invitRes] = await Promise.all([
        api.getDashboard?.() || Promise.resolve({ success: false }),
        api.getMyCollaborations?.() || Promise.resolve({ success: false }),
        api.getInvitations?.('received') || Promise.resolve({ success: false }),
      ]);

      if (statsRes?.success) setStats(statsRes.data);
      if (collabRes?.success) setCollaborations(collabRes.data);
      if (invitRes?.success) setInvitations(invitRes.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      const res = await api.acceptInvitation?.(invitationId);
      if (res?.success) {
        setInvitations(invitations.filter((inv) => inv._id !== invitationId));
      }
    } catch (err) {
      console.error('Failed to accept invitation:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0099ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Collaborator Hub</Text>
        <Text style={styles.headerSubtitle}>Find ideas & build your portfolio</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Active</Text>
          <Text style={styles.statValue}>{stats?.myCollaborationsCount || 0}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Invitations</Text>
          <Text style={styles.statValue}>{stats?.pendingInvitationsCount || 0}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Portfolio</Text>
          <Text style={styles.statValue}>{stats?.myIdeasCount || 0}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Browse')}
        >
          <Text style={styles.actionIcon}>🔍</Text>
          <View>
            <Text style={styles.actionTitle}>Browse Ideas</Text>
            <Text style={styles.actionDesc}>Find projects to join</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.actionIcon}>✏️</Text>
          <View>
            <Text style={styles.actionTitle}>Edit Profile</Text>
            <Text style={styles.actionDesc}>Showcase your skills</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📨 Collaboration Invitations</Text>
          <FlatList
            scrollEnabled={false}
            data={invitations}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.invitationCard}>
                <View style={styles.invContent}>
                  <Text style={styles.invTitle}>{item.ideaId?.title}</Text>
                  <Text style={styles.invFrom}>From {item.creatorId?.username}</Text>
                  {item.role && <Text style={styles.roleTag}>{item.role}</Text>}
                </View>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleAcceptInvitation(item._id)}
                >
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      {/* Active Collaborations */}
      {collaborations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤝 Active Collaborations</Text>
          <FlatList
            scrollEnabled={false}
            data={collaborations}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.collabCard}
                onPress={() => navigation.navigate('IdeaDetail', { ideaId: item.ideaId._id })}
              >
                <View>
                  <Text style={styles.collabTitle}>{item.ideaId?.title}</Text>
                  <Text style={styles.collabCreator}>Working with {item.creatorId?.username}</Text>
                  <Text style={styles.collabRole}>{item.role}</Text>
                </View>
                <Text style={styles.collabArrow}>→</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Empty State */}
      {invitations.length === 0 && collaborations.length === 0 && (
        <View style={styles.emptySection}>
          <Text style={styles.emptyIcon}>🚀</Text>
          <Text style={styles.emptyTitle}>Ready to collaborate?</Text>
          <Text style={styles.emptyText}>Browse ideas and start working with creators</Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Browse')}
          >
            <Text style={styles.exploreButtonText}>Explore Ideas</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 16,
  },
  headerSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0099ff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#222',
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0099ff',
  },
  actionsSection: {
    marginBottom: 24,
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 11,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  invitationCard: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  invContent: {
    flex: 1,
  },
  invTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0099ff',
    marginBottom: 4,
  },
  invFrom: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  roleTag: {
    fontSize: 10,
    backgroundColor: '#222',
    color: '#999',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
  acceptButton: {
    backgroundColor: '#00cc66',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  acceptButtonText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '600',
  },
  collabCard: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  collabTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  collabCreator: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  collabRole: {
    fontSize: 11,
    backgroundColor: 'rgba(0, 153, 255, 0.2)',
    color: '#0099ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
  collabArrow: {
    fontSize: 18,
    color: '#0099ff',
    fontWeight: '600',
  },
  emptySection: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: 'rgba(0, 153, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 153, 255, 0.2)',
    borderStyle: 'dashed',
    marginTop: 20,
    marginBottom: 40,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  exploreButton: {
    backgroundColor: '#0099ff',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});
