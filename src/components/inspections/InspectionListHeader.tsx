import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {INSPECTION_LIST_COLORS} from './inspectionListTokens';

type DateLabel = {
  day: string;
  date: string;
};

type Props = {
  userName: string;
  currentDate: DateLabel;
  onPressMenu?: () => void;
  onPressPrevDay?: () => void;
  onPressNextDay?: () => void;
};

export function InspectionListHeader({
  userName,
  currentDate,
  onPressMenu,
  onPressPrevDay,
  onPressNextDay,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, {paddingTop: insets.top}]}>
      <View style={styles.headerTopRow}>
        <Text style={styles.headerName}>{userName}</Text>
        <Pressable style={styles.iconBtn} hitSlop={8} onPress={onPressMenu}>
          <Text style={styles.iconBtnText}>☰</Text>
        </Pressable>
      </View>

      <View style={styles.dateRow}>
        <Pressable style={styles.arrowBtn} hitSlop={8} onPress={onPressPrevDay}>
          <Text style={styles.arrowText}>‹</Text>
        </Pressable>

        <View style={styles.dateCenter}>
          <Text style={styles.dayText}>{currentDate.day}</Text>
          <Text style={styles.dateText}>{currentDate.date}</Text>
        </View>

        <Pressable style={styles.arrowBtn} hitSlop={8} onPress={onPressNextDay}>
          <Text style={styles.arrowText}>›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: INSPECTION_LIST_COLORS.headerBg,
    paddingBottom: verticalScale(20),
    paddingHorizontal: scale(16),
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  headerName: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    color: INSPECTION_LIST_COLORS.headerTextName,
  },
  iconBtn: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(8),
    backgroundColor: INSPECTION_LIST_COLORS.headerIconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: {
    color: INSPECTION_LIST_COLORS.headerText,
    fontSize: moderateScale(16),
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowBtn: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(8),
    backgroundColor: INSPECTION_LIST_COLORS.headerIconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: INSPECTION_LIST_COLORS.headerText,
    fontSize: moderateScale(20),
    fontWeight: '600',
    lineHeight: moderateScale(24),
  },
  dateCenter: {
    alignItems: 'center',
    flex: 1,
  },
  dayText: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(28),
    lineHeight: moderateScale(35),
    color: INSPECTION_LIST_COLORS.headerText,
    textAlign: 'center',
  },
  dateText: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22.5),
    color: INSPECTION_LIST_COLORS.headerTextSubtle,
    textAlign: 'center',
  },
});
