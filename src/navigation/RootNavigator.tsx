import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {selectIsLoggedIn, useAuthStore} from '../store/authStore';
import {colors} from '../theme/colors';
import {AuthNavigator} from './AuthNavigator';
import {MainNavigator} from './MainNavigator';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.accent,
  },
};

function isAuthHydrated(): boolean {
  try {
    return useAuthStore.persist?.hasHydrated?.() ?? true;
  } catch {
    return true;
  }
}

export function RootNavigator() {
  const isLoggedIn = useAuthStore(selectIsLoggedIn);
  const [ready, setReady] = useState(isAuthHydrated);

  useEffect(() => {
    const persistApi = useAuthStore.persist;
    if (!persistApi?.onFinishHydration) {
      setReady(true);
      return;
    }

    if (persistApi.hasHydrated()) {
      setReady(true);
    }

    const unsub = persistApi.onFinishHydration(() => setReady(true));

    const failSafe = setTimeout(() => {
      if (!persistApi.hasHydrated()) {
        setReady(true);
      }
    }, 4000);

    return () => {
      unsub();
      clearTimeout(failSafe);
    };
  }, []);

  if (!ready) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
