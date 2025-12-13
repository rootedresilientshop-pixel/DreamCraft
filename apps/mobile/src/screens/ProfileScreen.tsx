import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../api';
import VersionBadge from '../components/VersionBadge';
import { removeToken } from '../utils/authStorage';

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    skills: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getProfile();
      if (res.success && res.data) {
        setUser(res.data);
        setFormData({
          firstName: res.data.profile?.firstName || '',
          lastName: res.data.profile?.lastName || '',
          bio: res.data.profile?.bio || '',
          skills: res.data.profile?.skills?.join(', ') || '',
        });
      } else {
        setError('Failed to load profile');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      Alert.alert('Validation Error', 'First and last name are required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const skillsArray = formData.skills
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);

      const payload = {
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          bio: formData.bio,
          skills: skillsArray,
        },
      };

      setUser((prev: any) => ({
        ...prev,
        profile: { ...prev.profile, ...payload.profile },
      }));

      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Error saving profile');
      Alert.alert('Error', err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeToken();
            // Clear user data
            if (Platform.OS === 'web') {
              localStorage.removeItem('userData');
            } else {
              await SecureStore.deleteItemAsync('userData');
            }
            // Navigate to login (App.tsx will detect no token and show auth)
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch (err) {
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0099ff" style={{ marginTop: 20 }} />
        <Text style={styles.loading}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Failed to load profile. Please try again.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user.profile?.firstName?.[0] || user.username?.[0] || 'U').toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>
          {user.profile?.firstName} {user.profile?.lastName}
        </Text>
        <Text style={styles.username}>@{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <TouchableOpacity
          style={[styles.editButton, isEditing && styles.editButtonActive]}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? '✕ Cancel' : '✏️ Edit Profile'}
          </Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorBox}>{error}</Text>}

      {/* View Mode */}
      {!isEditing && (
        <View style={styles.viewMode}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Info</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>User Type:</Text>
              <Text style={styles.value}>{user.userType || 'Creator'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Member Since:</Text>
              <Text style={styles.value}>
                {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {user.profile?.bio && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bio</Text>
              <Text style={styles.bio}>{user.profile.bio}</Text>
            </View>
          )}

          {user.profile?.skills && user.profile.skills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillsContainer}>
                {user.profile.skills.map((skill: string, idx: number) => (
                  <View key={idx} style={styles.skillBadge}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subscription</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Tier:</Text>
              <Text style={styles.value}>
                {user.subscription?.tier
                  ? user.subscription.tier.charAt(0).toUpperCase() +
                    user.subscription.tier.slice(1)
                  : 'Free'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>
                {user.subscription?.status
                  ? user.subscription.status.charAt(0).toUpperCase() +
                    user.subscription.status.slice(1)
                  : 'Active'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <View style={styles.editMode}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>First Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Your first name"
              placeholderTextColor="#666"
              value={formData.firstName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, firstName: text }))
              }
              editable={!saving}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Last Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Your last name"
              placeholderTextColor="#666"
              value={formData.lastName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, lastName: text }))
              }
              editable={!saving}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Bio</Text>
            <TextInput
              style={[styles.formInput, styles.textarea]}
              placeholder="Tell us about yourself"
              placeholderTextColor="#666"
              value={formData.bio}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, bio: text }))
              }
              multiline
              numberOfLines={4}
              editable={!saving}
            />
            <Text style={styles.charCount}>{formData.bio.length}/500</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Skills (comma-separated)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g., React, Node.js, Design, Marketing"
              placeholderTextColor="#666"
              value={formData.skills}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, skills: text }))
              }
              editable={!saving}
            />
            <Text style={styles.helpText}>Separate multiple skills with commas</Text>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.submitButton, saving && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.submitButtonText}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsEditing(false)}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <VersionBadge />
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
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0099ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  username: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#0099ff',
    marginBottom: 15,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0099ff',
    borderRadius: 6,
    marginTop: 10,
  },
  editButtonActive: {
    backgroundColor: '#ff6666',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: '#3d1f1f',
    borderWidth: 1,
    borderColor: '#7a3f3f',
    color: '#ff6666',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    fontSize: 14,
  },
  viewMode: {
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ddd',
    marginBottom: 12,
  },
  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#999',
    fontSize: 14,
  },
  value: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  bio: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: '#0099ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skillText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  editMode: {
    marginBottom: 30,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ddd',
    marginBottom: 8,
  },
  formInput: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    color: '#fff',
    fontSize: 14,
  },
  textarea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#00cc66',
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#333',
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: '#aa0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  loading: {
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  error: {
    color: '#ff6666',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0099ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
