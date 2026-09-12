import React from 'react';
import { View, Text, Pressable, Image, Platform } from 'react-native';
import { router } from 'expo-router';
import { ArrowRightIcon, SparklesIcon, CheckCircle2Icon, CameraIcon, PlayIcon, RepeatIcon } from 'lucide-react-native';
import { Snapy } from '@/components/Snapy';
import { HubState, LearningHubSummaryResponse } from '@/lib/learningState';

interface RecommendedSessionCardProps {
  summary: LearningHubSummaryResponse;
  hubState: HubState;
}

const SOFT_HERO_SHADOW = Platform.select({
  web: {
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
  },
  default: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
}) as any;

export function RecommendedSessionCard({
  summary,
  hubState,
}: RecommendedSessionCardProps) {
  const { fsrsOverview, activeSession, previewDueItems, recentSavedWords } = summary;

  // =========================================================
  // STATE 1: hasDue (Ưu tiên cao nhất - Ôn tập ngắt quãng FSRS)
  // =========================================================
  if (hubState === 'hasDue') {
    return (
      <View className="px-5 mb-4">
        <View
          className="bg-mascot-navy rounded-3xl p-4.5 border border-mascot-navy/90 border-b-4 border-b-neutral-900 overflow-hidden"
          style={SOFT_HERO_SHADOW}
        >
          {/* Header hàng trên: Nhãn phiên & Độ bền trí nhớ */}
          <View className="flex-row items-center justify-between mb-2.5">
            <View className="flex-row items-center gap-1.5 bg-reward-500/15 px-2.5 py-1 rounded-full border border-reward-500/30">
              <RepeatIcon size={13} color="#FFC42E" />
              <Text className="text-[11px] font-extrabold text-reward-500 font-nunito uppercase tracking-wider">
                PHIÊN ÔN TẬP SRS
              </Text>
            </View>

            <View className="bg-white/10 px-2.5 py-1 rounded-full border border-white/15 flex-row items-center gap-1">
              <SparklesIcon size={11} color="#A0E063" />
              <Text className="text-[11px] font-bold text-neutral-200 font-nunito">
                Độ bền: {fsrsOverview.retentionRate}%
              </Text>
            </View>
          </View>

          {/* Hàng nội dung chính: Thông tin phiên + Snapy + Ảnh preview từ vựng */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1 pr-3">
              <Text className="text-[20px] font-extrabold text-white font-nunito leading-tight">
                {fsrsOverview.dueCount} thẻ đến hạn ôn
              </Text>
              <Text className="text-[12.5px] font-medium text-neutral-300 font-inter mt-1 leading-snug">
                Ôn ngay để đưa từ vựng vào phản xạ dài hạn.
              </Text>

              {/* Dải ảnh thumbnails xem trước từ vựng thực tế trong phiên */}
              {previewDueItems.length > 0 && (
                <View className="flex-row items-center gap-2 mt-2.5">
                  <View className="flex-row -space-x-2">
                    {previewDueItems.slice(0, 3).map((item, idx) => (
                      <View
                        key={item.id || idx}
                        className="w-8 h-8 rounded-full border-2 border-mascot-navy overflow-hidden bg-neutral-700"
                      >
                        {item.imageUrl ? (
                          <Image source={{ uri: item.imageUrl }} className="w-full h-full" resizeMode="cover" />
                        ) : (
                          <View className="w-full h-full items-center justify-center bg-primary-700">
                            <Text className="text-[10px] text-white font-bold">{item.word.charAt(0).toUpperCase()}</Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                  <Text className="text-[11.5px] font-medium text-neutral-300 font-inter" numberOfLines={1}>
                    {previewDueItems.map(i => i.word).join(', ')}
                  </Text>
                </View>
              )}
            </View>

            {/* Snapy đọc sách */}
            <View className="shrink-0 items-center justify-center w-20 h-20">
              <Snapy pose="doc_sach" animation="idle" style={{ width: 76, height: 76 }} />
            </View>
          </View>

          {/* Primary CTA Tactile 3D Button (≥ 48 dp) */}
          <Pressable
            onPress={() => router.push('/study/srs-review' as any)}
            className="h-13 w-full bg-primary-500 rounded-xl flex-row items-center justify-center gap-2 border-b-4 border-primary-700 active:border-b-0 active:translate-y-1"
          >
            <Text className="text-white font-extrabold text-[15px] font-nunito uppercase tracking-wider">
              ÔN NGAY ({fsrsOverview.dueCount} THẺ)
            </Text>
            <ArrowRightIcon size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    );
  }

  // =========================================================
  // STATE 2: newUser (Người mới chưa có từ nào)
  // =========================================================
  if (hubState === 'newUser') {
    return (
      <View className="px-5 mb-4">
        <View
          className="bg-white rounded-3xl p-5 border border-mascot-200/80 border-b-4 border-b-mascot-300/60 overflow-hidden"
          style={SOFT_HERO_SHADOW}
        >
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1 pr-3">
              <View className="bg-mascot-100/70 self-start px-2.5 py-0.5 rounded-md border border-mascot-200 mb-2">
                <Text className="text-[11px] font-extrabold text-mascot-800 uppercase tracking-wider font-nunito">
                  BẮT ĐẦU VỚI SNAPVOCAB
                </Text>
              </View>
              <Text className="text-[19px] font-extrabold text-neutral-800 font-nunito leading-snug">
                Biến đồ vật quanh bạn thành từ tiếng Anh
              </Text>
              <Text className="text-[12.5px] font-medium text-neutral-500 font-inter mt-1 leading-relaxed">
                Chụp ảnh một món đồ để học ngay cách gọi tên và phát âm tự nhiên.
              </Text>
            </View>

            <View className="shrink-0 items-center justify-center w-20 h-20">
              <Snapy pose="chao_mung" animation="bounce" style={{ width: 80, height: 80 }} />
            </View>
          </View>

          {/* Nút hành động chụp từ đầu tiên */}
          <Pressable
            onPress={() => router.push('/(tabs)/scan' as any)}
            className="h-13 w-full bg-mascot-500 rounded-xl flex-row items-center justify-center gap-2 border-b-4 border-mascot-700 active:border-b-0 active:translate-y-1 mb-2.5"
          >
            <CameraIcon size={18} color="#FFFFFF" />
            <Text className="text-white font-extrabold text-[15px] font-nunito uppercase tracking-wider">
              CHỤP TỪ ĐẦU TIÊN
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/topics' as any)}
            className="py-1 items-center justify-center active:opacity-70"
          >
            <Text className="text-[12.5px] font-bold text-neutral-500 font-inter">
              Hoặc khám phá các chủ đề có sẵn →
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // =========================================================
  // STATE 3: inProgress (Đang có bài học dở dang)
  // =========================================================
  if (hubState === 'inProgress' && activeSession) {
    const sessionPercent = Math.round((activeSession.progress / Math.max(1, activeSession.total)) * 100);

    return (
      <View className="px-5 mb-4">
        <View
          className="bg-white rounded-3xl p-5 border border-neutral-200/70 border-b-4 border-b-neutral-300 overflow-hidden"
          style={SOFT_HERO_SHADOW}
        >
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-2">
              <Text className="font-extrabold text-[11px] text-primary-600 uppercase tracking-wider font-nunito bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
                {activeSession.level}
              </Text>
              <Text className="font-extrabold text-[11px] text-neutral-400 uppercase tracking-wider font-nunito">
                BÀI ĐANG HỌC
              </Text>
            </View>
            <Text className="text-[12px] font-medium text-neutral-400 font-inter">
              {activeSession.lastStudiedAt}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1 pr-3">
              <Text className="text-[19px] font-extrabold text-neutral-800 font-nunito mb-0.5">
                {activeSession.topicName}
              </Text>
              <Text className="text-[13px] font-medium text-neutral-500 font-inter mb-2">
                Bài {activeSession.lessonNumber}: {activeSession.lessonTitle} · {activeSession.progress}/{activeSession.total} từ
              </Text>

              {/* Progress mini bar */}
              <View className="flex-row items-center gap-2.5">
                <View className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <View className="h-full bg-primary-500 rounded-full" style={{ width: `${sessionPercent}%` }} />
                </View>
                <Text className="text-[12px] font-extrabold text-neutral-600 font-nunito tabular-nums">
                  {sessionPercent}%
                </Text>
              </View>
            </View>

            <View className="shrink-0 items-center justify-center w-18 h-18">
              <Snapy pose="kham_pha" animation="idle" style={{ width: 72, height: 72 }} />
            </View>
          </View>

          <Pressable
            onPress={() => router.push('/study/flashcard' as any)}
            className="h-13 w-full bg-primary-500 rounded-xl flex-row items-center justify-center gap-2 border-b-4 border-primary-700 active:border-b-0 active:translate-y-1"
          >
            <PlayIcon size={16} color="#FFFFFF" fill="#FFFFFF" />
            <Text className="text-white font-extrabold text-[15px] font-nunito uppercase tracking-wider">
              TIẾP TỤC BÀI {activeSession.lessonNumber}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // =========================================================
  // STATE 4: hasNewWords (Có từ mới lưu, chuẩn bị làm quen)
  // =========================================================
  if (hubState === 'hasNewWords') {
    return (
      <View className="px-5 mb-4">
        <View
          className="bg-white rounded-3xl p-5 border border-neutral-200/70 border-b-4 border-b-neutral-300 overflow-hidden"
          style={SOFT_HERO_SHADOW}
        >
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1 pr-3">
              <View className="bg-info-50 self-start px-2 py-0.5 rounded-md border border-info-100 mb-2">
                <Text className="text-[11px] font-extrabold text-info-600 uppercase tracking-wider font-nunito">
                  TỪ MỚI ĐÃ LƯU
                </Text>
              </View>
              <Text className="text-[19px] font-extrabold text-neutral-800 font-nunito leading-snug">
                Làm quen {recentSavedWords.length} từ vựng mới
              </Text>
              <Text className="text-[12.5px] font-medium text-neutral-500 font-inter mt-1">
                Bắt đầu học để thuật toán FSRS lập lịch ôn tập thông minh cho bạn.
              </Text>
            </View>

            <View className="shrink-0 items-center justify-center w-20 h-20">
              <Snapy pose="to_mo" animation="idle" style={{ width: 74, height: 74 }} />
            </View>
          </View>

          <Pressable
            onPress={() => router.push('/study/flashcard' as any)}
            className="h-13 w-full bg-primary-500 rounded-xl flex-row items-center justify-center gap-2 border-b-4 border-primary-700 active:border-b-0 active:translate-y-1"
          >
            <Text className="text-white font-extrabold text-[15px] font-nunito uppercase tracking-wider">
              HỌC TỪ MỚI NGAY
            </Text>
            <ArrowRightIcon size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    );
  }

  // =========================================================
  // STATE 5: completed (Đã ôn xong & hoàn thành mục tiêu)
  // =========================================================
  return (
    <View className="px-5 mb-4">
      <View
        className="bg-white rounded-3xl p-5 border border-primary-200/70 border-b-4 border-b-primary-300/50 overflow-hidden"
        style={SOFT_HERO_SHADOW}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1 pr-3">
            <View className="flex-row items-center gap-1.5 bg-primary-50 self-start px-2.5 py-0.5 rounded-full border border-primary-200 mb-2">
              <CheckCircle2Icon size={13} color="#58CC02" />
              <Text className="text-[11px] font-extrabold text-primary-700 uppercase tracking-wider font-nunito">
                ĐÃ HOÀN THÀNH HÔM NAY
              </Text>
            </View>
            <Text className="text-[19px] font-extrabold text-neutral-800 font-nunito leading-tight">
              Trí nhớ đạt trạng thái tối ưu!
            </Text>
            <Text className="text-[12.5px] font-medium text-neutral-500 font-inter mt-1 leading-relaxed">
              Bạn không còn thẻ nào quá hạn. Hãy mở rộng vốn từ qua các chủ đề mới.
            </Text>
          </View>

          <View className="shrink-0 items-center justify-center w-20 h-20">
            <Snapy pose="tu_hao" animation="idle" style={{ width: 78, height: 78 }} />
          </View>
        </View>

        <Pressable
          onPress={() => router.push('/topics' as any)}
          className="h-13 w-full bg-primary-500 rounded-xl flex-row items-center justify-center gap-2 border-b-4 border-primary-700 active:border-b-0 active:translate-y-1"
        >
          <Text className="text-white font-extrabold text-[15px] font-nunito uppercase tracking-wider">
            KHÁM PHÁ THÊM CHỦ ĐỀ
          </Text>
          <ArrowRightIcon size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
