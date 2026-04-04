import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import {scale, verticalScale} from 'react-native-size-matters';
import {BG_GRADIENT_STOPS, LOGIN_COLORS} from './loginTokens';

type Props = {
  children: React.ReactNode;
  footerText?: string;
};

export function AuthGradientLayout({children, footerText}: Props) {
  return (
    <LinearGradient
      colors={BG_GRADIENT_STOPS}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      {children}
      {footerText ? <Text style={styles.footer}>{footerText}</Text> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(24),
  },
  footer: {
    marginTop: verticalScale(24),
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: LOGIN_COLORS.whiteSubtle,
    textAlign: 'center',
  },
});
