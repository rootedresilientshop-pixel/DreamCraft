import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  const ideas = [
    { id: '1', title: 'AI-Powered Fitness App', value: '$5,000', status: 'Published' },
    { id: '2', title: 'Blockchain Supply Chain', value: '$8,500', status: 'In Collaboration' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity
          style={styles.newIdeaButton}
          onPress={() => navigation.navigate('CreateIdea')}
        >
          <Text style={styles.newIdeaButtonText}>+ New Idea</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Ideas</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>2</Text>
          <Text style={styles.statLabel}>Collaborators</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>$13.5K</Text>
          <Text style={styles.statLabel}>Potential Value</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Ideas</Text>

      <FlatList
        data={ideas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.ideaCard}>
            <Text style={styles.ideaTitle}>{item.title}</Text>
            <View style={styles.ideaFooter}>
              <Text style={styles.ideaValue}>{item.value}</Text>
              <Text style={[styles.ideaStatus, item.status === 'Published' ? styles.statusPublished : styles.statusCollaboration]}>
                {item.status}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  newIdeaButton: {
    backgroundColor: '#00cc66',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  newIdeaButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  stat: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0099ff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  ideaCard: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0099ff',
  },
  ideaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  ideaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ideaValue: {
    color: '#0099ff',
    fontWeight: 'bold',
  },
  ideaStatus: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusPublished: {
    backgroundColor: '#00aa44',
    color: '#fff',
  },
  statusCollaboration: {
    backgroundColor: '#aa9900',
    color: '#fff',
  },
});
