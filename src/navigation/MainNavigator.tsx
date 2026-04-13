import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {InspectionDetailScreen} from '../screens/inspections/tabs/OverviewTab';
import {InspectionListScreen} from '../screens/inspections/InspectionListScreen';
import type {MainStackParamList} from './types';
import { CompleteInspectionScreen } from '../screens/inspections/CompleteInspectionScreen';
import { ClientSignatureScreen } from '../screens/inspections/ClientSignature';
import { InspectionCompleteScreen } from '../screens/inspections/InspectionCompleteScreen';
import { InspectionReportScreen } from '../screens/inspections/InspectionReportScreen';
import { ReviewListQuestionDetailsScreen } from '../screens/inspections/ReviewListQuestionDetails';
import {AccountProfileScreen} from '../screens/auth/AccountProfileScreen';
import ReviewInspectionScreen from '../screens/ReviewInspectionScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="InspectionList"
      screenOptions={{
        headerStyle: {backgroundColor: '#1A2332'},
        headerTintColor: '#F2F4F7',
        headerTitleStyle: {fontWeight: '600'},
        headerShadowVisible: false,
        contentStyle: {backgroundColor: '#0F1419'},
      }}>
      <Stack.Screen
        name="InspectionList"
        component={InspectionListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="InspectionDetail"
        component={InspectionDetailScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CompleteInspection"
        component={CompleteInspectionScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ClientSignature"
        component={ClientSignatureScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="InspectionComplete"
        component={InspectionCompleteScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="InspectionReport"
        component={InspectionReportScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ReviewListQuestionDetails"
        component={ReviewListQuestionDetailsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ReviewInspection"
        component={ReviewInspectionScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AccountProfile"
        component={AccountProfileScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
