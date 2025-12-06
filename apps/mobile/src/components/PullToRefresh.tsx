import React, { useState, useRef } from 'react';
import { View, ScrollView, Text, RefreshControl, StyleSheet } from 'react-native';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  title?: string;
}

export default function PullToRefresh({ onRefresh, children, title }: PullToRefreshProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#0099ff"
          progressBackgroundColor="#111"
          colors={['#0099ff', '#00cc66', '#00ccaa']}
        />
      }
      showsVerticalScrollIndicator={true}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
