import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, Pressable, Animated as RNAnimated, Dimensions, Easing, Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  XIcon, 
  Volume2Icon, 
  ArrowRightIcon, 
  RotateCcwIcon, 
  BookmarkIcon, 
  RotateCwIcon,
  SparklesIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';
import { XPOrb3D } from '@/components/snapvocab';
import {
  getMockTopicBundle,
  resolveAttributeValue,
  resolveGroupInstances,
  findAttributeByReference,
  TopicItemData,
} from '@/lib/topic-eav';

const { width } = Dimensions.get('window');

type SessionState = 'EMPTY' | 'STUDY' | 'COMPLETED';

export default function FlashcardStudyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const topicId = (params.topicId as string) || (params.id as string) || 'airport-vocabulary';

  // Lấy dữ liệu Topic + Schema + Template động theo EAV
  const bundle = useMemo(() => getMockTopicBundle(topicId), [topicId]);
  const { topic, response } = bundle;
  const { schema, data: cards } = response;
  const template = topic.defaultTemplate;

  const [sessionState, setSessionState] = useState<SessionState>('STUDY');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<number, boolean>>({});

  // Animations
  const flipAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(0)).current;
  const xpToastAnim = useRef(new RNAnimated.Value(0)).current;
  const [xpToastMsg, setXpToastMsg] = useState('');

  useEffect(() => {
    if (!cards || cards.length === 0) {
      setSessionState('EMPTY');
    }
  }, [cards]);

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
    if (sessionState === 'STUDY' && currentIndex > 0) {
      Alert.alert(
        "Thoát phiên học?",
        "Tiến độ đánh giá các thẻ đã hoàn thành sẽ được lưu.",
        [
          { text: "Tiếp tục học", style: "cancel" },
          { text: "Thoát", style: "destructive", onPress: navigateBackSafely },
        ]
      );
    } else {
      navigateBackSafely();
    }
  };

  // Play pronunciation with fallback Web Speech API on web or mock animation
  const playPronunciation = (text: string, e?: any) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    setIsSpeaking(true);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window && text) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } catch {
        setTimeout(() => setIsSpeaking(false), 900);
      }
    } else {
      setTimeout(() => setIsSpeaking(false), 900);
    }
  };

  const toggleBookmark = (itemId: number, e?: any) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    setBookmarkedIds(prev => ({ ...prev, [itemId]: !prev[itemId] }));
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

  const flipBack = (e?: any) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    if (!isFlipped || isTransitioning) return;
    RNAnimated.spring(flipAnim, {
      toValue: 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(false);
    });
  };

  const resetCard = () => {
    flipAnim.setValue(0);
    setIsFlipped(false);
  };

  const restartSession = () => {
    setCurrentIndex(0);
    resetCard();
    setSessionState('STUDY');
  };

  const handleRating = (rating: 'Again' | 'Hard' | 'Good' | 'Easy', xp: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setXpToastMsg(`+${xp} XP`);
    RNAnimated.sequence([
      RNAnimated.timing(xpToastAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      RNAnimated.delay(500),
      RNAnimated.timing(xpToastAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start();

    RNAnimated.timing(slideAnim, {
      toValue: -width,
      duration: 250,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      if (currentIndex + 1 >= cards.length) {
        setSessionState('COMPLETED');
      } else {
        setCurrentIndex(prev => prev + 1);
        resetCard();
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
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
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

  if (sessionState === 'EMPTY') {
    return (
      <SafeAreaView className="flex-1 bg-[#F7F8FA] items-center justify-center p-6">
        <Snapy pose="to_mo" animation="idle" className="w-36 h-36 mb-4" />
        <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2">Chưa có Card nào</Text>
        <Text className="font-medium text-[15px] text-neutral-500 font-inter text-center mb-8">
          Chủ đề "{topic.title}" hiện chưa có thẻ để học.
        </Text>
        <Pressable 
          onPress={navigateBackSafely}
          className="w-full h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center"
        >
          <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wide">
            Quay lại Chủ đề
          </Text>
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
            <Snapy pose="nhay_len" animation="celebrate" className="w-44 h-44 z-10" />
          </View>
          
          <Text className="font-extrabold text-[28px] text-mascot-navy font-nunito mb-2">Hoàn thành xuất sắc!</Text>
          <Text className="font-medium text-[15px] text-neutral-500 font-inter text-center mb-6">
            Bạn đã ôn tập xong {cards.length} thẻ vựng của chủ đề "{topic.title}".
          </Text>

          <View className="bg-white w-full rounded-3xl p-6 border-2 border-neutral-100 border-b-[6px] shadow-sm shadow-black/5 mb-6">
            <View className="flex-row items-center justify-between pb-4 mb-4 border-b border-neutral-100">
              <Text className="font-bold text-[15px] text-neutral-500 font-inter">Chủ đề</Text>
              <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">{topic.emoji} {topic.title}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="font-bold text-[15px] text-neutral-500 font-inter">Kinh nghiệm nhận được</Text>
              <View className="flex-row items-center gap-2">
                <XPOrb3D size="sm" />
                <Text className="font-extrabold text-[18px] text-warning-600 font-nunito">+{cards.length * 30} XP</Text>
              </View>
            </View>
          </View>

          <View className="w-full gap-3">
            <Pressable 
              onPress={navigateBackSafely}
              className="w-full h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center flex-row gap-2"
            >
              <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wide">
                Quay lại Chủ đề
              </Text>
              <ArrowRightIcon size={20} color="#FFFFFF" />
            </Pressable>

            <Pressable 
              onPress={restartSession}
              className="w-full h-12 bg-white border-2 border-neutral-200 border-b-[4px] rounded-2xl active:bg-neutral-50 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center flex-row gap-2"
            >
              <RotateCcwIcon size={18} color="#1E293B" />
              <Text className="font-bold text-[15px] text-mascot-navy font-nunito">Ôn lại phiên này</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const currentCard = cards[currentIndex];
  const progressPercent = ((currentIndex + 1) / cards.length) * 100;
  const isCurrentBookmarked = !!bookmarkedIds[currentCard.topicItemId];

  // =========================================================================
  // TRÍCH XUẤT THUỘC TÍNH DỰNG THẺ THEO TEMPLATE MAPPING & SCHEMA DYNAMIC EAV
  // =========================================================================

  // Mặt trước (Front)
  const frontPrimaryMeta = findAttributeByReference(schema, template.front.primaryAttr);
  const frontPrimaryVal = resolveAttributeValue(currentCard, template.front.primaryAttr, schema);
  const isFrontPrimaryImage = frontPrimaryMeta?.attr.dataType === 'IMAGE';

  const frontSecondaryVal = resolveAttributeValue(currentCard, template.front.secondaryAttr, schema);
  const frontBadgeVal = resolveAttributeValue(currentCard, template.front.badgeAttr, schema);
  const frontAudioVal = resolveAttributeValue(currentCard, template.front.audioAttr, schema);
  const hasFrontAudio = !!frontAudioVal || !!frontPrimaryVal;

  // Mặt sau (Back)
  const backPrimaryVal = resolveAttributeValue(currentCard, template.back.primaryAttr, schema);
  const backSecondaryVal = resolveAttributeValue(currentCard, template.back.secondaryAttr, schema);
  const backBadgeVal = resolveAttributeValue(currentCard, template.back.badgeAttr, schema);
  const backImageVal = resolveAttributeValue(currentCard, template.back.imageAttr, schema);
  const backAudioVal = resolveAttributeValue(currentCard, template.back.audioAttr, schema);

  // Nhóm lặp ví dụ / hội thoại / locations
  const exampleGroupName = template.back.exampleGroup;
  const exampleGroupDef = schema.groups.find(g => g.name === exampleGroupName);
  const exampleInstances = exampleGroupName ? resolveGroupInstances(currentCard, exampleGroupName) : [];

  // Text để phát âm
  const speakText = String(frontPrimaryVal || backPrimaryVal || '');

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top', 'bottom']}>
      
      {/* 1. TOP BAR */}
      <View className="px-4 py-3 flex-row items-center justify-between z-10">
        <Pressable 
          onPress={handleClose} 
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-200 -ml-2"
        >
          <XIcon size={24} color="#737373" />
        </Pressable>
        
        <View className="flex-1 mx-4">
          <View className="h-2.5 bg-neutral-200 rounded-full overflow-hidden w-full">
            <RNAnimated.View 
              style={{ height: '100%', backgroundColor: '#58CC02', borderRadius: 9999, width: `${progressPercent}%` }}
            />
          </View>
        </View>

        <Text className="font-extrabold text-[15px] text-neutral-500 font-nunito tabular-nums w-12 text-right">
          {currentIndex + 1} / {cards.length}
        </Text>
      </View>

      <View className="items-center mb-2">
        <View className="bg-neutral-100 px-3 py-1 rounded-full flex-row items-center gap-1.5">
          <Text className="text-[12px]">{topic.emoji}</Text>
          <Text className="font-bold text-[12px] text-neutral-500 font-inter tracking-wider uppercase">
            {topic.title}
          </Text>
        </View>
      </View>

      {/* 2. MAIN FLASHCARD WITH 3D FLIP */}
      <View className="flex-1 px-5 justify-center items-center relative">
        <RNAnimated.View style={{ transform: [{ translateX: slideAnim }], width: '100%', height: '74%' }}>
          
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
                backgroundColor: '#FFFFFF', borderRadius: 32, borderWidth: 2, borderColor: '#F0F0F0', borderBottomWidth: 6,
                alignItems: 'center', justifyContent: 'center', padding: 24,
                elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 12,
              }}
            >
              {/* Front Top Action Icons */}
              <View className="absolute top-5 left-5 right-5 flex-row justify-between items-center z-20">
                <Pressable
                  onPress={(e) => toggleBookmark(currentCard.topicItemId, e)}
                  className={cn(
                    "w-11 h-11 rounded-full items-center justify-center transition-all",
                    isCurrentBookmarked ? "bg-warning-50" : "bg-neutral-100 active:bg-neutral-200"
                  )}
                >
                  <BookmarkIcon 
                    size={20} 
                    color={isCurrentBookmarked ? "#F59E0B" : "#9CA3AF"} 
                    fill={isCurrentBookmarked ? "#F59E0B" : "none"} 
                  />
                </Pressable>

                {hasFrontAudio && (
                  <Pressable 
                    onPress={(e) => playPronunciation(speakText, e)}
                    className={cn(
                      "w-11 h-11 rounded-full items-center justify-center transition-all",
                      isSpeaking ? "bg-info-500 scale-105" : "bg-info-50 active:bg-info-100"
                    )}
                  >
                    <Volume2Icon size={22} color={isSpeaking ? "#FFFFFF" : "#0284C7"} />
                  </Pressable>
                )}
              </View>

              {/* Front Center Content */}
              <View className="items-center justify-center my-auto w-full px-2">
                {frontBadgeVal ? (
                  <View className="bg-neutral-100 px-3 py-1 rounded-lg mb-3">
                    <Text className="font-bold text-[12px] text-neutral-500 font-inter uppercase tracking-wider">
                      {String(frontBadgeVal)}
                    </Text>
                  </View>
                ) : null}

                {isFrontPrimaryImage ? (
                  /* HERO IMAGE ON FRONT (VÍ DỤ CHO TOPIC BIỂN BÁO HÌNH ẢNH) */
                  <View className="w-full h-[180px] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 mb-3">
                    <Image 
                      source={{ uri: String(frontPrimaryVal) }}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  /* PRIMARY TEXT ON FRONT (VÍ DỤ TỪ VỰNG HOẶC MẪU CÂU) */
                  <Text className="font-extrabold text-[32px] text-mascot-navy font-nunito text-center mb-2 leading-tight">
                    {String(frontPrimaryVal || '')}
                  </Text>
                )}

                {frontSecondaryVal ? (
                  <Text className="font-medium text-[17px] text-neutral-400 font-inter text-center">
                    {String(frontSecondaryVal)}
                  </Text>
                ) : null}
              </View>

              {/* Front Flip Hint */}
              <View className="absolute bottom-6 flex-row items-center gap-2 bg-neutral-50 px-4 py-2 rounded-full border border-neutral-100">
                <RotateCwIcon size={14} color="#9CA3AF" />
                <Text className="font-bold text-[13px] text-neutral-400 font-inter uppercase tracking-wider">
                  Chạm để lật xem nghĩa
                </Text>
              </View>
            </RNAnimated.View>

            {/* BACK SIDE WITH DETAILS & DYNAMIC EXAMPLES */}
            <RNAnimated.View 
              style={{ 
                transform: [{ rotateY: backInterpolate }],
                opacity: backOpacity,
                backfaceVisibility: 'hidden',
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: '#FFFFFF', borderRadius: 32, borderWidth: 2, borderColor: '#BFDBFE', borderBottomWidth: 6,
                alignItems: 'center', padding: 20,
                elevation: 4, shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 12,
              }}
            >
              {/* Back Card Top Thumbnail (Nếu có ảnh) */}
              {backImageVal ? (
                <View className="w-full h-[115px] rounded-2xl overflow-hidden bg-neutral-100 relative mb-3">
                  <Image 
                    source={{ uri: String(backImageVal) }} 
                    className="w-full h-full" 
                    resizeMode="cover" 
                  />
                  {backBadgeVal ? (
                    <View 
                      className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                    >
                      <Text className="font-extrabold text-[11px] text-white font-inter uppercase tracking-wider">
                        {String(backBadgeVal)}
                      </Text>
                    </View>
                  ) : null}

                  <Pressable 
                    onPress={(e) => playPronunciation(speakText, e)}
                    className={cn(
                      "absolute top-2.5 right-2.5 w-9 h-9 rounded-full items-center justify-center transition-all shadow-md",
                      isSpeaking ? "bg-info-500 scale-105" : "bg-white/90 active:bg-white"
                    )}
                  >
                    <Volume2Icon size={18} color={isSpeaking ? "#FFFFFF" : "#0284C7"} />
                  </Pressable>

                  <Pressable 
                    onPress={flipBack}
                    className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md flex-row items-center gap-1"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                  >
                    <RotateCcwIcon size={12} color="#FFFFFF" />
                    <Text className="font-bold text-[11px] text-white font-inter">Lật lại</Text>
                  </Pressable>
                </View>
              ) : (
                /* Header lật lại nếu không có ảnh */
                <View className="w-full flex-row justify-between items-center mb-2">
                  <Pressable 
                    onPress={flipBack}
                    className="px-3 py-1 bg-neutral-100 rounded-lg flex-row items-center gap-1 active:bg-neutral-200"
                  >
                    <RotateCcwIcon size={12} color="#64748B" />
                    <Text className="font-bold text-[11px] text-neutral-600 font-inter">Mặt trước</Text>
                  </Pressable>

                  <Pressable 
                    onPress={(e) => playPronunciation(speakText, e)}
                    className="w-8 h-8 rounded-full bg-info-50 items-center justify-center active:bg-info-100"
                  >
                    <Volume2Icon size={16} color="#0284C7" />
                  </Pressable>
                </View>
              )}

              {/* Primary meaning / title */}
              <View className="items-center mb-1 w-full px-2">
                <Text className="font-extrabold text-[22px] text-primary-600 font-nunito text-center leading-tight">
                  {String(backPrimaryVal || '')}
                </Text>
                {backSecondaryVal ? (
                  <Text className="font-medium text-[14px] text-neutral-400 font-inter text-center mt-0.5">
                    {String(backSecondaryVal)}
                  </Text>
                ) : null}
              </View>

              <View className="w-full h-[1px] bg-neutral-100 my-2" />

              {/* DYNAMIC EXAMPLE GROUP RENDERING (EAV MULTIPLE GROUP) */}
              {exampleInstances.length > 0 ? (
                <View className="w-full bg-neutral-50 rounded-xl p-3 border border-neutral-100 mt-auto mb-1 max-h-[140px] overflow-hidden">
                  <Text className="font-bold text-[11px] text-neutral-400 font-inter uppercase tracking-widest mb-1.5 flex-row items-center gap-1">
                    {exampleGroupDef?.label || 'Dữ liệu ngữ cảnh'}
                  </Text>
                  
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {exampleInstances.slice(0, 2).map((inst, idx) => (
                      <View key={idx} className={cn("gap-0.5", idx !== 0 && "mt-2 pt-2 border-t border-neutral-200/50")}>
                        <Text className="font-medium text-[13px] text-neutral-700 font-inter italic leading-relaxed">
                          "{inst.sentence || inst.line || inst.instruction || Object.values(inst)[0]}"
                        </Text>
                        {(inst.translation || inst.vietnamese) && (
                          <Text className="font-normal text-[12px] text-neutral-400 font-inter">
                            {String(inst.translation || inst.vietnamese)}
                          </Text>
                        )}
                      </View>
                    ))}
                  </ScrollView>
                </View>
              ) : null}

            </RNAnimated.View>
          </Pressable>
        </RNAnimated.View>
      </View>

      {/* 3. FSRS RATING BAR WITH TIME INTERVALS */}
      <View className="h-[120px] px-4 justify-center">
        {isFlipped ? (
          <View className="flex-row justify-between gap-2.5">
            
            {/* AGAIN */}
            <Pressable 
              onPress={() => handleRating('Again', 10)}
              className="flex-1 h-[72px] bg-error-50 border-2 border-error-200 border-b-[4px] rounded-2xl active:bg-error-100 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center p-1"
            >
              <View className="bg-error-100 px-2 py-0.5 rounded-md mb-1">
                <Text className="font-extrabold text-[11px] text-error-700 font-nunito">10m</Text>
              </View>
              <Text className="font-extrabold text-[14px] text-error-600 font-nunito leading-tight">Again</Text>
              <Text className="font-semibold text-[10px] text-error-500 font-inter opacity-80">Lặp lại</Text>
            </Pressable>
            
            {/* HARD */}
            <Pressable 
              onPress={() => handleRating('Hard', 20)}
              className="flex-1 h-[72px] bg-warning-50 border-2 border-warning-200 border-b-[4px] rounded-2xl active:bg-warning-100 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center p-1"
            >
              <View className="bg-warning-100 px-2 py-0.5 rounded-md mb-1">
                <Text className="font-extrabold text-[11px] text-warning-700 font-nunito">1d</Text>
              </View>
              <Text className="font-extrabold text-[14px] text-warning-600 font-nunito leading-tight">Hard</Text>
              <Text className="font-semibold text-[10px] text-warning-500 font-inter opacity-80">Khó</Text>
            </Pressable>
            
            {/* GOOD (RECOMMENDED PRIMARY CTA) */}
            <Pressable 
              onPress={() => handleRating('Good', 30)}
              className="flex-1 h-[72px] bg-primary-500 border-b-[4px] border-primary-700 rounded-2xl active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center p-1 shadow-sm shadow-primary-500/20"
            >
              <View className="bg-primary-600 px-2 py-0.5 rounded-md mb-1">
                <Text className="font-extrabold text-[11px] text-white font-nunito">3d</Text>
              </View>
              <Text className="font-extrabold text-[14px] text-white font-nunito leading-tight">Good</Text>
              <Text className="font-semibold text-[10px] text-primary-100 font-inter opacity-90">Tốt</Text>
            </Pressable>
            
            {/* EASY */}
            <Pressable 
              onPress={() => handleRating('Easy', 40)}
              className="flex-1 h-[72px] bg-info-50 border-2 border-info-200 border-b-[4px] rounded-2xl active:bg-info-100 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center p-1"
            >
              <View className="bg-info-100 px-2 py-0.5 rounded-md mb-1">
                <Text className="font-extrabold text-[11px] text-info-700 font-nunito">7d</Text>
              </View>
              <Text className="font-extrabold text-[14px] text-info-600 font-nunito leading-tight">Easy</Text>
              <Text className="font-semibold text-[10px] text-info-500 font-inter opacity-80">Dễ</Text>
            </Pressable>

          </View>
        ) : (
          <View className="items-center justify-center opacity-60 flex-row gap-2">
            <Text className="font-bold text-[13px] text-neutral-400 font-inter">Cố gắng nhớ ra trước khi lật nhé!</Text>
          </View>
        )}
      </View>

      {/* 4. BRANDED XP TOAST NOTIFICATION (XPOrb3D) */}
      <RNAnimated.View 
        style={{ 
          opacity: xpToastAnim,
          transform: [
            { scale: xpToastAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.8, 1.15, 1] }) },
            { translateY: xpToastAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
          ],
          position: 'absolute', top: '35%', width: '100%', alignItems: 'center', justifyContent: 'center', zIndex: 50,
        }}
        pointerEvents="none"
      >
        <View className="bg-mascot-navy px-5 py-2.5 rounded-full shadow-xl shadow-black/25 flex-row items-center gap-2.5 border border-white/20">
          <XPOrb3D size="sm" animation="float" />
          <Text className="font-extrabold text-[18px] text-warning-400 font-nunito">{xpToastMsg}</Text>
        </View>
      </RNAnimated.View>

    </SafeAreaView>
  );
}
