import React from 'react';
import Svg, { Circle, Rect, Path, Defs, LinearGradient, RadialGradient, Stop, G, Ellipse } from 'react-native-svg';
import { GameVisual, GameVisualProps } from '../core/GameVisual';
import { resolveVisualSize } from '../core/SnapVocabVisualSize';

export type MissionType = 'scan' | 'vocab' | 'accuracy' | 'streak' | 'speed' | 'review' | 'challenge';

export interface MissionIcon3DProps extends GameVisualProps {
  type?: MissionType;
}

interface ThemeColorConfig {
  base: string;
  faceGrad: [string, string];
  darkBorder: string;
  lightBorder: string;
  glow: string;
}

const THEMES: Record<MissionType, ThemeColorConfig> = {
  vocab: {
    base: '#3C8C00',
    faceGrad: ['#85E043', '#58CC02'],
    darkBorder: '#2F6E00',
    lightBorder: '#B4F079',
    glow: '#58CC02',
  },
  scan: {
    base: '#0369A1',
    faceGrad: ['#38BDF8', '#0284C7'],
    darkBorder: '#075985',
    lightBorder: '#7DD3FC',
    glow: '#0284C7',
  },
  accuracy: {
    base: '#B91C1C',
    faceGrad: ['#F87171', '#EF4444'],
    darkBorder: '#991B1B',
    lightBorder: '#FCA5A5',
    glow: '#EF4444',
  },
  streak: {
    base: '#C2410C',
    faceGrad: ['#FB923C', '#EA580C'],
    darkBorder: '#9A3412',
    lightBorder: '#FDBA74',
    glow: '#EA580C',
  },
  speed: {
    base: '#A16207',
    faceGrad: ['#FACC15', '#EAB308'],
    darkBorder: '#854D0E',
    lightBorder: '#FEF08A',
    glow: '#EAB308',
  },
  review: {
    base: '#6B21A8',
    faceGrad: ['#C084FC', '#9333EA'],
    darkBorder: '#581C87',
    lightBorder: '#E9D5FF',
    glow: '#9333EA',
  },
  challenge: {
    base: '#B45309',
    faceGrad: ['#FBBF24', '#D97706'],
    darkBorder: '#92400E',
    lightBorder: '#FDE68A',
    glow: '#D97706',
  },
};

