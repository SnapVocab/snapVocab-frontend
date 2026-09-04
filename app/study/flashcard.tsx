import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated as RNAnimated, Dimensions, Easing, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { XIcon, Volume2Icon, TrophyIcon, ArrowRightIcon } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

const { width, height } = Dimensions.get('window');

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_SESSION = {
  deckName: 'English Basics',
  cards: [
    { id: 'c1', word: 'boarding pass', ipa: '/ˈbɔːrdɪŋ pæs/', meaning: 'thẻ lên máy bay', example: 'Please show your boarding pass at the gate.', pos: 'noun' },
    { id: 'c2', word: 'departure', ipa: '/dɪˈpɑːrtʃər/', meaning: 'sự khởi hành', example: 'Our departure time is 8:00 AM.', pos: 'noun' },
    { id: 'c3', word: 'luggage', ipa: '/ˈlʌɡɪdʒ/', meaning: 'hành lý', example: 'I have two pieces of luggage.', pos: 'noun' },
  ]
};

type SessionState = 'EMPTY' | 'STUDY' | 'COMPLETED';

export default function FlashcardStudyScreen() {
  const [sessionState, setSessionState] = useState<SessionState>('STUDY');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Animations
  const flipAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(0)).current; // For next card transition
  const xpToastAnim = useRef(new RNAnimated.Value(0)).current;
  const [xpToastMsg, setXpToastMsg] = useState('');

  useEffect(() => {
    if (MOCK_SESSION.cards.length === 0) {
      setSessionState('EMPTY');
    }
  }, []);

  const handleClose = () => {
    if (sessionState === 'STUDY' && currentIndex > 0) {
      Alert.alert(
        "Thoát phiên học?",
        "Tiến độ đánh giá các thẻ đã hoàn thành sẽ được lưu.",
        [
          { text: "Tiếp tục học", style: "cancel" },
          { text: "Thoát", style: "destructive", onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  const flipCard = () => {
    if (isFlipped || isTransitioning) return;
    RNAnimated.spring(flipAnim, {
      toValue: 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(true);
    });
  };

  const resetCard = () => {
    flipAnim.setValue(0);
    setIsFlipped(false);
  };

  const handleRating = (rating: 'Again' | 'Hard' | 'Good' | 'Easy', xp: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Show XP Toast
    setXpToastMsg(`+${xp} XP`);
    RNAnimated.sequence([
      RNAnimated.timing(xpToastAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      RNAnimated.delay(400),
      RNAnimated.timing(xpToastAnim, { toValue: 0, duration: 200, useNativeDriver: true })
    ]).start();

    // Slide out current card
    RNAnimated.timing(slideAnim, {
      toValue: -width,
      duration: 250,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      // Check if finished
      if (currentIndex + 1 >= MOCK_SESSION.cards.length) {
        setSessionState('COMPLETED');
      } else {
        setCurrentIndex(prev => prev + 1);
        resetCard();
        // Slide in new card from right
        slideAnim.setValue(width);
        RNAnimated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start(() => {
          setIsTransitioning(false);
        });
      }
    });
  };

  // Interpolations for 3D flip
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg']
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.51, 1],
    outputRange: [1, 1, 0, 0]
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.51, 1],
    outputRange: [0, 0, 1, 1]
  });

  if (sessionState === 'EMPTY') {
    return (
      <SafeAreaView className="flex-1 bg-[#F7F8FA] items-center justify-center p-6">
        <Snapy pose="reading" className="w-32 h-32 mb-4" />
        <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2">Chưa có Card nào</Text>
        <Text className="font-medium text-[15px] text-neutral-500 font-inter text-center mb-8">Lưu thêm từ vào Deck để bắt đầu học nhé.</Text>
        <Pressable 
          onPress={() => router.back()}
          className="w-full h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center"
        >
          <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wide">Quay lại Deck</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (sessionState === 'COMPLETED') {
    return (
      <SafeAreaView className="flex-1 bg-[#F7F8FA]">
        <View className="flex-1 items-center justify-center p-6">
          <View className="relative mb-6">
            <View className="absolute inset-0 bg-warning-200 blur-2xl opacity-50 rounded-full" />
            <Snapy pose="happy" className="w-40 h-40 z-10" />
          </View>
          
          <Text className="font-extrabold text-[28px] text-mascot-navy font-nunito mb-2">Hoàn thành!</Text>
          <Text className="font-medium text-[15px] text-neutral-500 font-inter text-center mb-8">
            Bạn đã ôn xong {MOCK_SESSION.cards.length} thẻ vựng.
          </Text>

          <View className="bg-white w-full rounded-3xl p-6 border border-neutral-100 shadow-sm shadow-black/5 mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-bold text-[15px] text-neutral-500 font-inter">Độ chính xác</Text>
              <Text className="font-extrabold text-[18px] text-primary-600 font-nunito">85%</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="font-bold text-[15px] text-neutral-500 font-inter">Kinh nghiệm</Text>
              <View className="flex-row items-center gap-2">
                <TrophyIcon size={20} className="text-warning-500" />
                <Text className="font-extrabold text-[18px] text-warning-600 font-nunito">+120 XP</Text>
              </View>
            </View>
          </View>

          <Pressable 
            onPress={() => router.back()}
            className="w-full h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center flex-row gap-2"
          >
            <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wide">Quay lại Deck</Text>
            <ArrowRightIcon size={20} className="text-white" />
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const currentCard = MOCK_SESSION.cards[currentIndex];
  const progressPercent = ((currentIndex + 1) / MOCK_SESSION.cards.length) * 100;

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top', 'bottom']}>
      
      {/* 1. TOP BAR */}
      <View className="px-4 py-3 flex-row items-center justify-between z-10">
        <Pressable 
          onPress={handleClose} 
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-200 -ml-2"
        >
          <XIcon size={24} className="text-neutral-500" />
        </Pressable>
        
        <View className="flex-1 mx-4">
          <View className="h-2.5 bg-neutral-200 rounded-full overflow-hidden w-full">
            <RNAnimated.View 
              style={{ height: '100%', backgroundColor: '#58CC02', borderRadius: 9999, width: `${progressPercent}%` }}
            />
          </View>
        </View>

        <Text className="font-extrabold text-[15px] text-neutral-500 font-nunito tabular-nums w-12 text-right">
          {currentIndex + 1} / {MOCK_SESSION.cards.length}
        </Text>
      </View>

      <View className="items-center mb-4">
        <Text className="font-bold text-[13px] text-neutral-400 font-inter tracking-widest uppercase">{MOCK_SESSION.deckName}</Text>
      </View>

      {/* 2. MAIN FLASHCARD */}
      <View className="flex-1 px-5 justify-center items-center relative perspective-[1000px]">
        <RNAnimated.View style={{ transform: [{ translateX: slideAnim }], width: '100%', height: '65%' }}>
          
          <Pressable 
            onPress={flipCard} 
            className="w-full h-full"
            disabled={isFlipped || isTransitioning}
          >
            {/* FRONT SIDE */}
            <RNAnimated.View 
              style={{ 
                transform: [{ rotateY: frontInterpolate }],
                opacity: frontOpacity,
                backfaceVisibility: 'hidden',
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: '#FFFFFF', borderRadius: 32, borderWidth: 2, borderColor: '#F5F5F5', borderBottomWidth: 6,
                alignItems: 'center', justifyContent: 'center', padding: 32,
                elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 12,
              }}
            >
              <Text className="font-extrabold text-[40px] text-mascot-navy font-nunito text-center mb-3">
                {currentCard.word}
              </Text>
              <Text className="font-medium text-[18px] text-neutral-400 font-inter">
                {currentCard.ipa}
              </Text>

              <View className="absolute bottom-8 flex-row items-center gap-2 opacity-50">
                <Text className="font-bold text-[14px] text-neutral-400 font-inter tracking-widest uppercase">
                  Chạm để lật
                </Text>
              </View>
            </RNAnimated.View>

            {/* BACK SIDE */}
            <RNAnimated.View 
              style={{ 
                transform: [{ rotateY: backInterpolate }],
                opacity: backOpacity,
                backfaceVisibility: 'hidden',
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: '#FFFFFF', borderRadius: 32, borderWidth: 2, borderColor: '#F5F5F5', borderBottomWidth: 6,
                alignItems: 'center', padding: 32, paddingTop: 48,
                elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 12,
              }}
            >
              <Pressable 
                onPress={() => console.log('Playing audio')}
                className="absolute top-6 right-6 w-12 h-12 bg-info-50 rounded-full items-center justify-center active:bg-info-100"
              >
                <Volume2Icon size={24} className="text-info-500" />
              </Pressable>

              <Text className="font-extrabold text-[32px] text-mascot-navy font-nunito text-center mb-1 w-full mt-8">
                {currentCard.word}
              </Text>
              <Text className="font-medium text-[16px] text-neutral-400 font-inter mb-6">
                {currentCard.ipa}
              </Text>

              <View className="w-full h-[1px] bg-neutral-100 mb-6" />

              <Text className="font-extrabold text-[24px] text-primary-600 font-nunito text-center mb-3">
                {currentCard.meaning}
              </Text>
              <View className="bg-neutral-50 px-3 py-1 rounded-lg mb-6">
                <Text className="font-bold text-[13px] text-neutral-500 font-inter">{currentCard.pos}</Text>
              </View>
              
              <Text className="font-medium text-[16px] text-neutral-600 font-inter text-center leading-relaxed">
                "{currentCard.example}"
              </Text>

            </RNAnimated.View>
          </Pressable>
        </RNAnimated.View>
      </View>

      {/* 3. FSRS RATING BAR */}
      <View className="h-[120px] px-4 justify-center">
        {isFlipped ? (
          <View className="flex-row justify-between gap-3">
            
            <Pressable 
              onPress={() => handleRating('Again', 10)}
              className="flex-1 h-[68px] bg-error-50 border-2 border-error-100 border-b-[4px] rounded-2xl active:bg-error-100 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center"
            >
              <Text className="font-extrabold text-[15px] text-error-600 font-nunito mb-0.5">Again</Text>
              <Text className="font-bold text-[11px] text-error-500 font-inter opacity-80 uppercase tracking-widest">Lặp lại</Text>
            </Pressable>
            
            <Pressable 
              onPress={() => handleRating('Hard', 20)}
              className="flex-1 h-[68px] bg-warning-50 border-2 border-warning-100 border-b-[4px] rounded-2xl active:bg-warning-100 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center"
            >
              <Text className="font-extrabold text-[15px] text-warning-600 font-nunito mb-0.5">Hard</Text>
              <Text className="font-bold text-[11px] text-warning-500 font-inter opacity-80 uppercase tracking-widest">Khó</Text>
            </Pressable>
            
            <Pressable 
              onPress={() => handleRating('Good', 30)}
              className="flex-1 h-[68px] bg-primary-500 border-b-[4px] border-primary-700 rounded-2xl active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center"
            >
              <Text className="font-extrabold text-[15px] text-white font-nunito mb-0.5">Good</Text>
              <Text className="font-bold text-[11px] text-primary-100 font-inter opacity-90 uppercase tracking-widest">Tốt</Text>
            </Pressable>
            
            <Pressable 
              onPress={() => handleRating('Easy', 40)}
              className="flex-1 h-[68px] bg-info-50 border-2 border-info-100 border-b-[4px] rounded-2xl active:bg-info-100 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center"
            >
              <Text className="font-extrabold text-[15px] text-info-600 font-nunito mb-0.5">Easy</Text>
              <Text className="font-bold text-[11px] text-info-500 font-inter opacity-80 uppercase tracking-widest">Dễ</Text>
            </Pressable>

          </View>
        ) : (
          <View className="items-center justify-center opacity-50 flex-row gap-2">
            {/* Vùng trống để chống giật UI khi lật thẻ */}
            <Text className="font-bold text-[13px] text-neutral-400 font-inter">Cố gắng nhớ ra trước khi lật nhé!</Text>
          </View>
        )}
      </View>

      {/* 4. XP TOAST NOTIFICATION */}
      <RNAnimated.View 
        style={{ 
          opacity: xpToastAnim,
          transform: [
            { scale: xpToastAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.8, 1.1, 1] }) },
            { translateY: xpToastAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }
          ],
          position: 'absolute', top: '35%', width: '100%', alignItems: 'center', justifyContent: 'center', zIndex: 50,
        }}
        pointerEvents="none"
      >
        <View className="bg-warning-500 px-6 py-3 rounded-full shadow-lg shadow-warning-500/30 flex-row items-center gap-2">
          <TrophyIcon size={20} className="text-white" />
          <Text className="font-extrabold text-[20px] text-white font-nunito">{xpToastMsg}</Text>
        </View>
      </RNAnimated.View>

    </SafeAreaView>
  );
}
