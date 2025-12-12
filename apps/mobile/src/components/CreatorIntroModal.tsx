import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import api from '../api';

interface CreatorIntroModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function CreatorIntroModal({ visible, onDismiss }: CreatorIntroModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDismiss = async () => {
    setLoading(true);
    try {
      await api.completeOnboarding({ type: 'creator-intro' });
      onDismiss();
    } catch (error) {
      console.error('Failed to save intro state:', error);
      onDismiss();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleDismiss}
              disabled={loading}
            >
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>

            {/* Header */}
            <Text style={styles.title}>Welcome to DreamCraft!</Text>
            <Text style={styles.subtitle}>Let's help you bring your ideas to life</Text>

            {/* Main Message */}
            <Text style={styles.description}>
              We're excited to have you here. DreamCraft connects visionary creators like you with
              talented collaborators who can help bring your ideas to life. Whether you're building a
              startup, launching a product, or exploring new opportunities, we've got the tools and
              community you need.
            </Text>

            {/* Features */}
            <View style={styles.feature}>
              <Text style={styles.featureEmoji}>💡</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Create & Share Ideas</Text>
                <Text style={styles.featureText}>
                  Post your innovative ideas and get instant AI-powered valuations
                </Text>
              </View>
            </View>

            <View style={styles.feature}>
              <Text style={styles.featureEmoji}>🤝</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Find Collaborators</Text>
                <Text style={styles.featureText}>
                  Search and invite talented people based on their skills and expertise
                </Text>
              </View>
            </View>

            <View style={styles.feature}>
              <Text style={styles.featureEmoji}>🚀</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Build Together</Text>
                <Text style={styles.featureText}>
                  Collaborate in real-time, iterate on feedback, and turn your vision into reality
                </Text>
              </View>
            </View>

            {/* Call to Action */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleDismiss}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" size="small" />
              ) : (
                <Text style={styles.buttonText}>Get Started</Text>
              )}
            </TouchableOpacity>

            {/* Footer */}
            <Text style={styles.footer}>
              You can explore your dashboard and manage your profile anytime
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingTop: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeIcon: {
    fontSize: 28,
    color: '#999',
    fontWeight: '300',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00cc66',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f1419',
    borderRadius: 8,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00cc66',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 13,
    color: '#999',
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#00cc66',
    paddingVertical: 14,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  footer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
