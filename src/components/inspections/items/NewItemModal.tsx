import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { FormFieldLabel, FormTextInput } from '../../forms/FormFieldPrimitives';

// ─── Design Tokens ────────────────────────────────────────────────────────────

const COLORS = {
  primary: '#2091F9',
  screenBg: '#F1F5F9',

  // Title
  titleText: '#0F172A',

  // Questions
  questionText: '#0F172A',

  // Buttons
  cancelBg: '#FFFFFF',
  cancelBorder: '#E2E8F0',
  cancelText: '#0F172A',
  submitBg: '#2091F9',
  submitText: '#FFFFFF',

  // Overlay
  overlay: 'rgba(15, 23, 42, 0.5)',
  sheetBg: '#F8FAFC',
  headerBg: '#FFFFFF',
  divider: '#E2E8F0',
};

// ─── Mock questions ───────────────────────────────────────────────────────────

const QUESTIONS = [
  'Is the unit free from visible damage?',
  'Is the hardware free from visible damage',
  'Is the screen in good working order.',
  'Ist die Oberfläche gleichmäßig?',
  'Entspricht die Installation den Plänen?',
  'Sind alle Befestigungen sicher?',
  'Gibt es sichtbare Beschädigungen?',
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface NewItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: NewItemData) => void;
}

