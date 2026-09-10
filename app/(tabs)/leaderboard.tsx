import React, { useState, useRef, useMemo } from 'react';
import { View, Text, Pressable, FlatList, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeftIcon,
  ShieldIcon,
  ClockIcon,
  InfoIcon,
  FlameIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MinusIcon,
  XIcon,
  CrownIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';
import { AchievementTrophy3D } from '@/components/snapvocab';

// ==========================================
// MOCK CONFIG & DATA
// ==========================================
const MOCK_CONFIG = {
  isNewUser: false,       // Đổi thành true để test Empty State (0 XP)
  myRank: 12,             // Vị trí của người dùng hiện tại (#12)
  userName: 'Alex Nguyen', // Tên đồng bộ với Profile & Home
  leagueName: 'Giải đấu Bạc',
  leagueTier: 'silver',   // 'bronze' | 'silver' | 'gold' | 'diamond'
  timeRemaining: '2 ngày 14 giờ',
};

type TrendType = 'up' | 'down' | 'same';

interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatarColor: string;
  xp: number;
  trend: TrendType;
  isMe: boolean;
}

const SAMPLE_NAMES = [
  'Hải Đăng', 'Minh Anh', 'Bảo Trâm', 'Tuấn Kiệt', 'Khánh Linh',
  'Đức Huy', 'Thảo Vy', 'Hoàng Nam', 'Quỳnh Chi', 'Việt Anh',
  'Thanh Trúc', 'Alex Nguyen', 'Tiến Đạt', 'Ngọc Mai', 'Gia Huy',
  'Hương Giang', 'Văn Quyết', 'Thu Hà', 'Đình Trọng', 'Diệu Linh',
  'Quang Hải', 'Hồng Nhung', 'Thành Trung', 'Mỹ Uyên', 'Văn Toàn',
  'Kim Ngân', 'Đức Phúc', 'Bích Phương', 'Trọng Hiếu', 'Phương Ly'
];

const AVATAR_COLORS = [
  '#0D9488', '#0284C7', '#7C3AED', '#DB2777', '#EA580C',
  '#16A34A', '#4F46E5', '#C026D3', '#059669', '#2563EB'
];

const LEADERBOARD_DATA: LeaderboardUser[] = Array.from({ length: 30 }).map((_, i) => {
  const rank = i + 1;
  const isMe = rank === MOCK_CONFIG.myRank;
  const name = isMe ? MOCK_CONFIG.userName : SAMPLE_NAMES[i % SAMPLE_NAMES.length];
  
  // XP giảm dần hợp lý từ 1680 xuống ~600
  const xp = Math.max(500, 1680 - (i * 36) - Math.floor((i % 5) * 8));

  // Trend giả lập
  let trend: TrendType = 'same';
  if (isMe) trend = 'up';
  else if (i % 3 === 0) trend = 'up';
  else if (i % 3 === 1) trend = 'down';

  return {
    id: `user-${rank}`,
    rank,
    name,
    avatarColor: isMe ? '#0D9488' : AVATAR_COLORS[i % AVATAR_COLORS.length],
    xp,
    trend,
    isMe,
  };
});

