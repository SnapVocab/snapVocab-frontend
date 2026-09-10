import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, Pressable, Animated as RNAnimated, Dimensions, Easing, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  XIcon, 
  Volume2Icon,
  WifiOffIcon,
  TrophyIcon,
  HomeIcon,
  RotateCcwIcon,
  BookOpenIcon,
  BookmarkIcon,
  SparklesIcon,
  CheckCircle2Icon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

const { width, height } = Dimensions.get('window');

// ==========================================
// TYPES & MOCK DATA
// ==========================================
interface ReviewCard {
  id: string;
  word: string;
  ipa: string;
  meaning: string;
  example: string;
  pos: string;
  intervals: {
    again: string;
    hard: string;
    good: string;
    easy: string;
  };
}

const MOCK_DECK = {
  name: 'English Basics',
  overdue: 3,
  due: 17
};

const INITIAL_CARDS: ReviewCard[] = [
  {
    id: 'c1',
    word: 'abandon',
    ipa: '/əˈbændən/',
    meaning: 'từ bỏ, bỏ dở',
    pos: 'verb',
    example: 'She decided to abandon the risky project.',
    intervals: { again: '10m', hard: '2d', good: '5d', easy: '14d' }
  },
  {
    id: 'c2',
    word: 'achieve',
    ipa: '/əˈtʃiːv/',
    meaning: 'đạt được, hoàn thành',
    pos: 'verb',
    example: 'They hope to achieve their learning goals.',
    intervals: { again: '10m', hard: '3d', good: '7d', easy: '21d' }
  },
  {
    id: 'c3',
    word: 'improve',
    ipa: '/ɪmˈpruːv/',
    meaning: 'cải thiện, nâng cao',
    pos: 'verb',
    example: 'He wants to improve his English pronunciation.',
    intervals: { again: '10m', hard: '1d', good: '4d', easy: '10d' }
  }
];

