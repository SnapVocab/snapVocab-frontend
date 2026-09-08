import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  FlameIcon,
  TrendingUpIcon,
  TargetIcon,
  ChevronRightIcon,
  CalendarIcon,
  CheckCircle2Icon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_STATS = {
  isNewUser: false, // Set to true to see the Empty State
  totalSaved: 1248,
  savedThisWeek: 32,
  learned: 842,
  reviewing: 326,
  mastered: 80,
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
  quizAttempts: 7
};

export default function StatsScreen() {
  const [activeTab] = useState<'daily'|'weekly'|'monthly'>('monthly');

  // ==========================================
  // VIEW: EMPTY STATE (NEW USER)
  // ==========================================
  if (MOCK_STATS.isNewUser) {
    return (
      <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
        <View className="px-5 py-3 border-b border-neutral-100 bg-white items-center">
          <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">Tiến độ</Text>
        </View>
        
        <View className="flex-1 items-center justify-center p-6 pb-20">
          <Snapy pose="kham_pha" animation="bounce" className="w-48 h-48 mb-6" />
          <Text className="font-extrabold text-[24px] text-mascot-navy font-nunito text-center mb-2">
            Hành trình bắt đầu!
          </Text>
          <Text className="font-medium text-[15px] text-neutral-500 font-inter text-center mb-8 px-4">
            Chưa có dữ liệu học tập. Hãy lưu từ vựng và bắt đầu học để xem thống kê của bạn tại đây nhé!
          </Text>
          <Pressable 
            onPress={() => router.push('/(tabs)')}
            className="w-full h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px]  items-center justify-center"
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
  // HELPERS
  // ==========================================
  const getPercent = (value: number) => {
    return Math.max(2, Math.round((value / MOCK_STATS.totalSaved) * 100)); // min 2% so bar is visible
  };

  const renderHeatmap = () => {
    // Generate a mock 4x10 grid of heatmap cells
    const rows = 4;
    const cols = 10;
    const cells = [];
    
    for (let r = 0; r < rows; r++) {
      const rowCells = [];
      for (let c = 0; c < cols; c++) {
        // Random intensity 0-4
        const intensity = Math.floor(Math.random() * 5);
        let bgClass = "bg-neutral-100";
        if (intensity === 1) bgClass = "bg-primary-100";
        if (intensity === 2) bgClass = "bg-primary-300";
        if (intensity === 3) bgClass = "bg-primary-500";
        if (intensity === 4) bgClass = "bg-primary-700";

        rowCells.push(
          <View key={`${r}-${c}`} className={cn("w-[22px] h-[22px] rounded-md m-0.5", bgClass)} />
        );
      }
      cells.push(<View key={`row-${r}`} className="flex-row">{rowCells}</View>);
    }

    return (
      <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm shadow-black/5 mt-6 mb-8">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">Hoạt động học tập</Text>
          <View className="bg-neutral-100 px-3 py-1.5 rounded-lg flex-row items-center gap-1">
            <CalendarIcon size={14} className="text-neutral-500" />
            <Text className="font-bold text-[12px] text-neutral-600 font-inter">Tháng này</Text>
          </View>
        </View>
        
        <View className="items-center justify-center py-2">
          {cells}
        </View>

        <View className="flex-row items-center justify-end gap-2 mt-4 opacity-70">
          <Text className="text-[10px] text-neutral-400 font-bold uppercase">Ít</Text>
          <View className="w-3 h-3 rounded-sm bg-neutral-100" />
          <View className="w-3 h-3 rounded-sm bg-primary-100" />
          <View className="w-3 h-3 rounded-sm bg-primary-300" />
          <View className="w-3 h-3 rounded-sm bg-primary-500" />
          <View className="w-3 h-3 rounded-sm bg-primary-700" />
          <Text className="text-[10px] text-neutral-400 font-bold uppercase">Nhiều</Text>
        </View>
      </View>
    );
  };

  // ==========================================
  // VIEW: STATS DASHBOARD
  // ==========================================
  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* HEADER */}
      <View className="px-5 py-3 border-b border-neutral-100 bg-white items-center z-10">
        <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">Tiến độ</Text>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
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
          
          <Pressable 
            onPress={() => router.push('/stats/level-progress')}
            className="w-full h-12 bg-primary-50 rounded-xl border border-primary-100 active:bg-primary-100 flex-row items-center justify-between px-4 "
          >
            <View className="flex-row items-center gap-2">
              <View className="w-8 h-8 bg-primary-100 rounded-full items-center justify-center">
                <Text className="font-extrabold text-[12px] text-primary-600 font-nunito">L.12</Text>
              </View>
              <Text className="font-bold text-[15px] text-primary-800 font-inter">Tiến độ Level</Text>
            </View>
            <ChevronRightIcon size={20} className="text-primary-500" />
          </Pressable>
        </View>

        {/* 2. STREAK */}
        <View className="bg-white rounded-2xl border border-neutral-200/80 p-5 flex-row items-center justify-between mb-5">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <FlameIcon size={22} className="text-mascot-500" fill="#FF8A00" />
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

        {/* 3. DAILY GOAL */}
        {MOCK_STATS.goal.current < MOCK_STATS.goal.target && (
          <View className="bg-white rounded-2xl p-5 border border-neutral-200/80 mb-5 flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <View className="flex-row items-center gap-2 mb-1">
                <TargetIcon size={18} className="text-primary-600" />
                <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">Mục tiêu hôm nay</Text>
              </View>
              <Text className="font-medium text-[13px] text-neutral-500 font-inter mb-3">
                Còn {MOCK_STATS.goal.target - MOCK_STATS.goal.current} {MOCK_STATS.goal.unit} nữa để hoàn thành!
              </Text>
              
              <View className="h-2 bg-neutral-100 rounded-full overflow-hidden w-full">
                <View 
                  className="h-full bg-primary-500 rounded-full" 
                  style={{ width: `${(MOCK_STATS.goal.current / MOCK_STATS.goal.target) * 100}%` }}
                />
              </View>
            </View>

            <Pressable 
              onPress={() => router.push('/(tabs)/learn')}
              className="bg-primary-500 w-11 h-11 rounded-xl items-center justify-center active:scale-[0.98] active:bg-primary-600 transition-all"
            >
              <ChevronRightIcon size={22} className="text-white" />
            </Pressable>
          </View>
        )}

        {/* 4. LEARNING STATE MAP */}
        <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm shadow-black/5 mb-6">
          <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-6">Tiến độ từ vựng</Text>
          
          <View className="gap-5">
            {/* Learned */}
            <View>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-bold text-[14px] text-info-600 font-inter">Đã học (Learned)</Text>
                <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">{MOCK_STATS.learned}</Text>
              </View>
              <View className="h-3.5 bg-neutral-100 rounded-full overflow-hidden w-full">
                <View className="h-full bg-info-400 rounded-full" style={{ width: `${getPercent(MOCK_STATS.learned)}%` }} />
              </View>
            </View>

            {/* Reviewing */}
            <View>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-bold text-[14px] text-warning-600 font-inter">Đang ôn (Reviewing)</Text>
                <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">{MOCK_STATS.reviewing}</Text>
              </View>
              <View className="h-3.5 bg-neutral-100 rounded-full overflow-hidden w-full">
                <View className="h-full bg-warning-400 rounded-full" style={{ width: `${getPercent(MOCK_STATS.reviewing)}%` }} />
              </View>
            </View>

            {/* Mastered */}
            <View>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-bold text-[14px] text-success-600 font-inter">Đã thuộc (Mastered)</Text>
                <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">{MOCK_STATS.mastered}</Text>
              </View>
              <View className="h-3.5 bg-neutral-100 rounded-full overflow-hidden w-full">
                <View className="h-full bg-success-500 rounded-full" style={{ width: `${getPercent(MOCK_STATS.mastered)}%` }} />
              </View>
            </View>
          </View>
        </View>

        {/* 5. ACCURACY */}
        <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm shadow-black/5 mb-6">
          <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-1">Độ chính xác</Text>
          <Text className="font-medium text-[13px] text-neutral-500 font-inter mb-6">Tỉ lệ trả lời đúng của bạn</Text>
          
          <View className="flex-row items-end gap-6 mb-6">
            <Text className="font-extrabold text-[42px] text-mascot-navy font-nunito leading-tight">
              {MOCK_STATS.accuracy.overall}%
            </Text>
            <View className="bg-success-50 px-3 py-1 rounded-lg border border-success-100 mb-2">
              <Text className="font-bold text-[12px] text-success-700 font-inter">Khá Tốt!</Text>
            </View>
          </View>

          <View className="gap-4">
            <View className="flex-row items-center gap-3">
              <Text className="w-12 font-bold text-[13px] text-neutral-500 font-inter">Quiz</Text>
              <View className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                <View className="h-full bg-primary-400 rounded-full" style={{ width: `${MOCK_STATS.accuracy.quiz}%` }} />
              </View>
              <Text className="w-10 font-bold text-[13px] text-mascot-navy font-inter text-right">{MOCK_STATS.accuracy.quiz}%</Text>
            </View>

            <View className="flex-row items-center gap-3">
              <Text className="w-12 font-bold text-[13px] text-neutral-500 font-inter">Review</Text>
              <View className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                <View className="h-full bg-success-400 rounded-full" style={{ width: `${MOCK_STATS.accuracy.review}%` }} />
              </View>
              <Text className="w-10 font-bold text-[13px] text-mascot-navy font-inter text-right">{MOCK_STATS.accuracy.review}%</Text>
            </View>
          </View>
        </View>

        {/* 6. ACTIVITY HEATMAP */}
        {renderHeatmap()}

        {/* 7. QUICK STATS */}
        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm shadow-black/5 items-center">
            <Text className="font-extrabold text-[28px] text-mascot-navy font-nunito mb-1">{MOCK_STATS.reviewsCount}</Text>
            <Text className="font-bold text-[13px] text-neutral-500 font-inter">Lần ôn tập</Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm shadow-black/5 items-center">
            <Text className="font-extrabold text-[28px] text-mascot-navy font-nunito mb-1">{MOCK_STATS.quizAttempts}</Text>
            <Text className="font-bold text-[13px] text-neutral-500 font-inter">Lần làm Quiz</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

