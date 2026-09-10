import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  TouchableOpacity, 
  Animated as RNAnimated, 
  Easing, 
  ScrollView, 
  Modal, 
  Pressable,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  XIcon, 
  Volume2Icon, 
  CheckCircle2Icon, 
  XCircleIcon, 
  SparklesIcon, 
  ArrowRightIcon,
  RotateCcwIcon,
  LogOutIcon,
  HelpCircleIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy, SnapyPose } from '@/components/Snapy';

// ==========================================
// TYPES & QUESTION POOL
// ==========================================
export interface FillBlankQuestion {
  id: string;
  word: string;
  ipa: string;
  beforeBlank: string;
  afterBlank: string;
  fullSentence: string;
  vietnamese: string;
  hint: string;
  options: string[];
}

export interface FillBlankResult {
  score: number;
  total: number;
  xp: number;
  coin: number;
  time: string;
  wrongAnswers: Array<{
    id: string;
    word: string;
    ipa?: string;
    correct: string;
    yours: string;
  }>;
}

const FILL_BLANK_POOL: FillBlankQuestion[] = [
  {
    id: 'fb1',
    word: 'abandon',
    ipa: '/əˈbændən/',
    beforeBlank: 'They had to',
    afterBlank: 'the car in the heavy snow.',
    fullSentence: 'They had to abandon the car in the heavy snow.',
    vietnamese: 'Họ đã phải từ bỏ chiếc xe trong tuyết dày đặc.',
    hint: 'Động từ: từ bỏ, ruồng bỏ',
    options: ['abandon', 'achieve', 'improve', 'departure']
  },
  {
    id: 'fb2',
    word: 'achieve',
    ipa: '/əˈtʃiːv/',
    beforeBlank: 'She worked tirelessly to',
    afterBlank: 'her dream of becoming a pilot.',
    fullSentence: 'She worked tirelessly to achieve her dream of becoming a pilot.',
    vietnamese: 'Cô ấy làm việc không biết mệt mỏi để đạt được ước mơ làm phi công.',
    hint: 'Động từ: đạt được, hoàn thành',
    options: ['achieve', 'abandon', 'delay', 'customs']
  },
  {
    id: 'fb3',
    word: 'boarding pass',
    ipa: '/ˈbɔːrdɪŋ pæs/',
    beforeBlank: 'Please show your',
    afterBlank: 'before entering the airplane.',
    fullSentence: 'Please show your boarding pass before entering the airplane.',
    vietnamese: 'Vui lòng xuất trình thẻ lên máy bay trước khi vào máy bay.',
    hint: 'Danh từ: thẻ lên máy bay',
    options: ['boarding pass', 'luggage', 'passport', 'passenger']
  },
  {
    id: 'fb4',
    word: 'departure',
    ipa: '/dɪˈpɑːrtʃər/',
    beforeBlank: 'The flight',
    afterBlank: 'was delayed due to a thunderstorm.',
    fullSentence: 'The flight departure was delayed due to a thunderstorm.',
    vietnamese: 'Giờ khởi hành của chuyến bay đã bị hoãn do cơn dông.',
    hint: 'Danh từ: sự khởi hành, cất cánh',
    options: ['departure', 'destination', 'itinerary', 'reservation']
  },
  {
    id: 'fb5',
    word: 'destination',
    ipa: '/ˌdestɪˈneɪʃn/',
    beforeBlank: 'Tokyo is our final',
    afterBlank: 'on this summer trip.',
    fullSentence: 'Tokyo is our final destination on this summer trip.',
    vietnamese: 'Tokyo là điểm đến cuối cùng của chúng tôi trong chuyến đi mùa hè này.',
    hint: 'Danh từ: điểm đến, đích đến',
    options: ['destination', 'departure', 'terminal', 'luggage']
  },
  {
    id: 'fb6',
    word: 'improve',
    ipa: '/ɪmˈpruːv/',
    beforeBlank: 'Daily practice will quickly',
    afterBlank: 'your speaking skills.',
    fullSentence: 'Daily practice will quickly improve your speaking skills.',
    vietnamese: 'Luyện tập mỗi ngày sẽ nhanh chóng cải thiện kỹ năng nói của bạn.',
    hint: 'Động từ: cải thiện, nâng cao',
    options: ['improve', 'abandon', 'achieve', 'delay']
  },
  {
    id: 'fb7',
    word: 'luggage',
    ipa: '/ˈlʌɡɪdʒ/',
    beforeBlank: 'Do not leave your',
    afterBlank: 'unattended in the airport lobby.',
    fullSentence: 'Do not leave your luggage unattended in the airport lobby.',
    vietnamese: 'Đừng để hành lý của bạn không có người trông coi ở sảnh sân bay.',
    hint: 'Danh từ: hành lý, vali xách tay',
    options: ['luggage', 'customs', 'boarding pass', 'terminal']
  },
  {
    id: 'fb8',
    word: 'efficient',
    ipa: '/ɪˈfɪʃnt/',
    beforeBlank: 'High-speed trains are a fast and',
    afterBlank: 'way to travel.',
    fullSentence: 'High-speed trains are a fast and efficient way to travel.',
    vietnamese: 'Tàu cao tốc là một phương thức di chuyển nhanh chóng và hiệu quả.',
    hint: 'Tính từ: hiệu quả, năng suất cao',
    options: ['efficient', 'accurate', 'delayed', 'passenger']
  }
];

