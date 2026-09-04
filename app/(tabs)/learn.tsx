import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  WifiOffIcon,
  PlayIcon,
  BookMarkedIcon,
  LayersIcon,
  BrainCircuitIcon,
  LibraryIcon,
  RepeatIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';
import { router } from 'expo-router';

// ==========================================
// THIẾT LẬP TRẠNG THÁI KIỂM THỬ (MOCK STATE)
// Các giá trị: 'default' | 'newUser' | 'offline' | 'error'
// ==========================================
type MockState = 'default' | 'newUser' | 'offline' | 'error';
const TEST_STATE: MockState = 'default';

// DỮ LIỆU MẪU
const MOCK_DATA = {
  srsDue: 12,
  continueLearning: {
    deckName: 'Business English',
    lesson: 4,
    progress: 18,
    total: 25,
    lastStudied: '20 phút trước'
  },
  modes: {
    vocab: 248,
    flashcards: 18,
    quiz: 5,
    collections: 12
  }
};

export default function LearnHub() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Safe mock data handler
  const [localData, setLocalData] = useState(MOCK_DATA);
  const data = localData.modes ? localData : MOCK_DATA;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setLocalData({ ...MOCK_DATA, srsDue: Math.floor(Math.random() * 20) });
      setRefreshing(false);
    }, 1200);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="px-4 py-8 flex-col gap-6">
          <View className="w-48 h-8 bg-neutral-100 rounded animate-pulse" />
          <View className="w-full h-40 bg-neutral-100 rounded-2xl animate-pulse" />
          <View className="w-full h-32 bg-neutral-100 rounded-2xl animate-pulse" />
          <View className="flex-row gap-4">
             <View className="flex-1 h-32 bg-neutral-100 rounded-2xl animate-pulse" />
             <View className="flex-1 h-32 bg-neutral-100 rounded-2xl animate-pulse" />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={['top']}>
      {TEST_STATE === 'offline' && (
        <View className="bg-neutral-600 flex-row items-center justify-center py-1.5 gap-2 z-20">
          <WifiOffIcon size={14} className="text-white" />
          <Text className="text-white text-[12px] font-bold font-inter">Đang offline - Hiển thị dữ liệu gần nhất</Text>
        </View>
      )}

      {TEST_STATE === 'error' && (
        <View className="bg-danger-50 flex-row items-center justify-center py-1.5 gap-2 z-20">
          <Text className="text-danger-600 text-[12px] font-bold font-inter">Lỗi kết nối. Không thể tải tất cả thông tin.</Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#58CC02" />}
      >
        {/* ==========================================
            HEADER
            ========================================== */}
        <View className="px-4 pt-6 pb-4">
          <Text className="text-[28px] font-extrabold text-mascot-navy font-nunito mb-1">Học</Text>
          <Text className="text-[15px] font-medium text-neutral-500 font-inter">Chọn cách bạn muốn xây dựng vốn từ vựng.</Text>
        </View>

        {/* ==========================================
            CONTINUE LEARNING (Contextual Priority)
            ========================================== */}
        {TEST_STATE !== 'newUser' && (
          <View className="px-4 mb-6">
            <View className="bg-white rounded-[20px] p-5 border-2 border-neutral-100 border-b-[4px] shadow-sm shadow-black/5">
              <View className="flex-row items-center gap-2 mb-3">
                 <Snapy pose="happy" animation="idle" className="w-10 h-10" />
                 <Text className="font-extrabold text-[14px] text-mascot-navy uppercase tracking-widest font-nunito flex-1">TIẾP TỤC HỌC</Text>
              </View>

              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-1">{data.continueLearning.deckName}</Text>
              <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-4">Bài học {data.continueLearning.lesson} · {data.continueLearning.progress}/{data.continueLearning.total} từ</Text>
              
              <View className="flex-row items-center gap-3 mb-5">
                 <View className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <View 
                      className="h-full bg-primary-500 rounded-full" 
                      style={{ width: `${(data.continueLearning.progress / data.continueLearning.total) * 100}%` }}
                    />
                 </View>
                 <Text className="text-[13px] font-extrabold text-neutral-400 font-nunito tabular-nums">{Math.round((data.continueLearning.progress / data.continueLearning.total) * 100)}%</Text>
              </View>

              <Pressable className="h-12 bg-primary-500 rounded-xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px]  flex-row items-center justify-center gap-2">
                <Text className="text-white font-extrabold text-[15px] uppercase font-nunito tracking-[0.04em]">TIẾP TỤC HỌC</Text>
                <PlayIcon size={18} fill="#FFFFFF" className="text-white" />
              </Pressable>
            </View>
          </View>
        )}

        {/* ==========================================
            SRS REVIEW (High Priority if Due)
            ========================================== */}
        <View className="px-4 mb-6">
          <View className={cn(
            "rounded-[20px] p-5 border-2 border-b-[4px] shadow-sm shadow-black/5",
            TEST_STATE === 'newUser' || data.srsDue === 0 
              ? "bg-white border-neutral-100" 
              : "bg-warning-50 border-warning-200 border-b-warning-300"
          )}>
            <View className="flex-row items-center gap-2 mb-3">
               <RepeatIcon size={20} className={TEST_STATE === 'newUser' || data.srsDue === 0 ? "text-neutral-400" : "text-warning-600"} />
               <Text className={cn(
                 "font-extrabold text-[14px] uppercase tracking-widest font-nunito",
                 TEST_STATE === 'newUser' || data.srsDue === 0 ? "text-neutral-400" : "text-warning-600"
               )}>ÔN TẬP SRS</Text>
            </View>
            
            {TEST_STATE === 'newUser' || data.srsDue === 0 ? (
              <View>
                <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-1">Hoàn thành xuất sắc!</Text>
                <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-5">Bạn không còn từ nào cần ôn tập hiện tại.</Text>
                <Pressable className="h-12 bg-white rounded-xl border-2 border-border border-b-[4px] active:bg-neutral-50 active:translate-y-[2px] active:border-b-2  flex-row items-center justify-center">
                  <Text className="text-info-600 font-bold text-[15px] uppercase font-nunito tracking-[0.04em]">HỌC TỪ MỚI</Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito mb-1 tabular-nums">{data.srsDue} từ đang đến hạn</Text>
                <Text className="font-medium text-[14px] text-neutral-600 font-inter mb-5">Ôn ngay để củng cố trí nhớ dài hạn của bạn.</Text>
                <Pressable className="h-12 bg-warning-500 rounded-xl border-b-[4px] border-warning-600 active:bg-warning-600 active:translate-y-[2px] active:border-b-[2px]  flex-row items-center justify-center">
                  <Text className="text-warning-950 font-extrabold text-[15px] uppercase font-nunito tracking-[0.04em]">ÔN NGAY</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* ==========================================
            CORE LEARNING MODES (2-Column Grid)
            ========================================== */}
        <View className="px-4 mb-2">
           <Text className="font-extrabold text-[14px] text-mascot-navy uppercase tracking-widest font-nunito mb-3">CHẾ ĐỘ HỌC</Text>
           
           <View className="flex-row flex-wrap justify-between">
             
             {/* MY VOCABULARY */}
             <Pressable 
               onPress={() => router.push('/decks')}
               className="w-[48%] bg-white rounded-[20px] p-4 border-2 border-neutral-100 border-b-[4px] shadow-sm shadow-black/5 active:bg-neutral-50 active:translate-y-[2px] active:border-b-[2px]  mb-4"
             >
                <View className="w-10 h-10 bg-info-50 rounded-xl items-center justify-center mb-3">
                   <BookMarkedIcon size={22} className="text-info-500" />
                </View>
                <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-0.5 leading-tight">Từ vựng của tôi</Text>
                <Text className="font-medium text-[13px] text-neutral-400 font-inter mb-3 tabular-nums">{TEST_STATE === 'newUser' ? 0 : data.modes.vocab} từ</Text>
                <Text className="font-bold text-[12px] text-info-600 font-inter uppercase tracking-widest">{TEST_STATE === 'newUser' ? 'THÊM TỪ →' : 'XEM TỪ VỰNG →'}</Text>
             </Pressable>

             {/* FLASHCARDS */}
             <Pressable 
               onPress={() => router.push('/study/flashcard')}
               className="w-[48%] bg-white rounded-[20px] p-4 border-2 border-neutral-100 border-b-[4px] shadow-sm shadow-black/5 active:bg-neutral-50 active:translate-y-[2px] active:border-b-[2px]  mb-4"
             >
                <View className="w-10 h-10 bg-danger-50 rounded-xl items-center justify-center mb-3">
                   <LayersIcon size={22} className="text-danger-500" />
                </View>
                <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-0.5 leading-tight">Flashcards</Text>
                <Text className="font-medium text-[13px] text-neutral-400 font-inter mb-3 tabular-nums">{TEST_STATE === 'newUser' ? 'Từ mới' : `${data.modes.flashcards} thẻ`}</Text>
                <Text className="font-bold text-[12px] text-info-600 font-inter uppercase tracking-widest">BẮT ĐẦU →</Text>
             </Pressable>

             {/* QUIZ */}
             <Pressable 
               onPress={() => router.push('/study/quiz-setup')}
               className="w-[48%] bg-white rounded-[20px] p-4 border-2 border-neutral-100 border-b-[4px] shadow-sm shadow-black/5 active:bg-neutral-50 active:translate-y-[2px] active:border-b-[2px]  mb-4"
             >
                <View className="w-10 h-10 bg-mascot-100 rounded-xl items-center justify-center mb-3">
                   <BrainCircuitIcon size={22} className="text-mascot-500" />
                </View>
                <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-0.5 leading-tight">Bài kiểm tra</Text>
                <Text className="font-medium text-[13px] text-neutral-400 font-inter mb-3 tabular-nums">{TEST_STATE === 'newUser' ? 'Cần học trước' : `${data.modes.quiz} bài test`}</Text>
                <Text className="font-bold text-[12px] text-info-600 font-inter uppercase tracking-widest">BẮT ĐẦU →</Text>
             </Pressable>

             {/* COLLECTIONS */}
             <Pressable 
               onPress={() => router.push('/topics')}
               className="w-[48%] bg-white rounded-[20px] p-4 border-2 border-neutral-100 border-b-[4px] shadow-sm shadow-black/5 active:bg-neutral-50 active:translate-y-[2px] active:border-b-[2px]  mb-4"
             >
                <View className="w-10 h-10 bg-primary-100 rounded-xl items-center justify-center mb-3">
                   <LibraryIcon size={22} className="text-primary-500" />
                </View>
                <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-0.5 leading-tight">Bộ sưu tập</Text>
                <Text className="font-medium text-[13px] text-neutral-400 font-inter mb-3 tabular-nums">{data.modes.collections} chủ đề</Text>
                <Text className="font-bold text-[12px] text-info-600 font-inter uppercase tracking-widest">KHÁM PHÁ →</Text>
             </Pressable>

           </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
