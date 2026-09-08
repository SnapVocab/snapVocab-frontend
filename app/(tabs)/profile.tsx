import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  SettingsIcon, 
  TrophyIcon, 
  PackageIcon, 
  WalletIcon, 
  ChevronRightIcon,
  FlameIcon,
  BookOpenIcon,
  CrownIcon,
  StarIcon,
  Edit2Icon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_USER = {
  name: 'Alex Nguyen',
  email: 'alex@example.com',
  level: 12,
  xp: 2450,
  targetXp: 3000,
  streak: 12,
  learnedWords: 1284,
  hasFrame: true,
  hasBadges: true
};

const MOCK_FEATURED_BADGES = [
  { id: 'b1', name: 'Word Collector', imageSource: require('../../assets/images/shop/badge1_clean.png'), color: 'bg-info-50 text-info-600', border: 'border-info-200' },
  { id: 'b2', name: 'Streak Champ', imageSource: require('../../assets/images/shop/badge2_clean.png'), color: 'bg-danger-50 text-danger-500', border: 'border-danger-200' },
  { id: 'b6', name: 'First Steps', imageSource: require('../../assets/images/shop/badge6_clean.png'), color: 'bg-primary-50 text-primary-600', border: 'border-primary-200' },
  { id: 'b10', name: 'Speed Learner', imageSource: require('../../assets/images/shop/badge10_clean.png'), color: 'bg-reward-50 text-reward-600', border: 'border-reward-200' }
];

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={['top']}>
      
      {/* 1. HEADER (Identity Visual Anchor) */}
      <View className="items-center pt-6 pb-6 px-5 border-b border-neutral-200/80 bg-white">
        
        {/* Avatar with Level Badge */}
        <View className="relative mb-3">
          <View className="w-20 h-20 bg-primary-50 rounded-full items-center justify-center border-2 border-primary-500/20 overflow-hidden">
            <Text className="font-extrabold text-[28px] text-primary-600 font-nunito">AL</Text>
          </View>
          {MOCK_USER.hasFrame && (
            <View className="absolute -bottom-1 -right-1 bg-reward-500 rounded-full p-1 border-2 border-white">
              <CrownIcon size={14} className="text-neutral-900" />
            </View>
          )}
        </View>

        <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito mb-0.5">
          {MOCK_USER.name}
        </Text>
        <Text className="font-medium text-[14px] text-neutral-400 font-inter mb-4">
          {MOCK_USER.email}
        </Text>

        <Pressable 
          onPress={() => router.push('/profile/edit' as any)}
          className="bg-neutral-100 px-5 py-2 rounded-full flex-row items-center gap-2 active:scale-95 transition-all"
        >
          <Edit2Icon size={14} className="text-neutral-600" />
          <Text className="font-bold text-[13px] text-neutral-600 font-inter">Chỉnh sửa hồ sơ</Text>
        </Pressable>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. LEARNING SUMMARY */}
        <View className="bg-white rounded-2xl p-5 border border-neutral-200/80 mb-5">
          <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-4">Tiến độ học tập</Text>
          
          <View className="flex-row gap-3 mb-4">
            <Pressable 
              onPress={() => router.push('/(tabs)/stats' as any)}
              className="flex-1 bg-white rounded-xl p-3.5 border border-neutral-200/80 active:scale-[0.98]"
            >
              <View className="w-8 h-8 bg-mascot-50 rounded-lg items-center justify-center mb-2">
                <FlameIcon size={16} fill="#FF8A00" className="text-mascot-500" />
              </View>
              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-0.5 tabular-nums">{MOCK_USER.streak} ngày</Text>
              <Text className="font-bold text-[11px] text-neutral-400 font-inter">Chuỗi học tập</Text>
            </Pressable>
            
            <Pressable 
              onPress={() => router.push('/(tabs)/stats' as any)}
              className="flex-1 bg-white rounded-xl p-3.5 border border-neutral-200/80 active:scale-[0.98]"
            >
              <View className="w-8 h-8 bg-info-50 rounded-lg items-center justify-center mb-2">
                <BookOpenIcon size={16} className="text-info-500" />
              </View>
              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-0.5 tabular-nums">{MOCK_USER.learnedWords}</Text>
              <Text className="font-bold text-[11px] text-neutral-400 font-inter">Từ đã thuộc</Text>
            </Pressable>
          </View>

          <Pressable 
            onPress={() => router.push('/stats/level-progress' as any)}
            className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200/60 active:scale-[0.98]"
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-1.5">
                <StarIcon size={16} className="text-primary-500" fill="#3B82F6" />
                <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito">Level {MOCK_USER.level}</Text>
              </View>
              <Text className="font-bold text-[12px] text-neutral-500 font-inter tabular-nums">
                {MOCK_USER.xp.toLocaleString()} / {MOCK_USER.targetXp.toLocaleString()} XP
              </Text>
            </View>
            <View className="h-2 w-full bg-neutral-200/70 rounded-full overflow-hidden">
              <View 
                className="h-full bg-primary-500 rounded-full" 
                style={{ width: `${(MOCK_USER.xp / MOCK_USER.targetXp) * 100}%` }}
              />
            </View>
          </Pressable>
        </View>

        {/* 3. FEATURED BADGES */}
        <View className="mb-5">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">Huy hiệu nổi bật</Text>
            <Pressable onPress={() => router.push('/(tabs)/achievements' as any)}>
              <Text className="font-bold text-[13px] text-info-600 font-inter">Xem tất cả →</Text>
            </Pressable>
          </View>
          
          {MOCK_USER.hasBadges ? (
            <Pressable 
              onPress={() => router.push('/(tabs)/achievements' as any)}
              className="flex-row items-center justify-between active:opacity-90"
            >
              {MOCK_FEATURED_BADGES.map(badge => (
                <View key={badge.id} className="items-center w-[22%]">
                  <View className={cn(
                    "w-12 h-12 rounded-2xl items-center justify-center mb-1.5 border overflow-hidden bg-neutral-50",
                    badge.border
                  )}>
                    <Image 
                      source={badge.imageSource} 
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text 
                    className="font-bold text-[11px] text-neutral-600 font-inter text-center"
                    numberOfLines={1}
                  >
                    {badge.name}
                  </Text>
                </View>
              ))}
            </Pressable>
          ) : (
            <View className="bg-white rounded-2xl p-5 border border-neutral-200/80 items-center flex-row gap-3">
              <Snapy pose="to_mo" animation="idle" className="w-12 h-12 opacity-80" />
              <View className="flex-1">
                <Text className="font-bold text-[14px] text-mascot-navy font-inter">Chưa có huy hiệu</Text>
                <Text className="font-medium text-[12px] text-neutral-400 font-inter mt-0.5">Bắt đầu bài học để tích lũy huy hiệu.</Text>
              </View>
            </View>
          )}
        </View>

        {/* 4. QUICK ACCESS */}
        <View className="bg-white rounded-2xl border border-neutral-200/80 divide-y divide-neutral-100 overflow-hidden">
          <Pressable 
            onPress={() => router.push('/profile/edit' as any)}
            className="flex-row items-center p-4 active:bg-neutral-50"
          >
            <View className="w-9 h-9 bg-neutral-100 rounded-lg items-center justify-center mr-3">
              <Edit2Icon size={18} className="text-neutral-600" />
            </View>
            <Text className="flex-1 font-bold text-[14px] text-mascot-navy font-inter">Chỉnh sửa thông tin</Text>
            <ChevronRightIcon size={18} className="text-neutral-400" />
          </Pressable>

          <Pressable 
            onPress={() => router.push('/(tabs)/achievements' as any)}
            className="flex-row items-center p-4 active:bg-neutral-50"
          >
            <View className="w-9 h-9 bg-reward-50 rounded-lg items-center justify-center mr-3">
              <TrophyIcon size={18} className="text-reward-600" fill="#FFC42E" />
            </View>
            <Text className="flex-1 font-bold text-[14px] text-mascot-navy font-inter">Thành tựu & Huy hiệu</Text>
            <ChevronRightIcon size={18} className="text-neutral-400" />
          </Pressable>

          <Pressable 
            onPress={() => router.push('/profile/inventory' as any)}
            className="flex-row items-center p-4 active:bg-neutral-50"
          >
            <View className="w-9 h-9 bg-primary-50 rounded-lg items-center justify-center mr-3">
              <PackageIcon size={18} className="text-primary-500" />
            </View>
            <Text className="flex-1 font-bold text-[14px] text-mascot-navy font-inter">Kho vật phẩm</Text>
            <ChevronRightIcon size={18} className="text-neutral-400" />
          </Pressable>

          <Pressable 
            onPress={() => router.push('/profile/wallet' as any)}
            className="flex-row items-center p-4 active:bg-neutral-50"
          >
            <View className="w-9 h-9 bg-neutral-100 rounded-lg items-center justify-center mr-3">
              <WalletIcon size={18} className="text-neutral-600" />
            </View>
            <Text className="flex-1 font-bold text-[14px] text-mascot-navy font-inter">Ví xu thưởng</Text>
            <ChevronRightIcon size={18} className="text-neutral-400" />
          </Pressable>

          <Pressable 
            onPress={() => router.push('/profile/settings' as any)}
            className="flex-row items-center p-4 active:bg-neutral-50"
          >
            <View className="w-9 h-9 bg-neutral-100 rounded-lg items-center justify-center mr-3">
              <SettingsIcon size={18} className="text-neutral-600" />
            </View>
            <Text className="flex-1 font-bold text-[14px] text-mascot-navy font-inter">Cài đặt ứng dụng</Text>
            <ChevronRightIcon size={18} className="text-neutral-400" />
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

