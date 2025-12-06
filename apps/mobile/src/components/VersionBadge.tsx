import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const APP_VERSION = '1.0.0';
const BUILD_NUMBER = '1';

export default function VersionBadge() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>DreamCraft v{APP_VERSION}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#666',
    fontSize: 11,
    fontWeight: '600',
  },
});
