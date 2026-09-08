import React from 'react';
import Svg, { Circle, Path, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';
import { GameVisual, GameVisualProps } from '../core/GameVisual';
import { resolveVisualSize } from '../core/SnapVocabVisualSize';

export interface MasteredBadge3DProps extends GameVisualProps {
  state?: 'completed' | 'in_progress';
}

export function MasteredBadge3D({
  size = 'md',
  state = 'completed',
  style,
  testID,
  accessibilityLabel = 'Mastered Badge',
}: MasteredBadge3DProps) {
  const numericSize = resolveVisualSize(size);

  return (
    <GameVisual size={size} style={style} testID={testID} accessibilityLabel={accessibilityLabel}>
      <Svg width={numericSize} height={numericSize} viewBox="0 0 64 64" fill="none">
        <Defs>
          <RadialGradient id="masteredGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#58CC02" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#15803D" stopOpacity="0" />
          </RadialGradient>

          <LinearGradient id="masteredGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#85E043" />
            <Stop offset="50%" stopColor="#58CC02" />
            <Stop offset="100%" stopColor="#22C55E" />
          </LinearGradient>
        </Defs>

        <Circle cx="32" cy="32" r="28" fill="url(#masteredGlow)" />
        <Circle cx="32" cy="32" r="24" fill="url(#masteredGrad)" stroke="#15803D" strokeWidth="2" />
        <Circle cx="32" cy="32" r="20" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />

        {/* Thick Crisp White Checkmark */}
        <Path
          d="M20 32 L28 40 L44 22"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </GameVisual>
  );
}
