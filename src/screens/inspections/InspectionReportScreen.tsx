import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { ConnectivityBanner } from '../../components/ConnectivityBanner';
import { InspectionFlowHeader } from '../../components/inspections/InspectionFlowHeader';
import { ScreenLoadingOverlay } from '../../components/ScreenLoadingOverlay';
import { MainStackParamList } from '../../navigation/types';

// ─── Design Tokens ────────────────────────────────────────────────────────────

const COLORS = {
  primary: '#2091F9',
  headerBg: '#2091F9',
  headerText: '#FFFFFF',
  headerTextSubtle: '#FFFFFFCC',
  headerIconBg: '#FFFFFF26',

  screenBg: '#F1F5F9',
  cardBg: '#FFFFFF',
  cardBorder: '#E2E8F0',

  titleText: '#0F172A',
  subtleText: '#64748B',
  metaLabel: '#94A3B8',
  metaValue: '#0F172A',

  // Summary tiles
  tileGray: '#F1F5F9',
  tileGreen: '#DCFCE7',
  tileRed: '#FEE2E2',
  tileBlue: '#DBEAFE',

  tileGrayNum: '#0F172A',
  tileGrayLabel: '#64748B',
  tileGreenNum: '#16A34A',
  tileGreenLabel: '#16A34A',
  tileRedNum: '#DC2626',
  tileRedLabel: '#B91C1C',
  tileBlueNum: '#2091F9',
  tileBlueLabel: '#1677D6',

  sectionLabel: '#94A3B8',
  itemTitle: '#0F172A',
  itemSubtitle: '#64748B',

  noBadgeBg: '#FEE2E2',
  noBadgeText: '#DC2626',

  commentBg: '#F8FAFC',
  commentBorder: '#E2E8F0',
  commentLabel: '#94A3B8',
  commentText: '#0F172A',

  photoCount: '#2091F9',
  timestamp: '#94A3B8',

  downloadBg: '#F8FAFC',
  downloadBorder: '#E2E8F0',
  downloadText: '#0F172A',
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PHOTOS = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
  'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
];

interface InspectionItem {
  id: string;
  position: string;
  inspection: string;
  status: 'No' | 'Yes' | 'N/A';
  comment: string;
  time: string;
  photos: string[];
}

