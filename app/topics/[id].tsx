import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Animated, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  ChevronLeftIcon, 
  Volume2Icon, 
  CheckCircle2Icon,
  FoldersIcon,
  RefreshCwIcon,
  XIcon,
  CheckIcon,
  PlusIcon,
  LayersIcon,
  BookmarkIcon,
  GraduationCapIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// ==========================================
// TYPES
// ==========================================
type TopicWord = {
  id: string;
  word: string;
  ipa: string;
  meaning: string;
  partOfSpeech?: string;
  example?: string;
  hasAudio: boolean;
  initialSaved?: boolean;
};

type TopicDetail = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  totalWords: number;
  progress: number;
  words: TopicWord[];
};

type DeckOption = {
  id: string;
  name: string;
  emoji: string;
  cardCount: number;
  template: string;
};

// ==========================================
// MOCK DECKS
// ==========================================
const MOCK_DECKS: DeckOption[] = [
  { id: 'd2', name: 'Travel English', emoji: '✈️', cardCount: 86, template: 'LISTENING' },
  { id: 'd1', name: 'English Basics', emoji: '📚', cardCount: 42, template: 'CLASSIC' },
  { id: 'd3', name: 'Daily Conversation', emoji: '💬', cardCount: 35, template: 'CLASSIC' },
  { id: 'd4', name: 'Business English', emoji: '💼', cardCount: 64, template: 'SPEAKING' },
  { id: 'd5', name: 'IELTS Core', emoji: '🎯', cardCount: 120, template: 'SRS' },
];

