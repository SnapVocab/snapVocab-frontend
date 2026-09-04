import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeftIcon,
  CheckCircle2Icon,
  LockIcon,
  Volume2Icon,
  ImageIcon,
  TypeIcon,
  QuoteIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_DECK = {
  id: 'd1',
  name: 'English Basics',
  currentTemplateId: 'CLASSIC'
};

const SYSTEM_TEMPLATES = [
  {
    id: 'CLASSIC',
    name: 'CLASSIC',
    description: 'Hiển thị từ ở mặt trước và nghĩa ở mặt sau.',
    renderPreview: () => (
      <View className="flex-row items-stretch bg-white border border-neutral-100 rounded-xl overflow-hidden mt-2">
        <View className="flex-1 p-3 items-center justify-center bg-neutral-50 border-r border-neutral-100">
          <Text className="font-extrabold text-[14px] text-mascot-navy">abandon</Text>
        </View>
        <View className="flex-1 p-3 items-center justify-center">
          <Text className="font-bold text-[14px] text-primary-600">từ bỏ</Text>
        </View>
      </View>
    )
  },
  {
    id: 'REVERSE',
    name: 'REVERSE',
    description: 'Hiển thị nghĩa trước, từ vựng ở mặt sau.',
    renderPreview: () => (
      <View className="flex-row items-stretch bg-white border border-neutral-100 rounded-xl overflow-hidden mt-2">
        <View className="flex-1 p-3 items-center justify-center bg-neutral-50 border-r border-neutral-100">
          <Text className="font-bold text-[14px] text-primary-600">từ bỏ</Text>
        </View>
        <View className="flex-1 p-3 items-center justify-center">
          <Text className="font-extrabold text-[14px] text-mascot-navy">abandon</Text>
        </View>
      </View>
    )
  },
  {
    id: 'LISTENING',
    name: 'LISTENING',
    description: 'Nghe phát âm và đoán từ vựng.',
    renderPreview: () => (
      <View className="flex-row items-stretch bg-white border border-neutral-100 rounded-xl overflow-hidden mt-2">
        <View className="flex-1 p-3 items-center justify-center bg-info-50 border-r border-neutral-100">
          <Volume2Icon size={20} className="text-info-500" />
        </View>
        <View className="flex-1 p-3 items-center justify-center">
          <Text className="font-extrabold text-[14px] text-mascot-navy">abandon</Text>
        </View>
      </View>
    )
  },
  {
    id: 'IMAGE_VOCAB',
    name: 'IMAGE_VOCAB',
    description: 'Sử dụng hình ảnh để gợi nhớ từ vựng.',
    renderPreview: () => (
      <View className="flex-row items-stretch bg-white border border-neutral-100 rounded-xl overflow-hidden mt-2">
        <View className="flex-1 p-3 items-center justify-center bg-warning-50 border-r border-neutral-100">
          <ImageIcon size={20} className="text-warning-500" />
        </View>
        <View className="flex-1 p-3 items-center justify-center">
          <Text className="font-extrabold text-[14px] text-mascot-navy">abandon</Text>
        </View>
      </View>
    )
  },
  {
    id: 'SPELLING',
    name: 'SPELLING',
    description: 'Nhìn nghĩa và nhập cách viết của từ.',
    renderPreview: () => (
      <View className="flex-row items-stretch bg-white border border-neutral-100 rounded-xl overflow-hidden mt-2">
        <View className="flex-1 p-3 items-center justify-center bg-neutral-50 border-r border-neutral-100">
          <Text className="font-bold text-[14px] text-primary-600 mb-1">từ bỏ</Text>
          <View className="w-full h-1 bg-neutral-200 rounded-full" />
        </View>
        <View className="flex-1 p-3 items-center justify-center">
          <Text className="font-extrabold text-[14px] text-mascot-navy">abandon</Text>
        </View>
      </View>
    )
  },
  {
    id: 'CONTEXT',
    name: 'CONTEXT',
    description: 'Học từ thông qua câu ví dụ và ngữ cảnh.',
    renderPreview: () => (
      <View className="flex-row items-stretch bg-white border border-neutral-100 rounded-xl overflow-hidden mt-2">
        <View className="flex-1 p-3 items-center justify-center bg-neutral-50 border-r border-neutral-100">
          <QuoteIcon size={14} className="text-neutral-400 absolute top-2 left-2 opacity-50" />
          <Text className="font-medium text-[12px] text-neutral-600 text-center">She decided to ______ the project.</Text>
        </View>
        <View className="flex-1 p-3 items-center justify-center">
          <Text className="font-extrabold text-[14px] text-mascot-navy">abandon</Text>
        </View>
      </View>
    )
  }
];

