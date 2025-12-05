import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

export default function CollaboratorBrowseScreen() {
  const collaborators = [
    { id: '1', name: 'Sarah Chen', role: 'Full-Stack Developer', skills: ['React', 'Node.js', 'AI'] },
    { id: '2', name: 'Marcus Johnson', role: 'UI/UX Designer', skills: ['Figma', 'Web Design'] },
    { id: '3', name: 'Elena Rodriguez', role: 'Growth Marketer', skills: ['SEO', 'Content'] },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Collaborators</Text>
      <Text style={styles.subtitle}>Connect with verified builders for your ideas</Text>

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
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Send Proposal</Text>
            </TouchableOpacity>
          </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 30,
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
    backgroundColor: '#0099ff',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
