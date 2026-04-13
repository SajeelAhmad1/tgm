import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  NativeModules,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {launchCamera, launchImageLibrary, type Asset} from 'react-native-image-picker';
import {requestItemQuestionsFromNetwork} from '../../../api/inspections/requestItemQuestionsFromNetwork';
import {
  requestAnswerByQuestionIdFromNetwork,
  type QuestionAnswerDto,
} from '../../../api/inspections/requestAnswerByQuestionIdFromNetwork';
import {
  saveAnswerFromNetwork,
  type SaveAnswerPayload,
} from '../../../api/inspections/saveAnswerFromNetwork';

type AnswerValue = 'YES' | 'NO' | 'NOT_ASSESSED';
type SeverityValue = 'MINOR' | 'MODERATE' | 'CRITICAL';
type PickerMode = 'camera' | 'upload';

type QuestionRow = {
  id: string;
  text: string;
  sortOrder: number;
  guidance?: string | null;
  phase?: string | null;
};

type QuestionAnswerState = {
  id?: string;
  value: AnswerValue | null;
  severity?: SeverityValue;
  comment: string;
};

const SEVERITIES: SeverityValue[] = ['MINOR', 'MODERATE', 'CRITICAL'];
const legacyImagePickerModule = NativeModules.ImagePicker as
  | {
      launchCamera?: (
        options: Record<string, unknown>,
        callback: (result: {errorCode?: string; errorMessage?: string; didCancel?: boolean; assets?: Asset[]}) => void,
      ) => void;
      launchImageLibrary?: (
        options: Record<string, unknown>,
        callback: (result: {errorCode?: string; errorMessage?: string; didCancel?: boolean; assets?: Asset[]}) => void,
      ) => void;
    }
  | undefined;

type Props = {
  visible: boolean;
  itemId: string | null;
  itemName?: string;
  onClose: () => void;
  onSaved?: () => void;
};

