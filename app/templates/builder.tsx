import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeftIcon,
  SettingsIcon,
  PlusIcon,
  EyeIcon,
  GripVerticalIcon,
  MoreVerticalIcon,
  XIcon,
  CheckIcon,
  Volume2Icon,
  SparklesIcon,
  Trash2Icon,
} from 'lucide-react-native';
import { templateRepository } from '@/lib/repositories/template.repository';
import { TemplateDTO, TemplateElementDTO, TemplateFieldDTO, SemanticRole } from '@/lib/topic-eav';
import { FieldSettingsSheet } from '@/components/learning/FieldSettingsSheet';
import { SectionSettingsSheet } from '@/components/learning/SectionSettingsSheet';
import { DynamicCardRenderer } from '@/components/study/DynamicCardRenderer';
import { cn } from '@/lib/utils';

// ==========================================
// TOKENS & SHADOW STYLES
// ==========================================
const SOFT_CARD_SHADOW = Platform.select({
  web: {
    boxShadow: '0 3px 12px rgba(15, 23, 42, 0.05)',
  },
  default: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
}) as any;

// ==========================================
// DATA TYPES CHO DYNAMIC BUILDER
// ==========================================
export interface BuilderField extends TemplateFieldDTO {
  column: 1 | 2;
  sampleValue?: string;
  required?: boolean;
}

export interface BuilderSection {
  id: string;
  side: 'FRONT' | 'BACK';
  name: string;
  columns: 1 | 2;
  repeatable: boolean;
  fields: BuilderField[];
}

interface FieldTypeOption {
  typeKey: string;
  name: string;
  description: string;
  role: SemanticRole;
  audioAction: boolean;
  defaultLabel: string;
  sampleValue: string;
  icon: string;
}

const FIELD_TYPES: FieldTypeOption[] = [
  {
    typeKey: 'TARGET_WORD',
    name: 'Từ vựng chính',
    description: 'Từ vựng tiếng Anh cần ghi nhớ',
    role: 'TARGET_WORD',
    audioAction: false,
    defaultLabel: 'Từ vựng',
    sampleValue: 'boarding pass',
    icon: '🔤',
  },
  {
    typeKey: 'AUDIO',
    name: 'Phát âm / Audio',
    description: 'Phiên âm IPA kèm nút nghe phát âm',
    role: 'AUDIO',
    audioAction: true,
    defaultLabel: 'Phiên âm',
    sampleValue: '/ˈbɔːrdɪŋ pæs/',
    icon: '🔊',
  },
  {
    typeKey: 'NATIVE_TRANSLATION',
    name: 'Bản dịch / Nghĩa',
    description: 'Nghĩa tiếng Việt chuẩn xác',
    role: 'NATIVE_TRANSLATION',
    audioAction: false,
    defaultLabel: 'Bản dịch / Nghĩa',
    sampleValue: 'Thẻ lên tàu bay',
    icon: '🇻🇳',
  },
  {
    typeKey: 'DEFINITION',
    name: 'Định nghĩa chi tiết',
    description: 'Giải thích ngữ nghĩa bằng tiếng Anh hoặc Việt',
    role: 'DEFINITION',
    audioAction: false,
    defaultLabel: 'Định nghĩa',
    sampleValue: 'A document provided by an airline during check-in',
    icon: '📖',
  },
  {
    typeKey: 'EXAMPLE_SENTENCE',
    name: 'Câu ví dụ',
    description: 'Ngữ cảnh sử dụng từ trong câu thực tế',
    role: 'EXAMPLE_SENTENCE',
    audioAction: false,
    defaultLabel: 'Câu ví dụ',
    sampleValue: 'Please present your boarding pass at gate 12.',
    icon: '💬',
  },
  {
    typeKey: 'IMAGE',
    name: 'Hình ảnh minh họa',
    description: 'Ảnh minh họa giúp tăng trực quan ghi nhớ',
    role: 'IMAGE',
    audioAction: false,
    defaultLabel: 'Hình ảnh',
    sampleValue: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
    icon: '🖼️',
  },
];

// Dữ liệu mẫu khởi tạo ban đầu khi chưa có draft
const DEFAULT_INITIAL_SECTIONS: BuilderSection[] = [
  {
    id: 'sec_front_1',
    side: 'FRONT',
    name: 'Thông tin chung',
    columns: 2,
    repeatable: false,
    fields: [
      {
        id: 1,
        schemaAttributeId: 1,
        attributeName: 'word',
        fieldLabel: 'Từ vựng',
        semanticRole: 'TARGET_WORD',
        required: true,
        hideIfEmpty: false,
        audioAction: false,
        fontSize: 18,
        alignment: 'LEFT',
        color: '#171A2F',
        column: 1,
        sampleValue: 'boarding pass',
      },
      {
        id: 2,
        schemaAttributeId: 2,
        attributeName: 'phonetic',
        fieldLabel: 'Phiên âm',
        semanticRole: 'AUDIO',
        required: false,
        hideIfEmpty: false,
        audioAction: true,
        fontSize: 15,
        alignment: 'LEFT',
        color: '#1CB0F6',
        column: 2,
        sampleValue: '/ˈbɔːrdɪŋ pæs/',
      },
    ],
  },
  {
    id: 'sec_back_1',
    side: 'BACK',
    name: 'Nghĩa & Ví dụ',
    columns: 1,
    repeatable: true,
    fields: [
      {
        id: 4,
        schemaAttributeId: 4,
        attributeName: 'translation',
        fieldLabel: 'Bản dịch / Nghĩa',
        semanticRole: 'NATIVE_TRANSLATION',
        required: true,
        hideIfEmpty: false,
        audioAction: false,
        fontSize: 18,
        alignment: 'LEFT',
        color: '#58CC02',
        column: 1,
        sampleValue: 'Thẻ lên tàu bay',
      },
      {
        id: 5,
        schemaAttributeId: 5,
        attributeName: 'sentence',
        fieldLabel: 'Câu ví dụ (Sentence)',
        semanticRole: 'EXAMPLE_SENTENCE',
        required: false,
        hideIfEmpty: true,
        audioAction: false,
        fontSize: 15,
        alignment: 'LEFT',
        color: '#757793',
        column: 1,
        sampleValue: 'Please show your boarding pass and passport at the gate.',
      },
    ],
  },
];

