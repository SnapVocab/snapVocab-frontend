import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  LayoutGridIcon,
  LayersIcon,
  Edit2Icon,
  ArrowRightIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  SparklesIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// ==========================================
// TYPES & MOCK DATA
// ==========================================
type QuizMode = 'MULTIPLE_CHOICE' | 'MATCHING' | 'FILL_BLANK';

const AVAILABLE_DECKS = [
  { id: 'd1', name: 'English Basics', emoji: '📚', wordCount: 42 },
  { id: 'd2', name: 'Du lịch & Sân bay', emoji: '✈️', wordCount: 28 },
  { id: 'd3', name: 'TOEIC Cốt lõi', emoji: '🎯', wordCount: 50 },
];

const QUIZ_MODES = [
  {
    id: 'MULTIPLE_CHOICE' as QuizMode,
    label: 'Trắc nghiệm phản xạ',
    desc: 'Chọn nhanh nghĩa đúng của từ vựng',
    badge: 'Khuyên dùng',
    icon: LayoutGridIcon,
    available: true,
  },
  {
    id: 'MATCHING' as QuizMode,
    label: 'Ghép đôi từ vựng',
    desc: 'Nối từ tiếng Anh với nghĩa tiếng Việt',
    badge: 'Phổ biến',
    icon: LayersIcon,
    available: true,
  },
  {
    id: 'FILL_BLANK' as QuizMode,
    label: 'Điền từ vào chỗ trống',
    desc: 'Gõ từ còn thiếu trong ngữ cảnh câu',
    badge: 'Thử thách',
    icon: Edit2Icon,
    available: true,
  }
];

const PRESET_COUNTS = [5, 10, 15, 20];

