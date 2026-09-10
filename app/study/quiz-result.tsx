import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Animated, Easing, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router as globalRouter, useRouter, useLocalSearchParams } from 'expo-router';
import { 
  RotateCcwIcon,
  HomeIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  XCircleIcon,
  SparklesIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';
import { RewardIcon } from '@/components/snapvocab';

const { height, width } = Dimensions.get('window');

export default function QuizResultScreen() {
  let hookRouter: any = null;
  try {
    hookRouter = useRouter();
  } catch {
    hookRouter = null;
  }
  const router = hookRouter || globalRouter;

  const rawParams = useLocalSearchParams<{
    score?: string;
    total?: string;
    xp?: string;
    coin?: string;
    time?: string;
    deckId?: string;
    mode?: string;
    wrongAnswers?: string;
  }>();
  const params = rawParams || {};

  const score = parseInt(params.score || '5', 10);
  const total = parseInt(params.total || '5', 10);
  const xp = parseInt(params.xp || `${score * 10}`, 10);
  const coin = parseInt(params.coin || `${score * 5}`, 10);
  const time = params.time || '01:15';

  let wrongAnswers: Array<{ id: string; word: string; correct: string; yours: string }> = [];
  try {
    if (params.wrongAnswers) {
      wrongAnswers = JSON.parse(params.wrongAnswers);
    }
  } catch {
    wrongAnswers = [];
  }

  const isPerfect = wrongAnswers.length === 0 && score > 0;
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reward Pop-in
    Animated.sequence([
      Animated.delay(200),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true
      })
    ]).start();

    // Confetti Fall
    Animated.timing(confettiAnim, {
      toValue: 1,
      duration: 2200,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  }, []);

  // Simple Confetti Generator
  const renderConfetti = () => {
    const pieces = Array.from({ length: 22 }).map((_, i) => {
      const left = Math.random() * width;
      const size = Math.random() * 8 + 6;
      const rotate = Math.random() * 360;
      const colors = ['#58CC02', '#1CB0F6', '#FFC42E', '#FF8A00', '#2B70C9'];
      const color = colors[i % colors.length];

      const translateY = confettiAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-50, height + 50]
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

  const handleReviewWrong = () => {
    if (wrongAnswers.length === 0) return;
    const target = {
      pathname: '/study/quiz-session' as const,
      params: {
        reviewWrong: 'true',
        wrongData: JSON.stringify(wrongAnswers),
        count: String(wrongAnswers.length),
        deckId: params.deckId || 'd1',
        mode: params.mode || 'MULTIPLE_CHOICE',
      }
    };
    try {
      const active = router || globalRouter;
      if (active && typeof active.replace === 'function') {
        active.replace(target as any);
        return;
      }
    } catch {
      // ignore
    }
    try {
      globalRouter.replace(target as any);
    } catch {
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = `/study/quiz-session?reviewWrong=true&count=${wrongAnswers.length}&mode=${params.mode || 'MULTIPLE_CHOICE'}`;
      }
    }
  };

  const handleRetry = () => {
    const target = {
      pathname: '/study/quiz-session' as const,
      params: {
        deckId: params.deckId || 'd1',
        mode: params.mode || 'MULTIPLE_CHOICE',
        count: String(total)
      }
    };
    try {
      const active = router || globalRouter;
      if (active && typeof active.replace === 'function') {
        active.replace(target as any);
        return;
      }
    } catch {
      // ignore
    }
    try {
      globalRouter.replace(target as any);
    } catch {
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = `/study/quiz-session?deckId=${params.deckId || 'd1'}&mode=${params.mode || 'MULTIPLE_CHOICE'}&count=${total}`;
      }
    }
  };

  const handleGoHome = () => {
    try {
      const active = router || globalRouter;
      if (active && typeof active.replace === 'function') {
        active.replace('/(tabs)/learn');
        return;
      }
    } catch {
      // ignore
    }
    try {
      globalRouter.replace('/(tabs)/learn');
    } catch {
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = '/learn';
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* 1. CONFETTI (Background overlay) */}
      {renderConfetti()}

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. CELEBRATION HEADER */}
        <View className="items-center pt-6 pb-4">
          <View className="relative items-center justify-center">
            <View className="absolute w-44 h-44 bg-warning-200/50 blur-2xl rounded-full" />
            <Snapy 
              pose={isPerfect ? "tu_hao" : accuracy >= 80 ? "an_mung" : "suy_nghi"} 
              animation={isPerfect ? "celebrate" : "bounce"}
              style={{ width: 130, height: 130 }}
              className="mb-2 z-10" 
            />
          </View>
          <Text className="font-extrabold text-[28px] text-mascot-navy font-nunito text-center px-4 leading-tight">
            {isPerfect ? 'PERFECT! XUẤT SẮC' : accuracy >= 70 ? 'HOÀN THÀNH TỐT' : 'HOÀN THÀNH BÀI THI'}
          </Text>
          <Text className="font-bold text-[15px] text-neutral-500 font-inter mt-1 text-center px-4">
            {isPerfect 
              ? (params.mode === 'MATCHING' 
                  ? 'Bạn đã ghép đúng toàn bộ các cặp từ! Siêu đẳng!' 
                  : params.mode === 'FILL_BLANK'
                    ? 'Bạn đã điền chính xác toàn bộ các câu hỏi!'
                    : 'Bạn không sai câu nào. Phản xạ tuyệt vời!') 
              : 'Mỗi bài kiểm tra giúp từ vựng ghi sâu vào trí nhớ!'}
          </Text>
        </View>

        {/* 3. REWARD CENTERPIECE (3D Assets theo DESIGN.md) */}
        <Animated.View 
          style={{ transform: [{ scale: scaleAnim }], opacity: scaleAnim }}
          className="mx-6 mb-7 bg-white rounded-[24px] border-2 border-neutral-100 border-b-[6px] shadow-sm shadow-black/5 p-6 items-center"
        >
          <Text className="font-extrabold text-[12px] text-neutral-400 font-inter uppercase tracking-widest mb-4">
            PHẦN THƯỞNG ĐÃ NHẬN
          </Text>

          <View className="flex-row items-center justify-center gap-10 w-full mb-6">
            <View className="items-center">
              <View className="w-14 h-14 bg-warning-50 rounded-2xl items-center justify-center mb-2 border border-warning-200">
                <RewardIcon type="xp" size="lg" animation="pulse" />
              </View>
              <Text className="font-extrabold text-[20px] text-warning-600 font-nunito">+{xp} XP</Text>
            </View>
            
            <View className="w-[1.5px] h-12 bg-neutral-100" />

            <View className="items-center">
              <View className="w-14 h-14 bg-warning-50/60 rounded-2xl items-center justify-center mb-2 border border-warning-200">
                <RewardIcon type="coin" size="lg" animation="bounce" />
              </View>
              <Text className="font-extrabold text-[20px] text-warning-600 font-nunito">+{coin}</Text>
            </View>
          </View>

          <View className="w-full bg-primary-50 rounded-2xl p-3.5 flex-row items-center justify-center gap-3 border border-primary-200">
            <RewardIcon type="gift" size="sm" animation="shine" />
            <Text className="font-bold text-[14px] text-primary-800 font-inter">Rương Thử Thách (Kiểm tra trong Kho đồ)</Text>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim }}>
          {/* 4. SCORE & STATISTICS */}
          <View className="items-center mb-5">
            <Text className="font-extrabold text-[40px] text-mascot-navy font-nunito leading-tight">
              {score} / {total}
            </Text>
            <Text className="font-bold text-[15px] text-neutral-500 font-inter">
              Độ chính xác: {accuracy}%
            </Text>
          </View>

          <View className="mx-6 bg-white rounded-3xl p-5 border-2 border-neutral-100 shadow-sm shadow-black/5 mb-7">
            <View className="flex-row">
              <View className="flex-1 items-center border-r border-b border-neutral-100 pb-4 pr-2">
                <Text className="font-extrabold text-[24px] text-success-600 font-nunito">{score}</Text>
                <Text className="font-bold text-[13px] text-neutral-500 font-inter">Đúng</Text>
              </View>
              <View className="flex-1 items-center border-b border-neutral-100 pb-4 pl-2">
                <Text className="font-extrabold text-[24px] text-error-600 font-nunito">{total - score}</Text>
                <Text className="font-bold text-[13px] text-neutral-500 font-inter">Chưa đúng</Text>
              </View>
            </View>
            <View className="flex-row pt-4">
              <View className="flex-1 items-center border-r border-neutral-100 pr-2">
                <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">{accuracy}%</Text>
                <Text className="font-bold text-[13px] text-neutral-500 font-inter">Tỷ lệ chính xác</Text>
              </View>
              <View className="flex-1 items-center pl-2">
                <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">{time}</Text>
                <Text className="font-bold text-[13px] text-neutral-500 font-inter">Thời gian làm</Text>
              </View>
            </View>
          </View>

          {/* 5. WRONG ANSWERS SECTION */}
          {wrongAnswers.length > 0 ? (
            <View className="px-6 mb-8">
              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-1">Cần ôn lại</Text>
              <Text className="font-bold text-[13px] text-neutral-500 font-inter mb-4">
                Bạn có {wrongAnswers.length} từ vựng cần củng cố thêm
              </Text>

              <View className="gap-3">
                {wrongAnswers.map((wrong, idx) => (
                  <View key={wrong.id || `w_${idx}`} className="bg-white p-4 rounded-2xl border-2 border-error-100 shadow-sm shadow-black/5">
                    <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-2.5">{wrong.word}</Text>
                    <View className="gap-2">
                      <View className="flex-row items-start gap-2.5">
                        <View className="w-5 h-5 bg-success-100 rounded-full items-center justify-center mt-0.5 border border-success-200">
                          <CheckCircle2Icon size={14} className="text-success-600" />
                        </View>
                        <Text className="font-medium text-[14px] text-neutral-600 font-inter flex-1">
                          {params.mode === 'MATCHING' ? 'Nghĩa đúng: ' : params.mode === 'FILL_BLANK' ? 'Từ đúng: ' : 'Đúng: '}<Text className="font-bold text-success-700">{wrong.correct}</Text>
                        </Text>
                      </View>
                      <View className="flex-row items-start gap-2.5">
                        <View className="w-5 h-5 bg-error-100 rounded-full items-center justify-center mt-0.5 border border-error-200">
                          <XCircleIcon size={14} className="text-error-600" />
                        </View>
                        <Text className="font-medium text-[14px] text-neutral-600 font-inter flex-1">
                          {params.mode === 'MATCHING' ? 'Bạn ghép nhầm: ' : params.mode === 'FILL_BLANK' ? 'Bạn đã điền: ' : 'Bạn chọn: '}<Text className="font-bold text-error-700">{wrong.yours}</Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View className="mx-6 mb-8 items-center bg-success-50/90 p-6 rounded-3xl border-2 border-success-200">
              <View className="w-12 h-12 rounded-2xl bg-success-500 items-center justify-center mb-3 shadow-md shadow-success-500/20">
                <SparklesIcon size={24} className="text-white" />
              </View>
              <Text className="font-extrabold text-[19px] text-success-800 font-nunito text-center">Hoàn hảo! 100% Chính Xác</Text>
              <Text className="font-medium text-[14px] text-success-700 font-inter text-center mt-1 px-2">
                Không có từ nào bị làm sai. Bạn phản xạ rất nhạy bén!
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* 6. BOTTOM CTA BAR */}
      <View className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-neutral-100 shadow-xl shadow-black/5 gap-3">
        {!isPerfect && wrongAnswers.length > 0 && (
          <Pressable 
            onPress={handleReviewWrong}
            className="w-full h-14 bg-warning-500 rounded-2xl border-b-[4px] border-warning-700 active:bg-warning-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center flex-row gap-2"
          >
            <AlertTriangleIcon size={20} className="text-white" />
            <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wider">ÔN TẬP TỪ SAI</Text>
          </Pressable>
        )}
        
        <View className="flex-row gap-3">
          <Pressable 
            onPress={handleRetry}
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
              isPerfect ? "text-white" : "text-neutral-700"
            )}>THỬ LẠI</Text>
          </Pressable>

          <Pressable 
            onPress={handleGoHome}
            className="flex-1 h-14 bg-neutral-100 rounded-2xl border-b-[4px] border-neutral-300 active:bg-neutral-200 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center flex-row gap-2"
          >
            <HomeIcon size={18} className="text-neutral-500" />
            <Text className="font-extrabold text-[15px] text-neutral-700 uppercase font-nunito tracking-wide">VỀ HOME</Text>
          </Pressable>
        </View>
      </View>

    </SafeAreaView>
  );
}
