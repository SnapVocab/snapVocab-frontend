import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  Image, 
  ActivityIndicator, 
  Modal, 
  Platform, 
  Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeftIcon,
  Volume2Icon,
  AlertTriangleIcon,
  BookmarkIcon,
  CameraIcon,
  CheckIcon,
  SparklesIcon,
  XIcon,
  CheckCircle2Icon,
  LayersIcon,
  RadioIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { router, useLocalSearchParams } from 'expo-router';
import { Snapy } from '@/components/Snapy';

// ==========================================
// TEST STATES FOR MH-CAMERA-02
// ==========================================
type MockState = 'default' | 'noObject' | 'allLow' | 'queued' | 'processing' | 'quotaExceeded' | 'error';
const TEST_STATE: MockState = 'default';

// ==========================================
// MOCK DATA WITH OBJECT CROPS
// ==========================================
const MOCK_RESULTS = [
  {
    id: '1',
    word: 'Apple',
    ipa: '/ˈæpəl/',
    meaning: 'Quả táo',
    confidence: 'High',
    score: 94,
    saved: false,
    dictionaryMiss: false,
    emoji: '🍎',
    cropThumbnail: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&auto=format&fit=crop&q=80',
    bbox: { top: 38, left: 32, width: 85, height: 85 }
  },
  {
    id: '2',
    word: 'Chair',
    ipa: '/tʃer/',
    meaning: 'Cái ghế',
    confidence: 'Low',
    score: 58,
    saved: true,
    dictionaryMiss: false,
    emoji: '🪑',
    cropThumbnail: 'https://images.unsplash.com/photo-1580481077195-c3a9927b74b7?w=200&auto=format&fit=crop&q=80',
    bbox: { top: 90, left: 160, width: 95, height: 110 }
  },
  {
    id: '3',
    word: 'UnknownObject',
    ipa: '',
    meaning: '',
    confidence: 'High',
    score: 82,
    saved: false,
    dictionaryMiss: true,
    emoji: '🔍',
    cropThumbnail: null,
    bbox: { top: 50, left: 270, width: 70, height: 70 }
  }
];

// Available Decks
const AVAILABLE_DECKS = [
  { id: 'd1', name: 'Tiếng Anh cơ bản', count: 42, icon: '📚' },
  { id: 'd2', name: 'Travel & Food', count: 86, icon: '✈️' },
  { id: 'd3', name: 'Giao tiếp hàng ngày', count: 35, icon: '💬' },
  { id: 'd4', name: 'TOEIC Vocabulary', count: 64, icon: '💼' },
];