export default function QuizSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ deckId?: string; deckName?: string }>();

  // Safe navigation back to avoid empty history crash
  const navigateBackSafely = () => {
    try {
      if (router && typeof router.canGoBack === 'function' && router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)/learn');
      }
    } catch {
      router.replace('/(tabs)/learn');
    }
  };

  // Find selected deck or fallback
  const matchedDeck = AVAILABLE_DECKS.find(d => d.id === params.deckId) || AVAILABLE_DECKS[0];
  const [deck, setDeck] = useState(matchedDeck);
  const [quizMode, setQuizMode] = useState<QuizMode>('MULTIPLE_CHOICE');
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Validate if deck has enough words
  const isSufficient = deck.wordCount >= 5;

  // Dynamically filter presets based on available words
  const availablePresets = PRESET_COUNTS.filter(count => count <= deck.wordCount);
  if (deck.wordCount > 5 && !availablePresets.includes(deck.wordCount) && deck.wordCount < 20) {
    availablePresets.push(deck.wordCount);
  }

  const handleStartQuiz = () => {
    router.push(`/study/quiz-session?deckId=${deck.id}&mode=${quizMode}&count=${questionCount}`);
  };

  // Calculate active fill percentage for question slider
  const selectedIdx = Math.max(0, availablePresets.indexOf(questionCount));
  const activePercent = availablePresets.length > 1 ? (selectedIdx / (availablePresets.length - 1)) * 100 : 0;

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* 1. HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-neutral-100 z-10">
        <Pressable 
          onPress={navigateBackSafely} 
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100 -ml-2"
        >
          <ChevronLeftIcon size={28} className="text-mascot-navy" />
        </Pressable>
        <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito flex-1 text-center pr-8">Tạo Quiz</Text>
      </View>

      {!isSufficient ? (
        // ==========================================
        // EMPTY STATE: INSUFFICIENT WORDS
        // ==========================================
        <View className="flex-1 items-center justify-center p-6">
          <Snapy pose="suy_nghi" animation="idle" style={{ width: 140, height: 140 }} className="mb-6" />
          <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito text-center mb-2">Chưa đủ từ để tạo Quiz</Text>
          <Text className="font-medium text-[15px] text-neutral-500 font-inter text-center mb-8 px-4">
            Deck này chỉ có {deck.wordCount} từ. Bạn cần ít nhất 5 từ để bắt đầu một bài quiz phản xạ.
          </Text>
          <Pressable 
            onPress={navigateBackSafely}
            className="w-full h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center flex-row gap-2"
          >
            <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wide">Quay lại & Lưu thêm từ</Text>
          </Pressable>
        </View>
      ) : (
        // ==========================================
        // NORMAL STATE: CONFIGURATION
        // ==========================================
        <>
          <ScrollView 
            contentContainerStyle={{ padding: 20, paddingBottom: 130 }}
            showsVerticalScrollIndicator={false}
          >
            
            {/* SECTION: CHỌN DECK */}
            <View className="mb-8">
              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-1">Bộ từ vựng</Text>
              <Text className="font-bold text-[13px] text-neutral-400 font-inter mb-3">Luyện tập theo chủ đề bạn đang học</Text>
              
              <View className="flex-row items-center justify-between bg-white rounded-2xl p-4 border-2 border-neutral-100 border-b-[4px] shadow-sm shadow-black/5">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 bg-primary-50 rounded-xl items-center justify-center border border-primary-100">
                    <Text className="text-[24px]">{deck.emoji}</Text>
                  </View>
                  <View>
                    <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-0.5">{deck.name}</Text>
                    <Text className="font-bold text-[13px] text-primary-600 font-inter">{deck.wordCount} từ khả dụng</Text>
                  </View>
                </View>
                <View className="px-2.5 py-1 bg-neutral-100 rounded-lg">
                  <Text className="font-bold text-[11px] text-neutral-500 font-inter uppercase">Mặc định</Text>
                </View>
              </View>
            </View>

            {/* SECTION: CHỌN KIỂU QUIZ */}
            <View className="mb-8">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">Chọn chế độ Quiz</Text>
                <View className="flex-row items-center gap-1 bg-warning-50 px-2 py-0.5 rounded-md border border-warning-200">
                  <SparklesIcon size={12} className="text-warning-600" />
                  <Text className="font-bold text-[11px] text-warning-700 font-inter">+XP & Coin</Text>
                </View>
              </View>
              
              <View className="gap-3">
                {QUIZ_MODES.map((mode) => {
                  const isSelected = quizMode === mode.id;
                  const Icon = mode.icon;
                  return (
                    <Pressable 
                      key={mode.id}
                      onPress={() => {
                        if (mode.available) {
                          setQuizMode(mode.id);
                        }
                      }}
                      className={cn(
                        "flex-row items-center justify-between rounded-2xl p-4 border-2 border-b-[4px] transition-all",
                        isSelected 
                          ? "bg-primary-50/80 border-primary-500 active:translate-y-[1px] active:border-b-[3px]" 
                          : mode.available
                            ? "bg-white border-neutral-100 active:bg-neutral-50 active:translate-y-[2px] active:border-b-[2px]"
                            : "bg-neutral-50/70 border-neutral-100 opacity-75"
                      )}
                    >
                      <View className="flex-row items-center gap-3.5 flex-1 pr-2">
                        <View className={cn(
                          "w-12 h-12 rounded-xl items-center justify-center border",
                          isSelected ? "bg-primary-500 border-primary-600" : "bg-neutral-100 border-neutral-200"
                        )}>
                          <Icon size={22} className={isSelected ? "text-white" : "text-neutral-500"} />
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center gap-2 mb-0.5">
                            <Text className={cn(
                              "font-extrabold text-[15px] font-nunito",
                              isSelected ? "text-primary-800" : "text-mascot-navy"
                            )}>
                              {mode.label}
                            </Text>
                            <View className={cn(
                              "px-1.5 py-0.5 rounded text-[10px]",
                              mode.available 
                                ? "bg-primary-100 border border-primary-200" 
                                : "bg-neutral-200 border border-neutral-300"
                            )}>
                              <Text className={cn(
                                "font-bold text-[10px] font-inter",
                                mode.available ? "text-primary-700" : "text-neutral-500"
                              )}>
                                {mode.badge}
                              </Text>
                            </View>
                          </View>
                          <Text className={cn(
                            "font-medium text-[12px] font-inter",
                            isSelected ? "text-primary-700" : "text-neutral-400"
                          )}>
                            {mode.desc}
                          </Text>
                        </View>
                      </View>
                      
                      <View className={cn(
                        "w-6 h-6 rounded-full border-2 items-center justify-center shrink-0",
                        isSelected ? "bg-primary-500 border-primary-500" : "border-neutral-200"
                      )}>
                        {isSelected && <CheckCircle2Icon size={14} className="text-white" />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* SECTION: SỐ CÂU HỎI */}
            <View className="mb-4">
              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-4">Số lượng câu hỏi</Text>
              
              <View className="bg-white rounded-3xl p-6 border-2 border-neutral-100 shadow-sm shadow-black/5 items-center">
                <Text className="font-extrabold text-[38px] text-mascot-navy font-nunito text-center mb-6">
                  {questionCount} <Text className="text-[18px] text-neutral-400 font-inter">câu</Text>
                </Text>

                <View className="w-full flex-row items-center justify-between relative px-2">
                  {/* Background Track */}
                  <View className="absolute top-1/2 left-6 right-6 h-2 bg-neutral-100 rounded-full -translate-y-1/2" />
                  
                  {/* Active Filled Track */}
                  <View 
                    className="absolute top-1/2 left-6 h-2 bg-primary-500 rounded-full -translate-y-1/2 transition-all duration-200"
                    style={{ width: `${(activePercent * 0.85)}%` }}
                  />
                  
                  {/* The Steps */}
                  {availablePresets.map((preset) => {
                    const isSelected = questionCount === preset;
                    return (
                      <Pressable
                        key={preset}
                        onPress={() => setQuestionCount(preset)}
                        className="items-center z-10 w-12"
                      >
                        <View className={cn(
                          "w-7 h-7 rounded-full items-center justify-center border-4 border-white shadow-sm transition-all",
                          isSelected ? "bg-primary-500 scale-125 shadow-primary-500/40" : "bg-neutral-300"
                        )} />
                        <Text className={cn(
                          "font-bold text-[14px] font-inter mt-3",
                          isSelected ? "text-primary-600 font-extrabold" : "text-neutral-400"
                        )}>
                          {preset}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="flex-row items-center gap-2 mt-4 px-2 justify-center">
                <AlertCircleIcon size={16} className="text-neutral-400" />
                <Text className="font-medium text-[13px] text-neutral-500 font-inter text-center">
                  Kho từ khả dụng: {deck.wordCount} từ trong deck
                </Text>
              </View>
            </View>

          </ScrollView>

          {/* STICKY BOTTOM CTA - Primary Green Duolingo Standard */}
          <View className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-neutral-100 shadow-lg shadow-black/5">
            <Pressable 
              onPress={handleStartQuiz}
              className="w-full h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center flex-row gap-2"
            >
              <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wider">Bắt đầu Quiz</Text>
              <ArrowRightIcon size={20} className="text-white" />
            </Pressable>
          </View>
        </>
      )}

    </SafeAreaView>
  );
}

