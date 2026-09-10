import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, Animated as RNAnimated, Dimensions, Easing, ScrollView, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  XIcon, 
  Volume2Icon, 
  CheckIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowRightIcon,
  LogOutIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy, SnapyPose } from '@/components/Snapy';

// ==========================================
// TYPES & QUESTION BANK
// ==========================================
type CheckState = 'IDLE' | 'CORRECT' | 'INCORRECT';

export interface QuestionItem {
  id: string;
  word: string;
  ipa: string;
  correctText: string;
  correctId: string;
  options: { id: string; text: string }[];
}

export const QUESTION_POOL: QuestionItem[] = [
  {
    id: 'q1',
    word: 'abandon',
    ipa: '/əˈbændən/',
    correctText: 'Từ bỏ, ruồng bỏ',
    correctId: 'opt2',
    options: [
      { id: 'opt1', text: 'Cải thiện, phát triển' },
      { id: 'opt2', text: 'Từ bỏ, ruồng bỏ' },
      { id: 'opt3', text: 'Đạt được thành tích' },
      { id: 'opt4', text: 'Trì hoãn, hoãn lại' },
    ]
  },
  {
    id: 'q2',
    word: 'achieve',
    ipa: '/əˈtʃiːv/',
    correctText: 'Đạt được, hoàn thành',
    correctId: 'opt3',
    options: [
      { id: 'opt1', text: 'Bảo vệ, gìn giữ' },
      { id: 'opt2', text: 'Phát hiện ra' },
      { id: 'opt3', text: 'Đạt được, hoàn thành' },
      { id: 'opt4', text: 'Thất bại hoàn toàn' },
    ]
  },
  {
    id: 'q3',
    word: 'boarding pass',
    ipa: '/ˈbɔːrdɪŋ pæs/',
    correctText: 'Thẻ lên máy bay',
    correctId: 'opt1',
    options: [
      { id: 'opt1', text: 'Thẻ lên máy bay' },
      { id: 'opt2', text: 'Hộ chiếu xuất cảnh' },
      { id: 'opt3', text: 'Hóa đơn hành lý' },
      { id: 'opt4', text: 'Thẻ căn cước công dân' },
    ]
  },
  {
    id: 'q4',
    word: 'departure',
    ipa: '/dɪˈpɑːrtʃər/',
    correctText: 'Sự khởi hành, xuất phát',
    correctId: 'opt3',
    options: [
      { id: 'opt1', text: 'Sự chậm trễ' },
      { id: 'opt2', text: 'Nơi hạ cánh' },
      { id: 'opt3', text: 'Sự khởi hành, xuất phát' },
      { id: 'opt4', text: 'Sự hoãn lại' },
    ]
  },
  {
    id: 'q5',
    word: 'destination',
    ipa: '/ˌdestɪˈneɪʃn/',
    correctText: 'Điểm đến, đích đến',
    correctId: 'opt4',
    options: [
      { id: 'opt1', text: 'Khoảng cách hành trình' },
      { id: 'opt2', text: 'Phương tiện vận chuyển' },
      { id: 'opt3', text: 'Thời gian bay' },
      { id: 'opt4', text: 'Điểm đến, đích đến' },
    ]
  },
  {
    id: 'q6',
    word: 'improve',
    ipa: '/ɪmˈpruːv/',
    correctText: 'Cải thiện, nâng cao',
    correctId: 'opt1',
    options: [
      { id: 'opt1', text: 'Cải thiện, nâng cao' },
      { id: 'opt2', text: 'Từ bỏ cơ hội' },
      { id: 'opt3', text: 'Gặp gỡ trao đổi' },
      { id: 'opt4', text: 'Ghi chép cẩn thận' },
    ]
  },
  {
    id: 'q7',
    word: 'luggage',
    ipa: '/ˈlʌɡɪdʒ/',
    correctText: 'Hành lý, đồ đạc xách tay',
    correctId: 'opt2',
    options: [
      { id: 'opt1', text: 'Ghế ngồi hạng thương gia' },
      { id: 'opt2', text: 'Hành lý, đồ đạc xách tay' },
      { id: 'opt3', text: 'Cửa ra máy bay' },
      { id: 'opt4', text: 'Phiếu thanh toán' },
    ]
  },
  {
    id: 'q8',
    word: 'efficient',
    ipa: '/ɪˈfɪʃnt/',
    correctText: 'Hiệu quả, năng suất',
    correctId: 'opt3',
    options: [
      { id: 'opt1', text: 'Tốn kém, lãng phí' },
      { id: 'opt2', text: 'Khó khăn, phức tạp' },
      { id: 'opt3', text: 'Hiệu quả, năng suất' },
      { id: 'opt4', text: 'Chậm chạp, trì trệ' },
    ]
  }
];

