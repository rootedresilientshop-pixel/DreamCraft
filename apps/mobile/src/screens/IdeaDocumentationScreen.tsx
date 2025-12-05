import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import api from '../api';

export default function IdeaDocumentationScreen() {
  const [ideaTitle, setIdeaTitle] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDocumentIdea = async () => {
    if (!ideaTitle || !problemStatement) {
      Alert.alert('Validation', 'Please add title and problem statement');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        title: ideaTitle,
        description: solution || problemStatement,
        documentation: {
          problemStatement,
          solutionOverview: solution,
        },
        visibility: 'private',
      };
      const res = await api.createIdea(payload);
      if (res && res.success && res.data) {
        const ideaId = res.data._id || res.data.id;
        // call valuation
        const val = await api.valuateIdea(ideaId);
        Alert.alert('Valuation complete', `Score: ${val?.data?.aiScore || 'N/A'}`);
      } else {
        Alert.alert('Error', res?.error || 'Failed to create idea');
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Document Your Idea</Text>
      <Text style={styles.subtitle}>Step-by-step AI guidance to protect and value your concept</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Idea Title</Text>
        <TextInput
          style={styles.input}
          placeholder="What's your big idea?"
          placeholderTextColor="#666"
          value={ideaTitle}
          onChangeText={setIdeaTitle}
        />

        <Text style={styles.label}>Problem Statement</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="What problem does your idea solve?"
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
          value={problemStatement}
          onChangeText={setProblemStatement}
        />

        <Text style={styles.label}>Solution Overview</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Describe your solution..."
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
          value={solution}
          onChangeText={setSolution}
        />

        <TouchableOpacity style={styles.button} onPress={handleDocumentIdea} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Get AI Valuation'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 30,
  },
  form: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0099ff',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 15,
  },
  textarea: {
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  button: {
    backgroundColor: '#0099ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
