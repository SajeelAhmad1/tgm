import React from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  inspectionId: string;
};

type Photo = {
  id: string;
  tagTitle?: string;
  tagSubtitle?: string;
  isUntagged: boolean;
};

const MOCK_PHOTOS: Photo[] = [
  {id: 'p1', tagTitle: 'Position 1',        tagSubtitle: 'Inspection Q1',        isUntagged: false},
  {id: 'p2', tagTitle: 'Kitchen – Unit 1',   tagSubtitle: 'Entry at Q1',           isUntagged: false},
  {id: 'p3', tagTitle: 'Position 1',         tagSubtitle: 'Inspection Q1',         isUntagged: false},
  {id: 'p4', tagTitle: 'Kitchen – Unit 204', tagSubtitle: 'Entry at Q1 mnt',       isUntagged: false},
  {id: 'p5', tagTitle: 'Bathroom – Unit 204',tagSubtitle: 'Balcony Exterior Gate',  isUntagged: false},
  {id: 'p6', tagTitle: 'Position 1',         tagSubtitle: 'Balcony at Q1',          isUntagged: false},
  {id: 'p7', isUntagged: true},
  {id: 'p8', isUntagged: true},
];

const untaggedCount = MOCK_PHOTOS.filter(p => p.isUntagged).length;

function PhotoCard({photo, onDelete}: {photo: Photo; onDelete: (id: string) => void}) {
  return (
    <View style={[styles.photoCard, photo.isUntagged && styles.photoCardUntagged]}>
      <Pressable
        style={styles.deleteButton}
        onPress={() => onDelete(photo.id)}
        hitSlop={6}>
        <Text style={styles.deleteX}>✕</Text>
      </Pressable>
      {!photo.isUntagged && (
        <View style={styles.photoTag}>
          <Text style={styles.photoTagTitle} numberOfLines={1}>{photo.tagTitle}</Text>
          <Text style={styles.photoTagSubtitle} numberOfLines={1}>{photo.tagSubtitle}</Text>
        </View>
      )}
    </View>
  );
}

function AddPhotoCard({onPress}: {onPress: () => void}) {
  return (
    <Pressable style={styles.addCard} onPress={onPress}>
      <Text style={styles.addCardPlus}>+</Text>
      <Text style={styles.addCardLabel}>ADD PHOTO</Text>
    </Pressable>
  );
}

export function PhotosTab({inspectionId}: Props) {
  const handleDelete = (id: string) => {
    // wire up delete logic
  };

  const handleAddPhoto = () => {
    // wire up photo picker
  };

  const gridItems: (Photo | 'add')[] = [...MOCK_PHOTOS, 'add'];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

      <View style={styles.topRow}>
        <Text style={styles.countLabel}>
          {MOCK_PHOTOS.length} Photos
          {untaggedCount > 0 && (
            <Text style={styles.untaggedLabel}>{` · ${untaggedCount} Untagged`}</Text>
          )}
        </Text>
      </View>

      <FlatList
        data={gridItems}
        keyExtractor={item => (item === 'add' ? 'add' : item.id)}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({item}) =>
          item === 'add' ? (
            <AddPhotoCard onPress={handleAddPhoto} />
          ) : (
            <PhotoCard photo={item} onDelete={handleDelete} />
          )
        }
      />

      {untaggedCount > 0 && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningTitle}>⚠ {untaggedCount} Untagged Photos</Text>
          <Text style={styles.warningBody}>
            These will appear under General Photos in the report. Tap a photo to tag it to an item or question.
          </Text>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  content: {
    padding: 14,
    gap: 10,
    paddingBottom: 32,
  },
  topRow: {
    marginBottom: 2,
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
  untaggedLabel: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.88,
    color: '#D97706',
  },
  grid: {
    gap: 8,
  },
  row: {
    gap: 8,
  },
  photoCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: '#B8C9D8',
    overflow: 'hidden',
    position: 'relative',
  },
  photoCardUntagged: {
    backgroundColor: '#FFF9EC',
    borderTopWidth: 2,
    borderTopColor: '#D97706',
  },
  deleteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  deleteX: {
    fontSize: 9,
    color: '#DC2626',
    fontWeight: '700',
    lineHeight: 11,
  },
  photoTag: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  photoTagTitle: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 8,
    lineHeight: 10,
    color: '#FFFFFF',
  },
  photoTagSubtitle: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 7,
    lineHeight: 8.75,
    color: 'rgba(255,255,255,0.8)',
  },
  addCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addCardPlus: {
    fontSize: 22,
    color: '#94A3B8',
    lineHeight: 24,
  },
  addCardLabel: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 9,
    lineHeight: 13.5,
    letterSpacing: 0.22,
    color: '#94A3B8',
  },
  warningBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  warningTitle: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 20,
    color: '#D97706',
  },
  warningBody: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22.75,
    color: '#64748B',
  },
});
