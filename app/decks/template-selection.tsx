import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function TemplateSelectionScreen() {
  const params = useLocalSearchParams();

  useEffect(() => {
    router.replace({
      pathname: '/templates' as any,
      params: { 
        mode: 'PICK_FOR_DECK', 
        deckId: params.deckId || 'd1', 
        currentTemplateId: params.currentTemplateId || 'sys_classic' 
      }
    });
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-[#F7F8FA]">
      <ActivityIndicator size="large" color="#58CC02" />
    </View>
  );
}