export interface MultipleChoiceResult {
  score: number;
  total: number;
  xp: number;
  coin: number;
  time: string;
  deckId: string;
  mode: string;
  wrongAnswers: Array<{
    id: string;
    word: string;
    ipa: string;
    correct: string;
    yours: string;
  }>;
}

export interface MultipleChoiceQuizViewProps {
  deckId?: string;
  count?: number;
  reviewWrong?: boolean;
  wrongData?: string;
  onExit: () => void;
  onComplete: (result: MultipleChoiceResult) => void;
}

export function MultipleChoiceQuizView({
  deckId = 'd1',
  count = 5,
  reviewWrong = false,
  wrongData,
  onExit,
  onComplete
}: MultipleChoiceQuizViewProps) {
  // Determine questions list
  const questions = useMemo<QuestionItem[]>(() => {
    if (reviewWrong && wrongData) {
      try {
        const parsed = JSON.parse(wrongData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any, idx: number) => ({
            id: `rw_${idx}`,
            word: item.word,
            ipa: item.ipa || '/.../',
            correctText: item.correct,
            correctId: 'opt1',
            options: [
              { id: 'opt1', text: item.correct },
              { id: 'opt2', text: 'Từ bỏ' },
              { id: 'opt3', text: 'Cải thiện' },
              { id: 'opt4', text: 'Đạt được' },
            ].sort(() => Math.random() - 0.5)
          }));
        }
      } catch {
        // fallback to standard pool
      }
    }

    const reqCount = Math.min(Math.max(count, 3), QUESTION_POOL.length);
    return QUESTION_POOL.slice(0, reqCount);
  }, [count, reviewWrong, wrongData]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [checkState, setCheckState] = useState<CheckState>('IDLE');
  const [mascotPose, setMascotPose] = useState<SnapyPose>('tap_trung');
  const [mascotAnim, setMascotAnim] = useState<string>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Score & Performance Tracking
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<Array<{
    id: string;
    word: string;
    ipa: string;
    correct: string;
    yours: string;
  }>>([]);
  const startTimeRef = useRef<number>(Date.now());

  // Animations
  const bottomBarAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(0)).current;
  const { width } = Dimensions.get('window');

  // Entrance Choreography Animations
  const mascotTranslateY = useRef(new RNAnimated.Value(150)).current;
  const mascotScaleX = useRef(new RNAnimated.Value(1)).current;
  const mascotScaleY = useRef(new RNAnimated.Value(1)).current;
  const contentOpacity = useRef(new RNAnimated.Value(0)).current;
  const contentTranslateY = useRef(new RNAnimated.Value(15)).current;
  const optionsAnims = useRef(QUESTION_POOL[0].options.map(() => new RNAnimated.Value(0))).current;

  // Web Speech API Pronunciation
  const playPronunciation = (word: string) => {
    setIsSpeaking(true);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 800);
    }
  };

  useEffect(() => {
    // Entrance Sequence
    const delay = RNAnimated.delay(300);

    const squash = RNAnimated.parallel([
      RNAnimated.timing(mascotScaleX, { toValue: 1.2, duration: 120, useNativeDriver: true }),
      RNAnimated.timing(mascotScaleY, { toValue: 0.8, duration: 120, useNativeDriver: true }),
    ]);

    const jump = RNAnimated.parallel([
      RNAnimated.timing(mascotTranslateY, { toValue: 0, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      RNAnimated.timing(mascotScaleX, { toValue: 0.9, duration: 180, useNativeDriver: true }),
      RNAnimated.timing(mascotScaleY, { toValue: 1.1, duration: 180, useNativeDriver: true }),
    ]);

    const settle = RNAnimated.parallel([
      RNAnimated.spring(mascotScaleX, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
      RNAnimated.spring(mascotScaleY, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
    ]);

    const revealQuestion = RNAnimated.parallel([
      RNAnimated.timing(contentOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      RNAnimated.timing(contentTranslateY, { toValue: 0, duration: 250, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]);

    const revealOptions = RNAnimated.stagger(60, optionsAnims.map(anim => 
      RNAnimated.timing(anim, { toValue: 1, duration: 250, useNativeDriver: true })
    ));

    RNAnimated.sequence([
      delay,
      squash,
      jump,
      settle,
      RNAnimated.parallel([revealQuestion, revealOptions])
    ]).start();
  }, []);

  const currentQ = questions[currentIndex] || questions[0];
  const progressPercent = ((currentIndex) / questions.length) * 100;

  const handleCheck = () => {
    if (!selectedOpt || checkState !== 'IDLE') return;

    const isCorrect = selectedOpt === currentQ.correctId;
    setCheckState(isCorrect ? 'CORRECT' : 'INCORRECT');
    setMascotPose(isCorrect ? 'nhay_len' : 'bat_ngo');
    setMascotAnim(isCorrect ? 'celebrate' : 'shake');

    if (isCorrect) {
      setScore(s => s + 1);
    } else {
      const chosen = currentQ.options.find(o => o.id === selectedOpt)?.text || '';
      setWrongAnswers(prev => [
        ...prev,
        {
          id: currentQ.id,
          word: currentQ.word,
          ipa: currentQ.ipa,
          correct: currentQ.correctText,
          yours: chosen
        }
      ]);
    }

    // Mascot reaction bounce
    RNAnimated.sequence([
      RNAnimated.timing(mascotScaleY, { toValue: 0.88, duration: 90, useNativeDriver: true }),
      RNAnimated.spring(mascotScaleY, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true })
    ]).start();

    // Spring bottom bar
    bottomBarAnim.setValue(0);
    RNAnimated.spring(bottomBarAnim, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true
    }).start();
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      // Calculate final summary
      const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
      const mins = Math.floor(elapsedSeconds / 60);
      const secs = elapsedSeconds % 60;
      const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      const finalScore = score;
      const totalQuestions = questions.length;
      const xpEarned = finalScore * 10;
      const coinEarned = finalScore * 5;

      onComplete({
        score: finalScore,
        total: totalQuestions,
        xp: xpEarned,
        coin: coinEarned,
        time: timeFormatted,
        deckId,
        mode: 'MULTIPLE_CHOICE',
        wrongAnswers
      });
      return;
    }

    // Slide out current question
    RNAnimated.timing(slideAnim, {
      toValue: -width,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      // Update state
      setCurrentIndex(prev => prev + 1);
      setSelectedOpt(null);
      setCheckState('IDLE');
      setMascotPose('tap_trung');
      setMascotAnim('idle');
      bottomBarAnim.setValue(0);
      
      // Slide in new question
      slideAnim.setValue(width);
      RNAnimated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  };

  const translateY = bottomBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [120, 0] 
  });

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top', 'bottom']}>
      
      {/* 1. TOP PROGRESS BAR */}
      <RNAnimated.View style={{ opacity: contentOpacity }}>
        <View className="px-4 py-3 flex-row items-center justify-between z-10 bg-[#F7F8FA] border-b border-neutral-100">
          <TouchableOpacity 
            onPress={() => setShowExitModal(true)} 
            activeOpacity={0.7}
            className="w-10 h-10 items-center justify-center rounded-full -ml-2"
          >
            <XIcon size={24} className="text-neutral-500" />
          </TouchableOpacity>
          
          <View className="flex-1 mx-4">
            <View className="h-3 bg-neutral-200 rounded-full overflow-hidden w-full">
              <View 
                className="h-full bg-primary-500 rounded-full" 
                style={{ width: `${checkState === 'IDLE' ? progressPercent : ((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </View>
          </View>

          <Text className="font-extrabold text-[15px] text-neutral-500 font-nunito tabular-nums w-14 text-right">
            {currentIndex + 1} / {questions.length}
          </Text>
        </View>
      </RNAnimated.View>

      {/* 2. QUESTION & OPTIONS AREA */}
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <RNAnimated.View style={{ transform: [{ translateX: slideAnim }], flex: 1 }}>
          
          {/* MASCOT CHOREOGRAPHY */}
          <RNAnimated.View 
            style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              marginVertical: 6, 
              zIndex: 10,
              transform: [
                { translateY: mascotTranslateY },
                { scaleX: mascotScaleX },
                { scaleY: mascotScaleY }
              ] 
            }}
          >
            <View style={{ width: 105, height: 105, alignItems: 'center', justifyContent: 'center' }}>
              <Snapy pose={mascotPose} animation={mascotAnim} style={{ width: 105, height: 105 }} />
            </View>
          </RNAnimated.View>

          {/* QUESTION TEXT */}
          <RNAnimated.View style={{ opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }}>
            <Text className="font-bold text-[14px] text-neutral-400 font-inter mb-2 uppercase tracking-wide">
              Chọn nghĩa đúng của từ
            </Text>
            
            <View className="flex-row items-center justify-between mb-1.5 bg-white p-4 rounded-2xl border-2 border-neutral-100">
              <View className="flex-1 pr-2">
                <Text className="font-extrabold text-[30px] text-mascot-navy font-nunito leading-tight">
                  {currentQ.word}
                </Text>
                <Text className="font-medium text-[15px] text-neutral-400 font-inter mt-0.5">
                  {currentQ.ipa}
                </Text>
              </View>
              
              <TouchableOpacity 
                onPress={() => playPronunciation(currentQ.word)}
                activeOpacity={0.7}
                className={cn(
                  "w-12 h-12 rounded-2xl items-center justify-center border",
                  isSpeaking 
                    ? "bg-primary-100 border-primary-300 scale-105" 
                    : "bg-info-50 border-info-200"
                )}
              >
                <Volume2Icon size={24} className={isSpeaking ? "text-primary-600" : "text-info-500"} />
              </TouchableOpacity>
            </View>
          </RNAnimated.View>

          {/* 3. ANSWER OPTIONS */}
          <View className="gap-3 mt-4">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOpt === opt.id;
              const isSubmitted = checkState !== 'IDLE';
              const isCorrectOption = opt.id === currentQ.correctId;

              let containerStyle = "bg-white border-neutral-200 border-b-[4px]";
              let textStyle = "text-mascot-navy";

              if (isSubmitted) {
                containerStyle = "bg-white border-neutral-200 border-b-[3px] opacity-40";
                if (isSelected && checkState === 'CORRECT') {
                  containerStyle = "bg-success-50 border-success-500 border-b-[4px] opacity-100";
                  textStyle = "text-success-800";
                } else if (isSelected && checkState === 'INCORRECT') {
                  containerStyle = "bg-error-50 border-error-500 border-b-[4px] opacity-100";
                  textStyle = "text-error-800";
                } else if (isCorrectOption && checkState === 'INCORRECT') {
                  containerStyle = "bg-success-50 border-success-500 border-b-[4px] opacity-100";
                  textStyle = "text-success-800";
                }
              } else if (isSelected) {
                containerStyle = "bg-primary-50 border-primary-500 border-b-[4px]";
                textStyle = "text-primary-800";
              }

              const animVal = optionsAnims[idx] || new RNAnimated.Value(1);

              return (
                <RNAnimated.View 
                  key={opt.id}
                  style={{ 
                    opacity: animVal, 
                    transform: [{ 
                      translateY: animVal.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) 
                    }] 
                  }}
                >
                  <TouchableOpacity 
                    onPress={() => !isSubmitted && setSelectedOpt(opt.id)}
                    disabled={isSubmitted}
                    activeOpacity={0.85}
                    className={cn(
                      "rounded-2xl p-4 border-2 flex-row items-center",
                      containerStyle
                    )}
                  >
                    <View className={cn(
                      "w-7 h-7 rounded-lg border-2 items-center justify-center mr-3",
                      isSelected && !isSubmitted
                        ? "bg-primary-500 border-primary-500" 
                        : isSubmitted && isSelected && checkState === 'CORRECT'
                          ? "bg-success-500 border-success-500"
                          : isSubmitted && isSelected && checkState === 'INCORRECT'
                            ? "bg-error-500 border-error-500"
                            : isSubmitted && isCorrectOption
                              ? "bg-success-500 border-success-500"
                              : "border-neutral-200 bg-neutral-50"
                    )}>
                      {isSelected && !isSubmitted && (
                        <CheckIcon size={14} className="text-white" />
                      )}
                      {isSubmitted && isSelected && checkState === 'CORRECT' && (
                        <CheckCircleIcon size={16} className="text-white" />
                      )}
                      {isSubmitted && isSelected && checkState === 'INCORRECT' && (
                        <XCircleIcon size={16} className="text-white" />
                      )}
                      {isSubmitted && !isSelected && isCorrectOption && checkState === 'INCORRECT' && (
                        <CheckCircleIcon size={16} className="text-white" />
                      )}
                      {!isSelected && !isSubmitted && (
                        <Text className="font-bold text-[12px] text-neutral-400">{String.fromCharCode(65 + idx)}</Text>
                      )}
                    </View>

                    <Text className={cn("font-bold text-[15px] font-inter flex-1", textStyle)}>
                      {opt.text}
                    </Text>
                  </TouchableOpacity>
                </RNAnimated.View>
              );
            })}
          </View>

        </RNAnimated.View>
      </ScrollView>

      {/* 4. BOTTOM ACTION & FEEDBACK BAR */}
      <RNAnimated.View style={{ opacity: contentOpacity }}>
        {checkState === 'IDLE' ? (
          <View className="p-5 bg-white border-t border-neutral-200">
            <TouchableOpacity 
              onPress={handleCheck}
              disabled={!selectedOpt}
              activeOpacity={0.85}
              style={!selectedOpt ? { opacity: 0.8 } : undefined}
              className={cn(
                "w-full h-14 rounded-2xl items-center justify-center",
                selectedOpt 
                  ? "bg-primary-500 border-b-[4px] border-primary-700" 
                  : "bg-neutral-200 border-b-[4px] border-neutral-300"
              )}
            >
              <Text className={cn(
                "font-extrabold text-[16px] uppercase font-nunito tracking-wider",
                selectedOpt ? "text-white" : "text-neutral-400"
              )}>
                KIỂM TRA
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <RNAnimated.View style={{ transform: [{ translateY }] }}>
            <View className={cn(
              "p-5 border-t-2",
              checkState === 'CORRECT' ? "bg-success-50 border-success-200" : "bg-error-50 border-error-200"
            )}>
              <View className="flex-row items-start justify-between mb-4">
                <View className="flex-row items-center gap-3 flex-1 pr-2">
                  <View className={cn(
                    "w-11 h-11 rounded-2xl items-center justify-center border",
                    checkState === 'CORRECT' ? "bg-white border-success-200" : "bg-white border-error-200"
                  )}>
                    {checkState === 'CORRECT' ? (
                      <CheckCircleIcon size={26} className="text-success-500" />
                    ) : (
                      <XCircleIcon size={26} className="text-error-500" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className={cn(
                      "font-extrabold text-[19px] font-nunito",
                      checkState === 'CORRECT' ? "text-success-700" : "text-error-700"
                    )}>
                      {checkState === 'CORRECT' ? 'Chính xác! Rất tuyệt! 🎯' : 'Chưa đúng rồi!'}
                    </Text>
                    {checkState === 'INCORRECT' && (
                      <Text className="font-bold text-[13px] text-error-600 font-inter mt-0.5">
                        Đáp án: <Text className="font-extrabold">{currentQ.correctText}</Text>
                      </Text>
                    )}
                  </View>
                </View>
                {checkState === 'CORRECT' && (
                  <View className="bg-warning-100 px-2.5 py-1 rounded-xl border border-warning-300">
                    <Text className="font-extrabold text-[14px] text-warning-700 font-nunito">+10 XP</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity 
                onPress={handleNext}
                activeOpacity={0.85}
                className={cn(
                  "w-full h-14 rounded-2xl border-b-[4px] items-center justify-center flex-row gap-2",
                  checkState === 'CORRECT' 
                    ? "bg-success-500 border-success-700" 
                    : "bg-error-500 border-error-700"
                )}
              >
                <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wider">
                  {currentIndex + 1 >= questions.length ? 'XEM KẾT QUẢ' : 'TIẾP TỤC'}
                </Text>
                <ArrowRightIcon size={20} className="text-white" />
              </TouchableOpacity>
            </View>
          </RNAnimated.View>
        )}
      </RNAnimated.View>

      {/* 5. MODAL XÁC NHẬN THOÁT AN TOÀN */}
      <Modal
        visible={showExitModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExitModal(false)}
      >
        <View 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          className="flex-1 items-center justify-center p-6"
        >
          <View className="w-full max-w-sm bg-white rounded-3xl p-6 items-center">
            <Snapy pose="suy_nghi" animation="idle" style={{ width: 100, height: 100 }} className="mb-3" />
            
            <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito text-center mb-1.5">
              Bạn muốn dừng bài Quiz?
            </Text>
            <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center mb-6 px-2">
              Tiến độ làm bài và điểm số trong lượt này sẽ không được lưu.
            </Text>

            <View className="w-full gap-3">
              <Pressable
                onPress={() => setShowExitModal(false)}
                className="w-full h-12 bg-primary-500 rounded-xl border-b-[3px] border-primary-700 items-center justify-center"
              >
                <Text className="font-extrabold text-[15px] text-white uppercase font-nunito">TIẾP TỤC LÀM BÀI</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setShowExitModal(false);
                  onExit();
                }}
                className="w-full h-12 bg-neutral-100 rounded-xl border-b-[3px] border-neutral-300 items-center justify-center flex-row gap-2"
              >
                <LogOutIcon size={16} className="text-neutral-500" />
                <Text className="font-bold text-[14px] text-neutral-600 font-nunito uppercase">THOÁT QUIZ</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
