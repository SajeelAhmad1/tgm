import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import SignatureCanvas, { SignatureViewRef } from 'react-native-signature-canvas';
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

    // Section labels
    sectionLabel: '#94A3B8',

    // Card
    cardBg: '#FFFFFF',
    cardBorder: '#E2E8F0',

    // Text values
    valueText: '#0F172A',
    subtleText: '#64748B',

    // Signature
    signatureBorder: '#E2E8F0',
    tapToSignText: '#94A3B8',

    // Approvers card
    approversBg: '#EBF5FF',
    approversTitle: '#2091F9',
    approversNone: '#64748B',
    approversAdd: '#2091F9',

    // Buttons
    completeBg: '#2091F9',
    completeText: '#FFFFFF',
    backBg: '#FFFFFF',
    backText: '#0F172A',
    backBorder: '#E2E8F0',

    screenBg: '#F8FAFC',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoField({
    label,
    value,
    isLast = false,
}: {
    label: string;
    value: string;
    isLast?: boolean;
}) {
    return (
        <View style={[styles.infoField, !isLast && styles.infoFieldBorder]}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <Text style={styles.fieldValue}>{value}</Text>
        </View>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function ClientSignatureScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const route = useRoute<RouteProp<MainStackParamList, 'ClientSignature'>>();
    const { inspectionId } = route.params;
    const sigRef = useRef<SignatureViewRef>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [isDrawing, setIsDrawing] = useState(false);

    // Lock scroll when finger enters canvas, unlock when lifted
    const handleBegin = () => {
        setIsEmpty(false);
        setIsDrawing(true);
    };
    const handleEnd = () => setIsDrawing(false);

    const handleClear = () => {
        sigRef.current?.clearSignature();
        setIsEmpty(true);
        setIsDrawing(false);
    };


    // Called by SignatureCanvas after readSignature() succeeds
    const handleOK = (sig: string) => {
        // `sig` is a base64-encoded PNG string — forward to your API / store here
        console.log('Signature captured:', sig.substring(0, 80) + '…');
    };

    // Hides the library's built-in buttons and removes all default padding
    const webStyle = `
    .m-signature-pad { border: none; box-shadow: none; margin: 0; width: 100%; height: 100%; }
    .m-signature-pad--body { border: none; width: 100%; height: 100%; }
    .m-signature-pad--footer { display: none; }
    body { margin: 0; padding: 0; background: transparent; }
    canvas { width: 100% !important; height: 100% !important; }
  `;

    return (
        <View style={styles.screen}>
            <InspectionFlowHeader
                title="Client Signature"
                subtitle="Bay View Apartments · Client Sign-Off"
                onBack={() => navigation?.goBack()}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                scrollEnabled={!isDrawing}
            >
                {/* ── Info Card (Signer Name + Company) ── */}
                <View style={styles.infoCard}>
                    <InfoField label="SIGNER NAME" value="Sarah Chen" />
                    <InfoField label="COMPANY" value="Bayside Development" isLast />
                </View>

                {/* ── Signature Section ── */}
                <View style={styles.signatureSection}>
                    <Text style={styles.signatureSectionLabel}>SIGNATURE</Text>

                    <View style={styles.signatureBox}>
                        {/* Drawing area */}
                        <View style={styles.signatureCanvasWrapper}>
                            {/* "Tap to sign" hint — hidden once user starts drawing */}
                            {isEmpty && (
                                <View style={styles.tapToSignOverlay} pointerEvents="none">
                                    <Text style={styles.signatureIcon}>✍️</Text>
                                    <Text style={styles.tapToSign}>Tap to sign</Text>
                                </View>
                            )}
                            <SignatureCanvas
                                ref={sigRef}
                                onBegin={handleBegin}
                                onEnd={handleEnd}
                                onOK={handleOK}
                                descriptionText=""
                                clearText=""
                                confirmText=""
                                webStyle={webStyle}
                                penColor="#0F172A"
                                backgroundColor="rgba(255,255,255,0)"
                                style={styles.signatureCanvas}
                            />
                        </View>

                        {/* Retake / Clear row */}
                        <View style={styles.signatureActions}>
                            <Pressable
                                style={styles.signatureActionBtn}
                                onPress={handleClear}
                                android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
                            >
                                <Text style={styles.signatureActionText}>Retake</Text>
                            </Pressable>
                            <View style={styles.signatureActionDivider} />
                            <Pressable
                                style={styles.signatureActionBtn}
                                onPress={handleClear}
                                android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
                            >
                                <Text style={styles.signatureActionText}>Clear</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* ── Additional Approvers Card ── */}
                <View style={styles.approversCard}>
                    <Text style={styles.approversTitle}>Additional Approvers</Text>
                    <Text style={styles.approversNone}>None added</Text>
                    <Pressable hitSlop={8} onPress={() => { }}>
                        <Text style={styles.approversAdd}>+ Add Approver</Text>
                    </Pressable>
                </View>

                {/* ── Buttons ── */}
                <View style={styles.buttonsWrapper}>
                    {/* Complete Inspection */}
                    <Pressable
                        style={styles.completeBtn}
                        android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
                        onPress={() => { navigation.navigate('InspectionComplete', { inspectionId }) }}
                    >
                        <Text style={styles.completeBtnText}>Complete Inspection ✓</Text>
                    </Pressable>

                    {/* Back — same shape as completeBtn, white with border */}
                    <Pressable
                        style={styles.backBtn}
                        android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                        onPress={() => navigation?.goBack()}
                    >
                        <Text style={styles.backBtnText}>Back</Text>
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
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(20),
        paddingBottom: verticalScale(40),
        gap: verticalScale(16),
        alignItems: 'center',
    },

    // ── Info Card
    infoCard: {
        width: scale(342),
        backgroundColor: COLORS.cardBg,
        borderRadius: moderateScale(16),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
        overflow: 'hidden',
        paddingHorizontal: scale(16),
    },
    infoField: {
        paddingVertical: verticalScale(14),
    },
    infoFieldBorder: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.cardBorder,
    },
    fieldLabel: {
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: moderateScale(11),
        lineHeight: moderateScale(16.5),
        letterSpacing: 0.88,
        textTransform: 'uppercase',
        color: COLORS.sectionLabel,
        marginBottom: verticalScale(4),
    },
    fieldValue: {
        fontFamily: 'Inter',
        fontWeight: '500',
        fontSize: moderateScale(17),
        lineHeight: moderateScale(25.5),
        color: COLORS.valueText,
    },

    // ── Signature Section
    signatureSection: {
        width: scale(342),
    },
    signatureSectionLabel: {
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: moderateScale(11),
        lineHeight: moderateScale(16.5),
        letterSpacing: 0.88,
        textTransform: 'uppercase',
        color: COLORS.sectionLabel,
        marginBottom: verticalScale(8),
        marginLeft: scale(4),
    },
    signatureBox: {
        backgroundColor: COLORS.cardBg,
        borderWidth: 2,
        borderColor: COLORS.signatureBorder,
        borderRadius: moderateScale(16),
        overflow: 'hidden',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    signatureCanvasWrapper: {
        height: verticalScale(160),
        position: 'relative',
    },
    signatureCanvas: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    tapToSignOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        gap: verticalScale(6),
        zIndex: 0,
    },
    signatureIcon: {
        fontSize: moderateScale(32),
    },
    tapToSign: {
        fontFamily: 'Inter',
        fontWeight: '400',
        fontSize: moderateScale(14),
        lineHeight: moderateScale(20),
        color: COLORS.tapToSignText,
    },

    // Retake / Clear row
    signatureActions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: COLORS.cardBorder,
    },
    signatureActionBtn: {
        flex: 1,
        paddingVertical: verticalScale(13),
        alignItems: 'center',
        justifyContent: 'center',
    },
    signatureActionDivider: {
        width: 1,
        backgroundColor: COLORS.cardBorder,
    },
    signatureActionText: {
        fontFamily: 'Inter',
        fontWeight: '600',
        fontSize: moderateScale(14),
        lineHeight: moderateScale(20),
        color: COLORS.subtleText,
        textAlign: 'center',
    },

    // ── Approvers Card
    approversCard: {
        width: scale(342),
        backgroundColor: COLORS.approversBg,
        borderRadius: moderateScale(16),
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(14),
        gap: verticalScale(4),
    },
    approversTitle: {
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: moderateScale(14),
        lineHeight: moderateScale(20),
        color: COLORS.approversTitle,
    },
    approversNone: {
        fontFamily: 'Inter',
        fontWeight: '400',
        fontSize: moderateScale(14),
        lineHeight: moderateScale(20),
        color: COLORS.approversNone,
    },
    approversAdd: {
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: moderateScale(14),
        lineHeight: moderateScale(20),
        color: COLORS.approversAdd,
        marginTop: verticalScale(4),
    },

    // ── Buttons
    buttonsWrapper: {
        width: scale(342),
        gap: verticalScale(12),
    },
    completeBtn: {
        width: '100%',
        height: verticalScale(52),
        backgroundColor: COLORS.completeBg,
        borderRadius: moderateScale(16),
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    completeBtnText: {
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: moderateScale(15),
        lineHeight: moderateScale(22.5),
        color: COLORS.completeText,
        textAlign: 'center',
    },
    // Back — same dimensions as completeBtn, white bg with border
    backBtn: {
        width: '100%',
        height: verticalScale(52),
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