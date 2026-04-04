import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {INSPECTION_LIST_COLORS} from './inspectionListTokens';

export type InspectionCardStatus = 'in_progress' | 'scheduled' | 'completed';

type Props = {
  status: InspectionCardStatus;
};

export function InspectionStatusBadge({status}: Props) {
  const isInProgress = status === 'in_progress';
  return (
    <View
      style={[
        styles.badge,
        isInProgress ? styles.badgeInProgress : styles.badgeScheduled,
      ]}>
      <Text
        style={[
          styles.badgeText,
          isInProgress ? styles.badgeTextInProgress : styles.badgeTextScheduled,
        ]}>
        {isInProgress ? 'In Progress' : 'Scheduled'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(6),
  },
  badgeScheduled: {
    backgroundColor: INSPECTION_LIST_COLORS.scheduledBg,
  },
  badgeInProgress: {
    backgroundColor: INSPECTION_LIST_COLORS.inProgressBg,
  },
  badgeText: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(11),
    lineHeight: moderateScale(11),
  },
  badgeTextScheduled: {
    color: INSPECTION_LIST_COLORS.scheduledText,
  },
  badgeTextInProgress: {
    color: INSPECTION_LIST_COLORS.inProgressText,
  },
});
