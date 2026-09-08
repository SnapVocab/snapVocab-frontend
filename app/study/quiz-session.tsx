import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated as RNAnimated, Dimensions, Easing, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { XIcon, Volume2Icon, CheckIcon, CheckCircleIcon, XCircleIcon, ArrowRightIcon } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy, SnapyPose } from '@/components/Snapy';

// ==========================================
// TYPES & MOCK DATA
// ==========================================
type CheckState = 'IDLE' | 'CORRECT' | 'INCORRECT';

const MOCK_QUESTIONS = [
  {
    id: 'q1',
    word: 'abandon',
    ipa: '/əˈbændən/',
    correctId: 'opt2',
    options: [
      { id: 'opt1', text: 'Cải thiện' },
      { id: 'opt2', text: 'Từ bỏ' },
      { id: 'opt3', text: 'Đạt được' },
      { id: 'opt4', text: 'Trì hoãn' },
    ]
  },
  {
    id: 'q2',
    word: 'achieve',
    ipa: '/əˈtʃiːv/',
    correctId: 'opt3',
    options: [
      { id: 'opt1', text: 'Bảo vệ' },
      { id: 'opt2', text: 'Phát hiện' },
      { id: 'opt3', text: 'Đạt được' },
      { id: 'opt4', text: 'Thất bại' },
    ]
  },
  {
    id: 'q3',
    word: 'improve',
    ipa: '/ɪmˈpruːv/',
    correctId: 'opt1',
    options: [
      { id: 'opt1', text: 'Cải thiện' },
      { id: 'opt2', text: 'Từ chối' },
      { id: 'opt3', text: 'Chấp nhận' },
      { id: 'opt4', text: 'Xóa bỏ' },
    ]
  }
];

