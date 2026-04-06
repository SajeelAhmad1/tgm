import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {LoginError, loginRequest} from '../../api/auth';
import {ConnectivityBanner} from '../../components/ConnectivityBanner';
import {AuthGradientLayout} from '../../components/auth/AuthGradientLayout';
import {AuthLogoMark} from '../../components/auth/AuthLogoMark';
import {LoginFormCard} from '../../components/auth/LoginFormCard';
import {LOGIN_COLORS} from '../../components/auth/loginTokens';
import type {AuthStackParamList} from '../../navigation/types';
import {useAuthStore} from '../../store/authStore';
import {useConnectivityStore} from '../../store/connectivityStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({navigation}: Props) {
  const online = useConnectivityStore(s => s.isOnline);
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

    if (!online) {
      setErrorText('No internet connection.');
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
      <View style={styles.loginStack}>
        <View style={styles.bannerSlot}>
          <ConnectivityBanner />
        </View>
        <View style={styles.loginBody}>
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
        </View>
      </View>
    </AuthGradientLayout>
  );
}

const styles = StyleSheet.create({
  loginStack: {
    width: '100%',
    flex: 1,
    alignSelf: 'stretch',
  },
  bannerSlot: {
    width: '100%',
    alignSelf: 'stretch',
  },
  loginBody: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