// Web Audio synthesizer
const playSuccessSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880, now + 0.1); // A5
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  } catch {}
};

const playErrorSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.2);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  } catch {}
};

// Pronunciation with SpeechSynthesis
const speakSentence = (sentence: string) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = 'en-US';
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  }
};

interface FillBlankQuizViewProps {
  count?: number;
  reviewWrong?: boolean;
  wrongData?: string;
  onExit: () => void;
  onComplete: (result: FillBlankResult) => void;
}

export function FillBlankQuizView({
  count = 5,
  reviewWrong = false,
  wrongData,
  onExit,
  onComplete
}: FillBlankQuizViewProps) {
  const { width } = Dimensions.get('window');

  // 1. Prepare questions
  const questions = useMemo<FillBlankQuestion[]>(() => {
    if (reviewWrong && wrongData) {
      try {
        const parsed = JSON.parse(wrongData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any, idx: number) => {
            const found = FILL_BLANK_POOL.find(p => p.word.toLowerCase() === item.word?.toLowerCase());
            if (found) return found;
            return {
              id: `rw_${idx}`,
              word: item.word,
              ipa: item.ipa || '/.../',
              beforeBlank: 'Fill the word:',
              afterBlank: 'in this sentence.',
              fullSentence: `Fill the word ${item.word} in this sentence.`,
              vietnamese: item.correct || 'Từ vựng cần ôn tập',
              hint: `Đáp án: ${item.word}`,
              options: [item.word, 'abandon', 'improve', 'achieve'].sort(() => Math.random() - 0.5)
            };
          });
        }
      } catch {}
    }
    const safeCount = Math.max(3, Math.min(count, FILL_BLANK_POOL.length));
    return FILL_BLANK_POOL.slice(0, safeCount);
  }, [count, reviewWrong, wrongData]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const [checkState, setCheckState] = useState<'IDLE' | 'CORRECT' | 'INCORRECT'>('IDLE');
  const [showHint, setShowHint] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Performance tracking
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<Array<{
    id: string;
    word: string;
    ipa?: string;
    correct: string;
    yours: string;
  }>>([]);
  const startTimeRef = useRef<number>(Date.now());

  // Mascot state
  const [mascotPose, setMascotPose] = useState<SnapyPose>('tap_trung');
  const [mascotAnim, setMascotAnim] = useState<string>('idle');
  const [bubbleText, setBubbleText] = useState('Chọn hoặc gõ từ thích hợp vào chỗ trống!');

  // Animation references
  const slideAnim = useRef(new RNAnimated.Value(0)).current;
  const shakeAnim = useRef(new RNAnimated.Value(0)).current;
  const bottomBarAnim = useRef(new RNAnimated.Value(0)).current;

  const currentQ = questions[currentIndex] || questions[0];

  // Shuffled options for current question
  const shuffledOptions = useMemo(() => {
    return [...currentQ.options].sort(() => Math.random() - 0.5);
  }, [currentQ]);

  // Handle word chip tap
  const handleChipTap = (chipWord: string) => {
    if (checkState !== 'IDLE') return;

    if (inputText.trim().toLowerCase() === chipWord.toLowerCase()) {
      // Deselect chip
      setInputText('');
    } else {
      setInputText(chipWord);
    }
  };

  // Play sentence audio
  const handlePlayAudio = () => {
    setIsSpeaking(true);
    speakSentence(currentQ.fullSentence);
    setTimeout(() => setIsSpeaking(false), 2000);
  };

  // Check Answer
  const handleCheck = () => {
    if (!inputText.trim() || checkState !== 'IDLE') return;

    const isCorrect = inputText.trim().toLowerCase() === currentQ.word.toLowerCase();

    if (isCorrect) {
      playSuccessSound();
      setCheckState('CORRECT');
      setMascotPose('an_mung');
      setMascotAnim('celebrate');
      setBubbleText('Xuất sắc! Bạn đã điền chính xác! 🎉');
      setScore(s => s + 1);

      // Auto pronounce full sentence on correct
      speakSentence(currentQ.fullSentence);
    } else {
      playErrorSound();
      setCheckState('INCORRECT');
      setMascotPose('bat_ngo');
      setMascotAnim('shake');
      setBubbleText('Chưa chính xác rồi! Cùng xem đáp án nhé! 🤔');

      // Record mistake
      setWrongAnswers(prev => [
        ...prev,
        {
          id: currentQ.id,
          word: currentQ.word,
          ipa: currentQ.ipa,
          correct: currentQ.word,
          yours: inputText.trim()
        }
      ]);

      // Shake animation on the card
      shakeAnim.setValue(0);
      RNAnimated.sequence([
        RNAnimated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
        RNAnimated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
        RNAnimated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
        RNAnimated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
        RNAnimated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    }

    // Spring animate bottom drawer
    bottomBarAnim.setValue(0);
    RNAnimated.spring(bottomBarAnim, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true
    }).start();
  };

  // Advance to next question or complete
  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      // Finish Quiz
      const elapsedSecs = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
      const mins = Math.floor(elapsedSecs / 60);
      const secs = elapsedSecs % 60;
      const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      
      const finalScore = score + (checkState === 'CORRECT' ? 0 : 0);
      const totalCount = questions.length;
      const xpEarned = finalScore * 10;
      const coinEarned = finalScore * 5;

      onComplete({
        score: finalScore,
        total: totalCount,
        xp: xpEarned,
        coin: coinEarned,
        time: timeFormatted,
        wrongAnswers
      });
      return;
    }

    // Slide transition
    RNAnimated.timing(slideAnim, {
      toValue: -width,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(prev => prev + 1);
      setInputText('');
      setCheckState('IDLE');
      setShowHint(false);
      setMascotPose('tap_trung');
      setMascotAnim('idle');
      setBubbleText('Chọn hoặc gõ từ thích hợp vào chỗ trống!');
      bottomBarAnim.setValue(0);

      slideAnim.setValue(width);
      RNAnimated.timing(slideAnim, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  };

  const progressPercent = ((currentIndex) / questions.length) * 100;
  const isFilled = inputText.trim().length > 0;

  const translateY = bottomBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [120, 0]
  });

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top', 'bottom']}>
      {/* 1. TOP HEADER & PROGRESS */}
      <View className="px-4 py-3 flex-row items-center justify-between z-10 bg-[#F7F8FA] border-b border-neutral-100">
        <TouchableOpacity 
          onPress={() => setShowExitModal(true)} 
          activeOpacity={0.7}
          className="w-10 h-10 items-center justify-center rounded-full -ml-2"
        >
          <XIcon size={24} className="text-neutral-500" />
        </TouchableOpacity>

        {/* Progress bar */}
        <View className="flex-1 mx-4">
          <View className="h-3.5 bg-neutral-200 rounded-full overflow-hidden w-full">
            <View 
              className="h-full bg-primary-500 rounded-full" 
              style={{ width: `${checkState === 'IDLE' ? progressPercent : ((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </View>
        </View>

        {/* Question Counter */}
        <Text className="font-extrabold text-[15px] text-neutral-600 font-nunito tabular-nums w-14 text-right">
          {currentIndex + 1} / {questions.length}
        </Text>
      </View>

      {/* 2. PLAYGROUND CONTENT */}
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <RNAnimated.View 
          style={{ 
            transform: [{ translateX: slideAnim }],
            flex: 1 
          }}
        >
          {/* MASCOT CHOREOGRAPHY & BUBBLE */}
          <View className="flex-row items-center justify-center gap-3 my-2">
            <View style={{ width: 85, height: 85 }} className="items-center justify-center">
              <Snapy pose={mascotPose} animation={mascotAnim} style={{ width: 85, height: 85 }} />
            </View>
            <View className="flex-1 bg-white px-3.5 py-2.5 rounded-2xl border border-neutral-200">
              <View className="flex-row items-center gap-1.5 mb-0.5">
                <SparklesIcon size={13} className="text-warning-500" />
                <Text className="font-extrabold text-[12px] text-mascot-navy font-nunito">Snapy</Text>
              </View>
              <Text className="font-medium text-[13px] text-neutral-600 font-inter leading-snug">
                {bubbleText}
              </Text>
            </View>
          </View>

          {/* QUESTION CARD */}
          <RNAnimated.View 
            style={{ transform: [{ translateX: shakeAnim }] }}
            className="bg-white rounded-3xl p-5 border-2 border-neutral-200 border-b-[5px] mt-2"
          >
            {/* Vietnamese Meaning Prompt */}
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1 pr-2">
                <Text className="font-bold text-[12px] text-neutral-400 uppercase tracking-wider font-inter mb-1">
                  Dịch nghĩa câu
                </Text>
                <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito leading-snug">
                  "{currentQ.vietnamese}"
                </Text>
              </View>

              <TouchableOpacity 
                onPress={handlePlayAudio}
                activeOpacity={0.7}
                className={cn(
                  "w-10 h-10 rounded-xl items-center justify-center border shrink-0",
                  isSpeaking ? "bg-primary-100 border-primary-300" : "bg-info-50 border-info-200"
                )}
              >
                <Volume2Icon size={20} className={isSpeaking ? "text-primary-600" : "text-info-600"} />
              </TouchableOpacity>
            </View>

            {/* SENTENCE WITH INTERACTIVE BLANK */}
            <View className="bg-[#F7F8FA] p-4 rounded-2xl border border-neutral-200 mb-3 flex-row flex-wrap items-center gap-2">
              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">
                {currentQ.beforeBlank}
              </Text>

              {/* THE BLANK INPUT BOX */}
              <View className={cn(
                "min-w-[120px] px-3 py-1.5 rounded-xl border-2 flex-row items-center justify-center",
                checkState === 'CORRECT' 
                  ? "bg-success-100 border-success-500" 
                  : checkState === 'INCORRECT'
                    ? "bg-error-50 border-error-500"
                    : isFilled
                      ? "bg-primary-50 border-primary-500"
                      : "bg-white border-dashed border-neutral-400"
              )}>
                <TextInput
                  value={inputText}
                  onChangeText={(txt) => {
                    if (checkState === 'IDLE') setInputText(txt);
                  }}
                  editable={checkState === 'IDLE'}
                  placeholder="điền từ..."
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className={cn(
                    "font-extrabold text-[18px] font-nunito text-center",
                    checkState === 'CORRECT' 
                      ? "text-success-800" 
                      : checkState === 'INCORRECT' 
                        ? "text-error-700" 
                        : "text-primary-700"
                  )}
                />
              </View>

              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">
                {currentQ.afterBlank}
              </Text>
            </View>

            {/* HINT TOGGLE */}
            <View className="flex-row items-center justify-between pt-1">
              <TouchableOpacity 
                onPress={() => setShowHint(!showHint)}
                className="flex-row items-center gap-1.5 py-1"
              >
                <HelpCircleIcon size={16} className="text-warning-600" />
                <Text className="font-bold text-[13px] text-warning-700 font-inter">
                  {showHint ? 'Ẩn gợi ý' : 'Xem gợi ý từ loại'}
                </Text>
              </TouchableOpacity>

              <Text className="font-medium text-[13px] text-neutral-400 font-inter">
                {currentQ.ipa}
              </Text>
            </View>

            {showHint && (
              <View className="mt-2.5 bg-warning-50 p-2.5 rounded-xl border border-warning-200">
                <Text className="font-medium text-[13px] text-warning-800 font-inter">
                  💡 {currentQ.hint}
                </Text>
              </View>
            )}
          </RNAnimated.View>

          {/* 3. WORD BANK (DUOLINGO STYLE WORD CHIPS) */}
          <View className="mt-6">
            <Text className="font-extrabold text-[13px] text-neutral-400 uppercase tracking-wider font-inter mb-3 text-center">
              Ngân hàng từ vựng gợi ý (Chạm để điền)
            </Text>

            <View className="flex-row flex-wrap justify-center gap-2.5">
              {shuffledOptions.map((opt) => {
                const isSelected = inputText.trim().toLowerCase() === opt.toLowerCase();
                const isSubmitted = checkState !== 'IDLE';

                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => handleChipTap(opt)}
                    disabled={isSubmitted}
                    activeOpacity={0.8}
                    style={isSelected ? { transform: [{ translateY: -2 }] } : undefined}
                    className={cn(
                      "px-4 py-3 rounded-2xl border-2",
                      isSelected 
                        ? "bg-primary-500 border-primary-700 border-b-[4px]" 
                        : "bg-white border-neutral-200 border-b-[4px]"
                    )}
                  >
                    <Text className={cn(
                      "font-extrabold text-[16px] font-nunito",
                      isSelected ? "text-white" : "text-mascot-navy"
                    )}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </RNAnimated.View>
      </ScrollView>

      {/* 4. BOTTOM ACTION & FEEDBACK DRAWER */}
      {checkState === 'IDLE' ? (
        <View className="p-5 bg-white border-t border-neutral-200">
          <TouchableOpacity 
            onPress={handleCheck}
            disabled={!isFilled}
            activeOpacity={0.85}
            style={!isFilled ? { opacity: 0.8 } : undefined}
            className={cn(
              "w-full h-14 rounded-2xl items-center justify-center",
              isFilled 
                ? "bg-primary-500 border-b-[4px] border-primary-700" 
                : "bg-neutral-200 border-b-[4px] border-neutral-300"
            )}
          >
            <Text className={cn(
              "font-extrabold text-[16px] uppercase font-nunito tracking-wider",
              isFilled ? "text-white" : "text-neutral-400"
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
                    <CheckCircle2Icon size={26} className="text-success-500" />
                  ) : (
                    <XCircleIcon size={26} className="text-error-500" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className={cn(
                    "font-extrabold text-[19px] font-nunito",
                    checkState === 'CORRECT' ? "text-success-700" : "text-error-700"
                  )}>
                    {checkState === 'CORRECT' ? 'Chính xác! Rất giỏi! 🎯' : 'Chưa chính xác!'}
                  </Text>
                  {checkState === 'INCORRECT' && (
                    <Text className="font-bold text-[14px] text-error-600 font-inter mt-0.5">
                      Từ đúng: <Text className="font-extrabold text-error-800">{currentQ.word}</Text>
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

      {/* 5. EXIT MODAL */}
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
          <View className="w-full max-w-sm bg-white rounded-3xl p-6 items-center border border-neutral-200">
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
