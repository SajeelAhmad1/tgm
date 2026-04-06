import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

type Props = {
  visible: boolean;
};

export function ScreenLoadingOverlay({visible}: Props): React.JSX.Element | null {
  if (!visible) {
    return null;
  }
  return (
    <View style={styles.overlay} pointerEvents="auto">
      <ActivityIndicator size="large" color="#2091F9" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(241, 245, 249, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
