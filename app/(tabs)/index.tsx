import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  BellIcon, 
  CheckCircle2Icon, 
  WifiOffIcon,
  CircleIcon,
  SearchIcon,
  ArrowRightIcon,
  SparklesIcon,
  ClockIcon,
  AlertCircleIcon,
  RotateCcwIcon,
  ChevronRightIcon
} from 'lucide-react-native';
import { 
  StreakFlame3D, 
  Coin3D, 
  AchievementTrophy3D, 
  XPOrb3D,
  RewardChest3D
} from '@/components/snapvocab';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';
import { useRouter } from 'expo-router';

// ==========================================
// THIẾT LẬP TRẠNG THÁI KIỂM THỬ (MOCK STATE)
// Các giá trị: 'default' | 'newUser' | 'streakBroken' | 'chestReady' | 'offline' | 'error'
// ==========================================
type MockState = 'default' | 'newUser' | 'streakBroken' | 'chestReady' | 'offline' | 'error';
const TEST_STATE: MockState = 'default';

// DỮ LIỆU MẪU ĐẦY ĐỦ CHO MH-MAIN-01
const MOCK_DATA = {
  user: {
    name: 'Learner',
    avatar: 'https://i.pravatar.cc/150?u=snapvocab',
    streak: 12,
    level: 8,
    xp: 1240,
    xpMax: 1500,
    coins: 820,
    words: 248,
    accuracy: 87,
  },
  srsDue: 12,
  resetCountdown: '04:25:12',
  missions: [
    { id: '1', title: 'Học 10 từ mới', progress: 10, total: 10, reward: 30, completed: true, isCoin: false },
    { id: '2', title: 'Ôn tập 5 từ đến hạn', progress: 5, total: 5, reward: 20, completed: true, isCoin: true },
    { id: '3', title: 'Quét 3 từ vựng bằng Camera', progress: 1, total: 3, reward: 30, completed: false, isCoin: false }
  ],
  continueLearning: {
    deckId: 'business-english',
    deckName: 'Business English',
    lesson: 4,
    progress: 18,
    total: 25
  },
  leaderboardMe: {
    rank: 12,
    xp: 1240,
    diffToNext: 80,
    league: 'Kim Cương'
  },
  recentWords: [
    { word: 'abandon', translation: 'từ bỏ' },
    { word: 'accurate', translation: 'chính xác' },
    { word: 'achieve', translation: 'đạt được' },
    { word: 'adapt', translation: 'thích nghi' },
  ]
};

