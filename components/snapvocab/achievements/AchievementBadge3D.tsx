import React from 'react';
import Svg, { Circle, Path, Defs, LinearGradient, RadialGradient, Stop, G, Polygon, Rect } from 'react-native-svg';
import { GameVisual, GameVisualProps } from '../core/GameVisual';
import { resolveVisualSize } from '../core/SnapVocabVisualSize';

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type BadgeState = 'locked' | 'unlocked' | 'completed';

export interface AchievementBadge3DProps extends GameVisualProps {
  rarity?: BadgeRarity;
  state?: BadgeState;
  imageSource?: any;
}

const RARITY_GRADIENTS: Record<BadgeRarity, [string, string, string]> = {
  common: ['#94A3B8', '#64748B', '#334155'],
  rare: ['#38BDF8', '#0284C7', '#0369A1'],
  epic: ['#C084FC', '#A855F7', '#6B21A8'],
  legendary: ['#FFE082', '#FFC42E', '#D97706'],
};

export function AchievementBadge3D({
  size = 'md',
  rarity = 'common',
  state = 'unlocked',
  style,
  testID,
  accessibilityLabel = 'Achievement Badge',
}: AchievementBadge3DProps) {
  const numericSize = resolveVisualSize(size);
  const isLocked = state === 'locked';
  const colors = isLocked
    ? (['#CBD5E1', '#94A3B8', '#64748B'] as const)
    : RARITY_GRADIENTS[rarity];

  return (
    <GameVisual size={size} style={style} testID={testID} accessibilityLabel={accessibilityLabel}>
      <Svg width={numericSize} height={numericSize} viewBox="0 0 64 64" fill="none">
        <Defs>
          <RadialGradient id="badgeGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={colors[1]} stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>

          <LinearGradient id="badgeGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={colors[0]} />
            <Stop offset="50%" stopColor={colors[1]} />
            <Stop offset="100%" stopColor={colors[2]} />
          </LinearGradient>
        </Defs>

        {/* Glow */}
        <Circle cx="32" cy="32" r="28" fill="url(#badgeGlow)" />

        {/* Outer Shield/Star Ribbon Contour */}
        {rarity === 'legendary' ? (
          <Polygon
            points="32,4 40,12 52,12 52,24 60,32 52,40 52,52 40,52 32,60 24,52 12,52 12,40 4,32 12,24 12,12 24,12"
            fill="url(#badgeGrad)"
            stroke="#78350F"
            strokeWidth="1.5"
          />
        ) : (
          <Circle cx="32" cy="32" r="26" fill="url(#badgeGrad)" stroke="#1E293B" strokeWidth="1.5" />
        )}

        {/* Inner Plate */}
        <Circle cx="32" cy="32" r="20" fill="#FFFFFF" opacity={isLocked ? 0.4 : 0.9} />

        {/* Inner Emblem */}
        {!isLocked ? (
          <G fill={colors[1]}>
            <Path d="M32 18 L35 24 L42 25 L37 30 L38.5 37 L32 33.5 L25.5 37 L27 30 L22 25 L29 24 Z" />
          </G>
        ) : (
          /* Lock Icon */
          <G stroke="#64748B" strokeWidth="2" fill="none">
            <Rect x="24" y="30" width="16" height="12" rx="2" fill="#64748B" />
            <Path d="M27 30 V25 C27 22.2 29.2 20 32 20 C34.8 20 37 22.2 37 25 V30" />
          </G>
        )}
      </Svg>
    </GameVisual>
  );
}
