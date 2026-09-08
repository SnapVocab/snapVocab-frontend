import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeftIcon,
  ChevronDownIcon,
  CheckIcon,
  FlameIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_CONFIG = {
  isNewUser: false, // Set true để xem Empty State (0 XP)
  myRank: 12,       // Vị trí của người dùng. Test số 2 (Top 3) hoặc 12 (Khuất màn hình).
};

const LEADERBOARD_DATA = Array.from({ length: 30 }).map((_, i) => ({
  id: `u${i+1}`,
  rank: i + 1,
  name: i + 1 === MOCK_CONFIG.myRank ? 'Bạn' : `User ${Math.floor(Math.random() * 1000)}`,
  xp: 1500 - (i * 35) - Math.floor(Math.random() * 20),
  isMe: i + 1 === MOCK_CONFIG.myRank
}));

export default function LeaderboardScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [showSticky, setShowSticky] = useState(MOCK_CONFIG.myRank > 5 && !MOCK_CONFIG.isNewUser);

  const meData = LEADERBOARD_DATA.find(u => u.isMe);
  const userAboveMe = LEADERBOARD_DATA.find(u => u.rank === MOCK_CONFIG.myRank - 1);
  const xpNeeded = (userAboveMe && meData) ? userAboveMe.xp - meData.xp + 1 : 0;

  const scrollToMe = () => {
    if (scrollViewRef.current) {
      // Estimate Y position. Podium is ~250px, each row is ~64px.
      const estimatedY = 250 + (MOCK_CONFIG.myRank - 4) * 64;
      scrollViewRef.current.scrollTo({ y: estimatedY, animated: true });
      setShowSticky(false);
    }
  };

  const handleScroll = (event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    // Estimate Y position of "Me"
    const estimatedY = 250 + (MOCK_CONFIG.myRank - 4) * 64;
    // If scrolled past "Me", hide sticky card
    if (yOffset > estimatedY - 300) {
      setShowSticky(false);
    } else if (MOCK_CONFIG.myRank > 5 && yOffset < estimatedY - 400) {
      setShowSticky(true);
    }
  };

  // ==========================================
  // VIEW: EMPTY STATE (NEW USER)
  // ==========================================
  if (MOCK_CONFIG.isNewUser) {
    return (
      <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-neutral-100">
          <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
            <ArrowLeftIcon size={24} className="text-mascot-navy" />
          </Pressable>
          <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito pr-8">Xếp hạng</Text>
          <View />
        </View>

        <View className="flex-1 items-center justify-center p-6">
          <Snapy pose="suy_nghi" animation="bounce" className="w-48 h-48 mb-6" />
          <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito text-center mb-2">
            Chưa có bảng xếp hạng
          </Text>
          <Text className="font-medium text-[15px] text-neutral-500 font-inter text-center mb-8 px-4">
            Bạn chưa có XP tuần này. Hoàn thành bài học hoặc Review để bắt đầu leo hạng nhé! 🔥
          </Text>
          <Pressable 
            onPress={() => router.push('/(tabs)')}
            className="w-full h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px]  items-center justify-center"
          >
            <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wide">
              BẮT ĐẦU HỌC
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // NORMAL RENDER
  // ==========================================
  const renderPodiumUser = (user: typeof LEADERBOARD_DATA[0], rankIndex: 1|2|3) => {
    if (!user) return null;

    const isGold = rankIndex === 1;
    const isSilver = rankIndex === 2;
    const isBronze = rankIndex === 3;

    // Podium styling configs
    const size = isGold ? 80 : 64;
    const ringColor = isGold ? 'border-[#FBBF24]' : isSilver ? 'border-[#9CA3AF]' : 'border-[#D97706]';
    const bgColor = isGold ? 'bg-[#FEF3C7]' : isSilver ? 'bg-[#F3F4F6]' : 'bg-[#FEF3C7]';
    const medalIcon = isGold ? '🥇' : isSilver ? '🥈' : '🥉';

    return (
      <View className={cn("items-center", isGold ? "z-10 -mt-6" : "z-0 mt-4")}>
        <View className={cn("relative rounded-full border-4 mb-2 shadow-sm", ringColor, bgColor)}>
          {/* Mock Avatar */}
          <View style={{ width: size, height: size }} className="rounded-full items-center justify-center">
             <Text className={cn("font-bold font-nunito", isGold ? "text-[24px]" : "text-[18px]", "text-neutral-400")}>
               {user.name.substring(0,2).toUpperCase()}
             </Text>
          </View>
          
          {/* Medal */}
          <View className="absolute -bottom-3 -right-2 bg-white rounded-full shadow-sm p-0.5">
            <Text className="text-[20px]">{medalIcon}</Text>
          </View>
        </View>
        
        <Text className={cn(
          "font-bold font-inter text-center mb-0.5",
          user.isMe ? "text-primary-600" : "text-mascot-navy",
          isGold ? "text-[16px]" : "text-[14px]"
        )} numberOfLines={1}>
          {user.name}
        </Text>
        
        <View className={cn("px-2 py-0.5 rounded-full", isGold ? "bg-warning-100" : "bg-neutral-100")}>
          <Text className={cn(
            "font-extrabold font-nunito",
            isGold ? "text-warning-700 text-[14px]" : "text-neutral-500 text-[12px]"
          )}>
            {user.xp} XP
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-neutral-100 z-10">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
          <ArrowLeftIcon size={24} className="text-mascot-navy" />
        </Pressable>
        <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">Xếp hạng</Text>
        <View className="w-10 h-10" />
      </View>

      {/* FILTER BAR (MVP: Readonly) */}
      <View className="bg-white px-4 py-3 border-b border-neutral-100 flex-row items-center justify-between z-10 shadow-sm shadow-black/5">
        <View className="flex-row items-center gap-2">
          <View className="bg-neutral-100 px-3 py-1.5 rounded-lg flex-row items-center gap-1">
            <Text className="font-bold text-[13px] text-neutral-600 font-inter">Tuần này</Text>
            <ChevronDownIcon size={14} className="text-neutral-500" />
          </View>
          <View className="bg-primary-50 px-3 py-1.5 rounded-lg flex-row items-center gap-1 border border-primary-200">
            <Text className="font-bold text-[13px] text-primary-600 font-inter">XP</Text>
            <CheckIcon size={14} className="text-primary-600" />
          </View>
        </View>
        <Text className="font-medium text-[12px] text-neutral-400 font-inter">Xếp hạng tuần này</Text>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP 3 PODIUM */}
        <View className="bg-white pt-8 pb-10 px-4 border-b border-neutral-100 shadow-sm shadow-black/5 mb-2">
          <View className="flex-row items-end justify-center gap-6">
            {renderPodiumUser(LEADERBOARD_DATA[1], 2)}
            {renderPodiumUser(LEADERBOARD_DATA[0], 1)}
            {renderPodiumUser(LEADERBOARD_DATA[2], 3)}
          </View>
        </View>

        {/* RANKING LIST (Row 4+) */}
        <View className="px-4 py-2 gap-2">
          {LEADERBOARD_DATA.slice(3).map((user) => (
            <View 
              key={user.id}
              className={cn(
                "flex-row items-center p-3 rounded-2xl border",
                user.isMe 
                  ? "bg-warning-50 border-warning-200 shadow-sm shadow-warning-500/10" 
                  : "bg-white border-neutral-100"
              )}
            >
              {/* Rank Number */}
              <View className="w-8 items-center justify-center mr-3">
                <Text className={cn(
                  "font-extrabold text-[16px] font-nunito",
                  user.isMe ? "text-warning-600" : "text-neutral-400"
                )}>#{user.rank}</Text>
              </View>

              {/* Mock Avatar Small */}
              <View className="w-10 h-10 bg-neutral-100 rounded-full items-center justify-center mr-3">
                <Text className="font-bold text-[12px] text-neutral-400 font-nunito">{user.name.substring(0,2).toUpperCase()}</Text>
              </View>

              {/* Name */}
              <View className="flex-1 justify-center">
                <Text className={cn(
                  "font-bold text-[15px] font-inter",
                  user.isMe ? "text-mascot-navy" : "text-neutral-700"
                )}>
                  {user.name}
                </Text>
                {user.isMe && (
                  <View className="bg-warning-200 self-start px-1.5 py-0.5 rounded mt-0.5">
                    <Text className="font-bold text-[9px] text-warning-700 font-inter uppercase tracking-wider">Bạn</Text>
                  </View>
                )}
              </View>

              {/* XP Score */}
              <View className="items-end">
                <Text className={cn(
                  "font-extrabold text-[16px] font-nunito",
                  user.isMe ? "text-warning-600" : "text-mascot-navy"
                )}>
                  {user.xp.toLocaleString()} XP
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* STICKY "MY POSITION" CARD */}
      {showSticky && meData && (
        <View className="absolute bottom-6 left-4 right-4 z-50">
          <Pressable 
            onPress={scrollToMe}
            className="bg-mascot-navy rounded-2xl p-4 shadow-xl shadow-black/20 flex-row items-center border border-mascot-navy-light"
          >
            <View className="w-10 items-center justify-center mr-2">
              <Text className="font-extrabold text-[18px] text-warning-400 font-nunito">#{meData.rank}</Text>
            </View>
            
            <View className="flex-1">
              <Text className="font-bold text-[15px] text-white font-inter mb-1">Vị trí của bạn</Text>
              {xpNeeded > 0 && (
                <View className="flex-row items-center gap-1">
                  <FlameIcon size={12} className="text-warning-400" fill="#FBBF24" />
                  <Text className="font-medium text-[12px] text-warning-400 font-inter">
                    Còn {xpNeeded} XP để lên #{meData.rank - 1}
                  </Text>
                </View>
              )}
            </View>

            <View className="items-end">
              <Text className="font-extrabold text-[16px] text-white font-nunito">{meData.xp.toLocaleString()} XP</Text>
              <Text className="font-medium text-[11px] text-neutral-400 font-inter mt-1 underline">Chạm để xem ↓</Text>
            </View>
          </Pressable>
        </View>
      )}

    </SafeAreaView>
  );
}
