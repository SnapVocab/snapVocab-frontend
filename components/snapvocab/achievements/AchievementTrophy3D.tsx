import React from 'react';
import Svg, { Path, Defs, LinearGradient, RadialGradient, Stop, Circle, Rect, G, Ellipse } from 'react-native-svg';
import { GameVisual, GameVisualProps } from '../core/GameVisual';
import { resolveVisualSize } from '../core/SnapVocabVisualSize';

export interface AchievementTrophy3DProps extends GameVisualProps {
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

export function AchievementTrophy3D({
  size = 'lg',
  rarity = 'legendary',
  style,
  testID,
  accessibilityLabel = 'Achievement Trophy',
}: AchievementTrophy3DProps) {
  const numericSize = resolveVisualSize(size);

  return (
    <GameVisual size={size} style={style} testID={testID} accessibilityLabel={accessibilityLabel}>
      <Svg width={numericSize} height={numericSize} viewBox="0 0 64 64" fill="none">
        <Defs>
          <RadialGradient id="trophyGlow" cx="50%" cy="40%" r="50%">
            <Stop offset="0%" stopColor="#FFC42E" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </RadialGradient>

          <LinearGradient id="goldCup" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFF5C0" />
            <Stop offset="30%" stopColor="#FFD54F" />
            <Stop offset="70%" stopColor="#FFC42E" />
            <Stop offset="100%" stopColor="#D97706" />
          </LinearGradient>

          <LinearGradient id="trophyBase" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#78350F" />
            <Stop offset="50%" stopColor="#451A03" />
            <Stop offset="100%" stopColor="#290E02" />
          </LinearGradient>
        </Defs>

        {/* Glow */}
        <Circle cx="32" cy="28" r="28" fill="url(#trophyGlow)" />

        {/* Left Handle */}
        <Path d="M16 16 C8 16 8 32 18 34" fill="none" stroke="url(#goldCup)" strokeWidth="4.5" strokeLinecap="round" />

        {/* Right Handle */}
        <Path d="M48 16 C56 16 56 32 46 34" fill="none" stroke="url(#goldCup)" strokeWidth="4.5" strokeLinecap="round" />

        {/* Cup Body */}
        <Path
          d="M16 12 H48 V24 C48 34 38 40 32 40 C26 40 16 34 16 24 Z"
          fill="url(#goldCup)"
          stroke="#B45309"
          strokeWidth="1.5"
        />

        {/* Cup Rim Highlight */}
        <Ellipse cx="32" cy="12" rx="16" ry="3" fill="#FFF9C4" />

        {/* Stem Column */}
        <Rect x="28" y="40" width="8" height="10" fill="url(#goldCup)" stroke="#B45309" strokeWidth="1" />
        <Circle cx="32" cy="42" r="5" fill="#FFE082" />

        {/* Base Platform */}
        <Rect x="18" y="50" width="28" height="10" rx="2" fill="url(#trophyBase)" stroke="#1E293B" strokeWidth="1.5" />
        <Rect x="22" y="52" width="20" height="6" rx="1" fill="url(#goldCup)" />

        {/* Center Star Emblem */}
        <G fill="#FFFFFF" stroke="#B45309" strokeWidth="0.8">
          <Path d="M32 20 L33.5 24 L38 24.5 L34.5 27.5 L35.5 32 L32 29.5 L28.5 32 L29.5 27.5 L26 24.5 L30.5 24 Z" />
        </G>
      </Svg>
    </GameVisual>
  );
}
