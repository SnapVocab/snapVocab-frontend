import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, Easing, StyleProp, ViewStyle, ImageStyle } from 'react-native';
import { cn } from '@/lib/utils';

const POSES = { 
  // Main
  main: require('@/assets/images/mascot/snapy-main.png'),
  snap: require('@/assets/images/mascot/snapy-main.png'),
  welcome: require('@/assets/images/mascot/actions/snapy-chao-mung.png'),
  idle: require('@/assets/images/mascot/actions/snapy-chao-mung.png'),

  // Actions (Hành động)
  chao_mung: require('@/assets/images/mascot/actions/snapy-chao-mung.png'),
  reading: require('@/assets/images/mascot/actions/snapy-doc-sach.png'),
  doc_sach: require('@/assets/images/mascot/actions/snapy-doc-sach.png'),
  jumping: require('@/assets/images/mascot/actions/snapy-nhay-len.png'),
  nhay_len: require('@/assets/images/mascot/actions/snapy-nhay-len.png'),
  celebrating: require('@/assets/images/mascot/actions/snapy-an-mung.png'),
  an_mung: require('@/assets/images/mascot/actions/snapy-an-mung.png'),
  thinking: require('@/assets/images/mascot/actions/snapy-suy-nghi.png'),
  suy_nghi: require('@/assets/images/mascot/actions/snapy-suy-nghi.png'),
  exploring: require('@/assets/images/mascot/actions/snapy-kham-pha.png'),
  kham_pha: require('@/assets/images/mascot/actions/snapy-kham-pha.png'),

  // Expressions (Biểu cảm)
  happy: require('@/assets/images/mascot/expressions/snapy-vui-ve.png'),
  vui_ve: require('@/assets/images/mascot/expressions/snapy-vui-ve.png'),
  winking: require('@/assets/images/mascot/expressions/snapy-nhay-mat.png'),
  nhay_mat: require('@/assets/images/mascot/expressions/snapy-nhay-mat.png'),
  curious: require('@/assets/images/mascot/expressions/snapy-to-mo.png'),
  to_mo: require('@/assets/images/mascot/expressions/snapy-to-mo.png'),
  focused: require('@/assets/images/mascot/expressions/snapy-tap-trung.png'),
  tap_trung: require('@/assets/images/mascot/expressions/snapy-tap-trung.png'),
  surprised: require('@/assets/images/mascot/expressions/snapy-bat-ngo.png'),
  bat_ngo: require('@/assets/images/mascot/expressions/snapy-bat-ngo.png'),
  proud: require('@/assets/images/mascot/expressions/snapy-tu-hao.png'),
  tu_hao: require('@/assets/images/mascot/expressions/snapy-tu-hao.png'),
  sad: require('@/assets/images/mascot/expressions/snapy-to-mo.png'),

  // Applications & Turnaround
  app_icon: require('@/assets/images/mascot/applications/snapy-app-icon.png'),
  sticker: require('@/assets/images/mascot/applications/snapy-sticker-goodjob.png'),
  loading: require('@/assets/images/mascot/applications/snapy-loading-rocket.png'),
  notification: require('@/assets/images/mascot/applications/snapy-thong-bao.png'),
  turn_front: require('@/assets/images/mascot/turnaround/snapy-turnaround-truoc.png'),
  turn_side: require('@/assets/images/mascot/turnaround/snapy-turnaround-ben.png'),
  turn_back: require('@/assets/images/mascot/turnaround/snapy-turnaround-sau.png'),
} as const;

export type SnapyPose = keyof typeof POSES;

export type SnapyAnimation = 'idle' | 'bounce' | 'bounce_in' | 'wave' | 'shake' | 'celebrate' | 'float' | 'none';