export default function LeaderboardScreen() {
  const flatListRef = useRef<FlatList<LeaderboardUser>>(null);
  const [showSticky, setShowSticky] = useState(MOCK_CONFIG.myRank > 4 && !MOCK_CONFIG.isNewUser);
  const [showRulesModal, setShowRulesModal] = useState(false);

  const meData = useMemo(() => LEADERBOARD_DATA.find(u => u.isMe), []);
  const userAboveMe = useMemo(() => LEADERBOARD_DATA.find(u => u.rank === MOCK_CONFIG.myRank - 1), []);
  const xpNeeded = (userAboveMe && meData) ? userAboveMe.xp - meData.xp + 1 : 0;

  // Cuộn mượt tới vị trí của người dùng
  const scrollToMe = () => {
    setShowSticky(false);
    if (flatListRef.current && meData) {
      try {
        flatListRef.current.scrollToIndex({
          index: meData.rank - 1,
          animated: true,
          viewPosition: 0.3,
        });
      } catch {
        // Fallback offset
        const targetOffset = 260 + (meData.rank - 4) * 64;
        flatListRef.current.scrollToOffset({
          offset: targetOffset,
          animated: true,
        });
      }
    }
  };

  const handleScroll = (event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    // Vị trí ước lượng của hàng Bạn (#12)
    const meOffset = 260 + (MOCK_CONFIG.myRank - 4) * 64;
    
    // Khi người dùng cuộn đến gần hoặc qua vị trí của mình -> ẩn sticky card
    if (yOffset > meOffset - 320 && yOffset < meOffset + 250) {
      setShowSticky(false);
    } else if (yOffset <= meOffset - 320 && MOCK_CONFIG.myRank > 4) {
      setShowSticky(true);
    } else if (yOffset >= meOffset + 250) {
      setShowSticky(false);
    }
  };

  // ==========================================
  // VIEW: EMPTY STATE (NEW USER)
  // ==========================================
  if (MOCK_CONFIG.isNewUser) {
    return (
      <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-neutral-100">
          <Pressable 
            onPress={() => router.back()} 
            hitSlop={12}
            className="w-10 h-10 items-center justify-center -ml-2 rounded-full active:bg-neutral-100"
          >
            <ArrowLeftIcon size={24} color="#1E2A44" />
          </Pressable>
          <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito pr-8">
            Bảng Xếp Hạng
          </Text>
          <View />
        </View>

        <View className="flex-1 items-center justify-center p-6">
          <Snapy pose="suy_nghi" animation="bounce" className="w-48 h-48 mb-6" />
          <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito text-center mb-2">
            Chưa có bảng xếp hạng tuần này
          </Text>
          <Text className="font-medium text-[15px] text-neutral-500 font-inter text-center mb-8 px-4 leading-6">
            Bạn chưa có XP tuần này. Hoàn thành một bài học từ vựng hoặc tham gia Ôn tập để gia nhập bảng xếp hạng nhé! 🔥
          </Text>
          <Pressable 
            onPress={() => router.push('/(tabs)')}
            className="w-full max-w-xs h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] items-center justify-center shadow-lg shadow-primary-500/25"
          >
            <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wide">
              BẮT ĐẦU HỌC NGAY
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // PODIUM RENDERER (TOP 3 WITH 3D PEDESTAL)
  // ==========================================
  const renderPodiumUser = (user: LeaderboardUser, rankIndex: 1 | 2 | 3) => {
    if (!user) return null;

    const isGold = rankIndex === 1;
    const isSilver = rankIndex === 2;
    const isBronze = rankIndex === 3;

    // Chiều cao bục đứng 3D
    const pedestalHeight = isGold ? 100 : isSilver ? 76 : 58;
    const avatarSize = isGold ? 76 : 62;

    const ringBorder = isGold 
      ? 'border-[#F59E0B] shadow-[#F59E0B]/30' 
      : isSilver 
      ? 'border-[#94A3B8] shadow-[#94A3B8]/20' 
      : 'border-[#D97706] shadow-[#D97706]/25';

    const bgBadge = isGold 
      ? 'bg-[#FEF3C7] border-[#FDE68A]' 
      : isSilver 
      ? 'bg-[#F1F5F9] border-[#E2E8F0]' 
      : 'bg-[#FFEDD5] border-[#FED7AA]';

    return (
      <View className={cn("items-center flex-1", isGold ? "z-20 -mt-3" : "z-10")}>
        {/* Crown cho Top 1 */}
        {isGold && (
          <View className="mb-1 -mt-2">
            <CrownIcon size={26} color="#F59E0B" fill="#FBBF24" />
          </View>
        )}

        {/* Avatar Ring */}
        <View 
          style={{ width: avatarSize, height: avatarSize }}
          className={cn(
            "rounded-full border-[3.5px] items-center justify-center relative shadow-md",
            ringBorder,
            user.isMe && "ring-2 ring-primary-500"
          )}
        >
          <View 
            style={{ backgroundColor: user.avatarColor }}
            className="w-full h-full rounded-full items-center justify-center"
          >
            <Text className={cn("font-extrabold text-white font-nunito", isGold ? "text-[22px]" : "text-[17px]")}>
              {user.name.substring(0, 2).toUpperCase()}
            </Text>
          </View>

          {/* Badge icon số thứ tự 1/2/3 */}
          <View className={cn(
            "absolute -bottom-2 -right-1 px-1.5 py-0.5 rounded-full border shadow-sm flex-row items-center",
            bgBadge
          )}>
            <Text className={cn(
              "font-extrabold text-[11px] font-nunito",
              isGold ? "text-amber-800" : isSilver ? "text-slate-700" : "text-amber-900"
            )}>
              #{rankIndex}
            </Text>
          </View>
        </View>

        {/* Tên Người dùng */}
        <Text 
          className={cn(
            "font-bold font-inter text-center mt-2.5 mb-1 px-1",
            user.isMe ? "text-primary-700 font-extrabold" : "text-mascot-navy",
            isGold ? "text-[14px]" : "text-[13px]"
          )} 
          numberOfLines={1}
        >
          {user.name} {user.isMe && "(Bạn)"}
        </Text>

        {/* Điểm XP */}
        <View className={cn(
          "px-2.5 py-0.5 rounded-full mb-3",
          isGold ? "bg-amber-100" : isSilver ? "bg-slate-100" : "bg-orange-100"
        )}>
          <Text className={cn(
            "font-extrabold font-nunito text-[12px]",
            isGold ? "text-amber-800" : isSilver ? "text-slate-700" : "text-amber-900"
          )}>
            {user.xp.toLocaleString()} XP
          </Text>
        </View>

        {/* Khối bệ đứng Podium 3D (Step Pedestal) */}
        <View 
          style={{ height: pedestalHeight }}
          className={cn(
            "w-full rounded-t-2xl items-center justify-start pt-2 border-t-2 border-x shadow-inner",
            isGold 
              ? "bg-[#FEF3C7] border-[#FDE68A]" 
              : isSilver 
              ? "bg-[#F1F5F9] border-[#CBD5E1]" 
              : "bg-[#FFEDD5] border-[#FED7AA]"
          )}
        >
          <View className={cn(
            "w-8 h-8 rounded-full items-center justify-center border",
            isGold 
              ? "bg-amber-400/30 border-amber-500/50" 
              : isSilver 
              ? "bg-slate-300/40 border-slate-400/50" 
              : "bg-orange-400/30 border-orange-500/50"
          )}>
            <Text className={cn(
              "font-black font-nunito text-[16px]",
              isGold ? "text-amber-700" : isSilver ? "text-slate-600" : "text-orange-800"
            )}>
              {rankIndex}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // ==========================================
  // LIST ITEM & ZONE DIVIDERS
  // ==========================================
  const renderItem = ({ item }: { item: LeaderboardUser }) => {
    // Bỏ qua top 3 vì đã render trên Podium
    if (item.rank <= 3) return null;

    const showPromotionDivider = item.rank === 6;  // Giữa hạng 5 và 6
    const showDemotionDivider = item.rank === 21;  // Giữa hạng 20 và 21

    return (
      <View>
        {/* Vạch ngăn cách: Khu vực Thăng hạng (Top 1–5) */}
        {showPromotionDivider && (
          <View className="mx-4 my-2 px-3.5 py-2 bg-emerald-50 rounded-xl border border-emerald-200/80 flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5">
              <ChevronUpIcon size={16} color="#059669" />
              <Text className="font-extrabold text-[12px] text-emerald-800 font-nunito uppercase tracking-wide">
                Khu vực Thăng hạng (Top 1–5)
              </Text>
            </View>
            <Text className="font-bold text-[11px] text-emerald-700 font-inter">
              Lên Giải Vàng 🏆
            </Text>
          </View>
        )}

        {/* Vạch ngăn cách: Khu vực Rớt hạng (Hạng 21–30) - Tuân thủ không guilt-trip */}
        {showDemotionDivider && (
          <View className="mx-4 my-2 px-3.5 py-2 bg-neutral-100 rounded-xl border border-neutral-200 flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5">
              <ChevronDownIcon size={16} color="#757793" />
              <Text className="font-extrabold text-[12px] text-neutral-600 font-nunito uppercase tracking-wide">
                Khu vực Rớt hạng (Hạng 21–30)
              </Text>
            </View>
            <Text className="font-medium text-[11px] text-neutral-500 font-inter">
              Cố lên để trụ hạng!
            </Text>
          </View>
        )}

        {/* Hàng người dùng (§10.4 Design Spec) */}
        <View 
          className={cn(
            "mx-4 my-1 flex-row items-center px-3.5 py-3 rounded-2xl border",
            item.isMe 
              ? "bg-[#F0FCE4] border-l-[5px] border-l-primary-500 border-primary-300 shadow-sm" 
              : "bg-white border-neutral-100"
          )}
        >
          {/* Thứ hạng & Xu hướng */}
          <View className="w-12 flex-row items-center gap-1">
            <Text className={cn(
              "font-extrabold text-[15px] font-nunito",
              item.isMe ? "text-primary-700" : "text-neutral-500"
            )}>
              #{item.rank}
            </Text>
            {/* Trend Indicator */}
            {item.trend === 'up' && <ChevronUpIcon size={14} color="#0D9488" />}
            {item.trend === 'down' && <ChevronDownIcon size={14} color="#757793" />}
            {item.trend === 'same' && <MinusIcon size={12} color="#9597AD" />}
          </View>

          {/* Avatar */}
          <View 
            style={{ backgroundColor: item.avatarColor }}
            className={cn(
              "w-9 h-9 rounded-full items-center justify-center mr-3 shadow-xs",
              item.isMe && "ring-2 ring-primary-400"
            )}
          >
            <Text className="font-extrabold text-[12px] text-white font-nunito">
              {item.name.substring(0, 2).toUpperCase()}
            </Text>
          </View>

          {/* Tên */}
          <View className="flex-1 justify-center mr-2">
            <View className="flex-row items-center gap-1.5">
              <Text 
                className={cn(
                  "font-bold text-[14px] font-inter",
                  item.isMe ? "text-mascot-navy font-extrabold" : "text-neutral-700"
                )}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              {item.isMe && (
                <View className="bg-primary-500 px-1.5 py-0.2 rounded-md">
                  <Text className="font-black text-[9px] text-white font-nunito uppercase tracking-wider">
                    Bạn
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Điểm XP */}
          <View className="items-end">
            <Text className={cn(
              "font-extrabold text-[15px] font-nunito tabular-nums",
              item.isMe ? "text-primary-700" : "text-mascot-navy"
            )}>
              {item.xp.toLocaleString()} XP
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* ==========================================
          HEADER CHÍNH
          ========================================== */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-neutral-100 z-10">
        <Pressable 
          onPress={() => router.back()} 
          hitSlop={12}
          className="w-10 h-10 items-center justify-center -ml-2 rounded-full active:bg-neutral-100"
        >
          <ArrowLeftIcon size={24} color="#1E2A44" />
        </Pressable>
        <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">
          Bảng Xếp Hạng
        </Text>
        <Pressable 
          onPress={() => setShowRulesModal(true)}
          hitSlop={12}
          className="w-10 h-10 items-center justify-center -mr-2 rounded-full active:bg-neutral-100"
        >
          <InfoIcon size={20} color="#565879" />
        </Pressable>
      </View>

      {/* ==========================================
          LEAGUE STATUS & COUNTDOWN BAR
          ========================================== */}
      <View className="bg-white px-4 py-2.5 border-b border-neutral-100 flex-row items-center justify-between z-10 shadow-xs">
        {/* League Info Chip */}
        <Pressable 
          onPress={() => setShowRulesModal(true)}
          className="flex-row items-center gap-1.5 bg-slate-100/90 px-3 py-1.5 rounded-xl border border-slate-200 active:bg-slate-200"
        >
          <ShieldIcon size={16} color="#64748B" fill="#CBD5E1" />
          <Text className="font-extrabold text-[13px] text-slate-800 font-nunito">
            {MOCK_CONFIG.leagueName}
          </Text>
          <InfoIcon size={12} color="#64748B" />
        </Pressable>

        {/* Weekly Countdown Chip */}
        <View className="flex-row items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/80">
          <ClockIcon size={13} color="#D97706" />
          <Text className="font-bold text-[12px] text-amber-800 font-nunito">
            Còn {MOCK_CONFIG.timeRemaining}
          </Text>
        </View>
      </View>

      {/* ==========================================
          LEADERBOARD FLATLIST
          ========================================== */}
      <FlatList
        ref={flatListRef}
        data={LEADERBOARD_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
        getItemLayout={(_, index) => ({
          length: 56,
          offset: 280 + (index - 3) * 56,
          index,
        })}
        ListHeaderComponent={
          /* TOP 3 PODIUM SECTION */
          <View className="bg-white pt-6 px-4 border-b border-neutral-100 shadow-sm shadow-black/5 mb-3">
            <View className="flex-row items-end justify-center gap-3 px-2">
              {renderPodiumUser(LEADERBOARD_DATA[1], 2)}
              {renderPodiumUser(LEADERBOARD_DATA[0], 1)}
              {renderPodiumUser(LEADERBOARD_DATA[2], 3)}
            </View>
          </View>
        }
      />

      {/* ==========================================
          STICKY "VỊ TRÍ CỦA BẠN" CARD
          Định vị tại bottom-[84px] để nằm trên Bottom Tab Bar
          ========================================== */}
      {showSticky && meData && (
        <View className="absolute bottom-[84px] left-4 right-4 z-50">
          <Pressable 
            onPress={scrollToMe}
            className="bg-mascot-navy rounded-2xl p-3.5 shadow-xl shadow-mascot-navy/30 flex-row items-center border border-slate-700/60 active:scale-[0.99]"
          >
            {/* Rank badge */}
            <View className="w-10 h-10 rounded-xl bg-amber-400/20 items-center justify-center mr-3 border border-amber-400/30">
              <Text className="font-extrabold text-[17px] text-amber-400 font-nunito">
                #{meData.rank}
              </Text>
            </View>
            
            {/* Thông điệp Goal-Gradient */}
            <View className="flex-1 mr-2">
              <Text className="font-bold text-[14px] text-white font-inter">
                Vị trí của bạn
              </Text>
              {xpNeeded > 0 ? (
                <View className="flex-row items-center gap-1 mt-0.5">
                  <FlameIcon size={12} color="#FBBF24" fill="#FBBF24" />
                  <Text className="font-bold text-[12px] text-amber-400 font-inter">
                    Còn {xpNeeded} XP để lên #{meData.rank - 1}
                  </Text>
                </View>
              ) : (
                <Text className="font-medium text-[11px] text-slate-300 font-inter mt-0.5">
                  Bạn đang ở phong độ rất tốt!
                </Text>
              )}
            </View>

            {/* XP & CTA */}
            <View className="items-end">
              <Text className="font-extrabold text-[15px] text-white font-nunito">
                {meData.xp.toLocaleString()} XP
              </Text>
              <Text className="font-bold text-[11px] text-primary-400 font-inter mt-0.5">
                Chạm để xem ↓
              </Text>
            </View>
          </Pressable>
        </View>
      )}

      {/* ==========================================
          MODAL: THỂ LỆ & PHẦN THƯỞNG GIẢI ĐẤU
          ========================================== */}
      <Modal
        visible={showRulesModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRulesModal(false)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center p-5">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-neutral-100">
            
            {/* Modal Header */}
            <View className="flex-row items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <View className="flex-row items-center gap-2">
                <ShieldIcon size={20} color="#64748B" fill="#CBD5E1" />
                <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">
                  {MOCK_CONFIG.leagueName}
                </Text>
              </View>
              <Pressable 
                onPress={() => setShowRulesModal(false)}
                hitSlop={12}
                className="w-8 h-8 items-center justify-center rounded-full bg-neutral-100"
              >
                <XIcon size={18} color="#565879" />
              </Pressable>
            </View>

            {/* Modal Graphic */}
            <View className="items-center justify-center my-1">
              <AchievementTrophy3D size="lg" />
              <Text className="font-bold text-[13px] text-neutral-500 font-inter mt-2">
                Kết thúc sau: <Text className="font-extrabold text-amber-700">{MOCK_CONFIG.timeRemaining}</Text>
              </Text>
            </View>

            {/* Quy tắc thăng / rớt hạng */}
            <View className="bg-neutral-50 rounded-2xl p-3.5 my-4 border border-neutral-200/80 gap-2.5">
              <View className="flex-row items-center gap-2">
                <View className="w-5 h-5 rounded-full bg-emerald-100 items-center justify-center">
                  <ChevronUpIcon size={14} color="#059669" />
                </View>
                <Text className="font-medium text-[13px] text-neutral-700 font-inter flex-1">
                  <Text className="font-bold text-emerald-700">Top 1 – 5:</Text> Thăng hạng lên Giải Vàng 🏆
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <View className="w-5 h-5 rounded-full bg-slate-200 items-center justify-center">
                  <MinusIcon size={12} color="#475569" />
                </View>
                <Text className="font-medium text-[13px] text-neutral-700 font-inter flex-1">
                  <Text className="font-bold text-slate-700">Hạng 6 – 20:</Text> Trụ vững tại Giải Bạc 🛡️
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <View className="w-5 h-5 rounded-full bg-neutral-200 items-center justify-center">
                  <ChevronDownIcon size={14} color="#757793" />
                </View>
                <Text className="font-medium text-[13px] text-neutral-700 font-inter flex-1">
                  <Text className="font-bold text-neutral-600">Hạng 21 – 30:</Text> Rớt xuống Giải Đồng ⚠️
                </Text>
              </View>
            </View>

            {/* Phần thưởng tuần */}
            <Text className="font-extrabold text-[13px] text-neutral-400 font-nunito uppercase tracking-wider mb-2">
              Phần thưởng cuối tuần
            </Text>
            <View className="flex-row gap-2 mb-5">
              <View className="flex-1 bg-amber-50 rounded-xl p-2.5 border border-amber-200 items-center">
                <Text className="font-bold text-[12px] text-amber-800 font-inter mb-1">🥇 Top 1</Text>
                <Text className="font-extrabold text-[14px] text-amber-700 font-nunito">+150 Coin</Text>
              </View>
              <View className="flex-1 bg-slate-50 rounded-xl p-2.5 border border-slate-200 items-center">
                <Text className="font-bold text-[12px] text-slate-800 font-inter mb-1">🥈 Top 2</Text>
                <Text className="font-extrabold text-[14px] text-slate-700 font-nunito">+100 Coin</Text>
              </View>
              <View className="flex-1 bg-orange-50 rounded-xl p-2.5 border border-orange-200 items-center">
                <Text className="font-bold text-[12px] text-orange-900 font-inter mb-1">🥉 Top 3</Text>
                <Text className="font-extrabold text-[14px] text-orange-800 font-nunito">+60 Coin</Text>
              </View>
            </View>

            {/* CTA Button */}
            <Pressable 
              onPress={() => setShowRulesModal(false)}
              className="w-full h-12 bg-primary-500 rounded-xl border-b-[3px] border-primary-700 active:bg-primary-600 items-center justify-center shadow-md shadow-primary-500/20"
            >
              <Text className="font-extrabold text-[15px] text-white font-nunito uppercase tracking-wider">
                ĐÃ HIỂU
              </Text>
            </Pressable>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