export function ItemQuestionsSheet({visible, itemId, itemName, onClose, onSaved}: Props) {
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswerState>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPhases, setShowPhases] = useState(false);
  const [openGuidanceById, setOpenGuidanceById] = useState<Record<string, boolean>>({});
  const [photoCountById, setPhotoCountById] = useState<Record<string, number>>({});
  const [photosById, setPhotosById] = useState<Record<string, Asset[]>>({});
  const [listeningById, setListeningById] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!visible || !itemId) {
      return;
    }

    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      setQuestions([]);
      setAnswers({});

      const questionsResult = await requestItemQuestionsFromNetwork(itemId);
      if (cancelled) {
        return;
      }
      if (!questionsResult.ok) {
        setError(questionsResult.error);
        setLoading(false);
        return;
      }

      const rows = questionsResult.questions
        .map(row => ({
          id: row.id,
          text: typeof row.text === 'string' ? row.text.trim() : '',
          sortOrder: typeof row.sortOrder === 'number' ? row.sortOrder : 0,
          guidance: typeof row.guidance === 'string' ? row.guidance : null,
          phase: typeof row.phase === 'string' ? row.phase : null,
        }))
        .sort((a, b) => a.sortOrder - b.sortOrder);

      setQuestions(rows);
      setPhotoCountById(
        questionsResult.questions.reduce<Record<string, number>>((acc, q) => {
          acc[q.id] = Array.isArray(q.photos) ? q.photos.length : 0;
          return acc;
        }, {}),
      );

      const loaded: Record<string, QuestionAnswerState> = {};
      const fetched = await Promise.all(
        rows.map(async row => {
          const result = await requestAnswerByQuestionIdFromNetwork(row.id);
          return {questionId: row.id, result};
        }),
      );

      if (cancelled) {
        return;
      }

      fetched.forEach(({questionId, result}) => {
        const answer = result.ok ? result.answer : null;
        loaded[questionId] = mapAnswerDtoToState(answer);
      });

      setAnswers(loaded);
      setLoading(false);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [itemId, visible]);

  const phases = useMemo(
    () =>
      Array.from(new Set(questions.map(q => q.phase).filter((v): v is string => Boolean(v?.trim())))),
    [questions],
  );

  const progressText = useMemo(() => {
    const answered = questions.filter(q => answers[q.id]?.value !== null).length;
    const hasIssues = Object.values(answers).some(a => a.value === 'NO');
    return `${answered} / ${questions.length} Questions${hasIssues ? ' · Issues Detected' : ''}`;
  }, [answers, questions]);

  const setValue = (questionId: string, value: AnswerValue) => {
    setAnswers(prev => {
      const current = prev[questionId] ?? {value: null, comment: ''};
      if (value === 'NO') {
        return {
          ...prev,
          [questionId]: {
            ...current,
            value,
            comment: current.comment,
          },
        };
      }
      return {
        ...prev,
        [questionId]: {
          ...current,
          value,
          severity: undefined,
          comment: '',
        },
      };
    });
  };

  const setSeverity = (questionId: string, severity: SeverityValue) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] ?? {value: null, comment: ''}),
        severity,
      },
    }));
  };

  const setComment = (questionId: string, comment: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] ?? {value: null, comment: ''}),
        comment,
      },
    }));
  };

  const launchPickerWithFallback = async (mode: PickerMode) => {
    const options = {
      mediaType: 'photo' as const,
      quality: 0.8 as any,
      ...(mode === 'camera' ? {cameraType: 'back' as const} : {selectionLimit: 0}),
    };

    try {
      return mode === 'camera' ? await launchCamera(options) : await launchImageLibrary(options);
    } catch {
      const methodName = mode === 'camera' ? 'launchCamera' : 'launchImageLibrary';
      const legacyMethod = legacyImagePickerModule?.[methodName];
      if (!legacyMethod) {
        throw new Error(
          'Image picker is unavailable in this build. Rebuild the app after installing native modules.',
        );
      }

      return await new Promise<{
        errorCode?: string;
        errorMessage?: string;
        didCancel?: boolean;
        assets?: Asset[];
      }>(resolve => {
        legacyMethod(options, resolve);
      });
    }
  };

  const handleAddPhoto = async (questionId: string, mode: PickerMode) => {
    try {
      const pickerResult = await launchPickerWithFallback(mode);

      if (pickerResult.errorCode) {
        Alert.alert(
          'Photo selection failed',
          pickerResult.errorMessage || 'Could not open camera/gallery.',
        );
        return;
      }

      const newAssets = pickerResult.assets ?? [];
      if (pickerResult.didCancel || newAssets.length === 0) {
        return;
      }

      setPhotosById(prev => {
        const current = prev[questionId] ?? [];
        const next = [...current, ...newAssets];
        setPhotoCountById(counts => ({...counts, [questionId]: next.length}));
        return {...prev, [questionId]: next};
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      Alert.alert('Photo selection failed', msg);
    }
  };

  const handleRemovePhoto = (questionId: string, index: number) => {
    setPhotosById(prev => {
      const current = prev[questionId] ?? [];
      const next = current.filter((_, i) => i !== index);
      setPhotoCountById(counts => ({...counts, [questionId]: next.length}));
      return {...prev, [questionId]: next};
    });
  };

  const handleVoiceToText = (questionId: string) => {
    setListeningById(prev => ({...prev, [questionId]: true}));
    // Temporary functional behavior until native speech service is integrated.
    setTimeout(() => {
      setAnswers(prev => {
        const current = prev[questionId] ?? {value: null, comment: ''};
        const suffix = current.comment.trim().length > 0 ? ' ' : '';
        return {
          ...prev,
          [questionId]: {
            ...current,
            comment: `${current.comment}${suffix}[Voice text captured]`,
          },
        };
      });
      setListeningById(prev => ({...prev, [questionId]: false}));
    }, 900);
  };

  const handleMarkAllNotAssessed = () => {
    setAnswers(prev => {
      const next = {...prev};
      questions.forEach(q => {
        const current = next[q.id] ?? {value: null, comment: ''};
        next[q.id] = {
          ...current,
          value: 'NOT_ASSESSED',
          severity: undefined,
          comment: '',
        };
      });
      return next;
    });
  };

  const handleSaveAndClose = async () => {
    if (saving) {
      return;
    }
    setSaving(true);
    setError(null);

    for (const q of questions) {
      const row = answers[q.id];
      if (!row?.value) {
        continue;
      }

      const payload: SaveAnswerPayload = {
        id: row.id,
        questionId: q.id,
        value: row.value,
        severity: row.value === 'NO' ? row.severity ?? null : null,
        comment: row.value === 'NO' ? row.comment : '',
      };

      const result = await saveAnswerFromNetwork(payload);
      if (!result.ok) {
        setError(result.error);
        setSaving(false);
        return;
      }

      setAnswers(prev => ({
        ...prev,
        [q.id]: {
          ...(prev[q.id] ?? {value: null, comment: ''}),
          id: result.id,
        },
      }));
    }

    setSaving(false);
    onSaved?.();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{itemName || 'Item Questions'}</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>X</Text>
            </Pressable>
          </View>
          <Text style={styles.subtitle}>{progressText}</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color="#2091F9" />
              <Text style={styles.loadingText}>Loading questions...</Text>
            </View>
          ) : (
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
              <Pressable
                style={[styles.phaseBtn, showPhases && styles.phaseBtnActive]}
                onPress={() => setShowPhases(v => !v)}>
                <Text style={[styles.phaseBtnText, showPhases && styles.phaseBtnTextActive]}>Phases</Text>
                <Text style={[styles.phaseBtnChevron, showPhases && styles.phaseBtnTextActive]}>
                  {showPhases ? '▲' : '▼'}
                </Text>
              </Pressable>
              {showPhases ? (
                <View style={styles.phaseDropdownWrap}>
                  <View style={styles.phaseDropdown}>
                  {(phases.length > 0 ? phases : ['Goods Delivered', 'Goods Installed', 'Sign Off']).map(
                    p => (
                      <View key={p} style={styles.phaseRow}>
                        <Text style={styles.phaseRowText}>{p}</Text>
                      </View>
                    ),
                  )}
                  </View>
                </View>
              ) : null}

              {questions.map((q, idx) => {
                const answer = answers[q.id] ?? {value: null, comment: ''};
                const showGuidance = openGuidanceById[q.id] === true;
                const noActive = answer.value === 'NO';
                const yesActive = answer.value === 'YES';
                const naActive = answer.value === 'NOT_ASSESSED';

                return (
                  <View
                    key={q.id}
                    style={[styles.questionCard, idx === questions.length - 1 && styles.questionCardLast]}>
                    <View style={styles.questionRow}>
                      <Text style={styles.questionText}>
                        {idx + 1}. {q.text}
                      </Text>
                      <Pressable style={styles.playBtn}>
                        <Text style={styles.playBtnText}>▶</Text>
                      </Pressable>
                    </View>

                    <Pressable
                      style={styles.guidanceToggle}
                      onPress={() =>
                        setOpenGuidanceById(prev => ({
                          ...prev,
                          [q.id]: !prev[q.id],
                        }))
                      }>
                      <Text style={styles.guidanceToggleText}>
                        {showGuidance ? 'Hide guidance' : 'Show guidance'}
                      </Text>
                    </Pressable>

                    {showGuidance ? (
                      <View style={styles.guidanceBox}>
                        <Text style={styles.guidanceBoxText}>
                          {q.guidance?.trim() || 'No additional guidance available for this question.'}
                        </Text>
                      </View>
                    ) : null}

                    <View style={styles.answerGroup}>
                      <View style={styles.answerRow}>
                      <AnswerButton
                        label="✓ Yes"
                        active={yesActive}
                        onPress={() => setValue(q.id, 'YES')}
                        mode="yes"
                      />
                      <AnswerButton
                        label="✕ No"
                        active={noActive}
                        onPress={() => setValue(q.id, 'NO')}
                        mode="no"
                      />
                      <AnswerButton
                        label="- N/A"
                        active={naActive}
                        onPress={() => setValue(q.id, 'NOT_ASSESSED')}
                        mode="na"
                      />
                      </View>
                    </View>

                    {noActive ? (
                      <>
                        <Text style={styles.severityLabel}>Severity</Text>
                        <View style={styles.severityRow}>
                          {SEVERITIES.map(sev => (
                            <Pressable
                              key={sev}
                              onPress={() => setSeverity(q.id, sev)}
                              style={[
                                styles.severityBtn,
                                answer.severity === sev && styles.severityBtnActive,
                                answer.severity === sev && sev === 'MINOR' && styles.severityMinor,
                                answer.severity === sev && sev === 'MODERATE' && styles.severityModerate,
                                answer.severity === sev && sev === 'CRITICAL' && styles.severityCritical,
                              ]}>
                              <Text
                                style={[
                                  styles.severityBtnText,
                                  answer.severity === sev && styles.severityBtnTextActive,
                                  answer.severity === sev && sev === 'MINOR' && styles.severityMinorText,
                                  answer.severity === sev && sev === 'MODERATE' && styles.severityModerateText,
                                  answer.severity === sev && sev === 'CRITICAL' && styles.severityCriticalText,
                                ]}>
                                {sev}
                              </Text>
                            </Pressable>
                          ))}
                        </View>
                        <TextInput
                          value={answer.comment}
                          onChangeText={text => setComment(q.id, text)}
                          multiline
                          placeholder="Add comment..."
                          placeholderTextColor="#94A3B8"
                          style={styles.commentInput}
                        />
                        <View style={styles.voiceInCommentWrap}>
                          <Pressable
                            style={styles.voiceBtn}
                            // onPress={() => handleVoiceToText(q.id)}
                            disabled={listeningById[q.id] === true}>
                            <Text style={styles.voiceBtnText}>
                              {listeningById[q.id] ? 'Listening...' : '🎤 Voice to Text'}
                            </Text>
                          </Pressable>
                        </View>
                      </>
                    ) : null}

                    <View style={styles.mediaRow}>
                      <Pressable
                        onPress={() => void handleAddPhoto(q.id, 'camera')}
                        style={styles.mediaBtn}>
                        <Text style={styles.mediaBtnText}>📷 Camera</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => void handleAddPhoto(q.id, 'upload')}
                        style={styles.mediaBtn}>
                        <Text style={styles.mediaBtnText}>🖼 Upload</Text>
                      </Pressable>
                    </View>
                    {(photosById[q.id]?.length ?? 0) > 0 ? (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.photoStrip}
                        contentContainerStyle={styles.photoStripContent}>
                        {(photosById[q.id] ?? [])
                          .map((a, idx2) => ({uri: a?.uri, idx2}))
                          .filter(p => typeof p.uri === 'string' && p.uri.length > 0)
                          .map(p => (
                            <View key={`${q.id}-${p.idx2}`} style={styles.photoTile}>
                              <Image source={{uri: p.uri!}} style={styles.photoImg} />
                              <Pressable
                                onPress={() => handleRemovePhoto(q.id, p.idx2)}
                                style={styles.photoRemoveBtn}
                                hitSlop={8}>
                                <Text style={styles.photoRemoveText}>×</Text>
                              </Pressable>
                            </View>
                          ))}
                      </ScrollView>
                    ) : null}
                  </View>
                );
              })}

              <View style={styles.footerActions}>
                <Pressable
                  onPress={handleMarkAllNotAssessed}
                  style={[styles.footerBtn, styles.footerBtnWarn]}>
                  <Text style={[styles.footerBtnText, styles.footerBtnTextWarn]}>
                    Mark All as Not Assessed
                  </Text>
                </Pressable>
              </View>

              <View style={styles.footerActions}>
                <Pressable
                  onPress={() => void handleSaveAndClose()}
                  style={[styles.footerBtn, styles.footerBtnPrimary, styles.fullWidthBtn]}
                  disabled={saving}>
                  <Text style={[styles.footerBtnText, styles.footerBtnTextPrimary]}>
                    {saving ? 'Saving...' : 'Save & Close'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

function mapAnswerDtoToState(answer: QuestionAnswerDto | null): QuestionAnswerState {
  if (!answer) {
    return {value: null, comment: ''};
  }

  const rawValue = typeof answer.value === 'string' ? answer.value.toUpperCase() : '';
  const value: QuestionAnswerState['value'] =
    rawValue === 'YES' || rawValue === 'NO' || rawValue === 'NOT_ASSESSED' ? rawValue : null;

  const rawSeverity = typeof answer.severity === 'string' ? answer.severity.toUpperCase() : '';
  const severity: SeverityValue | undefined =
    rawSeverity === 'MINOR' || rawSeverity === 'MODERATE' || rawSeverity === 'CRITICAL'
      ? rawSeverity
      : undefined;

  return {
    id: typeof answer.id === 'string' ? answer.id : undefined,
    value,
    severity,
    comment: typeof answer.comment === 'string' ? answer.comment : '',
  };
}

function AnswerButton({
  label,
  active,
  onPress,
  mode,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  mode: 'yes' | 'no' | 'na';
}) {
  const modeStyle =
    mode === 'no' ? styles.answerBtnNo : mode === 'yes' ? styles.answerBtnYes : styles.answerBtnNa;
  const modeTextStyle =
    mode === 'no'
      ? styles.answerBtnTextNo
      : mode === 'yes'
        ? styles.answerBtnTextYes
        : styles.answerBtnTextNa;

  return (
    <Pressable onPress={onPress} style={[styles.answerBtn, active && modeStyle]}>
      <Text style={[styles.answerBtnText, active && modeTextStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(2,6,23,0.35)'},
  backdrop: {flex: 1},
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: '86%',
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {fontFamily: 'Inter', fontWeight: '700', fontSize: 16, color: '#0F172A', flex: 1},
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  closeBtnText: {fontFamily: 'Inter', fontWeight: '700', color: '#64748B'},
  subtitle: {
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 8,
    color: '#64748B',
    fontFamily: 'Inter',
    fontSize: 13,
  },
  errorText: {
    paddingHorizontal: 16,
    marginTop: 8,
    color: '#DC2626',
    fontFamily: 'Inter',
    fontSize: 12,
  },
  loadingWrap: {paddingVertical: 28, alignItems: 'center', gap: 8},
  loadingText: {fontFamily: 'Inter', color: '#64748B', fontSize: 13},
  scroll: {marginTop: 0},
  scrollContent: {paddingHorizontal: 16, paddingBottom: 20},
  phaseBtn: {
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  phaseBtnActive: {
    backgroundColor: '#2091F9',
    borderColor: '#2091F9',
  },
  phaseBtnText: {fontFamily: 'Inter', fontWeight: '700', fontSize: 13, color: '#2091F9'},
  phaseBtnTextActive: {color: '#FFFFFF'},
  phaseBtnChevron: {fontSize: 11, color: '#2091F9'},
  phaseDropdown: {
    width: '100%',
    minHeight: 179,
    marginBottom: 10,
    paddingTop: 12,
    paddingBottom: 1,
  },
  phaseDropdownWrap: {
    backgroundColor: '#F8FAFC',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  phaseRow: {
    width: '100%',
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  phaseRowText: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#0F172A',
  },
  questionCard: {
    width: 342,
    minHeight: 186,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  questionCardLast: {marginBottom: 0},
  questionRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  questionText: {fontFamily: 'Inter', fontWeight: '500', fontSize: 15, color: '#0F172A', flex: 1},
  playBtn: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#EBF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  playBtnText: {fontSize: 11, color: '#2091F9'},
  guidanceToggle: {marginTop: 6, marginBottom: 8},
  guidanceToggleText: {fontFamily: 'Inter', fontSize: 13, color: '#94A3B8'},
  guidanceBox: {
    borderRadius: 10,
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  guidanceBoxText: {fontFamily: 'Inter', color: '#1D4ED8', fontSize: 12, lineHeight: 17},
  answerGroup: {
    width: '100%',
    minHeight: 64,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingRight: 16,
    paddingBottom: 1,
    paddingLeft: 16,
    marginTop: 10,
  },
  answerRow: {flexDirection: 'row', gap: 12},
  answerBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 8,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
  },
  answerBtnYes: {backgroundColor: '#DCFCE7', borderColor: '#22C55E'},
  answerBtnNo: {backgroundColor: '#FEE2E2', borderColor: '#EF4444'},
  answerBtnNa: {backgroundColor: '#FEF3C7', borderColor: '#F59E0B'},
  answerBtnText: {fontFamily: 'Inter', color: '#64748B', fontWeight: '600', fontSize: 13},
  answerBtnTextYes: {color: '#16A34A'},
  answerBtnTextNo: {color: '#DC2626'},
  answerBtnTextNa: {color: '#D97706'},
  severityLabel: {
    marginTop: 10,
    marginBottom: 6,
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 11,
    color: '#94A3B8',
  },
  severityRow: {flexDirection: 'row', gap: 8},
  severityBtn: {
    width: 97.33,
    height: 34,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  severityMinor: {backgroundColor: '#FEF3C7', borderColor: '#F59E0B'},
  severityModerate: {backgroundColor: '#FED7AA', borderColor: '#EA580C'},
  severityCritical: {backgroundColor: '#FEE2E2', borderColor: '#DC2626'},
  severityBtnActive: {borderWidth: 1.5},
  severityBtnText: {fontFamily: 'Inter', fontSize: 12, lineHeight: 16, fontWeight: '600', color: '#94A3B8'},
  severityMinorText: {color: '#F59E0B'},
  severityModerateText: {color: '#EA580C'},
  severityCriticalText: {color: '#DC2626'},
  severityBtnTextActive: {fontWeight: '700'},
  commentInput: {
    marginTop: 8,
    minHeight: 118,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    backgroundColor: '#FFF8F8',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#0F172A',
    textAlignVertical: 'top',
    paddingBottom: 42,
  },
  voiceInCommentWrap: {
    marginTop: -38,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  voiceBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
  },
  voiceBtnText: {fontFamily: 'Inter', fontWeight: '600', fontSize: 12, color: '#DC2626'},
  mediaRow: {flexDirection: 'row', gap: 8, marginTop: 10},
  mediaBtn: {
    width: 150,
    height: 38,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'solid',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaBtnText: {fontFamily: 'Inter', fontWeight: '600', fontSize: 13, color: '#64748B'},
  photoStrip: {marginTop: 8},
  photoStripContent: {gap: 10, paddingRight: 8},
  photoTile: {
    width: 72,
    height: 72,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  photoImg: {width: '100%', height: '100%'},
  photoRemoveBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoRemoveText: {color: '#FFFFFF', fontSize: 16, lineHeight: 18, fontWeight: '700'},
  footerActions: {flexDirection: 'row', gap: 10, marginTop: 12},
  footerBtn: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
  },
  footerBtnOutline: {borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: '#FFFFFF'},
  footerBtnPrimary: {backgroundColor: '#2091F9'},
  footerBtnWarn: {backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FCD34D'},
  footerBtnText: {fontFamily: 'Inter', fontWeight: '700', fontSize: 13},
  footerBtnTextOutline: {color: '#64748B'},
  footerBtnTextPrimary: {color: '#FFFFFF'},
  footerBtnTextWarn: {color: '#92400E'},
  fullWidthBtn: {width: '100%', flex: 0},
});