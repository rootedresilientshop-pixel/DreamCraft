import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <Text style={styles.name}>John Developer</Text>
        <Text style={styles.email}>john@example.com</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Type</Text>
        <Text style={styles.value}>Creator + Collaborator</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <Text style={styles.value}>Builder ($49/mo)</Text>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Manage Subscription</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verification</Text>
        <Text style={[styles.value, styles.verified]}>✓ Email Verified</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
  email: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#0099ff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  value: {
    fontSize: 14,
    color: '#fff',
  },
  verified: {
    color: '#00aa44',
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    color: '#0099ff',
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
});