export default function DetectionResultScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();
  const [results, setResults] = useState(MOCK_RESULTS);
  const [selectedDeck, setSelectedDeck] = useState(AVAILABLE_DECKS[0]);
  const [showDeckModal, setShowDeckModal] = useState(false);
  
  // TTS State
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Report Modal State
  const [reportItem, setReportItem] = useState<typeof MOCK_RESULTS[0] | null>(null);
  const [reportReason, setReportReason] = useState('wrong_name');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Gamification XP Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;

  // Image URI decoding
  const displayImageUri = imageUri 
    ? decodeURIComponent(imageUri) 
    : 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80';

  // Pronunciation handler (Web Speech API + native fallback)
  const handlePronounce = (id: string, word: string) => {
    setSpeakingId(id);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setSpeakingId(null), 1000);
    }
  };

  const showXpToast = (text: string) => {
    setToastMessage(text);
    toastAnim.setValue(0);
    Animated.spring(toastAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start();

    setTimeout(() => {
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setToastMessage(null);
      });
    }, 2400);
  };

  const toggleSave = (id: string) => {
    setResults(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.saved;
        if (nextState) {
          showXpToast(`+5 XP · Đã lưu "${item.word}" vào ${selectedDeck.name}!`);
        }
        return { ...item, saved: nextState };
      }
      return item;
    }));
  };

  const saveAll = () => {
    let newlySavedCount = 0;
    setResults(prev => prev.map(item => {
      if (!item.dictionaryMiss && !item.saved) {
        newlySavedCount++;
        return { ...item, saved: true };
      }
      return item;
    }));

    if (newlySavedCount > 0) {
      showXpToast(`🎉 +${newlySavedCount * 5} XP · Đã lưu ${newlySavedCount} từ mới vào ${selectedDeck.name}!`);
    } else {
      showXpToast(`Tất cả từ hợp lệ đã được lưu trong Deck!`);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/scan');
    }
  };

  const handleRetake = () => {
    router.replace('/(tabs)/scan');
  };

  const handleOpenWordDetail = (word: string) => {
    router.push({
      pathname: '/dictionary/[id]',
      params: { id: word.toLowerCase() }
    });
  };

  const handleSendReport = () => {
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setReportItem(null);
    }, 1800);
  };

  // ==========================================
  // EDGE STATES RENDERING
  // ==========================================
  const renderEdgeState = () => {
    switch (TEST_STATE) {
      case 'processing':
        return (
          <View className="flex-1 items-center justify-center px-6">
             <Snapy pose="loading" animation="float" className="w-36 h-36 mb-4" />
             <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito mb-2">Đang nhận diện</Text>
             <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center">Mắt thần AI đang phân tích hình ảnh...</Text>
          </View>
        );
      case 'queued':
        return (
          <View className="flex-1 items-center justify-center px-6">
             <Snapy pose="suy_nghi" animation="idle" className="w-32 h-32 mb-4" />
             <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito mb-2">Đang xếp hàng</Text>
             <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-1">Vị trí hàng đợi: #3</Text>
             <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-6">Ước tính: ~20 giây</Text>
             <Pressable onPress={handleRetake} className="px-6 h-12 bg-neutral-100 rounded-xl active:bg-neutral-200 flex-row items-center justify-center border-b-[3px] border-neutral-300">
               <Text className="text-mascot-navy font-bold text-[15px] uppercase font-nunito tracking-[0.04em]">HỦY XẾP HÀNG</Text>
             </Pressable>
          </View>
        );
      case 'error':
        return (
          <View className="flex-1 items-center justify-center px-6">
             <Snapy pose="bat_ngo" animation="shake" className="w-32 h-32 mb-4" />
             <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito mb-2">Xử lý thất bại</Text>
             <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center mb-6">Rất tiếc, đã có lỗi xảy ra trong quá trình nhận diện.</Text>
             <View className="w-full gap-3 max-w-[300px]">
               <Pressable 
                 onPress={handleRetake}
                 className="w-full h-12 bg-primary-500 rounded-xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] flex-row items-center justify-center"
               >
                 <Text className="text-white font-extrabold text-[15px] uppercase font-nunito tracking-[0.04em]">THỬ LẠI</Text>
               </Pressable>
               <Pressable onPress={handleRetake} className="w-full h-12 bg-white rounded-xl border-2 border-neutral-100 active:bg-neutral-50 flex-row items-center justify-center">
                 <Text className="text-neutral-500 font-bold text-[15px] font-inter">Quay lại Camera</Text>
               </Pressable>
             </View>
          </View>
        );
      case 'quotaExceeded':
        return (
          <View className="flex-1 items-center justify-center px-6">
             <Snapy pose="suy_nghi" animation="idle" className="w-32 h-32 mb-4" />
             <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito mb-2 text-center">Bạn đã dùng hết lượt scan hôm nay</Text>
             <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center mb-6">Lượt scan sẽ được làm mới vào 00:00 ngày mai.</Text>
             <Pressable onPress={() => router.replace('/(tabs)/learn')} className="w-full max-w-[300px] h-12 bg-primary-500 rounded-xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] flex-row items-center justify-center">
               <Text className="text-white font-extrabold text-[15px] uppercase font-nunito tracking-[0.04em]">QUAY LẠI HỌC</Text>
             </Pressable>
          </View>
        );
      case 'noObject':
        return (
          <View className="flex-1 items-center justify-center px-6">
             <Snapy pose="to_mo" animation="idle" className="w-32 h-32 mb-4" />
             <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito mb-2 text-center">Không nhận diện được vật thể</Text>
             <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center mb-6">Mắt thần không tìm thấy vật thể nào rõ ràng trong ảnh.</Text>
             <Pressable onPress={handleRetake} className="w-full max-w-[300px] h-12 bg-primary-500 rounded-xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] flex-row items-center justify-center">
               <Text className="text-white font-extrabold text-[15px] uppercase font-nunito tracking-[0.04em]">THỬ ẢNH KHÁC</Text>
             </Pressable>
          </View>
        );
      default:
        return null;
    }
  };

  const edgeStateUI = renderEdgeState();
  if (edgeStateUI) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
        <View className="h-14 flex-row items-center px-4">
          <Pressable onPress={handleBack} className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100">
            <ChevronLeftIcon size={24} color="#1e2a44" />
          </Pressable>
        </View>
        {edgeStateUI}
      </SafeAreaView>
    );
  }

  // ==========================================
  // NORMAL RESULT RENDER
  // ==========================================
  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* GAMIFICATION FLOATING TOAST */}
      {toastMessage && (
        <Animated.View 
          style={{
            opacity: toastAnim,
            transform: [{
              translateY: toastAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-16, 0],
              }),
            }],
          }}
          className="absolute top-16 left-5 right-5 z-50 items-center pointer-events-none"
        >
          <View className="bg-mascot-navy/95 px-5 py-3 rounded-2xl flex-row items-center gap-3 shadow-xl shadow-black/25 border border-primary-400/40">
            <View className="w-8 h-8 rounded-full bg-primary-500 items-center justify-center">
              <SparklesIcon size={16} color="#FFFFFF" />
            </View>
            <Text className="text-white font-nunito font-extrabold text-[14px] flex-1">
              {toastMessage}
            </Text>
          </View>
        </Animated.View>
      )}

      {/* HEADER */}
      <View className="h-14 flex-row items-center px-4 bg-white border-b border-neutral-100 z-20">
        <Pressable onPress={handleBack} className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100 -ml-1">
          <ChevronLeftIcon size={26} color="#1e2a44" />
        </Pressable>
        <Text className="flex-1 text-center font-extrabold text-[18px] text-mascot-navy font-nunito mr-9">
          Kết quả nhận diện AI
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 180 }} showsVerticalScrollIndicator={false}>
        
        {/* IMAGE PREVIEW WITH REAL IMAGE & BOUNDING BOXES */}
        <View className="p-4">
          <View className="w-full h-[220px] bg-neutral-900 rounded-[28px] overflow-hidden relative shadow-md shadow-black/10 border-2 border-white">
            <Image 
              source={{ uri: displayImageUri }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
            
            {/* Realtime Bounding Boxes overlay */}
            <View 
              style={{
                position: 'absolute',
                top: 25,
                left: 30,
                width: 90,
                height: 90,
                borderWidth: 2.5,
                borderColor: '#58CC02',
                borderRadius: 14,
                backgroundColor: 'rgba(88, 204, 2, 0.15)',
              }}
            >
              <View className="bg-primary-500 px-2 py-0.5 rounded-br-lg self-start">
                <Text className="text-white font-inter font-bold text-[10px]">Apple 94%</Text>
              </View>
            </View>

            <View 
              style={{
                position: 'absolute',
                bottom: 25,
                right: 35,
                width: 105,
                height: 115,
                borderWidth: 2,
                borderColor: '#FFC800',
                borderRadius: 14,
                backgroundColor: 'rgba(255, 200, 0, 0.15)',
              }}
            >
              <View className="bg-warning-500 px-2 py-0.5 rounded-br-lg self-start">
                <Text className="text-white font-inter font-bold text-[10px]">Chair 58%</Text>
              </View>
            </View>

            {/* Found objects count pill */}
            <View className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full flex-row items-center gap-1.5 border border-white/20">
              <SparklesIcon size={13} color="#7dd634" />
              <Text className="text-white font-nunito text-[12px] font-bold">
                Tìm thấy {TEST_STATE === 'allLow' ? '0' : results.length} vật thể
              </Text>
            </View>
          </View>
        </View>

        {/* ALL LOW CONFIDENCE BANNER (IF APPLICABLE) */}
        {TEST_STATE === 'allLow' && (
          <View className="px-4 mb-4">
             <View className="bg-warning-50 border border-warning-200 rounded-2xl p-4 items-center">
                <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-1 text-center">
                  Không tìm thấy vật thể có độ tin cậy cao
                </Text>
                <Text className="font-medium text-[13px] text-neutral-500 font-inter mb-4 text-center">
                  Bạn có muốn thử một góc chụp khác rõ ràng hơn không?
                </Text>
                <Pressable 
                  onPress={handleRetake} 
                  className="w-full h-12 bg-primary-500 rounded-xl border-b-[4px] border-primary-700 active:bg-primary-600 flex-row items-center justify-center"
                >
                  <Text className="text-white font-extrabold text-[14px] uppercase font-nunito tracking-[0.04em]">
                    THỬ ẢNH RÕ HƠN
                  </Text>
                </Pressable>
              </View>
          </View>
        )}

        {/* RESULT CARDS */}
        <View className="px-4 gap-4">
          {results.map((item) => (
            <View 
              key={item.id} 
              className="bg-white rounded-[28px] p-5 border-2 border-neutral-100 border-b-[5px] shadow-sm shadow-black/5 relative"
            >
              
              {/* Report Error Icon */}
              <Pressable 
                onPress={() => {
                  setReportItem(item);
                  setReportSuccess(false);
                }}
                className="absolute top-4 right-4 p-2 active:bg-neutral-100 rounded-full"
              >
                <AlertTriangleIcon size={18} color="#9597ad" />
              </Pressable>

              {/* Confidence Badge */}
              <View className="flex-row items-center mb-3.5">
                <View className={cn(
                  "px-3 py-1.5 rounded-xl flex-row items-center gap-2",
                  item.confidence === 'High' ? "bg-primary-50 border border-primary-200/50" : "bg-warning-50 border border-warning-200/50"
                )}>
                  <View className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    item.confidence === 'High' ? "bg-primary-500" : "bg-warning-500"
                  )} />
                  <Text className={cn(
                    "font-extrabold text-[11px] uppercase tracking-wider font-inter",
                    item.confidence === 'High' ? "text-primary-700" : "text-warning-700"
                  )}>
                    {item.confidence === 'High' ? 'Độ tin cậy cao' : 'Độ tin cậy thấp'} · {item.score}%
                  </Text>
                </View>
              </View>

              {/* Low Confidence Mascot Injection */}
              {item.confidence === 'Low' && (
                <View className="flex-row items-center gap-3 mb-4 bg-warning-50/70 p-3 rounded-2xl border border-warning-200/60">
                  <Snapy pose="to_mo" animation="idle" className="w-12 h-12" />
                  <View className="flex-1 bg-white px-3 py-2 rounded-2xl rounded-tl-sm border border-warning-100 shadow-sm shadow-black/5">
                    <Text className="font-semibold text-[13px] text-neutral-700 font-inter">
                      "Hình như đây là một chiếc ghế..."
                    </Text>
                  </View>
                </View>
              )}

              {/* Word & Thumbnail / IPA */}
              <View className="flex-row items-center gap-3.5 mb-2">
                {/* Object Crop Thumbnail */}
                {item.cropThumbnail ? (
                  <View className="w-14 h-14 rounded-2xl overflow-hidden bg-neutral-100 border-2 border-neutral-200 shadow-sm">
                    <Image 
                      source={{ uri: item.cropThumbnail }} 
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  </View>
                ) : (
                  <View className="w-14 h-14 rounded-2xl bg-neutral-100 items-center justify-center border-2 border-neutral-200">
                    <Text className="text-[26px]">{item.emoji}</Text>
                  </View>
                )}

                {/* Word title & Audio */}
                <View className="flex-1">
                  <Pressable 
                    onPress={() => !item.dictionaryMiss && handleOpenWordDetail(item.word)}
                    className="flex-row items-center gap-2"
                  >
                    <Text className="font-extrabold text-[26px] text-mascot-navy font-nunito">
                      {item.word}
                    </Text>
                  </Pressable>

                  {/* IPA & Meaning */}
                  {item.dictionaryMiss ? (
                    <Text className="font-medium text-[13px] text-danger-500 font-inter">
                      Chưa có từ vựng tương ứng trong từ điển
                    </Text>
                  ) : (
                    <View className="flex-row items-center gap-2 mt-0.5">
                      <Text className="font-medium text-[15px] text-neutral-500 font-inter">
                        {item.ipa}
                      </Text>
                      <Text className="text-neutral-300">•</Text>
                      <Text className="font-bold text-[15px] text-neutral-800 font-inter">
                        {item.meaning}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Pronounce TTS Audio Button */}
                {!item.dictionaryMiss && (
                  <Pressable 
                    onPress={() => handlePronounce(item.id, item.word)}
                    className={cn(
                      "w-11 h-11 rounded-2xl items-center justify-center border-b-[3px] transition-all",
                      speakingId === item.id 
                        ? "bg-primary-500 border-primary-700 scale-105" 
                        : "bg-info-50 border-info-200 active:bg-info-100"
                    )}
                  >
                    <Volume2Icon 
                      size={18} 
                      color={speakingId === item.id ? "#FFFFFF" : "#0284c7"}
                    />
                  </Pressable>
                )}
              </View>

              {/* Save Action Button */}
              {!item.dictionaryMiss && (
                <View className="mt-3">
                  {item.saved ? (
                    <Pressable 
                      onPress={() => toggleSave(item.id)}
                      className="w-full h-12 bg-neutral-100 rounded-2xl border-b-[3px] border-neutral-200 active:bg-neutral-200 transition-all flex-row items-center justify-center gap-2"
                    >
                      <CheckCircle2Icon size={18} color="#4cad02" />
                      <Text className="text-neutral-600 font-extrabold text-[14px] uppercase font-nunito tracking-[0.04em]">
                        ĐÃ LƯU TRONG DECK
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable 
                      onPress={() => toggleSave(item.id)}
                      className="w-full h-12 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all flex-row items-center justify-center gap-2 shadow-sm"
                    >
                      <BookmarkIcon size={18} color="#FFFFFF" fill="#FFFFFF" />
                      <Text className="text-white font-extrabold text-[14px] uppercase font-nunito tracking-[0.04em]">
                        LƯU TỪ VỰNG (+5 XP)
                      </Text>
                    </Pressable>
                  )}
                </View>
              )}

            </View>
          ))}
        </View>

      </ScrollView>

      {/* STICKY BOTTOM ACTION AREA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 p-4 pb-8 shadow-[0_-6px_24px_rgba(0,0,0,0.06)] z-20">
        
        {/* Deck Selector Banner */}
        <View className="flex-row items-center justify-between px-2 mb-3.5 bg-neutral-50 p-2.5 rounded-2xl border border-neutral-100">
          <View className="flex-row items-center gap-2.5">
            <View className="w-9 h-9 rounded-xl bg-info-100 items-center justify-center border border-info-200">
              <BookmarkIcon size={16} color="#0284c7" />
            </View>
            <View>
              <Text className="font-extrabold text-[11px] text-neutral-400 font-nunito uppercase tracking-wider">
                LƯU VÀO DECK
              </Text>
              <Text className="font-bold text-[14px] text-mascot-navy font-inter">
                {selectedDeck.icon} {selectedDeck.name}
              </Text>
            </View>
          </View>
          <Pressable 
            onPress={() => setShowDeckModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-neutral-200 active:bg-neutral-100 shadow-sm"
          >
            <Text className="font-extrabold text-[12px] text-mascot-navy font-nunito">Đổi Deck</Text>
          </Pressable>
        </View>

        {/* Global Actions */}
        <View className="flex-row gap-3">
          <Pressable 
            onPress={handleRetake}
            className="h-14 w-14 bg-white rounded-2xl border-2 border-neutral-200 border-b-[4px] active:bg-neutral-50 active:translate-y-[2px] active:border-b-2 items-center justify-center transition-all shadow-sm"
          >
            <CameraIcon size={24} color="#3d3f5e" />
          </Pressable>
          
          <Pressable 
            onPress={saveAll}
            className="flex-1 h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all flex-row items-center justify-center shadow-md shadow-primary-500/20"
          >
            <Text className="text-white font-extrabold text-[16px] uppercase font-nunito tracking-[0.04em]">
              LƯU TẤT CẢ TỪ MỚI
            </Text>
          </Pressable>
        </View>

      </View>

      {/* ==========================================
          MODAL: DECK SELECTION (32px Extra Rounded)
          ========================================== */}
      <Modal
        visible={showDeckModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDeckModal(false)}
      >
        <Pressable 
          onPress={() => setShowDeckModal(false)}
          className="flex-1 bg-black/50 justify-end"
        >
          <Pressable 
            onPress={e => e.stopPropagation()} 
            className="bg-white rounded-t-[36px] p-6 pb-10 border-t-2 border-neutral-100 shadow-2xl"
          >
            {/* Modal Header */}
            <View className="flex-row items-center justify-between mb-5">
              <View>
                <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">
                  Chọn Deck Lưu Từ
                </Text>
                <Text className="font-medium text-[13px] text-neutral-400 font-inter">
                  Từ vựng sau khi scan sẽ được lưu vào deck này
                </Text>
              </View>
              <Pressable 
                onPress={() => setShowDeckModal(false)}
                className="w-9 h-9 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200"
              >
                <XIcon size={18} color="#565879" />
              </Pressable>
            </View>

            {/* Deck List */}
            <View className="gap-2.5 mb-6">
              {AVAILABLE_DECKS.map((deck) => {
                const isSelected = selectedDeck.id === deck.id;
                return (
                  <Pressable
                    key={deck.id}
                    onPress={() => {
                      setSelectedDeck(deck);
                      setShowDeckModal(false);
                      showXpToast(`Đã chuyển deck lưu sang: ${deck.name}`);
                    }}
                    className={cn(
                      "p-4 rounded-2xl flex-row items-center justify-between border-2 transition-all",
                      isSelected 
                        ? "bg-primary-50/70 border-primary-500 border-b-[4px]" 
                        : "bg-white border-neutral-200 border-b-[3px] active:bg-neutral-50"
                    )}
                  >
                    <View className="flex-row items-center gap-3">
                      <Text className="text-[24px]">{deck.icon}</Text>
                      <View>
                        <Text className={cn(
                          "font-extrabold text-[15px] font-nunito",
                          isSelected ? "text-primary-700" : "text-mascot-navy"
                        )}>
                          {deck.name}
                        </Text>
                        <Text className="font-medium text-[12px] text-neutral-400 font-inter">
                          {deck.count} từ đã lưu
                        </Text>
                      </View>
                    </View>

                    {isSelected && (
                      <View className="w-7 h-7 rounded-full bg-primary-500 items-center justify-center">
                        <CheckIcon size={14} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>

            {/* Close Button */}
            <Pressable 
              onPress={() => setShowDeckModal(false)}
              className="w-full h-12 bg-neutral-100 rounded-2xl active:bg-neutral-200 flex-row items-center justify-center"
            >
              <Text className="font-bold text-[14px] text-neutral-600 font-inter">ĐÓNG</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ==========================================
          MODAL: REPORT ERROR BOTTOM SHEET
          ========================================== */}
      <Modal
        visible={!!reportItem}
        transparent
        animationType="fade"
        onRequestClose={() => setReportItem(null)}
      >
        <Pressable 
          onPress={() => setReportItem(null)}
          className="flex-1 bg-black/50 justify-center items-center px-6"
        >
          <Pressable 
            onPress={e => e.stopPropagation()}
            className="bg-white rounded-[32px] p-6 w-full max-w-[360px] border-b-[6px] border-neutral-200 shadow-2xl"
          >
            {reportSuccess ? (
              <View className="items-center py-4">
                <Snapy pose="kham_pha" animation="bounce" className="w-24 h-24 mb-3" />
                <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-1 text-center">
                  Cảm ơn bạn!
                </Text>
                <Text className="font-medium text-[13px] text-neutral-500 font-inter text-center">
                  Snapy đã ghi nhận phản hồi để hoàn thiện mô hình AI nhận diện chính xác hơn.
                </Text>
              </View>
            ) : (
              <>
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center gap-2">
                    <AlertTriangleIcon size={20} color="#ff8a00" />
                    <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">
                      Báo cáo lỗi nhận diện
                    </Text>
                  </View>
                  <Pressable onPress={() => setReportItem(null)}>
                    <XIcon size={20} color="#757793" />
                  </Pressable>
                </View>

                <Text className="font-medium text-[13px] text-neutral-500 font-inter mb-4">
                  Từ vựng: <Text className="font-bold text-mascot-navy">"{reportItem?.word}"</Text> có vấn đề gì?
                </Text>

                {/* Reason options */}
                <View className="gap-2 mb-5">
                  {[
                    { id: 'wrong_name', label: 'AI đoán sai tên đồ vật' },
                    { id: 'wrong_meaning', label: 'Nghĩa tiếng Việt chưa chính xác' },
                    { id: 'blurred', label: 'Ảnh bị mờ / góc khuất' },
                    { id: 'other', label: 'Lý do khác' },
                  ].map(opt => (
                    <Pressable
                      key={opt.id}
                      onPress={() => setReportReason(opt.id)}
                      className={cn(
                        "p-3 rounded-xl border flex-row items-center justify-between",
                        reportReason === opt.id ? "bg-primary-50 border-primary-400" : "bg-white border-neutral-200"
                      )}
                    >
                      <Text className={cn(
                        "font-semibold text-[13px] font-inter",
                        reportReason === opt.id ? "text-primary-700" : "text-neutral-700"
                      )}>
                        {opt.label}
                      </Text>
                      {reportReason === opt.id && (
                        <View className="w-4 h-4 rounded-full bg-primary-500 items-center justify-center">
                          <CheckIcon size={10} color="#FFFFFF" strokeWidth={3} />
                        </View>
                      )}
                    </Pressable>
                  ))}
                </View>

                {/* Send button */}
                <Pressable 
                  onPress={handleSendReport}
                  className="w-full h-12 bg-primary-500 rounded-xl border-b-[4px] border-primary-700 active:bg-primary-600 flex-row items-center justify-center mb-2"
                >
                  <Text className="text-white font-extrabold text-[14px] uppercase font-nunito tracking-[0.04em]">
                    GỬI PHẢN HỒI CHO SNAPVOVAB
                  </Text>
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}
