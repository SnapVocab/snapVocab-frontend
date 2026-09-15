import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Animated, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  ChevronLeftIcon, 
  Volume2Icon, 
  CheckCircle2Icon,
  RefreshCwIcon,
  XIcon,
  CheckIcon,
  PlusIcon,
  GraduationCapIcon,
  BookOpenIcon,
  SparklesIcon,
  ArrowRightIcon,
  LayersIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';
import {
  getMockTopicBundle,
  resolveAttributeValue,
  resolveGroupInstances,
  isGroupInstance,
  TopicItemData,
  TopicSchemaData,
  TopicGroupSchemaDTO,
  TopicAttributeSchemaDTO,
  EavGroupInstance,
} from '@/lib/topic-eav';

// ==========================================
// TYPES
// ==========================================
type DeckOption = {
  id: string;
  name: string;
  emoji: string;
  cardCount: number;
  template: string;
};

const MOCK_DECKS: DeckOption[] = [
  { id: 'd2', name: 'Travel English', emoji: '✈️', cardCount: 86, template: 'LISTENING' },
  { id: 'd1', name: 'English Basics', emoji: '📚', cardCount: 42, template: 'CLASSIC' },
  { id: 'd3', name: 'Daily Conversation', emoji: '💬', cardCount: 35, template: 'CLASSIC' },
  { id: 'd4', name: 'Business English', emoji: '💼', cardCount: 64, template: 'SPEAKING' },
  { id: 'd5', name: 'IELTS Core', emoji: '🎯', cardCount: 120, template: 'SRS' },
];

