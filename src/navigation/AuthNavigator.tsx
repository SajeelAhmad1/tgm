import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import type {AuthStackParamList} from './types';
import {ForgotPasswordScreen} from '../screens/auth/ForgotPasswordScreen';
import {LoginScreen} from '../screens/auth/LoginScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#1A2332'},
        headerTintColor: '#F2F4F7',
        headerTitleStyle: {fontWeight: '600'},
        contentStyle: {backgroundColor: '#0F1419'},
      }}>
      <Stack.Screen name="Login" component={LoginScreen} options={{title: 'Sign in'}} />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{title: 'Forgot password'}}
      />
    </Stack.Navigator>
  );
}
