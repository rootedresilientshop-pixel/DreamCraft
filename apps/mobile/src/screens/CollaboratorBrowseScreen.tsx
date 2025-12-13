import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import api from '../api';

export default function CollaboratorBrowseScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    setLoading(true);
    try {
      const res = await api.searchIdeas();
      if (res.success && res.data) {
        setIdeas(res.data);
      } else {
        setIdeas([]);
      }
    } catch (err: any) {
      console.error('Error loading ideas:', err);
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await api.searchIdeas(searchQuery || undefined);
      if (res.success && res.data) {
        setIdeas(res.data);
      } else {
        setIdeas([]);
      }
    } catch (err: any) {
      console.error('Error searching ideas:', err);
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewIdea = (ideaId: string) => {
    navigation.navigate('IdeaDetail', { ideaId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browse Ideas</Text>
      <Text style={styles.subtitle}>Discover ideas looking for collaborators</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search ideas..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
          editable={!loading}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={loading}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <>
          <ActivityIndicator size="large" color="#0099ff" style={{ marginVertical: 20 }} />
          {[1, 2, 3].map((i) => (
            <View key={i} style={[styles.card, { opacity: 0.6 }]}>
              <View style={{ height: 16, backgroundColor: '#333', borderRadius: 4, marginBottom: 8, width: '70%' }} />
              <View style={{ height: 14, backgroundColor: '#333', borderRadius: 4, marginBottom: 12, width: '50%' }} />
              <View style={{ height: 40, backgroundColor: '#333', borderRadius: 6 }} />
            </View>
          ))}
        </>
      ) : ideas.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No ideas found</Text>
          <Text style={styles.emptyStateSubtext}>Check back soon for new opportunities</Text>
        </View>
      ) : (
        <FlatList
          data={ideas}
          keyExtractor={(item) => item._id || item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => handleViewIdea(item._id || item.id)}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              {item.category && (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
              )}
              <View style={styles.footer}>
                <Text style={styles.creator}>by {item.creator?.username || 'Anonymous'}</Text>
                <Text style={styles.viewMore}>View Details →</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    padding: 10,
    color: '#fff',
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: '#0099ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    justifyContent: 'center',
  },
  searchButtonText: {
    fontSize: 16,
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderTopWidth: 2,
    borderTopColor: '#0099ff',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: '#ccc',
    marginBottom: 10,
    lineHeight: 18,
  },
  categoryBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  categoryText: {
    color: '#0099ff',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creator: {
    fontSize: 12,
    color: '#999',
  },
  viewMore: {
    fontSize: 12,
    color: '#0099ff',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
});
