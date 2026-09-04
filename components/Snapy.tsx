import React from 'react';
import { View, Text, Image } from 'react-native';
import { cn } from '@/lib/utils';

const POSES = { 
  welcome: require('@/assets/images/snapy-welcome.png'),
  happy: require('@/assets/images/snapy-happy.png'),
  curious: require('@/assets/images/snapy-curious.png'),
  snap: require('@/assets/images/snapy-snap.png'),
  reading: require('@/assets/images/snapy-reading.png'),
  idle: require('@/assets/images/snapy-welcome.png'),
  sad: require('@/assets/images/snapy-curious.png'),
} as const;

export type SnapyPose = keyof typeof POSES;

export function Snapy({
  pose,
  animation = "idle",
  className = "",
}: {
  pose: SnapyPose;
  animation?: string;
  className?: string;
}) {
  return (
    <Image
      source={POSES[pose]}
      resizeMode="contain"
      className={cn("drop-shadow-sm", className)}
    />
  );
}

export function SpeechBubble({ children }: { children: React.ReactNode }) {
  return (
    <View className="relative rounded-2xl border-2 border-mascot-200 bg-mascot-cream px-4 py-3">
      <View
        className="absolute -bottom-[9px] left-8 h-4 w-4 rotate-45 border-r-2 border-b-2 border-mascot-200 bg-mascot-cream"
      />
      <Text className="text-[15px] leading-snug font-semibold text-mascot-navy">{children}</Text>
    </View>
  );
}
