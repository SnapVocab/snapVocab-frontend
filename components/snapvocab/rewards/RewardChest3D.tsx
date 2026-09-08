import React, { useEffect } from 'react';
import Svg, { Rect, Path, Defs, LinearGradient, RadialGradient, Stop, Circle, G, Ellipse } from 'react-native-svg';
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

export type ChestVariant = 'basic' | 'rare' | 'epic' | 'legendary';
export type ChestState = 'closed' | 'ready' | 'opening' | 'opened';

export interface RewardChest3DProps extends GameVisualProps {
  variant?: ChestVariant;
  state?: ChestState;
  animation?: 'none' | 'bounce' | 'shine';
}

const VARIANT_CONFIGS: Record<ChestVariant, { woodGrad: [string, string]; trimGrad: [string, string]; keyColor: string }> = {
  basic: {
    woodGrad: ['#A16207', '#713F12'],
    trimGrad: ['#CBD5E1', '#64748B'],
    keyColor: '#94A3B8',
  },
  rare: {
    woodGrad: ['#0284C7', '#0369A1'],
    trimGrad: ['#FFE082', '#FFB300'],
    keyColor: '#FFD54F',
  },
  epic: {
    woodGrad: ['#7E22CE', '#581C87'],
    trimGrad: ['#38BDF8', '#0284C7'],
    keyColor: '#38BDF8',
  },
  legendary: {
    woodGrad: ['#B45309', '#78350F'],
    trimGrad: ['#FFE082', '#FF9500'],
    keyColor: '#FFFFFF',
  },
};

export function RewardChest3D({
  size = 'lg',
  variant = 'legendary',
  state = 'closed',
  animation = 'none',
  style,
  testID,
  accessibilityLabel = 'Treasure Chest',
}: RewardChest3DProps) {
  const numericSize = resolveVisualSize(size);
  const bounceY = useSharedValue(0);
  const config = VARIANT_CONFIGS[variant];

  useEffect(() => {
    if (animation === 'bounce' || state === 'ready') {
      bounceY.value = withRepeat(
        withSequence(
          withTiming(-6, { duration: 450, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 450, easing: Easing.in(Easing.quad) })
        ),
        -1,
        true
      );
    } else {
      bounceY.value = withTiming(0, { duration: 200 });
    }
  }, [animation, state]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceY.value }],
  }));

  const isOpen = state === 'opening' || state === 'opened';

  return (
    <GameVisual size={size} style={style} testID={testID} accessibilityLabel={accessibilityLabel}>
      <Animated.View style={[{ width: numericSize, height: numericSize }, animatedStyle]}>
        <Svg width={numericSize} height={numericSize} viewBox="0 0 64 64" fill="none">
          <Defs>
            <RadialGradient id="chestGlow" cx="50%" cy="60%" r="50%">
              <Stop offset="0%" stopColor={config.trimGrad[0]} stopOpacity={state === 'ready' ? 0.7 : 0.3} />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </RadialGradient>

            <LinearGradient id="chestWood" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={config.woodGrad[0]} />
              <Stop offset="100%" stopColor={config.woodGrad[1]} />
            </LinearGradient>

            <LinearGradient id="chestTrim" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={config.trimGrad[0]} />
              <Stop offset="100%" stopColor={config.trimGrad[1]} />
            </LinearGradient>
          </Defs>

          {/* Glow */}
          <Circle cx="32" cy="38" r="26" fill="url(#chestGlow)" />

          {/* Chest Body Base */}
          <Rect x="10" y="28" width="44" height="26" rx="4" fill="url(#chestWood)" stroke="#451A03" strokeWidth="1.5" />

          {/* Vertical Metal Bands */}
          <Rect x="16" y="28" width="6" height="26" fill="url(#chestTrim)" />
          <Rect x="42" y="28" width="6" height="26" fill="url(#chestTrim)" />

          {/* Lid (Closed or Opened) */}
          {!isOpen ? (
            <G>
              {/* Closed Lid Dome */}
              <Path
                d="M10 28 C10 16 22 14 32 14 C42 14 54 16 54 28 Z"
                fill="url(#chestWood)"
                stroke="#451A03"
                strokeWidth="1.5"
              />
              {/* Lid Trim */}
              <Path d="M16 15 C20 20 22 28 22 28 H16 Z" fill="url(#chestTrim)" />
              <Path d="M48 15 C44 20 42 28 42 28 H48 Z" fill="url(#chestTrim)" />
              <Rect x="10" y="26" width="44" height="4" fill="url(#chestTrim)" />

              {/* Keyhole Plate */}
              <Circle cx="32" cy="34" r="5" fill="url(#chestTrim)" stroke="#451A03" strokeWidth="1" />
              <Circle cx="32" cy="34" r="2.5" fill={config.keyColor} />
            </G>
          ) : (
            <G>
              {/* Opened Lid Lifted Up */}
              <Path
                d="M10 20 C10 8 22 4 32 4 C42 4 54 8 54 20 Z"
                fill="url(#chestWood)"
                stroke="#451A03"
                strokeWidth="1.5"
                transform="rotate(-25 32 20)"
              />
              {/* Inner Glowing Treasure Core */}
              <Ellipse cx="32" cy="28" rx="18" ry="6" fill="#FFE082" />
              <Circle cx="32" cy="24" r="8" fill="#FFF" opacity="0.9" />
            </G>
          )}

          {/* Ready Sparkles */}
          {state === 'ready' && (
            <G fill="#FFE082">
              <Circle cx="8" cy="20" r="2.5" />
              <Circle cx="56" cy="24" r="2" />
              <Circle cx="32" cy="8" r="3" />
            </G>
          )}
        </Svg>
      </Animated.View>
    </GameVisual>
  );
}