// ==========================================
// LOCAL STORAGE PERSISTENCE HELPER
// ==========================================
const DRAFT_KEY_PREFIX = 'snapvocab_template_builder_draft_';

function getStorageKey(topicId?: number, templateId?: number) {
  if (topicId) return `${DRAFT_KEY_PREFIX}topic_${topicId}`;
  return `${DRAFT_KEY_PREFIX}template_${templateId || 1}`;
}

function loadLocalDraft(key: string): BuilderSection[] | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('[TemplateBuilder] Failed to load draft:', e);
    }
  }
  return null;
}

function saveLocalDraft(key: string, sections: BuilderSection[]) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, JSON.stringify(sections));
    } catch (e) {
      console.warn('[TemplateBuilder] Failed to save draft:', e);
    }
  }
}

// Chuyển mảng Section động thành TemplateDTO chuẩn cho DynamicCardRenderer & Repository
function buildTemplateFromSections(sections: BuilderSection[], templateId: number): TemplateDTO {
  const elements: TemplateElementDTO[] = [];
  let position = 0;

  // Front elements
  const frontSections = sections.filter((s) => s.side === 'FRONT');
  frontSections.forEach((sec, secIdx) => {
    if (secIdx > 0) {
      elements.push({ position: position++, type: 'SECTION_BREAK' });
    }
    sec.fields.forEach((f) => {
      elements.push({
        id: f.id,
        position: position++,
        type: 'FIELD',
        field: { ...f },
      });
    });
  });

  // Section break phân cách Front và Back
  elements.push({ position: position++, type: 'SECTION_BREAK' });

  // Back elements
  const backSections = sections.filter((s) => s.side === 'BACK');
  backSections.forEach((sec, secIdx) => {
    if (secIdx > 0) {
      elements.push({ position: position++, type: 'SECTION_BREAK' });
    }
    sec.fields.forEach((f) => {
      elements.push({
        id: f.id,
        position: position++,
        type: 'FIELD',
        field: { ...f },
      });
    });
  });

  return {
    id: templateId,
    schemaId: 1,
    name: 'Bố cục tùy chỉnh Flashcard',
    isDefault: false,
    elements,
  };
}