// ==========================================
// MOCK TOPIC DATABASE
// ==========================================
const TOPIC_DATABASE: Record<string, TopicDetail> = {
  // Sân bay - Tổng quan
  't1': {
    id: 't1',
    title: 'Sân bay (Tổng quan)',
    emoji: '✈️',
    description: 'Trọn bộ từ vựng thiết yếu nhất cho mọi thủ tục tại sân bay quốc tế.',
    totalWords: 72,
    progress: 42,
    words: [
      { id: 'w1_1', word: 'boarding pass', ipa: '/ˈbɔːrdɪŋ pæs/', meaning: 'thẻ lên máy bay', partOfSpeech: 'noun', example: 'Please show your boarding pass at the gate.', hasAudio: true, initialSaved: false },
      { id: 'w1_2', word: 'terminal', ipa: '/ˈtɜːrmɪnəl/', meaning: 'nhà ga sân bay', partOfSpeech: 'noun', example: 'International flights depart from Terminal 2.', hasAudio: true, initialSaved: true },
      { id: 'w1_3', word: 'luggage', ipa: '/ˈlʌɡɪdʒ/', meaning: 'hành lý', partOfSpeech: 'noun', example: 'You can collect your luggage at baggage claim.', hasAudio: true, initialSaved: false },
      { id: 'w1_4', word: 'customs', ipa: '/ˈkʌstəmz/', meaning: 'hải quan', partOfSpeech: 'noun', example: 'He had to declare his goods at customs.', hasAudio: false, initialSaved: false },
      { id: 'w1_5', word: 'departure', ipa: '/dɪˈpɑːrtʃər/', meaning: 'chuyến bay khởi hành', partOfSpeech: 'noun', example: 'Check the departure board for your flight status.', hasAudio: true, initialSaved: false },
      { id: 'w1_6', word: 'carousel', ipa: '/ˌkær.əˈsel/', meaning: 'băng chuyền hành lý', partOfSpeech: 'noun', example: 'Bags will arrive at carousel 4.', hasAudio: true, initialSaved: false },
    ]
  },
  // Check-in
  't1_1': {
    id: 't1_1',
    title: 'Check-in & Thủ tục',
    emoji: '🎫',
    description: 'Các từ vựng và mẫu câu khi làm thủ tục vé, chọn ghế và gửi hành lý.',
    totalWords: 18,
    progress: 60,
    words: [
      { id: 'w1_1', word: 'boarding pass', ipa: '/ˈbɔːrdɪŋ pæs/', meaning: 'thẻ lên máy bay', partOfSpeech: 'noun', example: 'Please present your boarding pass and passport.', hasAudio: true, initialSaved: false },
      { id: 'w1_2', word: 'passport', ipa: '/ˈpæspɔːrt/', meaning: 'hộ chiếu', partOfSpeech: 'noun', example: 'Ensure your passport is valid for at least six months.', hasAudio: true, initialSaved: true },
      { id: 'w1_7', word: 'check-in counter', ipa: '/ˈtʃek ɪn ˈkaʊntər/', meaning: 'quầy làm thủ tục', partOfSpeech: 'noun', example: 'Go directly to counter B for self check-in.', hasAudio: true, initialSaved: false },
      { id: 'w1_8', word: 'baggage drop', ipa: '/ˈbæɡɪdʒ drɑːp/', meaning: 'nơi ký gửi hành lý', partOfSpeech: 'noun', example: 'Drop your bags at the baggage drop counter.', hasAudio: true, initialSaved: false },
      { id: 'w1_9', word: 'carry-on', ipa: '/ˈkæri ɑːn/', meaning: 'hành lý xách tay', partOfSpeech: 'noun', example: 'Only one carry-on bag is allowed per person.', hasAudio: true, initialSaved: false },
      { id: 'w1_10', word: 'excess baggage', ipa: '/ɪkˈses ˈbæɡɪdʒ/', meaning: 'hành lý quá cước', partOfSpeech: 'noun', example: 'You need to pay a fee for excess baggage.', hasAudio: false, initialSaved: false },
    ]
  },
  // An ninh sân bay
  't1_2': {
    id: 't1_2',
    title: 'An ninh sân bay',
    emoji: '🛡️',
    description: 'Từ vựng khu vực soi chiếu an ninh, cổng an toàn và quy định kiểm tra.',
    totalWords: 22,
    progress: 35,
    words: [
      { id: 'w2_1', word: 'security checkpoint', ipa: '/sɪˈkjʊrəti ˈtʃekpɔɪnt/', meaning: 'trạm kiểm soát an ninh', partOfSpeech: 'noun', example: 'Have your documents ready before security.', hasAudio: true, initialSaved: false },
      { id: 'w2_2', word: 'metal detector', ipa: '/ˈmetl dɪˈtektər/', meaning: 'máy dò kim loại', partOfSpeech: 'noun', example: 'Please step through the metal detector.', hasAudio: true, initialSaved: false },
      { id: 'w2_3', word: 'liquid restriction', ipa: '/ˈlɪkwɪd rɪˈstrɪkʃn/', meaning: 'giới hạn chất lỏng', partOfSpeech: 'noun', example: 'Liquids must be in containers under 100ml.', hasAudio: true, initialSaved: false },
      { id: 'w2_4', word: 'tray', ipa: '/treɪ/', meaning: 'khay đựng đồ soi chiếu', partOfSpeech: 'noun', example: 'Place your laptop and phone into the plastic tray.', hasAudio: true, initialSaved: true },
      { id: 'w2_5', word: 'prohibited items', ipa: '/prəˈhɪbɪtɪd ˈaɪtəmz/', meaning: 'vật dụng bị cấm', partOfSpeech: 'noun', example: 'Sharp objects are prohibited in carry-on bags.', hasAudio: true, initialSaved: false },
    ]
  },
  // Lên máy bay
  't1_3': {
    id: 't1_3',
    title: 'Lên máy bay',
    emoji: '🛫',
    description: 'Từ vựng cổng ra máy bay, khoang hành khách và hướng dẫn tiếp viên.',
    totalWords: 32,
    progress: 0,
    words: [
      { id: 'w3_1', word: 'boarding gate', ipa: '/ˈbɔːrdɪŋ ɡeɪt/', meaning: 'cổng lên máy bay', partOfSpeech: 'noun', example: 'Flight VN123 is now boarding at Gate 12.', hasAudio: true, initialSaved: false },
      { id: 'w3_2', word: 'flight attendant', ipa: '/flaɪt əˈtendənt/', meaning: 'tiếp viên hàng không', partOfSpeech: 'noun', example: 'The flight attendant demonstrated safety instructions.', hasAudio: true, initialSaved: false },
      { id: 'w3_3', word: 'overhead bin', ipa: '/ˌoʊvərhed ˈbɪn/', meaning: 'ngăn để đồ trên đầu', partOfSpeech: 'noun', example: 'Place your bag in the overhead bin.', hasAudio: true, initialSaved: false },
      { id: 'w3_4', word: 'seat belt', ipa: '/ˈsiːt belt/', meaning: 'dây an toàn', partOfSpeech: 'noun', example: 'Fasten your seat belt during turbulence.', hasAudio: true, initialSaved: false },
      { id: 'w3_5', word: 'aisle seat', ipa: '/aɪl siːt/', meaning: 'ghế cạnh lối đi', partOfSpeech: 'noun', example: 'I prefer an aisle seat for easy movement.', hasAudio: true, initialSaved: false },
    ]
  },
  // Khách sạn
  't2': {
    id: 't2',
    title: 'Khách sạn (Tổng quan)',
    emoji: '🏨',
    description: 'Từ vựng đặt phòng, tiện nghi và lưu trú khách sạn.',
    totalWords: 45,
    progress: 15,
    words: [
      { id: 'w4_1', word: 'reservation', ipa: '/ˌrezərˈveɪʃn/', meaning: 'đặt phòng trước', partOfSpeech: 'noun', example: 'I have a reservation under the name John Smith.', hasAudio: true, initialSaved: true },
      { id: 'w4_2', word: 'reception', ipa: '/rɪˈsepʃn/', meaning: 'quầy lễ tân', partOfSpeech: 'noun', example: 'The reception is open 24 hours a day.', hasAudio: true, initialSaved: false },
      { id: 'w4_3', word: 'complimentary breakfast', ipa: '/ˌkɑːmplɪˈmentri ˈbrekfəst/', meaning: 'bữa sáng miễn phí', partOfSpeech: 'noun', example: 'The hotel offers complimentary buffet breakfast.', hasAudio: true, initialSaved: false },
      { id: 'w4_4', word: 'housekeeping', ipa: '/ˈhaʊskiːpɪŋ/', meaning: 'dịch vụ dọn phòng', partOfSpeech: 'noun', example: 'Housekeeping cleans the room every morning.', hasAudio: true, initialSaved: false },
    ]
  },
  // Chuẩn bị chuyến đi
  't3': {
    id: 't3',
    title: 'Chuẩn bị chuyến đi',
    emoji: '🎒',
    description: 'Hành trang du lịch, lập kế hoạch và đổi tiền tệ.',
    totalWords: 20,
    progress: 80,
    words: [
      { id: 'w5_1', word: 'itinerary', ipa: '/aɪˈtɪnəreri/', meaning: 'lịch trình chi tiết', partOfSpeech: 'noun', example: 'We prepared a detailed travel itinerary.', hasAudio: true, initialSaved: true },
      { id: 'w5_2', word: 'travel insurance', ipa: '/ˈtrævl ɪnʃʊrəns/', meaning: 'bảo hiểm du lịch', partOfSpeech: 'noun', example: 'Never travel abroad without travel insurance.', hasAudio: true, initialSaved: false },
      { id: 'w5_3', word: 'currency exchange', ipa: '/ˈkɜːrənsi ɪkstʃeɪndʒ/', meaning: 'đổi ngoại tệ', partOfSpeech: 'noun', example: 'You can find currency exchange at the airport.', hasAudio: true, initialSaved: false },
      { id: 'w5_4', word: 'power adapter', ipa: '/ˈpaʊər ədæptər/', meaning: 'đầu cắm chuyển đổi', partOfSpeech: 'noun', example: 'Bring a universal adapter for your devices.', hasAudio: true, initialSaved: false },
    ]
  },
  // Phỏng vấn xin việc
  't4': {
    id: 't4',
    title: 'Phỏng vấn xin việc',
    emoji: '💼',
    description: 'Từ vựng đàm phán lương, phỏng vấn nhân sự và giới thiệu năng lực.',
    totalWords: 30,
    progress: 10,
    words: [
      { id: 'w6_1', word: 'curriculum vitae', ipa: '/kəˌrɪkjələm ˈviːtaɪ/', meaning: 'hồ sơ xin việc (CV)', partOfSpeech: 'noun', example: 'Please attach your updated CV.', hasAudio: true, initialSaved: false },
      { id: 'w6_2', word: 'interviewer', ipa: '/ˈɪntərvjuːər/', meaning: 'người phỏng vấn', partOfSpeech: 'noun', example: 'The interviewer asked about my previous project experience.', hasAudio: true, initialSaved: false },
      { id: 'w6_3', word: 'probation period', ipa: '/proʊˈbeɪʃn ˈpɪriəd/', meaning: 'thời gian thử việc', partOfSpeech: 'noun', example: 'The standard probation period is two months.', hasAudio: true, initialSaved: false },
      { id: 'w6_4', word: 'remuneration', ipa: '/rɪˌmjuːnəˈreɪʃn/', meaning: 'chế độ đãi ngộ / lương thưởng', partOfSpeech: 'noun', example: 'Competitive remuneration package with bonuses.', hasAudio: true, initialSaved: false },
    ]
  }
};

