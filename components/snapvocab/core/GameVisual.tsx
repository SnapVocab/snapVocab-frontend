import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { SnapVocabVisualSize, resolveVisualSize } from './SnapVocabVisualSize';

export interface GameVisualProps {
  size?: SnapVocabVisualSize;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  testID?: string;
  accessibilityLabel?: string;
}

/**
 * GameVisual is the future-proof container abstraction wrapping all SnapVocab 3D / gamified visual elements.
 * Screen code relies on GameVisual without needing to know if the underlying renderer is SVG, PNG, Lottie, or Rive.
 */
export function GameVisual({
  size = 'md',
  style,
  children,
  testID,
  accessibilityLabel,
}: GameVisualProps) {
  const numericSize = resolveVisualSize(size);

  return (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          width: numericSize,
          height: numericSize,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
