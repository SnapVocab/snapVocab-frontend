import React, { useState } from 'react';
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
  CheckCircle2Icon,
  Trash2Icon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';
import { DICTIONARY_STORE } from '@/lib/dictionary-data';

export default function DictionarySearchScreen() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'abandon', 'curious', 'resilient', 'opportunity'
  ]);

  // Voice Search States
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'searching' | 'error'>('idle');
  const [voiceText, setVoiceText] = useState('');

  // Suggestions filtered by query
  const autocompleteSuggestions = Object.values(DICTIONARY_STORE).filter(item => 
    item.word.toLowerCase().includes(query.toLowerCase().trim())
  );

  // Search results
  const searchResults = Object.values(DICTIONARY_STORE).filter(item => {
    const q = query.toLowerCase().trim();
    return item.word.toLowerCase().includes(q) || 
      item.meanings.some(m => m.definitions.some(d => d.toLowerCase().includes(q)));
  });

  let currentState: 'initial' | 'typing' | 'results' | 'empty' = 'initial';
  if (hasSearched) {
    currentState = searchResults.length > 0 ? 'results' : 'empty';
  } else if (query.trim().length > 0) {
    currentState = 'typing';
  }

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
    const trimmed = query.trim();
    if (trimmed.length > 0) {
      if (!recentSearches.includes(trimmed.toLowerCase())) {
        setRecentSearches(prev => [trimmed.toLowerCase(), ...prev.slice(0, 5)]);
      }
      setHasSearched(true);
      Keyboard.dismiss();
    }
  };

  const handleSelectRecent = (term: string) => {
    setQuery(term);
    setHasSearched(true);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  const handleResultTap = (id: string) => {
    router.push(`/dictionary/${id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* 1. HEADER */}
      <View className="h-14 flex-row items-center justify-between px-4">
        <Pressable 
          onPress={() => router.back()} 
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100"
        >
          <ChevronLeftIcon size={28} className="text-mascot-navy" />
        </Pressable>
        <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">
          Tra từ
        </Text>
        <View className="w-10" />
      </View>

      {/* 2. SEARCH BAR */}
      <View className="px-4 py-2 z-10">
        <View className={cn(
          "flex-row items-center h-14 px-4 rounded-2xl bg-white border-2 shadow-sm transition-all",
          isFocused ? "border-primary-500 shadow-primary-500/10" : "border-neutral-200/70 shadow-black/5"
        )}>
          <SearchIcon size={20} className={isFocused ? "text-primary-500" : "text-neutral-400"} />
          
          <TextInput
            className="flex-1 h-full px-3 font-inter text-[16px] text-mascot-navy"
            style={Platform.OS === 'web' ? ({ outline: 'none' } as any) : undefined}
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
              <MicIcon size={20} className="text-primary-600" />
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
        {/* RECENT SEARCHES */}
        {currentState === 'initial' && recentSearches.length > 0 && (
          <View>
            <View className="flex-row items-center justify-between mb-3 px-1">
              <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">Tìm kiếm gần đây</Text>
              <Pressable onPress={handleClearRecent} className="flex-row items-center gap-1 active:opacity-70">
                <Trash2Icon size={14} className="text-neutral-400" />
                <Text className="font-semibold text-[13px] text-neutral-400 font-inter">Xóa</Text>
              </Pressable>
            </View>
            <View className="flex-row flex-wrap gap-2.5">
              {recentSearches.map((item, index) => (
                <Pressable 
                  key={index}
                  onPress={() => handleSelectRecent(item)}
                  className="flex-row items-center bg-white px-4 py-2.5 rounded-full border border-neutral-200/80 shadow-sm shadow-black/5 active:bg-neutral-50 active:scale-95 transition-all"
                >
                  <ClockIcon size={14} className="text-neutral-400 mr-2" />
                  <Text className="font-medium text-[14px] text-neutral-700 font-inter">{item}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* AUTOCOMPLETE SUGGESTIONS */}
        {currentState === 'typing' && (
          <View className="bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm shadow-black/5">
            {autocompleteSuggestions.length > 0 ? (
              autocompleteSuggestions.map((item, index) => {
                const matchIndex = item.word.toLowerCase().indexOf(query.toLowerCase());
                const hasMatch = matchIndex !== -1;
                const primaryDef = item.meanings[0]?.definitions[0] || '';
                return (
                  <Pressable 
                    key={item.id}
                    onPress={() => handleResultTap(item.id)}
                    className={cn(
                      "flex-row items-center justify-between px-5 py-4 bg-white active:bg-neutral-50",
                      index !== autocompleteSuggestions.length - 1 && "border-b border-neutral-100"
                    )}
                  >
                    <View className="flex-row items-center flex-1 mr-3">
                      <SearchIcon size={16} className="text-neutral-400 mr-3" />
                      <Text className="font-medium text-[16px] text-neutral-400 font-inter">
                        {hasMatch ? (
                          <>
                            <Text className="text-mascot-navy font-bold">
                              {item.word.substring(0, matchIndex + query.length)}
                            </Text>
                            {item.word.substring(matchIndex + query.length)}
                          </>
                        ) : (
                          item.word
                        )}
                      </Text>
                    </View>
                    <Text className="font-medium text-[13px] text-neutral-400 font-inter max-w-[45%]" numberOfLines={1}>
                      {primaryDef}
                    </Text>
                  </Pressable>
                );
              })
            ) : (
              <Pressable 
                onPress={handleSearchSubmit}
                className="flex-row items-center px-5 py-4 active:bg-neutral-50"
              >
                <SearchIcon size={16} className="text-primary-500 mr-3" />
                <Text className="font-medium text-[15px] text-neutral-600 font-inter">
                  Tìm kiếm <Text className="font-bold text-primary-600">"{query}"</Text>
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* RESULTS LIST */}
        {currentState === 'results' && (
          <View>
            <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-3 px-1">
              Kết quả ({searchResults.length})
            </Text>
            <View className="gap-3">
              {searchResults.map((item) => {
                const primaryDef = item.meanings[0]?.definitions[0] || '';
                return (
                  <Pressable 
                    key={item.id}
                    onPress={() => handleResultTap(item.id)}
                    className="bg-white p-5 rounded-[24px] border-2 border-neutral-100 border-b-[4px] shadow-sm shadow-black/5 active:bg-neutral-50 active:translate-y-[2px] active:border-b-[2px] transition-all relative overflow-hidden"
                  >
                    {item.isSaved && (
                      <View className="absolute top-4 right-4 bg-primary-50 px-2.5 py-1 rounded-md flex-row items-center gap-1">
                        <CheckCircle2Icon size={12} className="text-primary-600" />
                        <Text className="font-bold text-[10px] text-primary-600 font-inter uppercase tracking-wider">Đã lưu</Text>
                      </View>
                    )}
                    <Text className="font-extrabold text-[24px] text-mascot-navy font-nunito mb-1.5">{item.word}</Text>
                    <View className="flex-row items-center gap-2">
                      <Text className="font-medium text-[14px] text-neutral-500 font-inter">{item.ipa}</Text>
                      <Text className="font-medium text-[14px] text-neutral-300 font-inter">•</Text>
                      <Text className="font-bold text-[14px] text-neutral-700 font-inter" numberOfLines={1}>{primaryDef}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* EMPTY STATE */}
        {currentState === 'empty' && (
          <View className="items-center justify-center py-12 px-6">
            <View className="w-32 h-32 items-center justify-center mb-6">
              <Snapy pose="to_mo" animation="idle" style={{ width: 110, height: 110 }} />
            </View>
            <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-2 text-center">
              Không tìm thấy từ "{query}"
            </Text>
            <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center mb-8">
              Hãy kiểm tra lại chính tả hoặc thử một từ khóa khác xem sao nhé!
            </Text>
            <Pressable 
              onPress={() => {
                setQuery('');
                setHasSearched(false);
              }}
              className="w-full max-w-[200px] h-12 bg-primary-50 rounded-xl border-2 border-primary-200 active:bg-primary-100 transition-all flex-row items-center justify-center"
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
          
          <View className="bg-white rounded-t-3xl shadow-2xl overflow-hidden pb-8">
            
            {/* Modal Header */}
            <View className="flex-row justify-between items-center p-6 pb-2">
              <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">Tra từ bằng giọng nói</Text>
              <Pressable onPress={() => setIsVoiceModalOpen(false)} className="w-8 h-8 bg-neutral-100 rounded-full items-center justify-center active:bg-neutral-200">
                <XIcon size={18} className="text-neutral-500" />
              </Pressable>
            </View>

            {/* Instruction / Status Text */}
            <View className="px-6 mb-3 items-center">
              <Text className="font-bold text-[15px] text-neutral-400 font-inter text-center">
                {voiceState === 'idle' && "Hãy nói một từ hoặc cụm từ tiếng Việt"}
                {voiceState === 'listening' && "Đang lắng nghe..."}
                {voiceState === 'searching' && "Đang tìm từ..."}
                {voiceState === 'error' && "Không nhận diện được, vui lòng thử lại"}
              </Text>
            </View>

            {/* Mascot Area - Fixed container with explicit dimensions */}
            <View className="items-center mb-3 h-[110px] justify-center overflow-hidden">
              {voiceState === 'error' ? (
                <Snapy pose="bat_ngo" animation="shake" style={{ width: 100, height: 100 }} />
              ) : voiceState === 'listening' ? (
                <Snapy pose="tap_trung" animation="idle" style={{ width: 100, height: 100 }} />
              ) : voiceState === 'searching' ? (
                <Snapy pose="suy_nghi" animation="idle" style={{ width: 100, height: 100 }} />
              ) : (
                <Snapy pose="chao_mung" animation="wave" style={{ width: 100, height: 100 }} />
              )}
            </View>

            {/* Recognized Text Display (Transcript Window) */}
            <View className="px-6 mb-6 h-[64px] justify-center">
              {voiceText.length > 0 ? (
                <View className="bg-neutral-50 rounded-2xl p-3 border border-neutral-100 items-center justify-center">
                  <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito text-center">
                    {voiceText}
                  </Text>
                </View>
              ) : (
                <View className="h-full items-center justify-center">
                  <Text className="font-medium text-[13px] text-neutral-300 font-inter italic">
                    {voiceState === 'listening' ? 'Nói rõ ràng vào microphone...' : 'Ví dụ: "quả táo", "từ bỏ"...'}
                  </Text>
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
                      "w-20 h-20 rounded-full items-center justify-center border-b-[6px] active:translate-y-[4px] active:border-b-[2px] transition-all shadow-md",
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
