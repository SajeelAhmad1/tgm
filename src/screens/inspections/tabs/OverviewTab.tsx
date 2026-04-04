import {
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {MainStackParamList} from '../../../navigation/types';
import {
  getInspectionOverviewDetail,
  type InspectionOverviewDetail,
} from '../mockInspections';
import type {InspectionListItem} from '../../../components/inspections/InspectionListCard';
import {
  InspectionTabBar,
  type InspectionDetailTabId,
} from '../../../components/inspections/InspectionTabBar';
import {ItemsTab} from './ItemsTab';
import {PhotosTab} from './PhotosTab';
import {SummaryTab} from './SummaryTab';

const BLUE = '#2091F9';
const MUTED = '#94A3B8';
const LABEL = '#64748B';
const INK = '#0F172A';
const BORDER = '#E2E8F0';
const TINT_BG = '#EBF5FF';

type InspectionBundle = {
  list: InspectionListItem;
  detail: InspectionOverviewDetail;
};

function Pill({children}: {children: string}) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{children}</Text>
    </View>
  );
}

function SectionHeader({icon, title}: {icon: string; title: string}) {
  return (
    <View style={styles.sectionHeaderRow}>
      <Text style={styles.sectionHeaderIcon}>{icon}</Text>
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
    </View>
  );
}

function DetailRow({
  label,
  children,
  isLast,
}: {
  label: string;
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.detailRow, isLast && styles.detailRowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowValueWrap}>{children}</View>
    </View>
  );
}

function QuestionsCompletedCard({
  answered,
  total,
  issuesItemCount,
}: {
  answered: number;
  total: number;
  issuesItemCount: number;
}) {
  const issuesLine =
    issuesItemCount === 0
      ? 'No items with issues detected'
      : `${issuesItemCount} item${issuesItemCount === 1 ? '' : 's'} with issues detected`;

  return (
    <View style={styles.questionsCard}>
      <View style={styles.questionsLeft}>
        <Text style={styles.questionsTitle}>Questions Completed</Text>
        <Text style={styles.questionsSubtitle}>{issuesLine}</Text>
      </View>
      <Text style={styles.questionsScore}>
        {answered}/{total}
      </Text>
    </View>
  );
}

