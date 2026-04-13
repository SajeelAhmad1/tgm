import React, {useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image, 
  ActivityIndicator,
} from 'react-native';
import {requestInspectionItemsFromNetwork} from '../api/inspections/requestInspectionItemsFromNetwork';
import {requestInspectionsFromNetwork} from '../api/inspections/requestInspectionsFromNetwork';
import {requestItemQuestionsFromNetwork} from '../api/inspections/requestItemQuestionsFromNetwork';
import {requestPolishedCommentFromNetwork} from '../api/inspections/requestPolishedCommentFromNetwork';
import type {MainStackParamList} from '../navigation/types';
import type {
  ApiInspectionQuestionDto,
  ApiInspectionQuestionPhotoDto,
} from '../api/inspections/types';

// ─── Types ───────────────────────────────────────────────────────────────────

type PhotoAnalysisItem = {
  id: string;
  text: string;
  status: 'checked' | 'unchecked';
};

type InspectionData = {
  position: string;
  title: string;
  photoCount: number;
  originalComment: string;
  polishedComment: string;
  photoAnalysis: PhotoAnalysisItem[];
  photos: string[];
};

type CommentEntry = {
  id: string;
  position: string;
  originalComment: string;
  polishedComment: string;
  photos: string[];
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const EMPTY_INSPECTION: InspectionData = {
  position: 'Position 1',
  title: 'Photo Analysis Comment Review',
  photoCount: 0,
  originalComment: '',
  polishedComment: '',
  photoAnalysis: [],
  photos: [],
};

const DUMMY_ANSWER_ID = '0d2db288-418a-42f3-a866-6f5db8e8fd86';
const DUMMY_QUESTION_TEXT = 'Dummy question text';
const FALLBACK_S3_BASE_URL = 'https://glassmarket.s3.us-east-2.amazonaws.com';

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionLabel = ({
  label,
  badge,
}: {
  label: string;
  badge?: React.ReactNode;
}) => (
  <View style={styles.sectionLabelRow}>
    <Text style={styles.sectionLabel}>{label}</Text>
    {badge}
  </View>
);

const PolishButton = ({
  onPress,
  disabled,
}: {
  onPress: () => void;
  disabled?: boolean;
}) => (
  <TouchableOpacity
    style={[styles.polishBtn, disabled && styles.polishBtnDisabled]}
    onPress={onPress}
    activeOpacity={0.85}
    disabled={disabled}>
    <Text style={styles.polishBtnText}>✨ Polish with AI</Text>
  </TouchableOpacity>
);

const NoAnalysisButton = () => (
  <View style={styles.noAnalysisBtn}>
    <Text style={styles.noAnalysisBtnText}>📸 No Analysis</Text>
  </View>
);

const PhotoGrid = ({photos}: {photos: string[]}) => {
  const [failedCount, setFailedCount] = useState(0);

  return (
    <View style={styles.photoGrid}>
      {photos.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyCardText}>No photos available for this question</Text>
        </View>
      ) : (
        <>
          <View style={styles.photoRowWrap}>
            {photos.map(uri => (
              <Image
                key={uri}
                source={{uri}}
                style={styles.photo}
                onError={() => setFailedCount(prev => prev + 1)}
              />
            ))}
          </View>
          {/* {failedCount > 0 ? (
            <Text style={styles.photoErrorText}>
              {failedCount} photo{failedCount > 1 ? 's' : ''} could not load. S3 may require
              signed URLs.
            </Text>
          ) : null} */}
        </>
      )}
    </View>
  );
};

const AnalysisCard = ({ items }: { items: PhotoAnalysisItem[] }) => (
  <View style={styles.analysisCard}>
    {items.map((item) => (
      <View key={item.id} style={styles.analysisRow}>
        <View
          style={[
            styles.analysisBullet,
            item.status === 'checked' ? styles.analysisBulletChecked : styles.analysisBulletUnchecked,
          ]}
        >
          <Text style={styles.analysisBulletText}>
            {item.status === 'checked' ? '✓' : '+'}
          </Text>
        </View>
        <Text style={styles.analysisText}>{item.text}</Text>
      </View>
    ))}
  </View>
);

