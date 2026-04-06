import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {scale} from 'react-native-size-matters';

type Props = {
  size?: number;
};

export function AuthLogoMark({ size = 128 }: Props) {
  return (
    <View style={styles.logoWrapper}>
      <View style={[styles.logoPlaceholder, { width: scale(size), height: scale(size), borderRadius: scale(size / 2) }]}>
        <Image
          source={require('../../../src/assets/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoWrapper: {
    marginBottom: 16,
  },
  logoPlaceholder: {
    
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: '80%',
    height: '80%',
  },
});