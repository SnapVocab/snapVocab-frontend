import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpenIcon,
  LayersIcon,
  RepeatIcon,
  AlertCircleIcon,
  XIcon,
  PlusIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// ==========================================
// MOCK DATA
// ==========================================
const SUMMARY_DATA = {
  totalWords: 128,
  totalDecks: 4,
  dueCards: 12
};

const MOCK_DECKS = [
  {
    id: 'd1',
    name: 'English Basics',
    emoji: '📚',
    noteCount: 42,
    template: 'CLASSIC',
    dueCount: 8
  },
  {
    id: 'd2',
    name: 'Travel English',
    emoji: '✈️',
    noteCount: 86,
    template: 'LISTENING',
    dueCount: 12
  },
  {
    id: 'd3',
    name: 'Daily Conversation',
    emoji: '💬',
    noteCount: 35,
    template: 'CLASSIC',
    dueCount: 0
  },
  {
    id: 'd4',
    name: 'Business English',
    emoji: '💼',
    noteCount: 64,
    template: 'SPEAKING',
    dueCount: 5
  },
  {
    id: 'd5',
    name: 'New Vocabulary',
    emoji: '✨',
    noteCount: 0,
    template: 'CLASSIC',
    dueCount: 0
  }
];

export default function MyVocabularyScreen() {
  const [decks, setDecks] = useState(MOCK_DECKS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');

  const handleCreateDeck = () => {
    if (newDeckName.trim()) {
      setDecks([{
        id: `d${Date.now()}`,
        name: newDeckName.trim(),
        emoji: '📘',
        noteCount: 0,
        template: 'CLASSIC',
        dueCount: 0
      }, ...decks]);
      setNewDeckName('');
      setIsCreateModalOpen(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* 1. HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white z-10 border-b border-neutral-100">
        <Pressable 
          onPress={() => router.back()} 
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100 -ml-2"
        >
          <ChevronLeftIcon size={28} className="text-mascot-navy" />
        </Pressable>
        <View className="flex-1 items-center">
          <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">Từ vựng của tôi</Text>
          <Text className="font-bold text-[13px] text-neutral-400 font-inter">Quản lý Deck và ôn tập</Text>
        </View>
        <View className="w-10 h-10" />
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        
        {/* 2. SUMMARY STATISTICS */}
        {decks.length > 0 && (
          <View className="flex-row items-center justify-between px-5 mt-6 mb-8 gap-3">
            <View className="flex-1 bg-white p-3 rounded-[16px] border border-neutral-100 shadow-sm shadow-black/5 items-center">
              <BookOpenIcon size={20} className="text-info-500 mb-1.5" />
              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito tabular-nums">{SUMMARY_DATA.totalWords}</Text>
              <Text className="font-bold text-[12px] text-neutral-400 font-inter mt-0.5">Tổng từ</Text>
            </View>
            <View className="flex-1 bg-white p-3 rounded-[16px] border border-neutral-100 shadow-sm shadow-black/5 items-center">
              <LayersIcon size={20} className="text-primary-500 mb-1.5" />
              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito tabular-nums">{decks.length}</Text>
              <Text className="font-bold text-[12px] text-neutral-400 font-inter mt-0.5">Deck</Text>
            </View>
            <View className="flex-1 bg-white p-3 rounded-[16px] border border-warning-200 bg-warning-50 shadow-sm shadow-warning-500/10 items-center">
              <RepeatIcon size={20} className="text-warning-500 mb-1.5" />
              <Text className="font-extrabold text-[18px] text-warning-700 font-nunito tabular-nums">{SUMMARY_DATA.dueCards}</Text>
              <Text className="font-bold text-[12px] text-warning-600 font-inter mt-0.5">Đến hạn</Text>
            </View>
          </View>
        )}

        {/* 3. SECTION TITLE & CREATE BUTTON */}
        <View className="px-4 mb-4 flex-row items-center justify-between">
          <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito px-1">Deck của tôi</Text>
          <Pressable 
            onPress={() => setIsCreateModalOpen(true)}
            className="flex-row items-center gap-1.5 bg-primary-100 px-3 py-1.5 rounded-xl active:bg-primary-200 transition-all"
          >
            <PlusIcon size={16} className="text-primary-600" />
            <Text className="font-extrabold text-[13px] text-primary-600 font-nunito uppercase tracking-wide">Tạo Deck</Text>
          </Pressable>
        </View>

        {/* 4. DECK LIST */}
        <View className="px-4 gap-4">
          {decks.length === 0 ? (
            <View className="bg-white rounded-[24px] border-2 border-neutral-100 border-b-[4px] p-8 items-center justify-center mt-4">
              <Snapy pose="chao_mung" animation="wave" className="w-28 h-28 mb-4" />
              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-1.5 text-center">Chưa có Deck nào</Text>
              <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center mb-6">Tạo Deck đầu tiên và bắt đầu lưu từ vựng ngay nhé!</Text>
              <Pressable 
                onPress={() => setIsCreateModalOpen(true)}
                className="w-full h-12 bg-primary-500 rounded-xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center"
              >
                <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-wide">TẠO DECK MỚI</Text>
              </Pressable>
            </View>
          ) : (
            decks.map(deck => (
              <Pressable 
                key={deck.id}
                onPress={() => router.push(`/decks/${deck.id}`)}
                className="bg-white rounded-[20px] p-5 border-2 border-neutral-100 border-b-[4px] shadow-sm shadow-black/5 active:bg-neutral-50 active:translate-y-[2px] active:border-b-[2px] transition-all"
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1 pr-4">
                    <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-1" numberOfLines={1}>
                      {deck.emoji} {deck.name}
                    </Text>
                    <Text className="font-medium text-[14px] text-neutral-500 font-inter">{deck.noteCount} từ</Text>
                  </View>
                  <View className="w-8 h-8 rounded-full bg-neutral-50 items-center justify-center">
                    <ChevronRightIcon size={20} className="text-neutral-400" />
                  </View>
                </View>

                <View className="flex-row items-center justify-between mt-2 pt-3 border-t border-neutral-100">
                  {/* Template Badge */}
                  <View className="bg-neutral-100 px-2.5 py-1 rounded-md">
                    <Text className="font-bold text-[11px] text-neutral-500 font-inter uppercase tracking-wider">{deck.template}</Text>
                  </View>

                  {/* Due Status */}
                  {deck.dueCount > 0 ? (
                    <View className="flex-row items-center gap-1.5">
                      <AlertCircleIcon size={14} className="text-warning-500" />
                      <Text className="font-bold text-[13px] text-warning-600 font-inter">{deck.dueCount} từ đến hạn</Text>
                    </View>
                  ) : (
                    <Text className="font-medium text-[13px] text-neutral-400 font-inter italic">Không có từ đến hạn</Text>
                  )}
                </View>
              </Pressable>
            ))
          )}
        </View>

      </ScrollView>

      {/* 5. CREATE DECK MODAL */}
      <Modal
        visible={isCreateModalOpen}
        transparent
        animationType="fade"
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 bg-black/40 justify-end"
        >
          <View className="bg-white rounded-t-[32px] p-6 pb-12 shadow-xl shadow-black/20">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">Tạo Deck mới</Text>
              <Pressable 
                onPress={() => setIsCreateModalOpen(false)}
                className="w-10 h-10 bg-neutral-100 rounded-full items-center justify-center active:bg-neutral-200"
              >
                <XIcon size={20} className="text-neutral-500" />
              </Pressable>
            </View>

            <View className="mb-6">
              <Text className="font-bold text-[14px] text-neutral-500 font-inter mb-2">Tên Deck</Text>
              <TextInput 
                value={newDeckName}
                onChangeText={setNewDeckName}
                placeholder="VD: Tiếng Anh giao tiếp..."
                placeholderTextColor="#9597AD"
                autoFocus
                className="h-14 bg-neutral-50 border-2 border-neutral-100 rounded-2xl px-4 font-inter text-[16px] text-mascot-navy font-medium focus:border-primary-400 focus:bg-primary-50 transition-all"
              />
            </View>

            <Pressable 
              onPress={handleCreateDeck}
              disabled={!newDeckName.trim()}
              className={cn(
                "h-14 rounded-2xl border-b-[4px] items-center justify-center flex-row transition-all",
                newDeckName.trim() 
                  ? "bg-primary-500 border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px]" 
                  : "bg-neutral-200 border-neutral-300"
              )}
            >
              <Text className={cn(
                "font-extrabold text-[16px] uppercase font-nunito tracking-wide",
                newDeckName.trim() ? "text-white" : "text-neutral-400"
              )}>
                TẠO DECK
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}