export default function TemplateSelectionScreen() {
  const [selectedId, setSelectedId] = useState(MOCK_DECK.currentTemplateId);

  const handleApply = () => {
    // Show success alert and go back
    Alert.alert(
      "Thành công", 
      `Đã áp dụng template ${selectedId} cho Deck ✓`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* 1. HEADER */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-neutral-100 z-10">
        <Pressable 
          onPress={() => router.back()} 
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100 -ml-2"
        >
          <ArrowLeftIcon size={24} className="text-mascot-navy" />
        </Pressable>
        <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito flex-1 text-center pr-8">Template Card</Text>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. INTRO SECTION */}
        <View className="mb-6">
          <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito mb-1">Chọn mẫu Card</Text>
          <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-3">
            Chọn cách bạn muốn hiển thị từ vựng trong Deck này.
          </Text>
          <View className="bg-primary-50 px-3 py-1.5 rounded-lg self-start border border-primary-100">
            <Text className="font-bold text-[13px] text-primary-700 font-inter">📚 {MOCK_DECK.name}</Text>
          </View>
        </View>

        {/* 3. TEMPLATE LIST */}
        <View className="gap-4">
          {SYSTEM_TEMPLATES.map((tpl) => {
            const isSelected = selectedId === tpl.id;
            const isCurrent = MOCK_DECK.currentTemplateId === tpl.id;

            return (
              <Pressable 
                key={tpl.id}
                onPress={() => setSelectedId(tpl.id)}
                className={cn(
                  "bg-white rounded-[20px] p-5 border-2 transition-all shadow-sm shadow-black/5",
                  isSelected 
                    ? "border-primary-500 bg-primary-50/50" 
                    : "border-neutral-100 active:bg-neutral-50 active:translate-y-[2px]"
                )}
              >
                {/* Header */}
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className={cn(
                        "font-extrabold text-[18px] font-nunito",
                        isSelected ? "text-primary-700" : "text-mascot-navy"
                      )}>
                        {tpl.name}
                      </Text>
                      {isCurrent && (
                        <View className="bg-success-100 px-2 py-0.5 rounded flex-row items-center gap-1">
                          <Text className="font-bold text-[10px] text-success-700 font-inter uppercase">Đang sử dụng</Text>
                        </View>
                      )}
                    </View>
                    <Text className="font-medium text-[13px] text-neutral-500 font-inter leading-tight">
                      {tpl.description}
                    </Text>
                  </View>
                  
                  <View className={cn(
                    "w-6 h-6 rounded-full border-2 items-center justify-center ml-2",
                    isSelected ? "bg-primary-500 border-primary-500" : "border-neutral-200"
                  )}>
                    {isSelected && <CheckCircle2Icon size={14} className="text-white" />}
                  </View>
                </View>

                {/* System Badge */}
                <View className="flex-row items-center gap-1 mb-3 opacity-60">
                  <LockIcon size={12} className="text-neutral-400" />
                  <Text className="font-bold text-[11px] text-neutral-400 font-inter uppercase tracking-wide">System Template</Text>
                </View>

                {/* Mini Preview */}
                {tpl.renderPreview()}

              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* 4. BOTTOM CTA */}
      <View className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-neutral-100">
        <Pressable 
          onPress={handleApply}
          disabled={selectedId === MOCK_DECK.currentTemplateId}
          className={cn(
            "w-full h-14 rounded-2xl transition-all items-center justify-center flex-row gap-2",
            selectedId !== MOCK_DECK.currentTemplateId
              ? "bg-primary-500 border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px]"
              : "bg-neutral-200 border-b-[4px] border-neutral-300"
          )}
        >
          <Text className={cn(
            "font-extrabold text-[16px] uppercase font-nunito tracking-wide",
            selectedId !== MOCK_DECK.currentTemplateId ? "text-white" : "text-neutral-400"
          )}>
            ÁP DỤNG CHO DECK
          </Text>
        </Pressable>
      </View>

    </SafeAreaView>
  );
}
