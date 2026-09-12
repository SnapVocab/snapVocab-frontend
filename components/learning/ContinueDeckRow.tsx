import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { PlayIcon, ChevronRightIcon } from 'lucide-react-native';
import { ActiveSessionInfo, HubState } from '@/lib/learningState';

interface ContinueDeckRowProps {
  activeSession: ActiveSessionInfo | null;
  hubState: HubState;
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

export function ContinueDeckRow({ activeSession, hubState }: ContinueDeckRowProps) {
  // Ẩn nếu không có bài học dở, hoặc chính bài này đã là Hero phía trên
  if (!activeSession || hubState === 'inProgress') {
    return null;
  }

  const percent = Math.round((activeSession.progress / Math.max(1, activeSession.total)) * 100);

  return (
    <View className="px-5 mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-[12px] font-extrabold text-neutral-400 uppercase tracking-wider font-nunito">
          TIẾP TỤC BỘ THẺ
        </Text>
        <Pressable onPress={() => router.push('/decks' as any)}>
          <Text className="text-[11.5px] font-bold text-neutral-500 font-inter">
            Xem tất cả →
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => router.push('/study/flashcard' as any)}
        className="bg-white rounded-2xl p-3.5 border border-neutral-200/70 flex-row items-center justify-between active:scale-[0.99]"
        style={SOFT_CARD_SHADOW}
      >
        <View className="flex-row items-center gap-3 flex-1 pr-2">
          {/* Icon/Emoji của bộ thẻ */}
          <View className="w-11 h-11 bg-primary-50 rounded-xl items-center justify-center border border-primary-100 shrink-0">
            <Text className="text-[20px]">💼</Text>
          </View>

          <View className="flex-1 min-w-0">
            <View className="flex-row items-center gap-1.5 mb-0.5">
              <Text className="text-[10px] font-extrabold text-primary-700 uppercase tracking-wider font-nunito bg-primary-50 px-1.5 py-0.5 rounded border border-primary-100">
                {activeSession.level}
              </Text>
              <Text className="text-[14px] font-extrabold text-neutral-800 font-nunito truncate" numberOfLines={1}>
                {activeSession.topicName}
              </Text>
            </View>
            <Text className="text-[11.5px] font-medium text-neutral-500 font-inter" numberOfLines={1}>
              Bài {activeSession.lessonNumber}: {activeSession.progress}/{activeSession.total} từ · {percent}%
            </Text>
          </View>
        </View>

        {/* Nút tiếp tục nhỏ gọn */}
        <View className="bg-primary-500 px-3 py-2 rounded-xl flex-row items-center gap-1 shrink-0 border-b-2 border-primary-700">
          <PlayIcon size={12} color="#FFFFFF" fill="#FFFFFF" />
          <Text className="text-white font-extrabold text-[12px] font-nunito uppercase">
            HỌC TIẾP
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
