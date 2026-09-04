import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated as RNAnimated, Dimensions, Easing, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  XIcon, 
  Volume2Icon,
  WifiOffIcon,
  TrophyIcon,
  HomeIcon,
  RotateCcwIcon,
  BookOpenIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

const { width, height } = Dimensions.get('window');

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_DECK = {
  name: 'English Basics',
  overdue: 3,
  due: 17
};

const MOCK_CARDS = [
  {
    id: 'c1',
    word: 'abandon',
    ipa: '/əˈbændən/',
    meaning: 'từ bỏ',
    example: 'She decided to abandon the project.',
    intervals: { again: '10m', hard: '2d', good: '5d', easy: '14d' }
  },
  {
    id: 'c2',
    word: 'achieve',
    ipa: '/əˈtʃiːv/',
    meaning: 'đạt được',
    example: 'They hope to achieve their goals.',
    intervals: { again: '10m', hard: '3d', good: '7d', easy: '21d' }
  },
  {
    id: 'c3',
    word: 'improve',
    ipa: '/ɪmˈpruːv/',
    meaning: 'cải thiện',
    example: 'He wants to improve his English.',
    intervals: { again: '10m', hard: '1d', good: '4d', easy: '10d' }
  }
];

export default function SRSReviewScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isOffline] = useState(false); // Mock offline state
  
  // Animations
  const flipAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(0)).current;
  const confettiAnim = useRef(new RNAnimated.Value(0)).current;

  // Derived state
  const currentCard = MOCK_CARDS[currentIndex];
  const progressPercent = ((currentIndex) / MOCK_CARDS.length) * 100;
  
  const handleClose = () => {
    Alert.alert(
      "Thoát ôn tập?",
      "Tiến độ đã ôn sẽ được lưu.",
      [
        { text: "Tiếp tục", style: "cancel" },
        { text: "Thoát", style: "destructive", onPress: () => router.back() }
      ]
    );
  };

  const handleFlip = () => {
    if (isFlipped) return;
    setIsFlipped(true);
    RNAnimated.spring(flipAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleRate = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    // 1. Process rating (mock)
    console.log(`Rated card ${currentCard.id} as ${rating}`);

    // 2. Transition
    RNAnimated.timing(slideAnim, {
      toValue: -width,
      duration: 250,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      if (currentIndex + 1 >= MOCK_CARDS.length) {
        // Finished
        setIsFinished(true);
        triggerConfetti();
      } else {
        // Next card
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
        flipAnim.setValue(0);
        
        slideAnim.setValue(width);
        RNAnimated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();
      }
    });
  };

  const triggerConfetti = () => {
    RNAnimated.timing(confettiAnim, {
      toValue: 1,
      duration: 2500,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  };

  // Interpolations for Flashcard
  const frontRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.51, 1],
    outputRange: [1, 1, 0, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.51, 1],
    outputRange: [0, 0, 1, 1],
  });

  const renderConfetti = () => {
    if (!isFinished) return null;
    const pieces = Array.from({ length: 25 }).map((_, i) => {
      const left = Math.random() * width;
      const size = Math.random() * 8 + 6;
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
        <RNAnimated.View
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

  // ==========================================
  // VIEW: EMPTY STATE
  // ==========================================
  if (MOCK_CARDS.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
        <View className="flex-1 items-center justify-center p-6">
          <Snapy pose="happy" className="w-40 h-40 mb-6" />
          <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito text-center mb-2">Bạn đã ôn xong hôm nay! 🎉</Text>
          <Text className="font-medium text-[15px] text-neutral-500 font-inter text-center mb-8">Không có từ nào đến hạn. Hãy quay lại sau nhé!</Text>
          <Pressable 
            onPress={() => router.back()}
            className="w-full h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center"
          >
            <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wide">VỀ HOME</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // VIEW: REVIEW SUMMARY
  // ==========================================
  if (isFinished) {
    return (
      <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
        {renderConfetti()}
        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100, alignItems: 'center' }}>
          
          <View className="relative items-center mb-6 pt-4">
            <View className="absolute inset-0 bg-warning-200 blur-3xl opacity-50 rounded-full" />
            <Snapy pose="happy" className="w-32 h-32 mb-4 z-10" />
            <Text className="font-extrabold text-[28px] text-mascot-navy font-nunito text-center leading-tight">
              Bạn đã ôn xong! 🎉
            </Text>
          </View>

          <View className="bg-white rounded-[24px] border-2 border-neutral-100 border-b-[6px] shadow-sm shadow-black/5 p-6 items-center w-full mb-6">
            <View className="w-16 h-16 bg-warning-50 rounded-full items-center justify-center mb-3">
              <TrophyIcon size={32} className="text-warning-500" />
            </View>
            <Text className="font-extrabold text-[14px] text-neutral-400 font-inter uppercase tracking-widest mb-1">
              PHẦN THƯỞNG
            </Text>
            <Text className="font-extrabold text-[28px] text-warning-600 font-nunito">+80 XP</Text>
          </View>

          <View className="w-full bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm shadow-black/5 mb-8">
            <View className="flex-row">
              <View className="flex-1 items-center border-r border-b border-neutral-100 pb-4 pr-2">
                <Text className="font-extrabold text-[24px] text-mascot-navy font-nunito">{MOCK_CARDS.length}</Text>
                <Text className="font-bold text-[13px] text-neutral-500 font-inter">Cards đã ôn</Text>
              </View>
              <View className="flex-1 items-center border-b border-neutral-100 pb-4 pl-2">
                <Text className="font-extrabold text-[24px] text-success-600 font-nunito">85%</Text>
                <Text className="font-bold text-[13px] text-neutral-500 font-inter">Accuracy</Text>
              </View>
            </View>
            <View className="flex-row pt-4">
              <View className="flex-1 items-center border-r border-neutral-100 pr-2">
                <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">02:15</Text>
                <Text className="font-bold text-[13px] text-neutral-500 font-inter">Thời gian</Text>
              </View>
              <View className="flex-1 items-center pl-2">
                <Text className="font-extrabold text-[20px] text-primary-600 font-nunito">15</Text>
                <Text className="font-bold text-[13px] text-neutral-500 font-inter">Good+</Text>
              </View>
            </View>
          </View>

        </ScrollView>
        
        {/* Sticky Bottom CTA */}
        <View className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-neutral-100 flex-row gap-3">
          <Pressable 
            onPress={() => router.replace('/decks' as any)}
            className="flex-1 h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center flex-row gap-2"
          >
            <BookOpenIcon size={18} className="text-white" />
            <Text className="font-extrabold text-[15px] uppercase font-nunito tracking-wide text-white">ÔN TIẾP DECK KHÁC</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // VIEW: REVIEW SESSION
  // ==========================================
  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top', 'bottom']}>
      
      {/* OFFLINE BANNER MOCK */}
      {isOffline && (
        <View className="bg-warning-100 px-4 py-2 flex-row items-center justify-center gap-2 z-20">
          <WifiOffIcon size={14} className="text-warning-700" />
          <Text className="font-bold text-[12px] text-warning-700 font-inter">Đang offline, dữ liệu được lưu tạm</Text>
        </View>
      )}

      {/* 1. TOP BAR */}
      <View className="px-4 py-3 flex-row items-center justify-between z-10 bg-[#F7F8FA]">
        <Pressable 
          onPress={handleClose} 
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-200 -ml-2"
        >
          <XIcon size={24} className="text-neutral-500" />
        </Pressable>
        
        <View className="flex-1 mx-4">
          <View className="h-3 bg-neutral-200 rounded-full overflow-hidden w-full">
            <View 
              className="h-full bg-primary-500 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercent}%` }}
            />
          </View>
        </View>

        <Text className="font-extrabold text-[15px] text-neutral-500 font-nunito tabular-nums w-14 text-right">
          {currentIndex + 1} / {MOCK_CARDS.length}
        </Text>
      </View>

      {/* 2. DECK INFO */}
      <View className="px-5 pt-2 pb-6 items-center">
        <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2">{MOCK_DECK.name}</Text>
        <View className="flex-row items-center gap-2">
          {MOCK_DECK.overdue > 0 && (
            <View className="bg-error-50 px-3 py-1 rounded-full border border-error-100 flex-row items-center gap-1.5">
              <View className="w-2 h-2 rounded-full bg-error-500" />
              <Text className="font-bold text-[12px] text-error-700 font-inter">{MOCK_DECK.overdue} Overdue</Text>
            </View>
          )}
          <View className="bg-success-50 px-3 py-1 rounded-full border border-success-100 flex-row items-center gap-1.5">
            <View className="w-2 h-2 rounded-full bg-success-500" />
            <Text className="font-bold text-[12px] text-success-700 font-inter">{MOCK_DECK.due} Due</Text>
          </View>
        </View>
      </View>

      {/* 3. 3D FLASHCARD CONTAINER */}
      <View className="flex-1 px-5 relative z-10">
        <RNAnimated.View 
          style={{ transform: [{ translateX: slideAnim }], width: '100%', height: '100%', paddingBottom: 32 }}
        >
          <Pressable 
            onPress={handleFlip}
            className="w-full h-[65%] min-h-[300px] perspective-[1000px] mx-auto"
          >
            {/* FRONT SIDE */}
            <RNAnimated.View
              style={{
                transform: [{ rotateY: frontRotateY }],
                opacity: frontOpacity,
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: '#FFFFFF', borderRadius: 24, borderWidth: 2, borderColor: '#F5F5F5',
                alignItems: 'center', justifyContent: 'center', padding: 24,
                backfaceVisibility: 'hidden',
                elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 12,
              }}
            >
              <Text className="font-extrabold text-[42px] text-mascot-navy font-nunito text-center mb-4 leading-tight">
                {currentCard.word}
              </Text>
              
              <Pressable className="w-14 h-14 bg-info-50 rounded-full items-center justify-center active:bg-info-100 mb-8">
                <Volume2Icon size={28} className="text-info-500" />
              </Pressable>

              <Text className="absolute bottom-6 font-bold text-[14px] text-neutral-400 font-inter uppercase tracking-wider animate-pulse">
                Chạm để xem đáp án
              </Text>
            </RNAnimated.View>

            {/* BACK SIDE */}
            <RNAnimated.View
              style={{
                transform: [{ rotateY: backRotateY }],
                opacity: backOpacity,
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: '#FFFFFF', borderRadius: 24, borderWidth: 2, borderColor: '#BFDBFE', borderBottomWidth: 6,
                alignItems: 'center', justifyContent: 'center', padding: 24,
                backfaceVisibility: 'hidden',
                elevation: 4, shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 12,
              }}
            >
              <View className="items-center w-full">
                <Text className="font-extrabold text-[36px] text-mascot-navy font-nunito text-center mb-1 leading-tight">
                  {currentCard.word}
                </Text>
                <Text className="font-medium text-[18px] text-neutral-400 font-inter mb-4">
                  {currentCard.ipa}
                </Text>

                <View className="w-full h-[1px] bg-neutral-100 mb-6" />
                
                <Text className="font-bold text-[24px] text-primary-600 font-inter text-center mb-4">
                  {currentCard.meaning}
                </Text>

                <Text className="font-medium text-[16px] text-mascot-navy font-inter text-center mb-8 px-2 italic">
                  "{currentCard.example}"
                </Text>
                
                <Pressable className="w-14 h-14 bg-info-50 rounded-full items-center justify-center active:bg-info-100">
                  <Volume2Icon size={28} className="text-info-500" />
                </Pressable>
              </View>
            </RNAnimated.View>

          </Pressable>
        </RNAnimated.View>
      </View>

      {/* 4. FSRS RATING BAR */}
      <View className="p-4 bg-white border-t border-neutral-100 pb-safe z-20">
        {!isFlipped ? (
          <View className="h-[76px] items-center justify-center">
            <Text className="font-bold text-[14px] text-neutral-400 font-inter italic">
              Hãy cố nhớ nghĩa của từ trước khi lật nhé...
            </Text>
          </View>
        ) : (
          <View className="flex-row gap-2">
            
            {/* AGAIN */}
            <Pressable 
              onPress={() => handleRate('again')}
              className="flex-1 bg-error-500 rounded-2xl border-b-[4px] border-error-700 active:bg-error-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center py-3"
            >
              <Text className="font-bold text-[13px] text-error-100 font-inter mb-0.5">{currentCard.intervals.again}</Text>
              <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-wide">Lại</Text>
            </Pressable>

            {/* HARD */}
            <Pressable 
              onPress={() => handleRate('hard')}
              className="flex-1 bg-warning-500 rounded-2xl border-b-[4px] border-warning-700 active:bg-warning-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center py-3"
            >
              <Text className="font-bold text-[13px] text-warning-100 font-inter mb-0.5">{currentCard.intervals.hard}</Text>
              <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-wide">Khó</Text>
            </Pressable>

            {/* GOOD */}
            <Pressable 
              onPress={() => handleRate('good')}
              className="flex-1 bg-success-500 rounded-2xl border-b-[4px] border-success-700 active:bg-success-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center py-3"
            >
              <Text className="font-bold text-[13px] text-success-100 font-inter mb-0.5">{currentCard.intervals.good}</Text>
              <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-wide">Tốt</Text>
            </Pressable>

            {/* EASY */}
            <Pressable 
              onPress={() => handleRate('easy')}
              className="flex-1 bg-info-500 rounded-2xl border-b-[4px] border-info-700 active:bg-info-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center py-3"
            >
              <Text className="font-bold text-[13px] text-info-100 font-inter mb-0.5">{currentCard.intervals.easy}</Text>
              <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-wide">Dễ</Text>
            </Pressable>

          </View>
        )}
      </View>

    </SafeAreaView>
  );
}
