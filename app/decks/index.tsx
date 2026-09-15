import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

/**
 * Backward compatibility wrapper:
 * Chuyển hướng người dùng từ /decks cũ sang /collections mới
 */
export default function DecksRedirectScreen() {
  useEffect(() => {
    router.replace('/collections' as any);
  }, []);

  return (
    <View className="flex-1 bg-[#F8FAFC] items-center justify-center">
      <ActivityIndicator size="small" color="#3525cd" />
    </View>
  );
}
