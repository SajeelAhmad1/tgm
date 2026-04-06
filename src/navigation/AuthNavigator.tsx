import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import type {AuthStackParamList} from './types';
import {ForgotPasswordScreen} from '../screens/auth/ForgotPasswordScreen';
import {LoginScreen} from '../screens/auth/LoginScreen';
import { AccountProfileScreen } from '../screens/auth/AccountProfileScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: '#0F1419'},
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="AccountProfile" component={AccountProfileScreen} />
    </Stack.Navigator>
  );
}