export default function TopicDetailScreen() {
  const params = useLocalSearchParams();
  const topicId = (params.id as string) || 't1_1';

  // Lấy dữ liệu topic tương ứng hoặc dùng fallback
  const topicData: TopicDetail = useMemo(() => {
    if (TOPIC_DATABASE[topicId]) {
      return TOPIC_DATABASE[topicId];
    }
    return {
      id: topicId,
      title: `Chủ đề #${topicId}`,
      emoji: '📖',
      description: 'Danh sách các từ vựng học tập cho chủ đề này.',
      totalWords: 15,
      progress: 0,
      words: [
        { id: `${topicId}_1`, word: 'vocabulary', ipa: '/vəˈkæbjəleri/', meaning: 'từ vựng', hasAudio: true, initialSaved: false },
        { id: `${topicId}_2`, word: 'pronunciation', ipa: '/prəˌnʌnsiˈeɪʃn/', meaning: 'cách phát âm', hasAudio: true, initialSaved: false },
        { id: `${topicId}_3`, word: 'fluent', ipa: '/ˈfluːənt/', meaning: 'trôi chảy, lưu loát', hasAudio: true, initialSaved: false },
      ]
    };
  }, [topicId]);

  // Deck State
  const [selectedDeck, setSelectedDeck] = useState<DeckOption>(MOCK_DECKS[0]);
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);

  // Persistent Saved Words Map per Deck ID
  const [savedByDeck, setSavedByDeck] = useState<Record<string, Set<string>>>(() => {
    const initialMap: Record<string, Set<string>> = {
      'd1': new Set(['w1_2', 'w2_4', 'w4_1', 'w5_1']),
      'd2': new Set(['w1_1', 'w1_2']),
    };
    return initialMap;
  });

  // Current deck's saved words set
  const currentDeckSavedSet = useMemo(() => {
    return savedByDeck[selectedDeck.id] || new Set<string>();
  }, [savedByDeck, selectedDeck.id]);

  // Audio Play State
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  // Toast Notification State
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastAction, setToastAction] = useState<(() => void) | null>(null);
  const [toastAnim] = useState(new Animated.Value(0));

  const showToast = (message: string, action?: () => void) => {
    setToastMsg(message);
    setToastAction(action ? () => action : null);

    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(3000),
      Animated.timing(toastAnim, { toValue: 0, duration: 250, useNativeDriver: true })
    ]).start(() => {
      setToastMsg(null);
      setToastAction(null);
    });
  };

  // Play Audio with Web Speech API or Fallback
  const playAudio = (word: string) => {
    setPlayingWord(word);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.onstart = () => setPlayingWord(word);
        utterance.onend = () => setPlayingWord(null);
        utterance.onerror = () => setPlayingWord(null);
        window.speechSynthesis.speak(utterance);
      } catch {
        setTimeout(() => setPlayingWord(null), 1200);
      }
    } else {
      setTimeout(() => setPlayingWord(null), 1200);
    }
  };

  // Save a single word to currently active deck
  const handleSaveWord = (wordId: string) => {
    if (currentDeckSavedSet.has(wordId)) return;

    setSavedByDeck(prev => {
      const nextDeckSet = new Set(prev[selectedDeck.id] || []);
      nextDeckSet.add(wordId);
      return {
        ...prev,
        [selectedDeck.id]: nextDeckSet
      };
    });

    showToast(`Đã lưu vào bộ thẻ "${selectedDeck.name}"`, () => setIsDeckModalOpen(true));
  };

  // Save all eligible words to currently active deck
  const handleSaveAll = () => {
    const eligibleWords = topicData.words.filter(w => !currentDeckSavedSet.has(w.id));

    if (eligibleWords.length === 0) {
      showToast('Tất cả từ đã có trong bộ thẻ này');
      return;
    }

    setSavedByDeck(prev => {
      const nextDeckSet = new Set(prev[selectedDeck.id] || []);
      eligibleWords.forEach(w => nextDeckSet.add(w.id));
      return {
        ...prev,
        [selectedDeck.id]: nextDeckSet
      };
    });

    const skippedCount = topicData.words.length - eligibleWords.length;
    if (skippedCount > 0) {
      showToast(`Đã lưu ${eligibleWords.length} từ · Bỏ qua ${skippedCount} từ đã có`, () => setIsDeckModalOpen(true));
    } else {
      showToast(`Đã lưu toàn bộ ${eligibleWords.length} từ vào "${selectedDeck.name}"`, () => setIsDeckModalOpen(true));
    }
  };

  const handleSelectDeck = (deck: DeckOption) => {
    setSelectedDeck(deck);
    setIsDeckModalOpen(false);
    showToast(`Đã chọn bộ thẻ đích: "${deck.name}"`);
  };

  const eligibleCount = topicData.words.filter(w => !currentDeckSavedSet.has(w.id)).length;

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      {/* FLOATING TOAST NOTIFICATION VỚI NÚT ĐỔI DECK TƯƠNG TÁC */}
      {toastMsg && (
        <Animated.View 
          style={{
            opacity: toastAnim,
            transform: [{ 
              translateY: toastAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-25, 0]
              }) 
            }]
          }}
          className="absolute top-14 left-4 right-4 z-50 bg-mascot-navy px-4 py-3.5 rounded-2xl shadow-xl flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-2.5 flex-1 mr-2">
            <View className="w-6 h-6 rounded-full bg-primary-500/20 items-center justify-center">
              <CheckIcon size={14} className="text-primary-400" />
            </View>
            <Text className="text-white text-[13px] font-inter font-medium leading-snug flex-1" numberOfLines={2}>
              {toastMsg}
            </Text>
          </View>
          {toastAction && (
            <Pressable 
              onPress={() => {
                toastAction();
              }}
              className="bg-white/20 px-3 py-1.5 rounded-xl active:bg-white/30"
            >
              <Text className="text-primary-300 text-[12px] font-extrabold font-nunito uppercase tracking-wide">
                Đổi Deck
              </Text>
            </Pressable>
          )}
        </Animated.View>
      )}

      {/* 1. TOP HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white z-10 border-b border-neutral-100">
        <Pressable 
          onPress={() => router.back()} 
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100 -ml-2"
        >
          <ChevronLeftIcon size={28} className="text-mascot-navy" />
        </Pressable>
        <Text className="flex-1 text-center font-extrabold text-[18px] text-mascot-navy font-nunito mr-2" numberOfLines={1}>
          {topicData.emoji} {topicData.title}
        </Text>
        <Pressable 
          onPress={() => {
            showToast('Chế độ học Flashcard chủ đề đang được chuẩn bị!');
          }}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-primary-50"
        >
          <GraduationCapIcon size={22} className="text-primary-600" />
        </Pressable>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. TOPIC BANNER */}
        <View className="bg-white px-5 pt-4 pb-6 border-b border-neutral-100 mb-3">
          <View className="flex-row items-center gap-2.5 mb-1.5">
            <Text className="text-[28px]">{topicData.emoji}</Text>
            <Text className="font-extrabold text-[24px] text-mascot-navy font-nunito flex-1">
              {topicData.title}
            </Text>
          </View>
          
          <Text className="font-medium text-[15px] text-neutral-500 font-inter leading-relaxed mb-4">
            {topicData.description}
          </Text>
          
          <View className="flex-row items-center justify-between pt-2 border-t border-neutral-100">
            <Text className="font-bold text-[14px] text-neutral-400 font-inter">
              {topicData.words.length} từ vựng hiển thị · {topicData.totalWords} từ trong chủ đề
            </Text>
            {topicData.progress > 0 && (
              <View className="flex-row items-center gap-2">
                <Text className="font-extrabold text-[14px] text-primary-600 font-nunito">
                  {topicData.progress}% hoàn thành
                </Text>
                <View className="w-16 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <View 
                    className="h-full bg-primary-500 rounded-full" 
                    style={{ width: `${topicData.progress}%` }}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* 3. DECK ĐÍCH SELECTOR CARD */}
        <View className="px-4 mb-4">
          <View className="bg-white rounded-[20px] p-4 border border-neutral-100 shadow-sm shadow-black/5 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1 pr-2">
              <View className="w-11 h-11 bg-info-50 rounded-2xl items-center justify-center border border-info-100">
                <Text className="text-[20px]">{selectedDeck.emoji}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-bold text-[11px] text-neutral-400 font-inter uppercase tracking-wider mb-0.5">
                  DECK ĐÍCH HIỆN TẠI
                </Text>
                <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito" numberOfLines={1}>
                  {selectedDeck.name}
                </Text>
              </View>
            </View>
            <Pressable 
              onPress={() => setIsDeckModalOpen(true)}
              className="bg-primary-50 px-3.5 py-2 rounded-xl border border-primary-200 active:bg-primary-100 flex-row items-center gap-1.5 shadow-sm"
            >
              <RefreshCwIcon size={14} className="text-primary-600" />
              <Text className="font-extrabold text-[13px] text-primary-700 font-nunito">Đổi Deck</Text>
            </Pressable>
          </View>
        </View>

        {/* 4. DANH SÁCH TỪ VỰNG TRONG CHỦ ĐỀ */}
        <View className="px-4">
          <View className="flex-row items-center justify-between mb-3 px-1">
            <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">Danh sách từ vựng</Text>
            <Text className="font-medium text-[13px] text-neutral-400 font-inter">
              Đã lưu {currentDeckSavedSet.size} từ trong Deck
            </Text>
          </View>
          
          {topicData.words.length === 0 ? (
            <View className="items-center justify-center py-12 bg-white rounded-3xl p-6 border border-neutral-100">
              <Snapy pose="doc_sach" animation="idle" className="w-28 h-28 mb-4" />
              <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-1">Chủ đề chưa có từ vựng</Text>
              <Text className="font-medium text-[14px] text-neutral-400 font-inter text-center">
                Dữ liệu của chủ đề này đang được cập nhật thêm.
              </Text>
            </View>
          ) : (
            <View className="gap-3.5">
              {topicData.words.map(item => {
                const isSaved = currentDeckSavedSet.has(item.id);
                const isSpeaking = playingWord === item.word;
                
                return (
                  <Pressable 
                    key={item.id}
                    onPress={() => {
                      // Navigate to MH-DICT-02 Word Detail
                      router.push(`/dictionary/${encodeURIComponent(item.word.toLowerCase().trim())}` as any);
                    }}
                    className="bg-white rounded-[22px] p-5 border-2 border-neutral-100 border-b-[4px] shadow-sm shadow-black/5 active:bg-neutral-50/80 active:translate-y-[2px] active:border-b-[2px] transition-all"
                  >
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1 pr-2">
                        <View className="flex-row items-center gap-2">
                          <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito">
                            {item.word}
                          </Text>
                          {item.partOfSpeech && (
                            <View className="bg-neutral-100 px-2 py-0.5 rounded-md">
                              <Text className="font-bold text-[11px] text-neutral-500 font-inter uppercase">
                                {item.partOfSpeech}
                              </Text>
                            </View>
                          )}
                        </View>
                        {item.ipa ? (
                          <Text className="font-medium text-[14px] text-neutral-400 font-inter mt-0.5">{item.ipa}</Text>
                        ) : (
                          <Text className="font-medium text-[13px] text-neutral-300 font-inter italic mt-0.5">Chưa có phiên âm</Text>
                        )}
                      </View>
                      
                      {item.hasAudio && (
                        <Pressable 
                          onPress={(e) => {
                            e.stopPropagation();
                            playAudio(item.word);
                          }}
                          className={cn(
                            "w-10 h-10 rounded-xl items-center justify-center border transition-all",
                            isSpeaking 
                              ? "bg-info-100 border-info-300 scale-105" 
                              : "bg-info-50 border-info-200 active:bg-info-100 active:scale-95"
                          )}
                        >
                          <Volume2Icon size={19} className={isSpeaking ? "text-info-700" : "text-info-600"} />
                        </Pressable>
                      )}
                    </View>
                    
                    <Text className="font-bold text-[15px] text-neutral-700 font-inter mb-2">
                      {item.meaning}
                    </Text>

                    {item.example && (
                      <Text className="font-normal text-[13px] text-neutral-400 font-inter italic mb-3">
                        "{item.example}"
                      </Text>
                    )}
                    
                    <View className="flex-row items-center justify-between pt-2 border-t border-neutral-100">
                      <Text className="font-medium text-[12px] text-neutral-400 font-inter">
                        Chạm để xem chi tiết từ
                      </Text>
                      
                      {isSaved ? (
                        <View className="flex-row items-center gap-1.5 px-3.5 py-1.5 bg-neutral-100 rounded-xl">
                          <CheckCircle2Icon size={15} className="text-primary-600" />
                          <Text className="font-bold text-[13px] text-neutral-600 font-inter">Đã lưu ✓</Text>
                        </View>
                      ) : (
                        <Pressable 
                          onPress={(e) => {
                            e.stopPropagation();
                            handleSaveWord(item.id);
                          }}
                          className="px-5 py-2 bg-primary-500 rounded-xl border-b-[3px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[1px] transition-all shadow-sm shadow-primary-500/20"
                        >
                          <Text className="font-extrabold text-[13px] text-white uppercase font-nunito tracking-wide">
                            + Lưu từ
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* 5. BOTTOM STICKY BAR: LƯU TẤT CẢ */}
      <View className="absolute bottom-0 left-0 right-0 p-4 pt-3 pb-8 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-lg shadow-black/10">
        <Pressable 
          onPress={handleSaveAll}
          disabled={eligibleCount === 0}
          className={cn(
            "h-14 rounded-2xl items-center justify-center border-b-[4px] active:translate-y-[2px] active:border-b-[2px] transition-all flex-row gap-2 shadow-sm",
            eligibleCount > 0 
              ? "bg-primary-500 border-primary-700 active:bg-primary-600 shadow-primary-500/20" 
              : "bg-neutral-100 border-neutral-200 opacity-90"
          )}
        >
          <Text className={cn(
            "font-extrabold text-[16px] uppercase font-nunito tracking-[0.04em]",
            eligibleCount > 0 ? "text-white" : "text-neutral-400"
          )}>
            {eligibleCount > 0 
              ? `Lưu tất cả · ${eligibleCount} từ vào "${selectedDeck.name}"` 
              : "Đã lưu toàn bộ từ trong Deck này ✓"}
          </Text>
        </Pressable>
      </View>

      {/* 6. MODAL BOTTOM SHEET: CHỌN BỘ THẺ (DECK PICKER) */}
      <Modal
        visible={isDeckModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsDeckModalOpen(false)}
      >
        <Pressable 
          onPress={() => setIsDeckModalOpen(false)}
          className="flex-1 bg-black/40 justify-end"
        >
          <Pressable 
            onPress={e => e.stopPropagation()} 
            className="bg-white rounded-t-[36px] p-6 pb-10 border-t-2 border-neutral-100 shadow-2xl max-h-[80%]"
          >
            {/* Modal Header */}
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">
                  Chọn bộ thẻ đích
                </Text>
                <Text className="font-medium text-[13px] text-neutral-400 font-inter">
                  Từ vựng lưu sẽ được tự động thêm vào bộ thẻ này
                </Text>
              </View>
              <Pressable 
                onPress={() => setIsDeckModalOpen(false)}
                className="w-9 h-9 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200"
              >
                <XIcon size={18} className="text-neutral-500" />
              </Pressable>
            </View>

            {/* Danh sách Deck */}
            <ScrollView className="max-h-[380px] my-2" showsVerticalScrollIndicator={false}>
              <View className="gap-2.5">
                {MOCK_DECKS.map(deck => {
                  const isSelected = selectedDeck.id === deck.id;

                  return (
                    <Pressable
                      key={deck.id}
                      onPress={() => handleSelectDeck(deck)}
                      className={cn(
                        "p-4 rounded-2xl border-2 flex-row items-center justify-between transition-all",
                        isSelected 
                          ? "bg-primary-50/50 border-primary-500 border-b-[4px]" 
                          : "bg-white border-neutral-200/80 active:bg-neutral-50"
                      )}
                    >
                      <View className="flex-row items-center gap-3.5 flex-1 pr-2">
                        <View className="w-12 h-12 rounded-xl bg-neutral-50 items-center justify-center border border-neutral-100">
                          <Text className="text-[24px]">{deck.emoji}</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-0.5">
                            {deck.name}
                          </Text>
                          <Text className="font-medium text-[13px] text-neutral-400 font-inter">
                            {deck.cardCount} thẻ · Mẫu {deck.template}
                          </Text>
                        </View>
                      </View>

                      {isSelected ? (
                        <View className="w-7 h-7 rounded-full bg-primary-500 items-center justify-center">
                          <CheckIcon size={16} className="text-white" />
                        </View>
                      ) : (
                        <View className="w-7 h-7 rounded-full border-2 border-neutral-300" />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            {/* Quick action tạo Deck mới */}
            <Pressable 
              onPress={() => {
                setIsDeckModalOpen(false);
                router.push('/decks' as any);
              }}
              className="mt-4 p-3.5 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 flex-row items-center justify-center gap-2 active:bg-neutral-100"
            >
              <PlusIcon size={18} className="text-primary-600" />
              <Text className="font-extrabold text-[14px] text-primary-600 font-nunito">
                Quản lý hoặc Tạo bộ thẻ mới
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
