import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import type {FilterType} from './itemsTabTokens';
import {ITEM_FILTER_CHIP_STYLES, ITEM_FILTERS} from './itemsTabTokens';

type Props = {
  activeFilter: FilterType;
  onChange: (f: FilterType) => void;
  filters?: FilterType[];
};

export function ItemFilterChips({
  activeFilter,
  onChange,
  filters = ITEM_FILTERS,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersRow}>
      {filters.map(f => {
        const isActive = activeFilter === f;
        const cfg = ITEM_FILTER_CHIP_STYLES[f];
        return (
          <Pressable
            key={f}
            onPress={() => onChange(f)}
            style={[
              styles.filterChip,
              {backgroundColor: isActive ? cfg.activeBg : cfg.inactiveBg},
            ]}>
            <Text
              style={[
                styles.filterText,
                {color: isActive ? cfg.activeText : cfg.inactiveText},
              ]}>
              {f}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filtersRow: {
    flexDirection: 'row',
    gap: 6,
    paddingBottom: 10,
  },
  filterChip: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filterText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 16,
  },
});
