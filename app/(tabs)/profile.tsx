import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  SettingsIcon, 
  PackageIcon, 
  ChevronRightIcon, 
  BookOpenIcon, 
  CrownIcon, 
  Edit2Icon, 
  Share2Icon, 
  BellIcon, 
  SparklesIcon, 
  CopyIcon, 
  CheckIcon, 
  XIcon, 
  ShieldIcon, 
  FlameIcon, 
  CheckCircle2Icon, 
  HelpCircleIcon 
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';
import { 
  StreakFlame3D, 
  Coin3D, 
  XPOrb3D, 
  AchievementTrophy3D 
} from '@/components/snapvocab';
import { useEconomyState } from '@/lib/economyState';

// ==========================================
// USER STATS & CONFIG
// ==========================================
const USER_PROFILE = {
  name: 'Alex Nguyen',
  username: '@alexnguyen',
  email: 'alex@example.com',
  joinDate: 'Tháng 3, 2024',
  level: 12,
  xp: 2450,
  targetXp: 3000,
  streak: 12,
  longestStreak: 27,
  learnedWords: 1284,
  league: {
    name: 'Giải đấu Bạc',
    rank: 12,
    tier: 'silver'
  }
};

const FEATURED_BADGES = [
  { 
    id: 'b1', 
    name: 'Word Collector', 
    rarity: 'Hiếm',
    imageSource: require('../../assets/images/shop/badge1_clean.png'), 
    color: 'bg-info-50 text-info-600', 
    border: 'border-info-200' 
  },
  { 
    id: 'b2', 
    name: 'Streak Champ', 
    rarity: 'Cực hiếm',
    imageSource: require('../../assets/images/shop/badge2_clean.png'), 
    color: 'bg-danger-50 text-danger-500', 
    border: 'border-danger-200' 
  },
  { 
    id: 'b6', 
    name: 'First Steps', 
    rarity: 'Phổ biến',
    imageSource: require('../../assets/images/shop/badge6_clean.png'), 
    color: 'bg-primary-50 text-primary-600', 
    border: 'border-primary-200' 
  },
  { 
    id: 'b10', 
    name: 'Speed Learner', 
    rarity: 'Huyền thoại',
    imageSource: require('../../assets/images/shop/badge10_clean.png'), 
    color: 'bg-reward-50 text-reward-600', 
    border: 'border-reward-200' 
  }
];

