import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

/**
 * Backward compatibility wrapper:
 * Chuyển hướng người dùng từ /decks/:id cũ sang /collections/:id mới
 */
export default function DeckDetailRedirectScreen() {
  const params = useLocalSearchParams();
  const id = params.id;

  useEffect(() => {
    if (id) {
      router.replace(`/collections/${id}` as any);
    } else {
      router.replace('/collections' as any);
    }
  }, [id]);

  return (
    <View className="flex-1 bg-[#F8FAFC] items-center justify-center">
      <ActivityIndicator size="small" color="#3525cd" />
    </View>
  );
}
