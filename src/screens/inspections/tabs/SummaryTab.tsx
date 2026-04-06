import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ConnectivityBanner} from '../../../components/ConnectivityBanner';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {MainStackParamList} from '../../../navigation/types';

type Props = {
  inspectionId: string;
};

export function SummaryTab({inspectionId}: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [commentDone, setCommentDone] = useState(false);
  const [photoDone,   setPhotoDone]   = useState(false);

  const allDone = commentDone && photoDone;

  return (
    <View style={styles.container}>
      <ConnectivityBanner />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>

        <View style={[styles.card, allDone ? styles.reviewActive : styles.reviewInactive]}>
          <View style={styles.reviewIcon}>
            <Text style={styles.reviewIconEmoji}>📋</Text>
          </View>
          <Text style={[styles.reviewTitle, allDone && styles.reviewTitleActive]}>
            Review All Questions
          </Text>
          <Text style={[styles.reviewSub, allDone && styles.reviewSubActive]}>
            {allDone
              ? 'Tap to review inspection comments and questions'
              : 'Complete AI tasks to unlock review'}
          </Text>
        </View>

        <View style={[styles.card, styles.commentCard]}>
          <Text style={styles.commentTitle}>💬 AI Comment Polishing</Text>
          <Pressable
            style={[styles.btn, commentDone ? styles.btnGreen : styles.btnBlue]}
            onPress={() => setCommentDone(true)}>
            <Text style={styles.btnText}>
              {commentDone ? '✓ Polishing Complete' : 'Run Comment Polishing'}
            </Text>
          </Pressable>
        </View>

        <View style={[styles.card, styles.photoCard]}>
          <Text style={styles.photoTitle}>📸 AI Photo Analysis</Text>
          <Pressable
            style={[styles.btn, photoDone ? styles.btnGreen : styles.btnPurple]}
            onPress={() => setPhotoDone(true)}>
            <Text style={styles.btnText}>
              {photoDone ? '✓ Analysis Complete' : 'Analyse Photos'}
            </Text>
          </Pressable>
        </View>

      </ScrollView>

      {allDone && (
        <View style={styles.footer}>
          <Pressable
            onPress={() => navigation.navigate('CompleteInspection', {inspectionId})} 
            style={styles.markBtn} >
            <Text style={styles.markBtnText}>Mark Inspection Complete</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scroll: {
    padding: 14,
    gap: 10,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  reviewInactive: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  reviewActive: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  reviewIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewIconEmoji: {
    fontSize: 22,
  },
  reviewTitle: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 27,
    textAlign: 'center',
    color: '#94A3B8',
  },
  reviewTitleActive: {
    color: '#10B981',
  },
  reviewSub: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 22.75,
    textAlign: 'center',
    color: '#94A3B8',
  },
  reviewSubActive: {
    color: '#059669',
  },
  commentCard: {
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: '#1677D6',
  },
  commentTitle: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 17,
    lineHeight: 25.5,
    color: '#1677D6',
  },
  photoCard: {
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  photoTitle: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 17,
    lineHeight: 25.5,
    color: '#8B5CF6',
  },
  btn: {
    width: '100%',
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnBlue:   {backgroundColor: '#1677D6'},
  btnPurple: {backgroundColor: '#8B5CF6'},
  btnGreen:  {backgroundColor: '#10B981'},
  btnText: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  footer: {
    padding: 14,
    paddingBottom: 24,
    backgroundColor: '#F1F5F9',
  },
  markBtn: {
    backgroundColor: '#10B981',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markBtnText: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});