import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Animated, Dimensions, Modal, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeftIcon,
  TrophyIcon,
  LockIcon,
  UnlockIcon,
  FlameIcon,
  Gamepad2Icon,
  BookOpenIcon,
  TargetIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

const { width, height } = Dimensions.get('window');

// ==========================================
// MOCK DATA (Thay đổi để test các state)
// ==========================================
const MOCK_STATE = {
  isNewUser: false, // Set true để xem giao diện User mới
  isLevelUp: false, // Set true để kích hoạt màn hình Ăn mừng Level Up
  currentXP: 2850, // Test <2800 cho Normal, >2800 cho Near Level Up
  targetXP: 3000,
  level: 12
};

const MOCK_EVENTS = [
  { id: '1', title: 'Quiz hoàn thành', xp: 20, time: 'Hôm nay', icon: Gamepad2Icon, color: 'bg-primary-50 text-primary-500' },
  { id: '2', title: 'Ôn tập từ (SRS)', xp: 10, time: 'Hôm nay', icon: BookOpenIcon, color: 'bg-warning-50 text-warning-500' },
  { id: '3', title: 'Hoàn thành mục tiêu', xp: 50, time: 'Hôm qua', icon: TargetIcon, color: 'bg-success-50 text-success-500' },
];

export default function LevelProgressScreen() {
  const [showLevelUp, setShowLevelUp] = useState(MOCK_STATE.isLevelUp);
  
  // Data overrides for Empty State
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
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-neutral-100 z-10">
        <Pressable 
          onPress={() => router.back()} 
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100 -ml-2"
        >
          <ArrowLeftIcon size={24} className="text-mascot-navy" />
        </Pressable>
        <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito flex-1 text-center pr-8">
          Tiến độ Level
        </Text>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. HERO LEVEL BADGE */}
        <View className="items-center pt-8 pb-4">
          <View className="relative mb-3">
            <View className="w-24 h-24 bg-warning-50 rounded-full items-center justify-center border-4 border-warning-200 shadow-lg shadow-warning-500/20">
              <TrophyIcon size={48} className="text-warning-500" fill="#FBBF24" />
            </View>
            <View className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
              <View className="bg-primary-500 w-8 h-8 rounded-full items-center justify-center border border-primary-600">
                <Text className="font-extrabold text-[14px] text-white font-nunito">{level}</Text>
              </View>
            </View>
          </View>
          <Text className="font-extrabold text-[32px] text-mascot-navy font-nunito uppercase tracking-widest">
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
                style={{ transform: [{ scale: pulseAnim }], opacity: 0.1 }}
                className="absolute inset-0 bg-warning-500"
              />
            )}

            <View className="items-center mb-5">
              <Text className="font-extrabold text-[36px] text-primary-600 font-nunito leading-tight">
                {xp.toLocaleString()} <Text className="text-[20px] text-primary-400">XP</Text>
              </Text>
              <Text className="font-bold text-[14px] text-neutral-400 font-inter uppercase tracking-widest">XP hiện tại</Text>
            </View>

            <View className="h-5 bg-neutral-100 rounded-full overflow-hidden mb-3 border border-neutral-200/50">
              <Animated.View 
                className="h-full bg-primary-500 rounded-full" 
                style={{ width: `${progressPercent}%` }}
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
              <View className="mt-4 bg-warning-50 px-4 py-2 rounded-xl flex-row items-center justify-center gap-2 border border-warning-200">
                <FlameIcon size={16} className="text-warning-600" fill="#F97316" />
                <Text className="font-bold text-[14px] text-warning-700 font-inter">Chỉ còn {remainingXP} XP nữa! 🔥</Text>
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

        {/* 4. RECENT XP EVENTS */}
        <View className="px-5 mb-8">
          <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-4">XP gần đây</Text>
          
          {MOCK_STATE.isNewUser ? (
            <View className="bg-white rounded-[20px] p-6 border border-neutral-100 items-center justify-center border-dashed">
              <Snapy pose="curious" className="w-20 h-20 mb-3 opacity-60" />
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

        {/* 5. LEVEL BENEFITS */}
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
          </View>
        </View>

      </ScrollView>

      {/* 6. LEVEL UP MODAL CELEBRATION */}
      <Modal
        visible={showLevelUp}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/80 items-center justify-center px-6 pt-10">
          {renderConfetti()}
          
          <Snapy pose="happy" className="w-48 h-48 mb-6 z-10" />
          
          <Text className="font-extrabold text-[24px] text-warning-400 font-nunito uppercase tracking-widest mb-2">
            Level Up! 🎉
          </Text>
          <Text className="font-extrabold text-[48px] text-white font-nunito mb-8">
            LEVEL {level + 1}
          </Text>

          <View className="bg-white/10 w-full p-6 rounded-3xl border border-white/20 items-center mb-10">
            <Text className="font-bold text-[14px] text-neutral-300 font-inter uppercase tracking-widest mb-4">
              Phần thưởng mới
            </Text>
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 bg-primary-500/20 rounded-full items-center justify-center border border-primary-500">
                <UnlockIcon size={24} className="text-primary-400" />
              </View>
              <Text className="font-bold text-[18px] text-white font-inter">Khung Avatar Tinh tú</Text>
            </View>
          </View>

          <Pressable 
            onPress={() => setShowLevelUp(false)}
            className="w-full h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center z-10"
          >
            <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wide">
              TUYỆT VỜI!
            </Text>
          </Pressable>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
