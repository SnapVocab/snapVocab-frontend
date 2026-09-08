import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  ScrollView, 
  Keyboard, 
  Modal, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ChevronLeftIcon, 
  SearchIcon, 
  XIcon, 
  MicIcon,
  ClockIcon,
  CheckCircle2Icon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// ==========================================
// TEST STATE CONTROLLER
// ==========================================
type TestState = 'auto' | 'loading' | 'empty';
const TEST_STATE: TestState = 'auto';

const RECENT_SEARCHES = ['abandon', 'curious', 'resilient', 'opportunity'];
const AUTOCOMPLETE_SUGGESTIONS = [
  { text: 'abandon', meaning: 'từ bỏ' },
  { text: 'abandoned', meaning: 'bị bỏ rơi' },
  { text: 'abandonment', meaning: 'sự từ bỏ' },
  { text: 'abandoning', meaning: 'đang từ bỏ' }
];

const MOCK_RESULTS = [
  {
    id: 'abandon',
    word: 'abandon',
    ipa: '/əˈbændən/',
    meaning: 'từ bỏ, bỏ rơi',
    saved: true,
  },
  {
    id: 'abandoned',
    word: 'abandoned',
    ipa: '/əˈbændənd/',
    meaning: 'bị bỏ rơi, ruồng bỏ',
    saved: false,
  }
];

