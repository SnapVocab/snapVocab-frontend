import React from 'react';
import { View, Text, ScrollView, Pressable, Image, Platform } from 'react-native';
import { router } from 'expo-router';
import { CameraIcon, ChevronRightIcon, BookOpenIcon } from 'lucide-react-native';
import { HubVocabItem } from '@/lib/learningState';

interface RecentVocabularyRowProps {
  words: HubVocabItem[];
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

export function RecentVocabularyRow({ words }: RecentVocabularyRowProps) {
  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'SCAN':
        return {
          label: 'SCAN',
          bg: 'bg-mascot-50',
          border: 'border-mascot-200',
          text: 'text-mascot-700',
        };
      case 'DICT':
        return {
          label: 'DICT',
          bg: 'bg-info-50',
          border: 'border-info-100',
          text: 'text-info-600',
        };
      default:
        return {
          label: 'TOPIC',
          bg: 'bg-primary-50',
          border: 'border-primary-100',
          text: 'text-primary-700',
        };
    }
  };

  return (
    <View className="mb-4">
      {/* Header Hàng */}
      <View className="px-5 flex-row items-center justify-between mb-2.5">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-[12px] font-extrabold text-neutral-400 uppercase tracking-wider font-nunito">
            TỪ VỰNG CỦA BẠN
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/collections' as any)}
          className="flex-row items-center gap-0.5 active:opacity-70"
        >
          <Text className="text-[11.5px] font-bold text-neutral-500 font-inter">
            Mở sổ từ
          </Text>
          <ChevronRightIcon size={13} color="#757793" />
        </Pressable>
      </View>

      {/* Trạng thái 1: Chưa có từ vựng nào */}
      {words.length === 0 ? (
        <View className="px-5">
          <View
            className="bg-white rounded-2xl p-4 border border-dashed border-neutral-300 items-center justify-center"
            style={SOFT_CARD_SHADOW}
          >
            <View className="w-10 h-10 rounded-full bg-mascot-50 items-center justify-center mb-2 border border-mascot-100">
              <CameraIcon size={20} color="#FF8A00" />
            </View>
            <Text className="text-[14px] font-extrabold text-neutral-800 font-nunito text-center mb-0.5">
              Sổ từ vựng đang trống
            </Text>
            <Text className="text-[12px] font-medium text-neutral-500 font-inter text-center mb-3">
              Chụp ảnh đồ vật quanh bạn để tự động nhận diện và lưu từ vào sổ.
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/scan' as any)}
              className="bg-mascot-500 px-4 py-2 rounded-xl flex-row items-center gap-1.5 active:bg-mascot-600"
            >
              <CameraIcon size={14} color="#FFFFFF" />
              <Text className="text-white font-extrabold text-[12px] font-nunito uppercase">
                Chụp từ đầu tiên
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        /* Trạng thái 2: Cuộn ngang danh sách từ vừa lưu kèm ảnh thực tế */
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
        >
          {words.map((item) => {
            const badge = getSourceBadge(item.sourceTag);
            return (
              <Pressable
                key={item.id}
                onPress={() => router.push('/collections' as any)}
                className="w-36 bg-white rounded-2xl border border-neutral-200/70 overflow-hidden active:scale-[0.98]"
                style={SOFT_CARD_SHADOW}
              >
                {/* Ảnh thực tế của từ vựng */}
                <View className="w-full h-24 bg-neutral-100 relative">
                  {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} className="w-full h-full" resizeMode="cover" />
                  ) : (
                    <View className="w-full h-full items-center justify-center bg-primary-50">
                      <BookOpenIcon size={24} color="#58CC02" />
                    </View>
                  )}
                  {/* Tag nguồn (SCAN / DICT / TOPIC) */}
                  <View
                    className={`absolute top-2 left-2 px-1.5 py-0.5 rounded-md border ${badge.bg} ${badge.border}`}
                  >
                    <Text className={`text-[9.5px] font-extrabold font-nunito ${badge.text}`}>
                      {badge.label}
                    </Text>
                  </View>
                </View>

                {/* Thông tin từ vựng */}
                <View className="p-2.5">
                  <Text className="text-[13.5px] font-extrabold text-neutral-800 font-nunito" numberOfLines={1}>
                    {item.word}
                  </Text>
                  <Text className="text-[11px] font-medium text-neutral-500 font-inter mt-0.5" numberOfLines={1}>
                    {item.meaning}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
