import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Modal, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeftIcon,
  LockIcon,
  CheckCircle2Icon,
  XIcon,
  ChevronRightIcon,
  SparklesIcon,
  TrophyIcon,
  PinIcon,
  Share2Icon,
} from 'lucide-react-native';
import { AchievementTrophy3D, Coin3D, XPOrb3D } from '@/components/snapvocab';
import { Snapy } from '@/components/Snapy';
import { cn } from '@/lib/utils';

// ==========================================
// TYPES & CONFIG
// ==========================================
export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type Category = 'study' | 'streak' | 'scan' | 'quiz' | 'collector';
export type FilterTab = 'all' | 'unlocked' | 'locked';

export interface Badge {
  id: string;
  name: string;
  imageSource: any;
  isUnlocked: boolean;
  condition: string;
  progress?: number;
  total?: number;
  dateEarned?: string;
  rarity: Rarity;
  category: Category;
  coinReward: number;
  xpReward: number;
  actionRoute?: string;
  actionLabel?: string;
}

export const RARITY_CONFIG = {
  Common: { 
    label: 'Phổ biến', 
    color: 'text-neutral-600', 
    bg: 'bg-neutral-100', 
    border: 'border-neutral-200',
    badgeBorder: 'border-neutral-200'
  },
  Rare: { 
    label: 'Hiếm', 
    color: 'text-info-600', 
    bg: 'bg-info-50', 
    border: 'border-info-200',
    badgeBorder: 'border-info-300'
  },
  Epic: { 
    label: 'Cực hiếm', 
    color: 'text-purple-600', 
    bg: 'bg-purple-50', 
    border: 'border-purple-200',
    badgeBorder: 'border-purple-300'
  },
  Legendary: { 
    label: 'Huyền thoại', 
    color: 'text-warning-600', 
    bg: 'bg-warning-50', 
    border: 'border-warning-300',
    badgeBorder: 'border-warning-300'
  },
};

