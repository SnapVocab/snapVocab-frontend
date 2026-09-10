import '@/global.css';

import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';

import { LogBox } from 'react-native';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

// Tắt strict mode của Reanimated để không hiện cảnh báo ghi vào shared value trong lúc render
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// Bỏ qua cảnh báo hiển thị trên giao diện (LogBox banner / toast)
LogBox.ignoreLogs([
  '[Reanimated] Writing to `value` during component render',
  'setLayoutAnimationEnabledExperimental is currently a no-op in the New Architecture.',
  '[expo-image-picker] `ImagePicker.MediaTypeOptions` have been deprecated.',
]);

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
      <PortalHost />
    </>
  );
}