export default function SRSReviewScreen() {
  const router = useRouter();

  // Review Queue & State
  const [queue, setQueue] = useState<ReviewCard[]>(INITIAL_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isOffline] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  // Performance & Tracking
  const [startTime] = useState<number>(Date.now());
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [ratingsCount, setRatingsCount] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  });
  const [totalXpEarned, setTotalXpEarned] = useState(0);

  // Animations
  const flipAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(0)).current;
  const confettiAnim = useRef(new RNAnimated.Value(0)).current;
  const xpToastAnim = useRef(new RNAnimated.Value(0)).current;
  const [xpToastMsg, setXpToastMsg] = useState('');

  // Current Card
  const currentCard = queue[currentIndex];

  // Calculate Progress Percent: based on mastered cards towards target initial cards
  const progressPercent = Math.min(100, Math.round(((currentIndex) / Math.max(queue.length, INITIAL_CARDS.length)) * 100));

  // Safe Navigation Fallback
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

  const handleClose = () => {
    Alert.alert(
      "Thoát ôn tập?",
      "Tiến độ ôn tập các từ đã học sẽ được lưu lại.",
      [
        { text: "Tiếp tục học", style: "cancel" },
        { text: "Thoát", style: "destructive", onPress: navigateBackSafely }
      ]
    );
  };

  // Audio Playback (TTS)
  const playWordAudio = (word: string, e?: any) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Bookmark Toggle
  const toggleBookmark = (id: string, e?: any) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    setBookmarkedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Bidirectional Flip Handlers
  const handleFlipToBack = () => {
    if (isFlipped) return;
    RNAnimated.spring(flipAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start(() => setIsFlipped(true));
  };

  const handleFlipToFront = (e?: any) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    if (!isFlipped) return;
    RNAnimated.spring(flipAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start(() => setIsFlipped(false));
  };

  // FSRS Rating Handler
  const handleRate = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    // XP reward calculation per rating
    let earnedXp = 5;
    if (rating === 'again') earnedXp = 2;
    if (rating === 'hard') earnedXp = 5;
    if (rating === 'good') earnedXp = 10;
    if (rating === 'easy') earnedXp = 15;

    setTotalXpEarned(prev => prev + earnedXp);
    setRatingsCount(prev => ({
      ...prev,
      [rating]: prev[rating] + 1
    }));

    // Trigger Floating XP Toast
    setXpToastMsg(`+${earnedXp} XP`);
    RNAnimated.sequence([
      RNAnimated.timing(xpToastAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      RNAnimated.delay(400),
      RNAnimated.timing(xpToastAnim, { toValue: 0, duration: 200, useNativeDriver: true })
    ]).start();

    // Re-queue card if rated 'again' (Active Recall / SRS behavior)
    if (rating === 'again') {
      setQueue(prev => [...prev, currentCard]);
    }

    // Slide transition to next card
    RNAnimated.timing(slideAnim, {
      toValue: -width,
      duration: 240,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      if (currentIndex + 1 >= queue.length) {
        // Complete session
        const finalDuration = Math.max(1, Math.round((Date.now() - startTime) / 1000));
        setDurationSeconds(finalDuration);
        setIsFinished(true);
        triggerConfetti();
      } else {
        // Proceed to next card in queue
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
        flipAnim.setValue(0);
        
        slideAnim.setValue(width);
        RNAnimated.timing(slideAnim, {
          toValue: 0,
          duration: 240,
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

  // Interpolations for 3D Flip
  const frontRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.51, 1],
    outputRange: [0, 0, 1, 1],
  });

  // Confetti Particle Generator
  const renderConfetti = () => {
    if (!isFinished) return null;
    const pieces = Array.from({ length: 30 }).map((_, i) => {
      const left = Math.random() * width;
      const size = Math.random() * 8 + 6;
      const rotate = Math.random() * 360;
      const colors = ['#34D399', '#60A5FA', '#FBBF24', '#F87171', '#A78BFA'];
      const color = colors[i % colors.length];

      const translateY = confettiAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-40, height]
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
            top: -40,
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: 3,
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

  // Format Elapsed Time
  const formattedTime = useMemo(() => {
    const mins = Math.floor(durationSeconds / 60);
    const secs = durationSeconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, [durationSeconds]);

  // Real Calculated Accuracy
  const totalReviews = ratingsCount.again + ratingsCount.hard + ratingsCount.good + ratingsCount.easy;
  const accuracyPercent = totalReviews > 0
    ? Math.round(((ratingsCount.good + ratingsCount.easy) / totalReviews) * 100)
    : 100;

  // ==========================================
  // VIEW: EMPTY STATE
  // ==========================================
  if (INITIAL_CARDS.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center p-6">
          <Snapy pose="tu_hao" animation="bounce" style={{ width: 100, height: 100 }} className="mb-6" />
          <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito text-center mb-2">
            Bạn đã ôn xong hôm nay! 🎉
          </Text>
          <Text className="font-medium text-[15px] text-neutral-500 font-inter text-center mb-8">
            Không có từ nào đến hạn. Hãy quay lại sau nhé!
          </Text>
          <Pressable 
            onPress={navigateBackSafely}
            className="w-full h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center flex-row gap-2"
          >
            <HomeIcon size={20} className="text-white" />
            <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wide">
              VỀ TRANG CHỦ
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // VIEW: REVIEW SUMMARY (COMPACT & BALANCED)
  // ==========================================
  if (isFinished) {
    return (
      <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top', 'bottom']}>
        {renderConfetti()}
        
        <ScrollView 
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 110, alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          {/* Snapy Celebration Header */}
          <View className="relative items-center mb-3">
            <View className="absolute -inset-1 bg-warning-200 blur-xl opacity-40 rounded-full" />
            <Snapy pose="an_mung" animation="celebrate" style={{ width: 84, height: 84 }} className="mb-1.5 z-10" />
            <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito text-center leading-tight">
              Bạn đã ôn xong! 🎉
            </Text>
            <Text className="font-bold text-[13px] text-neutral-500 font-inter mt-0.5">
              Tuyệt vời! Bạn đã hoàn thành phiên ôn tập hôm nay
            </Text>
          </View>

          {/* Reward Card */}
          <View className="bg-white rounded-2xl border-2 border-neutral-100 border-b-[5px] shadow-sm p-4 items-center w-full mb-4">
            <View className="w-12 h-12 bg-warning-50 rounded-full items-center justify-center mb-1">
              <TrophyIcon size={26} className="text-warning-500" />
            </View>
            <Text className="font-extrabold text-[12px] text-neutral-400 font-inter uppercase tracking-widest mb-0.5">
              PHẦN THƯỞNG
            </Text>
            <Text className="font-extrabold text-[26px] text-warning-600 font-nunito">
              +{totalXpEarned} XP
            </Text>
          </View>

          {/* 4-Cell Statistics Grid (Real Session Data) */}
          <View className="w-full bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm mb-4">
            <View className="flex-row">
              <View className="flex-1 items-center border-r border-b border-neutral-100 pb-3 pr-2">
                <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito">{INITIAL_CARDS.length}</Text>
                <Text className="font-bold text-[12px] text-neutral-500 font-inter">Từ đã ôn</Text>
              </View>
              <View className="flex-1 items-center border-b border-neutral-100 pb-3 pl-2">
                <Text className="font-extrabold text-[22px] text-success-600 font-nunito">{accuracyPercent}%</Text>
                <Text className="font-bold text-[12px] text-neutral-500 font-inter">Accuracy</Text>
              </View>
            </View>
            <View className="flex-row pt-3">
              <View className="flex-1 items-center border-r border-neutral-100 pr-2">
                <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">{formattedTime}</Text>
                <Text className="font-bold text-[12px] text-neutral-500 font-inter">Thời gian</Text>
              </View>
              <View className="flex-1 items-center pl-2">
                <Text className="font-extrabold text-[18px] text-primary-600 font-nunito">
                  {ratingsCount.good + ratingsCount.easy}
                </Text>
                <Text className="font-bold text-[12px] text-neutral-500 font-inter">Good+</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        
        {/* Sticky Bottom Actions: Dual CTA */}
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-neutral-100 flex-row gap-3">
          <Pressable 
            onPress={navigateBackSafely}
            className="flex-1 h-13 bg-neutral-100 border border-neutral-200 rounded-2xl active:bg-neutral-200 items-center justify-center flex-row gap-2"
          >
            <HomeIcon size={18} className="text-neutral-700" />
            <Text className="font-extrabold text-[14px] uppercase font-nunito tracking-wide text-neutral-700">
              VỀ TRANG CHỦ
            </Text>
          </Pressable>

          <Pressable 
            onPress={() => router.replace('/decks' as any)}
            className="flex-1 h-13 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center flex-row gap-2"
          >
            <BookOpenIcon size={18} className="text-white" />
            <Text className="font-extrabold text-[14px] uppercase font-nunito tracking-wide text-white">
              ÔN TIẾP DECK
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // VIEW: ACTIVE REVIEW SESSION
  // ==========================================
  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top', 'bottom']}>
      
      {/* OFFLINE BANNER (NFR-17) */}
      {isOffline && (
        <View className="bg-warning-100 px-4 py-2 flex-row items-center justify-center gap-2 z-30">
          <WifiOffIcon size={14} className="text-warning-700" />
          <Text className="font-bold text-[12px] text-warning-700 font-inter">
            Đang offline, dữ liệu được lưu tạm
          </Text>
        </View>
      )}

      {/* Floating XP Toast */}
      <RNAnimated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 70,
          alignSelf: 'center',
          zIndex: 50,
          opacity: xpToastAnim,
          transform: [{
            translateY: xpToastAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [10, -10]
            })
          }]
        }}
        className="bg-warning-500 px-4 py-1.5 rounded-full border border-warning-600 shadow-md flex-row items-center gap-1.5"
      >
        <SparklesIcon size={16} className="text-white" />
        <Text className="font-extrabold text-[14px] text-white font-nunito">{xpToastMsg}</Text>
      </RNAnimated.View>

      {/* 1. TOP BAR */}
      <View className="px-4 py-3 flex-row items-center justify-between z-10 bg-[#F7F8FA]">
        <Pressable 
          onPress={handleClose} 
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-200 -ml-1"
        >
          <XIcon size={24} className="text-neutral-500" />
        </Pressable>
        
        <View className="flex-1 mx-4">
          <View className="h-3 bg-neutral-200 rounded-full overflow-hidden w-full">
            <View 
              className="h-full bg-primary-500 rounded-full transition-all duration-300" 
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </View>
        </View>

        <Text className="font-extrabold text-[15px] text-neutral-500 font-nunito tabular-nums w-14 text-right">
          {currentIndex + 1} / {queue.length}
        </Text>
      </View>

      {/* 2. DECK INFO & DUE BADGES */}
      <View className="px-5 pt-1 pb-4 items-center">
        <Text className="font-extrabold text-[19px] text-mascot-navy font-nunito mb-1.5">
          {MOCK_DECK.name}
        </Text>
        <View className="flex-row items-center gap-2">
          {MOCK_DECK.overdue > 0 && (
            <View className="bg-danger-50 px-3 py-1 rounded-full border border-danger-100 flex-row items-center gap-1.5">
              <View className="w-2 h-2 rounded-full bg-danger-500" />
              <Text className="font-bold text-[12px] text-danger-700 font-inter">
                {MOCK_DECK.overdue} Overdue
              </Text>
            </View>
          )}
          <View className="bg-success-50 px-3 py-1 rounded-full border border-success-100 flex-row items-center gap-1.5">
            <View className="w-2 h-2 rounded-full bg-success-500" />
            <Text className="font-bold text-[12px] text-success-700 font-inter">
              {MOCK_DECK.due} Due
            </Text>
          </View>
        </View>
      </View>

      {/* 3. 3D FLASHCARD CONTAINER */}
      <View className="flex-1 px-5 relative z-10 justify-center">
        <RNAnimated.View 
          style={{ transform: [{ translateX: slideAnim }], width: '100%', height: '100%', maxHeight: 420 }}
        >
          {/* Card Clickable Surface */}
          <View className="w-full h-full perspective-[1000px] relative">
            
            {/* FRONT SIDE */}
            <RNAnimated.View
              style={{
                transform: [{ rotateY: frontRotateY }],
                opacity: frontOpacity,
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: '#FFFFFF', borderRadius: 24, borderWidth: 2, borderColor: '#F0F1F5',
                borderBottomWidth: 6,
                alignItems: 'center', justifyContent: 'space-between', padding: 24,
                backfaceVisibility: 'hidden',
                elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10,
              }}
            >
              {/* Header inside Front Card: Part of Speech & Bookmark */}
              <View className="w-full flex-row items-center justify-between">
                <View className="bg-neutral-100 px-3 py-1 rounded-full">
                  <Text className="font-bold text-[12px] text-neutral-600 font-inter uppercase">
                    {currentCard.pos}
                  </Text>
                </View>

                <Pressable 
                  onPress={(e) => toggleBookmark(currentCard.id, e)}
                  className="w-10 h-10 rounded-full items-center justify-center active:bg-neutral-100"
                >
                  <BookmarkIcon 
                    size={20} 
                    className={cn(bookmarkedIds[currentCard.id] ? "text-warning-500 fill-warning-500" : "text-neutral-400")} 
                  />
                </Pressable>
              </View>

              {/* Center Content: Word & Audio */}
              <View className="items-center my-auto">
                <Text className="font-extrabold text-[38px] text-mascot-navy font-nunito text-center mb-4 leading-tight">
                  {currentCard.word}
                </Text>
                
                <Pressable 
                  onPress={(e) => playWordAudio(currentCard.word, e)}
                  className={cn(
                    "w-14 h-14 rounded-full items-center justify-center transition-all",
                    isSpeaking ? "bg-info-500 scale-105 shadow-md shadow-info-500/30" : "bg-info-50 active:bg-info-100"
                  )}
                >
                  <Volume2Icon size={26} className={isSpeaking ? "text-white" : "text-info-500"} />
                </Pressable>
              </View>

              {/* Bottom Cue to Flip */}
              <Pressable 
                onPress={handleFlipToBack}
                className="w-full py-3 items-center justify-center rounded-xl active:bg-neutral-50"
              >
                <Text className="font-bold text-[13px] text-neutral-400 font-inter uppercase tracking-wider animate-pulse">
                  Chạm để xem đáp án
                </Text>
              </Pressable>
            </RNAnimated.View>

            {/* BACK SIDE */}
            <RNAnimated.View
              style={{
                transform: [{ rotateY: backRotateY }],
                opacity: backOpacity,
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: '#FFFFFF', borderRadius: 24, borderWidth: 2, borderColor: '#BFDBFE', 
                borderBottomWidth: 6,
                alignItems: 'center', justifyContent: 'space-between', padding: 24,
                backfaceVisibility: 'hidden',
                elevation: 4, shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 10,
              }}
            >
              {/* Back Card Top: Part of Speech & Audio */}
              <View className="w-full flex-row items-center justify-between">
                <View className="bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                  <Text className="font-bold text-[12px] text-primary-700 font-inter uppercase">
                    {currentCard.pos}
                  </Text>
                </View>

                <Pressable 
                  onPress={(e) => playWordAudio(currentCard.word, e)}
                  className={cn(
                    "w-10 h-10 rounded-full items-center justify-center transition-all",
                    isSpeaking ? "bg-info-500 shadow-sm" : "bg-info-50 active:bg-info-100"
                  )}
                >
                  <Volume2Icon size={20} className={isSpeaking ? "text-white" : "text-info-500"} />
                </Pressable>
              </View>

              {/* Back Card Main Content */}
              <View className="items-center w-full my-auto">
                <Text className="font-extrabold text-[32px] text-mascot-navy font-nunito text-center mb-0.5 leading-tight">
                  {currentCard.word}
                </Text>
                <Text className="font-medium text-[16px] text-neutral-400 font-inter mb-3">
                  {currentCard.ipa}
                </Text>

                <View className="w-16 h-[1px] bg-neutral-200 mb-3" />
                
                <Text className="font-extrabold text-[22px] text-primary-600 font-nunito text-center mb-2">
                  {currentCard.meaning}
                </Text>

                <View className="bg-neutral-50 px-3.5 py-2.5 rounded-xl border border-neutral-100 w-full mt-1">
                  <Text className="font-medium text-[14px] text-mascot-navy font-inter text-center italic leading-relaxed">
                    "{currentCard.example}"
                  </Text>
                </View>
              </View>

              {/* Flip Back to Front Action */}
              <Pressable 
                onPress={handleFlipToFront}
                className="flex-row items-center gap-1.5 py-2 px-3.5 rounded-full bg-neutral-100 active:bg-neutral-200"
              >
                <RotateCcwIcon size={14} className="text-neutral-500" />
                <Text className="font-bold text-[12px] text-neutral-600 font-inter">
                  Xem lại mặt trước
                </Text>
              </Pressable>
            </RNAnimated.View>

          </View>
        </RNAnimated.View>
      </View>

      {/* 4. FSRS RATING BAR (4 3D BUTTONS) */}
      <View className="p-4 bg-white border-t border-neutral-100 pb-safe z-20 shadow-sm">
        {!isFlipped ? (
          <Pressable 
            onPress={handleFlipToBack}
            className="h-[68px] items-center justify-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200"
          >
            <Text className="font-bold text-[13px] text-neutral-400 font-inter italic">
              Hãy nhớ nghĩa của từ trước khi lật thẻ nhé...
            </Text>
          </Pressable>
        ) : (
          <View className="flex-row gap-2">
            
            {/* 1. AGAIN (LẠI) - RED 3D */}
            <Pressable 
              onPress={() => handleRate('again')}
              className="flex-1 bg-danger-500 rounded-2xl border-b-[4px] border-danger-700 active:bg-danger-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center py-2.5"
            >
              <Text className="font-bold text-[12px] text-danger-100 font-inter mb-0.5">
                {currentCard.intervals.again}
              </Text>
              <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-wide">
                Lại
              </Text>
            </Pressable>

            {/* 2. HARD (KHÓ) - YELLOW/ORANGE 3D */}
            <Pressable 
              onPress={() => handleRate('hard')}
              className="flex-1 bg-warning-500 rounded-2xl border-b-[4px] border-warning-700 active:bg-warning-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center py-2.5"
            >
              <Text className="font-bold text-[12px] text-warning-100 font-inter mb-0.5">
                {currentCard.intervals.hard}
              </Text>
              <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-wide">
                Khó
              </Text>
            </Pressable>

            {/* 3. GOOD (TỐT) - GREEN 3D */}
            <Pressable 
              onPress={() => handleRate('good')}
              className="flex-1 bg-success-500 rounded-2xl border-b-[4px] border-success-700 active:bg-success-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center py-2.5"
            >
              <Text className="font-bold text-[12px] text-success-100 font-inter mb-0.5">
                {currentCard.intervals.good}
              </Text>
              <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-wide">
                Tốt
              </Text>
            </Pressable>

            {/* 4. EASY (DỄ) - BLUE 3D */}
            <Pressable 
              onPress={() => handleRate('easy')}
              className="flex-1 bg-info-500 rounded-2xl border-b-[4px] border-info-700 active:bg-info-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center py-2.5"
            >
              <Text className="font-bold text-[12px] text-info-100 font-inter mb-0.5">
                {currentCard.intervals.easy}
              </Text>
              <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-wide">
                Dễ
              </Text>
            </Pressable>

          </View>
        )}
      </View>

    </SafeAreaView>
  );
}
