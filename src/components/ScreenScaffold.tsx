import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors} from '../theme/colors';

type Props = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  scroll?: boolean;
};

export function ScreenScaffold({
  title,
  subtitle,
  children,
  scroll = true,
}: Props) {
  const body = (
    <View style={[styles.inner, !scroll && styles.innerFill]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scroll}>{body}</ScrollView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: 24,
  },
  inner: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  innerFill: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 16,
  },
});