export function MissionIcon3D({
  type = 'vocab',
  size = 'md',
  style,
  testID,
  accessibilityLabel = 'Mission Illustration',
}: MissionIcon3DProps) {
  const numericSize = resolveVisualSize(size);
  const theme = THEMES[type] || THEMES.vocab;

  const renderGlyph = () => {
    switch (type) {
      case 'scan':
        return (
          <G>
            {/* Camera Shadow */}
            <Rect x="13" y="21" width="38" height="26" rx="6" fill="#000000" opacity="0.18" />
            {/* Camera Body */}
            <Rect x="13" y="19" width="38" height="26" rx="6" fill="#FFFFFF" />
            <Rect x="15" y="21" width="34" height="22" rx="4" fill="#E0F2FE" />
            {/* Camera Top Bump */}
            <Rect x="23" y="16" width="18" height="5" rx="2" fill="#BAE6FD" />
            {/* Camera Lens */}
            <Circle cx="32" cy="32" r="9" fill="#0284C7" />
            <Circle cx="32" cy="32" r="7" fill="#0369A1" />
            <Circle cx="30" cy="30" r="3" fill="#FFFFFF" opacity="0.8" />
            {/* Flash Lens */}
            <Circle cx="44" cy="24" r="2" fill="#F59E0B" />
          </G>
        );
      case 'accuracy':
        return (
          <G>
            {/* Target Outer */}
            <Circle cx="32" cy="32" r="18" fill="#FFFFFF" />
            <Circle cx="32" cy="32" r="15" fill="#EF4444" />
            <Circle cx="32" cy="32" r="11" fill="#FFFFFF" />
            <Circle cx="32" cy="32" r="7" fill="#EF4444" />
            <Circle cx="32" cy="32" r="3" fill="#FFFFFF" />
            {/* Dart / Arrow Hit */}
            <Path d="M46 14 L35 27 L33 25 L44 12 Z" fill="#F59E0B" />
            <Path d="M48 10 L44 14 L42 12 L46 8 Z" fill="#D97706" />
          </G>
        );
      case 'streak':
        return (
          <G>
            {/* Outer Flame Shadow */}
            <Path
              d="M32 13 C23 23 16 31 16 41 C16 49.5 23 54.5 32 54.5 C41 54.5 48 49.5 48 41 C48 31 41 23 32 13 Z"
              fill="#000000"
              opacity="0.15"
            />
            {/* Outer Flame Gold */}
            <Path
              d="M32 12 C23 22 16 30 16 40 C16 48.8 23 54 32 54 C41 54 48 48.8 48 40 C48 30 41 22 32 12 Z"
              fill="#FEF08A"
            />
            {/* Inner Core Orange Flame */}
            <Path
              d="M32 20 C26 27 21 33 21 41 C21 47 26 50.5 32 50.5 C38 50.5 43 47 43 41 C43 33 38 27 32 20 Z"
              fill="#F97316"
            />
            {/* Flame Heart Yellow */}
            <Path
              d="M32 29 C28 34 25 38 25 43 C25 47 28 49 32 49 C36 49 39 47 39 43 C39 38 36 34 32 29 Z"
              fill="#FEF9C3"
            />
          </G>
        );
      case 'speed':
        return (
          <G>
            {/* Lightning bolt with 3D bevel */}
            <Path d="M37 13 L19 33 L31 33 L25 51 L47 29 L33 29 Z" fill="#000000" opacity="0.18" />
            <Path d="M36 12 L18 32 L30 32 L24 50 L46 28 L32 28 Z" fill="#FFFFFF" />
            <Path d="M34 16 L22 32 L30 32 L26 44 L41 30 L32 30 Z" fill="#FEF08A" />
          </G>
        );
      case 'review':
        return (
          <G>
            {/* Back Flashcard */}
            <Rect x="16" y="19" width="22" height="28" rx="4" fill="#000000" opacity="0.15" transform="rotate(-12 27 33)" />
            <Rect x="16" y="17" width="22" height="28" rx="4" fill="#F3E8FF" transform="rotate(-12 27 31)" />
            {/* Front Flashcard */}
            <Rect x="25" y="16" width="23" height="30" rx="4" fill="#000000" opacity="0.12" />
            <Rect x="25" y="14" width="23" height="30" rx="4" fill="#FFFFFF" stroke="#E9D5FF" strokeWidth="1" />
            {/* Content Lines */}
            <Rect x="29" y="21" width="15" height="3" rx="1.5" fill="#9333EA" />
            <Rect x="29" y="27" width="11" height="2.5" rx="1.2" fill="#C084FC" />
            <Rect x="29" y="32" width="13" height="2.5" rx="1.2" fill="#C084FC" />
          </G>
        );
      case 'challenge':
        return (
          <G>
            {/* Trophy or Star 3D */}
            <Circle cx="32" cy="32" r="16" fill="#000000" opacity="0.15" />
            {/* Star Base */}
            <Path
              d="M32 15 L36.5 25 L47.5 26 L39 34 L41.5 45 L32 39.5 L22.5 45 L25 34 L16.5 26 L27.5 25 Z"
              fill="#FFFFFF"
            />
            <Path
              d="M32 17.5 L35.5 25.5 L44 26.5 L37.5 33 L39.5 41.5 L32 37 L24.5 41.5 L26.5 33 L20 26.5 L28.5 25.5 Z"
              fill="#F59E0B"
            />
            {/* Center sparkle */}
            <Circle cx="32" cy="31" r="3" fill="#FFFBEB" />
          </G>
        );
      case 'vocab':
      default:
        return (
          <G>
            {/* 3D Open Book */}
            {/* Book Spine Shadow */}
            <Rect x="15" y="19" width="34" height="26" rx="4" fill="#000000" opacity="0.15" />
            {/* Left Page (Back) */}
            <Path d="M16 20 C22 21 28 19 32 21 L32 44 C28 42 22 44 16 43 Z" fill="#D9F99D" />
            {/* Right Page (Back) */}
            <Path d="M48 20 C42 21 36 19 32 21 L32 44 C36 42 42 44 48 43 Z" fill="#BEF264" />
            {/* Left Page (White Top) */}
            <Path d="M17 18 C23 19 28 17 32 19 L32 41 C28 39 23 41 17 40 Z" fill="#FFFFFF" />
            {/* Right Page (White Top) */}
            <Path d="M47 18 C41 19 36 17 32 19 L32 41 C36 39 41 41 47 40 Z" fill="#F7FEE7" />
            {/* Page Lines */}
            <Path d="M20 23 C23 24 26 23 29 24 M20 28 C23 29 26 28 29 29 M20 33 C23 34 26 33 29 34" stroke="#84CC16" strokeWidth="1.5" strokeLinecap="round" />
            <Path d="M44 23 C41 24 38 23 35 24 M44 28 C41 29 38 28 35 29 M44 33 C41 34 38 33 35 34" stroke="#84CC16" strokeWidth="1.5" strokeLinecap="round" />
            {/* Center Book Spine */}
            <Rect x="31" y="18" width="2" height="24" rx="1" fill="#4D7C0F" />
          </G>
        );
    }
  };

  return (
    <GameVisual size={size} style={style} testID={testID} accessibilityLabel={accessibilityLabel}>
      <Svg width={numericSize} height={numericSize} viewBox="0 0 64 64" fill="none">
        <Defs>
          {/* Radial soft floor shadow */}
          <RadialGradient id={`floorShadow-${type}`} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>

          {/* 3D Main Face Gradient */}
          <LinearGradient id={`faceGrad-${type}`} x1="0.2" y1="0" x2="0.8" y2="1">
            <Stop offset="0%" stopColor={theme.faceGrad[0]} />
            <Stop offset="100%" stopColor={theme.faceGrad[1]} />
          </LinearGradient>

          {/* Top Edge Specular Shine */}
          <LinearGradient id={`topShine-${type}`} x1="0.5" y1="0" x2="0.5" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* 1. Floor Drop Shadow */}
        <Ellipse cx="32" cy="58" rx="22" ry="5" fill={`url(#floorShadow-${type})`} />

        {/* 2. 3D Bottom Bevel Layer (Provides tactile depth thickness) */}
        <Circle cx="32" cy="34" r="26" fill={theme.base} />

        {/* 3. Main 3D Coin/Shield Face */}
        <Circle
          cx="32"
          cy="30"
          r="26"
          fill={`url(#faceGrad-${type})`}
          stroke={theme.lightBorder}
          strokeWidth="1.5"
        />

        {/* 4. Top Specular Crescent Highlight */}
        <Path
          d="M10 26 C12 14 22 7 32 7 C42 7 52 14 54 26 C46 16 38 12 32 12 C26 12 18 16 10 26 Z"
          fill={`url(#topShine-${type})`}
        />

        {/* 5. Inner Recessed Rim */}
        <Circle cx="32" cy="30" r="22" stroke={theme.darkBorder} strokeWidth="1" opacity="0.35" />

        {/* 6. Foreground 3D Glyph */}
        {renderGlyph()}
      </Svg>
    </GameVisual>
  );
}
