import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Animated, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeftIcon,
  Volume2Icon,
  ChevronDownIcon,
  CheckIcon,
  XIcon,
  InfoIcon,
  FlaskConicalIcon,
  LayoutIcon,
  ColumnsIcon,
  ImageIcon,
  HeadphonesIcon,
} from 'lucide-react-native';
import { Snapy } from '@/components/Snapy';

// ==========================================
// TYPES
// ==========================================
type FieldType = 'WORD' | 'MEANING' | 'PART_OF_SPEECH' | 'EXAMPLE' | 'PERSONAL_NOTE' | 'IPA' | 'AUDIO' | 'IMAGE';
type BaseLayout = 'SINGLE_COLUMN' | 'TWO_COLUMN' | 'IMAGE_TOP' | 'AUDIO_CENTER';
type InteractionType = 'FLIP' | 'TYPE_IN' | 'TAP_TO_REVEAL';

interface TemplateField {
  id: FieldType;
  label: string;
  sample: string;
  enabled: boolean;
  isPrimary: boolean;
  config?: {
    autoPlay?: boolean;
    maskPattern?: '___' | '•••';
    showAll?: boolean;
  };
}

interface SampleNote {
  id: string;
  word: string;
  meaning: string | null;
  partOfSpeech: string | null;
  example: string | null;
  personalNote: string | null;
  ipa: string | null;
  audio: boolean;
  image: boolean;
}

// ==========================================
// MOCK NOTES
// ==========================================
const SAMPLE_NOTES: SampleNote[] = [
  {
    id: 'n1', word: 'abandon', meaning: 'từ bỏ', partOfSpeech: 'verb',
    example: 'He abandoned the plan.', personalNote: 'Remember this word.',
    ipa: '/əˈbændən/', audio: true, image: true,
  },
  {
    id: 'n2', word: 'beautiful', meaning: 'đẹp', partOfSpeech: 'adjective',
    example: 'What a beautiful day!', personalNote: null,
    ipa: '/ˈbjuːtɪfəl/', audio: true, image: false,
  },
  {
    id: 'n3', word: 'comprehend', meaning: null, partOfSpeech: null,
    example: null, personalNote: null,
    ipa: null, audio: false, image: false,
  },
];

const FIELD_NOTE_MAP: Record<FieldType, keyof SampleNote> = {
  WORD: 'word',
  MEANING: 'meaning',
  PART_OF_SPEECH: 'partOfSpeech',
  EXAMPLE: 'example',
  PERSONAL_NOTE: 'personalNote',
  IPA: 'ipa',
  AUDIO: 'audio',
  IMAGE: 'image',
};

const LAYOUT_LABELS: Record<BaseLayout, string> = {
  SINGLE_COLUMN: '1 cột',
  TWO_COLUMN: '2 cột',
  IMAGE_TOP: 'Ảnh trên',
  AUDIO_CENTER: 'Audio giữa',
};