export interface NewItemData {
  positionCode: boolean;
  // Position code ON fields
  structure: string;
  floor: string;
  room: string;
  position: string;
  // Position code OFF fields
  itemName: string;
  tagUniqueId: string;
  location: string;
  // Shared
  itemQty: string;
  bucket: string;
  bucketPhase: string;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function NewItemModal({ visible, onClose, onSubmit }: NewItemModalProps) {
  const [positionCode, setPositionCode] = useState(true);

  // Position code ON
  const [structure, setStructure] = useState('01');
  const [floor, setFloor] = useState('00');
  const [room, setRoom] = useState('00');
  const [position, setPosition] = useState('0010');

  // Position code OFF
  const [itemName, setItemName] = useState('');
  const [tagUniqueId, setTagUniqueId] = useState('');
  const [location, setLocation] = useState('');

  // Shared
  const [itemQty, setItemQty] = useState('1');
  const [bucket, setBucket] = useState('');
  const [bucketPhase, setBucketPhase] = useState('');

  const handleSubmit = () => {
    onSubmit({
      positionCode,
      structure, floor, room, position,
      itemName, tagUniqueId, location,
      itemQty, bucket, bucketPhase,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Dim overlay — tap to dismiss */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kvWrapper}
        pointerEvents="box-none"
      >
        <View style={styles.sheet}>

          {/* ── Sheet Header ── */}
          <View style={styles.sheetHeader}>
            {/* Back arrow */}
            <Pressable style={styles.backBtn} hitSlop={8} onPress={onClose}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <Text style={styles.sheetTitle}>New Item</Text>
            <View style={styles.backBtn} />
          </View>

          {/* ── Scrollable Body ── */}
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── Position Code toggle row ── */}
            <View style={styles.toggleRow}>
              <FormFieldLabel>Position Code</FormFieldLabel>
              <Switch
                value={positionCode}
                onValueChange={setPositionCode}
                trackColor={{ false: '#CBD5E1', true: COLORS.primary }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#CBD5E1"
              />
            </View>

            {positionCode ? (
              /* ── Toggle ON: Structure / Floor / Room + Position ── */
              <>
                <View style={styles.tripleRow}>
                  <View style={styles.tripleCell}>
                    <FormFieldLabel>Structure</FormFieldLabel>
                    <FormTextInput value={structure} onChangeText={setStructure} keyboardType="numeric" />
                  </View>
                  <View style={styles.tripleCell}>
                    <FormFieldLabel>Floor</FormFieldLabel>
                    <FormTextInput value={floor} onChangeText={setFloor} keyboardType="numeric" />
                  </View>
                  <View style={styles.tripleCell}>
                    <FormFieldLabel>Room</FormFieldLabel>
                    <FormTextInput value={room} onChangeText={setRoom} keyboardType="numeric" />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <FormFieldLabel>Position</FormFieldLabel>
                  <FormTextInput value={position} onChangeText={setPosition} />
                </View>
              </>
            ) : (
              /* ── Toggle OFF: Item Name / Tag-Unique ID / Location ── */
              <>
                <View style={styles.fieldGroup}>
                  <FormFieldLabel>Item Name</FormFieldLabel>
                  <FormTextInput value={itemName} onChangeText={setItemName} />
                </View>
                <View style={styles.fieldGroup}>
                  <FormFieldLabel>Tag-Unique ID</FormFieldLabel>
                  <FormTextInput value={tagUniqueId} onChangeText={setTagUniqueId} />
                </View>
                <View style={styles.fieldGroup}>
                  <FormFieldLabel>Location</FormFieldLabel>
                  <FormTextInput value={location} onChangeText={setLocation} />
                </View>
              </>
            )}

            {/* ── Item Qty (always shown) ── */}
            <View style={styles.itemQtyRow}>
              <FormFieldLabel>Item Qty</FormFieldLabel>
              <FormTextInput
                value={itemQty}
                onChangeText={setItemQty}
                keyboardType="numeric"
                style={styles.itemQtyInput}
              />
            </View>

            {/* ── Bucket ── */}
            <View style={styles.fieldGroup}>
              <FormFieldLabel>Bucket</FormFieldLabel>
              <FormTextInput value={bucket} onChangeText={setBucket} />
            </View>

            {/* ── Bucket Phase ── */}
            <View style={styles.fieldGroup}>
              <FormFieldLabel>Bucket Phase</FormFieldLabel>
              <FormTextInput value={bucketPhase} onChangeText={setBucketPhase} />
            </View>

            {/* ── Select Questions ── */}
            <View style={styles.fieldGroup}>
              <FormFieldLabel>Select Questions</FormFieldLabel>
              <View style={styles.questionsList}>
                {QUESTIONS.map((q, i) => (
                  <Text key={i} style={styles.questionText}>
                    {q}
                  </Text>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* ── Footer Buttons ── */}
          <View style={styles.footer}>
            <Pressable
              style={styles.cancelBtn}
              onPress={onClose}
              android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={styles.submitBtn}
              onPress={handleSubmit}
              android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
            >
              <Text style={styles.submitBtnText}>✓  New Item</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },
  kvWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  // Sheet
  sheet: {
    backgroundColor: COLORS.sheetBg,
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    minHeight: '90%',
    overflow: 'hidden',
  },

  // Header
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.headerBg,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  backBtn: {
    width: scale(32),
    height: scale(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: moderateScale(20),
    color: COLORS.primary,
    fontWeight: '600',
  },
  sheetTitle: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(20),
    lineHeight: moderateScale(28),
    color: COLORS.titleText,
    textAlign: 'center',
  },

  // Body
  body: { flex: 1 },
  bodyContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(8),
    gap: verticalScale(14),
  },

  // Toggle row
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Triple row (Structure / Floor / Room)
  tripleRow: {
    flexDirection: 'row',
    gap: scale(10),
  },
  tripleCell: {
    flex: 1,
  },

  // Generic field group
  fieldGroup: {},

  // Item Qty row
  itemQtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(12),
  },
  itemQtyInput: {
    width: scale(80),
    textAlign: 'center',
  },

  // Questions list
  questionsList: {
    gap: verticalScale(12),
    paddingTop: verticalScale(4),
  },
  questionText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22.5),
    color: COLORS.questionText,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    gap: scale(10),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    backgroundColor: COLORS.headerBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  cancelBtn: {
    flex: 1,
    height: verticalScale(46),
    backgroundColor: COLORS.cancelBg,
    borderWidth: 1,
    borderColor: COLORS.cancelBorder,
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cancelBtnText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: moderateScale(14),
    color: COLORS.cancelText,
  },
  submitBtn: {
    flex: 2,
    height: verticalScale(46),
    backgroundColor: COLORS.submitBg,
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  submitBtnText: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(14),
    color: COLORS.submitText,
  },
});