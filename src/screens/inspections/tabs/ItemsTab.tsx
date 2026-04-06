import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ConnectivityBanner } from '../../../components/ConnectivityBanner';
import { ItemFilterChips } from '../../../components/inspections/items/ItemFilterChips';
import { ItemListRow } from '../../../components/inspections/items/ItemListRow';
import type { FilterType } from '../../../components/inspections/items/itemsTabTokens';
import { MOCK_INSPECTION_ITEMS } from '../mockItems';
import { NewItemModal } from '../../../components/inspections/items/NewItemModal';

type Props = {
  inspectionId: string;
  onItemPress?: (itemId: string) => void;
};

export function ItemsTab({ inspectionId: _inspectionId, onItemPress }: Props) {
  const [search, setSearch] = useState('');
  const [showNewItem, setShowNewItem] = useState(false);
  const [activeFilter, setFilter] = useState<FilterType>('All');

  const filtered = MOCK_INSPECTION_ITEMS.filter(item => {
    const matchesFilter = activeFilter === 'All' || item.status === activeFilter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <ConnectivityBanner />
      <View style={styles.topRow}>
        <Text style={styles.countLabel}>{MOCK_INSPECTION_ITEMS.length} Items</Text>
        <Pressable onPress={() => setShowNewItem(true)} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search items by name..."
        placeholderTextColor="#94A3B8"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.secondBar} />

      <ItemFilterChips activeFilter={activeFilter} onChange={setFilter} />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ItemListRow
            item={item}
            onPress={() => onItemPress?.(item.id)}
          />
        )}
      />
      <NewItemModal
        visible={showNewItem}
        onClose={() => setShowNewItem(false)}
        onSubmit={(data) => {
          console.log('New item data:', data);
          // send to your API / store
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  countLabel: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 11,
    lineHeight: 16.5,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: '#94A3B8',
  },
  addButton: {
    backgroundColor: '#EBF5FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  addButtonText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 16,
    color: '#2091F9',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 8,
  },
  secondBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 44,
    marginBottom: 10,
  },
  list: {
    gap: 8,
    paddingBottom: 24,
  },
});