export default function ProfileScreen() {
  const [economy] = useEconomyState();
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Tìm khung avatar đang trang bị từ kho đồ
  const equippedFrame = economy.inventory.find(
    item => item.category === 'frame' && item.state === 'equipped'
  );
  const inventoryItemsCount = economy.inventory.length;

  const handleCopyProfileLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const progressPercent = Math.min(
    100, 
    Math.round((USER_PROFILE.xp / USER_PROFILE.targetXp) * 100)
  );
  const remainingXp = USER_PROFILE.targetXp - USER_PROFILE.xp;

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      
      {/* ========================================== */}
      {/* 1. TOP APP BAR (Slim & Functional) */}
      {/* ========================================== */}
      <View className="px-5 py-3.5 bg-white border-b border-neutral-100 flex-row items-center justify-between z-10">
        <View className="flex-row items-center gap-2">
          <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito tracking-tight">
            Hồ sơ cá nhân
          </Text>
          <View className="bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-100">
            <Text className="font-bold text-[11px] text-primary-700 font-inter">PRO</Text>
          </View>
        </View>

        {/* Quick Action Icons */}
        <View className="flex-row items-center gap-2">
          <Pressable 
            onPress={() => router.push('/profile/notifications' as any)}
            className="w-10 h-10 bg-neutral-50 rounded-full items-center justify-center border border-neutral-200/60 active:scale-95 transition-all relative"
            accessibilityLabel="Thông báo"
          >
            <BellIcon size={19} className="text-neutral-600" />
            <View className="w-2.5 h-2.5 bg-danger-500 rounded-full absolute top-1.5 right-1.5 border-2 border-white" />
          </Pressable>

          <Pressable 
            onPress={() => setShowShareModal(true)}
            className="w-10 h-10 bg-neutral-50 rounded-full items-center justify-center border border-neutral-200/60 active:scale-95 transition-all"
            accessibilityLabel="Chia sẻ hồ sơ"
          >
            <Share2Icon size={18} className="text-neutral-600" />
          </Pressable>

          <Pressable 
            onPress={() => router.push('/profile/settings' as any)}
            className="w-10 h-10 bg-neutral-50 rounded-full items-center justify-center border border-neutral-200/60 active:scale-95 transition-all"
            accessibilityLabel="Cài đặt"
          >
            <SettingsIcon size={19} className="text-neutral-600" />
          </Pressable>
        </View>
      </View>

      {/* ========================================== */}
      {/* 2. MAIN SCROLLABLE CONTENT */}
      {/* ========================================== */}
      <ScrollView 
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        
        {/* --- IDENTITY HERO CARD --- */}
        <View className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm shadow-black/5 mb-4 items-center">
          
          {/* Avatar with Equipped Frame */}
          <View className="relative mb-3.5 items-center justify-center">
            {/* Outer Frame Glow / Decorated Ring */}
            <View className={cn(
              "w-24 h-24 rounded-full items-center justify-center p-1.5 border-2",
              equippedFrame 
                ? "border-warning-400 bg-warning-50/50 shadow-md shadow-warning-500/20" 
                : "border-primary-400 bg-primary-50/50"
            )}>
              {/* Inner Avatar Bubble */}
              <View className="w-full h-full bg-primary-500 rounded-full items-center justify-center shadow-inner overflow-hidden">
                <Text className="font-extrabold text-[30px] text-white font-nunito tracking-wide">
                  AL
                </Text>
              </View>
            </View>

            {/* Frame Crown / Badge Indicator */}
            <View className="absolute -bottom-1 -right-1 bg-reward-500 rounded-full p-1.5 border-2 border-white shadow-sm">
              <CrownIcon size={14} className="text-mascot-navy" fill="#1B1B3A" />
            </View>

            {/* Equipped Frame Name Pill */}
            {equippedFrame && (
              <View className="absolute -top-2.5 bg-mascot-navy px-2.5 py-0.5 rounded-full border border-white shadow-sm">
                <Text className="font-bold text-[10px] text-white font-inter">
                  {equippedFrame.name}
                </Text>
              </View>
            )}
          </View>

          {/* User Names & Meta */}
          <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito mb-0.5 text-center">
            {USER_PROFILE.name}
          </Text>
          
          <View className="flex-row items-center gap-2 mb-3.5">
            <Text className="font-semibold text-[13px] text-neutral-400 font-inter">
              {USER_PROFILE.username}
            </Text>
            <View className="w-1 h-1 rounded-full bg-neutral-300" />
            <Text className="font-medium text-[13px] text-neutral-400 font-inter">
              {USER_PROFILE.joinDate}
            </Text>
          </View>

          {/* Edit Profile Action Button */}
          <Pressable 
            onPress={() => router.push('/profile/edit' as any)}
            className="bg-neutral-100 hover:bg-neutral-200/80 px-5 py-2 rounded-full flex-row items-center gap-2 active:scale-95 transition-all mb-4"
          >
            <Edit2Icon size={14} className="text-neutral-700" />
            <Text className="font-bold text-[13px] text-neutral-700 font-inter">
              Chỉnh sửa hồ sơ
            </Text>
          </Pressable>

          {/* Mascot Snapy Encouragement Banner */}
          <View className="w-full bg-[#FFF9E6] border border-warning-200/80 rounded-2xl p-3 flex-row items-center gap-3">
            <View style={{ width: 50, height: 50 }} className="items-center justify-center flex-shrink-0">
              <Snapy pose="tu_hao" animation="idle" style={{ width: 50, height: 50 }} />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-1">
                <Text className="font-extrabold text-[13px] text-warning-800 font-nunito">
                  Snapy chúc mừng!
                </Text>
                <SparklesIcon size={12} color="#D97706" />
              </View>
              <Text className="font-medium text-[12px] text-warning-900/80 font-inter mt-0.5 leading-4">
                Bạn đang duy trì chuỗi {USER_PROFILE.streak} ngày xuất sắc! Hãy tiếp tục phát huy nhé!
              </Text>
            </View>
          </View>

        </View>

        {/* --- ASSET & LEAGUE STRIP (Ví xu & Bảng xếp hạng) --- */}
        <View className="flex-row gap-3 mb-4">
          
          {/* Coin Wallet Mini Card */}
          <Pressable 
            onPress={() => router.push('/profile/wallet' as any)}
            className="flex-1 bg-white rounded-2xl p-3.5 border border-neutral-200/80 shadow-sm shadow-black/5 active:scale-[0.98] transition-all"
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="w-8 h-8 items-center justify-center">
                <Coin3D size="sm" animation="shine" />
              </View>
              <ChevronRightIcon size={16} className="text-neutral-400" />
            </View>
            <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito tabular-nums">
              {economy.coins.toLocaleString()}
            </Text>
            <Text className="font-bold text-[11px] text-neutral-400 font-inter uppercase mt-0.5">
              Ví xu thưởng
            </Text>
          </Pressable>

          {/* Weekly League Mini Card */}
          <Pressable 
            onPress={() => router.push('/(tabs)/leaderboard' as any)}
            className="flex-1 bg-white rounded-2xl p-3.5 border border-neutral-200/80 shadow-sm shadow-black/5 active:scale-[0.98] transition-all"
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="w-8 h-8 items-center justify-center">
                <AchievementTrophy3D size="sm" />
              </View>
              <ChevronRightIcon size={16} className="text-neutral-400" />
            </View>
            <View className="flex-row items-center gap-1.5">
              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">
                #{USER_PROFILE.league.rank}
              </Text>
              <Text className="font-bold text-[12px] text-neutral-500 font-inter">
                {USER_PROFILE.league.name}
              </Text>
            </View>
            <Text className="font-bold text-[11px] text-neutral-400 font-inter uppercase mt-0.5">
              Đua top tuần
            </Text>
          </Pressable>

        </View>

        {/* --- LEARNING PROGRESS HUB --- */}
        <View className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm shadow-black/5 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">
              Tiến độ học tập
            </Text>
            <Pressable 
              onPress={() => router.push('/(tabs)/stats' as any)}
              className="flex-row items-center gap-1 active:opacity-75"
            >
              <Text className="font-bold text-[12px] text-primary-600 font-inter">Chi tiết</Text>
              <ChevronRightIcon size={14} className="text-primary-600" />
            </Pressable>
          </View>

          {/* 2 Big Stat Badges */}
          <View className="flex-row gap-3 mb-4">
            
            {/* Streak Card */}
            <Pressable 
              onPress={() => router.push('/(tabs)/stats' as any)}
              className="flex-1 bg-[#FFF5EB] rounded-2xl p-3.5 border border-warning-200/80 active:scale-[0.98]"
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="w-8 h-8 items-center justify-center">
                  <StreakFlame3D size="sm" animation="pulse" state="active" />
                </View>
                <View className="bg-warning-200/60 px-2 py-0.5 rounded-full">
                  <Text className="font-extrabold text-[10px] text-warning-800 font-inter">Kỷ lục {USER_PROFILE.longestStreak}d</Text>
                </View>
              </View>
              <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito tabular-nums mb-0.5">
                {USER_PROFILE.streak} ngày
              </Text>
              <Text className="font-bold text-[11px] text-neutral-500 font-inter">
                Chuỗi học tập liên tục
              </Text>
            </Pressable>

            {/* Mastered Words Card */}
            <Pressable 
              onPress={() => router.push('/(tabs)/stats' as any)}
              className="flex-1 bg-info-50/70 rounded-2xl p-3.5 border border-info-200/80 active:scale-[0.98]"
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="w-8 h-8 bg-info-100 rounded-xl items-center justify-center">
                  <BookOpenIcon size={18} className="text-info-600" />
                </View>
                <View className="bg-info-200/60 px-2 py-0.5 rounded-full">
                  <Text className="font-extrabold text-[10px] text-info-800 font-inter">Flashcard</Text>
                </View>
              </View>
              <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito tabular-nums mb-0.5">
                {USER_PROFILE.learnedWords.toLocaleString()}
              </Text>
              <Text className="font-bold text-[11px] text-neutral-500 font-inter">
                Từ vựng đã thuộc
              </Text>
            </Pressable>

          </View>

          {/* Level & XP Progress Card */}
          <Pressable 
            onPress={() => router.push('/stats/level-progress' as any)}
            className="bg-[#F8FAFC] rounded-2xl p-4 border border-neutral-200/80 active:scale-[0.98] transition-all"
          >
            <View className="flex-row items-center justify-between mb-2.5">
              <View className="flex-row items-center gap-2">
                <View className="w-6 h-6 items-center justify-center">
                  <XPOrb3D size="xs" animation="pulse" />
                </View>
                <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">
                  Cấp độ {USER_PROFILE.level}
                </Text>
              </View>
              <Text className="font-extrabold text-[13px] text-primary-600 font-inter tabular-nums">
                {USER_PROFILE.xp.toLocaleString()} <Text className="text-neutral-400 font-medium">/ {USER_PROFILE.targetXp.toLocaleString()} XP</Text>
              </Text>
            </View>

            {/* Smooth Progress Bar */}
            <View className="h-3 w-full bg-neutral-200/80 rounded-full overflow-hidden mb-2 p-0.5">
              <View 
                className="h-full bg-primary-500 rounded-full shadow-sm" 
                style={{ width: `${progressPercent}%` }}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="font-medium text-[11px] text-neutral-500 font-inter">
                Còn <Text className="font-bold text-mascot-navy">{remainingXp} XP</Text> nữa để lên Cấp {USER_PROFILE.level + 1}
              </Text>
              <Text className="font-bold text-[11px] text-primary-600 font-inter">
                Lộ trình cấp độ →
              </Text>
            </View>
          </Pressable>

        </View>

        {/* --- FEATURED BADGES SHOWCASE --- */}
        <View className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm shadow-black/5 mb-4">
          <View className="flex-row items-center justify-between mb-3.5">
            <View className="flex-row items-center gap-2">
              <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">
                Huy hiệu nổi bật
              </Text>
              <View className="bg-neutral-100 px-2 py-0.5 rounded-full">
                <Text className="font-bold text-[11px] text-neutral-600 font-inter">4/24</Text>
              </View>
            </View>

            <Pressable 
              onPress={() => router.push('/(tabs)/achievements' as any)}
              className="flex-row items-center gap-1 active:opacity-75"
            >
              <Text className="font-bold text-[13px] text-info-600 font-inter">Xem tất cả</Text>
              <ChevronRightIcon size={14} className="text-info-600" />
            </Pressable>
          </View>
          
          <Pressable 
            onPress={() => router.push('/(tabs)/achievements' as any)}
            className="flex-row items-center justify-between active:opacity-90"
          >
            {FEATURED_BADGES.map(badge => (
              <View key={badge.id} className="items-center w-[23%]">
                <View className={cn(
                  "w-14 h-14 rounded-2xl items-center justify-center mb-1.5 border overflow-hidden bg-neutral-50 shadow-sm",
                  badge.border
                )}>
                  <Image 
                    source={badge.imageSource} 
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                  />
                </View>
                <Text 
                  className="font-bold text-[11px] text-neutral-700 font-inter text-center"
                  numberOfLines={1}
                >
                  {badge.name}
                </Text>
                <Text className="font-semibold text-[9px] text-neutral-400 font-inter text-center">
                  {badge.rarity}
                </Text>
              </View>
            ))}
          </Pressable>
        </View>

        {/* --- UTILITIES & SETTINGS MENU (Clean & Non-redundant) --- */}
        <View className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm shadow-black/5 divide-y divide-neutral-100 overflow-hidden mb-6">
          
          {/* Kho vật phẩm & Trang bị */}
          <Pressable 
            onPress={() => router.push('/profile/inventory' as any)}
            className="flex-row items-center p-4 active:bg-neutral-50 transition-colors"
          >
            <View className="w-10 h-10 bg-primary-50 rounded-xl items-center justify-center mr-3.5 border border-primary-100">
              <PackageIcon size={20} className="text-primary-600" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-[15px] text-mascot-navy font-inter">
                Kho vật phẩm & Trang bị
              </Text>
              <Text className="font-medium text-[12px] text-neutral-400 font-inter">
                Khung đại diện, thẻ tăng tốc XP
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="bg-neutral-100 px-2 py-0.5 rounded-full">
                <Text className="font-extrabold text-[11px] text-neutral-600 font-inter">
                  {inventoryItemsCount} món
                </Text>
              </View>
              <ChevronRightIcon size={18} className="text-neutral-400" />
            </View>
          </Pressable>

          {/* Thông báo & Lời nhắc SRS */}
          <Pressable 
            onPress={() => router.push('/profile/notifications' as any)}
            className="flex-row items-center p-4 active:bg-neutral-50 transition-colors"
          >
            <View className="w-10 h-10 bg-warning-50 rounded-xl items-center justify-center mr-3.5 border border-warning-100">
              <BellIcon size={20} className="text-warning-600" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-[15px] text-mascot-navy font-inter">
                Thông báo & Lời nhắc SRS
              </Text>
              <Text className="font-medium text-[12px] text-neutral-400 font-inter">
                Nhắc nhở ôn từ vựng định kỳ
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-2 h-2 rounded-full bg-danger-500" />
              <ChevronRightIcon size={18} className="text-neutral-400" />
            </View>
          </Pressable>

          {/* Chia sẻ Thẻ học viên VIP */}
          <Pressable 
            onPress={() => setShowShareModal(true)}
            className="flex-row items-center p-4 active:bg-neutral-50 transition-colors"
          >
            <View className="w-10 h-10 bg-info-50 rounded-xl items-center justify-center mr-3.5 border border-info-100">
              <Share2Icon size={20} className="text-info-600" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-[15px] text-mascot-navy font-inter">
                Chia sẻ thẻ thành tích VIP
              </Text>
              <Text className="font-medium text-[12px] text-neutral-400 font-inter">
                Khoe chuỗi Streak và cấp độ với bạn bè
              </Text>
            </View>
            <ChevronRightIcon size={18} className="text-neutral-400" />
          </Pressable>

          {/* Cài đặt ứng dụng */}
          <Pressable 
            onPress={() => router.push('/profile/settings' as any)}
            className="flex-row items-center p-4 active:bg-neutral-50 transition-colors"
          >
            <View className="w-10 h-10 bg-neutral-100 rounded-xl items-center justify-center mr-3.5">
              <SettingsIcon size={20} className="text-neutral-600" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-[15px] text-mascot-navy font-inter">
                Cài đặt ứng dụng
              </Text>
              <Text className="font-medium text-[12px] text-neutral-400 font-inter">
                Tài khoản, bảo mật, ngôn ngữ
              </Text>
            </View>
            <ChevronRightIcon size={18} className="text-neutral-400" />
          </Pressable>

        </View>

        {/* App Version Info Footer */}
        <View className="items-center justify-center pt-2 pb-6">
          <Text className="font-bold text-[12px] text-neutral-400 font-inter">
            SnapVocab v1.2.4 (Build 42)
          </Text>
          <Text className="font-medium text-[11px] text-neutral-300 font-inter mt-0.5">
            Học thông minh · Nhớ trọn đời
          </Text>
        </View>

      </ScrollView>

      {/* ========================================== */}
      {/* 3. SHARE PROFILE CARD MODAL */}
      {/* ========================================== */}
      <Modal
        visible={showShareModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowShareModal(false)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center p-5">
          <Pressable 
            className="absolute inset-0" 
            onPress={() => setShowShareModal(false)} 
          />

          <View className="w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl relative items-center border border-neutral-100">
            
            {/* Close Button */}
            <Pressable 
              onPress={() => setShowShareModal(false)}
              className="absolute top-4 right-4 w-9 h-9 bg-neutral-100 rounded-full items-center justify-center active:scale-95 z-20"
            >
              <XIcon size={18} className="text-neutral-600" />
            </Pressable>

            {/* VIP Card Graphic */}
            <View className="w-full bg-mascot-navy rounded-3xl p-5 items-center mb-5 relative overflow-hidden border-2 border-warning-400/40 shadow-xl">
              
              {/* Background Glow */}
              <View className="absolute -top-12 -right-12 w-36 h-36 bg-primary-500/20 rounded-full blur-2xl" />
              <View className="absolute -bottom-12 -left-12 w-36 h-36 bg-warning-500/20 rounded-full blur-2xl" />

              {/* Card Header Badge */}
              <View className="flex-row items-center justify-between w-full mb-4">
                <View className="bg-white/10 px-3 py-1 rounded-full border border-white/20 flex-row items-center gap-1.5">
                  <SparklesIcon size={12} color="#FBBF24" />
                  <Text className="font-extrabold text-[11px] text-warning-300 font-inter uppercase tracking-wider">
                    SnapVocab VIP Pass
                  </Text>
                </View>
                <Text className="font-bold text-[11px] text-white/60 font-inter">
                  Level {USER_PROFILE.level}
                </Text>
              </View>

              {/* User Avatar with Crown */}
              <View className="relative mb-3">
                <View className="w-20 h-20 rounded-full p-1 border-2 border-warning-400 bg-warning-50/20 items-center justify-center">
                  <View className="w-full h-full bg-primary-500 rounded-full items-center justify-center">
                    <Text className="font-extrabold text-[26px] text-white font-nunito">AL</Text>
                  </View>
                </View>
                <View className="absolute -bottom-1 -right-1 bg-reward-500 rounded-full p-1 border-2 border-mascot-navy">
                  <CrownIcon size={12} className="text-mascot-navy" />
                </View>
              </View>

              <Text className="font-extrabold text-[20px] text-white font-nunito mb-0.5">
                {USER_PROFILE.name}
              </Text>
              <Text className="font-medium text-[12px] text-white/70 font-inter mb-4">
                {USER_PROFILE.username} · {USER_PROFILE.league.name}
              </Text>

              {/* Stats Highlight Bar */}
              <View className="w-full flex-row bg-white/10 rounded-2xl p-3 border border-white/15 divide-x divide-white/20 mb-3">
                <View className="flex-1 items-center">
                  <Text className="font-extrabold text-[18px] text-warning-400 font-nunito tabular-nums">
                    {USER_PROFILE.streak}
                  </Text>
                  <Text className="font-bold text-[10px] text-white/80 font-inter uppercase">
                    Ngày Streak
                  </Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="font-extrabold text-[18px] text-primary-400 font-nunito tabular-nums">
                    {USER_PROFILE.learnedWords}
                  </Text>
                  <Text className="font-bold text-[10px] text-white/80 font-inter uppercase">
                    Từ đã thuộc
                  </Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="font-extrabold text-[18px] text-info-400 font-nunito tabular-nums">
                    {USER_PROFILE.xp}
                  </Text>
                  <Text className="font-bold text-[10px] text-white/80 font-inter uppercase">
                    Kinh nghiệm
                  </Text>
                </View>
              </View>

              {/* Mascot cheering */}
              <View className="flex-row items-center gap-2 pt-1">
                <View style={{ width: 36, height: 36 }} className="items-center justify-center flex-shrink-0">
                  <Snapy pose="celebrating" animation="bounce" style={{ width: 36, height: 36 }} />
                </View>
                <Text className="font-bold text-[12px] text-warning-200 font-inter">
                  Cùng học tiếng Anh với tôi nhé!
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View className="w-full gap-2.5">
              <Pressable
                onPress={handleCopyProfileLink}
                className={cn(
                  "w-full h-12 rounded-2xl flex-row items-center justify-center gap-2 transition-all active:scale-[0.98]",
                  copiedLink ? "bg-success-600" : "bg-primary-500 border-b-[3px] border-primary-700 active:translate-y-[1px] active:border-b-[1px]"
                )}
              >
                {copiedLink ? (
                  <>
                    <CheckIcon size={18} color="#FFFFFF" />
                    <Text className="font-extrabold text-[15px] text-white font-nunito">
                      Đã sao chép liên kết!
                    </Text>
                  </>
                ) : (
                  <>
                    <CopyIcon size={18} color="#FFFFFF" />
                    <Text className="font-extrabold text-[15px] text-white font-nunito uppercase tracking-wide">
                      Sao chép liên kết hồ sơ
                    </Text>
                  </>
                )}
              </Pressable>

              <Pressable
                onPress={() => setShowShareModal(false)}
                className="w-full h-11 rounded-2xl items-center justify-center active:bg-neutral-100"
              >
                <Text className="font-bold text-[14px] text-neutral-500 font-inter">
                  Đóng
                </Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