export default function TemplateBuilderScreen() {
  const params = useLocalSearchParams();
  const templateId = Number(params.templateId) || 1;
  const topicId = params.topicId ? Number(params.topicId) : undefined;
  const collectionId = params.collectionId ? Number(params.collectionId) : undefined;
  const topicName = (params.topicName as string) || 'Chủ đề từ vựng';

  // State động Section & Field
  const [sections, setSections] = useState<BuilderSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Tab Mặt trước / Mặt sau
  const [activeSide, setActiveSide] = useState<'FRONT' | 'BACK'>('FRONT');

  // Preview Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewSide, setPreviewSide] = useState<'FRONT' | 'BACK'>('FRONT');

  // Bottom Sheets chỉnh sửa Field / Section
  const [editingField, setEditingField] = useState<BuilderField | null>(null);
  const [editingFieldSectionId, setEditingFieldSectionId] = useState<string | null>(null);
  const [isFieldSheetOpen, setIsFieldSheetOpen] = useState(false);

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isSectionSheetOpen, setIsSectionSheetOpen] = useState(false);

  // Modal Thêm trường mới (UI chọn loại trường)
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [addFieldTargetSectionId, setAddFieldTargetSectionId] = useState<string | null>(null);
  const [selectedColumnForNewField, setSelectedColumnForNewField] = useState<1 | 2>(1);

  // Toast feedback thông báo
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  // Khởi tạo và khôi phục draft Local-first
  useEffect(() => {
    const draftKey = getStorageKey(topicId, templateId);
    const savedDraft = loadLocalDraft(draftKey);

    // Mô phỏng skeleton loading UX mượt mà 350ms
    const timer = setTimeout(() => {
      if (savedDraft && savedDraft.length > 0) {
        setSections(savedDraft);
        showToast('Đã khôi phục bản nháp chưa lưu', 'info');
      } else {
        setSections(DEFAULT_INITIAL_SECTIONS);
      }
      setLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [templateId, topicId, showToast]);

  // Tự động lưu draft vào LocalStorage khi sections thay đổi
  useEffect(() => {
    if (!loading && sections.length > 0) {
      const draftKey = getStorageKey(topicId, templateId);
      saveLocalDraft(draftKey, sections);
    }
  }, [sections, loading, templateId, topicId]);

  // Danh sách các Section thuộc Tab đang chọn
  const currentSections = useMemo(
    () => sections.filter((s) => s.side === activeSide),
    [sections, activeSide]
  );

  // Đối tượng Section đang mở Settings
  const activeSection = useMemo(
    () => sections.find((s) => s.id === activeSectionId) || null,
    [sections, activeSectionId]
  );

  // ==========================================
  // THAO TÁC STATE VỚI SECTION (DYNAMIC ACTIONS)
  // ==========================================

  // Thêm Section mới
  const handleAddSection = () => {
    const newSectionId = `sec_${Date.now()}`;
    const newSectionNumber = currentSections.length + 1;
    const newSection: BuilderSection = {
      id: newSectionId,
      side: activeSide,
      name: `Phần hiển thị ${newSectionNumber}`,
      columns: 1,
      repeatable: false,
      fields: [],
    };
    setSections((prev) => [...prev, newSection]);
    showToast(`Đã thêm "${newSection.name}"`);
  };

  // Cập nhật Section (Đổi tên, Đổi số cột, Bật lặp lại)
  const handleSaveSectionSettings = (data: {
    sectionName: string;
    repeatable: boolean;
    columnsCount: 1 | 2;
  }) => {
    if (!activeSectionId) return;
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === activeSectionId) {
          // Nếu chuyển từ 2 cột về 1 cột, gom toàn bộ field về cột 1
          const updatedFields =
            data.columnsCount === 1
              ? sec.fields.map((f) => ({ ...f, column: 1 as const }))
              : sec.fields;

          return {
            ...sec,
            name: data.sectionName.trim() || sec.name,
            repeatable: data.repeatable,
            columns: data.columnsCount,
            fields: updatedFields,
          };
        }
        return sec;
      })
    );
    setIsSectionSheetOpen(false);
    showToast('Đã cập nhật cài đặt phần hiển thị');
  };

  // Xóa Section
  const handleDeleteSection = () => {
    if (!activeSectionId) return;
    setSections((prev) => prev.filter((sec) => sec.id !== activeSectionId));
    setIsSectionSheetOpen(false);
    showToast('Đã xóa phần hiển thị', 'info');
  };

  // ==========================================
  // THAO TÁC STATE VỚI FIELD (DYNAMIC ACTIONS)
  // ==========================================

  // Mở modal thêm trường vào Section cụ thể
  const handleOpenAddFieldModal = (sectionId: string) => {
    const sec = sections.find((s) => s.id === sectionId);
    setAddFieldTargetSectionId(sectionId);
    setSelectedColumnForNewField(1);
    setIsAddFieldModalOpen(true);
  };

  // Tạo trường mới từ loại đã chọn và thêm vào state
  const handleCreateNewField = (option: FieldTypeOption) => {
    if (!addFieldTargetSectionId) return;

    const newFieldId = Date.now();
    const newField: BuilderField = {
      id: newFieldId,
      schemaAttributeId: newFieldId,
      attributeName: option.typeKey.toLowerCase(),
      fieldLabel: option.defaultLabel,
      semanticRole: option.role,
      required: false,
      hideIfEmpty: false,
      audioAction: option.audioAction,
      fontSize: 16,
      alignment: 'LEFT',
      color: '#171A2F',
      column: selectedColumnForNewField,
      sampleValue: option.sampleValue,
    };

    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === addFieldTargetSectionId) {
          return {
            ...sec,
            fields: [...sec.fields, newField],
          };
        }
        return sec;
      })
    );

    setIsAddFieldModalOpen(false);
    showToast(`Đã thêm trường "${option.name}"`);

    // Mở ngay FieldSettingsSheet để người dùng tùy chỉnh font, màu, nhãn nếu muốn
    setEditingField(newField);
    setEditingFieldSectionId(addFieldTargetSectionId);
    setIsFieldSheetOpen(true);
  };

  // Lưu chỉnh sửa cài đặt Field (phản ánh ngay lập tức nhãn, font, màu, căn lề, required, audio)
  const handleSaveFieldSettings = (updated: TemplateFieldDTO) => {
    if (!editingFieldSectionId || !editingField) return;

    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === editingFieldSectionId) {
          return {
            ...sec,
            fields: sec.fields.map((f) => {
              if (f.id === editingField.id || f.schemaAttributeId === editingField.schemaAttributeId) {
                return {
                  ...f,
                  ...updated,
                  column: f.column, // giữ nguyên cột đã bố trí
                };
              }
              return f;
            }),
          };
        }
        return sec;
      })
    );

    setIsFieldSheetOpen(false);
    setEditingField(null);
    setEditingFieldSectionId(null);
    showToast('Đã lưu thay đổi trường');
  };

  // Xóa Field
  const handleDeleteField = (fieldId: number | undefined) => {
    if (!editingFieldSectionId) return;

    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === editingFieldSectionId) {
          return {
            ...sec,
            fields: sec.fields.filter(
              (f) => f.id !== fieldId && f.schemaAttributeId !== fieldId
            ),
          };
        }
        return sec;
      })
    );

    setIsFieldSheetOpen(false);
    setEditingField(null);
    setEditingFieldSectionId(null);
    showToast('Đã xóa trường', 'info');
  };

  // Thao tác nghe thử âm thanh (Mock audio action)
  const handlePlayMockAudio = (field: BuilderField) => {
    showToast(`🔊 Đang phát: ${field.sampleValue || field.fieldLabel}`, 'info');
  };

  // ==========================================
  // LƯU BỐ CỤC THẺ HỌC & ĐIỀU HƯỚNG CHUẨN UX
  // ==========================================
  const handleSaveTemplate = async () => {
    setSaving(true);
    try {
      // 1. Lưu bản nháp vào Local Storage
      const draftKey = getStorageKey(topicId, templateId);
      saveLocalDraft(draftKey, sections);

      // 2. Chuyển đổi sections thành TemplateDTO và lưu qua templateRepository
      const generatedTemplate = buildTemplateFromSections(sections, templateId);
      await templateRepository.updateTemplate(templateId, generatedTemplate);

      showToast('Đã lưu bố cục thẻ học thành công!', 'success');

      // 3. Điều hướng thẳng về Topic Detail hoặc Collection Detail, KHÔNG quay lại form tạo
      setTimeout(() => {
        if (topicId) {
          router.replace(`/topics/${topicId}` as any);
        } else if (collectionId) {
          router.replace(`/collections/${collectionId}` as any);
        } else if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/collections' as any);
        }
      }, 500);
    } catch (err) {
      console.error('Failed to save template layout:', err);
      showToast('Có lỗi xảy ra khi lưu bố cục', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Tạo live TemplateDTO và itemValues từ state builder hiện tại phục vụ Live Preview
  const livePreviewData = useMemo(() => {
    const liveTemplate = buildTemplateFromSections(sections, templateId);
    const mockValues: Record<string | number, any> = {};

    sections.forEach((sec) => {
      sec.fields.forEach((f) => {
        mockValues[f.schemaAttributeId] = f.sampleValue || f.fieldLabel || 'Nội dung mẫu';
      });
    });

    const activeSec = sections.find((s) => s.side === previewSide);
    const activeCols = activeSec ? activeSec.columns : 1;

    return {
      template: liveTemplate,
      values: mockValues,
      columnsCount: activeCols,
    };
  }, [sections, templateId, previewSide]);

  // ==========================================
  // RENDER LOADING SKELETON
  // ==========================================
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        {/* Header Skeleton */}
        <View className="px-4 py-3 border-b border-neutral-100 flex-row items-center justify-between">
          <View className="w-10 h-10 rounded-2xl bg-neutral-100 animate-pulse" />
          <View className="items-center gap-1.5">
            <View className="w-36 h-5 rounded-md bg-neutral-200 animate-pulse" />
            <View className="w-24 h-3.5 rounded-md bg-neutral-100 animate-pulse" />
          </View>
          <View className="w-10 h-10 rounded-2xl bg-neutral-100 animate-pulse" />
        </View>

        {/* Tabs Skeleton */}
        <View className="px-4 py-3 border-b border-neutral-100 flex-row justify-between">
          <View className="flex-row gap-6">
            <View className="w-24 h-7 rounded-md bg-neutral-200 animate-pulse" />
            <View className="w-20 h-7 rounded-md bg-neutral-100 animate-pulse" />
          </View>
          <View className="w-20 h-7 rounded-xl bg-neutral-100 animate-pulse" />
        </View>

        {/* Body Canvas Skeleton */}
        <View className="p-4 gap-4">
          <View className="flex-row justify-between items-center">
            <View className="w-32 h-5 rounded-md bg-neutral-200 animate-pulse" />
            <View className="w-8 h-8 rounded-lg bg-neutral-100 animate-pulse" />
          </View>
          <View className="h-44 rounded-2xl bg-neutral-100 border border-neutral-200 animate-pulse p-4 flex-row gap-3">
            <View className="flex-1 rounded-xl bg-neutral-200/70" />
            <View className="flex-1 rounded-xl bg-neutral-200/70" />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50/60" edges={['top']}>
      {/* ========================================================
          1. TOP BAR CHUNKY
          ======================================================== */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-neutral-100 z-10">
        <Pressable
          onPress={() => {
            if (topicId) {
              router.replace(`/topics/${topicId}` as any);
            } else if (collectionId) {
              router.replace(`/collections/${collectionId}` as any);
            } else if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/collections' as any);
            }
          }}
          className="w-12 h-12 items-center justify-center rounded-2xl active:bg-neutral-100 -ml-2"
        >
          <ChevronLeftIcon size={28} color="#1E2A44" />
        </Pressable>

        <View className="flex-1 items-center px-2">
          <Text className="font-extrabold text-[17.5px] text-mascot-navy font-nunito" numberOfLines={1}>
            Bố cục thẻ từ vựng
          </Text>
          <Text className="font-medium text-[13px] text-neutral-400 font-inter mt-0.5" numberOfLines={1}>
            Chủ đề: {topicName}
          </Text>
        </View>

        <View className="w-10" />
      </View>

      {/* ========================================================
          2. THANH TAB UNDERLINED & NÚT XEM TRƯỚC COMPACT
          ======================================================== */}
      <View className="px-4 bg-white flex-row items-center justify-between border-b border-neutral-200/70">
        <View className="flex-row items-center gap-7">
          <Pressable
            onPress={() => setActiveSide('FRONT')}
            className={cn(
              'py-3 border-b-[3px] transition-all',
              activeSide === 'FRONT' ? 'border-primary-500' : 'border-transparent'
            )}
          >
            <Text
              className={cn(
                'font-extrabold text-[14.5px] font-nunito tracking-wide',
                activeSide === 'FRONT' ? 'text-primary-600' : 'text-neutral-400'
              )}
            >
              MẶT TRƯỚC
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveSide('BACK')}
            className={cn(
              'py-3 border-b-[3px] transition-all',
              activeSide === 'BACK' ? 'border-primary-500' : 'border-transparent'
            )}
          >
            <Text
              className={cn(
                'font-extrabold text-[14.5px] font-nunito tracking-wide',
                activeSide === 'BACK' ? 'text-primary-600' : 'text-neutral-400'
              )}
            >
              MẶT SAU
            </Text>
          </Pressable>
        </View>

        {/* Nút Xem trước trực tiếp */}
        <Pressable
          onPress={() => {
            setPreviewSide(activeSide);
            setIsPreviewOpen(true);
          }}
          className="flex-row items-center gap-1.5 py-1.5 px-3 rounded-xl bg-neutral-100 active:bg-neutral-200"
        >
          <EyeIcon size={15} color="#58CC02" />
          <Text className="font-bold text-[13px] text-neutral-700 font-nunito">
            Xem trước
          </Text>
        </Pressable>
      </View>

      {/* ========================================================
          3. MAIN CANVAS BUILDER (DANH SÁCH SECTION ĐỘNG)
          ======================================================== */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {currentSections.length === 0 ? (
          /* Trạng thái trống khi chưa có section nào */
          <View className="bg-white rounded-2xl p-8 items-center justify-center border border-neutral-200 mb-4">
            <Text className="text-[16px] font-extrabold text-mascot-navy font-nunito mb-1">
              Chưa có phần hiển thị nào
            </Text>
            <Text className="text-[13.5px] font-medium text-neutral-400 font-inter text-center mb-4">
              Hãy thêm phần mới để bắt đầu bố trí các trường thông tin cho {activeSide === 'FRONT' ? 'mặt trước' : 'mặt sau'} nhé!
            </Text>
            <Pressable
              onPress={handleAddSection}
              className="px-4 py-2.5 bg-primary-500 rounded-xl border-b-[3px] border-primary-700 flex-row items-center gap-1.5"
            >
              <PlusIcon size={16} color="#ffffff" strokeWidth={2.5} />
              <Text className="text-[13px] font-extrabold text-white font-nunito uppercase">
                Thêm phần mới
              </Text>
            </Pressable>
          </View>
        ) : (
          /* Danh sách các Section động trên Canvas */
          currentSections.map((sec) => {
            const col1Fields = sec.fields.filter((f) => f.column === 1);
            const col2Fields = sec.fields.filter((f) => f.column === 2);

            return (
              <View key={sec.id} className="mb-5">
                {/* Header Section */}
                <View className="flex-row items-center justify-between mb-2.5 px-1">
                  <View className="flex-row items-center gap-2 flex-1 pr-2">
                    <GripVerticalIcon size={20} color="#9597AD" />
                    <View className="flex-1">
                      <Text className="font-extrabold text-[16.5px] text-mascot-navy font-nunito" numberOfLines={1}>
                        {sec.name}
                      </Text>
                      <Text className="text-[12.5px] font-medium text-neutral-400 font-inter mt-0.5">
                        {sec.columns === 2 ? '2 cột · 50% / 50%' : '1 cột · 100%'}
                        {sec.repeatable ? ' · Lặp lại (1-n)' : ''}
                      </Text>
                    </View>
                  </View>

                  {/* Nút mở cài đặt Section */}
                  <Pressable
                    onPress={() => {
                      setActiveSectionId(sec.id);
                      setIsSectionSheetOpen(true);
                    }}
                    className="w-9 h-9 rounded-xl bg-white border border-neutral-200/80 items-center justify-center active:bg-neutral-100"
                  >
                    <SettingsIcon size={17} color="#757793" />
                  </Pressable>
                </View>

                {/* Canvas thẻ Flashcard duy nhất */}
                <View
                  className="bg-white rounded-2xl p-4 border border-neutral-200/80 border-b-[3px] border-b-neutral-300/80"
                  style={SOFT_CARD_SHADOW}
                >
                  {sec.columns === 1 ? (
                    /* 1 CỘT (100% CHIỀU RỘNG) */
                    <View className="gap-2.5">
                      {col1Fields.length === 0 ? (
                        <View className="py-6 items-center justify-center border border-dashed border-neutral-200 rounded-xl">
                          <Text className="text-[13px] font-medium text-neutral-400 font-inter">
                            Chưa có trường nào trong phần này
                          </Text>
                        </View>
                      ) : (
                        col1Fields.map((field) => (
                          <Pressable
                            key={field.id}
                            onPress={() => {
                              setEditingField(field);
                              setEditingFieldSectionId(sec.id);
                              setIsFieldSheetOpen(true);
                            }}
                            className="bg-neutral-50/80 rounded-xl p-3.5 border border-neutral-200 active:bg-neutral-100 flex-row items-center justify-between transition-all"
                          >
                            <View className="flex-row items-center gap-2.5 flex-1 pr-2">
                              <GripVerticalIcon size={18} color="#9597AD" />
                              <View className="flex-1 min-w-0">
                                <View className="flex-row items-center gap-2 flex-wrap">
                                  <Text
                                    style={{
                                      fontSize: field.fontSize || 16,
                                      color: field.color || '#171A2F',
                                      textAlign: (field.alignment?.toLowerCase() as any) || 'left',
                                    }}
                                    className="font-extrabold font-nunito"
                                  >
                                    {field.fieldLabel || field.attributeName || 'Trường mới'}
                                  </Text>

                                  {field.required && (
                                    <View className="bg-danger-50 px-1.5 py-0.5 rounded border border-danger-200">
                                      <Text className="text-[11px] font-bold text-danger-600 font-inter">
                                        Bắt buộc
                                      </Text>
                                    </View>
                                  )}

                                  {field.hideIfEmpty && (
                                    <View className="bg-neutral-100 px-1.5 py-0.5 rounded">
                                      <Text className="text-[11px] font-medium text-neutral-500 font-inter">
                                        Ẩn khi trống
                                      </Text>
                                    </View>
                                  )}
                                </View>

                                {field.sampleValue && (
                                  <Text className="text-[13px] text-neutral-400 font-inter mt-0.5" numberOfLines={1}>
                                    Ví dụ: {field.sampleValue}
                                  </Text>
                                )}
                              </View>
                            </View>

                            <View className="flex-row items-center gap-2">
                              {(field.audioAction || field.semanticRole === 'AUDIO') && (
                                <Pressable
                                  onPress={(e) => {
                                    e.stopPropagation();
                                    handlePlayMockAudio(field);
                                  }}
                                  className="w-8 h-8 rounded-lg bg-info-50 border border-info-200 items-center justify-center active:bg-info-100"
                                >
                                  <Volume2Icon size={15} color="#1CB0F6" />
                                </Pressable>
                              )}
                              <MoreVerticalIcon size={18} color="#9597AD" />
                            </View>
                          </Pressable>
                        ))
                      )}
                    </View>
                  ) : (
                    /* 2 CỘT (50% / 50%) */
                    <View className="flex-row items-start gap-2.5">
                      {/* CỘT 1 */}
                      <View className="flex-1 min-w-0">
                        <Text className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-inter mb-1.5 px-0.5">
                          CỘT 1 (50%)
                        </Text>
                        <View className="gap-2">
                          {col1Fields.length === 0 ? (
                            <View className="py-4 items-center justify-center border border-dashed border-neutral-200 rounded-xl">
                              <Text className="text-[11.5px] font-medium text-neutral-400 font-inter">
                                Trống
                              </Text>
                            </View>
                          ) : (
                            col1Fields.map((field) => (
                              <Pressable
                                key={field.id}
                                onPress={() => {
                                  setEditingField(field);
                                  setEditingFieldSectionId(sec.id);
                                  setIsFieldSheetOpen(true);
                                }}
                                className="bg-neutral-50/80 rounded-xl p-3 border border-neutral-200 active:bg-neutral-100 transition-all"
                              >
                                <View className="flex-row items-center justify-between mb-1">
                                  <Text
                                    style={{
                                      fontSize: Math.min(15, field.fontSize || 14),
                                      color: field.color || '#171A2F',
                                    }}
                                    className="font-extrabold font-nunito flex-1 pr-1"
                                    numberOfLines={1}
                                  >
                                    {field.fieldLabel || 'Trường 1'}
                                  </Text>
                                  <MoreVerticalIcon size={15} color="#9597AD" />
                                </View>
                                <View className="flex-row items-center gap-1.5 mt-0.5">
                                  {field.required ? (
                                    <Text className="text-[11px] font-bold text-danger-500 font-inter">
                                      Bắt buộc
                                    </Text>
                                  ) : (
                                    <Text className="text-[11px] font-medium text-neutral-400 font-inter">
                                      Tùy chọn
                                    </Text>
                                  )}
                                  {field.audioAction && (
                                    <Pressable
                                      onPress={(e) => {
                                        e.stopPropagation();
                                        handlePlayMockAudio(field);
                                      }}
                                    >
                                      <Volume2Icon size={12} color="#1CB0F6" />
                                    </Pressable>
                                  )}
                                </View>
                              </Pressable>
                            ))
                          )}
                        </View>
                      </View>

                      {/* CỘT 2 */}
                      <View className="flex-1 min-w-0">
                        <Text className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-inter mb-1.5 px-0.5">
                          CỘT 2 (50%)
                        </Text>
                        <View className="gap-2">
                          {col2Fields.length === 0 ? (
                            <View className="py-4 items-center justify-center border border-dashed border-neutral-200 rounded-xl">
                              <Text className="text-[11.5px] font-medium text-neutral-400 font-inter">
                                Trống
                              </Text>
                            </View>
                          ) : (
                            col2Fields.map((field) => (
                              <Pressable
                                key={field.id}
                                onPress={() => {
                                  setEditingField(field);
                                  setEditingFieldSectionId(sec.id);
                                  setIsFieldSheetOpen(true);
                                }}
                                className="bg-neutral-50/80 rounded-xl p-3 border border-neutral-200 active:bg-neutral-100 transition-all"
                              >
                                <View className="flex-row items-center justify-between mb-1">
                                  <Text
                                    style={{
                                      fontSize: Math.min(15, field.fontSize || 14),
                                      color: field.color || '#171A2F',
                                    }}
                                    className="font-extrabold font-nunito flex-1 pr-1"
                                    numberOfLines={1}
                                  >
                                    {field.fieldLabel || 'Trường 2'}
                                  </Text>
                                  <MoreVerticalIcon size={15} color="#9597AD" />
                                </View>
                                <View className="flex-row items-center gap-1.5 mt-0.5">
                                  {field.required ? (
                                    <Text className="text-[11px] font-bold text-danger-500 font-inter">
                                      Bắt buộc
                                    </Text>
                                  ) : (
                                    <Text className="text-[11px] font-medium text-neutral-400 font-inter">
                                      Tùy chọn
                                    </Text>
                                  )}
                                  {field.audioAction && (
                                    <Pressable
                                      onPress={(e) => {
                                        e.stopPropagation();
                                        handlePlayMockAudio(field);
                                      }}
                                    >
                                      <Volume2Icon size={12} color="#1CB0F6" />
                                    </Pressable>
                                  )}
                                </View>
                              </Pressable>
                            ))
                          )}
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Nút Thêm trường vào Section */}
                  <Pressable
                    onPress={() => handleOpenAddFieldModal(sec.id)}
                    className="w-full py-2.5 items-center justify-center flex-row gap-1.5 active:opacity-70 mt-3 border-t border-neutral-100"
                  >
                    <PlusIcon size={15} color="#58CC02" strokeWidth={2.5} />
                    <Text className="font-bold text-[13.5px] text-primary-600 font-nunito">
                      Thêm trường vào phần này
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}

        {/* NÚT THÊM PHẦN MỚI */}
        <Pressable
          onPress={handleAddSection}
          className="w-full py-3.5 rounded-2xl border-2 border-dashed border-neutral-300 bg-white/60 items-center justify-center flex-row gap-2 active:bg-white transition-all mt-2"
        >
          <PlusIcon size={16} color="#757793" strokeWidth={2.5} />
          <Text className="font-bold text-[14px] text-neutral-500 font-nunito">
            Thêm phần mới ({activeSide === 'FRONT' ? 'Mặt trước' : 'Mặt sau'})
          </Text>
        </Pressable>
      </ScrollView>

      {/* ========================================================
          4. STICKY BOTTOM BAR: NÚT LƯU BỐ CỤC THẺ HỌC
          ======================================================== */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-100 shadow-xl z-20">
        <Pressable
          onPress={handleSaveTemplate}
          disabled={saving}
          className="w-full h-13 bg-primary-500 border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] rounded-2xl items-center justify-center flex-row shadow-sm"
        >
          {saving ? (
            <View className="flex-row items-center gap-2">
              <ActivityIndicator size="small" color="#ffffff" />
              <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-[0.04em]">
                ĐANG LƯU BỐ CỤC...
              </Text>
            </View>
          ) : (
            <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-[0.04em]">
              LƯU BỐ CỤC THẺ HỌC
            </Text>
          )}
        </Pressable>
      </View>

      {/* ========================================================
          5. TOAST FEEDBACK NOTIFICATION
          ======================================================== */}
      {toastMessage && (
        <View className="absolute top-16 left-5 right-5 z-50 items-center">
          <View
            className={cn(
              'px-4 py-2.5 rounded-2xl flex-row items-center gap-2 shadow-lg border',
              toastMessage.type === 'success' && 'bg-primary-500 border-primary-600',
              toastMessage.type === 'info' && 'bg-mascot-navy border-neutral-700',
              toastMessage.type === 'error' && 'bg-danger-500 border-danger-600'
            )}
          >
            <CheckIcon size={16} color="#ffffff" strokeWidth={3} />
            <Text className="text-[13.5px] font-bold text-white font-nunito">
              {toastMessage.text}
            </Text>
          </View>
        </View>
      )}

      {/* ========================================================
          6. MODAL CHỌN LOẠI TRƯỜNG KHI THÊM TRƯỜNG MỚI
          ======================================================== */}
      <Modal
        visible={isAddFieldModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAddFieldModalOpen(false)}
      >
        <Pressable
          onPress={() => setIsAddFieldModalOpen(false)}
          className="flex-1 bg-black/40 justify-end"
        >
          <View className="bg-white rounded-t-[28px] p-5 pb-8 max-w-lg mx-auto w-full shadow-2xl">
            {/* Header */}
            <View className="flex-row items-center justify-between pb-3 mb-3 border-b border-neutral-100">
              <View>
                <Text className="font-extrabold text-[17px] text-mascot-navy font-nunito">
                  Chọn loại trường cần thêm
                </Text>
                <Text className="text-[12.5px] font-medium text-neutral-400 font-inter">
                  Chọn trường dữ liệu mẫu để bố trí vào thẻ học
                </Text>
              </View>
              <Pressable
                onPress={() => setIsAddFieldModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center"
              >
                <XIcon size={16} color="#757793" />
              </Pressable>
            </View>

            {/* Chọn Cột nếu Section hiện tại có 2 Cột */}
            {(() => {
              const sec = sections.find((s) => s.id === addFieldTargetSectionId);
              if (sec && sec.columns === 2) {
                return (
                  <View className="mb-3.5 bg-neutral-50 p-2 rounded-xl border border-neutral-200/80">
                    <Text className="text-[12px] font-bold text-neutral-500 font-inter mb-1.5 px-1">
                      Bố trí vào cột:
                    </Text>
                    <View className="flex-row gap-2">
                      <Pressable
                        onPress={() => setSelectedColumnForNewField(1)}
                        className={cn(
                          'flex-1 py-2 rounded-lg items-center border',
                          selectedColumnForNewField === 1
                            ? 'bg-primary-500 border-primary-600'
                            : 'bg-white border-neutral-200'
                        )}
                      >
                        <Text
                          className={cn(
                            'text-[13px] font-extrabold font-nunito',
                            selectedColumnForNewField === 1 ? 'text-white' : 'text-neutral-600'
                          )}
                        >
                          Cột 1 (Bên trái)
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => setSelectedColumnForNewField(2)}
                        className={cn(
                          'flex-1 py-2 rounded-lg items-center border',
                          selectedColumnForNewField === 2
                            ? 'bg-primary-500 border-primary-600'
                            : 'bg-white border-neutral-200'
                        )}
                      >
                        <Text
                          className={cn(
                            'text-[13px] font-extrabold font-nunito',
                            selectedColumnForNewField === 2 ? 'text-white' : 'text-neutral-600'
                          )}
                        >
                          Cột 2 (Bên phải)
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                );
              }
              return null;
            })()}

            {/* Danh sách các loại trường */}
            <ScrollView className="max-h-72" showsVerticalScrollIndicator={false}>
              <View className="gap-2">
                {FIELD_TYPES.map((type) => (
                  <Pressable
                    key={type.typeKey}
                    onPress={() => handleCreateNewField(type)}
                    className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 active:bg-primary-50 active:border-primary-300 flex-row items-center gap-3 transition-all"
                  >
                    <View className="w-10 h-10 rounded-xl bg-white border border-neutral-200 items-center justify-center">
                      <Text className="text-[18px]">{type.icon}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-extrabold text-[14.5px] text-mascot-navy font-nunito">
                        {type.name}
                      </Text>
                      <Text className="text-[12px] font-medium text-neutral-400 font-inter">
                        {type.description}
                      </Text>
                    </View>
                    <PlusIcon size={16} color="#58CC02" strokeWidth={2.5} />
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* ========================================================
          7. FIELD SETTINGS BOTTOM SHEET
          ======================================================== */}
      <FieldSettingsSheet
        visible={isFieldSheetOpen}
        field={editingField}
        onClose={() => {
          setIsFieldSheetOpen(false);
          setEditingField(null);
          setEditingFieldSectionId(null);
        }}
        onSave={handleSaveFieldSettings}
        onDelete={handleDeleteField}
      />

      {/* ========================================================
          8. SECTION SETTINGS BOTTOM SHEET
          ======================================================== */}
      <SectionSettingsSheet
        visible={isSectionSheetOpen}
        sectionName={activeSection?.name || ''}
        repeatable={activeSection?.repeatable || false}
        columnsCount={activeSection?.columns || 1}
        onClose={() => setIsSectionSheetOpen(false)}
        onSave={handleSaveSectionSettings}
        onDelete={handleDeleteSection}
      />

      {/* ========================================================
          9. LIVE PREVIEW MODAL (RENDER TRỰC TIẾP TỪ STATE BUILDER)
          ======================================================== */}
      <Modal
        visible={isPreviewOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPreviewOpen(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center p-4">
          <View className="bg-white w-full max-w-[360px] rounded-[32px] p-5 border-2 border-neutral-200 border-b-[4px] items-center shadow-2xl">
            <View className="flex-row items-center justify-between w-full mb-3">
              <View className="flex-row items-center gap-2">
                <EyeIcon size={20} color="#58CC02" />
                <Text className="font-extrabold text-[17.5px] text-mascot-navy font-nunito">
                  Xem trước trực tiếp
                </Text>
              </View>
              <Pressable
                onPress={() => setIsPreviewOpen(false)}
                className="w-9 h-9 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200"
              >
                <XIcon size={18} color="#757793" />
              </Pressable>
            </View>

            <Text className="text-[12px] font-medium text-neutral-400 font-inter mb-3 text-center">
              Mô phỏng chính xác giao diện Flashcard khi học
            </Text>

            {/* BỘ CHUYỂN MẶT TRƯỚC / SAU TRONG PREVIEW */}
            <View className="flex-row p-1 bg-neutral-100 rounded-2xl mb-4 w-full border border-neutral-200">
              <Pressable
                onPress={() => setPreviewSide('FRONT')}
                className={cn(
                  'flex-1 h-9 rounded-xl items-center justify-center transition-all',
                  previewSide === 'FRONT'
                    ? 'bg-white border-2 border-neutral-200 border-b-[3px]'
                    : ''
                )}
              >
                <Text
                  className={cn(
                    'font-extrabold text-[13.5px] font-nunito',
                    previewSide === 'FRONT' ? 'text-mascot-navy' : 'text-neutral-500'
                  )}
                >
                  Mặt trước
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setPreviewSide('BACK')}
                className={cn(
                  'flex-1 h-9 rounded-xl items-center justify-center transition-all',
                  previewSide === 'BACK'
                    ? 'bg-white border-2 border-neutral-200 border-b-[3px]'
                    : ''
                )}
              >
                <Text
                  className={cn(
                    'font-extrabold text-[13.5px] font-nunito',
                    previewSide === 'BACK' ? 'text-mascot-navy' : 'text-neutral-500'
                  )}
                >
                  Mặt sau
                </Text>
              </Pressable>
            </View>

            {/* THẺ FLASHCARD SIMULATOR TỪ CHÍNH STATE DYNAMIC BUILDER */}
            <View className="w-full bg-white rounded-2xl py-5 px-4 border-2 border-neutral-200 border-b-[4px] min-h-[190px] items-center justify-center mb-5">
              <DynamicCardRenderer
                template={livePreviewData.template}
                itemValues={livePreviewData.values}
                side={previewSide}
                columnsCount={livePreviewData.columnsCount}
                onPlayAudio={(val) => showToast(`🔊 Phát: ${val}`, 'info')}
              />
            </View>

            <Pressable
              onPress={() => setIsPreviewOpen(false)}
              className="w-full h-11 bg-neutral-100 border-2 border-neutral-200 border-b-[3px] rounded-xl items-center justify-center active:translate-y-[1px] active:border-b-[2px]"
            >
              <Text className="font-extrabold text-[13.5px] text-neutral-700 font-nunito uppercase tracking-[0.04em]">
                ĐÓNG XEM TRƯỚC
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
