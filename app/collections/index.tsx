import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  LayersIcon,
  FolderIcon,
  XIcon,
  SearchIcon,
  MoreVerticalIcon,
  Edit3Icon,
  Trash2Icon,
  AlertTriangleIcon,
} from 'lucide-react-native';
import { collectionRepository, CollectionSummaryUI } from '@/lib/repositories/collection.repository';
import { CollectionType } from '@/lib/topic-eav';
import { Snapy } from '@/components/Snapy';
import { TopicBook3D } from '@/components/snapvocab';
import { cn } from '@/lib/utils';

// ==========================================
// TOKENS & SHADOW STYLES
// ==========================================
const SOFT_CARD_SHADOW = Platform.select({
  web: {
    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.06)',
  },
  default: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2.5,
  },
}) as any;

export default function CollectionsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CollectionType>('USER');
  const [userCollections, setUserCollections] = useState<CollectionSummaryUI[]>([]);
  const [systemCollections, setSystemCollections] = useState<CollectionSummaryUI[]>([]);
  const [loading, setLoading] = useState(true);

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Create & Edit Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<CollectionSummaryUI | null>(null);
  const [formName, setFormName] = useState('');
  const [formTranslation, setFormTranslation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Quick Action Sheet state (3-dots)
  const [actionTarget, setActionTarget] = useState<CollectionSummaryUI | null>(null);

  // Delete Confirmation state
  const [deleteTarget, setDeleteTarget] = useState<CollectionSummaryUI | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const canSubmitForm = Boolean(formName.trim()) && !submitting;

  // Load collections from repository
  const fetchCollections = useCallback(async () => {
    setLoading(true);
    try {
      const [userData, systemData] = await Promise.all([
        collectionRepository.getCollections('USER'),
        collectionRepository.getCollections('SYSTEM'),
      ]);
      setUserCollections(userData);
      setSystemCollections(systemData);
    } catch (err) {
      console.error('Failed to load collections:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  // Current active list filtered by search
  const currentList = activeTab === 'USER' ? userCollections : systemCollections;
  const filteredCollections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return currentList;
    return currentList.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        (c.translation && c.translation.toLowerCase().includes(query))
    );
  }, [currentList, searchQuery]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingTarget(null);
    setFormName('');
    setFormTranslation('');
    setIsFormModalOpen(true);
  };

  // Open Edit Modal from Action Sheet
  const handleOpenEdit = (target: CollectionSummaryUI) => {
    setActionTarget(null);
    setEditingTarget(target);
    setFormName(target.name);
    setFormTranslation(target.translation || '');
    setIsFormModalOpen(true);
  };

  // Submit Create or Edit Form
  const handleSubmitForm = async () => {
    if (!formName.trim()) return;
    setSubmitting(true);
    try {
      if (editingTarget) {
        // Edit flow
        const updated = await collectionRepository.updateCollection(editingTarget.id, {
          name: formName.trim(),
          translation: formTranslation.trim() || undefined,
        });
        if (updated) {
          setUserCollections((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
          );
        }
      } else {
        // Create flow
        const created = await collectionRepository.createCollection({
          name: formName.trim(),
          translation: formTranslation.trim() || undefined,
        });
        setUserCollections((prev) => [created, ...prev]);
        router.push(`/collections/${created.id}` as any);
      }
      setIsFormModalOpen(false);
      setFormName('');
      setFormTranslation('');
      setEditingTarget(null);
    } catch (err) {
      console.error('Failed to submit collection form:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm and execute delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const success = await collectionRepository.deleteCollection(deleteTarget.id);
      if (success) {
        setUserCollections((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete collection:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      {/* ==========================================
          1. TOP HEADER & TÌM KIẾM TÍCH HỢP
          ========================================== */}
      <View className="px-4 pt-3 pb-3 bg-white border-b border-neutral-200/80 z-10">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/learn'))}
            className="w-10 h-10 items-center justify-center rounded-xl active:bg-neutral-100"
          >
            <ChevronLeftIcon size={24} color="#1E2A44" />
          </Pressable>

          <View className="flex-1 items-center px-2">
            <Text className="font-extrabold text-[19px] text-mascot-navy font-nunito">
              Bộ sưu tập
            </Text>
            <Text className="font-medium text-[12.5px] text-neutral-500 font-inter">
              Kho từ vựng & chủ đề học
            </Text>
          </View>

          {/* Spacer 40px để căn giữa hoàn hảo và tránh Expo Go tools floating icon */}
          <View className="w-10" />
        </View>

        {/* Thanh tìm kiếm trực quan ngay dưới tiêu đề */}
        <View className="mt-3 flex-row items-center h-11 px-3.5 bg-neutral-100/90 rounded-xl border border-neutral-200/80">
          <SearchIcon size={18} color="#757793" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Tìm kiếm bộ sưu tập..."
            placeholderTextColor="#9597AD"
            className="flex-1 ml-2 text-[14.5px] font-inter text-mascot-navy"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} className="p-1 active:opacity-70">
              <XIcon size={16} color="#757793" />
            </Pressable>
          )}
        </View>
      </View>

      {/* ==========================================
          2. SEGMENTED TABS (CÓ SỐ ĐẾM BỘ SƯU TẬP)
          ========================================== */}
      <View className="px-4 pt-3 pb-2 bg-[#F8FAFC]">
        <View className="flex-row p-1 bg-neutral-200/60 rounded-2xl border border-neutral-200/80">
          {/* Tab 1: Của tôi */}
          <Pressable
            onPress={() => setActiveTab('USER')}
            className={cn(
              'flex-1 h-11 rounded-xl items-center justify-center flex-row gap-1.5 transition-all',
              activeTab === 'USER'
                ? 'bg-white shadow-xs border border-neutral-200/80'
                : 'bg-transparent active:bg-neutral-200/40'
            )}
          >
            <Text
              className={cn(
                'font-extrabold text-[14.5px] font-nunito',
                activeTab === 'USER' ? 'text-mascot-navy' : 'text-neutral-500'
              )}
            >
              Của tôi
            </Text>
            <View
              className={cn(
                'px-2 py-0.5 rounded-full',
                activeTab === 'USER' ? 'bg-primary-50 border border-primary-200' : 'bg-neutral-200/80'
              )}
            >
              <Text
                className={cn(
                  'font-extrabold text-[11px] font-nunito',
                  activeTab === 'USER' ? 'text-primary-700' : 'text-neutral-500'
                )}
              >
                {userCollections.length}
              </Text>
            </View>
          </Pressable>

          {/* Tab 2: Hệ thống */}
          <Pressable
            onPress={() => setActiveTab('SYSTEM')}
            className={cn(
              'flex-1 h-11 rounded-xl items-center justify-center flex-row gap-1.5 transition-all',
              activeTab === 'SYSTEM'
                ? 'bg-white shadow-xs border border-neutral-200/80'
                : 'bg-transparent active:bg-neutral-200/40'
            )}
          >
            <Text
              className={cn(
                'font-extrabold text-[14.5px] font-nunito',
                activeTab === 'SYSTEM' ? 'text-mascot-navy' : 'text-neutral-500'
              )}
            >
              Hệ thống
            </Text>
            <View
              className={cn(
                'px-2 py-0.5 rounded-full',
                activeTab === 'SYSTEM' ? 'bg-primary-50 border border-primary-200' : 'bg-neutral-200/80'
              )}
            >
              <Text
                className={cn(
                  'font-extrabold text-[11px] font-nunito',
                  activeTab === 'SYSTEM' ? 'text-primary-700' : 'text-neutral-500'
                )}
              >
                {systemCollections.length}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* ==========================================
          3. DANH SÁCH BỘ SƯU TẬP
          ========================================== */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: activeTab === 'USER' ? 120 : 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#58CC02" />
            <Text className="font-semibold text-[14px] text-neutral-500 font-inter mt-3">
              Đang tải danh sách bộ sưu tập...
            </Text>
          </View>
        ) : filteredCollections.length === 0 ? (
          <View className="bg-white rounded-3xl p-8 items-center justify-center border border-neutral-200/80 mt-4 shadow-xs">
            <Snapy pose="kham_pha" animation="idle" className="w-24 h-24 mb-3" />
            <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-1 text-center">
              {searchQuery ? 'Không tìm thấy bộ sưu tập' : 'Chưa có bộ sưu tập nào'}
            </Text>
            <Text className="font-medium text-[13.5px] text-neutral-500 font-inter text-center mb-6 leading-5 px-4">
              {searchQuery
                ? `Không có kết quả nào khớp với từ khóa "${searchQuery}".`
                : activeTab === 'USER'
                ? 'Tạo bộ sưu tập đầu tiên để gom nhóm các chủ đề từ vựng của bạn!'
                : 'Hiện chưa có bộ sưu tập hệ thống.'}
            </Text>
            {activeTab === 'USER' && !searchQuery && (
              <Pressable
                onPress={handleOpenCreate}
                className="w-full h-12 bg-primary-500 border-b-4 border-primary-700 active:border-b-0 active:translate-y-1 rounded-2xl items-center justify-center"
              >
                <Text className="font-extrabold text-[14px] text-white uppercase font-nunito tracking-wide">
                  TẠO BỘ SƯU TẬP MỚI
                </Text>
              </Pressable>
            )}
          </View>
        ) : (
          <View className="gap-3">
            {filteredCollections.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.push(`/collections/${item.id}` as any)}
                className="bg-white rounded-2xl p-4 border border-neutral-200/80 active:scale-[0.99] transition-all"
                style={SOFT_CARD_SHADOW}
              >
                {/* Hàng 1: Icon nhận diện + Tên & Mô tả + Menu nút */}
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center gap-3.5 flex-1 pr-2">
                    {/* Branded Icon container theo chuẩn SnapVocab */}
                    {item.type === 'SYSTEM' ? (
                      <View className="w-12 h-12 rounded-2xl bg-mascot-50 items-center justify-center border border-mascot-100 shrink-0">
                        <TopicBook3D size={38} />
                      </View>
                    ) : (
                      <View className="w-12 h-12 rounded-2xl bg-primary-50 items-center justify-center border border-primary-100 shrink-0">
                        <FolderIcon size={24} color="#58CC02" />
                      </View>
                    )}

                    {/* Tiêu đề & bản dịch với chiều cao đồng đều */}
                    <View className="flex-1 justify-center min-h-[44px]">
                      <Text
                        className="font-extrabold text-[16.5px] text-mascot-navy font-nunito leading-snug"
                        numberOfLines={2}
                      >
                        {item.name}
                      </Text>
                      <Text
                        className={cn(
                          'font-medium text-[13px] font-inter mt-0.5 leading-snug',
                          item.translation ? 'text-neutral-500' : 'text-neutral-300 italic'
                        )}
                        numberOfLines={1}
                      >
                        {item.translation || 'Chưa có bản dịch tiếng Việt'}
                      </Text>
                    </View>
                  </View>

                  {/* Cột thao tác phải */}
                  <View className="flex-row items-center shrink-0">
                    {item.type === 'USER' ? (
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          setActionTarget(item);
                        }}
                        hitSlop={12}
                        className="w-9 h-9 rounded-xl items-center justify-center bg-neutral-50 active:bg-neutral-100 border border-neutral-200/80"
                      >
                        <MoreVerticalIcon size={18} color="#757793" />
                      </Pressable>
                    ) : (
                      <View className="w-8 h-8 items-center justify-center">
                        <ChevronRightIcon size={20} color="#9597AD" />
                      </View>
                    )}
                  </View>
                </View>

                {/* Hàng 2: Meta info & Thanh tiến độ chuẩn ngữ nghĩa */}
                <View className="pt-2.5 border-t border-neutral-100 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1.5">
                    <LayersIcon size={14} color="#757793" />
                    <Text className="font-semibold text-[13px] text-neutral-500 font-inter">
                      {item.topicCount} chủ đề · {item.wordCount} từ
                    </Text>
                  </View>

                  {/* Thanh tiến độ SRS & Số % */}
                  <View className="flex-row items-center gap-2 w-28 justify-end">
                    <View className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </View>
                    <Text
                      className={cn(
                        'text-[12.5px] font-nunito tabular-nums shrink-0',
                        item.progress > 0
                          ? 'font-extrabold text-primary-600'
                          : 'font-bold text-neutral-400'
                      )}
                    >
                      {item.progress}%
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ==========================================
          4. CHUNKY CTA NỔI: "+ TẠO BỘ SƯU TẬP"
          (Chỉ hiển thị khi ở tab "Của tôi")
          ========================================== */}
      {activeTab === 'USER' && (
        <View className="absolute bottom-5 right-4 left-4 z-20 items-center">
          <Pressable
            onPress={handleOpenCreate}
            className="w-full h-13 bg-primary-500 border-b-4 border-primary-700 active:border-b-0 active:translate-y-1 rounded-2xl flex-row items-center justify-center gap-2 shadow-sm"
          >
            <PlusIcon size={19} color="#ffffff" strokeWidth={3} />
            <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-wide">
              TẠO BỘ SƯU TẬP MỚI
            </Text>
          </Pressable>
        </View>
      )}

      {/* ==========================================
          5. MODAL TẠO & CHỈNH SỬA BỘ SƯU TẬP
          ========================================== */}
      <Modal
        visible={isFormModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFormModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 bg-black/40 justify-end"
        >
          <View className="bg-white rounded-t-[32px] p-6 pb-10 border-t border-neutral-200 max-w-lg mx-auto w-full shadow-2xl">
            <View className="flex-row items-center justify-between mb-5">
              <Text className="font-extrabold text-[21px] text-mascot-navy font-nunito">
                {editingTarget ? 'Chỉnh sửa bộ sưu tập' : 'Tạo bộ sưu tập mới'}
              </Text>
              <Pressable
                onPress={() => setIsFormModalOpen(false)}
                className="w-9 h-9 bg-neutral-100 rounded-full items-center justify-center active:bg-neutral-200"
              >
                <XIcon size={18} color="#757793" />
              </Pressable>
            </View>

            {/* Ô 1: Tên bộ sưu tập */}
            <View className="mb-4">
              <Text className="font-bold text-[13.5px] text-neutral-600 font-inter mb-1.5">
                Tên bộ sưu tập <Text className="text-danger-500">*</Text>
              </Text>
              <TextInput
                value={formName}
                onChangeText={setFormName}
                placeholder="VD: Du lịch, Công việc, Giao tiếp..."
                placeholderTextColor="#9597AD"
                autoFocus
                className="h-12 bg-neutral-50 border border-neutral-200 rounded-xl px-4 font-inter text-[15px] text-mascot-navy font-medium focus:border-primary-500 focus:bg-white"
              />
            </View>

            {/* Ô 2: Mô tả / Bản dịch tiếng Việt */}
            <View className="mb-5">
              <Text className="font-bold text-[13.5px] text-neutral-600 font-inter mb-1.5">
                Mô tả / Bản dịch tiếng Việt
              </Text>
              <TextInput
                value={formTranslation}
                onChangeText={setFormTranslation}
                placeholder="VD: Từ vựng cho chuyến đi nước ngoài..."
                placeholderTextColor="#9597AD"
                className="h-12 bg-neutral-50 border border-neutral-200 rounded-xl px-4 font-inter text-[15px] text-mascot-navy font-medium focus:border-primary-500 focus:bg-white"
              />
            </View>

            {/* Note trợ giúp chuẩn SnapVocab */}
            <View className="mb-6 p-3.5 bg-primary-50 rounded-xl border border-primary-100 flex-row items-center gap-2.5">
              <FolderIcon size={18} color="#58CC02" />
              <Text className="text-[13px] font-medium text-primary-800 font-inter flex-1 leading-5">
                Bộ sưu tập giúp gom nhóm các chủ đề từ vựng theo mục tiêu học của bạn.
              </Text>
            </View>

            {/* Nút hành động Tactile */}
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={() => setIsFormModalOpen(false)}
                className="flex-1 h-12 rounded-xl bg-white border border-neutral-200 items-center justify-center active:bg-neutral-50"
              >
                <Text className="font-extrabold text-[14px] text-neutral-600 font-nunito uppercase tracking-wide">
                  HỦY BỎ
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSubmitForm}
                disabled={!canSubmitForm}
                className={cn(
                  'flex-1 h-12 rounded-xl items-center justify-center transition-all',
                  canSubmitForm
                    ? 'bg-primary-500 border-b-4 border-primary-700 active:border-b-0 active:translate-y-1'
                    : 'bg-neutral-300'
                )}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text className="font-extrabold text-[14px] text-white uppercase font-nunito tracking-wide">
                    {editingTarget ? 'LƯU THAY ĐỔI' : 'TẠO BỘ SƯU TẬP'}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ==========================================
          6. QUICK ACTION SHEET (MENU 3 CHẤM)
          ========================================== */}
      <Modal
        visible={!!actionTarget}
        transparent
        animationType="fade"
        onRequestClose={() => setActionTarget(null)}
      >
        <Pressable
          onPress={() => setActionTarget(null)}
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
                  {actionTarget?.name}
                </Text>
                <Text className="font-medium text-[12px] text-neutral-400 font-inter">
                  Tùy chọn quản lý bộ sưu tập
                </Text>
              </View>
              <Pressable
                onPress={() => setActionTarget(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center"
              >
                <XIcon size={16} color="#757793" />
              </Pressable>
            </View>

            {/* Các tùy chọn */}
            <View className="gap-2 mt-1">
              {/* Sửa thông tin */}
              <Pressable
                onPress={() => actionTarget && handleOpenEdit(actionTarget)}
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

              {/* Xóa */}
              <Pressable
                onPress={() => {
                  const target = actionTarget;
                  setActionTarget(null);
                  setDeleteTarget(target);
                }}
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
                    Xóa hoàn toàn khỏi danh sách của bạn
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* ==========================================
          7. HỘP THOẠI XÁC NHẬN XÓA (DELETE CONFIRM)
          ========================================== */}
      <Modal
        visible={!!deleteTarget}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteTarget(null)}
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
              <Text className="font-bold text-mascot-navy">"{deleteTarget?.name}"</Text>? Thao tác này
              không thể hoàn tác.
            </Text>

            <View className="flex-row items-center gap-3 w-full">
              <Pressable
                onPress={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1 h-12 rounded-xl bg-neutral-100 items-center justify-center active:bg-neutral-200"
              >
                <Text className="font-extrabold text-[14px] text-neutral-600 font-nunito uppercase">
                  HỦY BỎ
                </Text>
              </Pressable>

              <Pressable
                onPress={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 h-12 rounded-xl bg-danger-600 items-center justify-center border-b-4 border-danger-800 active:border-b-0 active:translate-y-1"
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text className="font-extrabold text-[14px] text-white font-nunito uppercase">
                    XÁC NHẬN XÓA
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
