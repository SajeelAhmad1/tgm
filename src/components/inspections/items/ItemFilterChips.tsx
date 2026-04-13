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
      style={styles.filtersScroll}
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
  filtersScroll: {
    maxHeight: 30,
    marginBottom: 12,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterChip: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 16,
  },
});
