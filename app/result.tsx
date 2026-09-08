import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeftIcon,
  Volume2Icon,
  AlertTriangleIcon,
  BookmarkIcon,
  CameraIcon,
  CheckIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { router } from 'expo-router';
import { Snapy } from '@/components/Snapy';

// ==========================================
// TEST STATES FOR MH-CAMERA-02
// ==========================================
type MockState = 'default' | 'noObject' | 'allLow' | 'queued' | 'processing' | 'quotaExceeded' | 'error';
const TEST_STATE: MockState = 'default';

// ==========================================
// MOCK DATA
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
  },
  {
    id: '2',
    word: 'Chair',
    ipa: '/tʃer/',
    meaning: 'Cái ghế',
    confidence: 'Low',
    score: 58,
    saved: true, // Mock already saved
    dictionaryMiss: false,
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
  }
];

export default function DetectionResultScreen() {
  const [results, setResults] = useState(MOCK_RESULTS);

  const toggleSave = (id: string) => {
    setResults(prev => prev.map(item => 
      item.id === id ? { ...item, saved: !item.saved } : item
    ));
  };

  const saveAll = () => {
    setResults(prev => prev.map(item => 
      (item.dictionaryMiss || item.saved) ? item : { ...item, saved: true }
    ));
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

  // ==========================================
  // EDGE STATES RENDERING
  // ==========================================
  const renderEdgeState = () => {
    switch (TEST_STATE) {
      case 'processing':
        return (
          <View className="flex-1 items-center justify-center px-6">
             <Snapy pose="loading" animation="float" className="w-36 h-36 mb-4" />
             <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2">Đang nhận diện</Text>
             <Text className="font-medium text-[14px] text-neutral-500 font-inter">Mắt thần đang phân tích hình ảnh...</Text>
          </View>
        );
      case 'queued':
        return (
          <View className="flex-1 items-center justify-center px-6">
             <Snapy pose="suy_nghi" animation="idle" className="w-32 h-32 mb-4" />
             <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2">Đang xếp hàng</Text>
             <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-1">Vị trí hàng đợi: #3</Text>
             <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-6">Ước tính: ~20 giây</Text>
             <Pressable onPress={handleRetake} className="px-6 h-12 bg-neutral-100 rounded-xl active:bg-neutral-200 flex-row items-center justify-center">
               <Text className="text-mascot-navy font-bold text-[15px] uppercase font-nunito tracking-[0.04em]">HỦY XẾP HÀNG</Text>
             </Pressable>
          </View>
        );
      case 'error':
        return (
          <View className="flex-1 items-center justify-center px-6">
             <Snapy pose="bat_ngo" animation="shake" className="w-32 h-32 mb-4" />
             <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2">Xử lý thất bại</Text>
             <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center mb-6">Rất tiếc, đã có lỗi xảy ra trong quá trình nhận diện.</Text>
             <View className="w-full gap-3 max-w-[300px]">
               <Pressable className="w-full h-12 bg-primary-500 rounded-xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all flex-row items-center justify-center">
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
             <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2 text-center">Bạn đã dùng hết lượt scan hôm nay</Text>
             <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center mb-6">Lượt scan sẽ được làm mới vào 00:00 ngày mai.</Text>
             <Pressable onPress={() => router.replace('/(tabs)')} className="w-full max-w-[300px] h-12 bg-primary-500 rounded-xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all flex-row items-center justify-center">
               <Text className="text-white font-extrabold text-[15px] uppercase font-nunito tracking-[0.04em]">QUAY LẠI HỌC</Text>
             </Pressable>
          </View>
        );
      case 'noObject':
        return (
          <View className="flex-1 items-center justify-center px-6">
             <Snapy pose="to_mo" animation="idle" className="w-32 h-32 mb-4" />
             <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2 text-center">Không nhận diện được vật thể</Text>
             <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center mb-6">Mắt thần không tìm thấy vật thể nào rõ ràng trong ảnh.</Text>
             <Pressable onPress={handleRetake} className="w-full max-w-[300px] h-12 bg-primary-500 rounded-xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all flex-row items-center justify-center">
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
            <ChevronLeftIcon size={24} className="text-mascot-navy" />
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
      
      {/* HEADER */}
      <View className="h-14 flex-row items-center px-4 bg-white border-b border-neutral-100 z-20">
        <Pressable onPress={handleBack} className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100 -ml-2">
          <ChevronLeftIcon size={28} className="text-mascot-navy" />
        </Pressable>
        <Text className="flex-1 text-center font-extrabold text-[18px] text-mascot-navy font-nunito mr-8">
          Kết quả nhận diện
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }} showsVerticalScrollIndicator={false}>
        
        {/* IMAGE PREVIEW */}
        <View className="p-4">
          <View className="w-full h-[220px] bg-neutral-200 rounded-[24px] overflow-hidden relative shadow-sm shadow-black/5">
            {/* Mock Image Content */}
            <View className="absolute inset-0 bg-mascot-navy/10" />
            
            {/* Mock Bounding Boxes */}
            <View className="absolute top-10 left-10 w-24 h-24 border-2 border-primary-500 rounded-xl bg-primary-500/10" />
            <View className="absolute bottom-10 right-12 w-32 h-40 border-2 border-warning-500 rounded-xl bg-warning-500/10" />

            <View className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Text className="text-white font-inter text-[12px] font-medium">Đã tìm thấy {TEST_STATE === 'allLow' ? '0' : '3'} vật thể</Text>
            </View>
          </View>
        </View>

        {/* ALL LOW STATE MESSAGE */}
        {TEST_STATE === 'allLow' && (
          <View className="px-4 mb-4">
             <View className="bg-white rounded-[20px] p-5 border-2 border-neutral-100 items-center">
               <Snapy pose="to_mo" animation="idle" className="w-24 h-24 mb-3" />
               <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-1 text-center">Không tìm thấy vật thể có độ tin cậy cao</Text>
               <Text className="font-medium text-[13px] text-neutral-500 font-inter mb-4 text-center">Bạn có muốn thử một góc chụp khác rõ ràng hơn không?</Text>
               <Pressable onPress={handleRetake} className="w-full h-12 bg-primary-500 rounded-xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all flex-row items-center justify-center">
                 <Text className="text-white font-extrabold text-[14px] uppercase font-nunito tracking-[0.04em]">THỬ ẢNH RÕ HƠN</Text>
               </Pressable>
             </View>
          </View>
        )}

        {/* RESULT CARDS */}
        <View className="px-4 gap-4">
          {results.map((item) => (
            <View key={item.id} className="bg-white rounded-[24px] p-5 border-2 border-neutral-100 border-b-[4px] shadow-sm shadow-black/5 relative">
              
              {/* Report Error Icon */}
              <Pressable className="absolute top-4 right-4 p-2 active:bg-neutral-50 rounded-full">
                <AlertTriangleIcon size={18} className="text-neutral-400" />
              </Pressable>

              {/* Confidence Badge */}
              <View className="flex-row items-center mb-3">
                <View className={cn(
                  "px-2.5 py-1.5 rounded-lg flex-row items-center gap-1.5",
                  item.confidence === 'High' ? "bg-primary-50" : "bg-warning-50"
                )}>
                  <View className={cn(
                    "w-2 h-2 rounded-full",
                    item.confidence === 'High' ? "bg-primary-500" : "bg-warning-500"
                  )} />
                  <Text className={cn(
                    "font-bold text-[11px] uppercase tracking-wider font-inter",
                    item.confidence === 'High' ? "text-primary-700" : "text-warning-700"
                  )}>
                    {item.confidence === 'High' ? 'Độ tin cậy cao' : 'Độ tin cậy thấp'} · {item.score}%
                  </Text>
                </View>
              </View>

              {/* Low Confidence Mascot Injection */}
              {item.confidence === 'Low' && (
                <View className="flex-row items-center gap-3 mb-4 bg-warning-50/50 p-3 rounded-2xl">
                  <Snapy pose="to_mo" animation="idle" className="w-12 h-12" />
                  <View className="flex-1 bg-white px-3 py-2 rounded-2xl rounded-tl-sm border border-neutral-100 shadow-sm shadow-black/5">
                    <Text className="font-medium text-[13px] text-neutral-600 font-inter">"Hình như đây là..."</Text>
                  </View>
                </View>
              )}

              {/* Word & IPA */}
              <View className="flex-row items-end gap-3 mb-1">
                <Text className="font-extrabold text-[28px] text-mascot-navy font-nunito">{item.word}</Text>
                {!item.dictionaryMiss && (
                  <Pressable className="w-8 h-8 rounded-full bg-info-50 items-center justify-center mb-1.5 active:bg-info-100">
                    <Volume2Icon size={16} className="text-info-600" />
                  </Pressable>
                )}
              </View>

              {/* Meaning */}
              {item.dictionaryMiss ? (
                <Text className="font-medium text-[15px] text-danger-500 font-inter mb-6">Chưa có từ vựng tương ứng trong từ điển</Text>
              ) : (
                <View className="flex-row items-center gap-2 mb-6">
                  <Text className="font-medium text-[16px] text-neutral-500 font-inter">{item.ipa}</Text>
                  <Text className="font-medium text-[16px] text-neutral-300 font-inter">•</Text>
                  <Text className="font-bold text-[16px] text-neutral-700 font-inter">{item.meaning}</Text>
                </View>
              )}

              {/* Save Action */}
              {!item.dictionaryMiss && (
                item.saved ? (
                  <Pressable 
                    onPress={() => toggleSave(item.id)}
                    className="w-full h-12 bg-neutral-100 rounded-xl border-b-[2px] border-neutral-200 active:bg-neutral-200 transition-all flex-row items-center justify-center gap-2"
                  >
                    <CheckIcon size={18} className="text-neutral-500" />
                    <Text className="text-neutral-500 font-bold text-[15px] uppercase font-nunito tracking-[0.04em]">ĐÃ LƯU TRONG DECK</Text>
                  </Pressable>
                ) : (
                  <Pressable 
                    onPress={() => toggleSave(item.id)}
                    className="w-full h-12 bg-primary-500 rounded-xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all flex-row items-center justify-center gap-2"
                  >
                    <BookmarkIcon size={18} fill="#FFFFFF" className="text-white" />
                    <Text className="text-white font-extrabold text-[15px] uppercase font-nunito tracking-[0.04em]">LƯU TỪ VỰNG</Text>
                  </Pressable>
                )
              )}

            </View>
          ))}
        </View>

      </ScrollView>

      {/* STICKY BOTTOM ACTION AREA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 p-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        
        {/* Deck Selector */}
        <View className="flex-row items-center justify-between px-2 mb-4">
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-full bg-info-50 items-center justify-center">
              <BookmarkIcon size={14} className="text-info-500" />
            </View>
            <View>
              <Text className="font-medium text-[11px] text-neutral-400 font-inter uppercase tracking-wider mb-0.5">LƯU VÀO</Text>
              <Text className="font-bold text-[14px] text-mascot-navy font-inter">Tiếng Anh cơ bản</Text>
            </View>
          </View>
          <Pressable className="px-3 py-1.5 rounded-full bg-neutral-100 active:bg-neutral-200">
            <Text className="font-bold text-[12px] text-neutral-600 font-inter">Đổi Deck</Text>
          </Pressable>
        </View>

        {/* Global Actions */}
        <View className="flex-row gap-3">
          <Pressable 
            onPress={handleRetake}
            className="h-14 w-14 bg-white rounded-2xl border-2 border-neutral-100 border-b-[4px] active:bg-neutral-50 active:translate-y-[2px] active:border-b-2 items-center justify-center transition-all"
          >
            <CameraIcon size={24} className="text-neutral-500" />
          </Pressable>
          
          <Pressable 
            onPress={saveAll}
            className="flex-1 h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all flex-row items-center justify-center"
          >
            <Text className="text-white font-extrabold text-[16px] uppercase font-nunito tracking-[0.04em]">LƯU TẤT CẢ TỪ MỚI</Text>
          </Pressable>
        </View>

      </View>

    </SafeAreaView>
  );
}
