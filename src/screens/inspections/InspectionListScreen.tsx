import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {ConnectivityBanner} from '../../components/ConnectivityBanner';
import {InspectionListCard} from '../../components/inspections/InspectionListCard';
import {InspectionListHeader} from '../../components/inspections/InspectionListHeader';
import {InspectionSyncBanner} from '../../components/inspections/InspectionSyncBanner';
import {Sidebar} from '../../components/Sidebar';
import {INSPECTION_LIST_COLORS} from '../../components/inspections/inspectionListTokens';
import {ScreenLoadingOverlay} from '../../components/ScreenLoadingOverlay';
import type {MainStackParamList} from '../../navigation/types';
import {loadInspectionsData} from '../../services/loadInspectionsData';
import {useAuthStore} from '../../store/authStore';
import {useInspectionsListStore} from '../../store/inspectionsListStore';

type Props = NativeStackScreenProps<MainStackParamList, 'InspectionList'>;

type LoadMode = 'initial' | 'refresh';

export function InspectionListScreen({navigation}: Props) {
  const user = useAuthStore(s => s.user);
  const clearSession = useAuthStore(s => s.clearSession);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const items = useInspectionsListStore(s => s.items);
  const setItems = useInspectionsListStore(s => s.setItems);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const runLoad = useCallback(
    async (mode: LoadMode) => {
      if (mode === 'refresh') {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const result = await loadInspectionsData();
      setItems(result.items);
      setLoadError(result.error);
      setLastSyncedAt(new Date());
      setLoading(false);
      setRefreshing(false);
    },
    [setItems],
  );

  useEffect(() => {
    void runLoad('initial');
  }, [runLoad]);

  const showBlockingLoad = loading && items.length === 0;
  const userName = user?.name?.trim() || 'User';
  const userRole = user?.role?.trim() || 'Field Inspector';

  const currentDate = useMemo(
    () => ({
      day: new Intl.DateTimeFormat(undefined, {weekday: 'long'}).format(selectedDate),
      date: new Intl.DateTimeFormat(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(selectedDate),
    }),
    [selectedDate],
  );

  const syncTime = useMemo(() => {
    if (!lastSyncedAt) {
      return 'Not synced yet';
    }

    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(lastSyncedAt);
  }, [lastSyncedAt]);

  const handleNavigateFromSidebar = useCallback(
    (screen: 'Home' | 'AccountProfile' | 'Logout') => {
      if (screen === 'Home') {
        return;
      }

      if (screen === 'AccountProfile') {
        navigation.navigate('AccountProfile');
        return;
      }

      clearSession();
    },
    [clearSession, navigation],
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={INSPECTION_LIST_COLORS.headerBg} />

      <InspectionListHeader
        userName={userName}
        currentDate={currentDate}
        onPressMenu={() => setSidebarVisible(true)}
        onPressPrevDay={() =>
          setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1))
        }
        onPressNextDay={() =>
          setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1))
        }
      />

      <ConnectivityBanner />

      <InspectionSyncBanner lastSyncedLabel={`Synced · Last updated ${syncTime}`} />

      <View style={styles.body}>
        <ScreenLoadingOverlay visible={showBlockingLoad} />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void runLoad('refresh')}
              tintColor={INSPECTION_LIST_COLORS.primary}
            />
          }>
          {loadError ? (
            <Text style={styles.errorText}>{loadError}</Text>
          ) : null}

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

      <Sidebar
        visible={sidebarVisible}
        userName={userName}
        userRole={userRole}
        onClose={() => setSidebarVisible(false)}
        onNavigate={handleNavigateFromSidebar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: INSPECTION_LIST_COLORS.screenBg,
  },
  body: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(32),
    gap: verticalScale(12),
  },
  errorText: {
    fontFamily: 'Inter',
    fontSize: moderateScale(13),
    lineHeight: moderateScale(18),
    color: '#DC2626',
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  sectionLabel: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16.5),
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: INSPECTION_LIST_COLORS.sectionLabel,
    marginBottom: verticalScale(2),
    marginTop: verticalScale(2),
  },
});