const EmptyAnalysisCard = () => (
  <View style={styles.emptyCard}>
    <Text style={styles.emptyCardText}>No AI photo analysis available for this inspection</Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ReviewInspectionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [showPhotos, setShowPhotos] = useState(false);
  const [inspection, setInspection] = useState<InspectionData>(EMPTY_INSPECTION);
  const [comments, setComments] = useState<CommentEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedComments, setSelectedComments] = useState<Record<string, string>>({});
  const [polishedComment, setPolishedComment] = useState('');
  const [originalComment, setOriginalComment] = useState('');
  const [hasPolished, setHasPolished] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'original' | 'ai_polished'>('ai_polished');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [polishing, setPolishing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);

      const inspectionsResult = await requestInspectionsFromNetwork();
      if (!inspectionsResult.ok) {
        if (!cancelled) {
          setError(inspectionsResult.error);
          setLoading(false);
        }
        return;
      }

      const firstInspection = inspectionsResult.items[0];
      if (!firstInspection) {
        if (!cancelled) {
          setError('No inspections available.');
          setLoading(false);
        }
        return;
      }

      const itemsResult = await requestInspectionItemsFromNetwork(firstInspection.id);
      if (!itemsResult.ok) {
        if (!cancelled) {
          setError(itemsResult.error);
          setLoading(false);
        }
        return;
      }

      const firstItem = itemsResult.items[0];
      if (!firstItem) {
        if (!cancelled) {
          setError('No items found for the first inspection.');
          setLoading(false);
        }
        return;
      }

      const questionsResult = await requestItemQuestionsFromNetwork(firstItem.id);
      if (!questionsResult.ok) {
        if (!cancelled) {
          setError(questionsResult.error);
          setLoading(false);
        }
        return;
      }

      const sortedQuestions = [...questionsResult.questions].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
      );
      if (sortedQuestions.length === 0) {
        if (!cancelled) {
          setError('No questions found for the first item.');
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        const mappedComments = sortedQuestions.map(mapQuestionToCommentEntry);
        setComments(mappedComments);
        setCurrentIndex(0);
        applyCommentEntry(mappedComments[0], {});
        setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const data = useMemo(() => inspection, [inspection]);

  const currentEntry = useMemo(() => comments[currentIndex] ?? null, [comments, currentIndex]);

  const handlePolish = async () => {
    const comment = originalComment.trim();
    if (!comment || !currentEntry) {
      setError('Missing comment for polishing.');
      return;
    }

    setPolishing(true);
    setError(null);
    const result = await requestPolishedCommentFromNetwork({
      answerId: DUMMY_ANSWER_ID,
      comment,
      questionText: DUMMY_QUESTION_TEXT,
    });
    setPolishing(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setHasPolished(true);
    setPolishedComment(result.polishedComment);
  };

  const handleUseOriginal = () => {
    if (!currentEntry) {
      return;
    }
    const selected = originalComment.trim();
    setSelectedAction('original');
    setSelectedComments(prev => {
      const nextMap = {...prev, [currentEntry.id]: selected};
      const nextAnalysis = buildPhotoAnalysisItems(nextMap);
      setInspection(prevInspection => ({
        ...prevInspection,
        photoAnalysis: nextAnalysis,
      }));
      setHasAnalysis(nextAnalysis.length > 0);
      return nextMap;
    });
  };

  const handleUsePolished = () => {
    if (!currentEntry) {
      return;
    }
    const selected = polishedComment.trim();
    setSelectedAction('ai_polished');
    setSelectedComments(prev => {
      const nextMap = {...prev, [currentEntry.id]: selected};
      const nextAnalysis = buildPhotoAnalysisItems(nextMap);
      setInspection(prevInspection => ({
        ...prevInspection,
        photoAnalysis: nextAnalysis,
      }));
      setHasAnalysis(nextAnalysis.length > 0);
      return nextMap;
    });
  };

  const handleNextComment = () => {
    if (comments.length === 0) {
      return;
    }
    const nextIndex = currentIndex + 1;
    if (nextIndex >= comments.length) {
      setError('No more comments.');
      return;
    }
    const nextEntry = comments[nextIndex];
    setCurrentIndex(nextIndex);
    applyCommentEntry(nextEntry, selectedComments);
    setSelectedAction('ai_polished');
    setError(null);
  };

  function normalizePhotoUri(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return encodeURI(trimmed);
    }
    if (trimmed.startsWith('inspections/')) {
      return encodeURI(`${FALLBACK_S3_BASE_URL}/${trimmed}`);
    }
    return null;
  }

  function readPhotoUrl(photo: ApiInspectionQuestionPhotoDto): string | null {
    if (typeof photo.signedUrl === 'string') {
      const normalized = normalizePhotoUri(photo.signedUrl);
      if (normalized) {
        return normalized;
      }
    }
    if (typeof photo.presignedUrl === 'string') {
      const normalized = normalizePhotoUri(photo.presignedUrl);
      if (normalized) {
        return normalized;
      }
    }
    if (typeof photo.s3Url === 'string') {
      const normalized = normalizePhotoUri(photo.s3Url);
      if (normalized) {
        return normalized;
      }
    }
    if (typeof photo.url === 'string') {
      const normalized = normalizePhotoUri(photo.url);
      if (normalized) {
        return normalized;
      }
    }
    if (typeof photo.photoUrl === 'string') {
      const normalized = normalizePhotoUri(photo.photoUrl);
      if (normalized) {
        return normalized;
      }
    }
    if (typeof photo.imageUrl === 'string') {
      const normalized = normalizePhotoUri(photo.imageUrl);
      if (normalized) {
        return normalized;
      }
    }
    if (typeof photo.s3Key === 'string') {
      const normalized = normalizePhotoUri(photo.s3Key);
      if (normalized) {
        return normalized;
      }
    }
    return null;
  }

  function mapQuestionToCommentEntry(question: ApiInspectionQuestionDto): CommentEntry {
    const photos = (question.photos ?? [])
      .map(readPhotoUrl)
      .filter((url): url is string => Boolean(url));
    return {
      id: question.id,
      position: `Position ${question.sortOrder ?? 1}`,
      originalComment: question.answer?.comment?.trim() || '',
      polishedComment: question.answer?.aiPolishedComment?.trim() || '',
      photos,
    };
  }

  function applyCommentEntry(entry: CommentEntry, selectedMap: Record<string, string>) {
    const photoAnalysis = buildPhotoAnalysisItems(selectedMap);

    setInspection({
      position: entry.position,
      title: 'Photo Analysis Comment Review',
      photoCount: entry.photos.length,
      originalComment: entry.originalComment,
      polishedComment: entry.polishedComment,
      photoAnalysis,
      photos: entry.photos,
    });
    setOriginalComment(entry.originalComment);
    setPolishedComment(entry.polishedComment);
    setHasPolished(entry.polishedComment.trim().length > 0);
    setHasAnalysis(photoAnalysis.length > 0);
  }

  function buildPhotoAnalysisItems(selectedMap: Record<string, string>): PhotoAnalysisItem[] {
    const items: PhotoAnalysisItem[] = [];
    comments.forEach(comment => {
      const text = selectedMap[comment.id]?.trim() ?? '';
      if (!text) {
        return;
      }
      items.push({
        id: `${comment.id}-selected`,
        text,
        status: 'checked',
      });
    });
    return items;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFF3FA" />
      <View style={styles.screenBg}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Review Inspection</Text>
          <View style={styles.headerIcons}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <View style={styles.navBadge}>
              <Text style={styles.navBadgeText}>N</Text>
            </View>
          </View>
        </View>

        {/* Main Card */}
        <View style={styles.card}>
          <ScrollView
            contentContainerStyle={styles.cardScroll}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator size="small" color="#2091F9" />
                <Text style={styles.loadingText}>Loading first inspection question...</Text>
              </View>
            ) : null}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Position & Title */}
            <Text style={styles.positionLabel}>{data.position}</Text>
            <Text style={styles.inspectionTitle}>{data.title}</Text>

            {/* View Photos Button */}
            <TouchableOpacity
              style={styles.viewPhotosBtn}
              onPress={() => setShowPhotos((v) => !v)}
              activeOpacity={0.85}
            >
              <Text style={styles.viewPhotosBtnText}>📸 View Photos ({data.photoCount})</Text>
            </TouchableOpacity>

            {/* Photo Grid (conditional) */}
            {showPhotos && <PhotoGrid photos={data.photos} />}

            {/* 1. Original Comment */}
            <SectionLabel
              label="1. ORIGINAL COMMENT"
              badge={<PolishButton onPress={() => void handlePolish()} disabled={polishing} />}
            />
            {polishing ? <Text style={styles.loadingText}>Polishing comment with AI...</Text> : null}
            <TextInput
              style={styles.textInput}
              multiline
              value={originalComment}
              onChangeText={setOriginalComment}
              placeholder="Enter original comment..."
              placeholderTextColor="#94A3B8"
            />

            {/* 2. Polished Comment */}
            <SectionLabel label="2. POLISHED COMMENT" />
            {hasPolished ? (
              <View style={[styles.textInput, styles.polishedBox]}>
                <Text style={styles.writtenText}>{polishedComment}</Text>
              </View>
            ) : (
              <View style={[styles.textInput, styles.emptyCard]}>
                <Text style={styles.emptyCardText}>
                  No polished version yet. Click "✨ Polish with AI" to generate.
                </Text>
              </View>
            )}

            {/* 3. Photo Analysis */}
            <SectionLabel
              label="3. PHOTO ANALYSIS"
              badge={
                hasAnalysis ? null : <NoAnalysisButton />
              }
            />
            {hasAnalysis ? (
              <AnalysisCard items={data.photoAnalysis} />
            ) : (
              <EmptyAnalysisCard />
            )}
            {/* Actions (kept at end of content, below photo analysis) */}
            <View style={styles.bottomActions}>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    selectedAction === 'original' ? styles.actionBtnActive : styles.actionBtnOutline,
                  ]}
                  onPress={handleUseOriginal}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.actionBtnText,
                      selectedAction === 'original'
                        ? styles.actionBtnTextActive
                        : styles.actionBtnTextOutline,
                    ]}
                  >
                    {selectedAction === 'original' ? '✓ ' : ''}Use Original
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    selectedAction === 'ai_polished' ? styles.actionBtnActive : styles.actionBtnOutline,
                  ]}
                  onPress={handleUsePolished}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.actionBtnText,
                      selectedAction === 'ai_polished'
                        ? styles.actionBtnTextActive
                        : styles.actionBtnTextOutline,
                    ]}
                  >
                    {selectedAction === 'ai_polished' ? '✓ ' : ''}Use AI Polished
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.navBtn, styles.navBtnBorder]}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.85}>
                  <Text style={styles.navBtnText}>← Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.navBtn, styles.navBtnBorder]}
                  onPress={handleNextComment}
                  activeOpacity={0.85}>
                  <Text style={styles.navBtnText}>Next Comment →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EFF3FA',
  },
  screenBg: {
    flex: 1,
    backgroundColor: '#EFF3FA',
    alignItems: 'center',
    // paddingTop: 12,
  },

  // Header
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 28,
    color: '#0F172A',
    paddingVertical: 16,
    marginLeft: 16,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginRight: 16,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 16 },
  navBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2091F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  // Card
  card: {
    paddingHorizontal: 16,
    width: 338,
    flex: 1,
    maxHeight: 658,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  cardScroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 12,
  },

  // Position & Title
  positionLabel: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#64748B',
    marginBottom: 2,
  },
  inspectionTitle: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    color: '#0F172A',
    marginBottom: 10,
  },

  // View Photos Button
  viewPhotosBtn: {
    width: 277,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2091F9',
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  viewPhotosBtnText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    color: '#2091F9',
    textAlign: 'center',
  },

  // Photo Grid
  photoGrid: {
    gap: 4,
    marginBottom: 4,
  },
  photoRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 4,
  },
  photo: {
    width: 114.5,
    height: 114.5,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },

  // Section Labels
  sectionLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 8,
  },
  sectionLabel: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#64748B',
  },

  // Polish Button
  polishBtn: {
    height: 28,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  polishBtnDisabled: {
    opacity: 0.6,
  },
  polishBtnText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
  },

  // No Analysis Button
  noAnalysisBtn: {
    height: 28,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAnalysisBtnText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
  },

  // Text Input
  textInput: {
    width: 277,
    minHeight: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#EBF5FF',
    padding: 12,
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    color: '#0F172A',
    textAlignVertical: 'top',
  },
  polishedBox: {
    borderColor: '#CBD5E1',
    backgroundColor: '#F1EDFE',
  },
  writtenText: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    color: '#0F172A',
  },

  // Empty Card
  emptyCard: {
    width: 277,
    minHeight: 74,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyCardText: {
    fontFamily: 'Inter',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#94A3B8',
    textAlign: 'center',
  },

  // Analysis Card
  analysisCard: {
    width: 277,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  analysisRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  analysisBullet: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  analysisBulletChecked: {
    backgroundColor: '#22C55E',
  },
  analysisBulletUnchecked: {
    backgroundColor: '#E2E8F0',
  },
  analysisBulletText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  analysisText: {
    flex: 1,
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    color: '#0F172A',
  },

  // Bottom Actions
  bottomActions: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 0,
    paddingVertical: 14,
    gap: 10,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnActive: {
    backgroundColor: '#2091F9',
  },
  actionBtnOutline: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  actionBtnText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  actionBtnTextActive: {
    color: '#FFFFFF',
  },
  actionBtnTextOutline: {
    color: '#64748B',
  },

  // Nav Buttons
  navBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtnBorder: {
    borderWidth: 1,
    borderColor: '#2091F9',
    backgroundColor: '#FFFFFF',
  },
  navBtnText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    color: '#2091F9',
    textAlign: 'center',
  },
  loadingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  loadingText: {
    color: '#64748B',
    fontFamily: 'Inter',
    fontSize: 13,
  },
  errorText: {
    color: '#DC2626',
    fontFamily: 'Inter',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  photoErrorText: {
    marginTop: 8,
    color: '#B45309',
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 16,
  },
});