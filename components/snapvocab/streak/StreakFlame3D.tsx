import React, { useEffect } from 'react';
import Svg, { Path, Defs, LinearGradient, RadialGradient, Stop, Circle, G } from 'react-native-svg';
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

export type StreakFlameState = 'active' | 'inactive' | 'broken' | 'milestone';
export type StreakFlameAnimation = 'none' | 'pulse' | 'bounce';

export interface StreakFlame3DProps extends GameVisualProps {
  state?: StreakFlameState;
  animation?: StreakFlameAnimation;
}

export function StreakFlame3D({
  size = 'md',
  state = 'active',
  animation = 'none',
  style,
  testID,
  accessibilityLabel = 'Streak Flame',
}: StreakFlame3DProps) {
  const numericSize = resolveVisualSize(size);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (animation === 'pulse' && state === 'active') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.12, { duration: 750, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 750, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else if (animation === 'bounce') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.18, { duration: 400, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 400, easing: Easing.in(Easing.quad) })
        ),
        -1,
        true
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [animation, state]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isInactive = state === 'inactive' || state === 'broken';
  const isMilestone = state === 'milestone';

  return (
    <GameVisual size={size} style={style} testID={testID} accessibilityLabel={accessibilityLabel}>
      <Animated.View style={[{ width: numericSize, height: numericSize }, animatedStyle]}>
        <Svg width={numericSize} height={numericSize} viewBox="0 0 64 64" fill="none">
          <Defs>
            {/* Outer Glow Gradient */}
            <RadialGradient id="flameGlow" cx="55%" cy="60%" r="50%">
              <Stop offset="0%" stopColor={isInactive ? '#94A3B8' : isMilestone ? '#FFD700' : '#FF8A00'} stopOpacity="0.6" />
              <Stop offset="100%" stopColor={isInactive ? '#CBD5E1' : '#FF3B30'} stopOpacity="0" />
            </RadialGradient>

            {/* Main Outer Flame Gradient */}
            <LinearGradient id="outerFlameGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={isInactive ? '#94A3B8' : isMilestone ? '#FFF176' : '#FF9500'} />
              <Stop offset="60%" stopColor={isInactive ? '#64748B' : isMilestone ? '#FFB300' : '#FF3B30'} />
              <Stop offset="100%" stopColor={isInactive ? '#475569' : isMilestone ? '#E65100' : '#C2185B'} />
            </LinearGradient>

            {/* Mid Flame Gradient */}
            <LinearGradient id="midFlameGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={isInactive ? '#CBD5E1' : '#FFE082'} />
              <Stop offset="50%" stopColor={isInactive ? '#94A3B8' : '#FFC42E'} />
              <Stop offset="100%" stopColor={isInactive ? '#64748B' : '#FF8A00'} />
            </LinearGradient>

            {/* Inner Hot Core Gradient */}
            <LinearGradient id="innerCoreGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="40%" stopColor={isInactive ? '#E2E8F0' : '#FFF59D'} />
              <Stop offset="100%" stopColor={isInactive ? '#94A3B8' : '#FFB300'} />
            </LinearGradient>
          </Defs>

          {/* Background Glow */}
          <Circle cx="32" cy="36" r="26" fill="url(#flameGlow)" />

          {/* Outer Layer 3D Shadow Base */}
          <Path
            d="M32 4C24 16 12 26 12 40C12 51.0457 20.9543 60 32 60C43.0457 60 52 51.0457 52 40C52 26 40 16 32 4Z"
            fill="url(#outerFlameGrad)"
          />

          {/* Mid Flame Layer */}
          <Path
            d="M32 14C27 22 18 30 18 41C18 48.732 24.268 55 32 55C39.732 55 46 48.732 46 41C46 30 37 22 32 14Z"
            fill="url(#midFlameGrad)"
          />

          {/* Inner Glowing Core */}
          <Path
            d="M32 24C29 29 23 35 23 43C23 48 27.0294 51.5 32 51.5C36.9706 51.5 41 48 41 43C41 35 35 29 32 24Z"
            fill="url(#innerCoreGrad)"
          />

          {/* Highlight Specular Crescent */}
          <Path
            d="M26 18C28 14 31 10 32 8C33 13 36 17 38 20C34 18 29 20 26 18Z"
            fill="#FFFFFF"
            opacity={isInactive ? 0.3 : 0.85}
          />

          {/* Sparkles for Milestone */}
          {isMilestone && (
            <G>
              <Circle cx="12" cy="18" r="3" fill="#FFE082" opacity="0.9" />
              <Circle cx="50" cy="22" r="2.5" fill="#FFF" opacity="0.8" />
              <Circle cx="44" cy="10" r="2" fill="#FFD700" opacity="0.9" />
            </G>
          )}

          {/* Broken Flame X Mark if Broken */}
          {state === 'broken' && (
            <G stroke="#EF4444" strokeWidth="4" strokeLinecap="round">
              <Path d="M22 28L42 48" />
              <Path d="M42 28L22 48" />
            </G>
          )}
        </Svg>
      </Animated.View>
    </GameVisual>
  );
}
