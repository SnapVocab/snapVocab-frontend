import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  BellIcon, 
  FlameIcon, 
  CoinsIcon, 
  TrophyIcon, 
  CheckCircle2Icon, 
  BookOpenIcon, 
  WifiOffIcon,
  CircleIcon,
  SearchIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';
import { useRouter } from 'expo-router';

// ==========================================
// THIẾT LẬP TRẠNG THÁI KIỂM THỬ (MOCK STATE)
// Hãy đổi giá trị này để xem các trạng thái UX khác nhau.
// Các giá trị: 'default' | 'newUser' | 'streakBroken' | 'chestReady' | 'offline' | 'error'
// ==========================================
type MockState = 'default' | 'newUser' | 'streakBroken' | 'chestReady' | 'offline' | 'error';
const TEST_STATE: MockState = 'default';

// DỮ LIỆU MẪU
const MOCK_DATA = {
  user: {
    name: 'Learner',
    avatar: 'https://i.pravatar.cc/150?u=snapvocab',
    streak: 12,
    level: 8,
    xp: 1240,
    xpMax: 1500,
    coins: 820,
    words: 248,
    accuracy: 87,
  },
  srsDue: 12,
  missions: [
    { id: '1', title: 'Học 10 từ mới', progress: 10, total: 10, reward: 30, completed: true },
    { id: '2', title: 'Ôn tập 5 từ', progress: 5, total: 5, reward: 20, completed: true, isCoin: true },
    { id: '3', title: 'Quét 3 từ vựng', progress: 1, total: 3, reward: 30, completed: false }
  ],
  continueLearning: {
    deckName: 'Business English',
    lesson: 4,
    progress: 18,
    total: 25
  },
  leaderboardMe: {
    rank: 12,
    xp: 1240,
    diffToNext: 80
  },
  recentWords: [
    { word: 'abandon', translation: 'từ bỏ' },
    { word: 'accurate', translation: 'chính xác' },
    { word: 'achieve', translation: 'đạt được' },
    { word: 'adapt', translation: 'thích nghi' },
  ]
};

