import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {PrimaryButton} from '../../components/PrimaryButton';
import {ScreenScaffold} from '../../components/ScreenScaffold';
import type {AuthStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({navigation}: Props) {
  return (
    <ScreenScaffold
      title="Forgot password"
      subtitle="Reset instructions will be sent when the API is connected.">
      <Text style={styles.hint}>
        This screen is wired for navigation; hook up the Node.js password reset
        endpoint in Milestone 1.
      </Text>
      <PrimaryButton
        label="Back to sign in"
        variant="ghost"
        onPress={() => navigation.goBack()}
        style={styles.btn}
      />
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  hint: {
    color: '#9AA4B2',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  btn: {
    marginTop: 8,
  },
});
