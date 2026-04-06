import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useConnectivityStore} from '../store/connectivityStore';

export function ConnectivityBanner(): React.JSX.Element | null {
  const online = useConnectivityStore(s => s.isOnline);
  if (online) {
    return null;
  }
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.text}>No internet connection</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#F97316',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
