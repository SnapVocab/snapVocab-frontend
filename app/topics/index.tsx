import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, LayoutAnimation, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ChevronLeftIcon, 
  ChevronDownIcon, 
  ChevronUpIcon, 
  FlameIcon, 
  ArrowRightIcon,
  SearchIcon,
  XIcon,
  SparklesIcon,
  BookOpenIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// ==========================================
// MOCK DATA
// ==========================================
type ChildTopic = { id: string; title: string; wordCount: number; progress: number; };
type ParentTopic = { id: string; title: string; wordCount: number; progress: number; children: ChildTopic[]; };
type Collection = { id: string; title: string; emoji: string; topicCount: number; topics: ParentTopic[]; };

const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'c1',
    title: 'Du lịch & Khám phá',
    emoji: '🌍',
    topicCount: 3,
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
        progress: 15,
        children: [
          { id: 't2_1', title: 'Nhận phòng', wordCount: 15, progress: 30 },
          { id: 't2_2', title: 'Tiện nghi phòng', wordCount: 20, progress: 10 },
          { id: 't2_3', title: 'Trả phòng & Thanh toán', wordCount: 10, progress: 0 },
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
    title: 'Công việc & Giao tiếp',
    emoji: '💼',
    topicCount: 2,
    topics: [
      {
        id: 't4',
        title: 'Phỏng vấn xin việc',
        wordCount: 30,
        progress: 10,
        children: []
      },
      {
        id: 't5',
        title: 'Họp và Thuyết trình',
        wordCount: 25,
        progress: 0,
        children: []
      }
    ]
  },
  {
    id: 'c3',
    title: 'Học thuật & IELTS',
    emoji: '🎓',
    topicCount: 1,
    topics: [
      {
        id: 't6',
        title: 'Môi trường & Biến đổi khí hậu',
        wordCount: 28,
        progress: 5,
        children: []
      }
    ]
  }
];

