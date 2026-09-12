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
      {/* Hàng tiêu đề chính & XP Badge */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-1 pr-2">
          <Text className="text-[24px] font-extrabold text-neutral-800 font-nunito tracking-tight">
            Học tập
          </Text>
          <Text className="text-[13px] font-medium text-neutral-500 font-inter mt-0.5" numberOfLines={1}>
            {getEncouragement()}
          </Text>
        </View>

        {/* XP Badge với token reward chuẩn, không viền đen */}
        <View className="flex-row items-center gap-1.5 bg-reward-50 border border-reward-200 px-2.5 py-1.5 rounded-xl shrink-0">
          <XPOrb3D size="xs" />
          <Text className="font-extrabold text-[12px] text-reward-700 font-nunito">
            +{xpReward} XP
          </Text>
        </View>
      </View>

      {/* Thanh tiến độ mục tiêu ngày */}
      {hubState !== 'newUser' && (
        <View className="mt-1">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-wider font-nunito">
              MỤC TIÊU HÔM NAY
            </Text>
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
