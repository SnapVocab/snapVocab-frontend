import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeftIcon,
  TrophyIcon,
  LockIcon,
  CheckCircle2Icon,
  MedalIcon,
  StarIcon,
  CrownIcon,
  BookOpenIcon,
  FlameIcon,
  ZapIcon,
  TargetIcon,
  XIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';

// ==========================================
// MOCK DATA
// ==========================================
type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

interface Badge {
  id: string;
  name: string;
  imageSource: any;
  isUnlocked: boolean;
  condition: string;
  progress?: number;
  total?: number;
  dateEarned?: string;
  rarity: Rarity;
  color: string;
}

const RARITY_CONFIG = {
  Common: { label: 'Phổ biến', color: 'text-neutral-500', bg: 'bg-neutral-100', border: 'border-neutral-200' },
  Rare: { label: 'Hiếm', color: 'text-info-600', bg: 'bg-info-50', border: 'border-info-200' },
  Epic: { label: 'Cực hiếm', color: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-200' },
  Legendary: { label: 'Huyền thoại', color: 'text-warning-600', bg: 'bg-warning-50', border: 'border-warning-300' },
};

const MOCK_BADGES: Badge[] = [
  { id: 'b1', name: 'Word Collector', imageSource: require('../../assets/images/shop/badge1.jpg'), isUnlocked: true, condition: 'Thu thập 100 từ vựng.', dateEarned: '24/08/2026', rarity: 'Common', color: 'bg-info-100 text-info-600' },
  { id: 'b2', name: 'Streak Champ', imageSource: require('../../assets/images/shop/badge2.jpg'), isUnlocked: true, condition: 'Duy trì chuỗi học 30 ngày.', dateEarned: '01/09/2026', rarity: 'Rare', color: 'bg-error-100 text-error-500' },
  { id: 'b3', name: 'Word Hunter', imageSource: require('../../assets/images/shop/badge3.jpg'), isUnlocked: false, condition: 'Quét và nhận diện thành công 50 đồ vật.', progress: 12, total: 50, rarity: 'Epic', color: 'bg-primary-100 text-primary-600' },
  { id: 'b4', name: 'Memory Master', imageSource: require('../../assets/images/shop/badge4.jpg'), isUnlocked: false, condition: 'Hoàn thành 100 phiên ôn tập (SRS).', progress: 45, total: 100, rarity: 'Epic', color: 'bg-purple-100 text-purple-600' },
  { id: 'b5', name: 'Quiz Master', imageSource: require('../../assets/images/shop/badge5.jpg'), isUnlocked: false, condition: 'Vượt qua 50 bài kiểm tra trắc nghiệm.', progress: 20, total: 50, rarity: 'Rare', color: 'bg-warning-100 text-warning-600' },
  { id: 'b6', name: 'First Steps', imageSource: require('../../assets/images/shop/badge6.jpg'), isUnlocked: true, condition: 'Hoàn thành bài học đầu tiên.', dateEarned: '20/08/2026', rarity: 'Common', color: 'bg-success-100 text-success-600' },
  { id: 'b7', name: 'Word Hoarder', imageSource: require('../../assets/images/shop/badge7.jpg'), isUnlocked: false, condition: 'Tích lũy đủ 10,000 xu.', progress: 2450, total: 10000, rarity: 'Legendary', color: 'bg-sky-100 text-sky-600' },
  { id: 'b8', name: 'Vocabulary Legend', imageSource: require('../../assets/images/shop/badge8.jpg'), isUnlocked: false, condition: 'Đạt cấp độ tối đa (Level 50).', progress: 12, total: 50, rarity: 'Legendary', color: 'bg-amber-100 text-amber-600' },
  { id: 'b9', name: 'World Explorer', imageSource: require('../../assets/images/shop/badge9.jpg'), isUnlocked: false, condition: 'Hoàn thành tất cả chủ đề học.', progress: 3, total: 15, rarity: 'Epic', color: 'bg-teal-100 text-teal-600' },
  { id: 'b10', name: 'Speed Learner', imageSource: require('../../assets/images/shop/badge10.jpg'), isUnlocked: true, condition: 'Hoàn thành một bài học dưới 1 phút.', dateEarned: '22/08/2026', rarity: 'Rare', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'b11', name: 'Perfect Score', imageSource: require('../../assets/images/shop/badge11.jpg'), isUnlocked: false, condition: 'Đạt 100% điểm trong 10 bài kiểm tra liên tiếp.', progress: 4, total: 10, rarity: 'Epic', color: 'bg-rose-100 text-rose-600' },
  { id: 'b12', name: 'Love English', imageSource: require('../../assets/images/shop/badge12.jpg'), isUnlocked: false, condition: 'Hoạt động liên tục trong 1 năm.', progress: 15, total: 365, rarity: 'Legendary', color: 'bg-red-100 text-red-600' },
];

const TOTAL_UNLOCKED = 4;
const TOTAL_BADGES = 12;

export default function AchievementsScreen() {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const renderBadgeItem = (badge: Badge) => {
    const Icon = badge.icon;
    
    return (
      <Pressable 
        key={badge.id}
        onPress={() => setSelectedBadge(badge)}
        className={cn(
          "w-[48%] bg-white rounded-3xl p-4 border-2 mb-4 items-center relative overflow-hidden  active:scale-95",
          badge.isUnlocked ? "border-neutral-100 shadow-sm shadow-black/5" : "border-neutral-50 opacity-80"
        )}
      >
        {/* Lớp màng xám nếu bị khóa */}
        {!badge.isUnlocked && (
          <View className="absolute inset-0 bg-neutral-100/30 z-10 pointer-events-none" />
        )}

        {/* Icon Area */}
        <View className={cn(
          "w-16 h-16 rounded-full items-center justify-center mb-3 overflow-hidden",
          badge.isUnlocked ? badge.color : "bg-neutral-100"
        )}>
          <Image 
            source={badge.imageSource} 
            className={cn("w-full h-full", !badge.isUnlocked && "opacity-40")} 
            resizeMode="cover"
          />
        </View>

        {/* Name */}
        <Text 
          className={cn(
            "font-extrabold text-[15px] font-nunito text-center mb-1 leading-tight h-10",
            badge.isUnlocked ? "text-mascot-navy" : "text-neutral-500"
          )}
          numberOfLines={2}
        >
          {badge.name}
        </Text>

        {/* Status indicator */}
        {badge.isUnlocked ? (
          <View className="flex-row items-center gap-1 mt-1">
            <CheckCircle2Icon size={12} className="text-success-500" />
            <Text className="font-bold text-[11px] text-success-600 font-inter uppercase tracking-widest">Đã mở</Text>
          </View>
        ) : badge.total ? (
          <View className="items-center w-full mt-1">
            <Text className="font-bold text-[11px] text-neutral-400 font-inter mb-1">
              {badge.progress} / {badge.total}
            </Text>
            <View className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
              <View 
                className="h-full bg-neutral-400 rounded-full" 
                style={{ width: `${(badge.progress! / badge.total) * 100}%` }}
              />
            </View>
          </View>
        ) : (
          <View className="flex-row items-center gap-1 mt-1">
            <LockIcon size={12} className="text-neutral-400" />
            <Text className="font-bold text-[11px] text-neutral-400 font-inter uppercase tracking-widest">Đã khóa</Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* 1. HEADER */}
      <View className="px-5 py-3 border-b border-neutral-100 bg-white flex-row items-center justify-between z-10">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
          <ArrowLeftIcon size={24} className="text-mascot-navy" />
        </Pressable>
        <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">Thành tựu</Text>
        <View className="w-10 h-10" />
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. SUMMARY CARD */}
        <View className="bg-white rounded-[24px] p-6 border border-neutral-100 shadow-sm shadow-black/5 flex-row items-center mb-6">
          <View className="w-16 h-16 bg-warning-50 rounded-full items-center justify-center mr-4 border-2 border-warning-200">
            <MedalIcon size={32} className="text-warning-500" fill="#FBBF24" />
          </View>
          <View className="flex-1">
            <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-1">Bộ sưu tập</Text>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-bold text-[13px] text-neutral-500 font-inter">
                {TOTAL_UNLOCKED} / {TOTAL_BADGES} huy hiệu
              </Text>
              <Text className="font-extrabold text-[13px] text-primary-600 font-nunito">
                {Math.round((TOTAL_UNLOCKED/TOTAL_BADGES)*100)}%
              </Text>
            </View>
            <View className="h-2.5 bg-neutral-100 rounded-full overflow-hidden w-full">
              <View 
                className="h-full bg-primary-500 rounded-full" 
                style={{ width: `${(TOTAL_UNLOCKED/TOTAL_BADGES)*100}%` }}
              />
            </View>
          </View>
        </View>

        {/* 3. BADGE GRID */}
        <View className="flex-row flex-wrap justify-between">
          {MOCK_BADGES.map(renderBadgeItem)}
        </View>
      </ScrollView>

      {/* 4. BADGE DETAIL MODAL (BOTTOM SHEET MOCK) */}
      <Modal
        visible={!!selectedBadge}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedBadge(null)}
      >
        <View className="flex-1 bg-black/40 justify-end">
          <Pressable className="absolute inset-0" onPress={() => setSelectedBadge(null)} />
          
          <View className="bg-white rounded-t-[32px] p-6 pb-10 shadow-xl items-center min-h-[50%]">
            
            {/* Grabber */}
            <View className="w-12 h-1.5 bg-neutral-200 rounded-full mb-8" />
            
            <Pressable 
              onPress={() => setSelectedBadge(null)}
              className="absolute top-6 right-6 w-8 h-8 bg-neutral-100 rounded-full items-center justify-center active:bg-neutral-200"
            >
              <XIcon size={18} className="text-neutral-500" />
            </Pressable>

            {selectedBadge && (
              <>
                {/* Big Badge Art */}
                <View className={cn(
                  "w-32 h-32 rounded-full items-center justify-center mb-4 border-4 overflow-hidden",
                  selectedBadge.isUnlocked ? selectedBadge.color.split(' ')[0] : "bg-neutral-100",
                  selectedBadge.isUnlocked ? "border-white shadow-lg" : "border-neutral-50"
                )}>
                  {/* Fake a shiny glow inside if unlocked */}
                  {selectedBadge.isUnlocked && (
                    <View className="absolute inset-0 bg-white/20 rounded-full z-10" />
                  )}
                  <Image 
                    source={selectedBadge.imageSource}
                    className={cn("w-full h-full", !selectedBadge.isUnlocked && "opacity-40")}
                    resizeMode="cover"
                  />
                </View>

                {/* Status Indicator */}
                <View className={cn(
                  "px-4 py-1.5 rounded-full flex-row items-center gap-1.5 mb-3 border",
                  selectedBadge.isUnlocked ? "bg-success-50 border-success-200" : "bg-neutral-100 border-neutral-200"
                )}>
                  {selectedBadge.isUnlocked ? (
                    <CheckCircle2Icon size={14} className="text-success-600" />
                  ) : (
                    <LockIcon size={14} className="text-neutral-500" />
                  )}
                  <Text className={cn(
                    "font-extrabold text-[12px] font-nunito uppercase tracking-widest",
                    selectedBadge.isUnlocked ? "text-success-700" : "text-neutral-600"
                  )}>
                    {selectedBadge.isUnlocked ? "Đã mở khóa" : "Đã khóa"}
                  </Text>
                </View>

                <Text className="font-extrabold text-[28px] text-mascot-navy font-nunito text-center mb-2">
                  {selectedBadge.name}
                </Text>
                
                <Text className="font-medium text-[15px] text-neutral-500 font-inter text-center px-4 mb-6 leading-relaxed">
                  {selectedBadge.condition}
                </Text>

                {/* Progress Bar (If Locked & Countable) */}
                {!selectedBadge.isUnlocked && selectedBadge.total && (
                  <View className="w-full bg-neutral-50 p-4 rounded-2xl border border-neutral-100 mb-6">
                    <View className="flex-row justify-between mb-2">
                      <Text className="font-bold text-[14px] text-neutral-600 font-inter">Tiến độ</Text>
                      <Text className="font-extrabold text-[14px] text-mascot-navy font-nunito">
                        {selectedBadge.progress} / {selectedBadge.total}
                      </Text>
                    </View>
                    <View className="h-3 w-full bg-neutral-200 rounded-full overflow-hidden">
                      <View 
                        className="h-full bg-primary-500 rounded-full" 
                        style={{ width: `${(selectedBadge.progress! / selectedBadge.total) * 100}%` }}
                      />
                    </View>
                  </View>
                )}

                {/* Rarity & Date Badges */}
                <View className="flex-row items-center justify-center gap-3 w-full">
                  <View className={cn(
                    "flex-1 items-center justify-center p-3 rounded-2xl border",
                    RARITY_CONFIG[selectedBadge.rarity].bg,
                    RARITY_CONFIG[selectedBadge.rarity].border
                  )}>
                    <Text className="font-bold text-[11px] text-neutral-400 font-inter uppercase tracking-widest mb-1">Độ hiếm</Text>
                    <Text className={cn("font-extrabold text-[15px] font-nunito", RARITY_CONFIG[selectedBadge.rarity].color)}>
                      {RARITY_CONFIG[selectedBadge.rarity].label}
                    </Text>
                  </View>

                  {selectedBadge.isUnlocked && selectedBadge.dateEarned && (
                    <View className="flex-1 items-center justify-center p-3 rounded-2xl border bg-neutral-50 border-neutral-200">
                      <Text className="font-bold text-[11px] text-neutral-400 font-inter uppercase tracking-widest mb-1">Ngày nhận</Text>
                      <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito">
                        {selectedBadge.dateEarned}
                      </Text>
                    </View>
                  )}
                </View>

              </>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
