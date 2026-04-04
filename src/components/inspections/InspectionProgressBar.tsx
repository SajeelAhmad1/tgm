import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {INSPECTION_LIST_COLORS} from './inspectionListTokens';

type Props = {
  answered: number;
  total: number;
};

export function InspectionProgressBar({answered, total}: Props) {
  const pct = total > 0 ? (answered / total) * 100 : 0;
  return (
    <View style={styles.progressWrapper}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: `${pct}%`}]} />
      </View>
      <Text style={styles.progressLabel}>
        {answered} / {total} Questions
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progressWrapper: {
    marginTop: verticalScale(12),
    gap: verticalScale(4),
  },
  progressTrack: {
    height: verticalScale(6),
    backgroundColor: INSPECTION_LIST_COLORS.progressTrack,
    borderRadius: moderateScale(3),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: INSPECTION_LIST_COLORS.progressFill,
    borderRadius: moderateScale(3),
  },
  progressLabel: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
    color: INSPECTION_LIST_COLORS.primary,
    textAlign: 'right',
  },
});
