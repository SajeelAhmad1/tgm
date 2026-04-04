import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {moderateScale, scale} from 'react-native-size-matters';
import {LOGIN_COLORS} from './loginTokens';

type Props = {
  title?: string;
  subtitle?: string;
};

export function AuthLogoMark({
  title = 'TGM',
  subtitle = 'EST 2024',
}: Props) {
  return (
    <View style={styles.logoWrapper}>
      <View style={styles.logoPlaceholder}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>{title}</Text>
          <Text style={styles.logoSubText}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoWrapper: {
    marginBottom: 16,
  },
  logoPlaceholder: {
    width: scale(128),
    height: scale(128),
    borderRadius: scale(64),
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  logoCircle: {
    alignItems: 'center',
  },
  logoText: {
    color: LOGIN_COLORS.white,
    fontSize: moderateScale(28),
    fontWeight: '800',
    letterSpacing: 2,
  },
  logoSubText: {
    color: LOGIN_COLORS.whiteSubtle,
    fontSize: moderateScale(10),
    fontWeight: '500',
    letterSpacing: 1.5,
    marginTop: 2,
  },
});
