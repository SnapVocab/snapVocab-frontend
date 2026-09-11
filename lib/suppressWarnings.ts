import { LogBox, Platform } from 'react-native';

/**
 * Filter known Web-specific deprecation warnings in React Native Web:
 * 1. "shadow*" style props are deprecated. Use "boxShadow".
 * 2. Animated: `useNativeDriver` is not supported because the native animated module is missing.
 */
if (Platform.OS === 'web' && typeof console !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const message = typeof args[0] === 'string' ? args[0] : '';
    if (
      message.includes('"shadow*" style props are deprecated') ||
      message.includes('Use "boxShadow"') ||
      message.includes('useNativeDriver is not supported') ||
      message.includes('useNativeDriver` is not supported')
    ) {
      return;
    }
    originalWarn(...args);
  };
}

// Ignore warnings in React Native LogBox
LogBox.ignoreLogs([
  '[Reanimated] Writing to `value` during component render',
  'setLayoutAnimationEnabledExperimental is currently a no-op in the New Architecture.',
  '[expo-image-picker] `ImagePicker.MediaTypeOptions` have been deprecated.',
  '"shadow*" style props are deprecated. Use "boxShadow".',
  'Animated: `useNativeDriver` is not supported because the native animated module is missing.',
  'useNativeDriver',
]);
