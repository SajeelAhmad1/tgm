import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export type InspectionDetailTabId = 'Overview' | 'Items' | 'Review' | 'Photos';

export const INSPECTION_DETAIL_TABS: InspectionDetailTabId[] = [
  'Overview',
  'Items',
  'Review',
  'Photos',
];

type Props = {
  activeTab: InspectionDetailTabId;
  onChange: (tab: InspectionDetailTabId) => void;
  tabs?: InspectionDetailTabId[];
};

export function InspectionTabBar({
  activeTab,
  onChange,
  tabs = INSPECTION_DETAIL_TABS,
}: Props) {
  return (
    <View style={styles.tabBar}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab}
          style={styles.tabItem}
          onPress={() => onChange(tab)}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.tabLabel,
              activeTab === tab && styles.tabLabelActive,
            ]}>
            {tab}
          </Text>
          {activeTab === tab ? <View style={styles.tabUnderline} /> : null}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  tabLabel: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#94A3B8',
  },
  tabLabelActive: {
    color: '#2091F9',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#2091F9',
  },
});
