import React, {useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet, 
  Text,
  TextInput,
  View,
} from 'react-native';
import {ConnectivityBanner} from '../../../components/ConnectivityBanner';
import {ItemFilterChips} from '../../../components/inspections/items/ItemFilterChips';
import {ItemListRow} from '../../../components/inspections/items/ItemListRow';
import type {FilterType, InspectionItemRow} from '../../../components/inspections/items/itemsTabTokens';
import {NewItemModal} from '../../../components/inspections/items/NewItemModal';
import {ItemQuestionsSheet} from '../../../components/inspections/items/questions';
import {requestInspectionItemsFromNetwork} from '../../../api/inspections/requestInspectionItemsFromNetwork';

type Props = {
  inspectionId: string;
  onItemPress?: (itemId: string) => void;
};

export function ItemsTab({inspectionId, onItemPress}: Props) {
  const [search, setSearch] = useState('');
  const [showNewItem, setShowNewItem] = useState(false);
  const [activeFilter, setFilter] = useState<FilterType>('All');
  const [items, setItems] = useState<InspectionItemRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setItems([]);
    setError(null);

    const run = async () => {
      const result = await requestInspectionItemsFromNetwork(inspectionId);
      if (cancelled) {
        return;
      }
      if (result.ok) {
        setItems(result.items);
        setError(null);
        return;
      }
      setItems([]);
      setError(result.error);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [inspectionId]);

  const filtered = useMemo(
    () =>
      items.filter(item => {
        const matchesFilter = activeFilter === 'All' || item.status === activeFilter;
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
      }),
    [activeFilter, items, search],
  );

  return (
    <View style={styles.container}>
      <ConnectivityBanner />
      <View style={styles.topRow}>
        <Text style={styles.countLabel}>{items.length} Items</Text>
        <Pressable onPress={() => setShowNewItem(true)} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={styles.searchInput}
        placeholder="Search items by name..."
        placeholderTextColor="#94A3B8"
        value={search}
        onChangeText={setSearch}
      />

      <ItemFilterChips activeFilter={activeFilter} onChange={setFilter} />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <ItemListRow
            item={item}
            onPress={() => {
              onItemPress?.(item.id);
              setSelectedItemId(item.id);
            }}
          />
        )}
      />
      <ItemQuestionsSheet
        visible={selectedItemId !== null}
        itemId={selectedItemId}
        itemName={items.find(x => x.id === selectedItemId)?.name}
        onClose={() => setSelectedItemId(null)}
      />
      <NewItemModal
        visible={showNewItem}
        onClose={() => setShowNewItem(false)}
        onSubmit={data => {
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
    marginBottom: 12,
  },
  list: {
    gap: 8,
    paddingTop: 6,
    paddingBottom: 24,
  },
  errorText: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    color: '#DC2626',
    marginBottom: 8,
  },
});
