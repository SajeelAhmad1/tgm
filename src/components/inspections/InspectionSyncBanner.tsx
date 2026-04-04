import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {INSPECTION_LIST_COLORS} from './inspectionListTokens';

type Props = {
  lastSyncedLabel: string;
};

export function InspectionSyncBanner({lastSyncedLabel}: Props) {
  return (
    <View style={styles.syncBanner}>
      <View style={styles.syncDot} />
      <Text style={styles.syncText}>{lastSyncedLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  syncBanner: {
    backgroundColor: INSPECTION_LIST_COLORS.syncBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    gap: scale(6),
  },
  syncDot: {
    width: scale(7),
    height: scale(7),
    borderRadius: scale(4),
    backgroundColor: INSPECTION_LIST_COLORS.syncText,
  },
  syncText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
    color: INSPECTION_LIST_COLORS.syncText,
  },
});
