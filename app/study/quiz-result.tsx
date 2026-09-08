import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Animated, Easing, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  TrophyIcon, 
  CoinsIcon, 
  GiftIcon,
  RotateCcwIcon,
  HomeIcon,
  AlertTriangleIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

const { height, width } = Dimensions.get('window');

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_RESULT = {
  score: 18,
  total: 20,
  xp: 120,
  coin: 65,
  time: '03:42',
  wrongAnswers: [
    { id: 'w1', word: 'abandon', correct: 'từ bỏ', yours: 'đạt được' },
    { id: 'w2', word: 'achieve', correct: 'đạt được', yours: 'cải thiện' }
  ]
};

// To test Perfect Score, set wrongAnswers to [] and score to 20.
// const MOCK_RESULT = { score: 20, total: 20, xp: 150, coin: 80, time: '02:15', wrongAnswers: [] };

export default function QuizResultScreen() {
  const isPerfect = MOCK_RESULT.wrongAnswers.length === 0;
  const accuracy = Math.round((MOCK_RESULT.score / MOCK_RESULT.total) * 100);

  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reward Pop-in
    Animated.sequence([
      Animated.delay(300),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      })
    ]).start();

    // Confetti Fall
    Animated.timing(confettiAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  }, []);

  // Simple Confetti Generator
  const renderConfetti = () => {
    const pieces = Array.from({ length: 20 }).map((_, i) => {
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
        <Animated.View
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

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* 1. CONFETTI (Background overlay) */}
      {renderConfetti()}

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. CELEBRATION HEADER */}
        <View className="items-center pt-8 pb-6">
          <View className="relative">
            <View className="absolute inset-0 bg-warning-200 blur-3xl opacity-50 rounded-full" />
            <Snapy 
              pose={isPerfect ? "tu_hao" : accuracy >= 80 ? "an_mung" : "suy_nghi"} 
              animation={isPerfect ? "celebrate" : "bounce"}
              className="w-36 h-36 mb-2 z-10" 
            />
          </View>
          <Text className="font-extrabold text-[28px] text-mascot-navy font-nunito text-center px-4 leading-tight">
            {isPerfect ? 'PERFECT! 🎉' : 'Hoàn thành!'}
          </Text>
          <Text className="font-bold text-[15px] text-neutral-500 font-inter mt-1">
            {isPerfect ? 'Tuyệt vời! Bạn không sai một câu nào.' : 'Mỗi lần luyện tập là một bước tiến!'}
          </Text>
        </View>

        {/* 3. REWARD CENTERPIECE */}
        <Animated.View 
          style={{ transform: [{ scale: scaleAnim }], opacity: scaleAnim }}
          className="mx-6 mb-8 bg-white rounded-[24px] border-2 border-neutral-100 border-b-[6px] shadow-sm shadow-black/5 p-6 items-center"
        >
          <Text className="font-extrabold text-[13px] text-neutral-400 font-inter uppercase tracking-widest mb-4">
            PHẦN THƯỞNG
          </Text>

          <View className="flex-row items-center justify-center gap-8 w-full mb-6">
            <View className="items-center">
              <View className="w-14 h-14 bg-warning-50 rounded-full items-center justify-center mb-2">
                <TrophyIcon size={28} className="text-warning-500" />
              </View>
              <Text className="font-extrabold text-[20px] text-warning-600 font-nunito">+{MOCK_RESULT.xp} XP</Text>
            </View>
            
            <View className="w-[2px] h-12 bg-neutral-100" />

            <View className="items-center">
              <View className="w-14 h-14 bg-info-50 rounded-full items-center justify-center mb-2">
                <CoinsIcon size={28} className="text-info-500" />
              </View>
              <Text className="font-extrabold text-[20px] text-info-600 font-nunito">+{MOCK_RESULT.coin}</Text>
            </View>
          </View>

          <View className="w-full bg-primary-50 rounded-xl p-3 flex-row items-center justify-center gap-3 border border-primary-100">
            <GiftIcon size={20} className="text-primary-500" />
            <Text className="font-bold text-[14px] text-primary-700 font-inter">Rương bí ẩn (Sẽ mở sau)</Text>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim }}>
          {/* 4. SCORE & STATISTICS */}
          <View className="items-center mb-6">
            <Text className="font-extrabold text-[40px] text-mascot-navy font-nunito leading-tight">
              {MOCK_RESULT.score} / {MOCK_RESULT.total}
            </Text>
            <Text className="font-bold text-[15px] text-neutral-500 font-inter">
              Score: {accuracy}%
            </Text>
          </View>

          <View className="mx-6 bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm shadow-black/5 mb-8">
            <View className="flex-row">
              <View className="flex-1 items-center border-r border-b border-neutral-100 pb-4 pr-2">
                <Text className="font-extrabold text-[24px] text-success-600 font-nunito">{MOCK_RESULT.score}</Text>
                <Text className="font-bold text-[13px] text-neutral-500 font-inter">Đúng</Text>
              </View>
              <View className="flex-1 items-center border-b border-neutral-100 pb-4 pl-2">
                <Text className="font-extrabold text-[24px] text-error-600 font-nunito">{MOCK_RESULT.total - MOCK_RESULT.score}</Text>
                <Text className="font-bold text-[13px] text-neutral-500 font-inter">Sai</Text>
              </View>
            </View>
            <View className="flex-row pt-4">
              <View className="flex-1 items-center border-r border-neutral-100 pr-2">
                <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">{accuracy}%</Text>
                <Text className="font-bold text-[13px] text-neutral-500 font-inter">Chính xác</Text>
              </View>
              <View className="flex-1 items-center pl-2">
                <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">{MOCK_RESULT.time}</Text>
                <Text className="font-bold text-[13px] text-neutral-500 font-inter">Thời gian</Text>
              </View>
            </View>
          </View>

          {/* 5. WRONG ANSWERS SECTION */}
          {MOCK_RESULT.wrongAnswers.length > 0 ? (
            <View className="px-6 mb-8">
              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-1">Ôn lại từ sai</Text>
              <Text className="font-bold text-[13px] text-neutral-500 font-inter mb-4">Bạn có {MOCK_RESULT.wrongAnswers.length} từ cần luyện thêm</Text>

              <View className="gap-3">
                {MOCK_RESULT.wrongAnswers.map(wrong => (
                  <View key={wrong.id} className="bg-white p-4 rounded-[16px] border border-error-100 shadow-sm shadow-black/5">
                    <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-3">{wrong.word}</Text>
                    <View className="gap-2">
                      <View className="flex-row items-start gap-2">
                        <View className="w-5 h-5 bg-success-50 rounded-full items-center justify-center mt-0.5">
                          <Text className="text-[10px]">✔️</Text>
                        </View>
                        <Text className="font-medium text-[14px] text-neutral-600 font-inter flex-1">
                          Đúng: <Text className="font-bold text-success-600">{wrong.correct}</Text>
                        </Text>
                      </View>
                      <View className="flex-row items-start gap-2">
                        <View className="w-5 h-5 bg-error-50 rounded-full items-center justify-center mt-0.5">
                          <Text className="text-[10px]">❌</Text>
                        </View>
                        <Text className="font-medium text-[14px] text-neutral-600 font-inter flex-1">
                          Bạn chọn: <Text className="font-bold text-error-600">{wrong.yours}</Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View className="px-6 mb-8 items-center bg-success-50 p-6 rounded-[20px] border border-success-100">
              <Text className="text-4xl mb-3">🎉</Text>
              <Text className="font-extrabold text-[18px] text-success-700 font-nunito text-center">Hoàn hảo!</Text>
              <Text className="font-medium text-[14px] text-success-600 font-inter text-center mt-1">Không có từ nào sai. Bạn đang làm rất tốt!</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* 6. BOTTOM CTA BAR */}
      <View className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-neutral-100 gap-3">
        {!isPerfect && (
          <Pressable 
            onPress={() => console.log('Chuyển sang chế độ ôn từ sai')}
            className="w-full h-14 bg-warning-500 rounded-2xl border-b-[4px] border-warning-700 active:bg-warning-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center flex-row gap-2"
          >
            <AlertTriangleIcon size={18} className="text-white" />
            <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wide">ÔN TỪ SAI</Text>
          </Pressable>
        )}
        
        <View className="flex-row gap-3">
          <Pressable 
            onPress={() => router.back()}
            className={cn(
              "flex-1 h-14 rounded-2xl border-b-[4px] active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center flex-row gap-2",
              isPerfect 
                ? "bg-primary-500 border-primary-700 active:bg-primary-600" 
                : "bg-neutral-100 border-neutral-300 active:bg-neutral-200"
            )}
          >
            <RotateCcwIcon size={18} className={isPerfect ? "text-white" : "text-neutral-500"} />
            <Text className={cn(
              "font-extrabold text-[15px] uppercase font-nunito tracking-wide",
              isPerfect ? "text-white" : "text-neutral-600"
            )}>THỬ LẠI</Text>
          </Pressable>

          <Pressable 
            onPress={() => router.push('/(tabs)/learn' as any)}
            className="flex-1 h-14 bg-neutral-100 rounded-2xl border-b-[4px] border-neutral-300 active:bg-neutral-200 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center flex-row gap-2"
          >
            <HomeIcon size={18} className="text-neutral-500" />
            <Text className="font-extrabold text-[15px] text-neutral-600 uppercase font-nunito tracking-wide">VỀ HOME</Text>
          </Pressable>
        </View>
      </View>

    </SafeAreaView>
  );
}
