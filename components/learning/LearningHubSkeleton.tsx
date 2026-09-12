import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function LearningHubSkeleton() {
  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={['top']}>
      <View className="px-5 py-4 flex-col gap-4">
        {/* Header Skeleton */}
        <View className="flex-row items-center justify-between">
          <View className="space-y-1.5 flex-1 pr-4">
            <View className="w-36 h-7 bg-neutral-200/60 rounded-lg animate-pulse" />
            <View className="w-56 h-3.5 bg-neutral-200/50 rounded-md animate-pulse mt-1" />
          </View>
          <View className="w-20 h-8 bg-neutral-200/60 rounded-xl animate-pulse" />
        </View>

        {/* Daily Goal Bar Skeleton */}
        <View className="w-full h-2.5 bg-neutral-200/50 rounded-full animate-pulse" />

        {/* HERO Session Card Skeleton (~190dp) */}
        <View className="w-full h-48 bg-neutral-200/60 rounded-3xl animate-pulse" />

        {/* 2x2 Grid Skeleton */}
        <View className="gap-2.5">
          <View className="flex-row gap-2.5">
            <View className="flex-1 h-24 bg-neutral-200/60 rounded-2xl animate-pulse" />
            <View className="flex-1 h-24 bg-neutral-200/60 rounded-2xl animate-pulse" />
          </View>
          <View className="flex-row gap-2.5">
            <View className="flex-1 h-24 bg-neutral-200/60 rounded-2xl animate-pulse" />
            <View className="flex-1 h-24 bg-neutral-200/60 rounded-2xl animate-pulse" />
          </View>
        </View>

        {/* Continue Deck Row Skeleton */}
        <View className="w-full h-16 bg-neutral-200/60 rounded-2xl animate-pulse" />
      </View>
    </SafeAreaView>
  );
}
