import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { ConnectivityBanner } from '../../components/ConnectivityBanner';
import { InspectionFlowHeader } from '../../components/inspections/InspectionFlowHeader';
import { ScreenLoadingOverlay } from '../../components/ScreenLoadingOverlay';
import { MainStackParamList } from '../../navigation/types';

// ─── Design Tokens ────────────────────────────────────────────────────────────

const COLORS = {
  // Brand
  primary: '#2091F9',

  // Header
  headerBg: '#2091F9',
  headerText: '#FFFFFF',
  headerTextSubtle: '#FFFFFFCC',
  headerIconBg: '#FFFFFF26',

  // Summary card
  summaryBg: '#DCFCE7',
  summaryText: '#16A34A',

  // Section labels
  sectionLabel: '#94A3B8',

  // Input / card
  inputBg: '#FFFFFF',
  inputBorder: '#E2E8F0',
  inputText: '#0F172A',
  inputPlaceholder: 'rgba(15, 23, 42, 0.50)', // #0F172A80
  cardShadowColor: '#00000014',

  // Buttons
  proceedBg: '#2091F9',
  proceedText: '#FFFFFF',
  backBg: '#FFFFFF',
  backText: '#0F172A',
  backBorder: '#E2E8F0',

  // Screen bg
  screenBg: '#F8FAFC',
};

// ─── Types ────────────────────────────────────────────────────────────────────

// Uncomment and adapt to your navigation setup:
// type Props = NativeStackScreenProps<AppStackParamList, 'CompleteInspection'>;

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Labelled input row inside a white card section */
function FieldSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.fieldSection}>
      <View style={styles.fieldCard}>
        <View style={styles.fieldLabelRow}>
          <Text style={styles.fieldLabel}>{label}</Text>
        </View>
        {children}
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
type Props = NativeStackScreenProps<MainStackParamList, 'CompleteInspection'>;

export function CompleteInspectionScreen({route}: Props) {
  const {inspectionId} = route.params;
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading] = useState(false);
  const [loadError] = useState<string | null>(null);

  return (
    <View style={styles.screen}>
      <InspectionFlowHeader
        title="Complete Inspection"
        subtitle="Bay View Apartments"
        onBack={() => navigation?.goBack()}
      />
      <ConnectivityBanner />
      {loadError ? (
        <Text style={styles.loadErrorText}>{loadError}</Text>
      ) : null}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Summary Card ── */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryCheckWrapper}>
            <View style={styles.summaryCheckBox}>
              <Text style={styles.summaryCheckMark}>✓</Text>
            </View>
          </View>
          <View style={styles.summaryTextWrapper}>
            <Text style={styles.summaryTitle}>All items reviewed</Text>
            <Text style={styles.summarySubtitle}>
              30/30 questions complete · 2 issues detected
            </Text>
          </View>
        </View>

        {/* ── Start Time ── */}
        <FieldSection label="START TIME">
          <TextInput
            value={startTime}
            onChangeText={setStartTime}
            placeholder=""
            placeholderTextColor={COLORS.inputPlaceholder}
            style={styles.timeInput}
          />
        </FieldSection>

        {/* ── End Time ── */}
        <FieldSection label="END TIME">
          <TextInput
            value={endTime}
            onChangeText={setEndTime}
            placeholder=""
            placeholderTextColor={COLORS.inputPlaceholder}
            style={styles.timeInput}
          />
        </FieldSection>

        {/* ── Notes ── */}
        <FieldSection label="NOTES (OPTIONAL)">
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder={
              'e.g. Follow the stickers on the windows — numbers correspond to report positions.'
            }
            placeholderTextColor={COLORS.inputPlaceholder}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.notesInput}
          />
        </FieldSection>

        {/* ── Buttons ── */}
        <View style={styles.buttonsWrapper}>
          {/* Proceed to Signature */}
          <Pressable
            style={styles.proceedBtn}
            android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
            onPress={() => {navigation.navigate('ClientSignature', {inspectionId})}}
          >
            <Text style={styles.proceedBtnText}>Proceed to Signature →</Text>
          </Pressable>

          {/* Back to Review */}
          <Pressable
            style={styles.backBtn}
            android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.backBtnText}>Back to Review</Text>
          </Pressable>
        </View>
      </ScrollView>
      <ScreenLoadingOverlay visible={loading} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  loadErrorText: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    color: '#DC2626',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
  },

  // ── Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(40),
    gap: verticalScale(16),
    alignItems: 'center',
  },

  // ── Summary Card
  summaryCard: {
    width: scale(342),
    minHeight: verticalScale(96.5),
    backgroundColor: COLORS.summaryBg,
    borderRadius: moderateScale(16),
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    gap: scale(12),
  },
  summaryCheckWrapper: {
    marginTop: verticalScale(2),
  },
  summaryCheckBox: {
    width: scale(24),
    height: scale(24),
    borderRadius: moderateScale(6),
    backgroundColor: COLORS.summaryText,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCheckMark: {
    color: '#FFFFFF',
    fontSize: moderateScale(14),
    fontWeight: '700',
    lineHeight: moderateScale(16),
  },
  summaryTextWrapper: {
    flex: 1,
  },
  summaryTitle: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22.5),
    color: COLORS.summaryText,
    marginBottom: verticalScale(2),
  },
  summarySubtitle: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    color: COLORS.summaryText,
  },

  // ── Field Section
  fieldSection: {
    width: scale(342),
  },
  fieldCard: {
    backgroundColor: COLORS.inputBg,
    borderRadius: moderateScale(12),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    paddingHorizontal: scale(14),
    overflow: 'hidden',
  },
  fieldLabelRow: {
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  fieldLabel: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16.5),
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: COLORS.sectionLabel,
  },

  // ── Inputs
  timeInput: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22.5),
    color: COLORS.inputText,
    height: verticalScale(44),
  },
  notesInput: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22.5),
    color: COLORS.inputText,
    minHeight: verticalScale(100),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(10),
  },

  // ── Buttons
  buttonsWrapper: {
    width: scale(342),
    gap: verticalScale(12),
    marginTop: verticalScale(8),
  },
  proceedBtn: {
    width: '100%',
    height: verticalScale(50.5),
    backgroundColor: COLORS.proceedBg,
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  proceedBtnText: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22.5),
    color: COLORS.proceedText,
    textAlign: 'center',
  },
  backBtn: {
    width: '100%',
    height: verticalScale(50.5),
    backgroundColor: COLORS.backBg,
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: COLORS.backBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  backBtnText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    color: COLORS.backText,
    textAlign: 'center',
  },
});