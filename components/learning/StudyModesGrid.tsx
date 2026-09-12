import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { 
  SnapCamera3D, 
  FlashcardSpin3D, 
  QuizChallenge3D, 
  TopicBook3D 
} from '@/components/snapvocab';
import { LearningHubSummaryResponse } from '@/lib/learningState';

interface StudyModesGridProps {
  summary: LearningHubSummaryResponse;
}

const SOFT_CARD_SHADOW = Platform.select({
  web: {
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
  },
  default: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1.5,
  },
}) as any;

export function StudyModesGrid({ summary }: StudyModesGridProps) {
  const { studyModes } = summary;

  return (
    <View className="px-5 mb-4">
      <View className="flex-row items-center justify-between mb-2.5">
        <Text className="text-[12px] font-extrabold text-neutral-400 uppercase tracking-wider font-nunito">
          BẠN MUỐN HỌC THẾ NÀO?
        </Text>
        <Text className="text-[11px] font-bold text-primary-600 font-nunito">
          4 chế độ
        </Text>
      </View>

      {/* Lưới 2 × 2 với 4 icon 3D SnapVocab độc quyền */}
      <View className="gap-2.5">
        {/* Hàng 1: Chụp & học (DNA sản phẩm) + Lật thẻ (FSRS) */}
        <View className="flex-row gap-2.5">
          {/* Chế độ 1: Chụp & học */}
          <Pressable
            onPress={() => router.push('/(tabs)/scan' as any)}
            className="flex-1 bg-white rounded-2xl p-3 border border-neutral-200/70 justify-between active:scale-[0.98]"
            style={SOFT_CARD_SHADOW}
          >
            <View className="flex-row items-center justify-between mb-2">
              <SnapCamera3D size={38} />
              <View className="bg-mascot-50 px-2 py-0.5 rounded-md border border-mascot-200">
                <Text className="text-[10.5px] font-extrabold text-mascot-700 font-nunito uppercase">
                  SCAN
                </Text>
              </View>
            </View>
            <View>
              <Text className="text-[15px] font-extrabold text-neutral-800 font-nunito">
                Chụp & học
              </Text>
              <Text className="text-[11.5px] font-medium text-neutral-500 font-inter mt-0.5" numberOfLines={1}>
                Biến ảnh thành từ
              </Text>
            </View>
          </Pressable>

          {/* Chế độ 2: Lật thẻ phản xạ */}
          <Pressable
            onPress={() => router.push('/study/flashcard' as any)}
            className="flex-1 bg-white rounded-2xl p-3 border border-neutral-200/70 justify-between active:scale-[0.98]"
            style={SOFT_CARD_SHADOW}
          >
            <View className="flex-row items-center justify-between mb-2">
              <FlashcardSpin3D size={38} />
              <View className="bg-info-50 px-2 py-0.5 rounded-md border border-info-100">
                <Text className="text-[10.5px] font-extrabold text-info-600 font-nunito">
                  {studyModes.flashcardsCount > 0 ? `${studyModes.flashcardsCount} thẻ` : 'Mới'}
                </Text>
              </View>
            </View>
            <View>
              <Text className="text-[15px] font-extrabold text-neutral-800 font-nunito">
                Lật thẻ
              </Text>
              <Text className="text-[11.5px] font-medium text-neutral-500 font-inter mt-0.5" numberOfLines={1}>
                Nhìn ảnh, nhớ từ
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Hàng 2: Quiz nhanh + Học theo chủ đề */}
        <View className="flex-row gap-2.5">
          {/* Chế độ 3: Quiz nhanh */}
          <Pressable
            onPress={() => router.push('/study/quiz-setup' as any)}
            className="flex-1 bg-white rounded-2xl p-3 border border-neutral-200/70 justify-between active:scale-[0.98]"
            style={SOFT_CARD_SHADOW}
          >
            <View className="flex-row items-center justify-between mb-2">
              <QuizChallenge3D size={38} />
              <View className="bg-reward-50 px-2 py-0.5 rounded-md border border-reward-200">
                <Text className="text-[10.5px] font-extrabold text-reward-700 font-nunito">
                  +25 XP
                </Text>
              </View>
            </View>
            <View>
              <Text className="text-[15px] font-extrabold text-neutral-800 font-nunito">
                Quiz nhanh
              </Text>
              <Text className="text-[11.5px] font-medium text-neutral-500 font-inter mt-0.5" numberOfLines={1}>
                Thử sức từ đã học
              </Text>
            </View>
          </Pressable>

          {/* Chế độ 4: Học theo chủ đề */}
          <Pressable
            onPress={() => router.push('/topics' as any)}
            className="flex-1 bg-white rounded-2xl p-3 border border-neutral-200/70 justify-between active:scale-[0.98]"
            style={SOFT_CARD_SHADOW}
          >
            <View className="flex-row items-center justify-between mb-2">
              <TopicBook3D size={38} />
              <View className="bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
                <Text className="text-[10.5px] font-extrabold text-primary-700 font-nunito">
                  {studyModes.collectionsCount} chủ đề
                </Text>
              </View>
            </View>
            <View>
              <Text className="text-[15px] font-extrabold text-neutral-800 font-nunito">
                Theo chủ đề
              </Text>
              <Text className="text-[11.5px] font-medium text-neutral-500 font-inter mt-0.5" numberOfLines={1}>
                Du lịch, công việc...
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
