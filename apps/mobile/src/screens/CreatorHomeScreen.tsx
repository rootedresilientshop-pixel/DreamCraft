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

export default function CreatorHomeScreen({ navigation }: any) {
  const [stats, setStats] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, ideasRes] = await Promise.all([
        api.getDashboard?.() || Promise.resolve({ success: false }),
        api.getMyIdeas?.() || Promise.resolve({ success: false }),
      ]);

      if (statsRes?.success) setStats(statsRes.data);
      if (ideasRes?.success) setIdeas(ideasRes.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ff9800" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Create & Collaborate</Text>
        <Text style={styles.heroSubtitle}>Turn your ideas into reality</Text>
        <TouchableOpacity
          style={styles.heroCTA}
          onPress={() => navigation.navigate('CreateIdea')}
        >
          <Text style={styles.heroCTAText}>✨ Start New Idea</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>💡</Text>
          <Text style={styles.statValue}>{stats?.myIdeasCount || 0}</Text>
          <Text style={styles.statLabel}>Ideas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🤝</Text>
          <Text style={styles.statValue}>{stats?.myCollaborationsCount || 0}</Text>
          <Text style={styles.statLabel}>Collaborations</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📬</Text>
          <Text style={styles.statValue}>{stats?.pendingInvitationsCount || 0}</Text>
          <Text style={styles.statLabel}>Requests</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CreateIdea')}
        >
          <Text style={styles.actionIcon}>➕</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Create Idea</Text>
            <Text style={styles.actionDesc}>Start a new project</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Browse')}
        >
          <Text style={styles.actionIcon}>🔍</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Find Collaborators</Text>
            <Text style={styles.actionDesc}>Search for teammates</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Ideas List */}
      <View style={styles.ideasSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Ideas</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CreateIdea')}>
            <Text style={styles.seeAll}>+ New</Text>
          </TouchableOpacity>
        </View>

        {ideas.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💭</Text>
            <Text style={styles.emptyTitle}>No ideas yet</Text>
            <Text style={styles.emptyText}>Start creating your first idea</Text>
          </View>
        ) : (
          <FlatList
            scrollEnabled={false}
            data={ideas}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.ideaCard}
                onPress={() => navigation.navigate('IdeaDetail', { ideaId: item._id })}
              >
                <View style={styles.ideaCardHeader}>
                  <Text style={styles.ideaTitle}>{item.title}</Text>
                  <Text style={styles.ideaStatus}>{item.status || 'draft'}</Text>
                </View>
                <Text style={styles.ideaDesc}>{item.description?.substring(0, 80)}...</Text>
                <View style={styles.ideaStats}>
                  <Text style={styles.ideaStat}>🤝 {item.stats?.activeCollaborators || 0}</Text>
                  <Text style={styles.ideaStat}>⏳ {item.stats?.pendingRequests || 0}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 16,
  },
  heroSection: {
    backgroundColor: 'linear-gradient(135deg, #ff9800 0%, #f97316 100%)',
    borderRadius: 12,
    padding: 24,
    marginTop: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
  },
  heroCTA: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  heroCTAText: {
    color: '#f97316',
    fontWeight: '700',
    fontSize: 14,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.2)',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff9800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  actionsSection: {
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 12,
    color: '#666',
  },
  ideasSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  seeAll: {
    fontSize: 12,
    color: '#ff9800',
    fontWeight: '600',
  },
  ideaCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#222',
  },
  ideaCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ideaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  ideaStatus: {
    fontSize: 10,
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    color: '#ff9800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: '600',
    marginLeft: 8,
    textTransform: 'capitalize',
  },
  ideaDesc: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
    lineHeight: 18,
  },
  ideaStats: {
    flexDirection: 'row',
    gap: 12,
  },
  ideaStat: {
    fontSize: 11,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'rgba(255, 152, 0, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.2)',
    borderStyle: 'dashed',
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
  },
});
