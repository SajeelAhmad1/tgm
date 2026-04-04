import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {InspectionProgressBar} from './InspectionProgressBar';
import {InspectionStatusBadge} from './InspectionStatusBadge';
import type {InspectionCardStatus} from './InspectionStatusBadge';
import {INSPECTION_LIST_COLORS} from './inspectionListTokens';

export type InspectionListItem = {
  id: string;
  timeRange: string;
  title: string;
  developer: string;
  address: string;
  assignee: string;
  status: InspectionCardStatus;
  progress?: {answered: number; total: number};
};

type Props = {
  item: InspectionListItem;
  onPress: () => void;
};

export function InspectionListCard({item, onPress}: Props) {
  const isActive = item.status === 'in_progress';
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, isActive && styles.cardActive]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTime}>{item.timeRange}</Text>
        <InspectionStatusBadge status={item.status} />
      </View>

      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSubtitle}>{item.developer}</Text>

      <View style={styles.cardMeta}>
        <Text style={styles.cardMetaText}>📍 {item.address}</Text>
        <Text style={styles.cardMetaText}>👤 {item.assignee}</Text>
      </View>

      {item.progress ? (
        <InspectionProgressBar
          answered={item.progress.answered}
          total={item.progress.total}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: scale(342),
    alignSelf: 'center',
    backgroundColor: INSPECTION_LIST_COLORS.cardBg,
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: INSPECTION_LIST_COLORS.cardBorder,
    padding: scale(16),
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardActive: {
    borderTopColor: INSPECTION_LIST_COLORS.cardBorderActive,
    borderTopWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  cardTime: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
    color: INSPECTION_LIST_COLORS.cardTime,
  },
  cardTitle: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(17),
    lineHeight: moderateScale(25.5),
    color: INSPECTION_LIST_COLORS.cardTitle,
    marginBottom: verticalScale(2),
  },
  cardSubtitle: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22.5),
    color: INSPECTION_LIST_COLORS.cardSubtitle,
    marginBottom: verticalScale(8),
  },
  cardMeta: {
    gap: verticalScale(3),
  },
  cardMetaText: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
    color: INSPECTION_LIST_COLORS.cardMeta,
  },
});
