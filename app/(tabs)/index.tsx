import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  RefreshControl, 
  Pressable, 
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  BellIcon, 
  CheckCircle2Icon, 
  CircleIcon, 
  SearchIcon, 
  ArrowRightIcon, 
  SparklesIcon, 
  ClockIcon, 
  ChevronRightIcon,
  CameraIcon,
  BookOpenIcon,
  ZapIcon,
  TrophyIcon,
} from 'lucide-react-native';
import { 
  StreakFlame3D, 
  Coin3D, 
  AchievementTrophy3D, 
  XPOrb3D, 
  SnapCamera3D,
  TopicBook3D,
  FlashcardSpin3D,
  PodiumTrophy3D
} from '@/components/snapvocab';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';
import { useRouter } from 'expo-router';

// ==========================================
// TOKENS & SHADOW STYLES
// ==========================================
const SOFT_CARD_SHADOW = Platform.select({
  web: {
    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.06)',
  },
  default: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
}) as any;

const HERO_SHADOW = Platform.select({
  web: {
    boxShadow: '0 8px 20px rgba(30, 42, 68, 0.18)',
  },
  default: {
    shadowColor: '#1E2A44',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
  },
}) as any;

// ==========================================
// DỮ LIỆU MẪU CHUẨN CHO HOME DASHBOARD
// ==========================================
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
    { id: '1', title: 'Học 10 từ mới hôm nay', progress: 10, total: 10, reward: 30, completed: true, isCoin: false },
    { id: '2', title: 'Ôn tập 5 từ đến hạn SRS', progress: 5, total: 5, reward: 20, completed: true, isCoin: true },
    { id: '3', title: 'Quét 3 từ vựng bằng Camera Snap', progress: 1, total: 3, reward: 30, completed: false, isCoin: false }
  ],
  continueLearning: {
    deckId: 'business-english',
    deckName: 'Business English',
    category: 'Giao tiếp công sở',
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
    { word: 'abandon', ipa: '/əˈbændən/', translation: 'từ bỏ, buông xuôi', mastery: 'Đang nhớ' },
    { word: 'accurate', ipa: '/ˈækjərət/', translation: 'chính xác, chuẩn xác', mastery: 'Thuần thục' },
    { word: 'achieve', ipa: '/əˈtʃiːv/', translation: 'đạt được, hoàn thành', mastery: 'Mới học' },
    { word: 'adapt', ipa: '/əˈdæpt/', translation: 'thích nghi, làm quen', mastery: 'Đang nhớ' },
    { word: 'consistent', ipa: '/kənˈsɪstənt/', translation: 'nhất quán, kiên trì', mastery: 'Thuần thục' },
  ]
};

