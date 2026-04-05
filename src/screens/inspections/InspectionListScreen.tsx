import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {fetchInspectionsList} from '../../api/inspections/fetchInspectionsList';
import {InspectionListCard} from '../../components/inspections/InspectionListCard';
import {InspectionListHeader} from '../../components/inspections/InspectionListHeader';
import {InspectionSyncBanner} from '../../components/inspections/InspectionSyncBanner';
import {INSPECTION_LIST_COLORS} from '../../components/inspections/inspectionListTokens';
import type {MainStackParamList} from '../../navigation/types';
import {useInspectionsListStore} from '../../store/inspectionsListStore';

type Props = NativeStackScreenProps<MainStackParamList, 'InspectionList'>;

export function InspectionListScreen({navigation}: Props) {
  const [currentDate] = React.useState({day: 'Monday', date: '16 March 2026'});
  const [syncTime] = React.useState('9:38 AM');

  const items = useInspectionsListStore(s => s.items);
  const setItems = useInspectionsListStore(s => s.setItems);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = await fetchInspectionsList();
      if (!cancelled) {
        setItems(next);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setItems]);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={INSPECTION_LIST_COLORS.headerBg} />

      <InspectionListHeader
        userName="James Mitchell"
        currentDate={currentDate}
      />

      <InspectionSyncBanner lastSyncedLabel={`Synced · Last updated ${syncTime}`} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>{items.length} Inspections</Text>

        {items.map(item => (
          <InspectionListCard
            key={item.id}
            item={item}
            onPress={() =>
              navigation.navigate('InspectionDetail', {inspectionId: item.id})
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: INSPECTION_LIST_COLORS.screenBg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(32),
    gap: verticalScale(12),
  },
  sectionLabel: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16.5),
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: INSPECTION_LIST_COLORS.sectionLabel,
    marginBottom: verticalScale(4),
  },
});
