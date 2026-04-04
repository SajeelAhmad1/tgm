import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { InspectionFlowHeader } from '../../components/inspections/InspectionFlowHeader';
import { MainStackParamList } from '../../navigation/types';

// ─── Design Tokens ────────────────────────────────────────────────────────────

const COLORS = {
  primary: '#2091F9',

  // Header
  headerBg: '#2091F9',
  headerText: '#FFFFFF',
  headerTextSubtle: '#FFFFFFCC',
  headerIconBg: '#FFFFFF26',

  // Success icon
  successBg: '#DCFCE7',
  successIcon: '#16A34A',

  // Heading
  titleText: '#0F172A',
  subtitleText: '#64748B',

  // Card
  cardBg: '#FFFFFF',
  cardBorder: '#E2E8F0',
  sectionLabel: '#94A3B8',

  // Row labels
  rowLabel: '#64748B',
  rowValueDefault: '#0F172A',
  rowValueGreen: '#16A34A',
  rowValueRed: '#DC2626',

  // Buttons
  primaryBtnBg: '#2091F9',
  primaryBtnText: '#FFFFFF',
  secondaryBtnBg: '#FFFFFF',
  secondaryBtnText: '#0F172A',
  secondaryBtnBorder: '#E2E8F0',

  screenBg: '#F8FAFC',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface SummaryRow {
  label: string;
  value: string;
  valueColor?: string;
  isLast?: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryRow({ label, value, valueColor, isLast }: SummaryRow) {
  return (
    <View style={[styles.summaryRow, !isLast && styles.summaryRowBorder]}>
      <Text style={styles.summaryRowLabel}>{label}</Text>
      <Text style={[styles.summaryRowValue, valueColor ? { color: valueColor } : null]}>
        {value}
      </Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function InspectionCompleteScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const route = useRoute<RouteProp<MainStackParamList, 'InspectionComplete'>>();
    const { inspectionId } = route.params;
  const summaryRows: SummaryRow[] = [
    { label: 'Total Questions', value: '30' },
    { label: 'No Issues', value: '3 items', valueColor: COLORS.rowValueGreen },
    { label: 'Issues Detected', value: '1 item', valueColor: COLORS.rowValueRed },
    { label: 'Photos Captured', value: '8' },
    { label: 'Duration', value: '9:00 AM – 11:20 AM', isLast: true },
  ];

  return (
    <View style={styles.screen}>
      <InspectionFlowHeader
        title="Inspection Complete"
        onBack={() => navigation?.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Success Icon ── */}
        <View style={styles.successIconWrapper}>
          <View style={styles.successIconCircle}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
        </View>

        {/* ── Title + Subtitle ── */}
        <Text style={styles.title}>Inspection Complete</Text>
        <Text style={styles.subtitle}>
          Bay View Apartments has been marked complete and synced to Bubble. Your PDF report is being generated.
        </Text>

        {/* ── Summary Card ── */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>SUMMARY</Text>
          {summaryRows.map(row => (
            <SummaryRow key={row.label} {...row} />
          ))}
        </View>

        {/* ── Buttons ── */}
        <View style={styles.buttonsWrapper}>
          {/* Preview Report */}
          <Pressable
            style={styles.primaryBtn}
            android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
            onPress={() => {navigation.navigate('InspectionReport', {inspectionId})}}
          >
            <Text style={styles.primaryBtnText}>Preview Report</Text>
          </Pressable>

          {/* Back to Schedule */}
          <Pressable
            style={styles.secondaryBtn}
            android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
            onPress={() => navigation?.navigate('InspectionList')}
          >
            <Text style={styles.secondaryBtnText}>← Back to Schedule</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },

  // ── Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(32),
    paddingBottom: verticalScale(40),
    alignItems: 'center',
    gap: verticalScale(16),
  },

  // ── Success Icon
  successIconWrapper: {
    marginBottom: verticalScale(4),
  },
  successIconCircle: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    backgroundColor: COLORS.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconText: {
    fontSize: moderateScale(30),
    color: COLORS.successIcon,
    fontWeight: '800',
    lineHeight: moderateScale(36),
  },

  // ── Title + Subtitle
  title: {
    fontFamily: 'Inter',
    fontWeight: '800',
    fontSize: moderateScale(22),
    lineHeight: moderateScale(33),
    color: COLORS.titleText,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: moderateScale(15),
    lineHeight: moderateScale(24.38),
    color: COLORS.subtitleText,
    textAlign: 'center',
    paddingHorizontal: scale(8),
  },

  // ── Summary Card
  summaryCard: {
    width: scale(330),
    backgroundColor: COLORS.cardBg,
    borderRadius: moderateScale(16),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(4),
    marginTop: verticalScale(4),
  },
  summaryLabel: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16.5),
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: COLORS.sectionLabel,
    marginBottom: verticalScale(8),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
  },
  summaryRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  summaryRowLabel: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22.5),
    color: COLORS.rowLabel,
  },
  summaryRowValue: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22.5),
    color: COLORS.rowValueDefault,
  },

  // ── Buttons
  buttonsWrapper: {
    width: scale(330),
    gap: verticalScale(12),
    marginTop: verticalScale(8),
  },
  primaryBtn: {
    width: '100%',
    height: verticalScale(52),
    backgroundColor: COLORS.primaryBtnBg,
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  primaryBtnText: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22.5),
    color: COLORS.primaryBtnText,
    textAlign: 'center',
  },
  secondaryBtn: {
    width: '100%',
    height: verticalScale(52),
    backgroundColor: COLORS.secondaryBtnBg,
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: COLORS.secondaryBtnBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  secondaryBtnText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    color: COLORS.secondaryBtnText,
    textAlign: 'center',
  },
});