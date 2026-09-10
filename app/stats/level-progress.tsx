import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Animated, Dimensions, Modal, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeftIcon,
  LockIcon,
  UnlockIcon,
  Gamepad2Icon,
  BookOpenIcon,
  TargetIcon,
  SparklesIcon,
  CheckCircle2Icon,
  ZapIcon,
  AwardIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';
import { 
  AchievementTrophy3D, 
  StreakFlame3D, 
  Coin3D, 
  RewardGift3D, 
  RewardChest3D, 
  Gem3D,
  XPOrb3D 
} from '@/components/snapvocab';

const { width, height } = Dimensions.get('window');

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_STATE = {
  isNewUser: false,
  isLevelUp: false,
  currentXP: 2850,
  targetXP: 3000,
  level: 12
};

const MOCK_EVENTS = [
  { id: '1', title: 'Quiz hoàn thành', xp: 20, time: 'Hôm nay', icon: Gamepad2Icon, color: 'bg-primary-50 text-primary-500' },
  { id: '2', title: 'Ôn tập từ (SRS)', xp: 10, time: 'Hôm nay', icon: BookOpenIcon, color: 'bg-warning-50 text-warning-500' },
  { id: '3', title: 'Hoàn thành mục tiêu', xp: 50, time: 'Hôm qua', icon: TargetIcon, color: 'bg-success-50 text-success-500' },
];

const MILESTONES_ROADMAP = [
  {
    level: 11,
    title: 'Huy hiệu Khởi hành',
    reward: '30 Coin',
    status: 'completed',
    iconType: 'coin'
  },
  {
    level: 12,
    title: 'Cấp độ hiện tại của bạn',
    reward: '2,850 / 3,000 XP (95%)',
    status: 'current',
    iconType: 'current'
  },
  {
    level: 13,
    title: 'Khung Avatar Tinh tú',
    reward: '+50 Coin & Khung Tinh tú',
    status: 'next',
    iconType: 'gift'
  },
  {
    level: 14,
    title: 'Thẻ Booster x2 XP',
    reward: 'Gấp đôi XP trong 30 phút',
    status: 'upcoming',
    iconType: 'booster'
  },
  {
    level: 15,
    title: 'Học Giả Tinh Anh',
    reward: '+100 Coin & Danh hiệu Độc quyền',
    status: 'upcoming',
    iconType: 'gem'
  },
  {
    level: 20,
    title: 'Bậc Thầy Từ Vựng (Master)',
    reward: 'Rương Báu Huyền Thoại + 500 Coin',
    status: 'upcoming',
    iconType: 'chest'
  }
];

