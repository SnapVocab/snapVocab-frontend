import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeftIcon,
  SlidersHorizontalIcon,
  LayoutGridIcon,
} from 'lucide-react-native';
import { topicRepository } from '@/lib/repositories/topic.repository';
import { collectionRepository } from '@/lib/repositories/collection.repository';
import { cn } from '@/lib/utils';

export default function CreateTopicScreen() {
  const params = useLocalSearchParams();
  const collectionId = Number(params.collectionId) || 1;

  const [collectionName, setCollectionName] = useState<string>('Bộ sưu tập');
  const [name, setName] = useState('');
  const [translation, setTranslation] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    collectionRepository.getCollectionById(collectionId).then((col) => {
      if (col) setCollectionName(col.name);
    });
  }, [collectionId]);

  const handleCreateOnly = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await topicRepository.createTopic({
        collectionId,
        name: name.trim(),
        translation: translation.trim() || undefined,
        description: description.trim() || undefined,
      });
      router.replace(`/collections/${collectionId}` as any);
    } catch (err) {
      console.error('Failed to create topic:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCustomizeLayout = async () => {
    if (!name.trim()) {
      alert('Vui lòng nhập tên chủ đề trước khi tùy chỉnh bố cục thẻ!');
      return;
    }
    setSubmitting(true);
    try {
      const created = await topicRepository.createTopic({
        collectionId,
        name: name.trim(),
        translation: translation.trim() || undefined,
        description: description.trim() || undefined,
      });

      router.push({
        pathname: '/templates/builder' as any,
        params: {
          topicId: created.id,
          collectionId,
          templateId: created.activeTemplateId || 1,
          topicName: created.name,
        },
      });
    } catch (err) {
      console.error('Failed to create topic for customization:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* 1. TOP HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-neutral-100 z-10">
        <Pressable
          onPress={() => router.back()}
          className="w-12 h-12 items-center justify-center rounded-2xl active:bg-neutral-100 -ml-2"
        >
          <ChevronLeftIcon size={28} color="#1E2A44" />
        </Pressable>

        <View className="flex-1 items-center px-2">
          <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">
            Thêm chủ đề mới
          </Text>
          <Text className="font-semibold text-[14px] text-neutral-500 font-inter" numberOfLines={1}>
            Bộ sưu tập: {collectionName}
          </Text>
        </View>

        <View className="w-12 h-12" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* BANNER HƯỚNG DẪN */}
          <View className="mb-6 p-4 bg-primary-50 rounded-2xl border-2 border-primary-100">
            <Text className="font-extrabold text-[16px] text-primary-800 font-nunito mb-1">
              Tạo chủ đề từ vựng linh hoạt
            </Text>
            <Text className="font-medium text-[14px] text-neutral-600 font-inter leading-5">
              Hệ thống sẽ tự động gán sẵn Bố cục thẻ chuẩn (gồm từ vựng, phát âm, bản dịch và câu ví dụ).
            </Text>
          </View>

          {/* Ô 1: TÊN CHỦ ĐỀ */}
          <View className="mb-4">
            <Text className="font-bold text-[14px] text-neutral-600 font-inter mb-1.5">
              Tên chủ đề <Text className="text-danger-500">*</Text>
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="VD: Education & Technology, Airport..."
              placeholderTextColor="#9597AD"
              autoFocus
              className="h-13 bg-neutral-50 border-2 border-neutral-200 rounded-2xl px-4 font-inter text-[16px] text-mascot-navy font-medium focus:border-primary-500 focus:bg-primary-50/30"
            />
          </View>

          {/* Ô 2: BẢN DỊCH */}
          <View className="mb-4">
            <Text className="font-bold text-[14px] text-neutral-600 font-inter mb-1.5">
              Bản dịch tiếng Việt
            </Text>
            <TextInput
              value={translation}
              onChangeText={setTranslation}
              placeholder="VD: Giáo dục & Công nghệ hiện đại..."
              placeholderTextColor="#9597AD"
              className="h-13 bg-neutral-50 border-2 border-neutral-200 rounded-2xl px-4 font-inter text-[16px] text-mascot-navy font-medium focus:border-primary-500 focus:bg-primary-50/30"
            />
          </View>

          {/* Ô 3: MÔ TẢ (TÙY CHỌN) */}
          <View className="mb-6">
            <Text className="font-bold text-[14px] text-neutral-600 font-inter mb-1.5">
              Mô tả ghi chú (Không bắt buộc)
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Ghi chú về nhóm từ vựng này..."
              placeholderTextColor="#9597AD"
              multiline
              numberOfLines={3}
              style={{ textAlignVertical: 'top' }}
              className="min-h-[90px] py-3 bg-neutral-50 border-2 border-neutral-200 rounded-2xl px-4 font-inter text-[15px] text-mascot-navy font-medium focus:border-primary-500 focus:bg-primary-50/30"
            />
          </View>

          {/* KHỐI CẤU HÌNH BỐ CỤC THẺ HỌC */}
          <View className="mb-6">
            <Text className="font-bold text-[14px] text-neutral-600 font-inter mb-2">
              Bố cục thẻ học
            </Text>

            <View className="bg-white rounded-2xl p-4 border-2 border-neutral-200 border-b-[4px]">
              {/* Hàng 1: Tiêu đề Template + Nút tùy chỉnh */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1 pr-2">
                  <View className="w-11 h-11 rounded-xl bg-primary-50 items-center justify-center border border-primary-200 shrink-0">
                    <LayoutGridIcon size={20} color="#58CC02" />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-1.5 flex-wrap">
                      <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">
                        Tiếng Anh chuẩn
                      </Text>
                      <View className="bg-primary-50 px-1.5 py-0.5 rounded-md border border-primary-200">
                        <Text className="text-[10px] font-extrabold text-primary-700 font-nunito uppercase">
                          MẶC ĐỊNH
                        </Text>
                      </View>
                    </View>
                    <Text className="font-medium text-[12.5px] text-neutral-400 font-inter mt-0.5">
                      Bố cục 4 trường chuẩn phản xạ
                    </Text>
                  </View>
                </View>

                {/* Nút "Tùy chỉnh" */}
                <Pressable
                  onPress={handleCustomizeLayout}
                  disabled={submitting}
                  className="flex-row items-center gap-1.5 bg-neutral-50 border border-neutral-200 border-b-[3px] px-3 py-2 rounded-xl active:translate-y-[1px] active:border-b-[2px] shrink-0"
                >
                  <SlidersHorizontalIcon size={15} color="#1E2A44" />
                  <Text className="font-extrabold text-[13px] text-mascot-navy font-nunito">
                    Tùy chỉnh
                  </Text>
                </Pressable>
              </View>

              {/* Hàng 2: Trực quan 2 mặt thẻ (Mặt trước vs Mặt sau) */}
              <View className="flex-row gap-2.5 mt-3 pt-3 border-t border-neutral-100">
                <View className="flex-1 bg-neutral-50 rounded-xl p-2.5 border border-neutral-200/70">
                  <Text className="text-[10.5px] font-extrabold text-neutral-400 uppercase font-nunito mb-1">
                    MẶT TRƯỚC
                  </Text>
                  <Text className="text-[12.5px] font-bold text-neutral-700 font-nunito">
                    Từ vựng <Text className="font-normal text-neutral-400">·</Text> IPA
                  </Text>
                </View>

                <View className="flex-1 bg-neutral-50 rounded-xl p-2.5 border border-neutral-200/70">
                  <Text className="text-[10.5px] font-extrabold text-neutral-400 uppercase font-nunito mb-1">
                    MẶT SAU
                  </Text>
                  <Text className="text-[12.5px] font-bold text-neutral-700 font-nunito">
                    Nghĩa <Text className="font-normal text-neutral-400">·</Text> Ví dụ
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* STICKY BOTTOM BAR: NÚT TẠO CHỦ ĐỀ */}
        <View className="p-4 bg-white border-t border-neutral-100">
          <Pressable
            onPress={handleCreateOnly}
            disabled={!name.trim() || submitting}
            className={cn(
              'w-full h-13 rounded-2xl items-center justify-center flex-row transition-all',
              name.trim() && !submitting
                ? 'bg-primary-500 border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px]'
                : 'bg-neutral-200 border-b-[4px] border-neutral-300'
            )}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text
                className={cn(
                  'font-extrabold text-[15px] uppercase font-nunito tracking-[0.04em]',
                  name.trim() ? 'text-white' : 'text-neutral-400'
                )}
              >
                TẠO CHỦ ĐỀ
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
