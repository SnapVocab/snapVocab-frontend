import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Platform, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  ChevronLeftIcon, 
  Volume2Icon, 
  CheckCircle2Icon,
  FoldersIcon,
  RefreshCwIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

const { width } = Dimensions.get('window');

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_TOPIC = {
  id: 't1_1',
  title: 'Sân bay',
  emoji: '✈️',
  description: 'Các từ vựng thường gặp khi làm thủ tục và di chuyển tại sân bay.',
  totalWords: 72,
  progress: 42,
  words: [
    {
      id: 'w1',
      word: 'boarding pass',
      ipa: '/ˈbɔːrdɪŋ pæs/',
      meaning: 'thẻ lên máy bay',
      hasAudio: true,
      initialSaved: false,
    },
    {
      id: 'w2',
      word: 'terminal',
      ipa: '/ˈtɜːrmɪnəl/',
      meaning: 'nhà ga',
      hasAudio: true,
      initialSaved: true,
    },
    {
      id: 'w3',
      word: 'luggage',
      ipa: '/ˈlʌɡɪdʒ/',
      meaning: 'hành lý',
      hasAudio: true,
      initialSaved: false,
    },
    {
      id: 'w4',
      word: 'customs',
      ipa: '/ˈkʌstəmz/',
      meaning: 'hải quan',
      hasAudio: false,
      initialSaved: false,
    },
    {
      id: 'w5',
      word: 'departure',
      ipa: '/dɪˈpɑːrtʃər/',
      meaning: 'khởi hành',
      hasAudio: true,
      initialSaved: false,
    }
  ]
};

const MOCK_DECKS = ['English Basics', 'Travel English', 'IELTS Core'];

