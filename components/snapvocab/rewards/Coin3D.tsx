import React, { useEffect } from 'react';
import Svg, { Circle, Path, Defs, LinearGradient, RadialGradient, Stop, G, Text as SvgText } from 'react-native-svg';
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

export type CoinAnimation = 'none' | 'shine' | 'spin' | 'bounce';

export interface Coin3DProps extends GameVisualProps {
  amount?: number;
  animation?: CoinAnimation;
}

export function Coin3D({
  size = 'md',
  amount,
  animation = 'none',
  style,
  testID,
  accessibilityLabel = '3D Gold Coin',
}: Coin3DProps) {
  const numericSize = resolveVisualSize(size);
  const rotateY = useSharedValue(0);

  useEffect(() => {
    if (animation === 'spin') {
      rotateY.value = withRepeat(
        withTiming(360, { duration: 1800, easing: Easing.linear }),
        -1,
        false
      );
    } else if (animation === 'bounce') {
      rotateY.value = withRepeat(
        withSequence(
          withTiming(15, { duration: 300, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 300, easing: Easing.in(Easing.quad) })
        ),
        -1,
        true
      );
    } else {
      rotateY.value = withTiming(0, { duration: 200 });
    }
  }, [animation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotateY.value}deg` }],
  }));

  return (
    <GameVisual size={size} style={style} testID={testID} accessibilityLabel={accessibilityLabel}>
      <Animated.View style={[{ width: numericSize, height: numericSize }, animatedStyle]}>
        <Svg width={numericSize} height={numericSize} viewBox="0 0 64 64" fill="none">
          <Defs>
            {/* Outer Coin Shadow */}
            <RadialGradient id="coinGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FFC42E" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#D97706" stopOpacity="0" />
            </RadialGradient>

            {/* 3D Side Rim Depth Gradient */}
            <LinearGradient id="coinSideGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#B45309" />
              <Stop offset="50%" stopColor="#D97706" />
              <Stop offset="100%" stopColor="#78350F" />
            </LinearGradient>

            {/* Main Face Gradient */}
            <LinearGradient id="coinFaceGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <Stop offset="0%" stopColor="#FFF5C0" />
              <Stop offset="30%" stopColor="#FFD54F" />
              <Stop offset="70%" stopColor="#FFC42E" />
              <Stop offset="100%" stopColor="#F59E0B" />
            </LinearGradient>

            {/* Embossed Inner Ring Gradient */}
            <LinearGradient id="innerRimGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#F59E0B" />
              <Stop offset="100%" stopColor="#FFE082" />
            </LinearGradient>

            {/* Center Star Emblem Gradient */}
            <LinearGradient id="starEmblemGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FFF9C4" />
              <Stop offset="100%" stopColor="#D97706" />
            </LinearGradient>
          </Defs>

          {/* Background Glow */}
          <Circle cx="32" cy="34" r="28" fill="url(#coinGlow)" />

          {/* 3D Drop Depth Circle */}
          <Circle cx="32" cy="35" r="27" fill="url(#coinSideGrad)" />

          {/* Front Coin Face Base */}
          <Circle cx="32" cy="32" r="27" fill="url(#coinFaceGrad)" stroke="#B45309" strokeWidth="1.5" />

          {/* Outer Raised Edge Ring */}
          <Circle cx="32" cy="32" r="23" fill="none" stroke="url(#innerRimGrad)" strokeWidth="2.5" />

          {/* Inner Recessed Face */}
          <Circle cx="32" cy="32" r="19" fill="url(#coinFaceGrad)" opacity="0.9" />

          {/* Specular Highlight Arc */}
          <Path
            d="M12 28 C14 18 22 10 32 10 C38 10 44 12 48 16 C42 13 32 12 20 20 C14 24 12 28 12 28 Z"
            fill="#FFFFFF"
            opacity="0.65"
          />

          {/* Center Star or Coin Symbol */}
          {amount !== undefined && numericSize >= 40 ? (
            <SvgText
              x="32"
              y="38"
              fontSize="16"
              fontWeight="bold"
              fill="#78350F"
              textAnchor="middle"
            >
              {amount > 999 ? `${(amount / 1000).toFixed(1)}k` : amount}
            </SvgText>
          ) : (
            <G fill="url(#starEmblemGrad)" stroke="#78350F" strokeWidth="0.8">
              {/* Star Emblem */}
              <Path d="M32 20 L35.2 27.2 L43 27.8 L37 32.8 L38.8 40.4 L32 36.4 L25.2 40.4 L27 32.8 L21 27.8 L28.8 27.2 Z" />
            </G>
          )}

          {/* Bottom Rim Highlight */}
          <Path
            d="M18 48 C22 52 28 54 34 54 C42 54 48 50 51 45 C46 51 38 52 32 52 C24 52 19 49 18 48 Z"
            fill="#FFF5C0"
            opacity="0.8"
          />
        </Svg>
      </Animated.View>
    </GameVisual>
  );
}