export default function DictionarySearchScreen() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Voice Search States
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'searching' | 'error' | 'unavailable' | 'permission_denied'>('idle');
  const [voiceText, setVoiceText] = useState('');

  let currentState: 'initial' | 'typing' | 'loading' | 'results' | 'empty' = 'initial';
  if (TEST_STATE === 'loading') currentState = 'loading';
  else if (TEST_STATE === 'empty') currentState = 'empty';
  else if (hasSearched) currentState = 'results';
  else if (query.length > 0) currentState = 'typing';

  const handleClear = () => {
    setQuery('');
    setHasSearched(false);
  };

  const handleMic = () => {
    Keyboard.dismiss();
    setIsVoiceModalOpen(true);
    setVoiceState('idle');
    setVoiceText('');
  };

  const startListening = () => {
    setVoiceState('listening');
    setVoiceText('');
    
    // Giả lập luồng nhận diện giọng nói (STT on-device)
    setTimeout(() => setVoiceText('qu'), 600);
    setTimeout(() => setVoiceText('quả '), 1100);
    setTimeout(() => setVoiceText('quả táo'), 1600);
    
    // Giả lập Backend Reverse Lookup (/words/search)
    setTimeout(() => {
      setVoiceState('searching');
      setTimeout(() => {
         setIsVoiceModalOpen(false);
         // Simulate successful mapping from "quả táo" -> "apple"
         router.push('/dictionary/apple');
      }, 1500);
    }, 2200);
  };

  const handleSearchSubmit = () => {
    if (query.trim().length > 0) {
      setHasSearched(true);
      Keyboard.dismiss();
    }
  };

  const handleResultTap = (id: string) => {
    router.push(`/dictionary/${id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* 1. HEADER */}
      <View className="h-14 flex-row items-center px-4">
        <Pressable 
          onPress={() => router.back()} 
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100 -ml-2"
        >
          <ChevronLeftIcon size={28} className="text-mascot-navy" />
        </Pressable>
        <Text className="flex-1 text-center font-extrabold text-[18px] text-mascot-navy font-nunito mr-8">
          Tra từ
        </Text>
      </View>

      {/* 2. SEARCH BAR */}
      <View className="px-4 py-2 z-10">
        <View className={cn(
          "flex-row items-center h-14 px-4 rounded-2xl bg-white border-2 shadow-sm transition-all",
          isFocused ? "border-primary-400 shadow-primary-500/10" : "border-neutral-100 shadow-black/5"
        )}>
          <SearchIcon size={20} className={isFocused ? "text-primary-500" : "text-neutral-400"} />
          
          <TextInput
            className="flex-1 h-full px-3 font-inter text-[16px] text-mascot-navy"
            placeholder="Tìm từ tiếng Anh..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              if (hasSearched) setHasSearched(false);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {query.length > 0 ? (
            <Pressable 
              onPress={handleClear}
              className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200"
            >
              <XIcon size={16} className="text-neutral-500" />
            </Pressable>
          ) : (
            <Pressable 
              onPress={handleMic}
              className="w-10 h-10 rounded-xl bg-primary-50 items-center justify-center active:bg-primary-100 active:scale-95 transition-all"
            >
              <MicIcon size={20} className="text-primary-500" />
            </Pressable>
          )}
        </View>
      </View>

      {/* 3. CONTENT AREA */}
      <ScrollView 
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {currentState === 'initial' && RECENT_SEARCHES.length > 0 && (
          <View>
            <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-3 px-1">Tìm kiếm gần đây</Text>
            <View className="flex-row flex-wrap gap-2.5">
              {RECENT_SEARCHES.map((item, index) => (
                <Pressable 
                  key={index}
                  onPress={() => {
                    setQuery(item);
                    setHasSearched(true);
                  }}
                  className="flex-row items-center bg-white px-4 py-2.5 rounded-full border border-neutral-100 shadow-sm shadow-black/5 active:bg-neutral-50 active:scale-95 transition-all"
                >
                  <ClockIcon size={14} className="text-neutral-400 mr-2" />
                  <Text className="font-medium text-[14px] text-neutral-600 font-inter">{item}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {currentState === 'typing' && (
          <View className="bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm shadow-black/5">
            {AUTOCOMPLETE_SUGGESTIONS.map((item, index) => {
              const matchIndex = item.text.toLowerCase().indexOf(query.toLowerCase());
              const hasMatch = matchIndex !== -1;
              return (
                <Pressable 
                  key={index}
                  onPress={() => {
                    setQuery(item.text);
                    setHasSearched(true);
                    Keyboard.dismiss();
                  }}
                  className={cn(
                    "flex-row items-center justify-between px-5 py-4 bg-white active:bg-neutral-50",
                    index !== AUTOCOMPLETE_SUGGESTIONS.length - 1 && "border-b border-neutral-100"
                  )}
                >
                  <View className="flex-row items-center flex-1">
                    <SearchIcon size={16} className="text-neutral-400 mr-3" />
                    <Text className="font-medium text-[16px] text-neutral-400 font-inter">
                      {hasMatch ? (
                        <>
                          <Text className="text-mascot-navy font-bold">
                            {item.text.substring(0, matchIndex + query.length)}
                          </Text>
                          {item.text.substring(matchIndex + query.length)}
                        </>
                      ) : (
                        item.text
                      )}
                    </Text>
                  </View>
                  <Text className="font-medium text-[13px] text-neutral-400 font-inter" numberOfLines={1}>
                    {item.meaning}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {currentState === 'results' && (
          <View>
            <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-3 px-1">Kết quả</Text>
            <View className="gap-3">
              {MOCK_RESULTS.map((item) => (
                <Pressable 
                  key={item.id}
                  onPress={() => handleResultTap(item.id)}
                  className="bg-white p-5 rounded-[24px] border-2 border-neutral-100 border-b-[4px] shadow-sm shadow-black/5 active:bg-neutral-50 active:translate-y-[2px] active:border-b-[2px] transition-all relative overflow-hidden"
                >
                  {item.saved && (
                    <View className="absolute top-4 right-4 bg-primary-50 px-2.5 py-1 rounded-md flex-row items-center gap-1">
                      <CheckCircle2Icon size={12} className="text-primary-600" />
                      <Text className="font-bold text-[10px] text-primary-600 font-inter uppercase tracking-wider">Đã lưu</Text>
                    </View>
                  )}
                  <Text className="font-extrabold text-[24px] text-mascot-navy font-nunito mb-1.5">{item.word}</Text>
                  <View className="flex-row items-center gap-2">
                    <Text className="font-medium text-[14px] text-neutral-500 font-inter">{item.ipa}</Text>
                    <Text className="font-medium text-[14px] text-neutral-300 font-inter">•</Text>
                    <Text className="font-bold text-[14px] text-neutral-700 font-inter">{item.meaning}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {currentState === 'empty' && (
          <View className="items-center justify-center py-12 px-6">
            <Snapy pose="to_mo" animation="idle" className="w-32 h-32 mb-6" />
            <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-2 text-center">
              Không tìm thấy từ
            </Text>
            <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center mb-8">
              Hãy kiểm tra lại chính tả hoặc thử một từ khóa khác xem sao nhé!
            </Text>
            <Pressable 
              onPress={() => {
                setQuery('');
                setHasSearched(false);
              }}
              className="w-full max-w-[200px] h-12 bg-primary-50 rounded-xl border-2 border-primary-100 active:bg-primary-100 transition-all flex-row items-center justify-center"
            >
              <Text className="text-primary-600 font-bold text-[15px] font-inter">Thử lại</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* ==========================================
          MH-DICT-03: VOICE SEARCH MODAL
          ========================================== */}
      <Modal visible={isVoiceModalOpen} transparent animationType="slide">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end bg-black/40"
        >
          {/* Dismiss area */}
          <Pressable className="flex-1" onPress={() => setIsVoiceModalOpen(false)} />
          
          <View className="bg-white rounded-t-3xl shadow-xl overflow-hidden pb-8">
            
            {/* Modal Header */}
            <View className="flex-row justify-between items-center p-6 pb-2">
              <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">Tra từ bằng giọng nói</Text>
              <Pressable onPress={() => setIsVoiceModalOpen(false)} className="w-8 h-8 bg-neutral-100 rounded-full items-center justify-center active:bg-neutral-200">
                <XIcon size={18} className="text-neutral-500" />
              </Pressable>
            </View>

            {/* Instruction / Status Text */}
            <View className="px-6 mb-4 items-center">
              <Text className="font-bold text-[15px] text-neutral-400 font-inter text-center">
                {voiceState === 'idle' && "Hãy nói một từ hoặc cụm từ tiếng Việt"}
                {voiceState === 'listening' && "Đang lắng nghe..."}
                {voiceState === 'searching' && "Đang tìm từ..."}
                {voiceState === 'error' && "Không nhận diện được, vui lòng thử lại"}
              </Text>
            </View>

            {/* Mascot Area */}
            <View className="items-center mb-4 h-[120px] justify-center">
              {voiceState === 'error' ? (
                <Snapy pose="bat_ngo" animation="shake" className="w-28 h-28" />
              ) : voiceState === 'listening' ? (
                <Snapy pose="tap_trung" animation="idle" className="w-28 h-28" />
              ) : voiceState === 'searching' ? (
                <Snapy pose="suy_nghi" animation="idle" className="w-28 h-28" />
              ) : (
                <Snapy pose="chao_mung" animation="wave" className="w-28 h-28" />
              )}
            </View>

            {/* Recognized Text Display (Transcript Window) */}
            <View className="px-6 mb-8 h-[70px] justify-center">
              {voiceText.length > 0 ? (
                <View className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 items-center justify-center">
                  <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito text-center">
                    {voiceText}
                  </Text>
                </View>
              ) : (
                <View className="h-full items-center justify-center">
                  {/* Placeholder space to prevent jumping */}
                </View>
              )}
            </View>

            {/* Microphone Button Area */}
            <View className="items-center px-6">
              {voiceState === 'error' ? (
                <View className="flex-row gap-4 w-full">
                  <Pressable 
                    onPress={() => setIsVoiceModalOpen(false)}
                    className="flex-1 h-14 bg-neutral-100 rounded-2xl items-center justify-center border-b-[4px] border-neutral-200 active:bg-neutral-200 active:translate-y-[2px] active:border-b-[2px] transition-all"
                  >
                    <Text className="font-bold text-[16px] text-neutral-600 font-inter">Hủy</Text>
                  </Pressable>
                  <Pressable 
                    onPress={startListening}
                    className="flex-1 h-14 bg-primary-500 rounded-2xl items-center justify-center border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all"
                  >
                    <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-[0.04em]">Thử lại</Text>
                  </Pressable>
                </View>
              ) : (
                <View className="relative items-center justify-center w-24 h-24">
                  {/* Pulse effect rings */}
                  {voiceState === 'listening' && (
                    <>
                      <View className="absolute w-24 h-24 rounded-full bg-primary-100 opacity-50 animate-ping" />
                      <View className="absolute w-20 h-20 rounded-full bg-primary-200 opacity-60 animate-ping delay-75" />
                    </>
                  )}
                  
                  {/* Main Mic Button */}
                  <Pressable 
                    onPress={voiceState === 'idle' ? startListening : undefined}
                    disabled={voiceState === 'searching'}
                    className={cn(
                      "w-20 h-20 rounded-full items-center justify-center border-b-[6px] active:translate-y-[4px] active:border-b-[2px] transition-all",
                      voiceState === 'idle' 
                        ? "bg-primary-500 border-primary-700 active:bg-primary-600" 
                        : (voiceState === 'listening' 
                            ? "bg-primary-600 border-primary-800" 
                            : "bg-neutral-300 border-neutral-400 opacity-70")
                    )}
                  >
                    <MicIcon size={32} className={voiceState === 'idle' || voiceState === 'listening' ? "text-white" : "text-neutral-500"} />
                  </Pressable>
                </View>
              )}
            </View>

          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}
