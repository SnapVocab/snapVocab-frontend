import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  Animated, 
  RefreshControl, 
  Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { 
  CheckIcon, 
  CheckCircle2Icon, 
  ClockIcon, 
  ArrowRightIcon, 
  SparklesIcon, 
  XIcon, 
  GiftIcon,
  FlameIcon,
  InfoIcon
} from 'lucide-react-native';
import { 
  MissionIcon3D, 
  RewardChest3D, 
  Coin3D, 
  XPOrb3D, 
  StreakFlame3D,
  MissionType 
} from '@/components/snapvocab';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// ==========================================
// TYPES & MOCK DATA
// ==========================================
type MissionState = 'IN_PROGRESS' | 'COMPLETED' | 'CLAIMED';

interface Mission {
  id: string;
  title: string;
  type: MissionType;
  progress: number;
  total: number;
  coinReward: number;
  xpReward: number;
  state: MissionState;
  actionRoute?: string;
}

const INITIAL_MISSIONS: Mission[] = [
  { 
    id: 'm1', 
    title: 'Học 10 từ mới', 
    type: 'vocab', // Sách từ vựng 3D
    progress: 10, 
    total: 10, 
    coinReward: 50, 
    xpReward: 100, 
    state: 'COMPLETED' 
  },
  { 
    id: 'm2', 
    title: 'Hoàn thành 2 bài Quiz', 
    type: 'challenge', // Thử thách Quiz 3D
    progress: 1, 
    total: 2, 
    coinReward: 30, 
    xpReward: 50, 
    state: 'IN_PROGRESS', 
    actionRoute: '/(tabs)/learn' 
  },
  { 
    id: 'm4', 
    title: 'Đạt 5 câu đúng liên tiếp', 
    type: 'accuracy', // Tâm ngắm 3D
    progress: 3, 
    total: 5, 
    coinReward: 20, 
    xpReward: 50, 
    state: 'IN_PROGRESS', 
    actionRoute: '/(tabs)/learn' 
  },
  { 
    id: 'm5', 
    title: 'Quét 3 đồ vật qua Camera', 
    type: 'scan', // Máy ảnh 3D
    progress: 1, 
    total: 3, 
    coinReward: 35, 
    xpReward: 70, 
    state: 'IN_PROGRESS', 
    actionRoute: '/(tabs)/scan' 
  },
  { 
    id: 'm3', 
    title: 'Ôn tập 20 Flashcards', 
    type: 'review', // Flashcard 3D
    progress: 20, 
    total: 20, 
    coinReward: 40, 
    xpReward: 80, 
    state: 'CLAIMED' 
  },
];

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const STAMP_STATES = ['completed', 'completed', 'current', 'locked', 'locked', 'locked', 'locked'];

// ==========================================
// SUB-COMPONENT: DYNAMIC CIRCULAR PROGRESS
// ==========================================
function CircularProgressRing({ 
  percent, 
  size = 64, 
  strokeWidth = 5 
}: { 
  percent: number; 
  size?: number; 
  strokeWidth?: number; 
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * Math.min(Math.max(percent, 0), 100)) / 100;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center relative">
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Background Track Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FFFFFF"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      {/* Centered Percentage Text */}
      <View className="absolute inset-0 items-center justify-center">
        <Text className="font-nunito font-extrabold text-[15px] text-white tracking-tighter">
          {percent}%
        </Text>
      </View>
    </View>
  );
}

