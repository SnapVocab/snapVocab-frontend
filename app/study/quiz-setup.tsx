import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  LayoutGridIcon,
  LayersIcon,
  Edit2Icon,
  ArrowRightIcon,
  CheckCircle2Icon,
  AlertCircleIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// ==========================================
// TYPES & MOCK DATA
// ==========================================
type QuizMode = 'MULTIPLE_CHOICE' | 'MATCHING' | 'FILL_BLANK';

const MOCK_DECK = {
  id: 'd1',
  name: 'English Basics',
  emoji: '📚',
  wordCount: 42,
};

const QUIZ_MODES = [
  {
    id: 'MULTIPLE_CHOICE' as QuizMode,
    label: 'Trắc nghiệm',
    desc: 'Chọn đáp án đúng',
    icon: LayoutGridIcon,
  },
  {
    id: 'MATCHING' as QuizMode,
    label: 'Ghép đôi',
    desc: 'Ghép từ với nghĩa đúng',
    icon: LayersIcon,
  },
  {
    id: 'FILL_BLANK' as QuizMode,
    label: 'Điền từ',
    desc: 'Điền từ còn thiếu',
    icon: Edit2Icon,
  }
];

const PRESET_COUNTS = [5, 10, 15, 20];

export default function QuizSetupScreen() {
  const [deck] = useState(MOCK_DECK);
  const [quizMode, setQuizMode] = useState<QuizMode>('MULTIPLE_CHOICE');
  const [questionCount, setQuestionCount] = useState<number>(10);

  // Validate if deck has enough words
  const isSufficient = deck.wordCount >= 5;

  // Dynamically filter presets based on available words
  const availablePresets = PRESET_COUNTS.filter(count => count <= deck.wordCount);
  // Add the maximum available words if it's not perfectly on a preset, and is greater than 5
  if (deck.wordCount > 5 && !availablePresets.includes(deck.wordCount) && deck.wordCount < 20) {
    availablePresets.push(deck.wordCount);
  }

  const handleStartQuiz = () => {
    router.push(`/study/quiz-session?deckId=${deck.id}&mode=${quizMode}&count=${questionCount}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* 1. HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-neutral-100 z-10">
        <Pressable 
          onPress={() => router.back()} 
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
          <Snapy pose="curious" className="w-40 h-40 mb-6" />
          <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito text-center mb-2">Chưa đủ từ để tạo Quiz</Text>
          <Text className="font-medium text-[15px] text-neutral-500 font-inter text-center mb-8 px-4">
            Deck này chỉ có {deck.wordCount} từ. Bạn cần ít nhất 5 từ để bắt đầu một bài quiz.
          </Text>
          <Pressable 
            onPress={() => router.back()}
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
            contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          >
            
            {/* SECTION: CHỌN DECK */}
            <View className="mb-8">
              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-1">Chọn Deck</Text>
              <Text className="font-bold text-[13px] text-neutral-400 font-inter mb-3">Chọn bộ từ bạn muốn luyện tập</Text>
              
              <Pressable className="flex-row items-center justify-between bg-white rounded-2xl p-4 border-2 border-neutral-100 border-b-[4px] active:bg-neutral-50 active:translate-y-[2px] active:border-b-[2px] transition-all">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 bg-neutral-50 rounded-xl items-center justify-center">
                    <Text className="text-[24px]">{deck.emoji}</Text>
                  </View>
                  <View>
                    <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-0.5">{deck.name}</Text>
                    <Text className="font-bold text-[13px] text-primary-600 font-inter">{deck.wordCount} từ khả dụng</Text>
                  </View>
                </View>
                <ChevronRightIcon size={20} className="text-neutral-400" />
              </Pressable>
            </View>

            {/* SECTION: CHỌN KIỂU QUIZ */}
            <View className="mb-8">
              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-4">Chọn kiểu Quiz</Text>
              
              <View className="gap-3">
                {QUIZ_MODES.map((mode) => {
                  const isSelected = quizMode === mode.id;
                  const Icon = mode.icon;
                  return (
                    <Pressable 
                      key={mode.id}
                      onPress={() => setQuizMode(mode.id)}
                      className={cn(
                        "flex-row items-center justify-between rounded-2xl p-4 border-2 border-b-[4px] active:translate-y-[2px] active:border-b-[2px] transition-all",
                        isSelected 
                          ? "bg-primary-50 border-primary-500" 
                          : "bg-white border-neutral-100 active:bg-neutral-50"
                      )}
                    >
                      <View className="flex-row items-center gap-4">
                        <View className={cn(
                          "w-12 h-12 rounded-xl items-center justify-center",
                          isSelected ? "bg-primary-100" : "bg-neutral-50"
                        )}>
                          <Icon size={24} className={isSelected ? "text-primary-600" : "text-neutral-400"} />
                        </View>
                        <View>
                          <Text className={cn(
                            "font-extrabold text-[16px] font-nunito mb-0.5",
                            isSelected ? "text-primary-700" : "text-mascot-navy"
                          )}>
                            {mode.label}
                          </Text>
                          <Text className={cn(
                            "font-medium text-[13px] font-inter",
                            isSelected ? "text-primary-600" : "text-neutral-400"
                          )}>
                            {mode.desc}
                          </Text>
                        </View>
                      </View>
                      
                      <View className={cn(
                        "w-6 h-6 rounded-full border-2 items-center justify-center",
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
              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-4">Số câu hỏi</Text>
              
              <View className="bg-white rounded-3xl p-6 border-2 border-neutral-100 shadow-sm shadow-black/5 items-center">
                <Text className="font-extrabold text-[36px] text-mascot-navy font-nunito text-center mb-6">
                  {questionCount} <Text className="text-[18px] text-neutral-400">câu</Text>
                </Text>

                <View className="w-full flex-row items-center justify-between relative">
                  {/* The Track */}
                  <View className="absolute top-1/2 left-4 right-4 h-2 bg-neutral-100 rounded-full -translate-y-1/2" />
                  
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
                          "w-6 h-6 rounded-full items-center justify-center border-4 border-white shadow-sm",
                          isSelected ? "bg-primary-500 scale-125 shadow-primary-500/30" : "bg-neutral-300"
                        )} />
                        <Text className={cn(
                          "font-bold text-[14px] font-inter mt-3",
                          isSelected ? "text-primary-600" : "text-neutral-400"
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
                  Từ khả dụng: {deck.wordCount} từ
                </Text>
              </View>
            </View>

          </ScrollView>

          {/* STICKY BOTTOM CTA */}
          <View className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-neutral-100">
            <Pressable 
              onPress={handleStartQuiz}
              className="w-full h-14 bg-info-500 rounded-2xl border-b-[4px] border-info-700 active:bg-info-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center flex-row gap-2"
            >
              <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wide">Bắt đầu Quiz</Text>
              <ArrowRightIcon size={20} className="text-white" />
            </Pressable>
          </View>
        </>
      )}

    </SafeAreaView>
  );
}