export default function TopicDetailScreen() {
  const params = useLocalSearchParams();
  const topicId = (params.id as string) || 'airport-vocabulary';

  // Lấy dữ liệu topic + schema + items từ EAV Bundle
  const bundle = useMemo(() => getMockTopicBundle(topicId), [topicId]);
  const { topic, response } = bundle;
  const { schema, data: items } = response;

  // Deck State & Persistent Saved Items per Deck ID (Keyed by topicItemId: number)
  const [selectedDeck, setSelectedDeck] = useState<DeckOption>(MOCK_DECKS[0]);
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);

  const [savedByDeck, setSavedByDeck] = useState<Record<string, Set<number>>>(() => ({
    'd1': new Set([1002, 1004]),
    'd2': new Set([1001, 1002]),
  }));

  const currentDeckSavedSet = useMemo(() => {
    return savedByDeck[selectedDeck.id] || new Set<number>();
  }, [savedByDeck, selectedDeck.id]);

  // Modal Chi tiết Item (Dynamic EAV Inspector Modal)
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<TopicItemData | null>(null);

  // Audio Play State
  const [playingItemId, setPlayingItemId] = useState<number | null>(null);

  // Toast Notification State
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastAction, setToastAction] = useState<(() => void) | null>(null);
  const [toastAnim] = useState(new Animated.Value(0));

  const showToast = (message: string, action?: () => void) => {
    setToastMsg(message);
    setToastAction(action ? () => action : null);

    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(3000),
      Animated.timing(toastAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => {
      setToastMsg(null);
      setToastAction(null);
    });
  };

  // Play Audio (Tương tác Mock có fallback Web Speech API trên web)
  const playAudio = (itemId: number, textToSpeak?: string) => {
    setPlayingItemId(itemId);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window && textToSpeak) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.onend = () => setPlayingItemId(null);
        utterance.onerror = () => setPlayingItemId(null);
        window.speechSynthesis.speak(utterance);
      } catch {
        setTimeout(() => setPlayingItemId(null), 1200);
      }
    } else {
      setTimeout(() => setPlayingItemId(null), 1200);
    }
  };

  // Save single item
  const handleSaveItem = (itemId: number) => {
    if (currentDeckSavedSet.has(itemId)) return;

    setSavedByDeck(prev => {
      const nextDeckSet = new Set(prev[selectedDeck.id] || []);
      nextDeckSet.add(itemId);
      return {
        ...prev,
        [selectedDeck.id]: nextDeckSet,
      };
    });

    showToast(`Đã lưu vào bộ thẻ "${selectedDeck.name}"`, () => setIsDeckModalOpen(true));
  };

  // Save all items
  const handleSaveAll = () => {
    const eligibleItems = items.filter(it => !currentDeckSavedSet.has(it.topicItemId));

    if (eligibleItems.length === 0) {
      showToast('Tất cả mục đã có trong bộ thẻ này');
      return;
    }

    setSavedByDeck(prev => {
      const nextDeckSet = new Set(prev[selectedDeck.id] || []);
      eligibleItems.forEach(it => nextDeckSet.add(it.topicItemId));
      return {
        ...prev,
        [selectedDeck.id]: nextDeckSet,
      };
    });

    const skippedCount = items.length - eligibleItems.length;
    if (skippedCount > 0) {
      showToast(`Đã lưu ${eligibleItems.length} mục · Bỏ qua ${skippedCount} mục đã có`, () => setIsDeckModalOpen(true));
    } else {
      showToast(`Đã lưu toàn bộ ${eligibleItems.length} mục vào "${selectedDeck.name}"`, () => setIsDeckModalOpen(true));
    }
  };

  const handleSelectDeck = (deck: DeckOption) => {
    setSelectedDeck(deck);
    setIsDeckModalOpen(false);
    showToast(`Đã chọn bộ thẻ đích: "${deck.name}"`);
  };

  const eligibleCount = items.filter(it => !currentDeckSavedSet.has(it.topicItemId)).length;

  // Sắp xếp các groups theo schema group.position
  const sortedGroups = useMemo(() => {
    if (!schema?.groups) return [];
    return [...schema.groups].sort((a, b) => a.position - b.position);
  }, [schema]);

  // Primary single group (thường là group đầu tiên, ví dụ 'main')
  const primaryGroup = useMemo(() => {
    return sortedGroups.find(g => !g.multiple) || sortedGroups[0];
  }, [sortedGroups]);

  // Multiple groups (ví dụ 'examples', 'dialogue_lines', 'locations')
  const multipleGroups = useMemo(() => {
    return sortedGroups.filter(g => g.multiple);
  }, [sortedGroups]);

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      {/* FLOATING TOAST NOTIFICATION */}
      {toastMsg && (
        <Animated.View 
          style={{
            opacity: toastAnim,
            transform: [{ 
              translateY: toastAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-25, 0],
              }),
            }],
          }}
          className="absolute top-14 left-4 right-4 z-50 bg-mascot-navy px-4 py-3.5 rounded-2xl shadow-xl flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-2.5 flex-1 mr-2">
            <View className="w-6 h-6 rounded-full bg-primary-500/20 items-center justify-center">
              <CheckIcon size={14} className="text-primary-400" />
            </View>
            <Text className="text-white text-[13px] font-inter font-medium leading-snug flex-1" numberOfLines={2}>
              {toastMsg}
            </Text>
          </View>
          {toastAction && (
            <Pressable 
              onPress={toastAction}
              className="bg-white/20 px-3 py-1.5 rounded-xl active:bg-white/30"
            >
              <Text className="text-primary-300 text-[12px] font-extrabold font-nunito uppercase tracking-wide">
                Đổi Deck
              </Text>
            </Pressable>
          )}
        </Animated.View>
      )}

      {/* 1. TOP HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white z-10 border-b border-neutral-100">
        <Pressable 
          onPress={() => router.back()} 
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100 -ml-2"
        >
          <ChevronLeftIcon size={28} className="text-mascot-navy" />
        </Pressable>
        <Text className="flex-1 text-center font-extrabold text-[18px] text-mascot-navy font-nunito mr-2" numberOfLines={1}>
          {topic.emoji} {topic.title}
        </Text>
        <Pressable 
          onPress={() => router.push(`/study/flashcard?topicId=${topic.id}` as any)}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-primary-50"
        >
          <GraduationCapIcon size={24} className="text-primary-600" />
        </Pressable>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. TOPIC BANNER */}
        <View className="bg-white px-5 pt-4 pb-6 border-b border-neutral-100 mb-3">
          <View className="flex-row items-center gap-2.5 mb-1.5">
            <Text className="text-[28px]">{topic.emoji}</Text>
            <Text className="font-extrabold text-[24px] text-mascot-navy font-nunito flex-1">
              {topic.title}
            </Text>
          </View>
          
          <Text className="font-medium text-[15px] text-neutral-500 font-inter leading-relaxed mb-3">
            {topic.description}
          </Text>

          {/* Cấu trúc nội dung Badge (EAV Summary) */}
          <View className="flex-row items-center gap-2 mb-4">
            <View className="bg-primary-50 px-3 py-1 rounded-xl border border-primary-100 flex-row items-center gap-1.5">
              <LayersIcon size={13} className="text-primary-600" />
              <Text className="font-bold text-[12px] text-primary-700 font-nunito">
                {topic.contentTypeSummary}
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-center justify-between pt-2 border-t border-neutral-100">
            <Text className="font-bold text-[14px] text-neutral-400 font-inter">
              {items.length} mục hiển thị · {topic.totalWords} mục trong chủ đề
            </Text>
            {topic.progress > 0 && (
              <View className="flex-row items-center gap-2">
                <Text className="font-extrabold text-[14px] text-primary-600 font-nunito">
                  {topic.progress}%
                </Text>
                <View className="w-16 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <View 
                    className="h-full bg-primary-500 rounded-full" 
                    style={{ width: `${topic.progress}%` }}
                  />
                </View>
              </View>
            )}
          </View>

          {/* NÚT CTA HỌC THẺ CHỦ ĐỀ CHÍNH THỨC */}
          <Pressable 
            onPress={() => router.push(`/study/flashcard?topicId=${topic.id}` as any)}
            className="mt-4 w-full h-13 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all flex-row items-center justify-center gap-2 shadow-sm shadow-primary-500/25 py-3"
          >
            <GraduationCapIcon size={20} color="#FFFFFF" />
            <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-wide">
              Học bằng Flashcard
            </Text>
          </Pressable>
        </View>

        {/* 3. DECK ĐÍCH SELECTOR CARD */}
        <View className="px-4 mb-4">
          <View className="bg-white rounded-[20px] p-4 border border-neutral-100 shadow-sm shadow-black/5 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1 pr-2">
              <View className="w-11 h-11 bg-info-50 rounded-2xl items-center justify-center border border-info-100">
                <Text className="text-[20px]">{selectedDeck.emoji}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-bold text-[11px] text-neutral-400 font-inter uppercase tracking-wider mb-0.5">
                  DECK ĐÍCH HIỆN TẠI
                </Text>
                <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito" numberOfLines={1}>
                  {selectedDeck.name}
                </Text>
              </View>
            </View>
            <Pressable 
              onPress={() => setIsDeckModalOpen(true)}
              className="bg-primary-50 px-3.5 py-2 rounded-xl border border-primary-200 active:bg-primary-100 flex-row items-center gap-1.5 shadow-sm"
            >
              <RefreshCwIcon size={14} className="text-primary-600" />
              <Text className="font-extrabold text-[13px] text-primary-700 font-nunito">Đổi Deck</Text>
            </Pressable>
          </View>
        </View>

        {/* 4. DANH SÁCH MỤC DỮ LIỆU ĐỘNG (RENDER THEO SCHEMA EAV) */}
        <View className="px-4">
          <View className="flex-row items-center justify-between mb-3 px-1">
            <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">
              Danh sách mục học ({items.length})
            </Text>
            <Text className="font-medium text-[13px] text-neutral-400 font-inter">
              Đã lưu {currentDeckSavedSet.size} mục
            </Text>
          </View>
          
          {items.length === 0 ? (
            <View className="items-center justify-center py-12 bg-white rounded-3xl p-6 border border-neutral-100">
              <Snapy pose="doc_sach" animation="idle" className="w-28 h-28 mb-4" />
              <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-1">Chủ đề chưa có dữ liệu</Text>
              <Text className="font-medium text-[14px] text-neutral-400 font-inter text-center">
                Dữ liệu của chủ đề này đang được cập nhật thêm.
              </Text>
            </View>
          ) : (
            <View className="gap-3.5">
              {items.map(item => {
                const isSaved = currentDeckSavedSet.has(item.topicItemId);
                const isSpeaking = playingItemId === item.topicItemId;

                // 1. Trích xuất thuộc tính chính từ primary group theo attribute.position
                const primaryAttrs = primaryGroup ? [...primaryGroup.attributes].sort((a, b) => a.position - b.position) : [];
                
                // Thuộc tính tiêu đề (thuộc tính text đầu tiên có required hoặc có tên phổ biến)
                const titleAttr = primaryAttrs.find(a => a.dataType === 'TEXT' && (a.required || a.name === 'word' || a.name === 'phrase' || a.name === 'sign_name')) || primaryAttrs[0];
                const titleValue = titleAttr ? String(resolveAttributeValue(item, `${primaryGroup?.name}.${titleAttr.name}`, schema) ?? '') : '';

                // Thuộc tính phụ / phiên âm / role
                const subtitleAttr = primaryAttrs.find(a => a !== titleAttr && a.dataType === 'TEXT' && (a.name === 'ipa' || a.name === 'role' || a.name === 'warning_level'));
                const subtitleValue = subtitleAttr ? String(resolveAttributeValue(item, `${primaryGroup?.name}.${subtitleAttr.name}`, schema) ?? '') : '';

                // Thuộc tính nghĩa / giải thích
                const meaningAttr = primaryAttrs.find(a => a.name === 'meaning' || (a.dataType === 'TEXT' && a !== titleAttr && a !== subtitleAttr));
                const meaningValue = meaningAttr ? String(resolveAttributeValue(item, `${primaryGroup?.name}.${meaningAttr.name}`, schema) ?? '') : '';

                // Thuộc tính badge loại (partOfSpeech, role, warning_level)
                const badgeAttr = primaryAttrs.find(a => a.name === 'partOfSpeech' || a.name === 'role' || a.name === 'warning_level');
                const badgeValue = badgeAttr ? String(resolveAttributeValue(item, `${primaryGroup?.name}.${badgeAttr.name}`, schema) ?? '') : '';

                // Thuộc tính Audio
                const audioAttr = primaryAttrs.find(a => a.dataType === 'AUDIO');
                const hasAudio = !!audioAttr;

                // Thuộc tính Ảnh
                const imageAttr = primaryAttrs.find(a => a.dataType === 'IMAGE');
                const imageUrl = imageAttr ? String(resolveAttributeValue(item, `${primaryGroup?.name}.${imageAttr.name}`, schema) ?? '') : '';

                // 2. Trích xuất nhóm lặp (ví dụ câu ví dụ, hội thoại)
                const firstMultiGroup = multipleGroups[0];
                const multiInstances = firstMultiGroup ? resolveGroupInstances(item, firstMultiGroup.name) : [];
                const firstInstance = multiInstances[0];

                return (
                  <Pressable 
                    key={item.topicItemId}
                    onPress={() => setSelectedItemForDetail(item)}
                    className="bg-white rounded-[22px] p-5 border-2 border-neutral-100 border-b-[4px] shadow-sm shadow-black/5 active:bg-neutral-50/80 active:translate-y-[2px] active:border-b-[2px] transition-all"
                  >
                    {/* HÀNG TRÊN: TIÊU ĐỀ + PHÁT ÂM / AUDIO + ẢNH THUMBNAIL */}
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1 pr-3">
                        <View className="flex-row items-center gap-2 flex-wrap">
                          <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">
                            {titleValue || `Mục #${item.topicItemId}`}
                          </Text>
                          {badgeValue ? (
                            <View className="bg-neutral-100 px-2 py-0.5 rounded-md">
                              <Text className="font-bold text-[11px] text-neutral-500 font-inter uppercase">
                                {badgeValue}
                              </Text>
                            </View>
                          ) : null}
                        </View>

                        {subtitleValue ? (
                          <Text className="font-medium text-[14px] text-neutral-400 font-inter mt-0.5">
                            {subtitleValue}
                          </Text>
                        ) : null}
                      </View>

                      <View className="flex-row items-center gap-2">
                        {imageUrl ? (
                          <Image 
                            source={{ uri: imageUrl }}
                            className="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200"
                            resizeMode="cover"
                          />
                        ) : null}

                        {hasAudio && (
                          <Pressable 
                            onPress={(e) => {
                              e.stopPropagation();
                              playAudio(item.topicItemId, titleValue);
                            }}
                            className={cn(
                              "w-10 h-10 rounded-xl items-center justify-center border transition-all",
                              isSpeaking 
                                ? "bg-info-100 border-info-300 scale-105" 
                                : "bg-info-50 border-info-200 active:bg-info-100 active:scale-95"
                            )}
                          >
                            <Volume2Icon size={19} className={isSpeaking ? "text-info-700" : "text-info-600"} />
                          </Pressable>
                        )}
                      </View>
                    </View>
                    
                    {/* NGHĨA / DIỄN GIẢI CHÍNH */}
                    {meaningValue ? (
                      <Text className="font-bold text-[15px] text-neutral-700 font-inter mb-2">
                        {meaningValue}
                      </Text>
                    ) : null}

                    {/* DỮ LIỆU NHÓM LẶP (MULTIPLE GROUP PREVIEW) */}
                    {firstInstance ? (
                      <View className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 mb-3">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className="font-bold text-[11px] text-neutral-400 font-inter uppercase tracking-wider">
                            {firstMultiGroup?.label || 'Dữ liệu liên quan'}
                          </Text>
                          {multiInstances.length > 1 && (
                            <Text className="font-semibold text-[11px] text-primary-600 font-inter">
                              +{multiInstances.length - 1} mục khác
                            </Text>
                          )}
                        </View>
                        {/* Hiển thị các trường trong instance đầu tiên */}
                        <Text className="font-medium text-[13px] text-neutral-700 font-inter italic" numberOfLines={2}>
                          "{firstInstance.sentence || firstInstance.line || firstInstance.instruction || Object.values(firstInstance)[0]}"
                        </Text>
                        {(firstInstance.translation || firstInstance.vietnamese) && (
                          <Text className="font-normal text-[12px] text-neutral-400 font-inter mt-0.5" numberOfLines={1}>
                            {String(firstInstance.translation || firstInstance.vietnamese)}
                          </Text>
                        )}
                      </View>
                    ) : null}
                    
                    {/* HÀNG DƯỚI: NÚT CHI TIẾT & LƯU VÀO DECK */}
                    <View className="flex-row items-center justify-between pt-2 border-t border-neutral-100">
                      <View className="flex-row items-center gap-1">
                        <SparklesIcon size={13} className="text-primary-600" />
                        <Text className="font-semibold text-[12px] text-primary-600 font-inter">
                          Chạm để xem chi tiết
                        </Text>
                      </View>
                      
                      {isSaved ? (
                        <View className="flex-row items-center gap-1.5 px-3.5 py-1.5 bg-neutral-100 rounded-xl">
                          <CheckCircle2Icon size={15} className="text-primary-600" />
                          <Text className="font-bold text-[13px] text-neutral-600 font-inter">Đã lưu ✓</Text>
                        </View>
                      ) : (
                        <Pressable 
                          onPress={(e) => {
                            e.stopPropagation();
                            handleSaveItem(item.topicItemId);
                          }}
                          className="px-5 py-2 bg-primary-500 rounded-xl border-b-[3px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[1px] transition-all shadow-sm shadow-primary-500/20"
                        >
                          <Text className="font-extrabold text-[13px] text-white uppercase font-nunito tracking-wide">
                            + Lưu mục
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* 5. BOTTOM STICKY BAR: LƯU TẤT CẢ */}
      <View className="absolute bottom-0 left-0 right-0 p-4 pt-3 pb-8 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-lg shadow-black/10">
        <Pressable 
          onPress={handleSaveAll}
          disabled={eligibleCount === 0}
          className={cn(
            "h-14 rounded-2xl items-center justify-center border-b-[4px] active:translate-y-[2px] active:border-b-[2px] transition-all flex-row gap-2 shadow-sm",
            eligibleCount > 0 
              ? "bg-primary-500 border-primary-700 active:bg-primary-600 shadow-primary-500/20" 
              : "bg-neutral-100 border-neutral-200 opacity-90"
          )}
        >
          <Text className={cn(
            "font-extrabold text-[15px] uppercase font-nunito tracking-[0.04em]",
            eligibleCount > 0 ? "text-white" : "text-neutral-400"
          )}>
            {eligibleCount > 0 
              ? `Lưu tất cả · ${eligibleCount} mục vào "${selectedDeck.name}"` 
              : "Đã lưu toàn bộ mục trong Deck này ✓"}
          </Text>
        </Pressable>
      </View>

      {/* 6. MODAL CHI TIẾT ITEM (DYNAMIC EAV INSPECTOR MODAL) */}
      <Modal
        visible={!!selectedItemForDetail}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedItemForDetail(null)}
      >
        <Pressable 
          onPress={() => setSelectedItemForDetail(null)}
          className="flex-1 bg-black/50 justify-end"
        >
          <Pressable 
            onPress={e => e.stopPropagation()} 
            className="bg-white rounded-t-[36px] p-6 pb-10 border-t-2 border-neutral-100 shadow-2xl max-h-[88%]"
          >
            {selectedItemForDetail && (() => {
              const item = selectedItemForDetail;
              const isSaved = currentDeckSavedSet.has(item.topicItemId);

              // Kiểm tra xem template có cấu hình tra từ điển không
              const dictLookupRef = topic.defaultTemplate.dictionaryLookupAttr;
              const dictWord = dictLookupRef ? resolveAttributeValue(item, dictLookupRef, schema) : null;
              const canLookupDict = typeof dictWord === 'string' && dictWord.trim().length > 0;

              return (
                <View className="flex-1">
                  {/* Modal Top Header */}
                  <View className="flex-row items-center justify-between pb-3 border-b border-neutral-100 mb-4">
                    <View className="flex-1 pr-2">
                      <Text className="font-bold text-[11px] text-neutral-400 font-inter uppercase tracking-wider">
                        Chi tiết mục học (EAV)
                      </Text>
                      <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito" numberOfLines={1}>
                        Mục #{item.topicItemId}
                      </Text>
                    </View>
                    <Pressable 
                      onPress={() => setSelectedItemForDetail(null)}
                      className="w-9 h-9 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200"
                    >
                      <XIcon size={18} className="text-neutral-500" />
                    </Pressable>
                  </View>

                  {/* Dynamic Content Inspector by Schema Groups */}
                  <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    <View className="gap-5">
                      {sortedGroups.map(group => {
                        const isMultiple = group.multiple;

                        if (!isMultiple) {
                          // Nhóm đơn (Single Group Instance)
                          const sortedAttributes = [...group.attributes].sort((a, b) => a.position - b.position);

                          return (
                            <View key={group.groupId} className="bg-neutral-50/80 rounded-2xl p-4 border border-neutral-100">
                              <Text className="font-extrabold text-[14px] text-mascot-navy font-nunito mb-3 flex-row items-center">
                                {group.label}
                              </Text>

                              <View className="gap-3">
                                {sortedAttributes.map(attr => {
                                  const rawVal = resolveAttributeValue(item, `${group.name}.${attr.name}`, schema);
                                  if (rawVal === undefined || rawVal === null || rawVal === '') return null;

                                  // 1. Dữ liệu dạng IMAGE
                                  if (attr.dataType === 'IMAGE') {
                                    return (
                                      <View key={attr.attributeId} className="mb-2">
                                        <Text className="font-bold text-[11px] text-neutral-400 font-inter uppercase mb-1.5">
                                          {attr.label}
                                        </Text>
                                        <View className="w-full h-44 rounded-2xl overflow-hidden bg-neutral-200 border border-neutral-200">
                                          <Image 
                                            source={{ uri: String(rawVal) }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                          />
                                        </View>
                                      </View>
                                    );
                                  }

                                  // 2. Dữ liệu dạng AUDIO
                                  if (attr.dataType === 'AUDIO') {
                                    const textToSpeak = String(resolveAttributeValue(item, `${group.name}.word`, schema) || resolveAttributeValue(item, `${group.name}.phrase`, schema) || resolveAttributeValue(item, `${group.name}.sign_name`, schema) || '');
                                    const isSpeaking = playingItemId === item.topicItemId;

                                    return (
                                      <View key={attr.attributeId} className="flex-row items-center justify-between bg-white p-3 rounded-xl border border-neutral-200">
                                        <View>
                                          <Text className="font-bold text-[11px] text-neutral-400 font-inter uppercase">
                                            {attr.label}
                                          </Text>
                                          <Text className="font-semibold text-[13px] text-neutral-600 font-inter">
                                            Âm thanh chuẩn
                                          </Text>
                                        </View>
                                        <Pressable 
                                          onPress={() => playAudio(item.topicItemId, textToSpeak)}
                                          className={cn(
                                            "px-3.5 py-2 rounded-xl flex-row items-center gap-1.5 border transition-all",
                                            isSpeaking 
                                              ? "bg-info-500 border-info-600" 
                                              : "bg-info-50 border-info-200 active:bg-info-100"
                                          )}
                                        >
                                          <Volume2Icon size={16} color={isSpeaking ? '#FFFFFF' : '#0284C7'} />
                                          <Text className={cn(
                                            "font-bold text-[12px] font-nunito",
                                            isSpeaking ? "text-white" : "text-info-700"
                                          )}>
                                            {isSpeaking ? "Đang phát..." : "Nghe phát âm"}
                                          </Text>
                                        </Pressable>
                                      </View>
                                    );
                                  }

                                  // 3. Dữ liệu dạng TEXT hoặc các kiểu khác (Fallback an toàn)
                                  return (
                                    <View key={attr.attributeId} className="bg-white p-3 rounded-xl border border-neutral-100">
                                      <Text className="font-bold text-[11px] text-neutral-400 font-inter uppercase mb-0.5">
                                        {attr.label}
                                      </Text>
                                      <Text className="font-bold text-[15px] text-mascot-navy font-inter">
                                        {String(rawVal)}
                                      </Text>
                                    </View>
                                  );
                                })}
                              </View>
                            </View>
                          );
                        } else {
                          // Nhóm lặp (Multiple Instances Group, ví dụ câu ví dụ, hội thoại)
                          const instances = resolveGroupInstances(item, group.name);
                          if (instances.length === 0) return null;

                          return (
                            <View key={group.groupId} className="bg-neutral-50/80 rounded-2xl p-4 border border-neutral-100">
                              <View className="flex-row items-center justify-between mb-3">
                                <Text className="font-extrabold text-[14px] text-mascot-navy font-nunito">
                                  {group.label}
                                </Text>
                                <View className="bg-primary-50 px-2 py-0.5 rounded-md border border-primary-200">
                                  <Text className="font-extrabold text-[11px] text-primary-700 font-nunito">
                                    {instances.length} bản ghi
                                  </Text>
                                </View>
                              </View>

                              <View className="gap-2.5">
                                {instances.map((inst, instIndex) => (
                                  <View key={instIndex} className="bg-white p-3.5 rounded-xl border border-neutral-200">
                                    <View className="flex-row items-center gap-1.5 mb-1.5">
                                      <View className="w-5 h-5 rounded-full bg-primary-100 items-center justify-center">
                                        <Text className="font-extrabold text-[10px] text-primary-700 font-nunito">
                                          {instIndex + 1}
                                        </Text>
                                      </View>
                                      <Text className="font-bold text-[12px] text-neutral-400 font-inter">
                                        Bản ghi #{instIndex + 1}
                                      </Text>
                                    </View>

                                    {Object.entries(inst).map(([key, val]) => {
                                      const attrDef = group.attributes.find(a => a.name === key);
                                      const label = attrDef?.label || key;

                                      return (
                                        <View key={key} className="mt-1">
                                          <Text className="font-semibold text-[11px] text-neutral-400 font-inter">
                                            {label}:
                                          </Text>
                                          <Text className="font-medium text-[14px] text-neutral-700 font-inter">
                                            {String(val)}
                                          </Text>
                                        </View>
                                      );
                                    })}
                                  </View>
                                ))}
                              </View>
                            </View>
                          );
                        }
                      })}
                    </View>
                  </ScrollView>

                  {/* Modal Action Buttons */}
                  <View className="mt-4 pt-3 border-t border-neutral-100 gap-2.5">
                    {/* NÚT TRA TỪ ĐIỂN (CHỈ HIỆN KHI TEMPLATE CÓ dictionaryLookupAttr) */}
                    {canLookupDict && (
                      <Pressable 
                        onPress={() => {
                          setSelectedItemForDetail(null);
                          router.push(`/dictionary/${encodeURIComponent(String(dictWord).toLowerCase().trim())}` as any);
                        }}
                        className="h-12 bg-info-50 rounded-xl border border-info-200 active:bg-info-100 flex-row items-center justify-center gap-2"
                      >
                        <BookOpenIcon size={16} className="text-info-700" />
                        <Text className="font-extrabold text-[14px] text-info-700 font-nunito">
                          Tra từ điển: "{String(dictWord)}"
                        </Text>
                      </Pressable>
                    )}

                    <View className="flex-row gap-2">
                      <Pressable 
                        onPress={() => setSelectedItemForDetail(null)}
                        className="flex-1 h-12 bg-neutral-100 rounded-xl items-center justify-center active:bg-neutral-200"
                      >
                        <Text className="font-bold text-[14px] text-neutral-600 font-nunito">Đóng</Text>
                      </Pressable>

                      <Pressable 
                        onPress={() => {
                          handleSaveItem(item.topicItemId);
                        }}
                        className={cn(
                          "flex-1 h-12 rounded-xl items-center justify-center border-b-[3px] active:translate-y-[2px] active:border-b-[1px] transition-all",
                          isSaved 
                            ? "bg-neutral-200 border-neutral-300" 
                            : "bg-primary-500 border-primary-700 active:bg-primary-600"
                        )}
                      >
                        <Text className={cn(
                          "font-extrabold text-[14px] font-nunito uppercase",
                          isSaved ? "text-neutral-600" : "text-white"
                        )}>
                          {isSaved ? "Đã lưu ✓" : "+ Lưu vào Deck"}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })()}
          </Pressable>
        </Pressable>
      </Modal>

      {/* 7. MODAL CHỌN BỘ THẺ ĐÍCH */}
      <Modal
        visible={isDeckModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsDeckModalOpen(false)}
      >
        <Pressable 
          onPress={() => setIsDeckModalOpen(false)}
          className="flex-1 bg-black/40 justify-end"
        >
          <Pressable 
            onPress={e => e.stopPropagation()} 
            className="bg-white rounded-t-[36px] p-6 pb-10 border-t-2 border-neutral-100 shadow-2xl max-h-[80%]"
          >
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">
                  Chọn bộ thẻ đích
                </Text>
                <Text className="font-medium text-[13px] text-neutral-400 font-inter">
                  Mục học lưu sẽ được tự động thêm vào bộ thẻ này
                </Text>
              </View>
              <Pressable 
                onPress={() => setIsDeckModalOpen(false)}
                className="w-9 h-9 rounded-full bg-neutral-100 items-center justify-center active:bg-neutral-200"
              >
                <XIcon size={18} className="text-neutral-500" />
              </Pressable>
            </View>

            <ScrollView className="max-h-[380px] my-2" showsVerticalScrollIndicator={false}>
              <View className="gap-2.5">
                {MOCK_DECKS.map(deck => {
                  const isSelected = selectedDeck.id === deck.id;

                  return (
                    <Pressable
                      key={deck.id}
                      onPress={() => handleSelectDeck(deck)}
                      className={cn(
                        "p-4 rounded-2xl border-2 flex-row items-center justify-between transition-all",
                        isSelected 
                          ? "bg-primary-50/50 border-primary-500 border-b-[4px]" 
                          : "bg-white border-neutral-200/80 active:bg-neutral-50"
                      )}
                    >
                      <View className="flex-row items-center gap-3.5 flex-1 pr-2">
                        <View className="w-12 h-12 rounded-xl bg-neutral-50 items-center justify-center border border-neutral-100">
                          <Text className="text-[24px]">{deck.emoji}</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-0.5">
                            {deck.name}
                          </Text>
                          <Text className="font-medium text-[13px] text-neutral-400 font-inter">
                            {deck.cardCount} thẻ · Mẫu {deck.template}
                          </Text>
                        </View>
                      </View>

                      {isSelected ? (
                        <View className="w-7 h-7 rounded-full bg-primary-500 items-center justify-center">
                          <CheckIcon size={16} className="text-white" />
                        </View>
                      ) : (
                        <View className="w-7 h-7 rounded-full border-2 border-neutral-300" />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            <Pressable 
              onPress={() => {
                setIsDeckModalOpen(false);
                router.push('/decks' as any);
              }}
              className="mt-4 p-3.5 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 flex-row items-center justify-center gap-2 active:bg-neutral-100"
            >
              <PlusIcon size={18} className="text-primary-600" />
              <Text className="font-extrabold text-[14px] text-primary-600 font-nunito">
                Quản lý hoặc Tạo bộ thẻ mới
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
