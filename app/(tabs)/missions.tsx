import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  CheckIcon,
  PlayIcon,
  GiftIcon,
  CircleDashedIcon,
  CheckCircle2Icon,
  FlameIcon,
  CoinsIcon,
  ZapIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// ==========================================
// MOCK DATA
// ==========================================
type MissionState = 'IN_PROGRESS' | 'COMPLETED' | 'CLAIMED';

interface Mission {
  id: string;
  title: string;
  icon: React.ElementType;
  progress: number;
  total: number;
  coinReward: number;
  xpReward: number;
  state: MissionState;
  actionRoute?: string;
}

const INITIAL_MISSIONS: Mission[] = [
  { id: 'm1', title: 'Học 10 từ mới', icon: FlameIcon, progress: 10, total: 10, coinReward: 50, xpReward: 100, state: 'COMPLETED' },
  { id: 'm2', title: 'Hoàn thành 2 bài Quiz', icon: PlayIcon, progress: 1, total: 2, coinReward: 30, xpReward: 50, state: 'IN_PROGRESS', actionRoute: '/(tabs)/learn' },
  { id: 'm3', title: 'Ôn tập 20 Flashcards', icon: CircleDashedIcon, progress: 20, total: 20, coinReward: 40, xpReward: 80, state: 'CLAIMED' },
  { id: 'm4', title: 'Đạt 5 câu đúng liên tiếp', icon: CheckIcon, progress: 3, total: 5, coinReward: 20, xpReward: 50, state: 'IN_PROGRESS', actionRoute: '/(tabs)/learn' },
];

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
// Giả định hôm nay là T4 (index 2), T2 T3 đã hoàn thành.
const STAMP_STATES = ['completed', 'completed', 'current', 'locked', 'locked', 'locked', 'locked'];