export default function HomeDashboard() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [localData, setLocalData] = useState(MOCK_DATA);

  const data = localData;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setLocalData(prev => ({
        ...prev,
        srsDue: Math.floor(Math.random() * 15) + 1,
        user: { ...prev.user, xp: prev.user.xp + 10 }
      }));
      setRefreshing(false);
    }, 800);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Lời chào thời gian thực
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng ☀️';
    if (hour < 18) return 'Chào buổi chiều 🌤️';
    return 'Chào buổi tối 🌙';
  };

  // Cấu hình linh vật Snapy
  const getMascotProps = () => {
    if (data.srsDue === 0) {
      return { 
        pose: 'an_mung' as const, 
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
      <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
        <View className="px-5 py-6 flex-col gap-5">
          <View className="flex-row justify-between items-center">
            <View className="w-44 h-9 bg-neutral-200/60 rounded-xl animate-pulse" />
            <View className="flex-row gap-2">
              <View className="w-20 h-9 bg-neutral-200/60 rounded-full animate-pulse" />
              <View className="w-10 h-9 bg-neutral-200/60 rounded-full animate-pulse" />
            </View>
          </View>
          <View className="w-full h-44 bg-neutral-200/60 rounded-3xl animate-pulse" />
          <View className="w-full h-24 bg-neutral-200/60 rounded-2xl animate-pulse" />
          <View className="w-full h-48 bg-neutral-200/60 rounded-2xl animate-pulse" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#58CC02" />}
      >
        <View className="w-full max-w-xl mx-auto">

          {/* ==========================================
              KHỐI 1: HEADER & USER CONTEXT
              Greeting sinh động, Streak 3D, Số dư Xu 3D, Avatar
              ========================================== */}
          <View className="flex-row items-center justify-between px-5 pt-3 pb-3">
            <View className="flex-1 pr-3">
              <Text className="text-[13px] font-extrabold text-neutral-400 font-inter uppercase tracking-wider">
                {getGreeting()}
              </Text>
              <Text className="text-[23px] font-extrabold text-mascot-navy font-nunito mt-0.5" numberOfLines={1}>
                {data.user.name} 👋
              </Text>
            </View>
            
            <View className="flex-row items-center gap-2">
              {/* Streak Pill */}
              <Pressable 
                onPress={() => router.push('/(tabs)/stats' as any)}
                className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-200/80 active:scale-95 shadow-xs"
              >
                <StreakFlame3D size="xs" state="active" animation="pulse" />
                <Text className="text-[14px] font-extrabold font-nunito text-mascot-500 tabular-nums">
                  {data.user.streak}d
                </Text>
              </Pressable>

              {/* Coin Pill */}
              <Pressable 
                onPress={() => router.push('/(tabs)/shop' as any)}
                className="flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white border border-neutral-200/80 active:scale-95 shadow-xs"
              >
                <Coin3D size="xs" />
                <Text className="text-[14px] font-extrabold font-nunito text-neutral-800 tabular-nums">
                  {data.user.coins}
                </Text>
              </Pressable>

              {/* Notification Bell */}
              <Pressable 
                onPress={() => router.push('/profile/notifications' as any)} 
                className="relative p-2 bg-white rounded-full border border-neutral-200/80 active:scale-95 shadow-xs"
              >
                <BellIcon size={18} className="text-mascot-navy" />
                <View className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger-500 rounded-full border-2 border-white" />
              </Pressable>

              {/* User Avatar */}
              <Pressable 
                onPress={() => router.push('/(tabs)/profile' as any)}
                className="active:scale-95 relative"
              >
                <Image 
                  source={{ uri: data.user.avatar }} 
                  className="w-10 h-10 rounded-full border-2 border-primary-500"
                />
                <View className="absolute -bottom-1 -right-1 bg-primary-500 px-1.5 py-0.2 rounded-full border border-white">
                  <Text className="text-[9px] font-extrabold text-white font-nunito">
                    Lv.{data.user.level}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          {/* ==========================================
              KHỐI 2: HERO BANNER (FOCAL SRS CARD)
              12 từ SRS đến hạn + Snapy đồng hành + Ôn ngay 3D Tactile
              ========================================== */}
          <View className="px-5 mb-4">
            <View 
              className="relative bg-[#1A243B] rounded-3xl p-5 pt-5 overflow-hidden border-b-4 border-[#0F172A]"
              style={HERO_SHADOW}
            >
              {/* Trang trí background mềm */}
              <View className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-primary-500/10 blur-2xl pointer-events-none" />
              <View className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-mascot-500/10 blur-xl pointer-events-none" />

              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 pr-2">
                  {/* Tag phân loại */}
                  <View className="self-start flex-row items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full mb-2 border border-white/10">
                    <SparklesIcon size={12} className="text-reward-500" />
                    <Text className="text-[11px] font-extrabold text-reward-500 uppercase tracking-wider font-nunito">
                      ÔN TẬP ĐỊNH KỲ · SRS
                    </Text>
                  </View>

                  {/* Tiêu đề & Lời nhắn */}
                  {data.srsDue === 0 ? (
                    <View>
                      <Text className="font-extrabold text-[22px] text-white font-nunito leading-tight mb-1">
                        Hoàn thành hôm nay! 🎉
                      </Text>
                      <Text className="font-medium text-[13px] text-neutral-300 font-inter">
                        Bạn đã củng cố toàn bộ từ vựng đến hạn. Trí nhớ đang ở phong độ đỉnh cao!
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <Text className="font-extrabold text-[24px] text-white font-nunito leading-tight mb-1 tabular-nums">
                        {data.srsDue} TỪ VỰNG ĐẾN HẠN
                      </Text>
                      <Text className="font-medium text-[13px] text-neutral-300 font-inter">
                        Củng cố hôm nay để chuyển từ vựng vào vùng trí nhớ vĩnh viễn của não bộ.
                      </Text>
                    </View>
                  )}
                </View>

                {/* Snapy Nhân vật Neo thị giác */}
                <View className="items-center justify-center shrink-0 -mt-1 -mr-1" style={{ width: 100, height: 100 }}>
                  <Snapy pose={mascot.pose} animation={mascot.animation} style={{ width: 100, height: 100 }} />
                </View>
              </View>

              {/* Hộp thoại của Snapy */}
              <View className="bg-white/10 px-3.5 py-2.5 rounded-2xl mb-4 border border-white/10 flex-row items-center gap-2">
                <Text className="text-[13px] font-semibold text-neutral-200 font-inter flex-1">
                  Snapy: "{mascot.msg}"
                </Text>
              </View>

              {/* Primary Action Button dạng 3D Tactile */}
              {data.srsDue === 0 ? (
                <Pressable 
                  onPress={() => router.push('/topics' as any)}
                  className="h-14 bg-white rounded-2xl flex-row items-center justify-center gap-2 border-b-4 border-neutral-300 active:border-b-0 active:translate-y-1 shadow-sm"
                >
                  <Text className="text-mascot-navy font-extrabold text-[15px] font-nunito tracking-wider uppercase">
                    HỌC THÊM TỪ MỚI
                  </Text>
                  <ArrowRightIcon size={18} className="text-mascot-navy" />
                </Pressable>
              ) : (
                <Pressable 
                  onPress={() => router.push('/study/flashcard' as any)}
                  className="h-14 bg-primary-500 rounded-2xl flex-row items-center justify-center gap-2 border-b-4 border-primary-700 active:border-b-0 active:translate-y-1 shadow-sm"
                >
                  <Text className="text-white font-extrabold text-[15px] font-nunito tracking-wider uppercase">
                    ÔN TẬP NGAY ({data.srsDue} TỪ)
                  </Text>
                  <ArrowRightIcon size={18} className="text-white" />
                </Pressable>
              )}
            </View>
          </View>

          {/* ==========================================
              KHỐI 3: SNAPVOCAB ACTION HUB (HERO HIERARCHY)
              - 📸 Quét Camera: Hero Action Card nổi bật nhất (DNA SnapVocab)
              - 📚 Kho Chủ Đề & ⚡ Luyện Phản Xạ: 2 card song song có cá tính riêng
              - 🏆 Bảng Vàng: Thẻ hàng ngang vinh danh đua top tuần
              ========================================== */}
          <View className="px-5 mb-5 gap-3">
            
            {/* 1. HERO FEATURE: QUÉT CAMERA AI SNAP */}
            <Pressable 
              onPress={() => router.push('/(tabs)/scan' as any)}
              className="bg-white rounded-3xl p-4.5 border border-mascot-200/90 active:scale-[0.98] transition-all overflow-hidden"
              style={SOFT_CARD_SHADOW}
            >
              {/* Vệt sáng ấm nhẹ bên góc phải */}
              <View className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-mascot-100/40 blur-xl pointer-events-none" />

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3.5 flex-1 pr-2">
                  {/* Custom 3D Camera Icon */}
                  <View className="w-14 h-14 rounded-2xl bg-mascot-50 items-center justify-center border border-mascot-100 shrink-0">
                    <SnapCamera3D size={48} />
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-[17px] font-extrabold text-mascot-navy font-nunito">
                        Quét Camera
                      </Text>
                      {/* Micro-reward / Branded status badge */}
                      <View className="flex-row items-center gap-1 bg-mascot-500 px-2 py-0.5 rounded-full shadow-xs">
                        <View className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <Text className="text-[10px] font-extrabold text-white font-nunito tracking-wide uppercase">
                          AI Snap
                        </Text>
                      </View>
                    </View>
                    <Text className="text-[13px] font-medium text-neutral-500 font-inter leading-snug">
                      Chụp đồ vật quanh bạn · Nhận diện & học từ tức thì
                    </Text>
                  </View>
                </View>

                {/* Nút mũi tên hành động 3D */}
                <View className="w-9 h-9 rounded-full bg-mascot-500 items-center justify-center border-b-2 border-mascot-700 shadow-xs shrink-0">
                  <ArrowRightIcon size={16} className="text-white" />
                </View>
              </View>
            </Pressable>

            {/* 2 & 3. ROW SONG SONG: KHO CHỦ ĐỀ & LUYỆN PHẢN XẠ */}
            <View className="flex-row gap-3">
              
              {/* Kho Chủ Đề (Bên trái) */}
              <Pressable 
                onPress={() => router.push('/topics' as any)}
                className="flex-1 bg-white rounded-3xl p-4 border border-neutral-200/80 active:scale-[0.98] transition-all justify-between min-h-[140px]"
                style={SOFT_CARD_SHADOW}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="w-12 h-12 rounded-2xl bg-primary-50 items-center justify-center border border-primary-100">
                    <TopicBook3D size={40} />
                  </View>
                  <View className="flex-row items-center gap-1.5 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-200/80">
                    <View className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    <Text className="text-[10px] font-extrabold text-primary-700 font-nunito uppercase">
                      50+ Bộ
                    </Text>
                  </View>
                </View>

                <View>
                  <Text className="text-[16px] font-extrabold text-mascot-navy font-nunito" numberOfLines={1}>
                    Kho Chủ Đề
                  </Text>
                  <Text className="text-[12px] font-medium text-neutral-500 font-inter mt-0.5" numberOfLines={1}>
                    Khám phá lộ trình
                  </Text>
                </View>
              </Pressable>

              {/* Luyện Phản Xạ (Bên phải - Đối xứng 100%) */}
              <Pressable 
                onPress={() => router.push('/study/flashcard' as any)}
                className="flex-1 bg-white rounded-3xl p-4 border border-neutral-200/80 active:scale-[0.98] transition-all justify-between min-h-[140px]"
                style={SOFT_CARD_SHADOW}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="w-12 h-12 rounded-2xl bg-info-50 items-center justify-center border border-info-100">
                    <FlashcardSpin3D size={40} />
                  </View>
                  <View className="flex-row items-center gap-1.5 bg-info-50 px-2.5 py-1 rounded-full border border-info-200/80">
                    <View className="w-1.5 h-1.5 rounded-full bg-info-500" />
                    <Text className="text-[10px] font-extrabold text-info-700 font-nunito uppercase">
                      3D Card
                    </Text>
                  </View>
                </View>

                <View>
                  <Text className="text-[16px] font-extrabold text-mascot-navy font-nunito" numberOfLines={1}>
                    Luyện Phản Xạ
                  </Text>
                  <Text className="text-[12px] font-medium text-neutral-500 font-inter mt-0.5" numberOfLines={1}>
                    Flashcard & Quiz
                  </Text>
                </View>
              </Pressable>

            </View>

            {/* 4. BẢNG VÀNG GIẢI ĐẤU (STATUS CARD NGANG) */}
            <Pressable 
              onPress={() => router.push('/(tabs)/leaderboard' as any)}
              className="bg-white rounded-3xl p-3.5 px-4 border border-amber-200/80 active:scale-[0.98] transition-all"
              style={SOFT_CARD_SHADOW}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1 pr-2">
                  <View className="w-11 h-11 rounded-2xl bg-amber-50 items-center justify-center border border-amber-100 shrink-0">
                    <PodiumTrophy3D size={42} />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-0.5">
                      <Text className="text-[15px] font-extrabold text-mascot-navy font-nunito">
                        Bảng Vàng Tuần
                      </Text>
                      <View className="flex-row items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/70">
                        <View className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <Text className="text-[10px] font-extrabold text-amber-700 font-nunito uppercase">
                          Top Tuần
                        </Text>
                      </View>
                    </View>
                    <Text className="text-[12px] font-medium text-neutral-500 font-inter">
                      Hạng #{data.leaderboardMe.rank} {data.leaderboardMe.league} · Đua top nhận thưởng rương hiếm
                    </Text>
                  </View>
                </View>

                <ChevronRightIcon size={18} className="text-neutral-400" />
              </View>
            </Pressable>

          </View>

          {/* ==========================================
              TRA TỪ VỰNG NHANH (SEARCH BAR)
              ========================================== */}
          <View className="px-5 mb-4">
            <Pressable 
              onPress={() => router.push('/dictionary' as any)}
              className="flex-row items-center h-12 px-4 rounded-2xl bg-white border border-neutral-200/80 active:bg-neutral-50 shadow-xs"
            >
              <SearchIcon size={18} className="text-neutral-400 mr-3" />
              <Text className="flex-1 font-inter text-[14px] text-neutral-400">
                Tra từ điển hoặc gõ từ vựng tiếng Anh...
              </Text>
              <View className="bg-neutral-100 px-2 py-1 rounded-md">
                <Text className="text-[11px] font-bold text-neutral-500 font-inter">
                  Tra nhanh
                </Text>
              </View>
            </Pressable>
          </View>

          {/* ==========================================
              KHỐI 4: BỘ 3 CHỈ SỐ HỌC TẬP (PROGRESS METRICS)
              Streak · Từ đã thuộc · Độ chính xác
              ========================================== */}
          <View className="px-5 mb-5">
            <Pressable 
              onPress={() => router.push('/(tabs)/stats' as any)}
              className="flex-row items-center justify-between bg-white rounded-2xl p-4 border border-neutral-200/70 active:scale-[0.99]"
              style={SOFT_CARD_SHADOW}
            >
              {/* Metric 1: Chuỗi ngày */}
              <View className="flex-1 items-center border-r border-neutral-100">
                <Text className="text-[20px] font-extrabold text-mascot-navy font-nunito tabular-nums">
                  {data.user.streak}
                </Text>
                <Text className="text-[12px] font-semibold text-neutral-500 font-inter mt-0.5">
                  Ngày liên tục
                </Text>
              </View>

              {/* Metric 2: Từ đã thuộc */}
              <View className="flex-1 items-center border-r border-neutral-100">
                <Text className="text-[20px] font-extrabold text-mascot-navy font-nunito tabular-nums">
                  {data.user.words}
                </Text>
                <Text className="text-[12px] font-semibold text-neutral-500 font-inter mt-0.5">
                  Từ đã thuộc
                </Text>
              </View>

              {/* Metric 3: Độ chính xác */}
              <View className="flex-1 items-center">
                <Text className="text-[20px] font-extrabold text-primary-600 font-nunito tabular-nums">
                  {data.user.accuracy}%
                </Text>
                <Text className="text-[12px] font-semibold text-neutral-500 font-inter mt-0.5">
                  Độ chính xác
                </Text>
              </View>
            </Pressable>
          </View>

          {/* ==========================================
              KHỐI 5: TIẾP TỤC HỌC (CONTINUE LEARNING DECK)
              ========================================== */}
          <View className="px-5 mb-5">
            <View 
              className="bg-white rounded-3xl p-5 border border-neutral-200/70"
              style={SOFT_CARD_SHADOW}
            >
              <View className="flex-row items-center justify-between mb-3">
                <Text className="font-extrabold text-[14px] text-neutral-400 uppercase tracking-wider font-nunito">
                  TIẾP TỤC HỌC
                </Text>
                <Pressable onPress={() => router.push('/topics' as any)} className="active:opacity-70">
                  <Text className="font-bold text-[13px] text-primary-600 font-inter">
                    Khám phá chủ đề →
                  </Text>
                </Pressable>
              </View>

              <View>
                <Text className="font-extrabold text-[19px] text-mascot-navy font-nunito mb-0.5">
                  {data.continueLearning.deckName}
                </Text>
                <Text className="font-medium text-[13px] text-neutral-500 font-inter mb-3">
                  Bài học {data.continueLearning.lesson} · {data.continueLearning.progress}/{data.continueLearning.total} từ vựng đã nắm vững
                </Text>
                
                <View className="flex-row items-center gap-3 mb-4">
                  <View className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <View 
                      className="h-full bg-primary-500 rounded-full" 
                      style={{ width: `${(data.continueLearning.progress / data.continueLearning.total) * 100}%` }}
                    />
                  </View>
                  <Text className="text-[13px] font-extrabold text-neutral-700 font-nunito tabular-nums">
                    {Math.round((data.continueLearning.progress / data.continueLearning.total) * 100)}%
                  </Text>
                </View>

                <Pressable 
                  onPress={() => router.push('/study/flashcard' as any)}
                  className="h-13 py-3 bg-primary-500 rounded-xl flex-row items-center justify-center gap-2 border-b-4 border-primary-700 active:border-b-0 active:translate-y-1 shadow-sm"
                >
                  <Text className="text-white font-extrabold text-[14px] font-nunito uppercase tracking-wider">
                    TIẾP TỤC BÀI HỌC
                  </Text>
                  <ArrowRightIcon size={16} className="text-white" />
                </Pressable>
              </View>
            </View>
          </View>

          {/* ==========================================
              KHỐI 6: NHIỆM VỤ HÀNG NGÀY (DAILY MISSIONS)
              ========================================== */}
          <View className="px-5 mb-5">
            <View 
              className="bg-white rounded-3xl p-5 border border-neutral-200/70"
              style={SOFT_CARD_SHADOW}
            >
              <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center gap-2">
                  <SparklesIcon size={18} className="text-mascot-500" />
                  <Text className="font-extrabold text-[14px] text-mascot-navy uppercase font-nunito tracking-wider">
                    NHIỆM VỤ HÀNG NGÀY
                  </Text>
                </View>
                
                {/* Countdown làm mới ngày mới */}
                <View className="flex-row items-center gap-1.5 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-200">
                  <ClockIcon size={13} className="text-neutral-500" />
                  <Text className="font-bold text-[13px] text-neutral-600 font-nunito tabular-nums">
                    {data.resetCountdown}
                  </Text>
                </View>
              </View>

              <View className="divide-y divide-neutral-100">
                {data.missions.map(m => (
                  <View key={m.id} className="py-3 flex-row items-center justify-between first:pt-0 last:pb-0">
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
                      {m.isCoin ? <Coin3D size="xs" /> : <XPOrb3D size="xs" />}
                      <Text className="font-extrabold tabular-nums text-[13px] text-neutral-700 font-nunito">
                        +{m.reward}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <Pressable 
                onPress={() => router.push('/(tabs)/missions' as any)} 
                className="mt-3.5 pt-3 border-t border-neutral-100 flex-row items-center justify-center gap-1 active:opacity-70"
              >
                <Text className="font-bold text-neutral-600 text-[13px] font-inter uppercase tracking-wider">
                  XEM TẤT CẢ NHIỆM VỤ
                </Text>
                <ChevronRightIcon size={15} className="text-neutral-600" />
              </Pressable>
            </View>
          </View>

          {/* ==========================================
              KHỐI 7: TỪ VỪA HỌC GẦN ĐÂY (RECENT WORDS)
              ========================================== */}
          <View className="mb-5">
            <View className="px-5 mb-3 flex-row items-center justify-between">
              <Text className="font-extrabold text-[14px] text-neutral-400 uppercase tracking-wider font-nunito">
                TỪ VỪA HỌC GẦN ĐÂY
              </Text>
              <Pressable onPress={() => router.push('/dictionary' as any)} className="active:opacity-70">
                <Text className="font-bold text-[13px] text-primary-600 font-inter">
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
                  className="bg-white rounded-2xl px-4 py-3.5 border border-neutral-200/80 active:bg-neutral-50 shadow-xs min-w-[140px]"
                >
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">
                      {word.word}
                    </Text>
                    <View className="bg-primary-50 px-1.5 py-0.5 rounded border border-primary-200">
                      <Text className="text-[10px] font-extrabold text-primary-700 font-nunito">
                        {word.mastery}
                      </Text>
                    </View>
                  </View>
                  <Text className="font-medium text-[12px] text-neutral-400 font-inter mb-0.5">
                    {word.ipa}
                  </Text>
                  <Text className="font-semibold text-[13px] text-neutral-600 font-inter" numberOfLines={1}>
                    {word.translation}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>


          {/* ==========================================
              KHỐI 9: LEADERBOARD & THÀNH TỰU
              ========================================== */}
          <View className="px-5 mb-6">
            <Text className="font-extrabold text-[14px] text-neutral-400 uppercase tracking-wider font-nunito mb-3">
              BẢNG XẾP HẠNG & THÀNH TỰU
            </Text>

            <View className="flex-row gap-3">
              {/* Leaderboard */}
              <Pressable 
                onPress={() => router.push('/(tabs)/leaderboard' as any)}
                className="flex-1 bg-white rounded-2xl p-4 border border-neutral-200/70 active:scale-[0.98]"
                style={SOFT_CARD_SHADOW}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <StreakFlame3D size="sm" />
                  <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">
                    Hạng #{data.leaderboardMe.rank}
                  </Text>
                </View>
                <Text className="font-medium text-[13px] text-neutral-500 font-inter">
                  Giải đấu {data.leaderboardMe.league}
                </Text>
                <View className="mt-3 pt-2.5 border-t border-neutral-100 flex-row items-center justify-between">
                  <Text className="font-bold text-[13px] text-neutral-600 font-inter">
                    Bảng tuần
                  </Text>
                  <ChevronRightIcon size={14} className="text-neutral-500" />
                </View>
              </Pressable>

              {/* Achievements */}
              <Pressable 
                onPress={() => router.push('/(tabs)/achievements' as any)}
                className="flex-1 bg-white rounded-2xl p-4 border border-neutral-200/70 active:scale-[0.98]"
                style={SOFT_CARD_SHADOW}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <AchievementTrophy3D size="sm" />
                  <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">
                    Cấp {data.user.level}
                  </Text>
                </View>
                <Text className="font-medium text-[13px] text-neutral-500 font-inter">
                  Huy hiệu & Thưởng
                </Text>
                <View className="mt-3 pt-2.5 border-t border-neutral-100 flex-row items-center justify-between">
                  <Text className="font-bold text-[13px] text-neutral-600 font-inter">
                    Chi tiết
                  </Text>
                  <ChevronRightIcon size={14} className="text-neutral-500" />
                </View>
              </Pressable>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