// ==========================================
// SUB-COMPONENT: MISSION CARD ITEM
// Quản lý animation độc lập cho từng card
// ==========================================
function MissionCardItem({
  mission,
  onClaim,
}: {
  mission: Mission;
  onClaim: (mission: Mission) => void;
}) {
  const cardScale = useRef(new Animated.Value(1)).current;
  const isCompleted = mission.state === 'COMPLETED';
  const isClaimed = mission.state === 'CLAIMED';
  const progressPercent = Math.min(Math.round((mission.progress / mission.total) * 100), 100);

  const handleClaimPress = () => {
    Animated.sequence([
      Animated.timing(cardScale, { toValue: 1.04, duration: 120, useNativeDriver: true }),
      Animated.timing(cardScale, { toValue: 0.98, duration: 100, useNativeDriver: true }),
      Animated.timing(cardScale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start(() => {
      onClaim(mission);
    });
  };

  return (
    <Animated.View
      style={{ transform: [{ scale: cardScale }] }}
      className={cn(
        "rounded-2xl p-4 mb-3.5 transition-all",
        isCompleted
          ? "bg-white border-2 border-reward-500 shadow-md shadow-reward-500/10"
          : isClaimed
          ? "bg-white/80 border border-neutral-200/70 opacity-75"
          : "bg-white border border-neutral-200/80 shadow-sm shadow-black/5"
      )}
    >
      <View className="flex-row items-start mb-3">
        {/* 3D Mission Emblem */}
        <MissionIcon3D type={mission.type} size="md" style={{ marginRight: 12 }} />

        <View className="flex-1 pt-0.5">
          {/* Mission Title */}
          <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-1.5 leading-snug">
            {mission.title}
          </Text>

          {/* Reward Badges & Counter */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-3">
              <View className="flex-row items-center gap-1 bg-reward-50/60 px-2 py-0.5 rounded-md border border-reward-500/20">
                <Coin3D size="xs" />
                <Text className="font-bold text-[13px] text-reward-600 font-inter">
                  +{mission.coinReward}
                </Text>
              </View>
              <View className="flex-row items-center gap-1 bg-info-50 px-2 py-0.5 rounded-md border border-info-500/20">
                <XPOrb3D size="xs" />
                <Text className="font-bold text-[13px] text-info-600 font-inter">
                  +{mission.xpReward}
                </Text>
              </View>
            </View>

            <Text className="font-bold text-[13px] text-neutral-500 font-inter tabular-nums">
              {mission.progress} / {mission.total}
            </Text>
          </View>

          {/* Progress Bar with vibrant feedback */}
          <View className="h-2.5 bg-neutral-100 rounded-full overflow-hidden w-full">
            <View
              className={cn(
                "h-full rounded-full transition-all",
                isClaimed
                  ? "bg-neutral-300"
                  : isCompleted
                  ? "bg-reward-500"
                  : "bg-primary-500"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </View>
        </View>
      </View>

      {/* ACTION BUTTONS (Tactile Duolingo Style) */}
      {mission.state === 'IN_PROGRESS' && (
        <Pressable
          onPress={() => mission.actionRoute && router.push(mission.actionRoute as any)}
          className="h-12 bg-white rounded-xl active:bg-primary-50 items-center justify-center border-2 border-primary-500 active:translate-y-[1px] flex-row gap-2"
        >
          <Text className="font-extrabold text-[14px] text-primary-600 uppercase font-nunito tracking-wide">
            BẮT ĐẦU
          </Text>
          <ArrowRightIcon size={16} color="#58CC02" strokeWidth={2.5} />
        </Pressable>
      )}

      {mission.state === 'COMPLETED' && (
        <Pressable
          onPress={handleClaimPress}
          className="h-12 bg-reward-500 rounded-xl active:bg-reward-600 items-center justify-center border-b-[4px] border-reward-600 active:border-b-[2px] active:translate-y-[2px] flex-row gap-2 shadow-sm shadow-reward-500/30"
        >
          <SparklesIcon size={18} color="#FFFFFF" />
          <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-wider">
            NHẬN THƯỞNG
          </Text>
        </Pressable>
      )}

      {mission.state === 'CLAIMED' && (
        <View className="h-11 bg-neutral-100 rounded-xl items-center justify-center flex-row gap-2 border border-neutral-200/80">
          <CheckCircle2Icon size={17} color="#58CC02" />
          <Text className="font-bold text-[13px] text-neutral-400 uppercase font-nunito tracking-wide">
            ĐÃ NHẬN
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

// ==========================================
// MAIN SCREEN: MISSIONS DASHBOARD
// ==========================================
export default function MissionsScreen() {
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [userCoins, setUserCoins] = useState(820);
  const [refreshing, setRefreshing] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    coin: number;
    xp: number;
    title: string;
  } | null>(null);
  const [showChestModal, setShowChestModal] = useState(false);

  // Hook đếm ngược thời gian thực đến 00:00:00 đêm nay
  const [timeLeft, setTimeLeft] = useState('00:00:00');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      const diff = Math.max(0, midnight.getTime() - now.getTime());

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Tính toán số liệu chung
  const totalMissions = missions.length;
  const completedCount = missions.filter(m => m.state === 'COMPLETED' || m.state === 'CLAIMED').length;
  const progressPercent = Math.round((completedCount / totalMissions) * 100);
  const stampsCount = STAMP_STATES.filter(s => s === 'completed').length;
  const isChestReady = stampsCount === 7;

  // SMART SORTING: COMPLETED đứng đầu -> IN_PROGRESS (% cao trước) -> CLAIMED ở cuối
  const sortedMissions = useMemo(() => {
    return [...missions].sort((a, b) => {
      const statePriority = { COMPLETED: 0, IN_PROGRESS: 1, CLAIMED: 2 };
      if (statePriority[a.state] !== statePriority[b.state]) {
        return statePriority[a.state] - statePriority[b.state];
      }
      // Cùng IN_PROGRESS: ưu tiên % tiến độ cao hơn
      if (a.state === 'IN_PROGRESS') {
        const pA = a.progress / a.total;
        const pB = b.progress / b.total;
        return pB - pA;
      }
      return 0;
    });
  }, [missions]);

  // Luồng nhận thưởng
  const handleClaim = (mission: Mission) => {
    setUserCoins(prev => prev + mission.coinReward);
    setCelebrationData({
      coin: mission.coinReward,
      xp: mission.xpReward,
      title: mission.title,
    });

    // Cập nhật trạng thái card
    setMissions(prev =>
      prev.map(m => (m.id === mission.id ? { ...m, state: 'CLAIMED' } : m))
    );
  };

  // Kéo để làm mới
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]" edges={['top']}>
      {/* ==========================================
          HEADER: Tiêu đề & Status Pills
          ========================================== */}
      <View className="px-5 py-3 border-b border-neutral-200/60 bg-white flex-row items-center justify-between z-10">
        <View className="flex-row items-center gap-2">
          <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">
            Nhiệm vụ
          </Text>
          <View className="bg-primary-50 px-2 py-0.5 rounded-full border border-primary-500/30">
            <Text className="font-bold text-[11px] text-primary-600 font-inter">
              Hàng ngày
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2.5">
          {/* User Coin Balance Pill */}
          <Pressable 
            onPress={() => router.push('/profile/wallet' as any)}
            className="flex-row items-center gap-1.5 bg-reward-50/70 border border-reward-500/30 px-3 py-1.5 rounded-full active:scale-95"
          >
            <Coin3D size="xs" />
            <Text className="font-extrabold text-[14px] text-reward-600 font-inter tabular-nums">
              {userCoins}
            </Text>
          </Pressable>

          {/* User Streak Pill */}
          <Pressable 
            onPress={() => router.push('/(tabs)/stats' as any)}
            className="flex-row items-center gap-1.5 bg-orange-50 border border-mascot-500/30 px-3 py-1.5 rounded-full active:scale-95"
          >
            <StreakFlame3D size="xs" animation="pulse" />
            <Text className="font-extrabold text-[14px] text-mascot-500 font-inter tabular-nums">
              12
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#58CC02"
            colors={['#58CC02']}
          />
        }
      >
        {/* ==========================================
            1. DAILY MISSION HERO BANNER
            ========================================== */}
        <View className="bg-primary-500 rounded-3xl p-5 border-b-[5px] border-primary-700 shadow-md shadow-primary-700/20 mb-6 flex-row items-center">
          <View className="flex-1 pr-3">
            <Text className="font-extrabold text-[22px] text-white font-nunito mb-1">
              Nhiệm vụ hôm nay
            </Text>
            <Text className="font-medium text-[13px] text-primary-100 font-inter mb-3 leading-snug">
              Hoàn thành các bài học để nhận thưởng Xu & XP!
            </Text>

            <View className="bg-white/20 px-3 py-1.5 rounded-xl self-start flex-row items-center gap-1.5 border border-white/20">
              <CheckCircle2Icon size={14} color="#FFFFFF" />
              <Text className="font-bold text-[12px] text-white font-inter">
                {completedCount} / {totalMissions} hoàn thành
              </Text>
            </View>
          </View>

          {/* Real Dynamic Circular Progress Ring */}
          <View className="items-center justify-center">
            <CircularProgressRing percent={progressPercent} size={64} strokeWidth={6} />
            <View className="flex-row items-center gap-1 mt-2 bg-black/15 px-2 py-0.5 rounded-full">
              <ClockIcon size={10} color="#FFFFFF" />
              <Text className="font-bold text-[10px] text-white font-inter tracking-wider">
                {timeLeft}
              </Text>
            </View>
          </View>
        </View>

        {/* ==========================================
            2. CHUỖI NGÀY TRONG TUẦN & RƯƠNG BÁU
            ========================================== */}
        <View className="mb-7">
          <View className="flex-row items-center justify-between mb-3.5">
            <View className="flex-row items-center gap-1.5">
              <FlameIcon size={18} color="#EA580C" />
              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">
                Chuỗi ngày trong tuần
              </Text>
            </View>
            <Text className="font-bold text-[12px] text-neutral-400 font-inter">
              {stampsCount}/7 ngày tích lũy
            </Text>
          </View>

          <View className="bg-white rounded-[24px] p-5 border border-neutral-200/80 shadow-sm shadow-black/5">
            {/* Weekday Stamp Tracker */}
            <View className="flex-row justify-between mb-5">
              {WEEKDAYS.map((day, idx) => {
                const state = STAMP_STATES[idx];
                const isCompleted = state === 'completed';
                const isCurrent = state === 'current';

                return (
                  <View key={day} className="items-center">
                    <Text
                      className={cn(
                        "font-bold text-[11px] font-inter mb-2",
                        isCurrent
                          ? "text-primary-600 font-extrabold"
                          : isCompleted
                          ? "text-mascot-navy"
                          : "text-neutral-400"
                      )}
                    >
                      {day}
                    </Text>

                    <View
                      className={cn(
                        "w-10 h-10 rounded-xl items-center justify-center transition-all",
                        isCompleted
                          ? "bg-primary-500 border-2 border-primary-600 shadow-sm"
                          : isCurrent
                          ? "bg-white border-2 border-primary-500 shadow-sm shadow-primary-500/20"
                          : "bg-neutral-100/70 border border-neutral-200"
                      )}
                    >
                      {isCompleted && <CheckIcon size={20} color="#FFFFFF" strokeWidth={3} />}
                      {isCurrent && (
                        <View className="w-3 h-3 rounded-full bg-primary-500" />
                      )}
                      {!isCompleted && !isCurrent && (
                        <View className="w-2 h-2 rounded-full bg-neutral-300" />
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Weekly Chest Interactive Card */}
            <Pressable
              onPress={() => setShowChestModal(true)}
              className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/90 flex-row items-center active:bg-neutral-100 transition-all"
            >
              <RewardChest3D
                size="lg"
                variant="legendary"
                state={isChestReady ? 'ready' : 'closed'}
                animation={isChestReady ? 'bounce' : 'none'}
                style={{ marginRight: 14 }}
              />
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito">
                    Rương Báu Tuần
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <InfoIcon size={12} color="#757793" />
                    <Text className="font-bold text-[11px] text-neutral-400 font-inter">
                      Xem quà
                    </Text>
                  </View>
                </View>

                <Text className="font-medium text-[12px] text-neutral-500 font-inter mb-2 leading-relaxed">
                  Học đều 7 ngày để mở rương quà huyền thoại!
                </Text>

                <View className="flex-row items-center gap-2.5">
                  <View className="flex-1 h-2.5 bg-neutral-200/80 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-reward-500 rounded-full"
                      style={{ width: `${(stampsCount / 7) * 100}%` }}
                    />
                  </View>
                  <Text className="font-extrabold text-[12px] text-mascot-navy font-inter tabular-nums">
                    {stampsCount}/7
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        </View>

        {/* ==========================================
            3. MISSION LIST (Smart Priority Ordered)
            ========================================== */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-3.5">
            <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">
              Danh sách nhiệm vụ
            </Text>
            <View className="flex-row items-center gap-1.5 bg-neutral-100 px-2.5 py-1 rounded-full border border-neutral-200">
              <ClockIcon size={12} color="#757793" />
              <Text className="font-bold text-[11px] text-neutral-500 font-inter">
                Làm mới 00:00
              </Text>
            </View>
          </View>

          {/* Cards Render */}
          {sortedMissions.map(mission => (
            <MissionCardItem
              key={mission.id}
              mission={mission}
              onClaim={handleClaim}
            />
          ))}

          {/* All Completed Celebratory Message */}
          {completedCount === totalMissions && (
            <View className="bg-primary-50 rounded-2xl p-4 border border-primary-500/30 items-center justify-center mt-2 flex-row gap-2.5">
              <SparklesIcon size={20} color="#58CC02" />
              <Text className="font-extrabold text-[14px] text-primary-700 font-nunito">
                Bạn đã hoàn thành tất cả nhiệm vụ hôm nay!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ==========================================
          MODAL 1: REWARD CELEBRATION
          ========================================== */}
      {celebrationData && (
        <Modal
          visible={!!celebrationData}
          transparent
          animationType="fade"
          onRequestClose={() => setCelebrationData(null)}
        >
          <View className="flex-1 bg-black/50 items-center justify-center p-6">
            <View className="bg-white rounded-3xl p-6 items-center w-full max-w-xs shadow-2xl border border-neutral-100">
              <Snapy pose="an_mung" animation="celebrate" className="w-32 h-32 mb-2" />
              
              <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito mt-1">
                TUYỆT VỜI!
              </Text>
              <Text className="font-medium text-[13px] text-neutral-500 font-inter text-center mt-1 mb-4">
                Đã hoàn thành: "{celebrationData.title}"
              </Text>

              {/* Reward Pills */}
              <View className="flex-row items-center justify-center gap-3 w-full mb-5">
                <View className="flex-row items-center gap-1.5 bg-reward-50 px-3.5 py-2 rounded-xl border border-reward-500/30">
                  <Coin3D size="sm" animation="bounce" />
                  <Text className="font-extrabold text-[16px] text-reward-600 font-inter">
                    +{celebrationData.coin} Xu
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5 bg-info-50 px-3.5 py-2 rounded-xl border border-info-500/30">
                  <XPOrb3D size="sm" />
                  <Text className="font-extrabold text-[16px] text-info-600 font-inter">
                    +{celebrationData.xp} XP
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => setCelebrationData(null)}
                className="w-full h-12 bg-primary-500 rounded-xl items-center justify-center border-b-[4px] border-primary-700 active:border-b-[2px] active:translate-y-[2px]"
              >
                <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-wider">
                  TIẾP TỤC
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}

      {/* ==========================================
          MODAL 2: WEEKLY CHEST REWARD PREVIEW
          ========================================== */}
      <Modal
        visible={showChestModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowChestModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center p-6">
          <View className="bg-white rounded-3xl p-6 items-center w-full max-w-sm shadow-2xl border border-neutral-100">
            <View className="w-full flex-row justify-end mb-1">
              <Pressable 
                onPress={() => setShowChestModal(false)} 
                className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200"
              >
                <XIcon size={16} color="#565879" />
              </Pressable>
            </View>

            <RewardChest3D size="lg" variant="legendary" animation="bounce" style={{ marginBottom: 12 }} />

            <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito text-center">
              Rương Báu Tuần Huyền Thoại
            </Text>
            <Text className="font-medium text-[13px] text-neutral-500 font-inter text-center mt-1 mb-5">
              Học liên tục 7 ngày để mở khóa toàn bộ phần thưởng:
            </Text>

            {/* List of rewards inside */}
            <View className="w-full gap-2.5 mb-6">
              <View className="flex-row items-center justify-between p-3 rounded-xl bg-reward-50/70 border border-reward-500/20">
                <View className="flex-row items-center gap-2.5">
                  <Coin3D size="sm" />
                  <Text className="font-bold text-[14px] text-mascot-navy font-inter">Tiền vàng thưởng</Text>
                </View>
                <Text className="font-extrabold text-[15px] text-reward-600 font-inter">+200 Xu</Text>
              </View>

              <View className="flex-row items-center justify-between p-3 rounded-xl bg-info-50 border border-info-500/20">
                <View className="flex-row items-center gap-2.5">
                  <XPOrb3D size="sm" />
                  <Text className="font-bold text-[14px] text-mascot-navy font-inter">Kinh nghiệm học tập</Text>
                </View>
                <Text className="font-extrabold text-[15px] text-info-600 font-inter">+500 XP</Text>
              </View>

              <View className="flex-row items-center justify-between p-3 rounded-xl bg-mascot-50 border border-mascot-500/20">
                <View className="flex-row items-center gap-2.5">
                  <StreakFlame3D size="sm" />
                  <Text className="font-bold text-[14px] text-mascot-navy font-inter">Bảo vệ chuỗi Streak</Text>
                </View>
                <Text className="font-extrabold text-[14px] text-mascot-500 font-inter">1 Lượt Freeze</Text>
              </View>
            </View>

            <Pressable
              onPress={() => setShowChestModal(false)}
              className="w-full h-12 bg-primary-500 rounded-xl items-center justify-center border-b-[4px] border-primary-700 active:border-b-[2px] active:translate-y-[2px]"
            >
              <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-wider">
                ĐÃ HIỂU
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