export default function TopicDetailScreen() {
  const { id } = useLocalSearchParams();
  
  const [activeDeck, setActiveDeck] = useState(MOCK_DECKS[0]);
  const [savedWordIds, setSavedWordIds] = useState<Set<string>>(new Set());
  
  // Toast State
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastAnim] = useState(new Animated.Value(0));

  // Initialize saved words from mock data
  useEffect(() => {
    const initialSaved = new Set<string>();
    MOCK_TOPIC.words.forEach(w => {
      // Giả lập: 'terminal' luôn được lưu trong 'English Basics'
      if (w.initialSaved && activeDeck === 'English Basics') {
        initialSaved.add(w.id);
      }
    });
    setSavedWordIds(initialSaved);
  }, [activeDeck]);

  const showToast = (message: string) => {
    setToastMsg(message);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start(() => setToastMsg(null));
  };

  const handleSaveWord = (wordId: string) => {
    if (savedWordIds.has(wordId)) return;
    
    // Simulate save
    setSavedWordIds(prev => {
      const next = new Set(prev);
      next.add(wordId);
      return next;
    });
    
    showToast(`Đã lưu vào ${activeDeck}`);
  };

  const handleSaveAll = () => {
    const eligibleWords = MOCK_TOPIC.words.filter(w => !savedWordIds.has(w.id));
    
    if (eligibleWords.length === 0) {
      showToast('Tất cả từ đã có trong Deck này');
      return;
    }

    setSavedWordIds(prev => {
      const next = new Set(prev);
      eligibleWords.forEach(w => next.add(w.id));
      return next;
    });

    const skippedCount = MOCK_TOPIC.words.length - eligibleWords.length;
    if (skippedCount > 0) {
      showToast(`Đã lưu ${eligibleWords.length} từ · Bỏ qua ${skippedCount} từ đã có`);
    } else {
      showToast(`Đã lưu toàn bộ ${eligibleWords.length} từ vào ${activeDeck}`);
    }
  };

  const handleChangeDeck = () => {
    // Giả lập đổi Deck xoay vòng
    const currentIndex = MOCK_DECKS.indexOf(activeDeck);
    const nextIndex = (currentIndex + 1) % MOCK_DECKS.length;
    setActiveDeck(MOCK_DECKS[nextIndex]);
    showToast(`Đã đổi sang Deck: ${MOCK_DECKS[nextIndex]}`);
  };

  const playAudio = (word: string) => {
    // Giả lập phát âm thanh
    console.log(`Playing audio for: ${word}`);
  };

  const eligibleCount = MOCK_TOPIC.words.filter(w => !savedWordIds.has(w.id)).length;

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      <View className="flex-row items-center justify-between px-4 py-3 bg-white z-10 border-b border-neutral-100">
        <Pressable 
          onPress={() => router.back()} 
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100 -ml-2"
        >
          <ChevronLeftIcon size={28} className="text-mascot-navy" />
        </Pressable>
        <Text className="flex-1 text-center font-extrabold text-[18px] text-mascot-navy font-nunito mr-8" numberOfLines={1}>
          {MOCK_TOPIC.emoji} {MOCK_TOPIC.title}
        </Text>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >

        <View className="bg-white px-5 pt-4 pb-6 border-b border-neutral-100 mb-2">
          <Text className="font-extrabold text-[24px] text-mascot-navy font-nunito mb-2">{MOCK_TOPIC.title}</Text>
          <Text className="font-medium text-[15px] text-neutral-500 font-inter leading-relaxed mb-4">
            {MOCK_TOPIC.description}
          </Text>
          
          <View className="flex-row items-center justify-between">
            <Text className="font-bold text-[14px] text-neutral-400 font-inter">{MOCK_TOPIC.totalWords} từ vựng</Text>
            {MOCK_TOPIC.progress > 0 && (
              <View className="flex-row items-center gap-2">
                <Text className="font-extrabold text-[14px] text-primary-600 font-nunito">{MOCK_TOPIC.progress}% đã học</Text>
                <View className="w-20 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <View 
                    className="h-full bg-primary-500 rounded-full" 
                    style={{ width: `${MOCK_TOPIC.progress}%` }}
                  />
                </View>
              </View>
            )}
          </View>
        </View>


        <View className="px-4 mb-4">
          <View className="bg-white rounded-[16px] p-4 border border-neutral-100 shadow-sm shadow-black/5 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-info-50 rounded-xl items-center justify-center">
                <FoldersIcon size={20} className="text-info-500" />
              </View>
              <View>
                <Text className="font-bold text-[12px] text-neutral-400 font-inter uppercase tracking-wider mb-0.5">Deck đích</Text>
                <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito">{activeDeck}</Text>
              </View>
            </View>
            <Pressable 
              onPress={handleChangeDeck}
              className="bg-neutral-50 px-3 py-2 rounded-lg active:bg-neutral-100 flex-row items-center gap-1.5"
            >
              <RefreshCwIcon size={14} className="text-neutral-500" />
              <Text className="font-bold text-[13px] text-neutral-600 font-inter">Đổi Deck</Text>
            </Pressable>
          </View>
        </View>


        <View className="px-4">
          <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-3 px-1">Từ vựng</Text>
          
          {MOCK_TOPIC.words.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Snapy pose="doc_sach" animation="idle" className="w-28 h-28 mb-4" />
              <Text className="font-bold text-[15px] text-neutral-500 font-inter">Chủ đề này chưa có từ vựng</Text>
            </View>
          ) : (
            <View className="gap-3">
              {MOCK_TOPIC.words.map(item => {
                const isSaved = savedWordIds.has(item.id);
                
                return (
                  <Pressable 
                    key={item.id}
                    onPress={() => {
                      // Navigate to MH-DICT-02 Word Detail
                      router.push(`/dictionary/${item.word}` as any);
                    }}
                    className="bg-white rounded-[20px] p-5 border-2 border-neutral-100 border-b-[4px] shadow-sm shadow-black/5 active:bg-neutral-50 active:translate-y-[2px] active:border-b-[2px] transition-all"
                  >
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1 pr-2">
                        <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito mb-1">{item.word}</Text>
                        {item.ipa ? (
                          <Text className="font-medium text-[14px] text-neutral-400 font-inter">{item.ipa}</Text>
                        ) : (
                          <Text className="font-medium text-[13px] text-neutral-300 font-inter italic">Chưa có phiên âm</Text>
                        )}
                      </View>
                      
                      {item.hasAudio && (
                        <Pressable 
                          onPress={(e) => {
                            e.stopPropagation();
                            playAudio(item.word);
                          }}
                          className="w-10 h-10 bg-info-50 rounded-full items-center justify-center active:bg-info-100 active:scale-95 transition-all"
                        >
                          <Volume2Icon size={20} className="text-info-500" />
                        </Pressable>
                      )}
                    </View>
                    
                    <Text className="font-bold text-[15px] text-neutral-600 font-inter mb-4">{item.meaning}</Text>
                    
                    <View className="flex-row items-center justify-between mt-1">
                      <View className="flex-1" />
                      
                      {isSaved ? (
                        <View className="flex-row items-center gap-1.5 px-3 py-2">
                          <CheckCircle2Icon size={16} className="text-neutral-400" />
                          <Text className="font-bold text-[14px] text-neutral-400 font-inter">Đã lưu ✓</Text>
                        </View>
                      ) : (
                        <Pressable 
                          onPress={(e) => {
                            e.stopPropagation();
                            handleSaveWord(item.id);
                          }}
                          className="px-6 py-2.5 bg-primary-500 rounded-xl border-b-[3px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[1px] transition-all"
                        >
                          <Text className="font-extrabold text-[14px] text-white uppercase font-nunito tracking-wide">Lưu</Text>
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


      <View className="absolute bottom-0 left-0 right-0 p-4 pt-2 pb-8 bg-white/90 backdrop-blur-md border-t border-neutral-100 shadow-lg shadow-black/10">
        <Pressable 
          onPress={handleSaveAll}
          disabled={eligibleCount === 0}
          className={cn(
            "h-14 rounded-2xl items-center justify-center border-b-[4px] active:translate-y-[2px] active:border-b-[2px] transition-all flex-row gap-2",
            eligibleCount > 0 
              ? "bg-primary-500 border-primary-700 active:bg-primary-600" 
              : "bg-neutral-200 border-neutral-300 opacity-80"
          )}
        >
          <Text className={cn(
            "font-extrabold text-[16px] uppercase font-nunito tracking-[0.04em]",
            eligibleCount > 0 ? "text-white" : "text-neutral-500"
          )}>
            {eligibleCount > 0 ? `Lưu tất cả · ${eligibleCount} từ` : "Đã lưu toàn bộ chủ đề"}
          </Text>
        </Pressable>
      </View>


      {toastMsg && (
        <Animated.View 
          style={{
            opacity: toastAnim,
            transform: [{ 
              translateY: toastAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0]
              }) 
            }]
          }}
          className="absolute top-[60px] left-4 right-4 bg-mascot-navy px-4 py-3 rounded-xl shadow-lg shadow-black/20 flex-row items-center justify-center z-50"
        >
          <Text className="font-bold text-[14px] text-white font-inter text-center">{toastMsg}</Text>
        </Animated.View>
      )}

    </SafeAreaView>
  );
}
