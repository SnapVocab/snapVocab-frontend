import React, { useEffect } from 'react';
import Svg, { Circle, Path, Defs, LinearGradient, RadialGradient, Stop, G } from 'react-native-svg';
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

export type XPOrbAnimation = 'none' | 'pulse' | 'float';

export interface XPOrb3DProps extends GameVisualProps {
  animation?: XPOrbAnimation;
}

export function XPOrb3D({
  size = 'md',
  animation = 'none',
  style,
  testID,
  accessibilityLabel = 'XP Energy Orb',
}: XPOrb3DProps) {
  const numericSize = resolveVisualSize(size);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (animation === 'float') {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 900, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 900, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );
    } else {
      translateY.value = withTiming(0, { duration: 200 });
    }
  }, [animation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GameVisual size={size} style={style} testID={testID} accessibilityLabel={accessibilityLabel}>
      <Animated.View style={[{ width: numericSize, height: numericSize }, animatedStyle]}>
        <Svg width={numericSize} height={numericSize} viewBox="0 0 64 64" fill="none">
          <Defs>
            {/* Outer Blue Glow */}
            <RadialGradient id="orbGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#1CB0F6" stopOpacity="0.6" />
              <Stop offset="60%" stopColor="#A855F7" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#007AFF" stopOpacity="0" />
            </RadialGradient>

            {/* Orb Main Gradient */}
            <LinearGradient id="orbBodyGrad" x1="0.1" y1="0.1" x2="0.9" y2="0.9">
              <Stop offset="0%" stopColor="#E0F2FE" />
              <Stop offset="25%" stopColor="#38BDF8" />
              <Stop offset="65%" stopColor="#1CB0F6" />
              <Stop offset="100%" stopColor="#6366F1" />
            </LinearGradient>

            {/* Inner Core Purple Spark Gradient */}
            <RadialGradient id="coreSpark" cx="40%" cy="40%" r="50%">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="40%" stopColor="#C084FC" />
              <Stop offset="100%" stopColor="#7E22CE" stopOpacity="0.9" />
            </RadialGradient>

            {/* Lightning Bolt Gradient */}
            <LinearGradient id="boltGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="60%" stopColor="#FEF08A" />
              <Stop offset="100%" stopColor="#F59E0B" />
            </LinearGradient>
          </Defs>

          {/* Background Electric Atmosphere Glow */}
          <Circle cx="32" cy="32" r="30" fill="url(#orbGlow)" />

          {/* Main Crystal Sphere Base */}
          <Circle cx="32" cy="32" r="25" fill="url(#orbBodyGrad)" stroke="#0284C7" strokeWidth="1.5" />

          {/* Internal Swirling Purple Energy Ring */}
          <Circle cx="30" cy="30" r="18" fill="url(#coreSpark)" opacity="0.85" />

          {/* Lightning XP Motif Shadow & Bolt */}
          <Path
            d="M34 15.5 L20 35.5 L31 35.5 L26 51.5 L44 29.5 L33 29.5 Z"
            fill="#0284C7"
            opacity="0.35"
          />
          <G>
            <Path
              d="M34 14 L20 34 L31 34 L26 50 L44 28 L33 28 Z"
              fill="url(#boltGrad)"
              stroke="#B45309"
              strokeWidth="0.8"
            />
          </G>

          {/* Specular Curved Gloss Highlight */}
          <Path
            d="M16 26 C18 18 24 12 32 12 C36 12 40 14 43 17 C38 14 30 14 22 20 C18 23 16 26 16 26 Z"
            fill="#FFFFFF"
            opacity="0.8"
          />

          {/* Energy Particles */}
          <Circle cx="15" cy="20" r="2" fill="#E0F2FE" opacity="0.9" />
          <Circle cx="48" cy="42" r="1.8" fill="#F472B6" opacity="0.8" />
          <Circle cx="44" cy="18" r="2.2" fill="#FEF08A" opacity="0.95" />
        </Svg>
      </Animated.View>
    </GameVisual>
  );
}
