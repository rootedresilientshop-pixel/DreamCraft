import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import api from '../api';

const { width, height } = Dimensions.get('window');

interface RouteProps {
  route: {
    params: {
      email: string;
      password: string;
    };
  };
  navigation: any;
}

export default function RoleSelectionScreen({ route, navigation }: RouteProps) {
  const { email, password } = route.params || {};
  const [selectedRole, setSelectedRole] = useState<'creator' | 'collaborator' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = async (role: 'creator' | 'collaborator') => {
    setSelectedRole(role);
    setLoading(true);

    try {
      const res = await api.register(email, password, role);

      if (res.success) {
        if (role === 'collaborator') {
          // Collaborators go to profile wizard
          navigation.navigate('ProfileWizard', { email });
        } else {
          // Creators go to login
          Alert.alert('Account Created!', 'Please log in with your credentials', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]);
        }
      } else {
        Alert.alert('Registration Failed', res.error || 'Unknown error');
        setLoading(false);
        setSelectedRole(null);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Unknown error');
      setLoading(false);
      setSelectedRole(null);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>Select how you want to use DreamCraft</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        {/* Creator Card */}
        <TouchableOpacity
          style={[
            styles.roleCard,
            selectedRole === 'creator' && styles.roleCardSelected,
            selectedRole === 'creator' && styles.roleCardCreator,
          ]}
          onPress={() => !loading && handleRoleSelect('creator')}
          disabled={loading}
          activeOpacity={0.8}
        >
          <View style={styles.roleCardContent}>
            <Text style={styles.roleEmoji}>💡</Text>
            <Text style={[styles.roleTitle, selectedRole === 'creator' && styles.roleTitleActive]}>
              Creator
            </Text>
            <Text style={styles.roleDescription}>
              Pitch your ideas, get valuations, find collaborators, and explore funding opportunities.
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.feature}>✓ Create & pitch ideas</Text>
              <Text style={styles.feature}>✓ Get AI valuations</Text>
              <Text style={styles.feature}>✓ Find collaborators</Text>
            </View>
          </View>
          {selectedRole === 'creator' && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>SELECTED</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Collaborator Card */}
        <TouchableOpacity
          style={[
            styles.roleCard,
            selectedRole === 'collaborator' && styles.roleCardSelected,
            selectedRole === 'collaborator' && styles.roleCardCollaborator,
          ]}
          onPress={() => !loading && handleRoleSelect('collaborator')}
          disabled={loading}
          activeOpacity={0.8}
        >
          <View style={styles.roleCardContent}>
            <Text style={styles.roleEmoji}>🤝</Text>
            <Text style={[styles.roleTitle, selectedRole === 'collaborator' && styles.roleTitleActive]}>
              Collaborator
            </Text>
            <Text style={styles.roleDescription}>
              Discover promising ideas, offer your expertise, and build your portfolio.
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.feature}>✓ Browse ideas</Text>
              <Text style={styles.feature}>✓ Offer expertise</Text>
              <Text style={styles.feature}>✓ Build portfolio</Text>
            </View>
          </View>
          {selectedRole === 'collaborator' && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>SELECTED</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Submit Button */}
        {selectedRole && (
          <TouchableOpacity
            style={[
              styles.submitButton,
              selectedRole === 'creator' ? styles.submitButtonCreator : styles.submitButtonCollaborator,
            ]}
            onPress={() => handleRoleSelect(selectedRole)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                Continue as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
              </Text>
            )}
          </TouchableOpacity>
        )}

        <View style={styles.footerNote}>
          <Text style={styles.footerText}>You can change your role anytime in settings</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 20,
  },
  headerSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  email: {
    fontSize: 12,
    color: '#666',
  },
  roleCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#222',
  },
  roleCardSelected: {
    borderWidth: 2,
  },
  roleCardCreator: {
    borderColor: '#ff9800',
    backgroundColor: 'rgba(255, 152, 0, 0.05)',
  },
  roleCardCollaborator: {
    borderColor: '#0099ff',
    backgroundColor: 'rgba(0, 153, 255, 0.05)',
  },
  roleCardContent: {
    alignItems: 'center',
  },
  roleEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  roleTitleActive: {
    color: '#fff',
  },
  roleDescription: {
    fontSize: 13,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  featuresList: {
    width: '100%',
    alignItems: 'center',
  },
  feature: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  selectedBadge: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#0099ff',
    borderRadius: 6,
    alignSelf: 'center',
  },
  selectedBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonCreator: {
    backgroundColor: '#ff9800',
  },
  submitButtonCollaborator: {
    backgroundColor: '#0099ff',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  footerNote: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
