import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {MainStackParamList} from '../../navigation/types';

export function ReviewListQuestionDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <View style={styles.container}> 
      <Pressable
        onPress={() => navigation.push('ReviewInspection')}
        style={styles.analyzeButton}>
        <Text style={styles.analyzeButtonText}>Analyze Photos</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  analyzeButton: {
    minWidth: 220,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 15,
  },
});
