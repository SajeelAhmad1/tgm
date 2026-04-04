import React from 'react';
import {Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';

const HEADER_BG = '#2091F9';

const HEADER_COLORS = {
  headerText: '#FFFFFF',
  headerTextSubtle: '#FFFFFFCC',
  headerIconBg: '#FFFFFF26',
} as const;

type Props = {
  title: string;
  /** When set, shown under the title (stacked layout only). */
  subtitle?: string;
  onBack: () => void;
  /**
   * `stacked` — back, centered title block, spacer (Complete / signature / complete).
   * `report` — back, single title Text, spacer (matches Inspection Report header).
   */
  layout?: 'stacked' | 'report';
};

export function InspectionFlowHeader({
  title,
  subtitle,
  onBack,
  layout = 'stacked',
}: Props) {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={HEADER_BG} />
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Pressable style={styles.arrowBtn} hitSlop={8} onPress={onBack}>
            <Text style={styles.arrowText}>‹</Text>
          </Pressable>
          {layout === 'report' ? (
            <Text style={styles.headerTitleReport}>{title}</Text>
          ) : (
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>{title}</Text>
              {subtitle ? (
                <Text style={styles.headerSubtitle}>{subtitle}</Text>
              ) : null}
            </View>
          )}
          <View style={styles.arrowBtn} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: HEADER_BG,
    paddingTop: verticalScale(48),
    paddingBottom: verticalScale(16),
    paddingHorizontal: scale(16),
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowBtn: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(8),
    backgroundColor: HEADER_COLORS.headerIconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: HEADER_COLORS.headerText,
    fontSize: moderateScale(22),
    fontWeight: '600',
    lineHeight: moderateScale(26),
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(17),
    lineHeight: moderateScale(24),
    color: HEADER_COLORS.headerText,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: moderateScale(13),
    lineHeight: moderateScale(18),
    color: HEADER_COLORS.headerTextSubtle,
    textAlign: 'center',
    marginTop: verticalScale(2),
  },
  headerTitleReport: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(17),
    color: HEADER_COLORS.headerText,
    textAlign: 'center',
  },
});