export default function HomeDashboard() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [localData, setLocalData] = useState(MOCK_DATA);
  
  // Xử lý lỗi Fast Refresh giữ lại state cũ không có leaderboardMe
  const data = localData.leaderboardMe ? localData : MOCK_DATA;
  const setData = setLocalData;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setData({ ...MOCK_DATA, srsDue: Math.floor(Math.random() * 20) });
      setRefreshing(false);
    }, 1200);
  }, []);

  useEffect(() => {
    // Initial mock load
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="px-4 py-8 flex-col gap-6">
          <View className="flex-row justify-between items-center">
            <View className="w-32 h-6 bg-neutral-100 rounded animate-pulse" />
            <View className="w-10 h-10 bg-neutral-100 rounded-full animate-pulse" />
          </View>
          <View className="w-full h-40 bg-neutral-100 rounded-2xl animate-pulse" />
          <View className="w-full h-48 bg-neutral-100 rounded-2xl animate-pulse" />
          <View className="w-full h-32 bg-neutral-100 rounded-2xl animate-pulse" />
        </View>
      </SafeAreaView>
    );
  }

  // Logic hiển thị Snapy dựa trên State
  const getMascotProps = () => {
    if (TEST_STATE === 'streakBroken') {
      return { pose: 'sad' as any, anim: 'ear_droop' as any, msg: "Không sao, bắt đầu chuỗi mới hôm nay nhé!" };
    }
    if (TEST_STATE === 'chestReady') {
      return { pose: 'celebrate' as any, anim: 'jump_celebrate' as any, msg: "Tuyệt vời! Bạn đã mở khóa Rương Hàng Ngày!" };
    }
    if (TEST_STATE === 'newUser') {
      return { pose: 'welcome' as any, anim: 'wave' as any, msg: "Bắt đầu chuyến phiêu lưu từ vựng của bạn nào!" };
    }
    if (data.srsDue === 0) {
      return { pose: 'proud' as any, anim: 'idle' as any, msg: "Tuyệt đỉnh! Bạn đã ôn bài rất chăm chỉ." };
    }
    return { pose: 'reading' as any, anim: 'idle' as any, msg: `${data.srsDue} từ vựng đang chờ bạn chinh phục!` };
  };

  const mascot = getMascotProps();

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
            SECTION 01: HEADER
            ========================================== */}
        <View className="flex-row items-center justify-between px-4 py-3 z-10">
          <View>
            <Text className="text-[14px] font-bold text-neutral-400 font-inter">Chào buổi sáng, {data.user.name}!</Text>
            <Text className="text-[16px] font-extrabold text-mascot-navy font-inter mt-0.5">Sẵn sàng học chưa?</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className={cn("flex-row items-center gap-1", TEST_STATE === 'streakBroken' ? "opacity-50" : "")}>
              <FlameIcon size={20} fill={TEST_STATE === 'streakBroken' ? "#9597AD" : "#FF8A00"} className={TEST_STATE === 'streakBroken' ? "text-neutral-300" : "text-mascot-500"} />
              <Text className={cn("text-[17px] font-extrabold font-nunito tabular-nums", TEST_STATE === 'streakBroken' ? "text-neutral-500" : "text-mascot-500")}>
                {TEST_STATE === 'newUser' || TEST_STATE === 'streakBroken' ? 0 : data.user.streak}
              </Text>
            </View>
            <Pressable onPress={() => router.push('/profile/notifications' as any)} className="relative p-1.5 bg-neutral-100 rounded-full active:bg-neutral-200">
              <BellIcon size={20} className="text-mascot-navy" />
              <View className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full border border-white" />
            </Pressable>
            <Image 
              source={{ uri: data.user.avatar }} 
              className="w-9 h-9 rounded-full border-2 border-neutral-100"
            />
          </View>
        </View>

        {/* ==========================================
            SECTION 01.5: DICTIONARY SEARCH ENTRY
            ========================================== */}
        <View className="px-4 py-2 mb-2 z-10">
          <Pressable 
            onPress={() => router.push('/dictionary')}
            className="flex-row items-center h-[52px] px-4 rounded-[16px] bg-white border border-neutral-100 shadow-sm shadow-black/5 active:bg-neutral-50 active:scale-[0.98] "
          >
            <SearchIcon size={20} className="text-neutral-400 mr-3" />
            <Text className="flex-1 font-inter text-[15px] text-neutral-400">
              Tìm kiếm từ vựng tiếng Anh...
            </Text>
          </Pressable>
        </View>

        {/* ==========================================
            SNAPY MASCOT
            ========================================== */}
        <View className="px-4 py-2 mt-2 mb-4 flex-row items-end gap-3">
          <Snapy pose={mascot.pose} animation={mascot.anim} className="h-20 w-20 shrink-0" />
          <View className="flex-1 pb-3">
            <View className="bg-mascot-50 px-3 py-2.5 rounded-2xl rounded-bl-none border border-mascot-200 shadow-sm shadow-mascot-500/10">
              <Text className="text-[14px] font-bold text-mascot-900 font-inter leading-tight">{mascot.msg}</Text>
            </View>
          </View>
        </View>

        {/* ==========================================
            SECTION 02: SRS DUE (PRIMARY ACTION) - Level 1 Surface
            ========================================== */}
        <View className="px-4 mb-6">
          <View className="bg-white rounded-[24px] p-5 border-2 border-neutral-100 border-b-[4px] shadow-sm shadow-black/5">
            <Text className="font-extrabold text-[13px] text-primary-600 uppercase tracking-widest font-nunito mb-2">ÔN TẬP HÔM NAY</Text>
            
            {TEST_STATE === 'newUser' || data.srsDue === 0 ? (
              <View>
                <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito mb-1">Hoàn thành xuất sắc!</Text>
                <Text className="font-medium text-[15px] text-neutral-500 font-inter mb-5">Bạn không còn từ nào cần ôn tập hôm nay.</Text>
                <Pressable className="h-12 bg-white rounded-xl border-2 border-border border-b-[4px] active:bg-neutral-50 active:translate-y-[2px] active:border-b-2  flex-row items-center justify-center">
                  <Text className="text-info-600 font-bold text-[15px] uppercase font-nunito tracking-[0.04em]">HỌC TỪ MỚI</Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <Text className="font-extrabold text-[24px] text-mascot-navy font-nunito mb-1 tabular-nums">{data.srsDue} từ vựng</Text>
                <Text className="font-medium text-[15px] text-neutral-500 font-inter mb-5">đã sẵn sàng để ôn tập.</Text>
                <Pressable className="h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px]  flex-row items-center justify-center">
                  <Text className="text-white font-extrabold text-[16px] uppercase font-nunito tracking-[0.04em]">ÔN NGAY</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* ==========================================
            SECTION 03: DAILY MISSIONS - Level 1 Surface
            ========================================== */}
        <View className="px-4 mb-6">
          <View className="bg-white rounded-[20px] p-5 border-2 border-neutral-100 border-b-[3px] shadow-sm shadow-black/5">
            <Pressable 
              onPress={() => router.push('/(tabs)/missions' as any)}
              className="flex-row justify-between items-center mb-5"
            >
              <Text className="font-extrabold text-[14px] text-mascot-navy uppercase font-nunito tracking-widest">NHIỆM VỤ HÀNG NGÀY</Text>
              <View className="flex-row items-center gap-2">
                <Text className="font-extrabold text-[14px] text-neutral-400 font-nunito tabular-nums">
                  {TEST_STATE === 'chestReady' ? '3/3' : '2/3'}
                </Text>
                <Text className="font-bold text-info-600 text-[12px] font-inter uppercase tracking-wider hidden">XEM TẤT CẢ</Text>
              </View>
            </Pressable>
            
            {TEST_STATE === 'chestReady' ? (
               <View className="items-center py-2 pb-4">
                 <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito mb-2">🎁 Rương đã sẵn sàng!</Text>
                 <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center mb-6 px-4">Bạn đã hoàn thành mọi nhiệm vụ hôm nay.</Text>
                 <Pressable className="w-full h-14 bg-reward-500 rounded-2xl border-b-[4px] border-reward-600 active:bg-reward-600 active:translate-y-[2px] active:border-b-[2px]  flex-row items-center justify-center">
                   <Text className="text-neutral-800 font-extrabold text-[16px] uppercase font-nunito tracking-[0.04em]">MỞ RƯƠNG</Text>
                 </Pressable>
               </View>
            ) : (
               <View className="gap-4">
                 {data.missions.map(m => (
                   <View key={m.id} className="flex-row items-center justify-between">
                     <View className="flex-row items-center gap-3 flex-1 pr-4">
                       {m.completed ? (
                         <CheckCircle2Icon size={24} fill="#58CC02" className="text-white" />
                       ) : (
                         <CircleIcon size={24} className="text-neutral-300" />
                       )}
                       <View className="flex-1">
                         <Text className={cn("font-bold text-[14px] font-inter mb-1.5", m.completed ? "text-neutral-400 line-through" : "text-mascot-navy")}>
                           {m.title}
                         </Text>
                         {!m.completed && (
                           <View className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                             <View 
                               className="h-full bg-info-500 rounded-full" 
                               style={{ width: `${(m.progress / m.total) * 100}%` }}
                             />
                           </View>
                         )}
                       </View>
                     </View>
                     <View className="flex-row items-center gap-1 bg-neutral-50 px-2 py-1 rounded-lg">
                       {m.isCoin ? (
                         <CoinsIcon size={14} fill="#FFC42E" className="text-reward-600" />
                       ) : (
                         <Text className="font-bold text-reward-500 text-[12px] font-nunito">XP</Text>
                       )}
                       <Text className="font-extrabold tabular-nums text-[13px] text-neutral-500 font-nunito">+{m.reward}</Text>
                     </View>
                   </View>
                 ))}
               </View>
            )}
            
            {TEST_STATE !== 'chestReady' && (
              <Pressable onPress={() => router.push('/(tabs)/missions' as any)} className="mt-5 items-center">
                <Text className="font-bold text-info-600 text-[14px] font-inter uppercase tracking-wider">XEM TẤT CẢ →</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* ==========================================
            SECTION 04: CONTINUE LEARNING - Level 1 Surface
            ========================================== */}
        <View className="px-4 mb-6">
          <View className="bg-white rounded-[20px] p-5 border-2 border-neutral-100 border-b-[3px] shadow-sm shadow-black/5">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="font-extrabold text-[13px] text-neutral-400 uppercase tracking-widest font-nunito">TIẾP TỤC HỌC</Text>
              {TEST_STATE !== 'newUser' && (
                <Pressable onPress={() => router.push('/topics')}>
                  <Text className="font-bold text-[13px] text-info-600 font-inter">Khám phá chủ đề khác →</Text>
                </Pressable>
              )}
            </View>
            {TEST_STATE === 'newUser' ? (
              <View>
                <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-1">Khám phá từ mới</Text>
                <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-5">Xây dựng vốn từ vựng của bạn bằng cách học bài đầu tiên.</Text>
                <Pressable 
                  onPress={() => router.push('/topics')}
                  className="h-12 bg-white rounded-xl border-2 border-border border-b-[4px] active:bg-neutral-50 active:translate-y-[2px] active:border-b-2  flex-row items-center justify-center"
                >
                  <Text className="text-mascot-navy font-bold text-[15px] uppercase font-nunito tracking-[0.04em]">BẮT ĐẦU NGAY</Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-1">{data.continueLearning.deckName}</Text>
                <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-3">Bài học {data.continueLearning.lesson} · {data.continueLearning.progress}/{data.continueLearning.total} từ</Text>
                
                <View className="flex-row items-center gap-3 mb-5">
                   <View className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                      <View 
                        className="h-full bg-primary-500 rounded-full" 
                        style={{ width: `${(data.continueLearning.progress / data.continueLearning.total) * 100}%` }}
                      />
                   </View>
                   <Text className="text-[13px] font-extrabold text-neutral-400 font-nunito tabular-nums">{Math.round((data.continueLearning.progress / data.continueLearning.total) * 100)}%</Text>
                </View>
                <Pressable className="h-12 bg-white rounded-xl border-2 border-border border-b-[4px] active:bg-neutral-50 active:translate-y-[2px] active:border-b-2  flex-row items-center justify-center">
                  <Text className="text-mascot-navy font-bold text-[15px] uppercase font-nunito tracking-[0.04em]">TIẾP TỤC →</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* ==========================================
            SECTION 05: KHÁM PHÁ & HOẠT ĐỘNG
            ========================================== */}
        <View className="px-4 mb-6">
          <Text className="font-extrabold text-[14px] text-neutral-400 uppercase tracking-widest font-nunito mb-3 ml-1">KHÁM PHÁ & HOẠT ĐỘNG</Text>
          <View className="flex-row gap-3">
            {/* Cột 1 */}
            <View className="flex-1 gap-3">
              {/* Thống kê */}
              <Pressable 
                onPress={() => router.push('/(tabs)/stats' as any)}
                className="bg-info-50 rounded-2xl p-4 border-2 border-info-100 border-b-[4px] active:translate-y-[2px] active:border-b-[2px] "
              >
                <BookOpenIcon size={28} className="text-info-500 mb-3" fill="#1CB0F6" />
                <Text className="font-extrabold text-[16px] text-info-700 font-nunito mb-0.5">Thống kê</Text>
                <Text className="font-bold text-[13px] text-info-600/70 font-inter">{data.user.words} từ đã học</Text>
              </Pressable>
              
              {/* Xếp hạng */}
              <Pressable 
                onPress={() => router.push('/(tabs)/leaderboard' as any)}
                className="bg-reward-50 rounded-2xl p-4 border-2 border-reward-100 border-b-[4px] active:translate-y-[2px] active:border-b-[2px] "
              >
                <FlameIcon size={28} className="text-reward-500 mb-3" fill="#FFC42E" />
                <Text className="font-extrabold text-[16px] text-reward-700 font-nunito mb-0.5">Xếp hạng</Text>
                <Text className="font-bold text-[13px] text-reward-600/70 font-inter">Hạng #{data.leaderboardMe.rank}</Text>
              </Pressable>
            </View>

            {/* Cột 2 */}
            <View className="flex-1 gap-3">
              {/* Cấp độ */}
              <Pressable 
                onPress={() => router.push('/stats/level-progress' as any)}
                className="bg-primary-50 rounded-2xl p-4 border-2 border-primary-100 border-b-[4px] active:translate-y-[2px] active:border-b-[2px] "
              >
                <CircleIcon size={28} className="text-primary-500 mb-3" fill="#3B82F6" />
                <Text className="font-extrabold text-[16px] text-primary-700 font-nunito mb-0.5">Cấp độ {data.user.level}</Text>
                <Text className="font-bold text-[13px] text-primary-600/70 font-inter">{data.user.xp} XP</Text>
              </Pressable>

              {/* Thành tựu */}
              <Pressable 
                onPress={() => router.push('/(tabs)/achievements' as any)}
                className="bg-success-50 rounded-2xl p-4 border-2 border-success-100 border-b-[4px] active:translate-y-[2px] active:border-b-[2px] "
              >
                <TrophyIcon size={28} className="text-success-500 mb-3" fill="#22C55E" />
                <Text className="font-extrabold text-[16px] text-success-700 font-nunito mb-0.5">Thành tựu</Text>
                <Text className="font-bold text-[13px] text-success-600/70 font-inter">Xem huy hiệu</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* ==========================================
            SECTION 08: RECENTLY LEARNED - Level 2 Surface
            ========================================== */}
        {!TEST_STATE.includes('newUser') && (
          <View className="mb-2">
            <View className="px-4 mb-3">
              <Text className="font-extrabold text-[13px] text-neutral-400 uppercase tracking-widest font-nunito">TỪ VỪA HỌC</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4" contentContainerStyle={{ gap: 10, paddingRight: 32 }}>
              {data.recentWords.map((word, i) => (
                <View key={i} className="bg-white rounded-xl px-4 py-3 border border-neutral-100 shadow-sm shadow-black/5">
                   <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito mb-0.5">{word.word}</Text>
                   <Text className="font-medium text-[13px] text-neutral-400 font-inter">{word.translation}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
