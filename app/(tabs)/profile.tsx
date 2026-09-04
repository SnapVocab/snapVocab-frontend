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
  ZapIcon,
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
  hasFrame: true, // Toggle this to see Avatar with/without frame
  hasBadges: true // Toggle this to see empty state for badges
};

const MOCK_FEATURED_BADGES = [
  { id: 'b1', name: 'Word Collector', imageSource: require('../../assets/images/shop/badge1.jpg'), color: 'bg-info-100 text-info-600', border: 'border-info-200' },
  { id: 'b2', name: 'Streak Champ', imageSource: require('../../assets/images/shop/badge2.jpg'), color: 'bg-error-100 text-error-500', border: 'border-error-200' },
  { id: 'b6', name: 'First Steps', imageSource: require('../../assets/images/shop/badge6.jpg'), color: 'bg-success-100 text-success-600', border: 'border-success-200' },
  { id: 'b10', name: 'Speed Learner', imageSource: require('../../assets/images/shop/badge10.jpg'), color: 'bg-yellow-100 text-yellow-600', border: 'border-yellow-200' }
];

export default function ProfileScreen() {
  
  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* 1. HEADER (Lẩn vào nền bg-[#F7F8FA] thay vì bg-white để có hiệu ứng tách biệt) */}
      <View className="items-center pt-8 pb-6 px-4 border-b border-neutral-100 bg-white">
        
        {/* Avatar with optional Frame */}
        <View className="relative mb-4">
          {MOCK_USER.hasFrame && (
            <View className="absolute -inset-2 bg-gradient-to-tr from-warning-300 via-warning-400 to-warning-500 rounded-full items-center justify-center shadow-md shadow-warning-500/30">
              <View className="w-[100px] h-[100px] bg-white rounded-full" />
            </View>
          )}
          <View className={cn(
            "w-24 h-24 bg-primary-100 rounded-full items-center justify-center overflow-hidden border-2",
            MOCK_USER.hasFrame ? "border-white" : "border-primary-200"
          )}>
            {/* Fallback to text avatar since we don't have images */}
            <Text className="font-extrabold text-[32px] text-primary-600 font-nunito">AL</Text>
          </View>
          {MOCK_USER.hasFrame && (
            <View className="absolute -bottom-2 -right-2 bg-warning-100 rounded-full shadow-sm p-1 border border-warning-200">
              <CrownIcon size={16} className="text-warning-600" />
            </View>
          )}
        </View>

        <Text className="font-extrabold text-[24px] text-mascot-navy font-nunito mb-1">
          {MOCK_USER.name}
        </Text>
        <Text className="font-medium text-[15px] text-neutral-500 font-inter mb-4">
          {MOCK_USER.email}
        </Text>

        <Pressable 
          onPress={() => router.push('/profile/edit' as any)}
          className="bg-neutral-100 px-6 py-2.5 rounded-full flex-row items-center gap-2 active:bg-neutral-200"
        >
          <Edit2Icon size={14} className="text-neutral-600" />
          <Text className="font-bold text-[14px] text-neutral-600 font-inter">Chỉnh sửa hồ sơ</Text>
        </Pressable>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. LEARNING SUMMARY */}
        <View className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm shadow-black/5 mb-6">
          <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-4">Tiến độ học tập</Text>
          
          <View className="flex-row gap-4 mb-5">
            <Pressable 
              onPress={() => router.push('/(tabs)/stats' as any)}
              className="flex-1 bg-error-50 rounded-2xl p-4 border border-error-100 active:bg-error-100"
            >
              <View className="w-8 h-8 bg-error-100 rounded-full items-center justify-center mb-2">
                <FlameIcon size={16} className="text-error-600" fill="#EF4444" />
              </View>
              <Text className="font-extrabold text-[20px] text-error-600 font-nunito mb-0.5">{MOCK_USER.streak} ngày</Text>
              <Text className="font-bold text-[12px] text-error-700/70 font-inter">Chuỗi học tập</Text>
            </Pressable>
            
            <Pressable 
              onPress={() => router.push('/(tabs)/stats' as any)}
              className="flex-1 bg-success-50 rounded-2xl p-4 border border-success-100 active:bg-success-100"
            >
              <View className="w-8 h-8 bg-success-100 rounded-full items-center justify-center mb-2">
                <BookOpenIcon size={16} className="text-success-600" fill="#22C55E" />
              </View>
              <Text className="font-extrabold text-[20px] text-success-600 font-nunito mb-0.5">{MOCK_USER.learnedWords}</Text>
              <Text className="font-bold text-[12px] text-success-700/70 font-inter">Từ đã học</Text>
            </Pressable>
          </View>

          <Pressable 
            onPress={() => router.push('/stats/level-progress' as any)}
            className="bg-primary-50 rounded-2xl p-4 border border-primary-100 active:bg-primary-100"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-1.5">
                <StarIcon size={18} className="text-primary-600" fill="#3B82F6" />
                <Text className="font-extrabold text-[16px] text-primary-700 font-nunito">Level {MOCK_USER.level}</Text>
              </View>
              <Text className="font-bold text-[13px] text-primary-600 font-inter">
                {MOCK_USER.xp.toLocaleString()} / {MOCK_USER.targetXp.toLocaleString()} XP
              </Text>
            </View>
            <View className="h-2 w-full bg-primary-200/50 rounded-full overflow-hidden">
              <View 
                className="h-full bg-primary-500 rounded-full" 
                style={{ width: `${(MOCK_USER.xp / MOCK_USER.targetXp) * 100}%` }}
              />
            </View>
          </Pressable>
        </View>

        {/* 3. FEATURED BADGES */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">Huy hiệu nổi bật</Text>
            <Pressable onPress={() => router.push('/(tabs)/achievements' as any)}>
              <Text className="font-bold text-[14px] text-primary-500 font-inter">Xem tất cả</Text>
            </Pressable>
          </View>
          
          {MOCK_USER.hasBadges ? (
            <Pressable 
              onPress={() => router.push('/(tabs)/achievements' as any)}
              className="flex-row items-center justify-between active:opacity-70"
            >
              {MOCK_FEATURED_BADGES.map(badge => {
                return (
                  <View key={badge.id} className="items-center w-[22%]">
                    <View className={cn(
                      "w-14 h-14 rounded-full items-center justify-center mb-2 border-2 overflow-hidden",
                      badge.color.split(' ')[0],
                      badge.border
                    )}>
                      <Image 
                        source={badge.imageSource} 
                        className="w-full h-full" 
                        resizeMode="cover"
                      />
                    </View>
                    <Text 
                      className="font-bold text-[11px] text-neutral-600 font-inter text-center"
                      numberOfLines={2}
                    >
                      {badge.name}
                    </Text>
                  </View>
                );
              })}
            </Pressable>
          ) : (
            <View className="bg-white rounded-2xl p-6 border border-neutral-100 border-dashed items-center justify-center flex-row gap-4">
              <Snapy pose="curious" className="w-16 h-16 opacity-70" />
              <View className="flex-1">
                <Text className="font-bold text-[14px] text-neutral-500 font-inter">Chưa có huy hiệu nào</Text>
                <Text className="font-medium text-[12px] text-neutral-400 font-inter mt-0.5">Bắt đầu học ngay để nhận huy hiệu đầu tiên nhé!</Text>
              </View>
            </View>
          )}
        </View>

        {/* 4. QUICK ACCESS */}
        <View className="bg-white rounded-[24px] border border-neutral-100 shadow-sm shadow-black/5 overflow-hidden">
          
          <Pressable 
            onPress={() => router.push('/profile/edit' as any)}
            className="flex-row items-center p-4 border-b border-neutral-50 active:bg-neutral-50"
          >
            <View className="w-10 h-10 bg-neutral-100 rounded-xl items-center justify-center mr-4">
              <Edit2Icon size={20} className="text-neutral-600" />
            </View>
            <Text className="flex-1 font-bold text-[15px] text-mascot-navy font-inter">Sửa hồ sơ</Text>
            <ChevronRightIcon size={20} className="text-neutral-400" />
          </Pressable>

          <Pressable 
            onPress={() => router.push('/(tabs)/achievements' as any)}
            className="flex-row items-center p-4 border-b border-neutral-50 active:bg-neutral-50"
          >
            <View className="w-10 h-10 bg-warning-50 rounded-xl items-center justify-center mr-4">
              <TrophyIcon size={20} className="text-warning-500" fill="#FBBF24" />
            </View>
            <Text className="flex-1 font-bold text-[15px] text-mascot-navy font-inter">Thành tựu</Text>
            <ChevronRightIcon size={20} className="text-neutral-400" />
          </Pressable>

          <Pressable 
            onPress={() => router.push('/profile/inventory' as any)}
            className="flex-row items-center p-4 border-b border-neutral-50 active:bg-neutral-50"
          >
            <View className="w-10 h-10 bg-primary-50 rounded-xl items-center justify-center mr-4">
              <PackageIcon size={20} className="text-primary-500" />
            </View>
            <Text className="flex-1 font-bold text-[15px] text-mascot-navy font-inter">Kho đồ</Text>
            <ChevronRightIcon size={20} className="text-neutral-400" />
          </Pressable>

          <Pressable 
            onPress={() => router.push('/profile/wallet' as any)}
            className="flex-row items-center p-4 border-b border-neutral-50 active:bg-neutral-50"
          >
            <View className="w-10 h-10 bg-neutral-100 rounded-xl items-center justify-center mr-4">
              <WalletIcon size={20} className="text-neutral-600" />
            </View>
            <Text className="flex-1 font-bold text-[15px] text-mascot-navy font-inter">Ví tiền</Text>
            <ChevronRightIcon size={20} className="text-neutral-400" />
          </Pressable>

          <Pressable 
            onPress={() => router.push('/profile/settings' as any)}
            className="flex-row items-center p-4 active:bg-neutral-50"
          >
            <View className="w-10 h-10 bg-neutral-100 rounded-xl items-center justify-center mr-4">
              <SettingsIcon size={20} className="text-neutral-600" />
            </View>
            <Text className="flex-1 font-bold text-[15px] text-mascot-navy font-inter">Cài đặt</Text>
            <ChevronRightIcon size={20} className="text-neutral-400" />
          </Pressable>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
