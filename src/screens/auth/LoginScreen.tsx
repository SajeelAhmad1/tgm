import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {AuthGradientLayout} from '../../components/auth/AuthGradientLayout';
import {AuthLogoMark} from '../../components/auth/AuthLogoMark';
import {LoginFormCard} from '../../components/auth/LoginFormCard';
import {LOGIN_COLORS} from '../../components/auth/loginTokens';
import type {AuthStackParamList} from '../../navigation/types';
import {useAuthStore} from '../../store/authStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({navigation}: Props) {
  const setSession = useAuthStore(s => s.setSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const onLogin = () => {
    setSession({
      accessToken: 'dev-access-token',
      refreshToken: 'dev-refresh-token',
      userId: '00000000-0000-4000-8000-000000000001',
      email: email.trim() || 'inspector@example.com',
    });
  };

  return (
    <AuthGradientLayout footerText="© 2024 The Glass Market. All rights reserved.">
      <AuthLogoMark />
      <Text style={styles.appTitle}>TGM Field App</Text>
      <Text style={styles.appSubtitle}>Sign in to continue</Text>
      <LoginFormCard
        email={email}
        password={password}
        rememberMe={rememberMe}
        onChangeEmail={setEmail}
        onChangePassword={setPassword}
        onToggleRemember={() => setRememberMe(v => !v)}
        onSignIn={onLogin}
        onForgotPassword={() => navigation.navigate('ForgotPassword')}
      />
    </AuthGradientLayout>
  );
}

const styles = StyleSheet.create({
  appTitle: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(24),
    lineHeight: moderateScale(32),
    color: LOGIN_COLORS.white,
    marginBottom: verticalScale(4),
  },
  appSubtitle: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    color: LOGIN_COLORS.white,
    marginBottom: verticalScale(24),
  },
});
