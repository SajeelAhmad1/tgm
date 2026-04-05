import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {LoginError, loginRequest} from '../../api/auth';
import {AuthGradientLayout} from '../../components/auth/AuthGradientLayout';
import {AuthLogoMark} from '../../components/auth/AuthLogoMark';
import {LoginFormCard} from '../../components/auth/LoginFormCard';
import {LOGIN_COLORS} from '../../components/auth/loginTokens';
import type {AuthStackParamList} from '../../navigation/types';
import {useAuthStore} from '../../store/authStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({navigation}: Props) {
  const setAuthFromLogin = useAuthStore(s => s.setAuthFromLogin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const onLogin = async () => {
    setErrorText(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorText('Please enter email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await loginRequest({
        email: trimmedEmail,
        password,
      });
      setAuthFromLogin(data);
    } catch (e) {
      const message =
        e instanceof LoginError
          ? e.message
          : 'Something went wrong. Please try again.';
      setErrorText(message);
    } finally {
      setSubmitting(false);
    }
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
        onChangeEmail={v => {
          setEmail(v);
          setErrorText(null);
        }}
        onChangePassword={v => {
          setPassword(v);
          setErrorText(null);
        }}
        onToggleRemember={() => setRememberMe(v => !v)}
        onSignIn={onLogin}
        onForgotPassword={() => navigation.navigate('ForgotPassword')}
        submitting={submitting}
        errorText={errorText}
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
