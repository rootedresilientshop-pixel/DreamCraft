import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  AsyncStorage,
} from 'react-native';
import api from '../api';
import { addFavorite, removeFavorite, isFavorite } from '../utils/favorites';

export default function IdeaDetailScreen({ route, navigation }: any) {
  const { ideaId } = route.params;
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [valuating, setValuating] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [loadingNda, setLoadingNda] = useState(false);
  const [proposingCollaboration, setProposingCollaboration] = useState(false);

  useEffect(() => {
    fetchIdea();
  }, [ideaId]);

  useEffect(() => {
    const checkFavorite = async () => {
      const fav = await isFavorite(ideaId);
      setIsFav(fav);
    };
    checkFavorite();
  }, [ideaId, idea]);

  const fetchIdea = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getIdeaDetail(ideaId);
      if (res.success && res.data) {
        setIdea(res.data);
        const fav = await isFavorite(ideaId);
        setIsFav(fav);
      } else {
        setError(res.error || 'Failed to load idea');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading idea');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this idea: ${idea.title}\n\n${idea.description}`,
        title: idea.title,
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleViewNDA = async () => {
    if (!ideaId) return;
    setLoadingNda(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${process.env.REACT_APP_API_BASE || 'http://localhost:3001/api'}/ideas/${ideaId}/nda`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const text = await response.text();
        alert('NDA Document:\n\n' + text);
      } else {
        alert('Failed to download NDA');
      }
    } catch (err: any) {
      alert('Error downloading NDA: ' + err.message);
    } finally {
      setLoadingNda(false);
    }
  };

  const handleCollaborate = async () => {
    if (!ideaId || !idea) return;
    setProposingCollaboration(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE || 'http://localhost:3001/api'}/collaborators/invite`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`
          },
          body: JSON.stringify({
            collaboratorId: await AsyncStorage.getItem('userId'),
            ideaId,
            role: 'other',
            message: 'I\'m interested in collaborating on this idea'
          })
        }
      );
      if (response.ok) {
        alert('Collaboration proposal sent!');
      } else {
        alert('Failed to propose collaboration');
      }
    } catch (err: any) {
      alert('Error proposing collaboration: ' + err.message);
    } finally {
      setProposingCollaboration(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFav) {
        await removeFavorite(ideaId);
      } else {
        await addFavorite(ideaId);
      }
      setIsFav(!isFav);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleGenerateValuation = async () => {
    setValuating(true);
    try {
      const res = await api.valuateIdea(ideaId);
      if (res.success && res.data) {
        setIdea((prev: any) => ({ ...prev, valuation: res.data.valuation }));
      } else {
        alert(res.error || 'Failed to generate valuation');
      }
    } catch (err: any) {
      alert(err.message || 'Error generating valuation');
    } finally {
      setValuating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0099ff" style={{ marginTop: 40 }} />
        <Text style={styles.loading}>Loading idea...</Text>
      </View>
    );
  }

  if (error || !idea) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error || 'Idea not found'}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusColor = {
    draft: '#999',
    published: '#00cc66',
    'in-collaboration': '#0099ff',
    sold: '#ffaa00',
  }[idea.status] || '#999';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {/* Title & Status */}
        <Text style={styles.title}>{idea.title}</Text>
        <View style={styles.meta}>
          <View style={{ ...styles.status, backgroundColor: statusColor }}>
            <Text style={styles.statusText}>
              {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
            </Text>
          </View>
          <Text style={styles.category}>{idea.category || 'Uncategorized'}</Text>
        </View>
        <Text style={styles.date}>
          {new Date(idea.createdAt).toLocaleDateString()}
        </Text>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{idea.description}</Text>
        </View>

        {/* Valuation Metrics */}
        {idea.valuation ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Valuation Metrics</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>AI Score</Text>
                <Text style={styles.metricValue}>
                  {idea.valuation.aiScore ? `${(idea.valuation.aiScore * 100).toFixed(0)}%` : 'N/A'}
                </Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Market Size</Text>
                <Text style={styles.metricValue}>{idea.valuation.marketSize || 'Unknown'}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Estimated Value</Text>
                <Text style={styles.metricValue}>
                  {idea.valuation.estimatedValue
                    ? `$${(idea.valuation.estimatedValue / 1000).toFixed(1)}K`
                    : 'N/A'}
                </Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Confidence</Text>
                <Text style={styles.metricValue}>
                  {idea.valuation.confidence ? `${(idea.valuation.confidence * 100).toFixed(0)}%` : 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Generate Valuation</Text>
            <Text style={{ color: '#999', fontSize: 13, marginBottom: 15 }}>
              AI-powered analysis coming soon
            </Text>
            <TouchableOpacity
              style={[styles.valuateButton, valuating && { opacity: 0.7 }]}
              onPress={handleGenerateValuation}
              disabled={valuating}
            >
              <Text style={styles.valuateButtonText}>
                {valuating ? '⏳ Generating...' : '✨ Generate Valuation'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Documentation */}
        {idea.documentation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detailed Documentation</Text>
            {idea.documentation.problemStatement && (
              <View style={styles.docItem}>
                <Text style={styles.docTitle}>Problem Statement</Text>
                <Text style={styles.docText}>{idea.documentation.problemStatement}</Text>
              </View>
            )}
            {idea.documentation.targetMarket && (
              <View style={styles.docItem}>
                <Text style={styles.docTitle}>Target Market</Text>
                <Text style={styles.docText}>{idea.documentation.targetMarket}</Text>
              </View>
            )}
            {idea.documentation.solutionOverview && (
              <View style={styles.docItem}>
                <Text style={styles.docTitle}>Solution Overview</Text>
                <Text style={styles.docText}>{idea.documentation.solutionOverview}</Text>
              </View>
            )}
            {idea.documentation.uniqueValue && (
              <View style={styles.docItem}>
                <Text style={styles.docTitle}>Unique Value</Text>
                <Text style={styles.docText}>{idea.documentation.uniqueValue}</Text>
              </View>
            )}
            {idea.documentation.competitors && (
              <View style={styles.docItem}>
                <Text style={styles.docTitle}>Competitors</Text>
                <Text style={styles.docText}>{idea.documentation.competitors}</Text>
              </View>
            )}
            {idea.documentation.businessModel && (
              <View style={styles.docItem}>
                <Text style={styles.docTitle}>Business Model</Text>
                <Text style={styles.docText}>{idea.documentation.businessModel}</Text>
              </View>
            )}
          </View>
        )}

        {/* NDA Notice */}
        {idea.nda?.required && (
          <View style={styles.ndaBox}>
            <Text style={styles.ndaText}>
              📋 This idea requires an NDA before access to detailed information.
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.favoriteButton, isFav && { backgroundColor: '#ffaa00' }]}
            onPress={handleToggleFavorite}
          >
            <Text style={[styles.favoriteButtonText, isFav && { color: '#000' }]}>
              {isFav ? '❤️ Favorited' : '🤍 Add to Favorites'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.collaborateButton, proposingCollaboration && { opacity: 0.7 }]}
            onPress={handleCollaborate}
            disabled={proposingCollaboration}
          >
            <Text style={styles.collaborateButtonText}>
              {proposingCollaboration ? '⏳ Proposing...' : '👥 Collaborate'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.shareButton, loadingNda && { opacity: 0.7 }]}
            onPress={handleViewNDA}
            disabled={loadingNda}
          >
            <Text style={styles.shareButtonText}>
              {loadingNda ? '⏳ Downloading...' : '📋 View NDA'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>📤 Share</Text>
          </TouchableOpacity>
          {idea.price && (
            <TouchableOpacity
              style={styles.purchaseButton}
              onPress={() => navigation.navigate('Checkout', { ideaId })}
            >
              <Text style={styles.purchaseButtonText}>💳 Purchase (${idea.price})</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 15,
  },
  header: {
    marginBottom: 15,
  },
  backLink: {
    color: '#0099ff',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  category: {
    color: '#999',
    fontSize: 12,
  },
  date: {
    color: '#666',
    fontSize: 12,
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ddd',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#ccc',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 15,
    flexBasis: '48%',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 18,
    color: '#0099ff',
    fontWeight: 'bold',
  },
  docItem: {
    backgroundColor: '#1a1a1a',
    borderLeftWidth: 4,
    borderLeftColor: '#0099ff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  docTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  docText: {
    fontSize: 12,
    color: '#ccc',
    lineHeight: 18,
  },
  ndaBox: {
    backgroundColor: '#3d1f1f',
    borderWidth: 1,
    borderColor: '#7a3f3f',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
  },
  ndaText: {
    color: '#ffaa99',
    fontSize: 13,
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 20,
  },
  favoriteButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  favoriteButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  collaborateButton: {
    backgroundColor: '#00cc66',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  collaborateButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  shareButton: {
    backgroundColor: '#0099ff',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  purchaseButton: {
    backgroundColor: '#ffaa00',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  loading: {
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  error: {
    color: '#ff6666',
    fontSize: 16,
    marginTop: 40,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#0099ff',
    padding: 12,
    borderRadius: 6,
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  valuateButton: {
    backgroundColor: '#0099ff',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  valuateButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
