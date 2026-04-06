import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ConnectivityBanner} from '../../components/ConnectivityBanner';
import {PrimaryButton} from '../../components/PrimaryButton';
import {ScreenLoadingOverlay} from '../../components/ScreenLoadingOverlay';
import {ScreenScaffold} from '../../components/ScreenScaffold';
import type {AuthStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({navigation}: Props) {
  const [loading] = useState(false);
  const [loadError] = useState<string | null>(null);
  return (
    <View style={styles.root}>
      <ConnectivityBanner />
      {loadError ? <Text style={styles.loadErrorText}>{loadError}</Text> : null}
      <View style={styles.scaffoldWrap}>
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
      </View>
      <ScreenLoadingOverlay visible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scaffoldWrap: {
    flex: 1,
  },
  loadErrorText: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    color: '#DC2626',
    fontSize: 14,
    lineHeight: 20,
  },
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
