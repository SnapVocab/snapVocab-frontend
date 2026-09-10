import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  Image, 
  Modal, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ChevronLeftIcon, 
  AlertTriangleIcon, 
  Volume2Icon, 
  BookmarkIcon, 
  CheckIcon,
  Trash2Icon,
  XIcon,
  LayersIcon,
  SparklesIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { 
  getWordEntry, 
  AVAILABLE_DECKS, 
  WordEntry, 
  DeckItem 
} from '@/lib/dictionary-data';

export default function WordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<WordEntry>(() => getWordEntry(id || 'abandon'));
  const [selectedDeck, setSelectedDeck] = useState<DeckItem>(() => 
    AVAILABLE_DECKS.find(d => d.name === data.deckName) || AVAILABLE_DECKS[0]
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<string | null>(null);
  const [reportNote, setReportNote] = useState('');
  
  // Deck selection modal state
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastAction, setToastAction] = useState<(() => void) | null>(null);

  // Update data if id changes
  useEffect(() => {
    if (id) {
      const entry = getWordEntry(id);
      setData(entry);
      setSelectedDeck(AVAILABLE_DECKS.find(d => d.name === entry.deckName) || AVAILABLE_DECKS[0]);
    }
  }, [id]);

  const showToast = (message: string, action?: () => void) => {
    setToastMessage(message);
    setToastAction(action ? () => action : null);
    setTimeout(() => {
      setToastMessage(null);
      setToastAction(null);
    }, 4000);
  };

  const handleAudio = () => {
    if (!data.hasAudio) return;
    
    // Web Speech API / TTS fallback
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(data.word);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      } catch {
        setIsPlaying(true);
        setTimeout(() => setIsPlaying(false), 1200);
      }
    } else {
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 1200);
    }
  };

  const handleSave = () => {
    setData(prev => ({ ...prev, isSaved: true, deckName: selectedDeck.name }));
    showToast(`Đã lưu vào bộ thẻ "${selectedDeck.name}"`, () => setIsDeckModalOpen(true));
  };

  const handleRemove = () => {
    setData(prev => ({ ...prev, isSaved: false }));
    showToast(`Đã xóa khỏi bộ thẻ "${selectedDeck.name}"`);
  };

  const handleSelectDeck = (deck: DeckItem) => {
    setSelectedDeck(deck);
    setData(prev => ({ ...prev, deckName: deck.name }));
    setIsDeckModalOpen(false);
    showToast(`Đã chuyển từ sang bộ thẻ "${deck.name}"`);
  };

  const submitReport = () => {
    setIsReportOpen(false);
    setReportReason(null);
    setReportNote('');
    showToast('Cảm ơn bạn! Báo lỗi đã được gửi đến ban biên tập.');
  };

  const handleNavigateWord = (word: string) => {
    router.push(`/dictionary/${encodeURIComponent(word.toLowerCase().trim())}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      
      {/* 1. HEADER */}
      <View className="h-14 flex-row items-center justify-between px-4 z-20 border-b border-neutral-100 bg-white">
        <Pressable 
          onPress={() => router.back()} 
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100"
        >
          <ChevronLeftIcon size={28} className="text-mascot-navy" />
        </Pressable>
        <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">
          Chi tiết từ
        </Text>
        <Pressable 
          onPress={() => setIsReportOpen(true)}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100"
        >
          <AlertTriangleIcon size={20} className="text-neutral-400" />
        </Pressable>
      </View>

      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <View className="absolute top-16 left-4 right-4 z-50 bg-mascot-navy px-4 py-3 rounded-2xl shadow-xl flex-row items-center justify-between animate-fade-in">
          <View className="flex-row items-center gap-2.5 flex-1 mr-2">
            <CheckIcon size={18} className="text-primary-400" />
            <Text className="text-white text-[13px] font-inter font-medium leading-snug">
              {toastMessage}
            </Text>
          </View>
          {toastAction && (
            <Pressable 
              onPress={toastAction}
              className="bg-white/20 px-2.5 py-1 rounded-lg active:bg-white/30"
            >
              <Text className="text-primary-300 text-[12px] font-bold font-inter">Đổi Deck</Text>
            </Pressable>
          )}
        </View>
      )}

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 180 }}
        showsVerticalScrollIndicator={false}
      >
        
        {/* 2. WORD HERO */}
        <View className="px-6 py-5 bg-neutral-50/50 border-b border-neutral-100">
          <Text className="font-extrabold text-[42px] text-mascot-navy font-nunito mb-2 leading-tight tracking-tight">
            {data.word}
          </Text>
          <View className="flex-row items-center gap-4">
            {data.ipa ? (
              <Text className="font-medium text-[18px] text-neutral-500 font-inter">{data.ipa}</Text>
            ) : (
              <Text className="font-medium text-[16px] text-neutral-300 font-inter italic">Chưa có phiên âm</Text>
            )}
            
            <Pressable 
              onPress={handleAudio}
              className={cn(
                "h-10 px-4 rounded-full border-b-[3px] active:translate-y-[1.5px] active:border-b-[1.5px] transition-all flex-row items-center justify-center gap-2",
                isPlaying ? "bg-info-100 border-info-300" : "bg-info-50 border-info-200 active:bg-info-100",
                !data.hasAudio && "bg-neutral-100 border-neutral-200 opacity-70"
              )}
            >
              <Volume2Icon size={18} className={isPlaying ? "text-info-700 animate-pulse" : "text-info-600"} />
              <Text className={cn("font-bold text-[13px] font-inter", isPlaying ? "text-info-700" : "text-info-600")}>
                {isPlaying ? "Đang phát..." : "Phát âm"}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* 3. DETECTION IMAGE CROP (IF COMING FROM CAMERA) */}
        {data.fromCamera && data.imageCropUrl && (
          <View className="px-6 py-4 border-b border-neutral-100">
            <View className="flex-row items-center gap-1.5 mb-2.5">
              <SparklesIcon size={14} className="text-mascot-orange" />
              <Text className="font-extrabold text-[12px] text-mascot-navy/70 uppercase tracking-widest font-nunito">
                ẢNH NHẬN DIỆN TỪ CAMERA
              </Text>
            </View>
            <View className="w-24 h-24 rounded-2xl bg-neutral-100 overflow-hidden shadow-sm border border-neutral-200/80">
              <Image 
                source={{ uri: data.imageCropUrl }} 
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>
        )}

        {/* 4. MEANINGS GROUPED BY POS */}
        <View className="px-6 py-5">
          <Text className="font-extrabold text-[19px] text-mascot-navy font-nunito mb-4">Nghĩa của từ</Text>
          <View className="gap-6">
            {data.meanings.map((group, idx) => (
              <View key={idx} className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm shadow-black/5">
                {/* POS Label */}
                <View className="bg-primary-100/70 self-start px-3 py-1 rounded-lg mb-3">
                  <Text className="font-bold text-[13px] text-primary-700 font-inter uppercase tracking-wide">
                    {group.pos}
                  </Text>
                </View>
                {/* Definitions */}
                <View className="gap-2.5">
                  {group.definitions.map((def, i) => (
                    <View key={i} className="flex-row items-start gap-2.5">
                      <View className="w-5 h-5 rounded-full bg-neutral-100 items-center justify-center mt-0.5">
                        <Text className="font-bold text-[12px] text-neutral-500 font-inter">{i + 1}</Text>
                      </View>
                      <Text className="flex-1 font-medium text-[16px] text-neutral-800 font-inter leading-relaxed">
                        {def}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 5. EXAMPLE SENTENCE */}
        {data.example && (
          <View className="px-6 mb-6">
            <Text className="font-extrabold text-[19px] text-mascot-navy font-nunito mb-3">Câu ví dụ</Text>
            <View className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/70">
              <Text className="font-bold text-[16px] text-mascot-navy font-inter leading-relaxed mb-1.5">
                "{data.example.en}"
              </Text>
              <Text className="font-medium text-[15px] text-neutral-500 font-inter leading-relaxed">
                {data.example.vi}
              </Text>
            </View>
          </View>
        )}

        {/* 6. RELATED VOCABULARY */}
        <View className="px-6 mb-8">
          <Text className="font-extrabold text-[19px] text-mascot-navy font-nunito mb-3">Từ liên quan</Text>
          
          {data.synonyms.length > 0 && (
            <View className="mb-4">
              <Text className="font-bold text-[13px] text-neutral-400 font-inter mb-2">Đồng nghĩa</Text>
              <View className="flex-row flex-wrap gap-2">
                {data.synonyms.map((word, i) => (
                  <Pressable 
                    key={i} 
                    onPress={() => handleNavigateWord(word)}
                    className="bg-white px-3.5 py-2 rounded-xl border border-neutral-200 active:bg-neutral-50 shadow-sm shadow-black/5 active:scale-95 transition-all"
                  >
                    <Text className="font-semibold text-[14px] text-mascot-navy font-inter">{word}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {data.antonyms.length > 0 && (
            <View className="mb-4">
              <Text className="font-bold text-[13px] text-neutral-400 font-inter mb-2">Trái nghĩa</Text>
              <View className="flex-row flex-wrap gap-2">
                {data.antonyms.map((word, i) => (
                  <Pressable 
                    key={i} 
                    onPress={() => handleNavigateWord(word)}
                    className="bg-white px-3.5 py-2 rounded-xl border border-neutral-200 active:bg-neutral-50 shadow-sm shadow-black/5 active:scale-95 transition-all"
                  >
                    <Text className="font-semibold text-[14px] text-mascot-navy font-inter">{word}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {data.related.length > 0 && (
            <View>
              <Text className="font-bold text-[13px] text-neutral-400 font-inter mb-2">Từ cùng gốc</Text>
              <View className="flex-row flex-wrap gap-2">
                {data.related.map((word, i) => (
                  <Pressable 
                    key={i} 
                    onPress={() => handleNavigateWord(word)}
                    className="bg-white px-3.5 py-2 rounded-xl border border-neutral-200 active:bg-neutral-50 shadow-sm shadow-black/5 active:scale-95 transition-all"
                  >
                    <Text className="font-semibold text-[14px] text-mascot-navy font-inter">{word}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>

      </ScrollView>

      {/* 7. STICKY ACTION AREA (SAVE & DECK SWITCH) */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-200/70 p-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        
        {/* Deck Header Info with "Đổi" button */}
        <View className="flex-row items-center justify-between px-2 mb-3">
          <View className="flex-row items-center gap-1.5">
            <LayersIcon size={14} className="text-neutral-400" />
            <Text className="font-bold text-[12px] text-neutral-400 font-inter uppercase tracking-wider">
              {data.isSaved ? "ĐÃ LƯU TRONG BỘ THẺ" : "LƯU VÀO BỘ THẺ"}
            </Text>
          </View>
          
          <Pressable 
            onPress={() => setIsDeckModalOpen(true)} 
            className="flex-row items-center gap-1.5 bg-neutral-100 px-3 py-1.5 rounded-full active:bg-neutral-200"
          >
            <Text className="font-extrabold text-[13px] text-mascot-navy font-inter">
              {selectedDeck.name}
            </Text>
            <Text className="text-[12px] text-primary-600 font-bold font-inter">
              (Đổi)
            </Text>
          </Pressable>
        </View>

        {!data.isSaved ? (
          <Pressable 
            onPress={handleSave}
            className="h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all flex-row items-center justify-center gap-2.5 shadow-md shadow-primary-500/20"
          >
            <BookmarkIcon size={20} fill="#FFFFFF" className="text-white" />
            <Text className="text-white font-extrabold text-[16px] uppercase font-nunito tracking-[0.04em]">
              LƯU TỪ VỰNG
            </Text>
          </Pressable>
        ) : (
          <View className="flex-row gap-3">
            <Pressable 
              onPress={handleRemove}
              className="h-14 px-5 bg-white rounded-2xl border-2 border-danger-100 border-b-[4px] border-b-danger-300 active:bg-danger-50 active:translate-y-[2px] active:border-b-2 items-center justify-center transition-all shadow-sm"
            >
              <Trash2Icon size={20} className="text-danger-500" />
            </Pressable>
            
            <View className="flex-1 h-14 bg-neutral-100 rounded-2xl border-b-[2px] border-neutral-200 flex-row items-center justify-center gap-2">
              <CheckIcon size={20} className="text-primary-600" />
              <Text className="text-neutral-500 font-extrabold text-[16px] uppercase font-nunito tracking-[0.04em]">
                ĐÃ LƯU ✓
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* ==========================================
          DECK SELECTOR MODAL (BOTTOM SHEET)
          ========================================== */}
      <Modal visible={isDeckModalOpen} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <Pressable className="flex-1" onPress={() => setIsDeckModalOpen(false)} />
          <View className="bg-white rounded-t-3xl p-6 shadow-2xl pb-10">
            
            <View className="flex-row justify-between items-center mb-5">
              <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">
                Chọn bộ thẻ (Deck)
              </Text>
              <Pressable 
                onPress={() => setIsDeckModalOpen(false)} 
                className="w-8 h-8 bg-neutral-100 rounded-full items-center justify-center active:bg-neutral-200"
              >
                <XIcon size={18} className="text-neutral-500" />
              </Pressable>
            </View>

            <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-4">
              Từ vựng này sẽ được lưu và ôn tập hàng ngày trong bộ thẻ được chọn:
            </Text>

            <View className="gap-2.5">
              {AVAILABLE_DECKS.map((deck) => {
                const isSelected = selectedDeck.id === deck.id;
                return (
                  <Pressable 
                    key={deck.id}
                    onPress={() => handleSelectDeck(deck)}
                    className={cn(
                      "p-4 rounded-2xl border-2 flex-row items-center justify-between transition-all",
                      isSelected ? "border-primary-500 bg-primary-50/60" : "border-neutral-200/80 bg-white active:bg-neutral-50"
                    )}
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="w-10 h-10 rounded-xl bg-neutral-100 items-center justify-center">
                        <LayersIcon size={20} className={isSelected ? "text-primary-600" : "text-neutral-500"} />
                      </View>
                      <View>
                        <Text className={cn("font-bold text-[15px] font-inter", isSelected ? "text-primary-700" : "text-mascot-navy")}>
                          {deck.name}
                        </Text>
                        <Text className="font-medium text-[12px] text-neutral-400 font-inter">
                          {deck.count} từ vựng
                        </Text>
                      </View>
                    </View>

                    {isSelected && (
                      <View className="w-7 h-7 rounded-full bg-primary-500 items-center justify-center">
                        <CheckIcon size={16} className="text-white" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>

          </View>
        </View>
      </Modal>

      {/* ==========================================
          REPORT ERROR MODAL
          ========================================== */}
      <Modal visible={isReportOpen} transparent animationType="fade">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end bg-black/40"
        >
          <Pressable className="flex-1" onPress={() => setIsReportOpen(false)} />
          <View className="bg-white rounded-t-3xl p-6 shadow-xl pb-8">
            
            <View className="flex-row justify-between items-center mb-5">
              <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">Báo lỗi từ vựng</Text>
              <Pressable onPress={() => setIsReportOpen(false)} className="w-8 h-8 bg-neutral-100 rounded-full items-center justify-center active:bg-neutral-200">
                <XIcon size={18} className="text-neutral-500" />
              </Pressable>
            </View>

            <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-4">
              Hãy giúp chúng tôi cải thiện chất lượng dữ liệu cho từ <Text className="font-bold text-mascot-navy">"{data.word}"</Text>:
            </Text>

            <View className="gap-2.5 mb-5">
              {['Nghĩa sai', 'Phiên âm sai', 'Từ vựng sai', 'Câu ví dụ chưa chính xác'].map((reason) => (
                <Pressable 
                  key={reason} 
                  onPress={() => setReportReason(reason)}
                  className={cn(
                    "p-4 rounded-xl border-2 flex-row items-center justify-between transition-all",
                    reportReason === reason ? "border-primary-500 bg-primary-50" : "border-neutral-200/80 bg-white active:bg-neutral-50"
                  )}
                >
                  <Text className={cn("font-bold text-[15px] font-inter", reportReason === reason ? "text-primary-700" : "text-neutral-600")}>
                    {reason}
                  </Text>
                  {reportReason === reason && <CheckIcon size={18} className="text-primary-500" />}
                </Pressable>
              ))}
            </View>

            <Text className="font-bold text-[14px] text-neutral-500 font-inter mb-2">Ghi chú thêm (Tùy chọn)</Text>
            <TextInput 
              className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 font-inter text-[15px] text-mascot-navy mb-6 min-h-[80px]"
              style={Platform.OS === 'web' ? ({ outline: 'none' } as any) : undefined}
              placeholder="Bạn thấy có vấn đề gì ở từ này?"
              placeholderTextColor="#9CA3AF"
              value={reportNote}
              onChangeText={setReportNote}
              multiline
              textAlignVertical="top"
            />

            <Pressable 
              onPress={submitReport}
              disabled={!reportReason}
              className={cn(
                "w-full h-14 rounded-2xl border-b-[4px] flex-row items-center justify-center transition-all",
                reportReason 
                  ? "bg-primary-500 border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px]" 
                  : "bg-neutral-200 border-neutral-300 opacity-70"
              )}
            >
              <Text className={cn("font-extrabold text-[16px] uppercase font-nunito tracking-[0.04em]", reportReason ? "text-white" : "text-neutral-400")}>
                GỬI BÁO LỖI
              </Text>
            </Pressable>

          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}
