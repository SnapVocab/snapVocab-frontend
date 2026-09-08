import React from 'react';
import { SnapVocabVisualSize } from './core/SnapVocabVisualSize';
import { Coin3D } from './rewards/Coin3D';
import { XPOrb3D } from './rewards/XPOrb3D';
import { StreakFlame3D } from './streak/StreakFlame3D';
import { RewardChest3D } from './rewards/RewardChest3D';
import { Gem3D } from './rewards/Gem3D';
import { RewardGift3D } from './rewards/RewardGift3D';
import { AchievementTrophy3D } from './achievements/AchievementTrophy3D';
import { MasteredBadge3D } from './achievements/MasteredBadge3D';
import { StyleProp, ViewStyle } from 'react-native';

export type RewardType = 'coin' | 'xp' | 'streak' | 'chest' | 'gem' | 'gift' | 'trophy' | 'star';

export interface RewardIconProps {
  type?: RewardType;
  size?: SnapVocabVisualSize;
  amount?: number;
  animation?: 'none' | 'pulse' | 'bounce' | 'shine' | 'spin' | 'float';
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

export function RewardIcon({
  type = 'coin',
  size = 'md',
  amount,
  animation = 'none',
  style,
  testID,
  accessibilityLabel,
}: RewardIconProps) {
  switch (type) {
    case 'xp':
    case 'star':
      return <XPOrb3D size={size} animation={animation === 'pulse' || animation === 'float' ? animation : 'none'} style={style} testID={testID} accessibilityLabel={accessibilityLabel} />;
    case 'streak':
      return <StreakFlame3D size={size} animation={animation === 'pulse' || animation === 'bounce' ? animation : 'none'} style={style} testID={testID} accessibilityLabel={accessibilityLabel} />;
    case 'chest':
      return <RewardChest3D size={size} animation={animation === 'bounce' || animation === 'shine' ? animation : 'none'} style={style} testID={testID} accessibilityLabel={accessibilityLabel} />;
    case 'gem':
      return <Gem3D size={size} style={style} testID={testID} accessibilityLabel={accessibilityLabel} />;
    case 'gift':
      return <RewardGift3D size={size} animation={animation === 'bounce' || animation === 'shine' ? animation : 'none'} style={style} testID={testID} accessibilityLabel={accessibilityLabel} />;
    case 'trophy':
      return <AchievementTrophy3D size={size} style={style} testID={testID} accessibilityLabel={accessibilityLabel} />;
    case 'coin':
    default:
      return <Coin3D size={size} amount={amount} animation={animation === 'spin' || animation === 'bounce' ? animation : 'none'} style={style} testID={testID} accessibilityLabel={accessibilityLabel} />;
  }
}
