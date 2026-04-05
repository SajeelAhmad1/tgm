import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {BTN_GRADIENT_STOPS, LOGIN_COLORS} from './loginTokens';

export type LoginFormCardProps = {
  email: string;
  password: string;
  rememberMe: boolean;
  onChangeEmail: (v: string) => void;
  onChangePassword: (v: string) => void;
  onToggleRemember: () => void;
  onSignIn: () => void;
  onForgotPassword: () => void;
  submitting?: boolean;
  errorText?: string | null;
};

export function LoginFormCard({
  email,
  password,
  rememberMe,
  onChangeEmail,
  onChangePassword,
  onToggleRemember,
  onSignIn,
  onForgotPassword,
  submitting = false,
  errorText,
}: LoginFormCardProps) {
  const locked = submitting;

  return (
    <View style={styles.card}>
      <Text style={styles.fieldLabel}>Email Address</Text>
      <TextInput
        value={email}
        onChangeText={onChangeEmail}
        placeholder="your.email@example.com"
        placeholderTextColor={LOGIN_COLORS.placeholder}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!locked}
        style={styles.input}
      />

      <Text style={[styles.fieldLabel, styles.fieldLabelSpacing]}>Password</Text>
      <TextInput
        value={password}
        onChangeText={onChangePassword}
        placeholder="••••••••"
        placeholderTextColor={LOGIN_COLORS.placeholder}
        secureTextEntry
        editable={!locked}
        style={styles.input}
      />

      <View style={styles.row}>
        <Pressable
          style={styles.rememberRow}
          onPress={onToggleRemember}
          disabled={locked}
          hitSlop={8}>
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <Text style={styles.rememberText}>Remember me</Text>
        </Pressable>

        <Pressable onPress={onForgotPassword} disabled={locked} hitSlop={8}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </Pressable>
      </View>

      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}

      <LinearGradient
        colors={BTN_GRADIENT_STOPS}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={[styles.signInBtn, locked && styles.signInBtnDisabled]}>
        <Pressable
          onPress={onSignIn}
          disabled={locked}
          style={styles.signInBtnPressable}
          android_ripple={{color: 'rgba(255,255,255,0.15)'}}>
          {submitting ? (
            <ActivityIndicator color={LOGIN_COLORS.white} />
          ) : (
            <Text style={styles.signInBtnText}>Sign In</Text>
          )}
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: scale(322),
    borderRadius: moderateScale(16),
    backgroundColor: LOGIN_COLORS.card,
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(24),
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 25},
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 20,
  },
  fieldLabel: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    color: LOGIN_COLORS.label,
    marginBottom: verticalScale(6),
  },
  fieldLabelSpacing: {
    marginTop: verticalScale(16),
  },
  input: {
    height: verticalScale(44),
    borderWidth: 1,
    borderColor: LOGIN_COLORS.inputBorder,
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(12),
    backgroundColor: LOGIN_COLORS.inputBg,
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: moderateScale(16),
    color: '#0A0A0A',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: verticalScale(14),
    marginBottom: verticalScale(20),
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  checkbox: {
    width: scale(16),
    height: scale(16),
    borderRadius: moderateScale(4),
    borderWidth: 1.5,
    borderColor: LOGIN_COLORS.rememberMe,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: LOGIN_COLORS.gradientStart,
    borderColor: LOGIN_COLORS.gradientStart,
  },
  checkmark: {
    color: LOGIN_COLORS.white,
    fontSize: moderateScale(10),
    fontWeight: '700',
    lineHeight: moderateScale(12),
  },
  rememberText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    color: LOGIN_COLORS.rememberMe,
  },
  forgotText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    color: LOGIN_COLORS.forgotPassword,
  },
  errorText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: moderateScale(13),
    lineHeight: moderateScale(18),
    color: '#DC2626',
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  signInBtn: {
    width: scale(274),
    height: verticalScale(52),
    borderRadius: moderateScale(10),
    alignSelf: 'center',
    overflow: 'hidden',
  },
  signInBtnDisabled: {
    opacity: 0.85,
  },
  signInBtnPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInBtnText: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    color: LOGIN_COLORS.white,
  },
});
