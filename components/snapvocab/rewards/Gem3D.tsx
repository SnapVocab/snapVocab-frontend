import React from 'react';
import Svg, { Path, Defs, LinearGradient, RadialGradient, Stop, Polygon, G } from 'react-native-svg';
import { GameVisual, GameVisualProps } from '../core/GameVisual';
import { resolveVisualSize } from '../core/SnapVocabVisualSize';

export interface Gem3DProps extends GameVisualProps {}

export function Gem3D({
  size = 'md',
  style,
  testID,
  accessibilityLabel = '3D Gemstone',
}: Gem3DProps) {
  const numericSize = resolveVisualSize(size);

  return (
    <GameVisual size={size} style={style} testID={testID} accessibilityLabel={accessibilityLabel}>
      <Svg width={numericSize} height={numericSize} viewBox="0 0 64 64" fill="none">
        <Defs>
          <RadialGradient id="gemGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#00E5FF" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </RadialGradient>

          <LinearGradient id="facetTop" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#E0FFFE" />
            <Stop offset="100%" stopColor="#84FFFF" />
          </LinearGradient>

          <LinearGradient id="facetLeft" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#00E5FF" />
            <Stop offset="100%" stopColor="#00B8D4" />
          </LinearGradient>

          <LinearGradient id="facetRight" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#00B8D4" />
            <Stop offset="100%" stopColor="#006064" />
          </LinearGradient>
        </Defs>

        {/* Glow */}
        <Path d="M32 6L54 22L32 58L10 22Z" fill="url(#gemGlow)" scale="1.15" origin="32, 32" />

        {/* Outer Facet Outline */}
        <G stroke="#004D40" strokeWidth="1" strokeLinejoin="round">
          {/* Top Crown Facet */}
          <Polygon points="22,12 42,12 54,24 10,24" fill="url(#facetTop)" />
          {/* Center Table Facet */}
          <Polygon points="22,12 42,12 36,24 28,24" fill="#FFFFFF" opacity="0.9" />
          {/* Upper Left Triangle */}
          <Polygon points="10,24 22,12 28,24" fill="url(#facetLeft)" />
          {/* Upper Right Triangle */}
          <Polygon points="42,12 54,24 36,24" fill="url(#facetRight)" />
          {/* Lower Bottom Left Facet */}
          <Polygon points="10,24 28,24 32,54" fill="url(#facetLeft)" />
          {/* Lower Bottom Right Facet */}
          <Polygon points="28,24 54,24 32,54" fill="url(#facetRight)" />
        </G>

        {/* Highlight Specular Star */}
        <Polygon points="32,14 33.5,18 38,19.5 33.5,21 32,25 30.5,21 26,19.5 30.5,18" fill="#FFFFFF" opacity="0.95" />
      </Svg>
    </GameVisual>
  );
}
