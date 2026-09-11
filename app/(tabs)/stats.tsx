import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeftIcon,
  TrendingUpIcon,
  TargetIcon,
  ChevronRightIcon,
  CalendarIcon,
  CheckCircle2Icon,
  BookOpenIcon,
  Gamepad2Icon,
  ClockIcon,
  SparklesIcon,
  CameraIcon,
  InfoIcon,
  FlameIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';
import { StreakFlame3D, Coin3D, XPOrb3D } from '@/components/snapvocab';

// Soft Ambient Shadow tokens cho giao diện thẻ phẳng, có chiều sâu tự nhiên
const SOFT_CARD_SHADOW = Platform.select({
  web: {
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
  },
  default: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
}) as any;

const SOFT_CARD_SM_SHADOW = Platform.select({
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

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_STATS = {
  isNewUser: false,
  totalSaved: 1248,
  savedThisWeek: 32,
  newWords: 120,    // 10%
  learned: 722,     // 58%
  reviewing: 326,   // 26%
  mastered: 80,     // 6%
  streak: 12,
  longestStreak: 27,
  accuracy: {
    overall: 89,
    quiz: 87,
    review: 92
  },
  goal: {
    current: 28,
    target: 30,
    unit: 'XP'
  },
  reviewsCount: 326,
  quizAttempts: 7,
  totalStudyMinutes: 870 // ~14.5 giờ
};

// 7-day weekly activity
const WEEK_DATA = [
  { day: 'T2', xp: 110, words: 18, isToday: false },
  { day: 'T3', xp: 85, words: 12, isToday: false },
  { day: 'T4', xp: 140, words: 22, isToday: false },
  { day: 'T5', xp: 60, words: 8, isToday: false },
  { day: 'T6', xp: 180, words: 28, isToday: false },
  { day: 'T7', xp: 95, words: 15, isToday: false },
  { day: 'CN', xp: 120, words: 20, isToday: true }
];

// Today sessions
const TODAY_SESSIONS = [
  {
    id: 's1',
    time: '08:30',
    title: 'Ôn tập SRS Flashcard',
    detail: '12 từ ôn tập · 6 phút',
    xp: 25,
    icon: BookOpenIcon,
    color: 'bg-primary-50 text-primary-600'
  },
  {
    id: 's2',
    time: '13:45',
    title: 'Làm Quiz Từ vựng Công nghệ',
    detail: '1 bài Quiz · 10 câu hỏi · 4 phút',
    xp: 35,
    icon: Gamepad2Icon,
    color: 'bg-info-50 text-info-600'
  },
  {
    id: 's3',
    time: '19:20',
    title: 'Camera AI Scan nhận diện',
    detail: '6 từ mới phát hiện · 5 phút',
    xp: 20,
    icon: CameraIcon,
    color: 'bg-warning-50 text-warning-600'
  }
];

// 28 days for Monthly Heatmap
const MONTH_DAYS = Array.from({ length: 28 }, (_, i) => {
  const dayNum = i + 1;
  const intensity = (i * 3 + dayNum * 5) % 5;
  const xp = intensity * 35 + (intensity > 0 ? 15 : 0);
  const words = intensity * 6;
  return {
    dayNum,
    intensity,
    xp,
    words,
    quizzes: intensity > 2 ? 2 : (intensity > 0 ? 1 : 0)
  };
});

const SNAPY_QUOTES = [
  "Bạn đang duy trì chuỗi 12 ngày học rất xuất sắc! Với phong độ này, bạn sẽ thăng cấp Level 13 chỉ trong 2 ngày tới.",
  "Mẹo nhỏ từ Snapy: Học từ vựng vào buổi sáng và ôn lại trước khi ngủ giúp tăng 40% khả năng ghi nhớ dài hạn đấy!",
  "Tuyệt vời! Bạn đã tích lũy 80 từ thuộc lòng vĩnh viễn (Mastered) trong kho từ vựng cá nhân!",
  "Độ chính xác Quiz 87% là một con số rất ấn tượng! Hãy tiếp tục duy trì đà phát triển này nhé!"
];

export default function StatsScreen() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedBarDay, setSelectedBarDay] = useState<typeof WEEK_DATA[0]>(WEEK_DATA[6]);
  const [selectedHeatmapDay, setSelectedHeatmapDay] = useState<typeof MONTH_DAYS[0] | null>(MONTH_DAYS[27]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isGoalCompleted, setIsGoalCompleted] = useState(false);
  const [claimedReward, setClaimedReward] = useState(false);
  const [activeStateInfo, setActiveStateInfo] = useState<string | null>(null);

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % SNAPY_QUOTES.length);
  };

  // ==========================================
  // VIEW: EMPTY STATE (NEW USER)
  // ==========================================
  if (MOCK_STATS.isNewUser) {
    return (
      <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
        <View className="bg-white border-b border-neutral-100 z-10">
          <View className="max-w-md w-full mx-auto px-4 py-3 flex-row items-center justify-between">
            <Pressable 
              onPress={() => (router.canGoBack() ? router.back() : router.push('/(tabs)'))}
              className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100 -ml-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeftIcon size={22} className="text-mascot-navy" />
            </Pressable>
            <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito flex-1 text-center pr-8">
              Tiến độ
            </Text>
          </View>
        </View>
        
        <View className="flex-1 items-center justify-center p-6 pb-20 max-w-md w-full mx-auto">
          <Snapy pose="kham_pha" animation="bounce" className="w-48 h-48 mb-6" />
          <Text className="font-extrabold text-[24px] text-mascot-navy font-nunito text-center mb-2">
            Hành trình bắt đầu!
          </Text>
          <Text className="font-medium text-[15px] text-neutral-500 font-inter text-center mb-8 px-4">
            Chưa có dữ liệu học tập. Hãy lưu từ vựng và bắt đầu học để xem thống kê của bạn tại đây nhé!
          </Text>
          <Pressable 
            onPress={() => router.push('/(tabs)')}
            className="w-full h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:border-b-0 active:translate-y-1 items-center justify-center"
          >
            <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wide">
              BẮT ĐẦU HỌC NGAY
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // RENDER ACTIVITY TABS
  // ==========================================
  const renderActivityContent = () => {
    if (activeTab === 'daily') {
      return (
        <View className="pt-2">
          <View className="flex-row items-center justify-between mb-3 bg-neutral-50 p-3 rounded-2xl border border-neutral-200/60">
            <View>
              <Text className="text-[12px] font-bold text-neutral-400 font-inter uppercase">Tổng hôm nay</Text>
              <Text className="text-[18px] font-extrabold text-mascot-navy font-nunito">80 XP · 18 từ mới</Text>
            </View>
            <View className="bg-primary-100 px-3 py-1 rounded-full">
              <Text className="text-[12px] font-bold text-primary-700 font-inter">3 phiên học</Text>
            </View>
          </View>

          <View className="gap-2.5">
            {TODAY_SESSIONS.map((s) => {
              const IconComp = s.icon;
              return (
                <View key={s.id} className="bg-white rounded-2xl p-3.5 border border-neutral-100 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1 mr-2">
                    <View className={cn("w-10 h-10 rounded-xl items-center justify-center", s.color)}>
                      <IconComp size={20} />
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-[14px] text-mascot-navy font-inter">{s.title}</Text>
                      <Text className="text-[12px] font-medium text-neutral-400 font-inter">{s.detail}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="font-extrabold text-[15px] text-warning-500 font-nunito">+{s.xp} XP</Text>
                    <Text className="text-[11px] font-semibold text-neutral-400 font-inter">{s.time}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      );
    }

    if (activeTab === 'weekly') {
      const maxXP = Math.max(...WEEK_DATA.map(d => d.xp));
      return (
        <View className="pt-2">
          {/* Bar Chart */}
          <View className="h-44 flex-row items-end justify-between px-2 pt-6 pb-2 border-b border-neutral-100">
            {WEEK_DATA.map((item) => {
              const heightPercent = Math.max(15, Math.round((item.xp / maxXP) * 100));
              const isSelected = selectedBarDay.day === item.day;
              return (
                <Pressable 
                  key={item.day}
                  onPress={() => setSelectedBarDay(item)}
                  className="items-center flex-1 mx-1 group"
                >
                  <Text className={cn(
                    "text-[11px] font-bold mb-1.5 font-inter",
                    isSelected ? "text-primary-600 font-extrabold" : "text-neutral-400"
                  )}>
                    {item.xp}
                  </Text>
                  <View className="w-full max-w-[28px] h-28 bg-neutral-100 rounded-t-xl overflow-hidden justify-end">
                    <View 
                      className="w-full rounded-t-xl"
                      style={{ 
                        height: `${heightPercent}%`,
                        backgroundColor: item.isToday ? '#58CC02' : (isSelected ? '#7DD634' : '#C2EE96')
                      }}
                    />
                  </View>
                  <View className={cn(
                    "mt-2 px-1.5 py-0.5 rounded-md",
                    item.isToday && "bg-primary-500"
                  )}>
                    <Text className={cn(
                      "text-[11px] font-bold font-inter",
                      item.isToday ? "text-white" : (isSelected ? "text-mascot-navy" : "text-neutral-400")
                    )}>
                      {item.day}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Selected Day Banner */}
          <View className="mt-4 bg-primary-50 rounded-2xl p-3.5 border border-primary-100 flex-row items-center justify-between">
            <View>
              <Text className="font-extrabold text-[14px] text-mascot-navy font-nunito">
                {selectedBarDay.day === 'CN' ? 'Chủ nhật (Hôm nay)' : `Thứ ${selectedBarDay.day.replace('T', '')}`}
              </Text>
              <Text className="font-medium text-[12px] text-primary-700 font-inter">
                {selectedBarDay.xp} XP đạt được · {selectedBarDay.words} từ mới học
              </Text>
            </View>
            <View className="bg-white px-3 py-1.5 rounded-xl border border-primary-200 shadow-sm">
              <Text className="text-[12px] font-extrabold text-primary-600 font-nunito">
                {selectedBarDay.xp >= 100 ? 'Đạt mục tiêu ✓' : 'Tiếp tục phát huy!'}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    // Monthly Heatmap
    const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    return (
      <View className="pt-2">
        {/* Day labels header */}
        <View className="flex-row justify-between mb-2 px-1">
          {daysOfWeek.map((day) => (
            <Text key={day} className="w-8 text-center text-[10px] font-bold text-neutral-400 font-inter">
              {day}
            </Text>
          ))}
        </View>

        {/* 4 Weeks Grid */}
        <View className="gap-1.5">
          {[0, 1, 2, 3].map((weekIdx) => (
            <View key={weekIdx} className="flex-row justify-between">
              {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                const item = MONTH_DAYS[weekIdx * 7 + dayIdx];
                const isSelected = selectedHeatmapDay?.dayNum === item.dayNum;
                let bgClass = "bg-neutral-100";
                let bgHex = "#D4D5DF";
                if (item.intensity === 1) { bgClass = "bg-primary-100"; bgHex = "#DEF7C4"; }
                if (item.intensity === 2) { bgClass = "bg-primary-300"; bgHex = "#A0E063"; }
                if (item.intensity === 3) { bgClass = "bg-primary-500"; bgHex = "#58CC02"; }
                if (item.intensity === 4) { bgClass = "bg-primary-700"; bgHex = "#3C8C00"; }

                return (
                  <TouchableOpacity
                    key={item.dayNum}
                    activeOpacity={0.8}
                    onPress={() => setSelectedHeatmapDay(item)}
                    className={cn(
                      "w-8 h-8 rounded-lg items-center justify-center",
                      bgClass,
                      isSelected && "border-2 border-mascot-navy z-10"
                    )}
                    style={{ 
                      backgroundColor: bgHex,
                      ...(isSelected ? (Platform.OS === 'web' ? { transform: [{ scale: 1.1 }], boxShadow: '0 1px 3px rgba(0,0,0,0.15)' } : { transform: [{ scale: 1.1 }], shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, elevation: 2 }) : {})
                    }}
                  >
                    <Text className={cn(
                      "text-[10px] font-bold font-inter",
                      item.intensity >= 3 ? "text-white" : "text-neutral-600"
                    )}>
                      {item.dayNum}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Legend */}
        <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-neutral-100">
          <View className="flex-row items-center gap-1.5 opacity-80">
            <Text className="text-[10px] text-neutral-400 font-bold uppercase">Ít</Text>
            <View className="w-3 h-3 rounded-sm bg-neutral-100" />
            <View className="w-3 h-3 rounded-sm bg-primary-100" style={{ backgroundColor: '#DEF7C4' }} />
            <View className="w-3 h-3 rounded-sm bg-primary-300" style={{ backgroundColor: '#A0E063' }} />
            <View className="w-3 h-3 rounded-sm bg-primary-500" style={{ backgroundColor: '#58CC02' }} />
            <View className="w-3 h-3 rounded-sm bg-primary-700" style={{ backgroundColor: '#3C8C00' }} />
            <Text className="text-[10px] text-neutral-400 font-bold uppercase">Nhiều</Text>
          </View>

          <Text className="text-[11px] font-semibold text-neutral-400 font-inter">Chạm ô để xem ngày</Text>
        </View>

        {/* Interactive Tooltip Card for Selected Day */}
        {selectedHeatmapDay && (
          <View className="mt-3 bg-neutral-50 rounded-2xl p-3.5 border border-neutral-200/80 flex-row items-center justify-between">
            <View>
              <Text className="font-extrabold text-[14px] text-mascot-navy font-nunito">
                Ngày {selectedHeatmapDay.dayNum} tháng này
              </Text>
              <Text className="font-medium text-[12px] text-neutral-600 font-inter">
                {selectedHeatmapDay.xp} XP tích lũy · {selectedHeatmapDay.words} từ mới · {selectedHeatmapDay.quizzes} bài Quiz
              </Text>
            </View>
            <View className="bg-primary-500/10 px-2.5 py-1 rounded-lg border border-primary-500/30">
              <Text className="text-[12px] font-bold text-primary-700 font-inter">
                +{selectedHeatmapDay.xp} XP
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  // ==========================================
  // VIEW: MAIN STATS DASHBOARD
  // ==========================================
  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* HEADER */}
      <View className="bg-white border-b border-neutral-100 z-10">
        <View className="max-w-md w-full mx-auto px-4 py-3 flex-row items-center justify-between">
          <Pressable 
            onPress={() => (router.canGoBack() ? router.back() : router.push('/(tabs)'))}
            className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100 -ml-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeftIcon size={22} className="text-mascot-navy" />
          </Pressable>
          <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito flex-1 text-center pr-8">
            Tiến độ
          </Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="max-w-md w-full mx-auto">
          
          {/* 1. HERO OVERVIEW */}
          <View className="items-center py-6">
            <View className="flex-row items-center gap-2 mb-2">
              <TrendingUpIcon size={20} className="text-success-500" />
              <Text className="font-extrabold text-[14px] text-neutral-400 font-inter uppercase tracking-widest">
                TỔNG QUAN
              </Text>
            </View>
            <Text className="font-extrabold text-[48px] text-mascot-navy font-nunito leading-tight">
              {MOCK_STATS.totalSaved.toLocaleString()}
            </Text>
            <Text className="font-bold text-[16px] text-neutral-500 font-inter mb-4">Từ vựng đã lưu</Text>
            
            <View className="bg-success-50 px-4 py-1.5 rounded-full border border-success-100 mb-6">
              <Text className="font-bold text-[13px] text-success-700 font-inter">+{MOCK_STATS.savedThisWeek} từ tuần này</Text>
            </View>
            
            {/* CTA LEVEL PROGRESS BANNER */}
            <Pressable 
              onPress={() => router.push('/stats/level-progress')}
              className="w-full bg-primary-50 rounded-2xl border border-primary-200/80 active:bg-primary-100/80 p-3.5 flex-row items-center justify-between"
              style={SOFT_CARD_SM_SHADOW}
            >
              <View className="flex-row items-center gap-3 flex-1 mr-3">
                <View className="w-10 h-10 bg-primary-500 rounded-xl items-center justify-center shadow-sm">
                  <Text className="font-extrabold text-[13px] text-white font-nunito">L.12</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1.5">
                    <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito">Tiến độ Level 12</Text>
                    <Text className="font-bold text-[12px] text-primary-700 font-inter">2,850 / 3,000 XP</Text>
                  </View>
                  <View className="h-2 bg-primary-100 rounded-full overflow-hidden w-full">
                    <View className="h-full bg-primary-500 rounded-full" style={{ width: '95%', backgroundColor: '#58CC02' }} />
                  </View>
                </View>
              </View>
              <ChevronRightIcon size={20} className="text-primary-600" />
            </Pressable>
          </View>

          {/* 2. SNAPY INSIGHT SPEECH BUBBLE */}
          <TouchableOpacity 
            activeOpacity={0.85}
            onPress={nextQuote}
            className="bg-white rounded-3xl p-4 border border-neutral-200/60 mb-5 flex-row items-center gap-3"
            style={SOFT_CARD_SHADOW}
          >
            <Snapy pose="tu_hao" animation="float" className="w-16 h-16" />
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="font-extrabold text-[13px] text-mascot-500 font-nunito uppercase tracking-wide">
                  Lời khuyên từ Snapy
                </Text>
                <SparklesIcon size={14} className="text-warning-500" />
              </View>
              <Text className="font-medium text-[13px] text-neutral-600 font-inter leading-relaxed">
                "{SNAPY_QUOTES[quoteIndex]}"
              </Text>
              <Text className="text-[10px] text-neutral-400 font-bold font-inter mt-1">Chạm Snapy để xem mẹo khác 💡</Text>
            </View>
          </TouchableOpacity>

          {/* 3. STREAK CARD */}
          <View 
            className="bg-white rounded-3xl border border-neutral-200/60 p-5 flex-row items-center justify-between mb-5"
            style={SOFT_CARD_SHADOW}
          >
            <View className="flex-1 mr-2">
              <View className="flex-row items-center gap-2 mb-1">
                <StreakFlame3D size="sm" animation="pulse" />
                <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito tabular-nums">{MOCK_STATS.streak} Ngày</Text>
              </View>
              <Text className="font-bold text-[12px] text-mascot-500 font-inter uppercase tracking-wide">
                Kỷ lục: {MOCK_STATS.longestStreak} ngày
              </Text>
            </View>

            {/* Mini Calendar */}
            <View className="flex-row gap-1">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, idx) => (
                <View key={day} className="items-center gap-1.5">
                  <Text className="font-bold text-[10px] text-neutral-400 font-inter">{day}</Text>
                  <View className={cn(
                    "w-6 h-6 rounded-full items-center justify-center",
                    idx < 5 ? "bg-mascot-500" : "bg-neutral-100"
                  )}>
                    {idx < 5 && <CheckCircle2Icon size={12} className="text-white" />}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* 4. DAILY GOAL WITH COMPLETED STATE */}
          <View className="mb-5">
            {!isGoalCompleted ? (
              <View 
                className="bg-white rounded-3xl p-5 border border-neutral-200/60 flex-row items-center justify-between"
                style={SOFT_CARD_SHADOW}
              >
                <View className="flex-1 pr-4">
                  <View className="flex-row items-center gap-2 mb-1">
                    <TargetIcon size={18} className="text-primary-600" />
                    <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">Mục tiêu hôm nay</Text>
                  </View>
                  <Text className="font-medium text-[13px] text-neutral-500 font-inter mb-3">
                    Còn {MOCK_STATS.goal.target - MOCK_STATS.goal.current} {MOCK_STATS.goal.unit} nữa để hoàn thành!
                  </Text>
                  
                  <View className="h-2.5 bg-neutral-100 rounded-full overflow-hidden w-full">
                    <View 
                      className="h-full bg-primary-500 rounded-full" 
                      style={{ width: `${(MOCK_STATS.goal.current / MOCK_STATS.goal.target) * 100}%`, backgroundColor: '#58CC02' }}
                    />
                  </View>
                </View>

                <Pressable 
                  onPress={() => router.push('/(tabs)/learn')}
                  className="bg-primary-500 w-11 h-11 rounded-xl items-center justify-center border-b-[3px] border-primary-700 active:border-b-0 active:translate-y-0.5"
                >
                  <ChevronRightIcon size={22} className="text-white" />
                </Pressable>
              </View>
            ) : (
              <View 
                className="bg-gradient-to-r from-success-50 to-primary-50 rounded-3xl p-5 border border-success-200 flex-row items-center justify-between"
                style={SOFT_CARD_SHADOW}
              >
                <View className="flex-1 pr-3">
                  <View className="flex-row items-center gap-2 mb-1">
                    <View className="w-7 h-7 bg-success-500 rounded-full items-center justify-center">
                      <CheckCircle2Icon size={16} className="text-white" />
                    </View>
                    <Text className="font-extrabold text-[16px] text-success-800 font-nunito">Mục tiêu ngày: Đạt 100%!</Text>
                  </View>
                  <Text className="font-medium text-[13px] text-success-700 font-inter mb-2">
                    Bạn đã hoàn thành 30/30 XP mục tiêu hôm nay.
                  </Text>
                  
                  {!claimedReward ? (
                    <Pressable
                      onPress={() => setClaimedReward(true)}
                      className="bg-warning-500 active:bg-warning-600 py-2 px-3.5 rounded-xl self-start flex-row items-center gap-1.5 border-b-[3px] border-warning-700 active:border-b-0 active:translate-y-0.5"
                    >
                      <Coin3D size="xs" />
                      <Text className="text-[12px] font-extrabold text-mascot-navy font-nunito">Nhận +20 Coin</Text>
                    </Pressable>
                  ) : (
                    <View className="flex-row items-center gap-1">
                      <CheckCircle2Icon size={14} className="text-success-600" />
                      <Text className="text-[12px] font-bold text-success-700 font-inter">Đã nhận thưởng hôm nay</Text>
                    </View>
                  )}
                </View>

                <Snapy pose="an_mung" animation="celebrate" className="w-16 h-16" />
              </View>
            )}

            {/* Quick state toggle for demo/testing */}
            <Pressable 
              onPress={() => {
                setIsGoalCompleted(!isGoalCompleted);
                setClaimedReward(false);
              }}
              className="mt-1.5 self-end py-0.5 px-2"
            >
              <Text className="text-[11px] font-bold text-neutral-400 font-inter">
                {isGoalCompleted ? '← Xem trạng thái đang làm' : '⚡ Thử trạng thái Hoàn thành'}
              </Text>
            </Pressable>
          </View>

          {/* 5. FULL 4-GROUP LEARNING STATE MAP */}
          <View 
            className="bg-white rounded-3xl p-5 border border-neutral-200/60 mb-6"
            style={SOFT_CARD_SHADOW}
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">Tiến độ từ vựng</Text>
              <View className="bg-neutral-100 px-2.5 py-1 rounded-lg">
                <Text className="text-[12px] font-extrabold text-mascot-navy font-nunito">Tổng: {MOCK_STATS.totalSaved} từ</Text>
              </View>
            </View>

            <View className="gap-4">
              {/* Group 1: New / Saved */}
              <Pressable 
                onPress={() => setActiveStateInfo(activeStateInfo === 'new' ? null : 'new')}
                className="active:opacity-80"
              >
                <View className="flex-row items-center justify-between mb-1.5">
                  <View className="flex-row items-center gap-1.5">
                    <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#6366F1' }} />
                    <Text className="font-bold text-[14px] text-indigo-600 font-inter">Mới lưu (New)</Text>
                  </View>
                  <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito">
                    {MOCK_STATS.newWords} <Text className="text-[12px] text-neutral-400 font-medium font-inter">(10%)</Text>
                  </Text>
                </View>
                <View className="h-3 bg-neutral-100 rounded-full overflow-hidden w-full">
                  <View 
                    className="h-full rounded-full" 
                    style={{ width: '10%', backgroundColor: '#6366F1' }} 
                  />
                </View>
                {activeStateInfo === 'new' && (
                  <Text className="text-[11px] text-indigo-600 font-medium font-inter mt-1.5 bg-indigo-50 p-2 rounded-lg">
                    Từ vừa được lưu qua Camera Scan hoặc Từ điển, chưa bắt đầu học SRS.
                  </Text>
                )}
              </Pressable>

              {/* Group 2: Learned */}
              <Pressable 
                onPress={() => setActiveStateInfo(activeStateInfo === 'learned' ? null : 'learned')}
                className="active:opacity-80"
              >
                <View className="flex-row items-center justify-between mb-1.5">
                  <View className="flex-row items-center gap-1.5">
                    <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#1CB0F6' }} />
                    <Text className="font-bold text-[14px] text-info-600 font-inter">Đã học (Learned)</Text>
                  </View>
                  <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito">
                    {MOCK_STATS.learned} <Text className="text-[12px] text-neutral-400 font-medium font-inter">(58%)</Text>
                  </Text>
                </View>
                <View className="h-3 bg-neutral-100 rounded-full overflow-hidden w-full">
                  <View 
                    className="h-full bg-info-500 rounded-full" 
                    style={{ width: '58%', backgroundColor: '#1CB0F6' }} 
                  />
                </View>
                {activeStateInfo === 'learned' && (
                  <Text className="text-[11px] text-info-600 font-medium font-inter mt-1.5 bg-info-50 p-2 rounded-lg">
                    Từ đã hoàn thành bài học mở đầu và vượt qua câu hỏi nhận biết cơ bản.
                  </Text>
                )}
              </Pressable>

              {/* Group 3: Reviewing */}
              <Pressable 
                onPress={() => setActiveStateInfo(activeStateInfo === 'reviewing' ? null : 'reviewing')}
                className="active:opacity-80"
              >
                <View className="flex-row items-center justify-between mb-1.5">
                  <View className="flex-row items-center gap-1.5">
                    <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#FFC42E' }} />
                    <Text className="font-bold text-[14px] text-warning-600 font-inter">Đang ôn (Reviewing)</Text>
                  </View>
                  <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito">
                    {MOCK_STATS.reviewing} <Text className="text-[12px] text-neutral-400 font-medium font-inter">(26%)</Text>
                  </Text>
                </View>
                <View className="h-3 bg-neutral-100 rounded-full overflow-hidden w-full">
                  <View 
                    className="h-full bg-warning-500 rounded-full" 
                    style={{ width: '26%', backgroundColor: '#FFC42E' }} 
                  />
                </View>
                {activeStateInfo === 'reviewing' && (
                  <Text className="text-[11px] text-warning-700 font-medium font-inter mt-1.5 bg-warning-50 p-2 rounded-lg">
                    Từ đang trong chu kỳ lặp lại ngắt quãng SRS (cần ôn lại định kỳ 1, 3, 7 ngày).
                  </Text>
                )}
              </Pressable>

              {/* Group 4: Mastered */}
              <Pressable 
                onPress={() => setActiveStateInfo(activeStateInfo === 'mastered' ? null : 'mastered')}
                className="active:opacity-80"
              >
                <View className="flex-row items-center justify-between mb-1.5">
                  <View className="flex-row items-center gap-1.5">
                    <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#58CC02' }} />
                    <Text className="font-bold text-[14px] text-success-600 font-inter">Đã thuộc (Mastered)</Text>
                  </View>
                  <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito">
                    {MOCK_STATS.mastered} <Text className="text-[12px] text-neutral-400 font-medium font-inter">(6%)</Text>
                  </Text>
                </View>
                <View className="h-3 bg-neutral-100 rounded-full overflow-hidden w-full">
                  <View 
                    className="h-full bg-success-500 rounded-full" 
                    style={{ width: '6%', backgroundColor: '#58CC02' }} 
                  />
                </View>
                {activeStateInfo === 'mastered' && (
                  <Text className="text-[11px] text-success-700 font-medium font-inter mt-1.5 bg-success-50 p-2 rounded-lg">
                    Đã vượt qua ít nhất 5 chu kỳ SRS không sai. Từ vựng đã trở thành phản xạ vĩnh viễn!
                  </Text>
                )}
              </Pressable>
            </View>

            <Text className="text-[11px] font-semibold text-neutral-400 font-inter text-center mt-3">
              Chạm từng nhóm để xem giải thích chi tiết
            </Text>
          </View>

          {/* 6. ACCURACY */}
          <View 
            className="bg-white rounded-3xl p-5 border border-neutral-200/60 mb-6"
            style={SOFT_CARD_SHADOW}
          >
            <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-1">Độ chính xác</Text>
            <Text className="font-medium text-[13px] text-neutral-500 font-inter mb-5">Tỉ lệ trả lời đúng của bạn</Text>
            
            <View className="flex-row items-end gap-4 mb-5">
              <Text className="font-extrabold text-[42px] text-mascot-navy font-nunito leading-tight">
                {MOCK_STATS.accuracy.overall}%
              </Text>
              <View className="bg-success-50 px-3 py-1 rounded-lg border border-success-100 mb-2">
                <Text className="font-bold text-[12px] text-success-700 font-inter">Xuất sắc!</Text>
              </View>
            </View>

            <View className="gap-3.5">
              <View className="flex-row items-center gap-3">
                <Text className="w-14 font-bold text-[13px] text-neutral-500 font-inter">Quiz</Text>
                <View className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                  <View 
                    className="h-full bg-info-500 rounded-full" 
                    style={{ width: `${MOCK_STATS.accuracy.quiz}%`, backgroundColor: '#1CB0F6' }} 
                  />
                </View>
                <Text className="w-10 font-bold text-[13px] text-mascot-navy font-inter text-right">{MOCK_STATS.accuracy.quiz}%</Text>
              </View>

              <View className="flex-row items-center gap-3">
                <Text className="w-14 font-bold text-[13px] text-neutral-500 font-inter">Review</Text>
                <View className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                  <View 
                    className="h-full bg-success-500 rounded-full" 
                    style={{ width: `${MOCK_STATS.accuracy.review}%`, backgroundColor: '#58CC02' }} 
                  />
                </View>
                <Text className="w-10 font-bold text-[13px] text-mascot-navy font-inter text-right">{MOCK_STATS.accuracy.review}%</Text>
              </View>
            </View>
          </View>

          {/* 7. INTERACTIVE ACTIVITY TABS (DAILY, WEEKLY, MONTHLY) */}
          <View 
            className="bg-white rounded-3xl p-5 border border-neutral-200/60 mb-6"
            style={SOFT_CARD_SHADOW}
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">Hoạt động học tập</Text>
              
              {/* 3-Tab Segmented Control */}
              <View className="bg-neutral-100 p-1 rounded-xl flex-row items-center gap-1">
                {(['daily', 'weekly', 'monthly'] as const).map((tab) => {
                  const labels = { daily: 'Ngày', weekly: 'Tuần', monthly: 'Tháng' };
                  const isTabActive = activeTab === tab;
                  return (
                    <TouchableOpacity
                      key={tab}
                      activeOpacity={0.7}
                      onPress={() => setActiveTab(tab)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg",
                        !isTabActive && "bg-transparent"
                      )}
                      style={isTabActive ? (Platform.OS === 'web' ? {
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                      } : {
                        backgroundColor: '#FFFFFF',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.08,
                        shadowRadius: 2,
                        elevation: 1
                      }) : undefined}
                    >
                      <Text className={cn(
                        "text-[12px] font-bold font-nunito",
                        isTabActive ? "text-mascot-navy font-extrabold" : "text-neutral-500"
                      )}>
                        {labels[tab]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Dynamic Activity Body */}
            {renderActivityContent()}
          </View>

          {/* 8. QUICK STATS 4-GRID */}
          <View className="mb-8">
            <View className="flex-row gap-3">
              <View 
                className="flex-1 bg-white rounded-2xl p-4 border border-neutral-200/60 items-center"
                style={SOFT_CARD_SM_SHADOW}
              >
                <View className="w-10 h-10 rounded-xl bg-warning-50 items-center justify-center mb-1.5">
                  <BookOpenIcon size={20} className="text-warning-600" />
                </View>
                <Text className="font-extrabold text-[24px] text-mascot-navy font-nunito">{MOCK_STATS.reviewsCount}</Text>
                <Text className="font-bold text-[12px] text-neutral-400 font-inter">Lần ôn tập</Text>
              </View>

              <View 
                className="flex-1 bg-white rounded-2xl p-4 border border-neutral-200/60 items-center"
                style={SOFT_CARD_SM_SHADOW}
              >
                <View className="w-10 h-10 rounded-xl bg-primary-50 items-center justify-center mb-1.5">
                  <Gamepad2Icon size={20} className="text-primary-600" />
                </View>
                <Text className="font-extrabold text-[24px] text-mascot-navy font-nunito">{MOCK_STATS.quizAttempts}</Text>
                <Text className="font-bold text-[12px] text-neutral-400 font-inter">Lần làm Quiz</Text>
              </View>
            </View>

            <View className="flex-row gap-3 mt-3">
              <View 
                className="flex-1 bg-white rounded-2xl p-4 border border-neutral-200/60 items-center"
                style={SOFT_CARD_SM_SHADOW}
              >
                <View className="w-10 h-10 rounded-xl bg-info-50 items-center justify-center mb-1.5">
                  <ClockIcon size={20} className="text-info-600" />
                </View>
                <Text className="font-extrabold text-[24px] text-mascot-navy font-nunito">14.5h</Text>
                <Text className="font-bold text-[12px] text-neutral-400 font-inter">Thời gian học</Text>
              </View>

              <View 
                className="flex-1 bg-white rounded-2xl p-4 border border-neutral-200/60 items-center"
                style={SOFT_CARD_SM_SHADOW}
              >
                <View className="w-10 h-10 rounded-xl bg-success-50 items-center justify-center mb-1.5">
                  <CheckCircle2Icon size={20} className="text-success-600" />
                </View>
                <Text className="font-extrabold text-[24px] text-mascot-navy font-nunito">{MOCK_STATS.mastered}</Text>
                <Text className="font-bold text-[12px] text-neutral-400 font-inter">Từ đã thuộc</Text>
              </View>
            </View>
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