export default function TopicsScreen() {
  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({ c1: true });
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({ t1: true });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCollection = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCollections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTopic = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedTopics(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNavigateTopic = (topicId: string) => {
    router.push(`/topics/${topicId}` as any);
  };

  // Filter collections and topics based on search
  const filteredCollections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return MOCK_COLLECTIONS;

    return MOCK_COLLECTIONS.map(collection => {
      const matchColTitle = collection.title.toLowerCase().includes(query);
      const filteredTopics = collection.topics.filter(topic => {
        const matchTopicTitle = topic.title.toLowerCase().includes(query);
        const matchChild = topic.children.some(c => c.title.toLowerCase().includes(query));
        return matchTopicTitle || matchChild;
      });

      if (matchColTitle) {
        return collection;
      }

      if (filteredTopics.length > 0) {
        return {
          ...collection,
          topics: filteredTopics
        };
      }

      return null;
    }).filter(Boolean) as Collection[];
  }, [searchQuery]);

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white z-10 border-b border-neutral-100">
        <Pressable 
          onPress={() => router.back()} 
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100 -ml-2"
        >
          <ChevronLeftIcon size={28} className="text-mascot-navy" />
        </Pressable>
        <View className="flex-1 items-center">
          <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">Chủ đề từ vựng</Text>
          <Text className="font-bold text-[12px] text-neutral-400 font-inter">Bộ sưu tập chủ đề học tập</Text>
        </View>
        <View className="w-10 h-10 items-center justify-center">
          <SparklesIcon size={20} className="text-primary-500" />
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* SEARCH BAR */}
        <View className="px-4 mt-4 mb-2">
          <View className="bg-white rounded-2xl border-2 border-neutral-200/80 px-4 py-3 flex-row items-center gap-3 shadow-sm">
            <SearchIcon size={20} className="text-neutral-400" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Tìm chủ đề (vd: sân bay, khách sạn...)"
              placeholderTextColor="#A0AEC0"
              className="flex-1 text-[15px] font-inter text-mascot-navy p-0"
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <Pressable 
                onPress={() => setSearchQuery('')}
                className="w-6 h-6 rounded-full bg-neutral-200 items-center justify-center active:bg-neutral-300"
              >
                <XIcon size={14} className="text-neutral-600" />
              </Pressable>
            )}
          </View>
        </View>

        {/* HERO BANNER (ĐỀ XUẤT CHO BẠN) - Chỉ hiện khi không search */}
        {!searchQuery && (
          <View className="px-4 mt-4 mb-6">
            <View className="bg-primary-50 rounded-[28px] p-5 border-2 border-primary-200 border-b-[5px] shadow-sm shadow-black/5 relative overflow-hidden">
              <View className="absolute -right-4 -bottom-4 opacity-10">
                <FlameIcon size={130} className="text-primary-500" />
              </View>
              
              <View className="flex-row items-center gap-1.5 mb-2">
                <FlameIcon size={18} fill="#FF8A00" className="text-mascot-500" />
                <Text className="font-extrabold text-[12px] text-primary-600 uppercase tracking-widest font-nunito">ĐỀ XUẤT NỔI BẬT</Text>
              </View>
              
              <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito mb-1">Chuẩn bị chuyến đi</Text>
              <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-4">
                20 từ vựng cốt lõi · Tiếng Anh du lịch thực tế
              </Text>
              
              <Pressable 
                onPress={() => handleNavigateTopic('t3')}
                className="h-12 bg-primary-500 rounded-xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all flex-row items-center justify-center w-full max-w-[200px]"
              >
                <Text className="text-white font-extrabold text-[14px] uppercase font-nunito tracking-[0.04em]">KHÁM PHÁ NGAY</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* DANH SÁCH BỘ SƯU TẬP */}
        <View className="px-4">
          <View className="flex-row items-center justify-between mb-4 px-1">
            <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">
              {searchQuery ? `Kết quả tìm kiếm (${filteredCollections.length})` : 'Tất cả Bộ sưu tập'}
            </Text>
            {searchQuery && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Text className="font-bold text-[13px] text-primary-600 font-inter">Xem tất cả</Text>
              </Pressable>
            )}
          </View>

          {filteredCollections.length === 0 ? (
            <View className="bg-white rounded-[24px] p-8 items-center justify-center border border-neutral-100 shadow-sm mt-2">
              <Snapy pose="kham_pha" animation="idle" className="w-24 h-24 mb-3" />
              <Text className="font-extrabold text-[17px] text-mascot-navy font-nunito mb-1">Không tìm thấy chủ đề</Text>
              <Text className="font-medium text-[14px] text-neutral-400 font-inter text-center">
                Hãy thử tìm với từ khóa khác như "Du lịch", "Sân bay", "Khách sạn"
              </Text>
            </View>
          ) : (
            filteredCollections.map(collection => {
              const isCollectionExpanded = searchQuery ? true : !!expandedCollections[collection.id];

              return (
                <View key={collection.id} className="mb-4">
                  {/* COLLECTION CARD HEADER */}
                  <Pressable 
                    onPress={() => toggleCollection(collection.id)}
                    className={cn(
                      "bg-white p-5 border border-neutral-100 shadow-sm shadow-black/5 active:bg-neutral-50 transition-all flex-row items-center justify-between",
                      isCollectionExpanded ? "rounded-t-[24px] border-b-neutral-100" : "rounded-[24px]"
                    )}
                  >
                    <View className="flex-row items-center gap-4 flex-1 pr-2">
                      <View className="w-14 h-14 bg-neutral-50 rounded-2xl items-center justify-center border border-neutral-100">
                        <Text className="text-[28px]">{collection.emoji}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="font-extrabold text-[17px] text-mascot-navy font-nunito mb-0.5" numberOfLines={1}>
                          {collection.title}
                        </Text>
                        <Text className="font-medium text-[13px] text-neutral-400 font-inter">
                          {collection.topics.length} chủ đề học tập
                        </Text>
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

                  {/* COLLECTION TOPICS LIST */}
                  {isCollectionExpanded && (
                    <View className="bg-white rounded-b-[24px] border border-t-0 border-neutral-100 shadow-sm shadow-black/5 overflow-hidden">
                      {collection.topics.length === 0 ? (
                        <View className="py-8 items-center justify-center border-t border-neutral-100">
                          <Snapy pose="kham_pha" animation="idle" className="w-20 h-20 mb-3 opacity-90" />
                          <Text className="font-bold text-[14px] text-neutral-400 font-inter">Chưa có chủ đề nào</Text>
                        </View>
                      ) : (
                        collection.topics.map((topic, index) => {
                          const isTopicExpanded = searchQuery ? true : !!expandedTopics[topic.id];
                          const hasChildren = topic.children && topic.children.length > 0;

                          return (
                            <View key={topic.id} className={cn("border-neutral-100", index !== 0 && "border-t")}>
                              {/* TOPIC ROW */}
                              <Pressable 
                                onPress={() => hasChildren ? toggleTopic(topic.id) : handleNavigateTopic(topic.id)}
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
                                
                                <View className="flex-row items-center gap-2">
                                  {hasChildren ? (
                                    <View className="w-8 h-8 rounded-full bg-neutral-50 items-center justify-center">
                                      {isTopicExpanded ? (
                                        <ChevronUpIcon size={18} className="text-neutral-500" />
                                      ) : (
                                        <ChevronDownIcon size={18} className="text-neutral-500" />
                                      )}
                                    </View>
                                  ) : (
                                    <View className="w-9 h-9 rounded-xl bg-primary-50 items-center justify-center border border-primary-200">
                                      <ArrowRightIcon size={16} className="text-primary-600" />
                                    </View>
                                  )}
                                </View>
                              </Pressable>

                              {/* SUB-TOPICS LIST */}
                              {hasChildren && isTopicExpanded && (
                                <View className="bg-neutral-50/80 pb-2">
                                  {/* Action học toàn bộ topic cha */}
                                  <Pressable 
                                    onPress={() => handleNavigateTopic(topic.id)}
                                    className="mx-4 my-2 p-2.5 bg-white rounded-xl border border-primary-200 flex-row items-center justify-between active:bg-primary-50/50"
                                  >
                                    <View className="flex-row items-center gap-2">
                                      <BookOpenIcon size={16} className="text-primary-600" />
                                      <Text className="font-bold text-[13px] text-primary-700 font-inter">
                                        Xem toàn bộ từ vựng "{topic.title}" ({topic.wordCount} từ)
                                      </Text>
                                    </View>
                                    <ArrowRightIcon size={14} className="text-primary-600" />
                                  </Pressable>

                                  {topic.children.map((child, childIndex) => (
                                    <Pressable 
                                      key={child.id}
                                      onPress={() => handleNavigateTopic(child.id)}
                                      className={cn(
                                        "pl-8 pr-5 py-3 flex-row items-center justify-between active:bg-neutral-100",
                                        childIndex !== 0 && "border-t border-neutral-200/50"
                                      )}
                                    >
                                      <View className="flex-1 pr-4">
                                        <Text className="font-bold text-[15px] text-mascot-navy font-inter mb-0.5">{child.title}</Text>
                                        <Text className="font-medium text-[13px] text-neutral-400 font-inter">{child.wordCount} từ vựng</Text>
                                      </View>
                                      
                                      <View className="flex-row items-center gap-3">
                                        {child.progress > 0 ? (
                                          <Text className="font-extrabold text-[13px] text-primary-600 font-nunito">{child.progress}%</Text>
                                        ) : (
                                          <Text className="font-medium text-[12px] text-neutral-400 font-inter italic">Chưa học</Text>
                                        )}
                                        <View className="w-7 h-7 rounded-lg bg-white border border-neutral-200 items-center justify-center">
                                          <ArrowRightIcon size={14} className="text-neutral-500" />
                                        </View>
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
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

