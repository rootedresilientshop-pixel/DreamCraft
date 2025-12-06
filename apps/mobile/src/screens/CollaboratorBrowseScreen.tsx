import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import api from '../api';

export default function CollaboratorBrowseScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [collaborators, setCollaborators] = useState([
    { id: '1', name: 'Sarah Chen', role: 'Full-Stack Developer', skills: ['React', 'Node.js', 'AI'] },
    { id: '2', name: 'Marcus Johnson', role: 'UI/UX Designer', skills: ['Figma', 'Web Design'] },
    { id: '3', name: 'Elena Rodriguez', role: 'Growth Marketer', skills: ['SEO', 'Content'] },
  ]);
  const [loading, setLoading] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState<Set<string>>(new Set());

  const handleInvite = async (collaboratorId: string, name: string) => {
    Alert.alert('Send Invitation', `Invite ${name} to collaborate?`, [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Invite',
        onPress: async () => {
          setInvitedUsers((prev) => new Set(prev).add(collaboratorId));
          Alert.alert('Success', `Invitation sent to ${name}!`);
        },
      },
    ]);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setCollaborators([
        { id: '1', name: 'Sarah Chen', role: 'Full-Stack Developer', skills: ['React', 'Node.js', 'AI'] },
        { id: '2', name: 'Marcus Johnson', role: 'UI/UX Designer', skills: ['Figma', 'Web Design'] },
        { id: '3', name: 'Elena Rodriguez', role: 'Growth Marketer', skills: ['SEO', 'Content'] },
      ]);
      return;
    }

    setLoading(true);
    try {
      const res = await api.searchCollaborators(searchQuery);
      if (res.success) {
        setCollaborators(res.data || []);
      } else {
        Alert.alert('Error', 'Failed to search collaborators');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Error searching');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Collaborators</Text>
      <Text style={styles.subtitle}>Connect with verified builders for your ideas</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search collaborators..."
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
              <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
                {[1, 2].map((j) => (
                  <View key={j} style={{ height: 20, width: 50, backgroundColor: '#333', borderRadius: 4 }} />
                ))}
              </View>
              <View style={{ height: 40, backgroundColor: '#333', borderRadius: 6 }} />
            </View>
          ))}
        </>
      ) : (
        <FlatList
          data={collaborators}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.role}>{item.role}</Text>
            <View style={styles.skills}>
              {item.skills.map((skill) => (
                <View key={skill} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.button, invitedUsers.has(item.id) && styles.buttonInvited]}
              onPress={() => handleInvite(item.id, item.name)}
              disabled={invitedUsers.has(item.id)}
            >
              <Text style={styles.buttonText}>
                {invitedUsers.has(item.id) ? '✓ Invited' : 'Send Invitation'}
              </Text>
            </TouchableOpacity>
          </View>
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
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  role: {
    fontSize: 14,
    color: '#0099ff',
    marginBottom: 10,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  skillTag: {
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    color: '#fff',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#00cc66',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonInvited: {
    backgroundColor: '#669999',
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
  },
});
