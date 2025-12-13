import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api';

export default function CreateIdeaScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    visibility: 'private',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError('');

    // Validate
    if (!formData.title.trim() || !formData.description.trim()) {
      Alert.alert('Error', 'Title and description are required');
      return;
    }

    setLoading(true);

    try {
      const res = await api.createIdea(formData);

      if (res.success || res.data) {
        Alert.alert('Success', 'Idea created successfully!', [
          {
            text: 'OK',
            onPress: () => {
              setFormData({
                title: '',
                description: '',
                category: 'Technology',
                visibility: 'private',
              });
              navigation.replace('CreatorHome');
            },
          },
        ]);
      } else {
        setError(res.error || 'Failed to create idea');
        Alert.alert('Error', res.error || 'Failed to create idea');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Error creating idea';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create New Idea</Text>
        <Text style={styles.subtitle}>Share your innovation</Text>

        {/* Title Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter idea title"
            placeholderTextColor="#666"
            value={formData.title}
            onChangeText={(value) => handleChange('title', value)}
            maxLength={100}
            editable={!loading}
          />
          <Text style={styles.charCount}>{formData.title.length}/100</Text>
        </View>

        {/* Description Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Describe your idea in detail"
            placeholderTextColor="#666"
            value={formData.description}
            onChangeText={(value) => handleChange('description', value)}
            maxLength={1000}
            multiline
            numberOfLines={6}
            editable={!loading}
          />
          <Text style={styles.charCount}>{formData.description.length}/1000</Text>
        </View>

        {/* Category Picker */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.category}
              onValueChange={(value: string) => handleChange('category', value)}
              style={styles.picker}
              enabled={!loading}
            >
              <Picker.Item label="Technology" value="Technology" />
              <Picker.Item label="Healthcare" value="Healthcare" />
              <Picker.Item label="Finance" value="Finance" />
              <Picker.Item label="Education" value="Education" />
              <Picker.Item label="Entertainment" value="Entertainment" />
              <Picker.Item label="E-Commerce" value="E-Commerce" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </View>

        {/* Visibility Picker */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Visibility</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.visibility}
              onValueChange={(value: string) => handleChange('visibility', value)}
              style={styles.picker}
              enabled={!loading}
            >
              <Picker.Item label="Private (only you)" value="private" />
              <Picker.Item label="Public (visible in marketplace)" value="public" />
            </Picker>
          </View>
        </View>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0099ff" />
            <Text style={styles.loadingText}>Creating your idea...</Text>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>{loading ? 'Creating...' : 'Create Idea'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton, loading && styles.buttonDisabled]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 30,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ddd',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    padding: 12,
    color: '#fff',
    fontSize: 14,
  },
  textarea: {
    height: 150,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    color: '#999',
    marginTop: 10,
    fontSize: 14,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#00cc66',
  },
  submitButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