const INTERACTION_LABELS: Record<InteractionType, string> = {
  FLIP: 'Chạm để lật',
  TYPE_IN: 'Gõ đáp án',
  TAP_TO_REVEAL: 'Lộ dần',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function TemplatePreviewScreen() {
  const params = useLocalSearchParams();
  const source = (params.source as string) || 'FROM_BUILDER';
  const templateId = params.templateId as string;

  // Parse template config from params
  let templateConfig: {
    name: string;
    baseLayout: BaseLayout;
    frontFields: TemplateField[];
    backFields: TemplateField[];
    interactionType: InteractionType;
    strictMode: boolean;
    templateType?: 'system' | 'custom';
  };

  try {
    templateConfig = JSON.parse(params.templateConfig as string);
  } catch {
    templateConfig = {
      name: 'Classic Template',
      baseLayout: 'SINGLE_COLUMN',
      frontFields: [
        { id: 'WORD', label: 'Từ vựng', sample: 'abandon', enabled: true, isPrimary: true },
        { id: 'IPA', label: 'Phiên âm', sample: '/əˈbændən/', enabled: true, isPrimary: false },
      ],
      backFields: [
        { id: 'MEANING', label: 'Nghĩa', sample: 'từ bỏ', enabled: true, isPrimary: true },
        { id: 'EXAMPLE', label: 'Ví dụ', sample: 'He abandoned the plan.', enabled: true, isPrimary: false },
        { id: 'WORD', label: 'Từ vựng', sample: 'abandon', enabled: true, isPrimary: false },
      ],
      interactionType: 'FLIP',
      strictMode: false,
      templateType: 'system',
    };
  }

  // State
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(0);
  const [showNoteSelector, setShowNoteSelector] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [typeInValue, setTypeInValue] = useState('');
  const [typeInResult, setTypeInResult] = useState<'correct' | 'incorrect' | null>(null);
  const [revealedFields, setRevealedFields] = useState<Set<string>>(new Set());

  const currentNote = SAMPLE_NOTES[selectedNoteIndex];
  const isSystemDemo = selectedNoteIndex === 0;

  // Flip Animation (reused from MH-LEARN-01)
  const flipAnim = useRef(new Animated.Value(0)).current;

  const frontInterpolate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backInterpolate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const frontOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 0.51, 1], outputRange: [1, 1, 0, 0] });
  const backOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 0.51, 1], outputRange: [0, 0, 1, 1] });

  // ==========================================
  // HELPERS
  // ==========================================
  const getFieldValue = (fieldId: FieldType, note: SampleNote): string | null => {
    const key = FIELD_NOTE_MAP[fieldId];
    if (!key) return null;
    const val = note[key];
    if (val === null || val === undefined) return null;
    if (typeof val === 'boolean') return val ? '▶' : null;
    return String(val);
  };

  const getEnabledFieldsWithData = (fields: TemplateField[], note: SampleNote) => {
    return fields.filter(f => f.enabled).map(f => ({
      ...f,
      value: getFieldValue(f.id, note),
    }));
  };

  const getHiddenFields = (fields: TemplateField[], note: SampleNote) => {
    return fields.filter(f => f.enabled && getFieldValue(f.id, note) === null);
  };

  const frontFieldsWithData = getEnabledFieldsWithData(templateConfig.frontFields, currentNote);
  const backFieldsWithData = getEnabledFieldsWithData(templateConfig.backFields, currentNote);
  const visibleFront = frontFieldsWithData.filter(f => f.value !== null);
  const visibleBack = backFieldsWithData.filter(f => f.value !== null);
  const hiddenFront = getHiddenFields(templateConfig.frontFields, currentNote);
  const hiddenBack = getHiddenFields(templateConfig.backFields, currentNote);
  const allHidden = [...hiddenFront, ...hiddenBack];

  const enabledFrontCount = templateConfig.frontFields.filter(f => f.enabled).length;
  const enabledBackCount = templateConfig.backFields.filter(f => f.enabled).length;

  // ==========================================
  // INTERACTION HANDLERS
  // ==========================================
  const handleFlip = () => {
    if (isFlipped) return;
    Animated.spring(flipAnim, { toValue: 1, friction: 8, tension: 10, useNativeDriver: true }).start(() => {
      setIsFlipped(true);
    });
  };

  const resetFlip = () => {
    flipAnim.setValue(0);
    setIsFlipped(false);
  };

  const handleTypeInCheck = () => {
    const correctAnswer = currentNote.word;
    const userAnswer = typeInValue.trim();
    if (!userAnswer) return;

    if (templateConfig.strictMode) {
      setTypeInResult(userAnswer === correctAnswer ? 'correct' : 'incorrect');
    } else {
      setTypeInResult(userAnswer.toLowerCase() === correctAnswer.toLowerCase() ? 'correct' : 'incorrect');
    }
  };

  const handleRevealField = (fieldId: string) => {
    setRevealedFields(prev => new Set(prev).add(fieldId));
  };

  const handleChangeNote = (index: number) => {
    setSelectedNoteIndex(index);
    setShowNoteSelector(false);
    // Reset interaction state
    resetFlip();
    setTypeInValue('');
    setTypeInResult(null);
    setRevealedFields(new Set());
  };

  // ==========================================
  // RENDER FIELD (inline styles to avoid Reanimated nav context issue)
  // ==========================================
  const renderField = (field: { id: FieldType; isPrimary: boolean; value: string | null; config?: any }, maskWord?: string) => {
    if (field.value === null) return null;

    let displayValue = field.value;

    // Apply mask for EXAMPLE field
    if (field.id === 'EXAMPLE' && field.config?.maskPattern && maskWord) {
      displayValue = displayValue.replace(new RegExp(maskWord, 'gi'), field.config.maskPattern);
    }

    // AUDIO field
    if (field.id === 'AUDIO') {
      return (
        <Pressable
          key={field.id}
          style={{
            width: 56, height: 56, borderRadius: 28,
            backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center',
            alignSelf: 'center', marginVertical: 8,
          }}
        >
          <Volume2Icon size={28} color="#3B82F6" />
        </Pressable>
      );
    }

    // IMAGE field
    if (field.id === 'IMAGE') {
      return (
        <View key={field.id} style={{
          width: '100%', height: 120, borderRadius: 16, backgroundColor: '#F3F4F6',
          alignItems: 'center', justifyContent: 'center', marginVertical: 8,
        }}>
          <ImageIcon size={32} color="#9CA3AF" />
          <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>Hình ảnh minh hoạ</Text>
        </View>
      );
    }

    return (
      <Text
        key={field.id}
        style={{
          fontSize: field.isPrimary ? 32 : 16,
          fontWeight: field.isPrimary ? '800' : '500',
          color: field.isPrimary ? '#1B2541' : '#6B7280',
          textAlign: 'center',
          marginVertical: field.isPrimary ? 8 : 4,
          lineHeight: field.isPrimary ? 40 : 24,
        }}
      >
        {displayValue}
      </Text>
    );
  };

  // ==========================================
  // RENDER CARD FACE
  // ==========================================
  const renderCardFace = (fields: typeof visibleFront) => {
    if (fields.length === 0) {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Snapy pose="curious" className="w-16 h-16 mb-2" />
          <Text style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center', paddingHorizontal: 20 }}>
            Note này chưa có dữ liệu phù hợp để hiển thị mặt thẻ.
          </Text>
        </View>
      );
    }

    const wordValue = fields.find(f => f.id === 'WORD')?.value;

    // IMAGE_TOP layout
    if (templateConfig.baseLayout === 'IMAGE_TOP') {
      const imageField = fields.find(f => f.id === 'IMAGE');
      const otherFields = fields.filter(f => f.id !== 'IMAGE');
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          {imageField && renderField(imageField)}
          {otherFields.map(f => renderField(f, wordValue || undefined))}
        </View>
      );
    }

    // AUDIO_CENTER layout
    if (templateConfig.baseLayout === 'AUDIO_CENTER') {
      const audioField = fields.find(f => f.id === 'AUDIO');
      const otherFields = fields.filter(f => f.id !== 'AUDIO');
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          {audioField && renderField(audioField)}
          {otherFields.map(f => renderField(f, wordValue || undefined))}
        </View>
      );
    }

    // TWO_COLUMN layout
    if (templateConfig.baseLayout === 'TWO_COLUMN') {
      const primary = fields.find(f => f.isPrimary);
      const rest = fields.filter(f => !f.isPrimary);
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          {primary && renderField(primary, wordValue || undefined)}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 8 }}>
            {rest.map(f => (
              <View key={f.id} style={{ width: '45%', alignItems: 'center' }}>
                {renderField(f, wordValue || undefined)}
              </View>
            ))}
          </View>
        </View>
      );
    }

    // SINGLE_COLUMN (default)
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        {fields.map(f => renderField(f, wordValue || undefined))}
      </View>
    );
  };

  // ==========================================
  // RENDER INTERACTION AREA
  // ==========================================
  const renderInteraction = () => {
    // FLIP
    if (templateConfig.interactionType === 'FLIP') {
      return (
        <View style={{ alignItems: 'center', paddingVertical: 16 }}>
          {isFlipped ? (
            <Pressable
              onPress={() => { resetFlip(); }}
              style={{
                backgroundColor: '#F3F4F6', paddingHorizontal: 24, paddingVertical: 12,
                borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 8,
              }}
            >
              <Text style={{ fontWeight: '700', fontSize: 14, color: '#6B7280' }}>Lật lại mặt trước</Text>
            </Pressable>
          ) : (
            <Text style={{ fontWeight: '600', fontSize: 13, color: '#9CA3AF', letterSpacing: 1 }}>
              CHẠM VÀO THẺ ĐỂ LẬT
            </Text>
          )}
        </View>
      );
    }

    // TYPE_IN
    if (templateConfig.interactionType === 'TYPE_IN') {
      return (
        <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 8,
            backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 2,
            borderColor: typeInResult === 'correct' ? '#22C55E' : typeInResult === 'incorrect' ? '#EF4444' : '#E5E7EB',
            paddingHorizontal: 16, height: 52,
          }}>
            <TextInput
              value={typeInValue}
              onChangeText={(t) => { setTypeInValue(t); setTypeInResult(null); }}
              placeholder="Gõ đáp án..."
              style={{ flex: 1, fontSize: 16, fontWeight: '600', color: '#1B2541' }}
              editable={typeInResult === null}
            />
            {typeInResult === 'correct' && <CheckIcon size={24} color="#22C55E" />}
            {typeInResult === 'incorrect' && <XIcon size={24} color="#EF4444" />}
          </View>

          {typeInResult === 'incorrect' && (
            <Text style={{ fontSize: 13, color: '#EF4444', fontWeight: '600', marginTop: 8, textAlign: 'center' }}>
              Đáp án đúng: <Text style={{ fontWeight: '800', color: '#1B2541' }}>{currentNote.word}</Text>
            </Text>
          )}

          {typeInResult === null && (
            <Pressable
              onPress={handleTypeInCheck}
              style={{
                marginTop: 12, height: 48, backgroundColor: '#3B82F6', borderRadius: 14,
                alignItems: 'center', justifyContent: 'center',
                borderBottomWidth: 4, borderBottomColor: '#1D4ED8',
              }}
            >
              <Text style={{ fontWeight: '800', fontSize: 15, color: '#FFFFFF', letterSpacing: 0.5 }}>KIỂM TRA</Text>
            </Pressable>
          )}

          {typeInResult !== null && (
            <Pressable
              onPress={() => { setTypeInValue(''); setTypeInResult(null); }}
              style={{
                marginTop: 12, height: 48, backgroundColor: '#F3F4F6', borderRadius: 14,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Text style={{ fontWeight: '700', fontSize: 14, color: '#6B7280' }}>Thử lại</Text>
            </Pressable>
          )}
        </View>
      );
    }

    // TAP_TO_REVEAL
    return null; // Handled inline in the card
  };

  // ==========================================
  // MAIN RENDER
  // ==========================================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F8FA' }} edges={['top']}>

      {/* HEADER */}
      <View style={{
        paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
        backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center',
      }}>
        <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: -8 }}>
          <ArrowLeftIcon size={24} color="#1B2541" />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 4 }}>
          <Text style={{ fontWeight: '800', fontSize: 18, color: '#1B2541' }}>Xem trước</Text>
          <Text style={{ fontWeight: '600', fontSize: 12, color: '#9CA3AF', marginTop: 1 }} numberOfLines={1}>
            {templateConfig.name}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* SANDBOX BADGE */}
        <View style={{
          marginHorizontal: 16, marginTop: 12, backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A',
          borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8,
        }}>
          <FlaskConicalIcon size={18} color="#D97706" />
          <Text style={{ flex: 1, fontSize: 12, fontWeight: '600', color: '#92400E', lineHeight: 18 }}>
            Chế độ xem trước — không ghi nhận kết quả
          </Text>
        </View>

        {/* DEMO NOTE INDICATOR */}
        {isSystemDemo && (
          <View style={{
            marginHorizontal: 16, marginTop: 8, backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE',
            borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8,
          }}>
            <InfoIcon size={16} color="#3B82F6" />
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#1E40AF' }}>Đang xem với dữ liệu mẫu</Text>
          </View>
        )}

        {/* ==========================================
            FLASHCARD AREA
            ========================================== */}
        <View style={{ paddingHorizontal: 20, marginTop: 20, alignItems: 'center' }}>

          {templateConfig.interactionType === 'FLIP' && (
            <Pressable onPress={handleFlip} disabled={isFlipped} style={{ width: '100%', height: 340 }}>
              {/* FRONT */}
              <Animated.View style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: '#FFFFFF', borderRadius: 28, borderWidth: 2, borderColor: '#F5F5F5',
                borderBottomWidth: 6, padding: 24,
                transform: [{ rotateY: frontInterpolate }],
                opacity: frontOpacity, backfaceVisibility: 'hidden',
                elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12,
              }}>
                {renderCardFace(visibleFront)}
                <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center', opacity: 0.5 }}>
                  <Text style={{ fontWeight: '700', fontSize: 12, color: '#9CA3AF', letterSpacing: 2 }}>CHẠM ĐỂ LẬT</Text>
                </View>
              </Animated.View>

              {/* BACK */}
              <Animated.View style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: '#FFFFFF', borderRadius: 28, borderWidth: 2, borderColor: '#F5F5F5',
                borderBottomWidth: 6, padding: 24,
                transform: [{ rotateY: backInterpolate }],
                opacity: backOpacity, backfaceVisibility: 'hidden',
                elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12,
              }}>
                {renderCardFace(visibleBack)}
              </Animated.View>
            </Pressable>
          )}

          {templateConfig.interactionType === 'TYPE_IN' && (
            <View style={{
              width: '100%', minHeight: 280, backgroundColor: '#FFFFFF', borderRadius: 28,
              borderWidth: 2, borderColor: '#F5F5F5', borderBottomWidth: 6, padding: 24,
              elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12,
            }}>
              {renderCardFace(visibleFront)}
            </View>
          )}

          {templateConfig.interactionType === 'TAP_TO_REVEAL' && (
            <View style={{
              width: '100%', minHeight: 340, backgroundColor: '#FFFFFF', borderRadius: 28,
              borderWidth: 2, borderColor: '#F5F5F5', borderBottomWidth: 6, padding: 24,
              elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12,
            }}>
              {/* FRONT always visible */}
              {renderCardFace(visibleFront)}

              {/* Divider */}
              <View style={{ width: '100%', height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 }} />

              {/* BACK fields: hidden until tapped */}
              {visibleBack.map(f => {
                const isRevealed = revealedFields.has(f.id);
                if (isRevealed) {
                  return (
                    <View key={f.id} style={{ marginVertical: 4 }}>
                      {renderField(f)}
                    </View>
                  );
                }
                return (
                  <Pressable
                    key={f.id}
                    onPress={() => handleRevealField(f.id)}
                    style={{
                      backgroundColor: '#F3F4F6', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16,
                      marginVertical: 4, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8,
                      borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed',
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#9CA3AF' }}>Chạm để hiện {f.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* INTERACTION AREA (below card) */}
        {renderInteraction()}

        {/* HIDDEN FIELDS INDICATOR */}
        {allHidden.length > 0 && (
          <View style={{
            marginHorizontal: 16, marginTop: 12, backgroundColor: '#FFF7ED', borderWidth: 1, borderColor: '#FED7AA',
            borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
          }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#9A3412', lineHeight: 18 }}>
              Một số field được ẩn vì Note chưa có dữ liệu.
            </Text>
            <Text style={{ fontSize: 11, fontWeight: '500', color: '#C2410C', marginTop: 4 }}>
              Đã ẩn: {allHidden.map(f => f.label).join(', ')}
            </Text>
          </View>
        )}

        {/* TEMPLATE INFO ROW */}
        <View style={{
          marginHorizontal: 16, marginTop: 16, backgroundColor: '#FFFFFF', borderRadius: 20,
          borderWidth: 1, borderColor: '#F5F5F5', padding: 16,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#9CA3AF' }}>Layout</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1B2541' }}>{LAYOUT_LABELS[templateConfig.baseLayout]}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#9CA3AF' }}>Interaction</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1B2541' }}>{INTERACTION_LABELS[templateConfig.interactionType]}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#9CA3AF' }}>Fields</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1B2541' }}>
              {enabledFrontCount} FRONT · {enabledBackCount} BACK
            </Text>
          </View>
        </View>

        {/* NOTE SELECTOR */}
        <View style={{ marginHorizontal: 16, marginTop: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#9CA3AF', marginBottom: 8, letterSpacing: 1 }}>NOTE MẪU</Text>
          <Pressable
            onPress={() => setShowNoteSelector(true)}
            style={{
              backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB',
              paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <View>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1B2541' }}>{currentNote.word}</Text>
              <Text style={{ fontSize: 12, fontWeight: '500', color: '#9CA3AF', marginTop: 2 }}>
                {currentNote.meaning || 'Thiếu dữ liệu nghĩa'}
              </Text>
            </View>
            <ChevronDownIcon size={20} color="#9CA3AF" />
          </Pressable>
        </View>

      </ScrollView>

      {/* BOTTOM CTA */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F5F5F5',
        padding: 16, paddingBottom: 32,
      }}>
        {source === 'FROM_BUILDER' ? (
          <Pressable
            onPress={() => router.back()}
            style={{
              height: 56, backgroundColor: '#1B2541', borderRadius: 16,
              borderBottomWidth: 4, borderBottomColor: '#0F172A',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text style={{ fontWeight: '800', fontSize: 16, color: '#FFFFFF', letterSpacing: 0.5 }}>QUAY LẠI SỬA</Text>
          </Pressable>
        ) : templateConfig.templateType === 'system' ? (
          <Pressable
            onPress={() => {
              router.back();
              setTimeout(() => {
                router.push({ pathname: '/templates/builder' as any, params: { mode: 'CREATE_FROM_SYSTEM', id: templateId } });
              }, 100);
            }}
            style={{
              height: 56, backgroundColor: '#3B82F6', borderRadius: 16,
              borderBottomWidth: 4, borderBottomColor: '#1D4ED8',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text style={{ fontWeight: '800', fontSize: 16, color: '#FFFFFF', letterSpacing: 0.5 }}>NHÂN BẢN ĐỂ SỬA</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              router.back();
              setTimeout(() => {
                router.push({ pathname: '/templates/builder' as any, params: { mode: 'EDIT', id: templateId } });
              }, 100);
            }}
            style={{
              height: 56, backgroundColor: '#3B82F6', borderRadius: 16,
              borderBottomWidth: 4, borderBottomColor: '#1D4ED8',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text style={{ fontWeight: '800', fontSize: 16, color: '#FFFFFF', letterSpacing: 0.5 }}>SỬA TEMPLATE</Text>
          </Pressable>
        )}
      </View>

      {/* NOTE SELECTOR MODAL */}
      <Modal visible={showNoteSelector} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={() => setShowNoteSelector(false)} />
          <View style={{
            backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28,
            padding: 24, paddingBottom: 40,
          }}>
            <View style={{ width: 48, height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, marginBottom: 20, alignSelf: 'center' }} />
            <Text style={{ fontWeight: '800', fontSize: 20, color: '#1B2541', marginBottom: 16 }}>Chọn Note mẫu</Text>

            {SAMPLE_NOTES.map((note, idx) => (
              <Pressable
                key={note.id}
                onPress={() => handleChangeNote(idx)}
                style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  paddingVertical: 14, paddingHorizontal: 16, marginBottom: 8, borderRadius: 14,
                  borderWidth: 2,
                  borderColor: selectedNoteIndex === idx ? '#3B82F6' : '#F5F5F5',
                  backgroundColor: selectedNoteIndex === idx ? '#EFF6FF' : '#FFFFFF',
                }}
              >
                <View>
                  <Text style={{ fontWeight: '700', fontSize: 16, color: '#1B2541' }}>{note.word}</Text>
                  <Text style={{ fontWeight: '500', fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                    {note.meaning || '(Thiếu nhiều dữ liệu)'}
                  </Text>
                </View>
                {selectedNoteIndex === idx && <CheckIcon size={20} color="#3B82F6" />}
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