export default function MissionsScreen() {
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [showCelebration, setShowCelebration] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Tính toán số liệu chung
  const totalMissions = missions.length;
  const completedCount = missions.filter(m => m.state === 'COMPLETED' || m.state === 'CLAIMED').length;
  const stampsCount = STAMP_STATES.filter(s => s === 'completed').length;
  const isChestReady = stampsCount === 7;

  const handleClaim = (id: string) => {
    // Animation thu phóng nhẹ
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.05, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start();

    // Hiện Snapy chớp nhoáng
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);

    // Cập nhật state
    setMissions(prev => prev.map(m => 
      m.id === id ? { ...m, state: 'CLAIMED' } : m
    ));
  };

  const renderMissionCard = (mission: Mission) => {
    const isCompleted = mission.state === 'COMPLETED';
    const isClaimed = mission.state === 'CLAIMED';
    const progressPercent = (mission.progress / mission.total) * 100;
    const Icon = mission.icon;

    return (
      <View 
        key={mission.id}
        className={cn(
          "bg-white rounded-2xl p-4 border-2 shadow-sm shadow-black/5 mb-4",
          isCompleted ? "border-warning-400 bg-warning-50/30" : "border-neutral-100",
          isClaimed ? "opacity-70" : "opacity-100"
        )}
      >
        <View className="flex-row items-start mb-3">
          <View className={cn(
            "w-12 h-12 rounded-full items-center justify-center mr-3",
            isClaimed ? "bg-success-100" : isCompleted ? "bg-warning-100" : "bg-primary-100"
          )}>
            <Icon size={24} className={cn(
              isClaimed ? "text-success-600" : isCompleted ? "text-warning-600" : "text-primary-600"
            )} />
          </View>
          
          <View className="flex-1 pt-1">
            <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-1">{mission.title}</Text>
            
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center gap-1">
                  <CoinsIcon size={14} className="text-warning-500" fill="#FBBF24" />
                  <Text className="font-bold text-[13px] text-warning-600 font-inter">+{mission.coinReward}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <ZapIcon size={14} className="text-info-500" fill="#38BDF8" />
                  <Text className="font-bold text-[13px] text-info-600 font-inter">+{mission.xpReward}</Text>
                </View>
              </View>
              <Text className="font-bold text-[13px] text-neutral-500 font-inter">{mission.progress} / {mission.total}</Text>
            </View>

            <View className="h-2.5 bg-neutral-100 rounded-full overflow-hidden w-full">
              <View 
                className={cn(
                  "h-full rounded-full",
                  isClaimed ? "bg-success-500" : isCompleted ? "bg-warning-500" : "bg-primary-500"
                )}
                style={{ width: `${progressPercent}%` }} 
              />
            </View>
          </View>
        </View>

        {/* Action Button */}
        {mission.state === 'IN_PROGRESS' && (
          <Pressable 
            onPress={() => mission.actionRoute && router.push(mission.actionRoute as any)}
            className="h-12 bg-neutral-100 rounded-xl active:bg-neutral-200 items-center justify-center border border-neutral-200"
          >
            <Text className="font-extrabold text-[14px] text-mascot-navy uppercase font-nunito tracking-wide">BẮT ĐẦU</Text>
          </Pressable>
        )}

        {mission.state === 'COMPLETED' && (
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable 
              onPress={() => handleClaim(mission.id)}
              className="h-12 bg-warning-500 rounded-xl active:bg-warning-600 items-center justify-center border-b-[4px] border-warning-700 active:translate-y-[2px] active:border-b-[2px] "
            >
              <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-widest">NHẬN THƯỞNG</Text>
            </Pressable>
          </Animated.View>
        )}

        {mission.state === 'CLAIMED' && (
          <View className="h-12 bg-neutral-100 rounded-xl items-center justify-center flex-row gap-2 border border-neutral-200 opacity-80">
            <CheckCircle2Icon size={18} className="text-success-500" />
            <Text className="font-extrabold text-[14px] text-success-600 uppercase font-nunito tracking-wide">ĐÃ NHẬN</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* HEADER */}
      <View className="px-5 py-3 border-b border-neutral-100 bg-white items-center z-10">
        <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">Nhiệm vụ</Text>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. DAILY MISSION SUMMARY */}
        <View className="bg-primary-500 rounded-3xl p-6 border-b-[6px] border-primary-700 shadow-sm mb-6 flex-row items-center">
          <View className="flex-1">
            <Text className="font-extrabold text-[22px] text-white font-nunito mb-1">Nhiệm vụ Ngày</Text>
            <Text className="font-medium text-[13px] text-primary-100 font-inter mb-4">
              Hoàn thành nhiệm vụ để nhận thưởng!
            </Text>
            
            <View className="bg-white/20 px-3 py-1.5 rounded-lg self-start flex-row items-center gap-1.5">
              <CheckCircle2Icon size={14} className="text-white" />
              <Text className="font-bold text-[13px] text-white font-inter">{completedCount} / {totalMissions} hoàn thành</Text>
            </View>
          </View>
          
          <View className="items-center justify-center w-20">
            {/* Mock Circular Progress */}
            <View className="w-16 h-16 rounded-full border-4 border-white/20 items-center justify-center relative">
              <View className="absolute inset-0 border-4 border-white rounded-full border-l-transparent border-b-transparent" style={{ transform: [{ rotate: '45deg' }] }} />
              <Text className="font-extrabold text-[16px] text-white font-nunito">{Math.round((completedCount/totalMissions)*100)}%</Text>
            </View>
            <Text className="font-bold text-[10px] text-primary-200 font-inter uppercase mt-2">08:42:15</Text>
          </View>
        </View>

        {/* 2. WEEKLY STREAK & CHEST */}
        <View className="mb-8">
          <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-4">Chuỗi Tuần (Weekly Streak)</Text>
          
          <View className="bg-white rounded-[24px] p-5 border border-neutral-100 shadow-sm shadow-black/5">
            {/* Stamp Tracker */}
            <View className="flex-row justify-between mb-6">
              {WEEKDAYS.map((day, idx) => {
                const state = STAMP_STATES[idx];
                const isCompleted = state === 'completed';
                const isCurrent = state === 'current';
                
                return (
                  <View key={day} className="items-center">
                    <Text className={cn(
                      "font-bold text-[11px] font-inter mb-2",
                      isCurrent ? "text-primary-600" : "text-neutral-400"
                    )}>{day}</Text>
                    
                    <View className={cn(
                      "w-10 h-10 rounded-xl items-center justify-center border-2",
                      isCompleted ? "bg-success-50 border-success-400 shadow-sm" : 
                      isCurrent ? "bg-white border-primary-300 border-dashed" : 
                      "bg-neutral-50 border-neutral-200"
                    )}>
                      {isCompleted && <CheckIcon size={20} className="text-success-500" />}
                      {!isCompleted && !isCurrent && <View className="w-2 h-2 rounded-full bg-neutral-200" />}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Weekly Chest Card */}
            <View className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 flex-row items-center">
              <View className="w-16 h-16 bg-white rounded-xl items-center justify-center shadow-sm mr-4 border border-neutral-100">
                <GiftIcon size={32} className={isChestReady ? "text-warning-500" : "text-neutral-300"} />
              </View>
              <View className="flex-1">
                <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-1">Rương Báu Tuần</Text>
                <Text className="font-medium text-[12px] text-neutral-500 font-inter mb-2">
                  Hoàn thành 7 ngày để mở rương!
                </Text>
                <View className="flex-row items-center gap-2">
                  <View className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <View className="h-full bg-warning-500 rounded-full" style={{ width: `${(stampsCount/7)*100}%` }} />
                  </View>
                  <Text className="font-bold text-[12px] text-neutral-500 font-inter">{stampsCount}/7</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 3. DAILY MISSIONS LIST */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">Nhiệm vụ hôm nay</Text>
            <Text className="font-bold text-[13px] text-neutral-400 font-inter">Làm mới lúc 00:00</Text>
          </View>
          
          {missions.map(renderMissionCard)}
        </View>

      </ScrollView>

      {/* SNAPY CELEBRATION OVERLAY */}
      {showCelebration && (
        <View className="absolute inset-0 items-center justify-center bg-black/20 z-50 pointer-events-none">
          <View className="bg-white rounded-3xl p-6 items-center shadow-xl transform -translate-y-10">
            <Snapy pose="happy" className="w-32 h-32 mb-4" />
            <Text className="font-extrabold text-[20px] text-warning-500 font-nunito">TUYỆT VỜI!</Text>
            <Text className="font-bold text-[14px] text-neutral-500 font-inter mt-1">+ Coin & XP</Text>
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}