const INSPECTION_ITEMS: InspectionItem[] = [
  {
    id: '1',
    position: 'Position 1',
    inspection: 'Inspection Q1',
    status: 'No',
    comment:
      'Minor scratch observed on the top right corner. The scratch is superficial and not deep.',
    time: '9:15 AM',
    photos: MOCK_PHOTOS,
  },
  {
    id: '2',
    position: 'Kitchen – Unit 204',
    inspection: 'Extension DDInspn',
    status: 'No',
    comment:
      'Debris on Window Glass A noticeable dark speck, likely debris or dirt, is visible on the upper portion of the window glass, indicating a need for exterior cleaning or residue from construction.',
    time: '9:45 AM',
    photos: [...MOCK_PHOTOS, ...MOCK_PHOTOS],
  },
  {
    id: '3',
    position: 'Bathroom – Unit 301',
    inspection: 'Inspection Q3',
    status: 'No',
    comment: 'Water stain on ceiling tile. Appears dry but needs monitoring.',
    time: '10:10 AM',
    photos: MOCK_PHOTOS.slice(0, 2),
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryTile({
  bg,
  num,
  numColor,
  label,
  labelColor,
}: {
  bg: string;
  num: string;
  numColor: string;
  label: string;
  labelColor: string;
}) {
  return (
    <View style={[styles.summaryTile, { backgroundColor: bg }]}>
      <Text style={[styles.summaryTileNum, { color: numColor }]}>{num}</Text>
      <Text style={[styles.summaryTileLabel, { color: labelColor }]}>{label}</Text>
    </View>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isNo = status === 'No';
  return (
    <View style={[styles.badge, isNo ? styles.badgeNo : styles.badgeYes]}>
      <Text style={[styles.badgeText, isNo ? styles.badgeTextNo : styles.badgeTextYes]}>
        {status}
      </Text>
    </View>
  );
}

function PhotoGrid({
  photos,
  onPhotoPress,
}: {
  photos: string[];
  onPhotoPress: (index: number) => void;
}) {
  const displayed = photos.slice(0, 6);
  const pairs: string[][] = [];
  for (let i = 0; i < displayed.length; i += 2) {
    pairs.push(displayed.slice(i, i + 2));
  }
  return (
    <View style={styles.photoGrid}>
      {pairs.map((pair, rowIdx) => (
        <View key={rowIdx} style={styles.photoRow}>
          {pair.map((uri, colIdx) => (
            <Pressable
              key={colIdx}
              onPress={() => onPhotoPress(rowIdx * 2 + colIdx)}
              style={styles.photoThumb}
            >
              <Image source={{ uri }} style={styles.photoThumbImg} />
            </Pressable>
          ))}
          {pair.length === 1 && <View style={styles.photoThumbSpacer} />}
        </View>
      ))}
    </View>
  );
}

function InspectionCard({
  item,
  onPhotoPress,
}: {
  item: InspectionItem;
  onPhotoPress: (photos: string[], index: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [photosVisible, setPhotosVisible] = useState(false);
  const isLong = item.comment.length > 120;
  const displayComment =
    isLong && !expanded ? item.comment.slice(0, 120) + '…' : item.comment;

  return (
    <View style={styles.inspectionCard}>
      {/* Title row */}
      <View style={styles.inspectionHeader}>
        <View style={styles.inspectionHeaderText}>
          <Text style={styles.inspectionTitle}>{item.position}</Text>
          <Text style={styles.inspectionSubtitle}>{item.inspection}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      {/* Comment box */}
      <View style={styles.commentBox}>
        <Text style={styles.commentLabel}>COMMENT</Text>
        <Text style={styles.commentText}>{displayComment}</Text>
        {isLong && (
          <Pressable onPress={() => setExpanded(v => !v)}>
            <Text style={styles.showMore}>{expanded ? 'Show less' : 'Show more'}</Text>
          </Pressable>
        )}
      </View>

      {/* Photos expanded grid */}
      {photosVisible && (
        <PhotoGrid
          photos={item.photos}
          onPhotoPress={idx => onPhotoPress(item.photos, idx)}
        />
      )}

      {/* Footer */}
      <View style={styles.inspectionFooter}>
        <Text style={styles.timestampText}>{item.time}</Text>
        <Pressable onPress={() => setPhotosVisible(v => !v)}>
          <Text style={styles.photoCountText}>
            📷  {item.photos.length} photo{item.photos.length !== 1 ? 's' : ''}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function InspectionReportScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<MainStackParamList, 'InspectionReport'>>();
  const { inspectionId } = route.params;

  const [lightboxPhotos, setLightboxPhotos] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [loading] = useState(false);
  const [loadError] = useState<string | null>(null);

  const handlePhotoPress = (photos: string[], index: number) => {
    setLightboxPhotos(photos);
    setLightboxIndex(index);
    setLightboxVisible(true);
  };

  return (
    <View style={styles.screen}>
      <InspectionFlowHeader
        title="Inspection Report"
        layout="report"
        onBack={() => navigation.goBack()}
      />
      <ConnectivityBanner />
      {loadError ? (
        <Text style={styles.loadErrorText}>{loadError}</Text>
      ) : null}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Info Card ── */}
        <View style={styles.infoCard}>
          <Text style={styles.propertyTitle}>Bay View Apartments</Text>
          <Text style={styles.propertySubtitle}>Bayside Development</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Inspector: </Text>
            <Text style={styles.metaValue}>John Smith</Text>
            <Text style={[styles.metaLabel, { marginLeft: scale(12) }]}>Date: </Text>
            <Text style={styles.metaValue}>March 17, 2026</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Duration: </Text>
            <Text style={styles.metaValue}>9:00 AM – 11:20 AM</Text>
          </View>
        </View>

        {/* ── Summary Card ── */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionLabel}>SUMMARY</Text>

          {/* Row 1 */}
          <View style={styles.summaryRow}>
            <SummaryTile
              bg={COLORS.tileGray}
              num="30"
              numColor={COLORS.tileGrayNum}
              label="Total Questions"
              labelColor={COLORS.tileGrayLabel}
            />
            <SummaryTile
              bg={COLORS.tileGreen}
              num="3"
              numColor={COLORS.tileGreenNum}
              label="No Issues"
              labelColor={COLORS.tileGreenLabel}
            />
          </View>

          {/* Row 2 */}
          <View style={styles.summaryRow}>
            <SummaryTile
              bg={COLORS.tileRed}
              num="1"
              numColor={COLORS.tileRedNum}
              label="Issues Detected"
              labelColor={COLORS.tileRedLabel}
            />
            <SummaryTile
              bg={COLORS.tileBlue}
              num="8"
              numColor={COLORS.tileBlueNum}
              label="Photos Captured"
              labelColor={COLORS.tileBlueLabel}
            />
          </View>
        </View>

        {/* ── Inspection Items ── */}
        <Text style={styles.sectionLabel}>INSPECTION ITEMS</Text>

        {INSPECTION_ITEMS.map(item => (
          <InspectionCard key={item.id} item={item} onPhotoPress={handlePhotoPress} />
        ))}

        {/* ── Bottom Buttons ── */}
        <View style={styles.buttonsRow}>
          <Pressable
            style={styles.actionBtn}
            android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
            onPress={() => {}}
          >
            <Text style={styles.actionBtnText}>⬇  Download PDF</Text>
          </Pressable>
          <Pressable
            style={styles.actionBtn}
            android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
            onPress={() => {}}
          >
            <Text style={styles.actionBtnText}>✉  Email Report</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* ── Lightbox Modal ── */}
      <Modal
        visible={lightboxVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLightboxVisible(false)}
      >
        <Pressable style={styles.lightboxOverlay} onPress={() => setLightboxVisible(false)}>
          <Image
            source={{ uri: lightboxPhotos[lightboxIndex] }}
            style={styles.lightboxImage}
            resizeMode="contain"
          />
          <Text style={styles.lightboxCounter}>
            {lightboxIndex + 1} / {lightboxPhotos.length}
          </Text>
          <View style={styles.lightboxNav}>
            <TouchableOpacity
              onPress={e => {
                e.stopPropagation();
                setLightboxIndex(i => Math.max(0, i - 1));
              }}
              style={styles.lightboxNavBtn}
            >
              <Text style={styles.lightboxNavText}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={e => {
                e.stopPropagation();
                setLightboxIndex(i => Math.min(lightboxPhotos.length - 1, i + 1));
              }}
              style={styles.lightboxNavBtn}
            >
              <Text style={styles.lightboxNavText}>›</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      <ScreenLoadingOverlay visible={loading} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.screenBg },
  loadErrorText: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    color: '#DC2626',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
  },

  // ── Scroll
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(40),
    gap: verticalScale(12),
  },

  // ── Info Card
  infoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: moderateScale(16),
    padding: scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    gap: verticalScale(3),
  },
  propertyTitle: {
    fontFamily: 'Inter',
    fontWeight: '800',
    fontSize: moderateScale(20),
    lineHeight: moderateScale(30),
    color: COLORS.titleText,
  },
  propertySubtitle: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(21),
    color: COLORS.subtleText,
    marginBottom: verticalScale(4),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: moderateScale(13),
    lineHeight: moderateScale(19.5),
    color: COLORS.metaLabel,
  },
  metaValue: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: moderateScale(13),
    lineHeight: moderateScale(19.5),
    color: COLORS.metaValue,
  },

  // ── Summary Card
  summaryCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: moderateScale(16),
    padding: scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    gap: verticalScale(10),
  },
  sectionLabel: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16.5),
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: COLORS.sectionLabel,
  },
  // Two explicit rows — reliable 2×2 grid with no flexWrap math
  summaryRow: {
    flexDirection: 'row',
    gap: scale(10),
  },
  summaryTile: {
    flex: 1,                          // each tile fills exactly half the row
    height: verticalScale(78),
    borderRadius: moderateScale(14),
    paddingTop: verticalScale(12),
    paddingHorizontal: scale(12),
    justifyContent: 'flex-start',
  },
  summaryTileNum: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(24),
    lineHeight: moderateScale(36),
  },
  summaryTileLabel: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: moderateScale(12),
    lineHeight: moderateScale(18),
  },

  // ── Inspection Card
  inspectionCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: moderateScale(16),
    paddingTop: scale(16),
    paddingHorizontal: scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    gap: verticalScale(8),
  },
  inspectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  inspectionHeaderText: { flex: 1 },
  inspectionTitle: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22.5),
    color: COLORS.itemTitle,
  },
  inspectionSubtitle: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: moderateScale(13),
    lineHeight: moderateScale(19.5),
    color: COLORS.itemSubtitle,
  },

  // Badge
  badge: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(20),
    marginLeft: scale(8),
    alignSelf: 'flex-start',
  },
  badgeNo: { backgroundColor: COLORS.noBadgeBg },
  badgeYes: { backgroundColor: '#DCFCE7' },
  badgeText: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(13),
    lineHeight: moderateScale(19.5),
  },
  badgeTextNo: { color: COLORS.noBadgeText },
  badgeTextYes: { color: '#16A34A' },

  // Comment box
  commentBox: {
    backgroundColor: COLORS.commentBg,
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: COLORS.commentBorder,
    paddingTop: verticalScale(13),
    paddingHorizontal: scale(13),
    paddingBottom: verticalScale(10),
    gap: verticalScale(6),
  },
  commentLabel: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16.5),
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: COLORS.commentLabel,
  },
  commentText: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: moderateScale(13),
    lineHeight: moderateScale(21.13),
    color: COLORS.commentText,
  },
  showMore: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: moderateScale(13),
    color: COLORS.primary,
    marginTop: verticalScale(2),
  },

  // Photo grid
  photoGrid: {
    gap: verticalScale(8),
  },
  photoRow: {
    flexDirection: 'row',
    gap: scale(8),
  },
  photoThumb: {
    flex: 1,
    height: verticalScale(99),
    borderRadius: moderateScale(14),
    overflow: 'hidden',
    backgroundColor: COLORS.commentBg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoThumbSpacer: {
    flex: 1,
  },
  photoThumbImg: {
    width: '100%',
    height: '100%',
  },

  // Inspection card footer
  inspectionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    marginHorizontal: -scale(16),
    paddingHorizontal: scale(16),
  },
  timestampText: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: moderateScale(12),
    lineHeight: moderateScale(18),
    color: COLORS.timestamp,
  },
  photoCountText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: moderateScale(12),
    lineHeight: moderateScale(18),
    color: COLORS.photoCount,
  },

  // ── Bottom Buttons
  buttonsRow: {
    flexDirection: 'row',
    gap: scale(10),
    marginTop: verticalScale(4),
  },
  actionBtn: {
    flex: 1,
    height: verticalScale(46),
    backgroundColor: COLORS.downloadBg,
    borderWidth: 1,
    borderColor: COLORS.downloadBorder,
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: moderateScale(13),
    color: COLORS.downloadText,
  },

  // ── Lightbox
  lightboxOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightboxImage: {
    width: '92%',
    height: '65%',
    borderRadius: moderateScale(12),
  },
  lightboxCounter: {
    color: '#FFFFFF99',
    fontSize: moderateScale(14),
    marginTop: verticalScale(12),
    fontFamily: 'Inter',
    fontWeight: '400',
  },
  lightboxNav: {
    flexDirection: 'row',
    gap: scale(40),
    marginTop: verticalScale(16),
  },
  lightboxNavBtn: {
    width: scale(48),
    height: scale(48),
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightboxNavText: {
    color: '#FFFFFF',
    fontSize: moderateScale(28),
    fontWeight: '600',
    lineHeight: moderateScale(32),
  },
});