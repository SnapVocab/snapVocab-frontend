import React from 'react';
import { View, Text } from 'react-native';
import { XPOrb3D } from '@/components/snapvocab';
import { HubState } from '@/lib/learningState';

interface LearningHeaderProps {
  learned: number;
  target: number;
  xpReward: number;
  hubState: HubState;
}

export function LearningHeader({
  learned,
  target,
  xpReward,
  hubState,
}: LearningHeaderProps) {
  const progressPercent = Math.min(100, Math.round((learned / Math.max(1, target)) * 100));

  const getEncouragement = () => {
    switch (hubState) {
      case 'newUser':
        return 'Chụp lại thế giới quanh bạn để bắt đầu học từ đầu tiên!';
      case 'hasDue':
        return 'Củng cố phản xạ trước khi đường cong lãng quên tác động.';
      case 'inProgress':
        return 'Tiếp tục bài học dở để tiến gần hơn đến mục tiêu ngày.';
      case 'hasNewWords':
        return 'Khám phá và ghi nhớ những từ bạn vừa lưu gần đây.';
      case 'completed':
        return 'Xuất sắc! Bạn đã hoàn thành mục tiêu rèn luyện hôm nay.';
      default:
        return 'Củng cố phản xạ & chuyển từ vựng vào trí nhớ dài hạn.';
    }
  };

  return (
    <View className="px-5 pt-3 pb-3">
      {/* Hàng tiêu đề chính (chừa khoảng trống an toàn bên phải cho nút floating/dev tools) */}
      <View className="mb-2 pr-16">
        <Text className="text-[24px] font-extrabold text-neutral-800 font-nunito tracking-tight">
          Học tập
        </Text>
        <Text className="text-[13px] font-medium text-neutral-500 font-inter mt-0.5 leading-snug">
          {getEncouragement()}
        </Text>
      </View>

      {/* Thanh tiến độ mục tiêu ngày */}
      {hubState !== 'newUser' && (
        <View className="mt-1">
          <View className="flex-row items-center justify-between mb-1.5">
            <View className="flex-row items-center gap-2">
              <Text className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-wider font-nunito">
                MỤC TIÊU HÔM NAY
              </Text>
              <View className="flex-row items-center gap-1 bg-reward-50 border border-reward-200 px-2 py-0.5 rounded-md">
                <XPOrb3D size="xs" />
                <Text className="font-extrabold text-[11px] text-reward-700 font-nunito tabular-nums">
                  +{xpReward} XP
                </Text>
              </View>
            </View>
            <Text className="text-[12px] font-bold text-neutral-600 font-nunito tabular-nums">
              {learned}/{target} từ · {progressPercent}%
            </Text>
          </View>
          <View className="h-2 bg-neutral-100 rounded-full overflow-hidden">
            <View
              className="h-full bg-primary-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
        </View>
      )}
    </View>
  );
}