function InspectionOverviewScroll({data}: {data: InspectionBundle}) {
  const {list, detail} = data;
  const answered = list.progress?.answered ?? 0;
  const total = list.progress?.total ?? 0;

  const openMaps = () => {
    const q = encodeURIComponent(list.address);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <QuestionsCompletedCard
        answered={answered}
        total={total}
        issuesItemCount={detail.issuesItemCount}
      />

      <View style={styles.whiteCard}>
        <SectionHeader icon="📋" title="Inspection Details" />
        <DetailRow label="Type">
          <Text
            style={[styles.rowValueStrong, styles.rowValueFlex]}
            numberOfLines={4}>
            {detail.inspectionType}
          </Text>
        </DetailRow>
        <DetailRow label="Category">
          <Pill>{detail.category}</Pill>
        </DetailRow>
        <DetailRow label="Field Tech">
          <Text style={styles.rowValueStrong}>{list.assignee}</Text>
        </DetailRow>
        <DetailRow label="Status" isLast>
          <Pill>{detail.statusLabel}</Pill>
        </DetailRow>
      </View>

      <View style={styles.whiteCard}>
        <SectionHeader icon="📅" title="Schedule" />
        <DetailRow label="Date">
          <Text style={styles.rowValueStrong}>{detail.dateLabel}</Text>
        </DetailRow>
        <DetailRow label="Time Window" isLast>
          <Text style={styles.rowValueStrong}>{list.timeRange}</Text>
        </DetailRow>
      </View>

      <View style={styles.whiteCard}>
        <SectionHeader icon="📍" title="Address" />
        <View style={[styles.detailRow, styles.detailRowLast, styles.addressRow]}>
          <Text style={styles.addressText}>{list.address}</Text>
          <Pressable onPress={openMaps} style={styles.mapsLink} hitSlop={8}>
            <Text style={styles.mapsLinkIcon}>↗</Text>
            <Text style={styles.mapsLinkText}>Maps</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

function OverviewSummary({data}: {data: InspectionBundle}) {
  return <InspectionOverviewScroll data={data} />;
}

function InspectionDetailHeader({
  title,
  subtitle,
  onBack,
  topInset,
}: {
  title: string;
  subtitle: string;
  onBack: () => void;
  topInset: number;
}) {
  return (
    <View style={[styles.hero, {paddingTop: topInset}]}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />
      <View style={styles.heroToolbar}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backBtn}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Text style={styles.backChevron}>‹</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.heroTitles}>
        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

type TabbedProps = {
  inspectionId: string;
};

function InspectionDetailTabbedLayout({inspectionId}: TabbedProps) {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<InspectionDetailTabId>('Overview');

  const bundle = getInspectionOverviewDetail(inspectionId);
  if (!bundle) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Inspection not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.missingLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewSummary data={bundle} />;
      case 'Items':
        return <ItemsTab inspectionId={inspectionId} />;
      case 'Review':
        return <SummaryTab inspectionId={inspectionId} />;
      case 'Photos':
        return <PhotosTab inspectionId={inspectionId} />;
    }
  };

  return (
    <View style={styles.container}>
      <InspectionDetailHeader
        title={bundle.list.title}
        subtitle={bundle.list.developer}
        onBack={() => navigation.goBack()}
        topInset={insets.top}
      />
      <InspectionTabBar activeTab={activeTab} onChange={setActiveTab} />
      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
}

export function InspectionDetailScreen() {
  const route = useRoute<RouteProp<MainStackParamList, 'InspectionDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const inspectionId = route.params?.inspectionId;

  if (!inspectionId) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Missing inspection.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.missingLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <InspectionDetailTabbedLayout inspectionId={inspectionId} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  hero: {
    backgroundColor: BLUE,
    paddingBottom: 20,
  },
  heroToolbar: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backChevron: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '300',
    marginTop: -4,
  },
  heroTitles: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 35,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    marginTop: 4,
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#FFFFFFCC',
  },
  content: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 16,
    gap: 16,
  },
  questionsCard: {
    width: '100%',
    maxWidth: 342,
    alignSelf: 'center',
    minHeight: 76.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 16,
    backgroundColor: TINT_BG,
  },
  questionsLeft: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 12,
  },
  questionsTitle: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 22.5,
    letterSpacing: 0,
    color: BLUE,
  },
  questionsSubtitle: {
    marginTop: 2,
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    color: BLUE,
  },
  questionsScore: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 22.5,
    letterSpacing: 0,
    color: BLUE,
  },
  whiteCard: {
    width: '100%',
    maxWidth: 342,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: BORDER,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  sectionHeaderIcon: {
    fontSize: 16,
  },
  sectionHeaderTitle: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 19.5,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: INK,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    gap: 12,
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    flexShrink: 0,
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 22.5,
    letterSpacing: 0,
    color: LABEL,
  },
  rowValueWrap: {
    flex: 1,
    minWidth: 0,
    alignItems: 'flex-end',
  },
  rowValueStrong: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 22.5,
    letterSpacing: 0,
    textAlign: 'right',
    color: INK,
  },
  rowValueFlex: {
    flexShrink: 1,
  },
  pill: {
    backgroundColor: TINT_BG,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  pillText: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 11,
    lineHeight: 11,
    letterSpacing: 0,
    color: BLUE,
  },
  addressRow: {
    alignItems: 'flex-start',
  },
  addressText: {
    flex: 1,
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 22.5,
    color: LABEL,
    paddingRight: 8,
  },
  mapsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mapsLinkIcon: {
    fontSize: 14,
    color: BLUE,
    fontWeight: '600',
  },
  mapsLinkText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
    color: BLUE,
  },
  missing: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F1F5F9',
    gap: 12,
  },
  missingText: {
    fontSize: 16,
    color: LABEL,
  },
  missingLink: {
    fontSize: 16,
    color: BLUE,
    fontWeight: '600',
  },
});