export function Snapy({
  pose,
  animation = "idle",
  className = "",
  style,
  onPress,
}: {
  pose: SnapyPose;
  animation?: SnapyAnimation | string;
  className?: string;
  style?: StyleProp<ImageStyle>;
  onPress?: () => void;
}) {
  const animValue = useRef(new Animated.Value(0)).current;
  const animLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    animValue.setValue(0);
    if (animLoop.current) {
      animLoop.current.stop();
    }

    if (animation === 'none') {
      return;
    }

    if (animation === 'idle') {
      // Subtle gentle breathing/floating
      animLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      animLoop.current.start();
    } else if (animation === 'bounce' || animation === 'bounce_in') {
      // Energetic spring bounce
      animLoop.current = Animated.loop(
        Animated.sequence([
          Animated.spring(animValue, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 250,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay(1000),
        ])
      );
      animLoop.current.start();
    } else if (animation === 'wave') {
      // Tilting & wiggling playfully
      animLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 350,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: -1,
            duration: 700,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 350,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay(1200),
        ])
      );
      animLoop.current.start();
    } else if (animation === 'shake') {
      // Horizontal wobble (for wrong answers or alerts)
      animLoop.current = Animated.sequence([
        Animated.timing(animValue, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.timing(animValue, { toValue: -1, duration: 100, useNativeDriver: true }),
        Animated.timing(animValue, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.timing(animValue, { toValue: -0.5, duration: 80, useNativeDriver: true }),
        Animated.timing(animValue, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]);
      animLoop.current.start();
    } else if (animation === 'celebrate') {
      // Squash, jump up high and bounce
      animLoop.current = Animated.sequence([
        Animated.timing(animValue, { toValue: -0.3, duration: 150, useNativeDriver: true }), // squash
        Animated.spring(animValue, { toValue: 1.2, friction: 3, tension: 50, useNativeDriver: true }), // jump
        Animated.spring(animValue, { toValue: 0, friction: 4, tension: 40, useNativeDriver: true }),
      ]);
      animLoop.current.start();
    } else if (animation === 'float') {
      // Continuous floating up and down
      animLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 1400,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: -1,
            duration: 1400,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
      animLoop.current.start();
    }

    return () => {
      if (animLoop.current) {
        animLoop.current.stop();
      }
    };
  }, [animation, pose]);

  // Interpolated transforms based on animation mode
  let animatedTransform = {};
  if (animation === 'idle') {
    animatedTransform = {
      transform: [
        {
          translateY: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -5],
          }),
        },
        {
          scale: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.02],
          }),
        },
      ],
    };
  } else if (animation === 'bounce' || animation === 'bounce_in') {
    animatedTransform = {
      transform: [
        {
          translateY: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -12],
          }),
        },
        {
          scale: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.05],
          }),
        },
      ],
    };
  } else if (animation === 'wave') {
    animatedTransform = {
      transform: [
        {
          rotate: animValue.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: ['-6deg', '0deg', '6deg'],
          }),
        },
      ],
    };
  } else if (animation === 'shake') {
    animatedTransform = {
      transform: [
        {
          translateX: animValue.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [-10, 0, 10],
          }),
        },
      ],
    };
  } else if (animation === 'celebrate') {
    animatedTransform = {
      transform: [
        {
          translateY: animValue.interpolate({
            inputRange: [-0.3, 0, 1.2],
            outputRange: [6, 0, -22],
          }),
        },
        {
          scale: animValue.interpolate({
            inputRange: [-0.3, 0, 1.2],
            outputRange: [0.95, 1, 1.15],
          }),
        },
      ],
    };
  } else if (animation === 'float') {
    animatedTransform = {
      transform: [
        {
          translateY: animValue.interpolate({
            inputRange: [-1, 1],
            outputRange: [-8, 8],
          }),
        },
      ],
    };
  }

  return (
    <Animated.Image
      source={POSES[pose] || POSES.main}
      resizeMode="contain"
      style={[animatedTransform, style]}
      className={cn("drop-shadow-md", className)}
    />
  );
}

export function SpeechBubble({ 
  children, 
  className = "",
  direction = "bottom",
}: { 
  children: React.ReactNode; 
  className?: string;
  direction?: 'bottom' | 'left' | 'right';
}) {
  return (
    <View className={cn("relative rounded-2xl border-2 border-mascot-200/90 bg-[#FFFDF9] px-4 py-3 shadow-sm shadow-orange-950/5", className)}>
      {direction === 'bottom' && (
        <View
          className="absolute -bottom-[9px] left-8 h-4 w-4 rotate-45 border-r-2 border-b-2 border-mascot-200/90 bg-[#FFFDF9]"
        />
      )}
      {direction === 'left' && (
        <View
          className="absolute -left-[9px] top-4 h-4 w-4 rotate-45 border-l-2 border-b-2 border-mascot-200/90 bg-[#FFFDF9]"
        />
      )}
      <Text className="text-[15px] leading-snug font-bold text-mascot-navy">{children}</Text>
    </View>
  );
}