// ==========================================
// BADGES DATA (ĐỒNG BỘ 100% VỚI TRANH 3D)
// ==========================================
const MOCK_BADGES: Badge[] = [
  { 
    id: 'b1', 
    name: 'Word Collector', 
    imageSource: require('../../assets/images/shop/badge1_clean.png'), 
    isUnlocked: true, 
    condition: 'Sưu tập và học 100 từ vựng tiếng Anh.', 
    progress: 100, 
    total: 100, 
    dateEarned: '24/08/2026', 
    rarity: 'Common', 
    category: 'collector',
    coinReward: 50,
    xpReward: 100,
    actionRoute: '/(tabs)/learn',
    actionLabel: 'Học thêm từ mới'
  },
  { 
    id: 'b2', 
    name: 'Streak Champ', 
    imageSource: require('../../assets/images/shop/badge2_clean.png'), 
    isUnlocked: true, 
    condition: 'Duy trì chuỗi học tập 7 ngày liên tiếp.', 
    progress: 7, 
    total: 7, 
    dateEarned: '01/09/2026', 
    rarity: 'Rare', 
    category: 'streak',
    coinReward: 70,
    xpReward: 150,
    actionRoute: '/(tabs)/learn',
    actionLabel: 'Giữ chuỗi hôm nay'
  },
  { 
    id: 'b3', 
    name: 'Word Hunter', 
    imageSource: require('../../assets/images/shop/badge3_clean.png'), 
    isUnlocked: false, 
    condition: 'Scan nhận diện thành công 20 đồ vật thực tế.', 
    progress: 12, 
    total: 20, 
    rarity: 'Epic', 
    category: 'scan',
    coinReward: 80,
    xpReward: 200,
    actionRoute: '/(tabs)/scan',
    actionLabel: 'Bật máy ảnh quét ngay'
  },
  { 
    id: 'b4', 
    name: 'Memory Master', 
    imageSource: require('../../assets/images/shop/badge4_clean.png'), 
    isUnlocked: false, 
    condition: 'Ghi nhớ và hoàn thành 100 từ vựng qua SRS.', 
    progress: 45, 
    total: 100, 
    rarity: 'Epic', 
    category: 'study',
    coinReward: 100,
    xpReward: 250,
    actionRoute: '/(tabs)/learn',
    actionLabel: 'Ôn tập từ vựng ngay'
  },
  { 
    id: 'b5', 
    name: 'Quiz Master', 
    imageSource: require('../../assets/images/shop/badge5_clean.png'), 
    isUnlocked: false, 
    condition: 'Đạt chuỗi 50 câu trả lời đúng liên tiếp trong bài kiểm tra.', 
    progress: 28, 
    total: 50, 
    rarity: 'Rare', 
    category: 'quiz',
    coinReward: 60,
    xpReward: 120,
    actionRoute: '/(tabs)/learn',
    actionLabel: 'Luyện Quiz ngay'
  },
  { 
    id: 'b6', 
    name: 'First Steps', 
    imageSource: require('../../assets/images/shop/badge6_clean.png'), 
    isUnlocked: true, 
    condition: 'Bắt đầu và hoàn thành 10 từ vựng đầu tiên.', 
    progress: 10, 
    total: 10, 
    dateEarned: '20/08/2026', 
    rarity: 'Common', 
    category: 'study',
    coinReward: 30,
    xpReward: 50,
    actionRoute: '/(tabs)/learn',
    actionLabel: 'Học tiếp bài mới'
  },
  { 
    id: 'b7', 
    name: 'Word Hoarder', 
    imageSource: require('../../assets/images/shop/badge7_clean.png'), 
    isUnlocked: false, 
    condition: 'Sưu tập kho từ vựng đạt mốc 500 từ.', 
    progress: 142, 
    total: 500, 
    rarity: 'Legendary', 
    category: 'collector',
    coinReward: 200,
    xpReward: 500,
    actionRoute: '/(tabs)/learn',
    actionLabel: 'Nạp thêm từ mới'
  },
  { 
    id: 'b8', 
    name: 'Vocabulary Legend', 
    imageSource: require('../../assets/images/shop/badge8_clean.png'), 
    isUnlocked: false, 
    condition: 'Làm chủ và thành thạo 1.000 từ vựng tiếng Anh.', 
    progress: 185, 
    total: 1000, 
    rarity: 'Legendary', 
    category: 'collector',
    coinReward: 500,
    xpReward: 1000,
    actionRoute: '/(tabs)/learn',
    actionLabel: 'Chinh phục từ vựng'
  },
  { 
    id: 'b9', 
    name: 'World Explorer', 
    imageSource: require('../../assets/images/shop/badge9_clean.png'), 
    isUnlocked: false, 
    condition: 'Scan khám phá 20 chủ đề từ vựng khác nhau.', 
    progress: 7, 
    total: 20, 
    rarity: 'Epic', 
    category: 'scan',
    coinReward: 150,
    xpReward: 300,
    actionRoute: '/(tabs)/scan',
    actionLabel: 'Khám phá chủ đề mới'
  },
  { 
    id: 'b10', 
    name: 'Speed Learner', 
    imageSource: require('../../assets/images/shop/badge10_clean.png'), 
    isUnlocked: true, 
    condition: 'Tăng tốc học và ghi nhớ 20 từ vựng trong vòng 1 ngày.', 
    progress: 20, 
    total: 20, 
    dateEarned: '22/08/2026', 
    rarity: 'Rare', 
    category: 'study',
    coinReward: 80,
    xpReward: 150,
    actionRoute: '/(tabs)/learn',
    actionLabel: 'Thử thách tiếp'
  },
  { 
    id: 'b11', 
    name: 'Perfect Score', 
    imageSource: require('../../assets/images/shop/badge11_clean.png'), 
    isUnlocked: false, 
    condition: 'Đạt điểm tuyệt đối 100% trong bài kiểm tra Quiz.', 
    progress: 0, 
    total: 1, 
    rarity: 'Epic', 
    category: 'quiz',
    coinReward: 100,
    xpReward: 200,
    actionRoute: '/(tabs)/learn',
    actionLabel: 'Làm Quiz 100% điểm'
  },
  { 
    id: 'b12', 
    name: 'Love English', 
    imageSource: require('../../assets/images/shop/badge12_clean.png'), 
    isUnlocked: false, 
    condition: 'Duy trì tình yêu học tiếng Anh trong 30 ngày.', 
    progress: 14, 
    total: 30, 
    rarity: 'Legendary', 
    category: 'streak',
    coinReward: 300,
    xpReward: 600,
    actionRoute: '/(tabs)/learn',
    actionLabel: 'Tiếp tục chuỗi ngày'
  },
];