export default function QuizSessionScreen() {
  const params = useLocalSearchParams(); 
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [checkState, setCheckState] = useState<CheckState>('IDLE');
  const [mascotPose, setMascotPose] = useState<SnapyPose>('tap_trung');
  const [mascotAnim, setMascotAnim] = useState<string>('idle');
  
  // Animations
  const bottomBarAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(0)).current;
  const { width } = Dimensions.get('window');

  // Entrance Choreography Animations
  const mascotTranslateY = useRef(new RNAnimated.Value(250)).current;
  const mascotScaleX = useRef(new RNAnimated.Value(1)).current;
  const mascotScaleY = useRef(new RNAnimated.Value(1)).current;
  const contentOpacity = useRef(new RNAnimated.Value(0)).current;
  const contentTranslateY = useRef(new RNAnimated.Value(20)).current;
  const optionsAnims = useRef(MOCK_QUESTIONS[0].options.map(() => new RNAnimated.Value(0))).current;

  useEffect(() => {
    // Phase 1: Idle delay
    const delay = RNAnimated.delay(600);

    // Phase 2: Squash
    const squash = RNAnimated.parallel([
      RNAnimated.timing(mascotScaleX, { toValue: 1.25, duration: 150, useNativeDriver: true }),
      RNAnimated.timing(mascotScaleY, { toValue: 0.75, duration: 150, useNativeDriver: true }),
    ]);

    // Phase 3: Jump & Stretch
    const jump = RNAnimated.parallel([
      RNAnimated.timing(mascotTranslateY, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      RNAnimated.timing(mascotScaleX, { toValue: 0.85, duration: 200, useNativeDriver: true }),
      RNAnimated.timing(mascotScaleY, { toValue: 1.15, duration: 200, useNativeDriver: true }),
    ]);

    // Phase 4: Settle
    const settle = RNAnimated.parallel([
      RNAnimated.spring(mascotScaleX, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }),
      RNAnimated.spring(mascotScaleY, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }),
    ]);

    // Phase 5: Reveal Content
    const revealQuestion = RNAnimated.parallel([
      RNAnimated.timing(contentOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      RNAnimated.timing(contentTranslateY, { toValue: 0, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]);

    const revealOptions = RNAnimated.stagger(100, optionsAnims.map(anim => 
      RNAnimated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true })
    ));

    RNAnimated.sequence([
      delay,
      squash,
      jump,
      settle,
      RNAnimated.parallel([revealQuestion, revealOptions])
    ]).start();
  }, []);

  const currentQ = MOCK_QUESTIONS[currentIndex];
  const progressPercent = ((currentIndex) / MOCK_QUESTIONS.length) * 100;

  const handleClose = () => {
    Alert.alert(
      "Thoát Quiz?",
      "Tiến độ hiện tại sẽ không được lưu.",
      [
        { text: "Tiếp tục làm", style: "cancel" },
        { text: "Thoát", style: "destructive", onPress: () => router.back() }
      ]
    );
  };

  const handleCheck = () => {
    if (!selectedOpt || checkState !== 'IDLE') return;

    const isCorrect = selectedOpt === currentQ.correctId;
    setCheckState(isCorrect ? 'CORRECT' : 'INCORRECT');
    setMascotPose(isCorrect ? 'nhay_len' : 'bat_ngo');
    setMascotAnim(isCorrect ? 'celebrate' : 'shake');

    // Mascot reaction bounce
    RNAnimated.sequence([
      RNAnimated.timing(mascotScaleY, { toValue: 0.85, duration: 100, useNativeDriver: true }),
      RNAnimated.spring(mascotScaleY, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true })
    ]).start();

    // Bounce animation for bottom bar
    bottomBarAnim.setValue(0);
    RNAnimated.spring(bottomBarAnim, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true
    }).start();
  };

  const handleNext = () => {
    if (currentIndex + 1 >= MOCK_QUESTIONS.length) {
      router.replace('/study/quiz-result');
      return;
    }

    // Slide out current question
    RNAnimated.timing(slideAnim, {
      toValue: -width,
      duration: 250,
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
        duration: 250,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  };

  const translateY = bottomBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0] 
  });

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top', 'bottom']}>
      
      {/* 1. TOP BAR */}
      <RNAnimated.View style={{ opacity: contentOpacity }}>
        <View className="px-4 py-3 flex-row items-center justify-between z-10 bg-[#F7F8FA]">
          <TouchableOpacity 
            onPress={handleClose} 
            activeOpacity={0.7}
            className="w-10 h-10 items-center justify-center rounded-full -ml-2"
          >
            <XIcon size={24} className="text-neutral-500" />
          </TouchableOpacity>
          
          <View className="flex-1 mx-4">
            <View className="h-3 bg-neutral-200 rounded-full overflow-hidden w-full">
              <View 
                className="h-full bg-primary-500 rounded-full transition-all duration-300" 
                style={{ width: `${checkState === 'IDLE' ? progressPercent : ((currentIndex + 1) / MOCK_QUESTIONS.length) * 100}%` }}
              />
            </View>
          </View>

          <Text className="font-extrabold text-[15px] text-neutral-500 font-nunito tabular-nums w-14 text-right">
            {currentIndex + 1} / {MOCK_QUESTIONS.length}
          </Text>
        </View>
      </RNAnimated.View>

      {/* 2. QUESTION AREA */}
      <RNAnimated.View 
        style={{ transform: [{ translateX: slideAnim }], flex: 1, paddingTop: 8, paddingHorizontal: 20 }} 
      >
        {/* MASCOT CHOREOGRAPHY */}
        <RNAnimated.View 
          style={{ 
            alignItems: 'center', marginBottom: 16, zIndex: 10,
            transform: [
              { translateY: mascotTranslateY },
              { scaleX: mascotScaleX },
              { scaleY: mascotScaleY }
            ] 
          }}
        >
          <Snapy pose={mascotPose} animation={mascotAnim} className="w-[120px] h-[120px]" />
        </RNAnimated.View>

        {/* QUESTION TEXT */}
        <RNAnimated.View style={{ opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }}>
          <Text className="font-bold text-[15px] text-neutral-500 font-inter mb-4">Chọn nghĩa đúng</Text>
          
          <View className="flex-row items-start justify-between mb-2">
            <Text className="font-extrabold text-[36px] text-mascot-navy font-nunito leading-tight flex-1">
              {currentQ.word}
            </Text>
            <TouchableOpacity 
              activeOpacity={0.7}
              className="w-12 h-12 bg-info-50 rounded-full items-center justify-center ml-4"
            >
              <Volume2Icon size={24} className="text-info-500" />
            </TouchableOpacity>
          </View>
          
          <Text className="font-medium text-[16px] text-neutral-400 font-inter mb-8">
            {currentQ.ipa}
          </Text>
          <Text className="font-bold text-[16px] text-mascot-navy font-inter mb-6">Nghĩa của từ này là gì?</Text>
        </RNAnimated.View>

        {/* 3. ANSWER OPTIONS */}
        <View className="gap-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOpt === opt.id;
            const isSubmitted = checkState !== 'IDLE';
            const isCorrectOption = opt.id === currentQ.correctId;

            let containerStyle = "bg-white border-neutral-200";
            let textStyle = "text-mascot-navy";

            if (isSubmitted) {
              containerStyle = "bg-white border-neutral-200 opacity-50";
              if (isSelected && checkState === 'CORRECT') {
                containerStyle = "bg-success-50 border-success-500 opacity-100";
                textStyle = "text-success-700";
              } else if (isSelected && checkState === 'INCORRECT') {
                containerStyle = "bg-error-50 border-error-500 opacity-100";
                textStyle = "text-error-700";
              } else if (isCorrectOption && checkState === 'INCORRECT') {
                containerStyle = "bg-success-50 border-success-500 opacity-100";
                textStyle = "text-success-700";
              }
            } else if (isSelected) {
              containerStyle = "bg-primary-50 border-primary-500 border-b-[4px]";
              textStyle = "text-primary-700";
            } else {
              containerStyle = "bg-white border-neutral-200 border-b-[4px]";
            }

            const animVal = optionsAnims[idx] || new RNAnimated.Value(1);

            return (
              <RNAnimated.View 
                key={opt.id}
                style={{ 
                  opacity: animVal, 
                  transform: [{ 
                    translateY: animVal.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) 
                  }] 
                }}
              >
                <TouchableOpacity 
                  onPress={() => !isSubmitted && setSelectedOpt(opt.id)}
                  disabled={isSubmitted}
                  activeOpacity={0.9}
                  className={cn(
                    "rounded-[16px] p-4 border-2 transition-all flex-row items-center",
                    containerStyle
                  )}
                >
                  <Text className={cn("font-bold text-[16px] font-inter flex-1", textStyle)}>
                    {opt.text}
                  </Text>
                  
                  {isSelected && !isSubmitted && (
                    <View className="w-6 h-6 rounded-full bg-primary-500 items-center justify-center">
                      <CheckIcon size={14} className="text-white" />
                    </View>
                  )}
                  
                  {isSubmitted && isSelected && checkState === 'CORRECT' && (
                    <CheckCircleIcon size={24} className="text-success-500" />
                  )}
                  {isSubmitted && isSelected && checkState === 'INCORRECT' && (
                    <XCircleIcon size={24} className="text-error-500" />
                  )}
                  {isSubmitted && !isSelected && isCorrectOption && checkState === 'INCORRECT' && (
                    <CheckCircleIcon size={24} className="text-success-500" />
                  )}
                </TouchableOpacity>
              </RNAnimated.View>
            );
          })}
        </View>
      </RNAnimated.View>

      {/* 4. BOTTOM BAR */}
      <RNAnimated.View style={{ opacity: contentOpacity }}>
        {checkState === 'IDLE' ? (
          <View className="p-5 bg-white border-t border-neutral-100">
            <TouchableOpacity 
              onPress={handleCheck}
              disabled={!selectedOpt}
              activeOpacity={0.9}
              className={cn(
                "w-full h-14 rounded-2xl items-center justify-center transition-all",
                selectedOpt 
                  ? "bg-info-500 border-b-[4px] border-info-700" 
                  : "bg-neutral-200 border-b-[4px] border-neutral-300"
              )}
            >
              <Text className={cn(
                "font-extrabold text-[16px] uppercase font-nunito tracking-wide",
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
                <View className="flex-row items-center gap-3">
                  <View className={cn(
                    "w-10 h-10 rounded-full items-center justify-center",
                    checkState === 'CORRECT' ? "bg-white" : "bg-white"
                  )}>
                    {checkState === 'CORRECT' ? (
                      <CheckCircleIcon size={24} className="text-success-500" />
                    ) : (
                      <XCircleIcon size={24} className="text-error-500" />
                    )}
                  </View>
                  <View>
                    <Text className={cn(
                      "font-extrabold text-[20px] font-nunito",
                      checkState === 'CORRECT' ? "text-success-700" : "text-error-700"
                    )}>
                      {checkState === 'CORRECT' ? 'Chính xác! 🎉' : 'Chưa đúng!'}
                    </Text>
                    {checkState === 'INCORRECT' && (
                      <Text className="font-bold text-[14px] text-error-600 font-inter mt-0.5">
                        Đáp án đúng: {currentQ.options.find(o => o.id === currentQ.correctId)?.text}
                      </Text>
                    )}
                  </View>
                </View>
                {checkState === 'CORRECT' && (
                  <Text className="font-extrabold text-[16px] text-warning-600 font-nunito mt-2">+10 XP</Text>
                )}
              </View>

              <TouchableOpacity 
                onPress={handleNext}
                activeOpacity={0.9}
                className={cn(
                  "w-full h-14 rounded-2xl border-b-[4px] transition-all items-center justify-center flex-row gap-2",
                  checkState === 'CORRECT' 
                    ? "bg-success-500 border-success-700" 
                    : "bg-error-500 border-error-700"
                )}
              >
                <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wide">
                  {currentIndex + 1 >= MOCK_QUESTIONS.length ? 'XEM KẾT QUẢ' : 'TIẾP TỤC'}
                </Text>
                <ArrowRightIcon size={20} className="text-white" />
              </TouchableOpacity>
            </View>
          </RNAnimated.View>
        )}
      </RNAnimated.View>

    </SafeAreaView>
  );
}
