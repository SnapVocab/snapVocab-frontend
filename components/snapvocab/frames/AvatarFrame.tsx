import React, { useMemo } from 'react';
import { View, Image, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { getAvatarFrame, AvatarFrameDefinition } from './avatarFrameCatalog';

export type AvatarFrameSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero' | number;

const SIZE_PRESETS: Record<string, number> = {
  xs: 36,
  sm: 48,
  md: 72,
  lg: 96,
  xl: 128,
  hero: 160,
};

export interface AvatarFrameProps {
  /** ID of the avatar frame (e.g. 'frame_fire_streak', 'frame_night_owl') */
  frameId?: string | null;
  /** Remote image URI for user avatar */
  avatarUri?: string | null;
  /** Local require(...) source for mascot or bundled avatar */
  avatarSource?: any;
  /** Fallback initials text when no avatar image exists (e.g. 'SN') */
  initials?: string;
  /** Size preset or numeric pixel dimension */
  size?: AvatarFrameSize;
  /** Whether to play the looping animated WebP or use static PNG (default: true) */
  animated?: boolean;
  /** Whether to render the ambient neon glow effect matching frame colors (default: true) */
  showGlow?: boolean;
  /** Optional badge element at bottom right (e.g. level, rank or streak flame) */
  badgeComponent?: React.ReactNode;
  /** Press handler */
  onPress?: () => void;
  /** Custom children to render inside the avatar aperture */
  children?: React.ReactNode;
  /** Additional container style */
  style?: StyleProp<ViewStyle>;
  /** Tailwind / className */
  className?: string;
}

export const AvatarFrame: React.FC<AvatarFrameProps> = ({
  frameId,
  avatarUri,
  avatarSource,
  initials = 'SV',
  size = 'md',
  animated = true,
  showGlow = true,
  badgeComponent,
  onPress,
  children,
  style,
  className = '',
}) => {
  const dimension = typeof size === 'number' ? size : SIZE_PRESETS[size] || 72;
  const frameMeta: AvatarFrameDefinition | undefined = useMemo(
    () => getAvatarFrame(frameId),
    [frameId]
  );

  // The circular avatar aperture occupies ~58% of the frame canvas (512x512)
  // When no frame is equipped, the avatar fills 88% of the dimension
  const avatarDiameter = frameMeta ? Math.round(dimension * 0.58) : Math.round(dimension * 0.88);
  const avatarBorderRadius = Math.round(avatarDiameter / 2);

  // Selected frame source: animated WebP or static PNG
  const frameSource = useMemo(() => {
    if (!frameMeta) return null;
    return animated ? frameMeta.webpSource : frameMeta.pngSource;
  }, [frameMeta, animated]);

  const content = (
    <View
      style={[
        styles.container,
        { width: dimension, height: dimension },
        style,
      ]}
      className={className}
    >
      {/* 1. AMBIENT GLOW (Behind Avatar) */}
      {showGlow && frameMeta && (
        <View
          style={[
            styles.glowEffect,
            {
              width: dimension * 0.85,
              height: dimension * 0.85,
              borderRadius: (dimension * 0.85) / 2,
              backgroundColor: frameMeta.glowColor,
            },
          ]}
        />
      )}

      {/* 2. INNER AVATAR CIRCLE */}
      <View
        style={[
          styles.avatarWrapper,
          {
            width: avatarDiameter,
            height: avatarDiameter,
            borderRadius: avatarBorderRadius,
            backgroundColor: frameMeta ? '#0F172A' : '#3B82F6',
          },
        ]}
      >
        {children ? (
          children
        ) : avatarSource ? (
          <Image
            source={avatarSource}
            style={{ width: avatarDiameter, height: avatarDiameter, borderRadius: avatarBorderRadius }}
            resizeMode="cover"
          />
        ) : avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            style={{ width: avatarDiameter, height: avatarDiameter, borderRadius: avatarBorderRadius }}
            resizeMode="cover"
          />
        ) : (
          <Text
            style={[
              styles.initialsText,
              { fontSize: Math.max(10, Math.round(avatarDiameter * 0.38)) },
            ]}
          >
            {initials}
          </Text>
        )}
      </View>

      {/* 3. OVERLAY FRAME (PNG or Animated WebP with transparent center) */}
      {frameSource && (
        <Image
          source={frameSource}
          style={[
            styles.frameOverlay,
            { width: dimension, height: dimension },
          ]}
          resizeMode="contain"
        />
      )}

      {/* 4. OPTIONAL BADGE (Bottom Right) */}
      {badgeComponent && (
        <View style={styles.badgeContainer}>
          {badgeComponent}
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1.0 })}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowEffect: {
    position: 'absolute',
    opacity: 0.85,
    transform: [{ scale: 1.05 }],
  },
  avatarWrapper: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  initialsText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  frameOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    pointerEvents: 'none',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    zIndex: 3,
  },
});