export default function LevelProgressScreen() {
  const [showLevelUp, setShowLevelUp] = useState(MOCK_STATE.isLevelUp);
  
  const xp = MOCK_STATE.isNewUser ? 0 : MOCK_STATE.currentXP;
  const level = MOCK_STATE.isNewUser ? 1 : MOCK_STATE.level;
  const target = MOCK_STATE.isNewUser ? 100 : MOCK_STATE.targetXP;
  
  const progressPercent = (xp / target) * 100;
  const remainingXP = target - xp;
  const isNearLevelUp = !MOCK_STATE.isNewUser && remainingXP <= 200 && remainingXP > 0;

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isNearLevelUp) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
        ])
      ).start();
    }
  }, [isNearLevelUp]);

  useEffect(() => {
    if (showLevelUp) {
      confettiAnim.setValue(0);
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: true
      }).start();
    }
  }, [showLevelUp]);

  // Simple Confetti Generator for Level Up
  const renderConfetti = () => {
    const pieces = Array.from({ length: 30 }).map((_, i) => {
      const left = Math.random() * width;
      const size = Math.random() * 10 + 6;
      const rotate = Math.random() * 360;
      const colors = ['#34D399', '#60A5FA', '#FBBF24', '#F87171', '#A78BFA'];
      const color = colors[i % colors.length];

      const translateY = confettiAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-50, height]
      });
      const rotateInterpolate = confettiAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [`${rotate}deg`, `${rotate + 360}deg`]
      });

      return (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left,
            top: -50,
            width: size,
            height: size,
            backgroundColor: color,
            transform: [{ translateY }, { rotate: rotateInterpolate }],
            opacity: confettiAnim.interpolate({
              inputRange: [0, 0.8, 1],
              outputRange: [1, 1, 0]
            })
          }}
        />
      );
    });

    return <View className="absolute inset-0 z-50 pointer-events-none overflow-hidden">{pieces}</View>;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* 1. HEADER */}
      <View className="bg-white border-b border-neutral-100 z-10">
        <View className="max-w-md w-full mx-auto px-4 py-3 flex-row items-center justify-between">
          <Pressable 
            onPress={() => router.back()} 
            className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100 -ml-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeftIcon size={22} className="text-mascot-navy" />
          </Pressable>
          <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito flex-1 text-center pr-8">
            Tiến độ Level
          </Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="max-w-md w-full mx-auto">
          
          {/* 2. HERO LEVEL BADGE */}
          <View className="items-center pt-8 pb-4">
            <View className="relative mb-3 items-center justify-center">
              <AchievementTrophy3D size="xl" />
              <View className="absolute -bottom-2 right-2 bg-white rounded-full p-1 shadow-md">
                <View className="bg-primary-500 w-9 h-9 rounded-full items-center justify-center border-2 border-white shadow-sm">
                  <Text className="font-extrabold text-[15px] text-white font-nunito">{level}</Text>
                </View>
              </View>
            </View>
            <Text className="font-extrabold text-[32px] text-mascot-navy font-nunito uppercase tracking-widest mt-2">
              LEVEL {level}
            </Text>
            {MOCK_STATE.isNewUser && (
              <Text className="font-bold text-[14px] text-neutral-500 font-inter mt-1">Bắt đầu hành trình của bạn!</Text>
            )}
          </View>

          {/* 3. XP PROGRESS */}
          <View className="px-5 mb-8">
            <View className="bg-white rounded-[24px] p-6 border-2 border-neutral-100 shadow-sm shadow-black/5 relative overflow-hidden">
              
              {/* Glow if near level up */}
              {isNearLevelUp && (
                <Animated.View 
                  style={{ transform: [{ scale: pulseAnim }], opacity: 0.08 }}
                  className="absolute inset-0 bg-warning-500 pointer-events-none"
                />
              )}

              <View className="items-center mb-5">
                <Text className="font-extrabold text-[36px] text-primary-600 font-nunito leading-tight">
                  {xp.toLocaleString()} <Text className="text-[20px] text-primary-400">XP</Text>
                </Text>
                <Text className="font-bold text-[14px] text-neutral-400 font-inter uppercase tracking-widest">XP hiện tại</Text>
              </View>

              {/* Robust Progress Bar for Web & Native */}
              <View className="h-5 bg-neutral-100 rounded-full overflow-hidden mb-3 border border-neutral-200/50">
                <View 
                  className="h-full bg-primary-500 rounded-full" 
                  style={{ 
                    width: `${Math.min(100, Math.max(0, progressPercent))}%`,
                    backgroundColor: '#58CC02' 
                  }}
                />
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="font-extrabold text-[14px] text-mascot-navy font-inter">
                  {xp.toLocaleString()} / {target.toLocaleString()} XP
                </Text>
                <Text className="font-bold text-[13px] text-neutral-500 font-inter">
                  Level {level + 1}
                </Text>
              </View>

              {isNearLevelUp && (
                <View className="mt-4 bg-warning-50 px-4 py-2.5 rounded-xl flex-row items-center justify-center gap-2 border border-warning-200">
                  <StreakFlame3D size="xs" animation="pulse" />
                  <Text className="font-bold text-[14px] text-warning-800 font-inter">Chỉ còn {remainingXP} XP nữa để lên cấp!</Text>
                </View>
              )}
              {!isNearLevelUp && remainingXP > 0 && (
                <View className="mt-4 items-center">
                  <Text className="font-medium text-[13px] text-neutral-400 font-inter">
                    Còn {remainingXP.toLocaleString()} XP để lên Level {level + 1}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* 4. LEVEL MILESTONES ROADMAP (GIAI ĐOẠN 3) */}
          <View className="px-5 mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">Lộ trình Mốc thưởng</Text>
              <View className="bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-100">
                <Text className="text-[12px] font-bold text-primary-700 font-inter">Mục tiêu Level 20</Text>
              </View>
            </View>

            <View className="bg-white rounded-[24px] p-5 border border-neutral-100 shadow-sm shadow-black/5">
              {MILESTONES_ROADMAP.map((item, idx) => {
                const isLast = idx === MILESTONES_ROADMAP.length - 1;
                const isCompleted = item.status === 'completed';
                const isCurrent = item.status === 'current';
                const isNext = item.status === 'next';

                return (
                  <View key={item.level} className="flex-row relative">
                    {/* Vertical connecting line */}
                    {!isLast && (
                      <View 
                        className={cn(
                          "absolute left-5 top-10 bottom-0 w-0.5 -ml-[1px]",
                          isCompleted ? "bg-success-400" : (isCurrent ? "bg-primary-300" : "bg-neutral-200")
                        )} 
                      />
                    )}

                    {/* Node Icon */}
                    <View className="items-center z-10 mr-4">
                      {isCompleted ? (
                        <View className="w-10 h-10 rounded-full bg-success-500 items-center justify-center shadow-sm">
                          <CheckCircle2Icon size={20} className="text-white" />
                        </View>
                      ) : isCurrent ? (
                        <View className="w-10 h-10 rounded-full bg-primary-500 items-center justify-center border-4 border-primary-200 shadow-md">
                          <Text className="font-extrabold text-[14px] text-white font-nunito">{item.level}</Text>
                        </View>
                      ) : (
                        <View className={cn(
                          "w-10 h-10 rounded-full items-center justify-center border-2",
                          isNext 
                            ? "bg-warning-50 border-warning-400 shadow-sm" 
                            : "bg-neutral-100 border-neutral-300"
                        )}>
                          <Text className={cn(
                            "font-extrabold text-[13px] font-nunito",
                            isNext ? "text-warning-700" : "text-neutral-400"
                          )}>
                            {item.level}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Milestone Card Body */}
                    <View className={cn(
                      "flex-1 mb-5 p-3.5 rounded-2xl border transition-all",
                      isCurrent 
                        ? "bg-primary-50/80 border-primary-300 shadow-sm" 
                        : isNext 
                          ? "bg-warning-50/50 border-warning-200" 
                          : isCompleted 
                            ? "bg-neutral-50/60 border-neutral-200/60 opacity-80" 
                            : "bg-white border-neutral-100"
                    )}>
                      <View className="flex-row items-center justify-between mb-1">
                        <View className="flex-row items-center gap-1.5">
                          <Text className={cn(
                            "font-extrabold text-[15px] font-nunito",
                            isCurrent ? "text-primary-800" : "text-mascot-navy"
                          )}>
                            Level {item.level}: {item.title}
                          </Text>
                        </View>
                        {isCompleted && (
                          <View className="bg-success-100 px-2 py-0.5 rounded-md">
                            <Text className="text-[10px] font-bold text-success-700 font-inter">ĐÃ ĐẠT</Text>
                          </View>
                        )}
                        {isCurrent && (
                          <View className="bg-primary-500 px-2 py-0.5 rounded-md">
                            <Text className="text-[10px] font-bold text-white font-inter">HIỆN TẠI</Text>
                          </View>
                        )}
                        {isNext && (
                          <View className="bg-warning-500 px-2 py-0.5 rounded-md">
                            <Text className="text-[10px] font-bold text-mascot-navy font-inter">MỐC KẾ TIẾP</Text>
                          </View>
                        )}
                      </View>

                      {/* Reward preview */}
                      <View className="flex-row items-center gap-2 mt-1">
                        {item.iconType === 'coin' && <Coin3D size="xs" />}
                        {item.iconType === 'gift' && <RewardGift3D size="xs" />}
                        {item.iconType === 'gem' && <Gem3D size="xs" />}
                        {item.iconType === 'chest' && <RewardChest3D size="xs" />}
                        {item.iconType === 'current' && <XPOrb3D size="xs" />}
                        {item.iconType === 'booster' && <ZapIcon size={16} className="text-warning-500" />}

                        <Text className={cn(
                          "text-[12px] font-bold font-inter",
                          isCurrent ? "text-primary-700 font-extrabold" : (isNext ? "text-warning-800" : "text-neutral-500")
                        )}>
                          {item.reward}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* 5. RECENT XP EVENTS */}
          <View className="px-5 mb-8">
            <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-4">XP gần đây</Text>
            
            {MOCK_STATE.isNewUser ? (
              <View className="bg-white rounded-[20px] p-6 border border-neutral-100 items-center justify-center border-dashed">
                <Snapy pose="to_mo" animation="idle" className="w-20 h-20 mb-3 opacity-70" />
                <Text className="font-bold text-[15px] text-neutral-500 font-inter mb-1">Chưa có hoạt động XP</Text>
                <Text className="font-medium text-[13px] text-neutral-400 font-inter text-center">Hoàn thành bài học hoặc Quiz để bắt đầu tích XP!</Text>
              </View>
            ) : (
              <View className="bg-white rounded-[20px] border border-neutral-100 overflow-hidden shadow-sm shadow-black/5">
                {MOCK_EVENTS.map((event, idx) => {
                  const Icon = event.icon;
                  return (
                    <View 
                      key={event.id}
                      className={cn(
                        "flex-row items-center p-4",
                        idx !== MOCK_EVENTS.length - 1 && "border-b border-neutral-50"
                      )}
                    >
                      <View className={cn("w-12 h-12 rounded-xl items-center justify-center mr-4", event.color)}>
                        <Icon size={24} />
                      </View>
                      <View className="flex-1">
                        <Text className="font-bold text-[15px] text-mascot-navy font-inter">{event.title}</Text>
                        <Text className="font-medium text-[12px] text-neutral-400 font-inter">{event.time}</Text>
                      </View>
                      <Text className="font-extrabold text-[18px] text-warning-500 font-nunito">+{event.xp}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* 6. LEVEL BENEFITS */}
          <View className="px-5 mb-6">
            <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-4">Quyền lợi Level {level + 1}</Text>
            
            <View className="gap-3">
              {/* Locked Benefit */}
              <View className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 flex-row items-center opacity-80">
                <View className="w-10 h-10 bg-neutral-200 rounded-full items-center justify-center mr-3">
                  <LockIcon size={20} className="text-neutral-500" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-[15px] text-neutral-600 font-inter mb-0.5">Khung Avatar Mới</Text>
                  <Text className="font-medium text-[12px] text-neutral-500 font-inter">Mở khóa khi đạt Level {level + 1}</Text>
                </View>
              </View>
              
              {/* Already Unlocked Benefit */}
              <View className="bg-white rounded-2xl p-4 border border-success-200 flex-row items-center">
                <View className="w-10 h-10 bg-success-100 rounded-full items-center justify-center mr-3">
                  <UnlockIcon size={20} className="text-success-600" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-[15px] text-success-700 font-inter mb-0.5">Huy hiệu Học giả (Level {level})</Text>
                  <Text className="font-bold text-[11px] text-success-500 font-inter uppercase tracking-wide">Đã mở khóa ✓</Text>
                </View>
              </View>

              {/* Interactive Demo Trigger */}
              <Pressable
                onPress={() => setShowLevelUp(true)}
                className="mt-3 bg-white active:bg-neutral-50 py-3.5 px-4 rounded-2xl items-center justify-center flex-row gap-2 border border-neutral-200 shadow-sm shadow-black/5"
              >
                <SparklesIcon size={18} className="text-warning-500" />
                <Text className="font-extrabold text-[14px] text-mascot-navy font-nunito">
                  Xem thử hiệu ứng Thăng cấp (Level Up Demo)
                </Text>
              </Pressable>
            </View>
          </View>

        </View>

      </ScrollView>

      {/* 7. LEVEL UP MODAL CELEBRATION */}
      <Modal
        visible={showLevelUp}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLevelUp(false)}
      >
        <View className="flex-1 bg-black/85 justify-center">
          {renderConfetti()}
          
          <ScrollView 
            contentContainerStyle={{ 
              alignItems: 'center', 
              justifyContent: 'center', 
              paddingHorizontal: 24, 
              paddingVertical: 32,
              minHeight: '100%' 
            }}
            showsVerticalScrollIndicator={false}
          >
            <Pressable 
              onPress={() => setShowLevelUp(false)}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 items-center justify-center self-end mb-2 z-20"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text className="text-white font-extrabold text-base">✕</Text>
            </Pressable>

            <Snapy pose="nhay_len" animation="celebrate" className="w-40 h-40 mb-3 z-10" />
            
            <View className="flex-row items-center gap-2 mb-1 z-10">
              <SparklesIcon size={22} className="text-warning-400" />
              <Text className="font-extrabold text-[22px] text-warning-400 font-nunito uppercase tracking-widest">
                LEVEL UP!
              </Text>
              <SparklesIcon size={22} className="text-warning-400" />
            </View>
            <Text className="font-extrabold text-[42px] text-white font-nunito mb-5 z-10">
              LEVEL {level + 1}
            </Text>

            <View className="bg-white/10 w-full max-w-xs p-5 rounded-3xl border border-white/20 items-center mb-6 z-10">
              <Text className="font-bold text-[13px] text-neutral-300 font-inter uppercase tracking-widest mb-3">
                Phần thưởng mới
              </Text>
              <View className="flex-row items-center gap-3">
                <View className="w-11 h-11 bg-primary-500/20 rounded-full items-center justify-center border border-primary-500">
                  <UnlockIcon size={22} className="text-primary-400" />
                </View>
                <Text className="font-bold text-[16px] text-white font-inter">Khung Avatar Tinh tú</Text>
              </View>
            </View>

            <Pressable 
              onPress={() => setShowLevelUp(false)}
              className="w-full max-w-xs h-13 py-3.5 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] items-center justify-center z-10 shadow-lg shadow-primary-900/30"
            >
              <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wide">
                TUYỆT VỜI!
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
