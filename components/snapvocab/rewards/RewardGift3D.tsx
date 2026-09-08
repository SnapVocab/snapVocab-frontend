import React, { useEffect } from 'react';
import Svg, { Rect, Path, Defs, LinearGradient, RadialGradient, Stop, Circle, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { GameVisual, GameVisualProps } from '../core/GameVisual';
import { resolveVisualSize } from '../core/SnapVocabVisualSize';

export interface RewardGift3DProps extends GameVisualProps {
  animation?: 'none' | 'bounce' | 'shine';
}

export function RewardGift3D({
  size = 'md',
  animation = 'none',
  style,
  testID,
  accessibilityLabel = 'Reward Gift Box',
}: RewardGift3DProps) {
  const numericSize = resolveVisualSize(size);
  const bounceY = useSharedValue(0);

  useEffect(() => {
    if (animation === 'bounce') {
      bounceY.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 500, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) })
        ),
        -1,
        true
      );
    } else {
      bounceY.value = withTiming(0, { duration: 200 });
    }
  }, [animation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceY.value }],
  }));

  return (
    <GameVisual size={size} style={style} testID={testID} accessibilityLabel={accessibilityLabel}>
      <Animated.View style={[{ width: numericSize, height: numericSize }, animatedStyle]}>
        <Svg width={numericSize} height={numericSize} viewBox="0 0 64 64" fill="none">
          <Defs>
            <RadialGradient id="giftGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#B91C1C" stopOpacity="0" />
            </RadialGradient>

            <LinearGradient id="boxGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#F87171" />
              <Stop offset="50%" stopColor="#EF4444" />
              <Stop offset="100%" stopColor="#991B1B" />
            </LinearGradient>

            <LinearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FFF9C4" />
              <Stop offset="50%" stopColor="#FFC42E" />
              <Stop offset="100%" stopColor="#D97706" />
            </LinearGradient>
          </Defs>

          <Circle cx="32" cy="38" r="26" fill="url(#giftGlow)" />

          {/* Main Box Body */}
          <Rect x="12" y="26" width="40" height="28" rx="4" fill="url(#boxGrad)" stroke="#7F1D1D" strokeWidth="1.5" />

          {/* Vertical Ribbon */}
          <Rect x="27" y="26" width="10" height="28" fill="url(#ribbonGrad)" />

          {/* Box Lid Base */}
          <Rect x="9" y="20" width="46" height="10" rx="3" fill="url(#boxGrad)" stroke="#7F1D1D" strokeWidth="1.5" />

          {/* Vertical Ribbon Lid */}
          <Rect x="27" y="20" width="10" height="10" fill="url(#ribbonGrad)" />

          {/* Glossy Top Highlight */}
          <Path d="M12 22 H52 V24 H12 Z" fill="#FFFFFF" opacity="0.35" />

          {/* Bow Loops on Top */}
          <G fill="url(#ribbonGrad)" stroke="#B45309" strokeWidth="1">
            <Path d="M22 14 C16 6 28 8 32 18 C32 18 26 18 22 14 Z" />
            <Path d="M42 14 C48 6 36 8 32 18 C32 18 38 18 42 14 Z" />
            <Circle cx="32" cy="18" r="4" fill="#FFE082" />
          </G>
        </Svg>
      </Animated.View>
    </GameVisual>
  );
}
