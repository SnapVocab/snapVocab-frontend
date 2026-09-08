import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, LayoutAnimation, UIManager, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon, FlameIcon, ArrowRightIcon } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// ==========================================
// MOCK DATA
// ==========================================
type ChildTopic = { id: string; title: string; wordCount: number; progress: number; };
type ParentTopic = { id: string; title: string; wordCount: number; progress: number; children: ChildTopic[]; };
type Collection = { id: string; title: string; emoji: string; topicCount: number; topics: ParentTopic[]; };

const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'c1',
    title: 'Du lịch',
    emoji: '🌍',
    topicCount: 12,
    topics: [
      {
        id: 't1',
        title: 'Sân bay',
        wordCount: 72,
        progress: 42,
        children: [
          { id: 't1_1', title: 'Check-in', wordCount: 18, progress: 60 },
          { id: 't1_2', title: 'An ninh sân bay', wordCount: 22, progress: 35 },
          { id: 't1_3', title: 'Lên máy bay', wordCount: 32, progress: 0 },
        ]
      },
      {
        id: 't2',
        title: 'Khách sạn',
        wordCount: 45,
        progress: 0,
        children: [
          { id: 't2_1', title: 'Nhận phòng', wordCount: 15, progress: 0 },
          { id: 't2_2', title: 'Tiện nghi', wordCount: 20, progress: 0 },
          { id: 't2_3', title: 'Trả phòng', wordCount: 10, progress: 0 },
        ]
      },
      {
        id: 't3',
        title: 'Chuẩn bị chuyến đi',
        wordCount: 20,
        progress: 80,
        children: []
      }
    ]
  },
  {
    id: 'c2',
    title: 'Công việc',
    emoji: '💼',
    topicCount: 10,
    topics: [
      {
        id: 't4',
        title: 'Phỏng vấn',
        wordCount: 30,
        progress: 10,
        children: []
      }
    ]
  },
  {
    id: 'c3',
    title: 'Học thuật',
    emoji: '🎓',
    topicCount: 8,
    topics: []
  }
];

