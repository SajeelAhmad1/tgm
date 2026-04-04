import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {InspectionItemRow} from './itemsTabTokens';
import {ITEM_STATUS_CONFIG, getItemSubtitle} from './itemsTabTokens';

type Props = {
  item: InspectionItemRow;
  onPress: () => void;
};

export function ItemListRow({item, onPress}: Props) {
  const cfg = ITEM_STATUS_CONFIG[item.status];
  return (
    <Pressable
      style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}>
      <View style={[styles.dot, {backgroundColor: cfg.dot}]} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>{getItemSubtitle(item)}</Text>
      </View>
      <View style={styles.cardRight}>
        <View style={[styles.badge, {backgroundColor: cfg.badgeBg}]}>
          <Text style={[styles.badgeText, {color: cfg.badgeText}]}>{cfg.label}</Text>
        </View>
        <View style={styles.iconBox}>
          <Text style={styles.iconPlaceholder}>⊞</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.75,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 22.5,
    color: '#0F172A',
  },
  cardSubtitle: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#64748B',
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 6,
  },
  badgeText: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 11,
    lineHeight: 11,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#EBF5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    fontSize: 14,
    color: '#2091F9',
  },
  chevron: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 18,
    lineHeight: 28,
    color: '#94A3B8',
  },
});
