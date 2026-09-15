import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  CameraIcon,
  PlayIcon,
  MoreVerticalIcon,
  Edit3Icon,
  Trash2Icon,
  AlertTriangleIcon,
  XIcon,
  FolderIcon,
  SparklesIcon,
  ClockIcon,
} from 'lucide-react-native';
import { collectionRepository, CollectionSummaryUI } from '@/lib/repositories/collection.repository';
import { topicRepository } from '@/lib/repositories/topic.repository';
import { TopicDTO } from '@/lib/topic-eav';
import { Snapy } from '@/components/Snapy';
import { cn } from '@/lib/utils';

// ==========================================
// TOKENS & SHADOW STYLES
// ==========================================
const SOFT_CARD_SHADOW = Platform.select({
  web: {
    boxShadow: '0 3px 10px rgba(15, 23, 42, 0.05)',
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
// THEME & EMOJI HELPERS (GAMIFIED VISUAL)
// ==========================================
const TOPIC_THEMES = [
  { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
  { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700' },
];

function getTopicVisual(name: string, id: number) {
  const lower = (name || '').toLowerCase();
  if (lower.includes('airport') || lower.includes('flight') || lower.includes('bay')) {
    return { emoji: '✈️', themeIndex: 1 };
  }
  if (lower.includes('hotel') || lower.includes('khách sạn') || lower.includes('nghỉ')) {
    return { emoji: '🏨', themeIndex: 0 };
  }
  if (lower.includes('restaurant') || lower.includes('dining') || lower.includes('ăn') || lower.includes('món')) {
    return { emoji: '🍽️', themeIndex: 2 };
  }
  if (lower.includes('job') || lower.includes('work') || lower.includes('business') || lower.includes('công sở') || lower.includes('việc')) {
    return { emoji: '💼', themeIndex: 3 };
  }
  if (lower.includes('tech') || lower.includes('ai') || lower.includes('công nghệ') || lower.includes('code')) {
    return { emoji: '💻', themeIndex: 5 };
  }
  if (lower.includes('animal') || lower.includes('thú') || lower.includes('động vật')) {
    return { emoji: '🦁', themeIndex: 2 };
  }
  if (lower.includes('coffee') || lower.includes('cà phê')) {
    return { emoji: '☕', themeIndex: 2 };
  }
  if (lower.includes('daily') || lower.includes('đời sống') || lower.includes('thường')) {
    return { emoji: '☀️', themeIndex: 0 };
  }
  if (lower.includes('travel') || lower.includes('du lịch') || lower.includes('khám phá')) {
    return { emoji: '🌍', themeIndex: 1 };
  }

  const themeIndex = Math.abs(id || 0) % TOPIC_THEMES.length;
  return { emoji: '📚', themeIndex };
}

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams();
  const collectionId = Number(id);

  const [collection, setCollection] = useState<CollectionSummaryUI | null>(null);
  const [topics, setTopics] = useState<TopicDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ==========================================
  // MODAL & MENU STATES
  // ==========================================
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  // Edit Collection Form
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editTranslation, setEditTranslation] = useState('');
  const [updating, setUpdating] = useState(false);

  // Delete Collection Confirm
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!collectionId) return;
    try {
      const [colData, topicList] = await Promise.all([
        collectionRepository.getCollectionById(collectionId),
        topicRepository.getTopicsByCollection(collectionId),
      ]);
      setCollection(colData);
      setTopics(topicList);
    } catch (err) {
      console.error('Failed to load collection details:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [collectionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Open edit modal with current values
  const handleOpenEdit = () => {
    setIsActionMenuOpen(false);
    setEditName(collection?.name || '');
    setEditTranslation(collection?.translation || '');
    setIsEditModalOpen(true);
  };

  // Save edited collection
  const handleSaveEdit = async () => {
    if (!editName.trim() || !collectionId || updating) return;
    setUpdating(true);
    try {
      const updated = await collectionRepository.updateCollection(collectionId, {
        name: editName.trim(),
        translation: editTranslation.trim() || undefined,
      });
      if (updated) {
        setCollection(updated);
      } else if (collection) {
        setCollection({
          ...collection,
          name: editName.trim(),
          translation: editTranslation.trim() || undefined,
        });
      }
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to update collection:', err);
    } finally {
      setUpdating(false);
    }
  };

  // Open delete confirm
  const handleOpenDelete = () => {
    setIsActionMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete collection
  const handleConfirmDelete = async () => {
    if (!collectionId || deleting) return;
    setDeleting(true);
    try {
      await collectionRepository.deleteCollection(collectionId);
      setIsDeleteModalOpen(false);
      router.replace('/collections' as any);
    } catch (err) {
      console.error('Failed to delete collection:', err);
      setDeleting(false);
    }
  };

  const totalWords = (topics as any[]).reduce((sum, t) => sum + (t.wordCount || 0), 0);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* ========================================================
          1. TOP HEADER (CÓ NÚT MORE QUẢN LÝ BỘ SƯU TẬP)
          ======================================================== */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-neutral-100 z-10">
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/collections' as any))}
          className="w-12 h-12 items-center justify-center rounded-2xl active:bg-neutral-100 -ml-2"
        >
          <ChevronLeftIcon size={28} color="#1E2A44" />
        </Pressable>

        <View className="flex-1 items-center px-2">
          <Text
            className="font-extrabold text-[18px] text-mascot-navy font-nunito"
            numberOfLines={1}
          >
            {collection?.name || 'Chi tiết Bộ sưu tập'}
          </Text>
          <Text className="font-semibold text-[13px] text-neutral-500 font-inter mt-0.5">
            {topics.length} chủ đề · {totalWords} từ vựng
          </Text>
        </View>

        {/* Nút 3 chấm mở tùy chọn quản lý bộ sưu tập */}
        <Pressable
          onPress={() => setIsActionMenuOpen(true)}
          className="w-12 h-12 items-center justify-center rounded-2xl active:bg-neutral-100 -mr-2"
        >
          <MoreVerticalIcon size={22} color="#1E2A44" />
        </Pressable>
      </View>

      {/* ========================================================
          2. NỘI DUNG CUỘN (SCROLLVIEW)
          ======================================================== */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#58CC02" />
        }
      >
        {loading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#58CC02" />
            <Text className="font-semibold text-[14px] text-neutral-500 font-inter mt-3">
              Đang tải thông tin chủ đề...
            </Text>
          </View>
        ) : topics.length === 0 ? (
          /* ========================================================
             EMPTY STATE CHUNKY VỚI LINH VẬT CÁO SNAPVOCAB
             ======================================================== */
          <View className="bg-white rounded-2xl p-7 items-center justify-center border-2 border-neutral-100 border-b-[4px] mt-2">
            <Snapy pose="chao_mung" animation="wave" className="w-32 h-32 mb-4" />

            <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2 text-center">
              Bộ sưu tập này chưa có chủ đề
            </Text>
            <Text className="font-medium text-[15px] text-neutral-500 font-inter text-center mb-7 px-2 leading-6">
              Hãy tạo chủ đề đầu tiên để bắt đầu lưu từ vựng hoặc dùng camera quét nhanh tài liệu nhé!
            </Text>

            {/* ACTION 1: "+ TẠO CHỦ ĐỀ ĐẦU TIÊN" (PRIMARY CTA CHUNKY) */}
            <Pressable
              onPress={() => router.push(`/topics/create?collectionId=${collectionId}` as any)}
              className="w-full h-13 bg-primary-500 border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] rounded-2xl items-center justify-center flex-row gap-2 mb-3.5 transition-all"
            >
              <PlusIcon size={20} color="#ffffff" strokeWidth={3} />
              <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-[0.04em]">
                TẠO CHỦ ĐỀ ĐẦU TIÊN
              </Text>
            </Pressable>

            {/* ACTION 2: "📷 QUÉT TỪ VỰNG BẰNG CAMERA" (SECONDARY CHUNKY) */}
            <Pressable
              onPress={() => router.push('/(tabs)/scan' as any)}
              className="w-full h-13 bg-white border-2 border-neutral-200 border-b-[4px] active:translate-y-[2px] active:border-b-[2px] rounded-2xl items-center justify-center flex-row gap-2 transition-all"
            >
              <CameraIcon size={20} color="#FF8A00" />
              <Text className="font-extrabold text-[15px] text-mascot-navy uppercase font-nunito tracking-[0.04em]">
                Quét từ vựng bằng Camera
              </Text>
            </Pressable>
          </View>
        ) : (
          /* ========================================================
             POPULATED STATE: DANH SÁCH CÁC CHỦ ĐỀ
             ======================================================== */
          <View className="gap-3">
            <View className="flex-row items-center justify-between mb-1 px-1">
              <View className="flex-row items-center gap-2">
                <Text className="font-extrabold text-[17px] text-mascot-navy font-nunito">
                  Danh sách chủ đề
                </Text>
                <View className="bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-200">
                  <Text className="font-extrabold text-[12px] text-primary-700 font-nunito">
                    {topics.length}
                  </Text>
                </View>
              </View>
            </View>

            {topics.map((topic) => {
              const wordCount = (topic as any).wordCount || 0;
              const rawProgress = (topic as any).progress ?? 0;
              const progress = Math.min(Math.max(rawProgress, 0), 100);
              const masteredCount = Math.round((wordCount * progress) / 100);
              const dueCount = (topic as any).srsDue ?? Math.max(0, Math.round(wordCount * 0.3));

              const visual = getTopicVisual(topic.name, topic.id);
              const theme = TOPIC_THEMES[visual.themeIndex];

              /* ====================================================
                 CASE A: EMPTY TOPIC (wordCount === 0)
                 Layout siêu gọn (~105px), KHÔNG CÓ PROGRESS BAR VÔ NGHĨA
                 ==================================================== */
              if (wordCount === 0) {
                return (
                  <Pressable
                    key={topic.id}
                    onPress={() => router.push(`/topics/${topic.id}` as any)}
                    className="bg-white rounded-2xl p-4 border border-neutral-200/80 border-b-[3px] border-b-neutral-300/80 active:translate-y-[1px] active:border-b-[2px] transition-all"
                    style={SOFT_CARD_SHADOW}
                  >
                    {/* Hàng 1: Icon sinh động + Tên + Chưa có từ nào + Mũi tên */}
                    <View className="flex-row items-center gap-3 mb-2.5">
                      <View className={cn('w-11 h-11 rounded-2xl items-center justify-center border shrink-0', theme.bg, theme.border)}>
                        <Text className="text-[21px]">{visual.emoji}</Text>
                      </View>

                      <View className="flex-1 min-w-0 pr-1">
                        <View className="flex-row items-center justify-between">
                          <Text
                            className="font-extrabold text-[16px] text-mascot-navy font-nunito flex-1 pr-2"
                            numberOfLines={1}
                          >
                            {topic.name}
                          </Text>
                          <ChevronRightIcon size={18} color="#9597AD" />
                        </View>
                        <Text className="font-medium text-[13px] text-neutral-400 font-inter mt-0.5" numberOfLines={1}>
                          Chưa có từ nào{topic.translation ? ` · ${topic.translation}` : ''}
                        </Text>
                      </View>
                    </View>

                    {/* Hàng 2: Thông điệp khích lệ + Nút "+ Thêm từ" compact */}
                    <View className="flex-row items-center justify-between pt-1">
                      <Text className="text-[12.5px] font-medium text-neutral-400 font-inter flex-1 pr-2" numberOfLines={1}>
                        Thêm từ đầu tiên để bắt đầu học
                      </Text>

                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          router.push(`/topics/${topic.id}` as any);
                        }}
                        className="flex-row items-center gap-1 bg-primary-50 border border-primary-200 border-b-[2px] border-b-primary-300 px-3 py-1.5 rounded-xl active:translate-y-[1px] active:border-b-0"
                      >
                        <PlusIcon size={14} color="#58CC02" strokeWidth={3} />
                        <Text className="font-extrabold text-[12.5px] text-primary-700 font-nunito">
                          + Thêm từ
                        </Text>
                      </Pressable>
                    </View>
                  </Pressable>
                );
              }

              /* ====================================================
                 CASE B: POPULATED TOPIC (wordCount > 0)
                 Layout chuẩn Gamification (~120px) với metrics học tập
                 ==================================================== */
              return (
                <Pressable
                  key={topic.id}
                  onPress={() => router.push(`/topics/${topic.id}` as any)}
                  className="bg-white rounded-2xl p-4 border border-neutral-200/80 border-b-[3px] border-b-neutral-300/80 active:translate-y-[1px] active:border-b-[2px] transition-all"
                  style={SOFT_CARD_SHADOW}
                >
                  {/* Hàng 1: Icon + Tên + Số từ + Mũi tên */}
                  <View className="flex-row items-center gap-3 mb-2.5">
                    <View className={cn('w-11 h-11 rounded-2xl items-center justify-center border shrink-0', theme.bg, theme.border)}>
                      <Text className="text-[21px]">{visual.emoji}</Text>
                    </View>

                    <View className="flex-1 min-w-0 pr-1">
                      <View className="flex-row items-center justify-between">
                        <Text
                          className="font-extrabold text-[16px] text-mascot-navy font-nunito flex-1 pr-2"
                          numberOfLines={1}
                        >
                          {topic.name}
                        </Text>
                        <ChevronRightIcon size={18} color="#9597AD" />
                      </View>
                      <Text className="font-semibold text-[13px] text-neutral-400 font-inter mt-0.5" numberOfLines={1}>
                        {wordCount} từ{topic.translation ? ` · ${topic.translation}` : ''}
                      </Text>
                    </View>
                  </View>

                  {/* Hàng 2: Thanh tiến độ học tập (Progress Bar) */}
                  <View className="mb-2.5">
                    <View className="flex-row items-center justify-between mb-1.5">
                      <Text className="text-[12px] font-semibold text-neutral-400 font-inter">
                        Tiến độ học
                      </Text>
                      <Text className="text-[12.5px] font-extrabold text-mascot-navy font-nunito">
                        <Text className="text-primary-600">{masteredCount}</Text>/{wordCount}
                      </Text>
                    </View>
                    <View className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-primary-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </View>
                  </View>

                  {/* Hàng 3: Metric học tập (Cần ôn / Sẵn sàng) + Nút "HỌC NGAY" */}
                  <View className="flex-row items-center justify-between pt-1">
                    <View className="flex-row items-center gap-1.5 flex-1 pr-2">
                      {dueCount > 0 ? (
                        <>
                          <ClockIcon size={14} color="#FF8A00" />
                          <Text className="text-[12.5px] font-bold text-amber-600 font-inter">
                            {dueCount} từ cần ôn
                          </Text>
                        </>
                      ) : (
                        <>
                          <SparklesIcon size={14} color="#58CC02" />
                          <Text className="text-[12.5px] font-semibold text-neutral-500 font-inter">
                            {progress === 100 ? 'Đã thành thạo' : 'Sẵn sàng học tiếp'}
                          </Text>
                        </>
                      )}
                    </View>

                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        router.push(`/study?topicId=${topic.id}` as any);
                      }}
                      className="flex-row items-center gap-1.5 bg-primary-500 border-b-[3px] border-primary-700 px-3.5 py-1.5 rounded-xl active:translate-y-[1px] active:border-b-[1px]"
                    >
                      <PlayIcon size={12} color="#ffffff" fill="#ffffff" />
                      <Text className="font-extrabold text-[13px] text-white uppercase font-nunito tracking-wide">
                        HỌC NGAY
                      </Text>
                    </Pressable>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* ========================================================
          3. FLOATING ACTION: NÚT THÊM CHỦ ĐỀ MỚI GHIM ĐÁY DUY NHẤT
          ======================================================== */}
      {topics.length > 0 && (
        <View className="absolute bottom-6 right-4 left-4 z-20 items-center">
          <Pressable
            onPress={() => router.push(`/topics/create?collectionId=${collectionId}` as any)}
            className="w-full h-13 bg-primary-500 border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] rounded-2xl flex-row items-center justify-center gap-2 transition-all shadow-sm"
          >
            <PlusIcon size={20} color="#ffffff" strokeWidth={3} />
            <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-[0.04em]">
              THÊM CHỦ ĐỀ MỚI
            </Text>
          </Pressable>
        </View>
      )}

      {/* ========================================================
          4. ACTION SHEET QUẢN LÝ BỘ SƯU TẬP (3 CHẤM)
          ======================================================== */}
      <Modal
        visible={isActionMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsActionMenuOpen(false)}
      >
        <Pressable
          onPress={() => setIsActionMenuOpen(false)}
          className="flex-1 bg-black/40 justify-end"
        >
          <View className="bg-white rounded-t-[28px] p-5 pb-8 border-t border-neutral-200 max-w-lg mx-auto w-full shadow-2xl">
            {/* Header của Action Sheet */}
            <View className="flex-row items-center gap-3 pb-3 mb-2 border-b border-neutral-100">
              <View className="w-10 h-10 rounded-xl bg-primary-50 items-center justify-center border border-primary-100">
                <FolderIcon size={20} color="#58CC02" />
              </View>
              <View className="flex-1 pr-2">
                <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito" numberOfLines={1}>
                  {collection?.name}
                </Text>
                <Text className="font-medium text-[12px] text-neutral-400 font-inter">
                  Tùy chọn quản lý bộ sưu tập
                </Text>
              </View>
              <Pressable
                onPress={() => setIsActionMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200"
              >
                <XIcon size={16} color="#757793" />
              </Pressable>
            </View>

            {/* Các tùy chọn */}
            <View className="gap-2 mt-1">
              <Pressable
                onPress={handleOpenEdit}
                className="flex-row items-center gap-3 p-3.5 rounded-xl active:bg-neutral-50"
              >
                <View className="w-9 h-9 rounded-lg bg-info-50 items-center justify-center border border-info-100">
                  <Edit3Icon size={18} color="#0284C7" />
                </View>
                <View>
                  <Text className="font-bold text-[14.5px] text-mascot-navy font-inter">
                    Chỉnh sửa bộ sưu tập
                  </Text>
                  <Text className="text-[12px] text-neutral-400 font-inter">
                    Đổi tên hoặc cập nhật mô tả
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={handleOpenDelete}
                className="flex-row items-center gap-3 p-3.5 rounded-xl active:bg-danger-50"
              >
                <View className="w-9 h-9 rounded-lg bg-danger-50 items-center justify-center border border-danger-100">
                  <Trash2Icon size={18} color="#DC2626" />
                </View>
                <View>
                  <Text className="font-bold text-[14.5px] text-danger-600 font-inter">
                    Xóa bộ sưu tập
                  </Text>
                  <Text className="text-[12px] text-neutral-400 font-inter">
                    Xóa vĩnh viễn bộ sưu tập này
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* ========================================================
          5. MODAL CHỈNH SỬA BỘ SƯU TẬP
          ======================================================== */}
      <Modal
        visible={isEditModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 bg-black/40 items-center justify-center p-5"
        >
          <View className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-neutral-100">
            {/* Header Form */}
            <View className="flex-row items-center justify-between mb-5">
              <View className="flex-row items-center gap-2.5">
                <View className="w-9 h-9 rounded-xl bg-info-50 items-center justify-center border border-info-100">
                  <Edit3Icon size={18} color="#0284C7" />
                </View>
                <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">
                  Chỉnh sửa bộ sưu tập
                </Text>
              </View>
              <Pressable
                onPress={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center"
              >
                <XIcon size={16} color="#757793" />
              </Pressable>
            </View>

            {/* Ô 1: Tên bộ sưu tập */}
            <View className="mb-4">
              <Text className="font-bold text-[13.5px] text-neutral-600 font-inter mb-1.5">
                Tên bộ sưu tập <Text className="text-danger-500">*</Text>
              </Text>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                placeholder="VD: Tiếng Anh Giao Tiếp..."
                placeholderTextColor="#9597AD"
                className="h-12 bg-neutral-50 border border-neutral-200 rounded-xl px-4 font-inter text-[15px] text-mascot-navy font-medium focus:border-primary-500 focus:bg-white"
              />
            </View>

            {/* Ô 2: Mô tả / Bản dịch tiếng Việt */}
            <View className="mb-5">
              <Text className="font-bold text-[13.5px] text-neutral-600 font-inter mb-1.5">
                Mô tả / Bản dịch tiếng Việt
              </Text>
              <TextInput
                value={editTranslation}
                onChangeText={setEditTranslation}
                placeholder="VD: Từ vựng cho chuyến đi..."
                placeholderTextColor="#9597AD"
                className="h-12 bg-neutral-50 border border-neutral-200 rounded-xl px-4 font-inter text-[15px] text-mascot-navy font-medium focus:border-primary-500 focus:bg-white"
              />
            </View>

            {/* Nút hành động */}
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={() => setIsEditModalOpen(false)}
                className="flex-1 h-12 rounded-xl bg-white border border-neutral-200 items-center justify-center active:bg-neutral-50"
              >
                <Text className="font-extrabold text-[14px] text-neutral-600 font-nunito uppercase tracking-wide">
                  HỦY BỎ
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSaveEdit}
                disabled={!editName.trim() || updating}
                className={cn(
                  'flex-1 h-12 rounded-xl items-center justify-center transition-all',
                  editName.trim() && !updating
                    ? 'bg-primary-500 border-b-4 border-primary-700 active:border-b-0 active:translate-y-1'
                    : 'bg-neutral-300'
                )}
              >
                {updating ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text className="font-extrabold text-[14px] text-white uppercase font-nunito tracking-wide">
                    LƯU THAY ĐỔI
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ========================================================
          6. MODAL XÁC NHẬN XÓA BỘ SƯU TẬP
          ======================================================== */}
      <Modal
        visible={isDeleteModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDeleteModalOpen(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center p-6">
          <View className="bg-white rounded-3xl p-6 items-center w-full max-w-sm shadow-2xl border border-neutral-100">
            <View className="w-14 h-14 rounded-full bg-danger-50 items-center justify-center mb-3 border border-danger-100">
              <AlertTriangleIcon size={28} color="#DC2626" />
            </View>

            <Text className="font-extrabold text-[19px] text-mascot-navy font-nunito text-center">
              Xóa bộ sưu tập?
            </Text>

            <Text className="font-medium text-[13.5px] text-neutral-500 font-inter text-center mt-1.5 mb-5 leading-5">
              Bạn có chắc chắn muốn xóa bộ sưu tập{' '}
              <Text className="font-bold text-mascot-navy">"{collection?.name}"</Text>? Thao tác này
              không thể hoàn tác.
            </Text>

            <View className="flex-row items-center gap-3 w-full">
              <Pressable
                onPress={() => setIsDeleteModalOpen(false)}
                className="flex-1 h-12 rounded-xl bg-white border border-neutral-200 items-center justify-center active:bg-neutral-50"
              >
                <Text className="font-extrabold text-[14px] text-neutral-600 font-nunito uppercase tracking-wide">
                  HỦY
                </Text>
              </Pressable>

              <Pressable
                onPress={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 h-12 rounded-xl bg-danger-500 border-b-4 border-danger-700 items-center justify-center active:border-b-0 active:translate-y-1 transition-all"
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text className="font-extrabold text-[14px] text-white uppercase font-nunito tracking-wide">
                    XÓA
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