export default function TopicsScreen() {
  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({});
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  const toggleCollection = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCollections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTopic = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedTopics(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartLearning = (topicId: string) => {
    // Navigate to learning flow (Mock implementation)
    console.log("Start learning topic:", topicId);
    // router.push(`/learn/${topicId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      <View className="flex-row items-center justify-between px-4 py-3 bg-white z-10 border-b border-neutral-100">
        <Pressable 
          onPress={() => router.back()} 
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100 -ml-2"
        >
          <ChevronLeftIcon size={28} className="text-mascot-navy" />
        </Pressable>
        <View className="flex-1 items-center">
          <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">Chủ đề</Text>
          <Text className="font-bold text-[13px] text-neutral-400 font-inter">Khám phá chủ đề học tập</Text>
        </View>
        <View className="w-10 h-10" />
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        

        <View className="px-4 mt-6 mb-8">
          <View className="bg-primary-50 rounded-[24px] p-5 border-2 border-primary-200 border-b-[4px] shadow-sm shadow-black/5 relative overflow-hidden">
            <View className="absolute -right-4 -bottom-4 opacity-10">
              <FlameIcon size={120} className="text-primary-500" />
            </View>
            
            <View className="flex-row items-center gap-1.5 mb-2">
              <FlameIcon size={18} fill="#FF8A00" className="text-mascot-500" />
              <Text className="font-extrabold text-[13px] text-primary-600 uppercase tracking-widest font-nunito">ĐỀ XUẤT CHO BẠN</Text>
            </View>
            
            <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito mb-1">Giao tiếp hằng ngày</Text>
            <Text className="font-medium text-[15px] text-neutral-500 font-inter mb-5">15 chủ đề · 180 từ</Text>
            
            <Pressable className="h-12 bg-primary-500 rounded-xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all flex-row items-center justify-center w-full max-w-[200px]">
              <Text className="text-white font-extrabold text-[15px] uppercase font-nunito tracking-[0.04em]">KHÁM PHÁ NGAY</Text>
            </Pressable>
          </View>
        </View>


        <View className="px-4">
          <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-4 px-1">Tất cả Bộ sưu tập</Text>

          {MOCK_COLLECTIONS.map(collection => {
            const isCollectionExpanded = expandedCollections[collection.id];

            return (
              <View key={collection.id} className="mb-4">
                

                <Pressable 
                  onPress={() => toggleCollection(collection.id)}
                  className={cn(
                    "bg-white p-5 border border-neutral-100 shadow-sm shadow-black/5 active:bg-neutral-50 transition-all flex-row items-center justify-between",
                    isCollectionExpanded ? "rounded-t-[24px] border-b-neutral-100" : "rounded-[24px]"
                  )}
                >
                  <View className="flex-row items-center gap-4">
                    <View className="w-14 h-14 bg-neutral-50 rounded-2xl items-center justify-center border border-neutral-100">
                      <Text className="text-[28px]">{collection.emoji}</Text>
                    </View>
                    <View>
                      <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-0.5">{collection.title}</Text>
                      <Text className="font-medium text-[14px] text-neutral-400 font-inter">{collection.topicCount} chủ đề</Text>
                    </View>
                  </View>
                  <View className="w-8 h-8 rounded-full bg-neutral-50 items-center justify-center">
                    {isCollectionExpanded ? (
                      <ChevronUpIcon size={20} className="text-neutral-500" />
                    ) : (
                      <ChevronDownIcon size={20} className="text-neutral-500" />
                    )}
                  </View>
                </Pressable>


                {isCollectionExpanded && (
                  <View className="bg-white rounded-b-[24px] border border-t-0 border-neutral-100 shadow-sm shadow-black/5 overflow-hidden">
                    
                    {collection.topics.length === 0 ? (
                      <View className="py-8 items-center justify-center border-t border-neutral-100">
                        <Snapy pose="kham_pha" animation="idle" className="w-20 h-20 mb-3 opacity-90" />
                        <Text className="font-bold text-[14px] text-neutral-400 font-inter">Chưa có chủ đề nào</Text>
                      </View>
                    ) : (
                      collection.topics.map((topic, index) => {
                        const isTopicExpanded = expandedTopics[topic.id];
                        const hasChildren = topic.children && topic.children.length > 0;

                        return (
                          <View key={topic.id} className={cn("border-neutral-100", index !== 0 && "border-t")}>
                            

                            <Pressable 
                              onPress={() => hasChildren ? toggleTopic(topic.id) : handleStartLearning(topic.id)}
                              className="px-5 py-4 bg-white active:bg-neutral-50 flex-row items-center justify-between"
                            >
                              <View className="flex-1 pr-4">
                                <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-1.5">{topic.title}</Text>
                                <View className="flex-row items-center gap-3">
                                  <Text className="font-medium text-[13px] text-neutral-500 font-inter">{topic.wordCount} từ</Text>
                                  

                                  {topic.progress > 0 ? (
                                    <View className="flex-1 flex-row items-center gap-2 max-w-[120px]">
                                      <View className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                        <View 
                                          className="h-full bg-primary-500 rounded-full" 
                                          style={{ width: `${topic.progress}%` }}
                                        />
                                      </View>
                                      <Text className="font-bold text-[12px] text-primary-600 font-inter">{topic.progress}%</Text>
                                    </View>
                                  ) : (
                                    <View className="bg-neutral-100 px-2 py-0.5 rounded text-center">
                                      <Text className="font-bold text-[11px] text-neutral-500 font-inter uppercase">Chưa học</Text>
                                    </View>
                                  )}
                                </View>
                              </View>
                              
                              <View className="w-8 h-8 rounded-full items-center justify-center">
                                {hasChildren ? (
                                  isTopicExpanded ? (
                                    <ChevronUpIcon size={20} className="text-neutral-400" />
                                  ) : (
                                    <ChevronDownIcon size={20} className="text-neutral-400" />
                                  )
                                ) : (
                                  <View className="w-8 h-8 rounded-full bg-primary-50 items-center justify-center">
                                    <ArrowRightIcon size={16} className="text-primary-500" />
                                  </View>
                                )}
                              </View>
                            </Pressable>


                            {hasChildren && isTopicExpanded && (
                              <View className="bg-neutral-50 pb-2">
                                {topic.children.map((child, childIndex) => (
                                  <Pressable 
                                    key={child.id}
                                    onPress={() => handleStartLearning(child.id)}
                                    className={cn(
                                      "pl-10 pr-5 py-3 flex-row items-center justify-between active:bg-neutral-100",
                                      childIndex !== 0 && "border-t border-neutral-200/50"
                                    )}
                                  >
                                    <View className="flex-1 pr-4">
                                      <Text className="font-bold text-[15px] text-mascot-navy font-inter mb-0.5">{child.title}</Text>
                                      <Text className="font-medium text-[13px] text-neutral-400 font-inter">{child.wordCount} từ</Text>
                                    </View>
                                    
                                    <View className="items-end justify-center min-w-[50px]">
                                      {child.progress > 0 ? (
                                        <Text className="font-extrabold text-[14px] text-primary-600 font-nunito">{child.progress}%</Text>
                                      ) : (
                                        <Text className="font-medium text-[12px] text-neutral-400 font-inter italic">Chưa học</Text>
                                      )}
                                    </View>
                                  </Pressable>
                                ))}
                              </View>
                            )}
                            
                          </View>
                        );
                      })
                    )}
                  </View>
                )}
              </View>
            );
          })}

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