export default function HomeDashboard() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [localData, setLocalData] = useState(MOCK_DATA);
  const [blockErrorRetrying, setBlockErrorRetrying] = useState(false);

  const data = localData;
  const setData = setLocalData;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        srsDue: Math.floor(Math.random() * 20),
        user: { ...prev.user, xp: prev.user.xp + 10 }
      }));
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Xác định lời chào theo thời gian thực
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  // Xác định biểu cảm và thông điệp của Snapy
  const getMascotProps = () => {
    if (TEST_STATE === 'streakBroken') {
      return { 
        pose: 'suy_nghi' as const, 
        animation: 'idle' as const,
        msg: 'Không sao cả, hãy cùng bắt đầu chuỗi ngày mới ngay hôm nay nhé!' 
      };
    }
    if (TEST_STATE === 'chestReady') {
      return { 
        pose: 'nhay_len' as const, 
        animation: 'bounce' as const,
        msg: 'Rương phần thưởng hàng ngày đã sẵn sàng mở, nhận ngay thôi!' 
      };
    }
    if (TEST_STATE === 'newUser') {
      return { 
        pose: 'main' as const, 
        animation: 'wave' as const,
        msg: 'Xin chào! Mình là Snapy, hãy cùng bắt đầu bài học từ vựng đầu tiên nhé!' 
      };
    }
    if (data.srsDue === 0) {
      return { 
        pose: 'tu_hao' as const, 
        animation: 'celebrate' as const,
        msg: 'Xuất sắc! Bạn đã hoàn thành toàn bộ bài ôn tập Spaced Repetition hôm nay.' 
      };
    }
    return { 
      pose: 'tap_trung' as const, 
      animation: 'idle' as const,
      msg: `${data.srsDue} từ vựng Spaced Repetition đang chờ bạn củng cố trí nhớ!` 
    };
  };

  const mascot = getMascotProps();

  // Skeleton Loading State
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="px-5 py-6 flex-col gap-5">
          <View className="flex-row justify-between items-center">
            <View className="w-40 h-8 bg-neutral-100 rounded-xl animate-pulse" />
            <View className="flex-row gap-2">
              <View className="w-16 h-10 bg-neutral-100 rounded-full animate-pulse" />
              <View className="w-10 h-10 bg-neutral-100 rounded-full animate-pulse" />
            </View>
          </View>
          <View className="w-full h-16 bg-neutral-100 rounded-2xl animate-pulse" />
          <View className="w-full h-48 bg-neutral-100 rounded-2xl animate-pulse" />
          <View className="w-full h-40 bg-neutral-100 rounded-2xl animate-pulse" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Offline Banner nếu mất kết nối */}
      {TEST_STATE === 'offline' && (
        <View className="bg-neutral-800 flex-row items-center justify-center py-2.5 px-4 gap-2 z-20">
          <WifiOffIcon size={16} className="text-white" />
          <Text className="text-white text-[14px] font-bold font-inter">
            Đang offline - Hiển thị bản lưu gần nhất
          </Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#58CC02" />}
      >
        <View className="w-full max-w-xl mx-auto">
        {/* ==========================================
            KHỐI 1: HEADER & USER CONTEXT
            Đặc tả: Avatar, Lời chào, Streak pill, Chuông thông báo
            ========================================== */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
          <View className="flex-1 pr-3">
            <Text className="text-[14px] font-bold text-neutral-400 font-inter uppercase tracking-wider">
              {TEST_STATE === 'newUser' ? 'Chào mừng bạn' : getGreeting()}
            </Text>
            <Text className="text-[22px] font-extrabold text-mascot-navy font-nunito mt-0.5" numberOfLines={1}>
              {data.user.name}
            </Text>
          </View>
          
          <View className="flex-row items-center gap-2.5">
            {/* Streak Status Pill (Tương tác sang thống kê Streak) */}
            <Pressable 
              onPress={() => router.push('/(tabs)/stats' as any)}
              className={cn(
                "flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border-2 border-neutral-200/80 active:scale-95",
                TEST_STATE === 'streakBroken' ? "opacity-60 border-dashed" : ""
              )}
            >
              <StreakFlame3D size="xs" state={TEST_STATE === 'streakBroken' ? 'broken' : 'active'} animation="pulse" />
              <Text className={cn(
                "text-[15px] font-extrabold font-nunito tabular-nums", 
                TEST_STATE === 'streakBroken' ? "text-neutral-500" : "text-mascot-500"
              )}>
                {TEST_STATE === 'newUser' || TEST_STATE === 'streakBroken' ? 0 : data.user.streak}
              </Text>
            </Pressable>

            {/* Notification Bell */}
            <Pressable 
              onPress={() => router.push('/profile/notifications' as any)} 
              className="relative p-2.5 bg-white rounded-full border-2 border-neutral-200/80 active:scale-95"
            >
              <BellIcon size={20} className="text-mascot-navy" />
              <View className="absolute top-2 right-2 w-2.5 h-2.5 bg-danger-500 rounded-full border-2 border-white" />
            </Pressable>

            {/* User Avatar (Tương tác sang Profile cá nhân) */}
            <Pressable 
              onPress={() => router.push('/(tabs)/profile' as any)}
              className="active:scale-95"
            >
              <Image 
                source={{ uri: data.user.avatar }} 
                className="w-11 h-11 rounded-full border-2 border-neutral-200"
              />
            </Pressable>
          </View>
        </View>

        {/* ==========================================
            KHỐI 2: LEVEL & TIẾN ĐỘ XP & SỐ DƯ COIN
            Đặc tả MH-MAIN-01: Level hiện tại, XP, Progress bar, Coin balance -> CTA: MH-STATS-02
            ========================================== */}
        <View className="px-5 mt-2 mb-4">
          <Pressable 
            onPress={() => router.push('/(tabs)/stats' as any)}
            className="bg-neutral-50/80 rounded-2xl p-4 border border-neutral-200/90 active:scale-[0.99]"
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2">
                <View className="bg-primary-50 px-2.5 py-0.5 rounded-lg border border-primary-200">
                  <Text className="text-[14px] font-extrabold text-primary-800 font-nunito">
                    CẤP {data.user.level}
                  </Text>
                </View>
                <Text className="text-[14px] font-bold text-neutral-500 font-inter">
                  {data.user.xp} / {data.user.xpMax} XP
                </Text>
              </View>

              {/* Số dư Coin */}
              <View className="flex-row items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-neutral-200">
                <Coin3D size="xs" />
                <Text className="text-[14px] font-extrabold text-neutral-800 font-nunito tabular-nums">
                  {data.user.coins}
                </Text>
              </View>
            </View>

            {/* XP Progress Track Bar */}
            <View className="h-3 bg-neutral-200/70 rounded-full overflow-hidden">
              <View 
                className="h-full bg-reward-500 rounded-full"
                style={{ width: `${Math.min(100, (data.user.xp / data.user.xpMax) * 100)}%` }}
              />
            </View>
          </Pressable>
        </View>

        {/* ==========================================
            KHỐI 3: BỘ 3 CHỈ SỐ HỌC TẬP (PROGRESS METRICS)
            Đặc tả MH-MAIN-01: Streak (số ngày), Words (số Note), Accuracy (%) -> CTA: MH-STATS-01
            ========================================== */}
        <View className="px-5 mb-5">
          <Pressable 
            onPress={() => router.push('/(tabs)/stats' as any)}
            className="flex-row items-center justify-between bg-white rounded-2xl p-3.5 border border-neutral-200/90 active:scale-[0.99]"
          >
            {/* Metric 1: Chuỗi ngày học */}
            <View className="flex-1 items-center border-r border-neutral-100">
              <Text className="text-[20px] font-extrabold text-mascot-navy font-nunito tabular-nums">
                {TEST_STATE === 'newUser' || TEST_STATE === 'streakBroken' ? 0 : data.user.streak}
              </Text>
              <Text className="text-[14px] font-semibold text-neutral-500 font-inter mt-0.5">
                Ngày liên tục
              </Text>
            </View>

            {/* Metric 2: Từ vựng đã tích luỹ */}
            <View className="flex-1 items-center border-r border-neutral-100">
              <Text className="text-[20px] font-extrabold text-mascot-navy font-nunito tabular-nums">
                {TEST_STATE === 'newUser' ? 0 : data.user.words}
              </Text>
              <Text className="text-[14px] font-semibold text-neutral-500 font-inter mt-0.5">
                Từ đã thuộc
              </Text>
            </View>

            {/* Metric 3: Độ chính xác ôn tập */}
            <View className="flex-1 items-center">
              <Text className="text-[20px] font-extrabold text-primary-600 font-nunito tabular-nums">
                {TEST_STATE === 'newUser' ? '0%' : `${data.user.accuracy}%`}
              </Text>
              <Text className="text-[14px] font-semibold text-neutral-500 font-inter mt-0.5">
                Độ chính xác
              </Text>
            </View>
          </Pressable>
        </View>

        {/* ==========================================
            SECTION: TRA TỪ NHANH (Integrated Search)
            ========================================== */}
        <View className="px-5 mb-5">
          <Pressable 
            onPress={() => router.push('/dictionary' as any)}
            className="flex-row items-center h-12 px-4 rounded-xl bg-white border border-neutral-200/90 active:bg-neutral-50 active:scale-[0.99]"
          >
            <SearchIcon size={18} className="text-neutral-400 mr-3" />
            <Text className="flex-1 font-inter text-[14px] text-neutral-400">
              Tra từ vựng tiếng Anh...
            </Text>
          </Pressable>
        </View>

        {/* ==========================================
            KHỐI 4: SRS DUE HERO CARD (Focal Review)
            Đặc tả MH-MAIN-01: Thẻ ôn tập đến hạn, Snapy tương tác, CTA "Ôn ngay" (3D Tactile)
            ========================================== */}
        <View className="px-5 mb-6">
          <View className="relative bg-mascot-navy rounded-2xl p-6 pt-5 overflow-visible border-b-4 border-[#121A2B]">
            {/* Header Hero */}
            <View className="flex-row justify-between items-start">
              <View className="flex-1 pr-2">
                <Text className="font-extrabold text-[14px] text-reward-500 uppercase tracking-wider font-nunito mb-1.5">
                  ÔN TẬP ĐỊNH KỲ · SRS
                </Text>
                
                {TEST_STATE === 'newUser' || data.srsDue === 0 ? (
                  <View>
                    <Text className="font-extrabold text-[22px] text-white font-nunito leading-tight mb-1">
                      Hoàn thành hôm nay
                    </Text>
                    <Text className="font-medium text-[14px] text-neutral-300 font-inter mb-4">
                      Bạn không còn từ vựng nào cần ôn tập.
                    </Text>
                  </View>
                ) : (
                  <View>
                    <Text className="font-extrabold text-[26px] text-white font-nunito leading-tight mb-1 tabular-nums">
                      {data.srsDue} TỪ VỰNG
                    </Text>
                    <Text className="font-medium text-[14px] text-neutral-300 font-inter mb-4">
                      đã đến hạn ôn tập để ghi nhớ dài hạn.
                    </Text>
                  </View>
                )}
              </View>

              {/* Snapy Nhân vật Neo thị giác */}
              <View className="items-center justify-center shrink-0 -mt-2 -mr-1" style={{ width: 96, height: 96 }}>
                <Snapy pose={mascot.pose} animation={mascot.animation} style={{ width: 96, height: 96 }} />
              </View>
            </View>

            {/* Hộp thoại thông điệp của Snapy */}
            <View className="bg-white/10 px-3.5 py-2.5 rounded-xl mb-4 border border-white/10">
              <Text className="text-[14px] font-semibold text-neutral-200 font-inter">
                Snapy: "{mascot.msg}"
              </Text>
            </View>

            {/* Primary Action Button dạng 3D Tactile theo §05.4 */}
            {TEST_STATE === 'newUser' || data.srsDue === 0 ? (
              <Pressable 
                onPress={() => router.push('/topics' as any)}
                className="h-14 bg-white rounded-xl flex-row items-center justify-center gap-2 border-b-4 border-neutral-300 active:border-b-0 active:translate-y-1"
              >
                <Text className="text-mascot-navy font-extrabold text-[15px] font-nunito tracking-wider uppercase">
                  HỌC TỪ MỚI
                </Text>
                <ArrowRightIcon size={18} className="text-mascot-navy" />
              </Pressable>
            ) : (
              <Pressable 
                onPress={() => router.push('/study/flashcard' as any)}
                className="h-14 bg-primary-500 rounded-xl flex-row items-center justify-center gap-2 border-b-4 border-primary-700 active:border-b-0 active:translate-y-1"
              >
                <Text className="text-white font-extrabold text-[15px] font-nunito tracking-wider uppercase">
                  ÔN NGAY
                </Text>
                <ArrowRightIcon size={18} className="text-white" />
              </Pressable>
            )}
          </View>
        </View>

        {/* ==========================================
            KHỐI 5: DAILY MISSIONS & RƯƠNG PHẦN THƯỞNG
            Đặc tả MH-MAIN-01: 5 nhiệm vụ (+1 bonus), Progress bar, Reward, Claim, Countdown
            ========================================== */}
        <View className="px-5 mb-6">
          <View className="bg-white rounded-2xl p-5 border border-neutral-200/90 border-b-2">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center gap-2">
                <SparklesIcon size={18} className="text-mascot-500" />
                <Text className="font-extrabold text-[14px] text-mascot-navy uppercase font-nunito tracking-wider">
                  NHIỆM VỤ HÀNG NGÀY
                </Text>
              </View>
              
              {/* Countdown làm mới ngày mới */}
              <View className="flex-row items-center gap-1.5 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-200">
                <ClockIcon size={14} className="text-neutral-500" />
                <Text className="font-bold text-[14px] text-neutral-600 font-nunito tabular-nums">
                  {data.resetCountdown}
                </Text>
              </View>
            </View>

            {/* Trạng thái mở Rương hoàn thành nhiệm vụ */}
            {TEST_STATE === 'chestReady' ? (
              <View className="items-center py-4">
                <RewardChest3D size="md" state="ready" animation="bounce" />
                <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mt-3 mb-1">
                  Rương phần thưởng đã sẵn sàng!
                </Text>
                <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center mb-4">
                  Bạn đã hoàn thành toàn bộ mục tiêu hôm nay.
                </Text>
                <Pressable className="w-full h-12 bg-reward-500 rounded-xl items-center justify-center border-b-4 border-reward-700 active:border-b-0 active:translate-y-1">
                  <Text className="text-neutral-900 font-extrabold text-[15px] font-nunito uppercase tracking-wider">
                    NHẬN RƯƠNG THƯỞNG
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View className="divide-y divide-neutral-100">
                {data.missions.map(m => (
                  <View key={m.id} className="py-3.5 flex-row items-center justify-between first:pt-0 last:pb-0">
                    <View className="flex-row items-center gap-3 flex-1 pr-3">
                      {m.completed ? (
                        <CheckCircle2Icon size={22} fill="#58CC02" className="text-white shrink-0" />
                      ) : (
                        <CircleIcon size={22} className="text-neutral-300 shrink-0" />
                      )}
                      
                      <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className={cn("font-bold text-[14px] font-inter", m.completed ? "text-neutral-400 line-through" : "text-mascot-navy")}>
                            {m.title}
                          </Text>
                          {!m.completed && (
                            <Text className="text-[12px] font-extrabold text-neutral-400 font-nunito tabular-nums">
                              {m.progress}/{m.total}
                            </Text>
                          )}
                        </View>
                        {!m.completed && (
                          <View className="h-2 bg-neutral-100 rounded-full overflow-hidden mt-0.5">
                            <View 
                              className="h-full bg-primary-500 rounded-full" 
                              style={{ width: `${(m.progress / m.total) * 100}%` }}
                            />
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Huy hiệu phần thưởng */}
                    <View className="flex-row items-center gap-1.5 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-100 shrink-0">
                      {m.isCoin ? (
                        <Coin3D size="xs" />
                      ) : (
                        <XPOrb3D size="xs" />
                      )}
                      <Text className="font-extrabold tabular-nums text-[14px] text-neutral-700 font-nunito">
                        +{m.reward}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Link xem tất cả nhiệm vụ — Tuân thủ §01.6: Dùng neutral-600, KHÔNG dùng info-600 */}
            {TEST_STATE !== 'chestReady' && (
              <Pressable 
                onPress={() => router.push('/(tabs)/missions' as any)} 
                className="mt-4 pt-3 border-t border-neutral-100 flex-row items-center justify-center gap-1 active:opacity-70"
              >
                <Text className="font-bold text-neutral-600 text-[14px] font-inter uppercase tracking-wider">
                  XEM TẤT CẢ NHIỆM VỤ
                </Text>
                <ChevronRightIcon size={16} className="text-neutral-600" />
              </Pressable>
            )}
          </View>
        </View>

        {/* ==========================================
            KHỐI 6: CONTINUE LEARNING DECK
            Đặc tả MH-MAIN-01: Tên Deck gần nhất, tiến độ Card -> CTA: "Tiếp tục"
            ========================================== */}
        <View className="px-5 mb-6">
          <View className="bg-white rounded-2xl p-5 border border-neutral-200/90 border-b-2">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="font-extrabold text-[14px] text-neutral-400 uppercase tracking-wider font-nunito">
                TIẾP TỤC HỌC
              </Text>
              {TEST_STATE !== 'newUser' && (
                <Pressable onPress={() => router.push('/topics' as any)} className="active:opacity-70">
                  <Text className="font-bold text-[14px] text-neutral-600 font-inter">
                    Khám phá chủ đề →
                  </Text>
                </Pressable>
              )}
            </View>

            {TEST_STATE === 'newUser' ? (
              <View>
                <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-1">
                  Khám phá bài học đầu tiên
                </Text>
                <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-4">
                  Bắt đầu học 10 từ vựng tiếng Anh cơ bản ngay hôm nay.
                </Text>
                <Pressable 
                  onPress={() => router.push('/topics' as any)}
                  className="h-12 bg-neutral-100 rounded-xl items-center justify-center border-b-4 border-neutral-300 active:border-b-0 active:translate-y-1"
                >
                  <Text className="text-mascot-navy font-extrabold text-[15px] font-nunito uppercase tracking-wider">
                    BẮT ĐẦU NGAY
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-1">
                  {data.continueLearning.deckName}
                </Text>
                <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-3">
                  Bài học {data.continueLearning.lesson} · {data.continueLearning.progress}/{data.continueLearning.total} từ vựng
                </Text>
                
                <View className="flex-row items-center gap-3 mb-4">
                  <View className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <View 
                      className="h-full bg-primary-500 rounded-full" 
                      style={{ width: `${(data.continueLearning.progress / data.continueLearning.total) * 100}%` }}
                    />
                  </View>
                  <Text className="text-[14px] font-extrabold text-neutral-600 font-nunito tabular-nums">
                    {Math.round((data.continueLearning.progress / data.continueLearning.total) * 100)}%
                  </Text>
                </View>

                <Pressable 
                  onPress={() => router.push('/study/flashcard' as any)}
                  className="h-13 py-3.5 bg-primary-500 rounded-xl flex-row items-center justify-center gap-2 border-b-4 border-primary-700 active:border-b-0 active:translate-y-1 shadow-sm"
                >
                  <Text className="text-white font-extrabold text-[15px] font-nunito uppercase tracking-wider">
                    TIẾP TỤC BÀI HỌC
                  </Text>
                  <ArrowRightIcon size={18} className="text-white" />
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* ==========================================
            KHỐI 7: LEADERBOARD SNIPPET & THÀNH TỰU
            Đặc tả MH-MAIN-01: Thứ hạng cá nhân theo Weekly XP -> CTA: MH-GAME-01
            ========================================== */}
        <View className="px-5 mb-6">
          <Text className="font-extrabold text-[14px] text-neutral-400 uppercase tracking-wider font-nunito mb-3">
            BẢNG XẾP HẠNG & THÀNH TỰU
          </Text>

          <View className="flex-row gap-3">
            {/* Leaderboard Row */}
            <Pressable 
              onPress={() => router.push('/(tabs)/leaderboard' as any)}
              className="flex-1 bg-white rounded-2xl p-4 border border-neutral-200/90 border-b-2 active:scale-[0.98]"
            >
              <View className="flex-row items-center gap-2 mb-2">
                <StreakFlame3D size="sm" />
                <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">
                  Hạng #{data.leaderboardMe.rank}
                </Text>
              </View>
              <Text className="font-medium text-[14px] text-neutral-500 font-inter">
                Giải đấu {data.leaderboardMe.league}
              </Text>
              <View className="mt-3 pt-2.5 border-t border-neutral-100 flex-row items-center justify-between">
                <Text className="font-bold text-[14px] text-neutral-600 font-inter">
                  Bảng tuần
                </Text>
                <ChevronRightIcon size={14} className="text-neutral-500" />
              </View>
            </Pressable>

            {/* Achievements Row */}
            <Pressable 
              onPress={() => router.push('/(tabs)/achievements' as any)}
              className="flex-1 bg-white rounded-2xl p-4 border border-neutral-200/90 border-b-2 active:scale-[0.98]"
            >
              <View className="flex-row items-center gap-2 mb-2">
                <AchievementTrophy3D size="sm" />
                <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">
                  Cấp {data.user.level}
                </Text>
              </View>
              <Text className="font-medium text-[14px] text-neutral-500 font-inter">
                Huy hiệu & Thưởng
              </Text>
              <View className="mt-3 pt-2.5 border-t border-neutral-100 flex-row items-center justify-between">
                <Text className="font-bold text-[14px] text-neutral-600 font-inter">
                  Chi tiết
                </Text>
                <ChevronRightIcon size={14} className="text-neutral-500" />
              </View>
            </Pressable>
          </View>
        </View>

        {/* ==========================================
            KHỐI 8: RECENTLY LEARNED VOCABULARY CHIPS
            Đặc tả MH-MAIN-01: 3-5 Note gần nhất -> CTA: Tra từ trong Từ điển
            ========================================== */}
        {TEST_STATE !== 'newUser' && (
          <View className="mb-4">
            <View className="px-5 mb-3 flex-row items-center justify-between">
              <Text className="font-extrabold text-[14px] text-neutral-400 uppercase tracking-wider font-nunito">
                TỪ VỪA HỌC GẦN ĐÂY
              </Text>
              <Pressable onPress={() => router.push('/dictionary' as any)} className="active:opacity-70">
                <Text className="font-bold text-[14px] text-neutral-600 font-inter">
                  Xem tất cả →
                </Text>
              </Pressable>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              className="px-5" 
              contentContainerStyle={{ gap: 10, paddingRight: 36 }}
            >
              {data.recentWords.map((word, i) => (
                <Pressable 
                  key={i} 
                  onPress={() => router.push(`/dictionary` as any)}
                  className="bg-white rounded-xl px-4 py-3 border border-neutral-200/90 border-b-2 active:bg-neutral-50"
                >
                  <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito mb-0.5">
                    {word.word}
                  </Text>
                  <Text className="font-medium text-[14px] text-neutral-500 font-inter">
                    {word.translation}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ==========================================
            PER-BLOCK ERROR FALLBACK DEMONSTRATION
            Đặc tả MH-MAIN-01: Khối bị lỗi hiển thị "Không tải được" + nút thử lại, các khối khác bình thường
            ========================================== */}
        {TEST_STATE === 'error' && (
          <View className="px-5 mt-2">
            <View className="bg-danger-50 border border-danger-200 rounded-2xl p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1 pr-2">
                <AlertCircleIcon size={20} className="text-danger-600" />
                <View className="flex-1">
                  <Text className="font-bold text-[14px] text-danger-700 font-inter">
                    Không thể đồng bộ bảng xếp hạng
                  </Text>
                  <Text className="text-[14px] text-danger-600 font-inter">
                    Vui lòng kiểm tra lại kết nối mạng.
                  </Text>
                </View>
              </View>
              <Pressable 
                onPress={() => {
                  setBlockErrorRetrying(true);
                  setTimeout(() => setBlockErrorRetrying(false), 800);
                }}
                className="bg-white px-3 py-2 rounded-xl border border-danger-200 flex-row items-center gap-1.5 active:bg-neutral-50"
              >
                <RotateCcwIcon size={14} className={cn("text-danger-700", blockErrorRetrying && "animate-spin")} />
                <Text className="font-bold text-[14px] text-danger-700 font-inter">
                  Thử lại
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