export default function AchievementsScreen() {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [pinnedBadgeId, setPinnedBadgeId] = useState<string>('b1');

  // Dynamic statistics
  const totalBadges = MOCK_BADGES.length;
  const totalUnlocked = useMemo(() => MOCK_BADGES.filter(b => b.isUnlocked).length, []);
  const completionPercent = Math.round((totalUnlocked / totalBadges) * 100);

  // Total rewards earned from achievements
  const totalCoinsEarned = useMemo(() => 
    MOCK_BADGES.filter(b => b.isUnlocked).reduce((sum, b) => sum + b.coinReward, 0), 
  []);
  const totalXpEarned = useMemo(() => 
    MOCK_BADGES.filter(b => b.isUnlocked).reduce((sum, b) => sum + b.xpReward, 0), 
  []);

  // Filtered badges list
  const filteredBadges = useMemo(() => {
    if (filterTab === 'unlocked') return MOCK_BADGES.filter(b => b.isUnlocked);
    if (filterTab === 'locked') return MOCK_BADGES.filter(b => !b.isUnlocked);
    return MOCK_BADGES;
  }, [filterTab]);

  const handlePinBadge = (badge: Badge) => {
    setPinnedBadgeId(badge.id);
    Alert.alert("Thành công", `Đã ghim huy hiệu "${badge.name}" lên mục nổi bật trang Hồ sơ!`);
  };

  const renderBadgeItem = (badge: Badge) => {
    const isPinned = pinnedBadgeId === badge.id;
    const progressPercent = badge.total && badge.progress ? Math.min(100, Math.round((badge.progress / badge.total) * 100)) : 0;

    return (
      <Pressable 
        key={badge.id}
        onPress={() => setSelectedBadge(badge)}
        className={cn(
          "w-[48%] bg-white rounded-3xl p-3.5 border-2 border-b-4 mb-4 items-center relative overflow-hidden active:border-b-2 active:translate-y-[2px]",
          badge.isUnlocked 
            ? "border-neutral-200/80 border-b-neutral-300 shadow-sm" 
            : "border-neutral-100 border-b-neutral-200/80 opacity-90"
        )}
      >
        {/* Rarity Tag */}
        <View className="w-full flex-row justify-between items-center mb-1">
          <View className={cn(
            "px-2 py-0.5 rounded-full border",
            RARITY_CONFIG[badge.rarity].bg,
            RARITY_CONFIG[badge.rarity].border
          )}>
            <Text className={cn("text-[10px] font-extrabold font-nunito", RARITY_CONFIG[badge.rarity].color)}>
              {RARITY_CONFIG[badge.rarity].label}
            </Text>
          </View>

          {isPinned && (
            <View className="flex-row items-center gap-0.5 bg-reward-100 px-1.5 py-0.5 rounded-full border border-reward-300">
              <PinIcon size={10} color="#B37F00" />
              <Text className="text-[9px] font-extrabold text-reward-700 font-nunito">Đã ghim</Text>
            </View>
          )}
        </View>

        {/* 3D Badge Visual Container */}
        <View className="w-24 h-24 items-center justify-center my-1 relative">
          <Image 
            source={badge.imageSource} 
            style={{ width: '100%', height: '100%' }}
            className={cn(!badge.isUnlocked && "opacity-30 grayscale")} 
            resizeMode="contain"
          />

          {/* Locked Overlay with Glassy Padlock */}
          {!badge.isUnlocked && (
            <View className="absolute inset-0 items-center justify-center pointer-events-none">
              <View className="w-9 h-9 rounded-full bg-black/60 items-center justify-center border border-white/50 shadow-md">
                <LockIcon size={16} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            </View>
          )}
        </View>

        {/* Badge Name */}
        <Text 
          className={cn(
            "font-extrabold text-[15px] font-nunito text-center mb-1 leading-tight h-10 px-1",
            badge.isUnlocked ? "text-mascot-navy" : "text-neutral-500"
          )}
          numberOfLines={2}
        >
          {badge.name}
        </Text>

        {/* Reward Chips Preview */}
        <View className="flex-row items-center gap-1.5 mb-2.5">
          <View className="flex-row items-center bg-reward-50 border border-reward-200 px-1.5 py-0.5 rounded-md">
            <Coin3D size="xs" style={{ marginRight: 2 }} />
            <Text className="text-[10px] font-bold text-reward-700 font-nunito">+{badge.coinReward}</Text>
          </View>
          <View className="flex-row items-center bg-info-50 border border-info-200 px-1.5 py-0.5 rounded-md">
            <XPOrb3D size="xs" style={{ marginRight: 2 }} />
            <Text className="text-[10px] font-bold text-info-700 font-nunito">+{badge.xpReward}</Text>
          </View>
        </View>

        {/* Status indicator / Progress */}
        {badge.isUnlocked ? (
          <View className="flex-row items-center justify-center gap-1 w-full py-1 bg-success-50 rounded-xl border border-success-200">
            <CheckCircle2Icon size={13} className="text-success-600" />
            <Text className="font-extrabold text-[11px] text-success-700 font-nunito uppercase tracking-wide">Đã mở khóa</Text>
          </View>
        ) : badge.total ? (
          <View className="w-full pt-1">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="font-bold text-[10px] text-neutral-400 font-inter">Tiến độ</Text>
              <Text className="font-extrabold text-[11px] text-neutral-600 font-nunito">
                {badge.progress} / {badge.total}
              </Text>
            </View>
            <View className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/50">
              <View 
                className="h-full bg-primary-500 rounded-full" 
                style={{ width: `${progressPercent}%` }}
              />
            </View>
          </View>
        ) : (
          <View className="flex-row items-center justify-center gap-1 w-full py-1 bg-neutral-100 rounded-xl border border-neutral-200">
            <LockIcon size={12} className="text-neutral-400" />
            <Text className="font-extrabold text-[11px] text-neutral-500 font-nunito uppercase tracking-wide">Đang khóa</Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* 1. HEADER */}
      <View className="px-5 py-3.5 border-b border-neutral-100 bg-white flex-row items-center justify-between z-10">
        <Pressable 
          onPress={() => router.back()} 
          className="w-10 h-10 rounded-full items-center justify-center bg-neutral-50 border border-neutral-200/60 active:bg-neutral-100 -ml-1"
        >
          <ArrowLeftIcon size={20} className="text-mascot-navy" />
        </Pressable>
        <Text className="font-extrabold text-[19px] text-mascot-navy font-nunito">Bộ Sưu Tập Thành Tựu</Text>
        <View className="w-10 h-10 items-center justify-center">
          <TrophyIcon size={22} className="text-reward-500" />
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 18, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. CHUNKY 3D SUMMARY CARD */}
        <View className="bg-white rounded-[28px] p-5 border-2 border-b-4 border-neutral-200/80 shadow-sm shadow-black/5 mb-5 relative overflow-hidden">
          
          <View className="flex-row items-center">
            {/* 3D Trophy Visual */}
            <View className="w-20 h-20 bg-reward-50 rounded-2xl items-center justify-center border-2 border-reward-200 border-b-4 border-b-reward-300 mr-4">
              <AchievementTrophy3D size="lg" />
            </View>

            <View className="flex-1">
              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito leading-tight">
                Kho Tàng Vinh Danh
              </Text>
              
              <View className="flex-row items-center justify-between mt-1 mb-2">
                <Text className="font-bold text-[13px] text-neutral-500 font-inter">
                  Đã mở <Text className="text-mascot-navy font-extrabold">{totalUnlocked}</Text> / {totalBadges} huy hiệu
                </Text>
                <Text className="font-extrabold text-[14px] text-primary-600 font-nunito">
                  {completionPercent}%
                </Text>
              </View>

              {/* Progress Track */}
              <View className="h-3 bg-neutral-100 rounded-full overflow-hidden w-full border border-neutral-200/60">
                <View 
                  className="h-full bg-primary-500 rounded-full" 
                  style={{ width: `${completionPercent}%` }}
                />
              </View>
            </View>
          </View>

          {/* Reward Stats Bar */}
          <View className="mt-4 pt-3.5 border-t border-neutral-100 flex-row items-center justify-between">
            <Text className="font-bold text-[12px] text-neutral-400 font-inter">Thưởng đã tích lũy:</Text>
            <View className="flex-row items-center gap-3">
              <View className="flex-row items-center bg-reward-50 px-2.5 py-1 rounded-xl border border-reward-200">
                <Coin3D size="xs" style={{ marginRight: 4 }} />
                <Text className="font-extrabold text-[12px] text-reward-700 font-nunito">+{totalCoinsEarned} Xu</Text>
              </View>
              <View className="flex-row items-center bg-info-50 px-2.5 py-1 rounded-xl border border-info-200">
                <XPOrb3D size="xs" style={{ marginRight: 4 }} />
                <Text className="font-extrabold text-[12px] text-info-700 font-nunito">+{totalXpEarned} XP</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 3. SEGMENTED FILTER TABS */}
        <View className="flex-row p-1 bg-neutral-200/60 rounded-2xl mb-4 border border-neutral-200/80">
          <Pressable 
            onPress={() => setFilterTab('all')}
            className={cn(
              "flex-1 py-2 items-center rounded-xl transition-all",
              filterTab === 'all' 
                ? "bg-white border border-neutral-200/70 border-b-2 border-b-neutral-300 shadow-sm" 
                : "opacity-75"
            )}
          >
            <Text className={cn(
              "text-[13px] font-nunito",
              filterTab === 'all' ? "font-extrabold text-mascot-navy" : "font-bold text-neutral-500"
            )}>
              Tất cả ({totalBadges})
            </Text>
          </Pressable>

          <Pressable 
            onPress={() => setFilterTab('unlocked')}
            className={cn(
              "flex-1 py-2 items-center rounded-xl transition-all",
              filterTab === 'unlocked' 
                ? "bg-white border border-neutral-200/70 border-b-2 border-b-neutral-300 shadow-sm" 
                : "opacity-75"
            )}
          >
            <Text className={cn(
              "text-[13px] font-nunito",
              filterTab === 'unlocked' ? "font-extrabold text-success-600" : "font-bold text-neutral-500"
            )}>
              Đã mở ({totalUnlocked})
            </Text>
          </Pressable>

          <Pressable 
            onPress={() => setFilterTab('locked')}
            className={cn(
              "flex-1 py-2 items-center rounded-xl transition-all",
              filterTab === 'locked' 
                ? "bg-white border border-neutral-200/70 border-b-2 border-b-neutral-300 shadow-sm" 
                : "opacity-75"
            )}
          >
            <Text className={cn(
              "text-[13px] font-nunito",
              filterTab === 'locked' ? "font-extrabold text-mascot-navy" : "font-bold text-neutral-500"
            )}>
              Đang cày ({totalBadges - totalUnlocked})
            </Text>
          </Pressable>
        </View>

        {/* 4. BADGE GRID */}
        {filteredBadges.length > 0 ? (
          <View className="flex-row flex-wrap justify-between">
            {filteredBadges.map(renderBadgeItem)}
          </View>
        ) : (
          <View className="bg-white rounded-3xl p-8 items-center border-2 border-neutral-100 my-4">
            <Snapy pose="to_mo" animation="idle" className="w-24 h-24 mb-3 opacity-85" />
            <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">Chưa có huy hiệu nào</Text>
            <Text className="font-medium text-[13px] text-neutral-400 font-inter text-center mt-1">
              {filterTab === 'unlocked' ? "Hãy bắt đầu học hoặc quét ảnh để mở khóa huy hiệu đầu tiên!" : "Tuyệt vời, bạn đã mở toàn bộ huy hiệu!"}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* 5. BADGE DETAIL MODAL (CHUNKY BOTTOM SHEET) */}
      <Modal
        visible={!!selectedBadge}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedBadge(null)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <Pressable className="absolute inset-0" onPress={() => setSelectedBadge(null)} />
          
          <View className="bg-white rounded-t-[36px] p-6 pb-9 shadow-2xl items-center border-t-2 border-neutral-100">
            
            {/* Grabber */}
            <View className="w-12 h-1.5 bg-neutral-200 rounded-full mb-6" />
            
            {/* Close Button */}
            <Pressable 
              onPress={() => setSelectedBadge(null)}
              className="absolute top-6 right-6 w-9 h-9 bg-neutral-100 rounded-full items-center justify-center active:bg-neutral-200 border border-neutral-200/60"
            >
              <XIcon size={18} className="text-neutral-600" />
            </Pressable>

            {selectedBadge && (
              <>
                {/* Large 3D Badge Visual Container */}
                <View className="w-36 h-36 items-center justify-center my-2 relative">
                  <Image 
                    source={selectedBadge.imageSource}
                    style={{ width: '100%', height: '100%' }}
                    className={cn(!selectedBadge.isUnlocked && "opacity-35 grayscale")}
                    resizeMode="contain"
                  />

                  {/* Sparkle Tag if Unlocked */}
                  {selectedBadge.isUnlocked && (
                    <View className="absolute -top-1 -right-1 bg-reward-100 p-1.5 rounded-full border border-reward-300 shadow-sm">
                      <SparklesIcon size={18} color="#FFC42E" />
                    </View>
                  )}
                </View>

                {/* Status and Rarity Pill */}
                <View className="flex-row items-center gap-2 mb-3 mt-1">
                  <View className={cn(
                    "px-3 py-1 rounded-full flex-row items-center gap-1 border",
                    selectedBadge.isUnlocked 
                      ? "bg-success-50 border-success-200" 
                      : "bg-neutral-100 border-neutral-200"
                  )}>
                    {selectedBadge.isUnlocked ? (
                      <CheckCircle2Icon size={13} className="text-success-600" />
                    ) : (
                      <LockIcon size={13} className="text-neutral-500" />
                    )}
                    <Text className={cn(
                      "font-extrabold text-[11px] font-nunito uppercase tracking-wider",
                      selectedBadge.isUnlocked ? "text-success-700" : "text-neutral-600"
                    )}>
                      {selectedBadge.isUnlocked ? "Đã mở khóa" : "Đang khóa"}
                    </Text>
                  </View>

                  <View className={cn(
                    "px-3 py-1 rounded-full border",
                    RARITY_CONFIG[selectedBadge.rarity].bg,
                    RARITY_CONFIG[selectedBadge.rarity].border
                  )}>
                    <Text className={cn("font-extrabold text-[11px] font-nunito uppercase tracking-wider", RARITY_CONFIG[selectedBadge.rarity].color)}>
                      {RARITY_CONFIG[selectedBadge.rarity].label}
                    </Text>
                  </View>
                </View>

                {/* Badge Name */}
                <Text className="font-extrabold text-[24px] text-mascot-navy font-nunito text-center mb-1">
                  {selectedBadge.name}
                </Text>
                
                {/* Condition Description */}
                <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center px-4 mb-4 leading-relaxed">
                  {selectedBadge.condition}
                </Text>

                {/* Rewards Box */}
                <View className="w-full bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200/80 mb-4 flex-row items-center justify-between">
                  <Text className="font-extrabold text-[13px] text-neutral-600 font-nunito">Phần thưởng đạt được:</Text>
                  <View className="flex-row items-center gap-2.5">
                    <View className="flex-row items-center bg-white px-2.5 py-1 rounded-xl border border-reward-200 shadow-sm">
                      <Coin3D size="xs" style={{ marginRight: 4 }} />
                      <Text className="font-extrabold text-[13px] text-reward-700 font-nunito">+{selectedBadge.coinReward} Xu</Text>
                    </View>
                    <View className="flex-row items-center bg-white px-2.5 py-1 rounded-xl border border-info-200 shadow-sm">
                      <XPOrb3D size="xs" style={{ marginRight: 4 }} />
                      <Text className="font-extrabold text-[13px] text-info-700 font-nunito">+{selectedBadge.xpReward} XP</Text>
                    </View>
                  </View>
                </View>

                {/* Progress Bar (If Locked & Countable) */}
                {!selectedBadge.isUnlocked && selectedBadge.total && (
                  <View className="w-full bg-white p-4 rounded-2xl border-2 border-b-4 border-neutral-200/80 mb-4">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="font-bold text-[13px] text-neutral-600 font-inter">Tiến độ chinh phục</Text>
                      <Text className="font-extrabold text-[14px] text-mascot-navy font-nunito">
                        {selectedBadge.progress} / {selectedBadge.total}
                      </Text>
                    </View>
                    <View className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/60">
                      <View 
                        className="h-full bg-primary-500 rounded-full" 
                        style={{ width: `${Math.min(100, (selectedBadge.progress! / selectedBadge.total) * 100)}%` }}
                      />
                    </View>
                  </View>
                )}

                {/* Date Earned (If Unlocked) */}
                {selectedBadge.isUnlocked && selectedBadge.dateEarned && (
                  <View className="w-full bg-neutral-50 px-4 py-2.5 rounded-xl border border-neutral-200/60 mb-4 flex-row items-center justify-between">
                    <Text className="font-bold text-[12px] text-neutral-500 font-inter">Ngày vinh danh nhận huy hiệu:</Text>
                    <Text className="font-extrabold text-[13px] text-mascot-navy font-nunito">
                      {selectedBadge.dateEarned}
                    </Text>
                  </View>
                )}

                {/* ACTION BUTTONS (CHUNKY 3D CTA) */}
                {!selectedBadge.isUnlocked ? (
                  <Pressable
                    onPress={() => {
                      const route = selectedBadge.actionRoute;
                      setSelectedBadge(null);
                      if (route) {
                        router.push(route as any);
                      }
                    }}
                    className="w-full h-13 py-3.5 bg-primary-500 rounded-2xl border-b-4 border-primary-700 items-center justify-center active:border-b-2 active:translate-y-[2px] flex-row gap-2 shadow-sm shadow-primary-500/30"
                  >
                    <Text className="font-extrabold text-[15px] text-white font-nunito uppercase tracking-wider">
                      {selectedBadge.actionLabel || "Tiếp tục ngay"}
                    </Text>
                    <ChevronRightIcon size={18} color="#FFFFFF" strokeWidth={2.5} />
                  </Pressable>
                ) : (
                  <View className="w-full flex-row gap-3">
                    <Pressable
                      onPress={() => handlePinBadge(selectedBadge)}
                      className={cn(
                        "flex-1 py-3 rounded-2xl border-2 border-b-4 items-center justify-center active:border-b-2 active:translate-y-[2px] flex-row gap-2",
                        pinnedBadgeId === selectedBadge.id
                          ? "bg-reward-100 border-reward-300 border-b-reward-400"
                          : "bg-white border-neutral-200 border-b-neutral-300"
                      )}
                    >
                      <PinIcon size={16} color={pinnedBadgeId === selectedBadge.id ? "#B37F00" : "#565879"} />
                      <Text className={cn(
                        "font-extrabold text-[13px] font-nunito",
                        pinnedBadgeId === selectedBadge.id ? "text-reward-700" : "text-neutral-700"
                      )}>
                        {pinnedBadgeId === selectedBadge.id ? "Đã ghim hồ sơ" : "Ghim lên hồ sơ"}
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => {
                        Alert.alert("Chia sẻ", `Đã sao chép liên kết chia sẻ huy hiệu ${selectedBadge.name}!`);
                      }}
                      className="py-3 px-5 rounded-2xl bg-neutral-100 border border-neutral-200 border-b-2 border-b-neutral-300 items-center justify-center active:border-b-0 active:translate-y-[2px]"
                    >
                      <Share2Icon size={18} className="text-neutral-600" />
                    </Pressable>
                  </View>
                )}

              </>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
