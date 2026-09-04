import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  Image, 
  Modal, 
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ChevronLeftIcon, 
  AlertTriangleIcon, 
  Volume2Icon, 
  BookmarkIcon, 
  CheckIcon,
  Trash2Icon,
  XIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_WORD_DATA = {
  id: 'abandon',
  word: 'abandon',
  ipa: '/əˈbændən/',
  hasAudio: true,
  fromCamera: true, // Simulate coming from MH-CAMERA-02
  imageCropUrl: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?q=80&w=400&auto=format&fit=crop', // mock image
  meanings: [
    {
      pos: 'verb',
      definitions: ['từ bỏ', 'bỏ rơi']
    },
    {
      pos: 'noun',
      definitions: ['sự phóng túng', 'sự buông thả'] // just for grouping example
    }
  ],
  example: {
    en: 'She decided to abandon the project.',
    vi: 'Cô ấy quyết định từ bỏ dự án.'
  },
  synonyms: ['leave', 'desert', 'forsake'],
  antonyms: ['keep', 'maintain'],
  related: ['abandoned', 'abandonment'],
  isSaved: false,
  deckName: 'Tiếng Anh cơ bản'
};

export default function WordDetailScreen() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState(MOCK_WORD_DATA);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<string | null>(null);

  const handleAudio = () => {
    if (!data.hasAudio) return;
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 1500); // Mock playing duration
  };

  const handleSave = () => {
    setData(prev => ({ ...prev, isSaved: true }));
  };

  const handleRemove = () => {
    setData(prev => ({ ...prev, isSaved: false }));
  };

  const submitReport = () => {
    setIsReportOpen(false);
    // Simulate toast
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      
      {/* 1. HEADER */}
      <View className="h-14 flex-row items-center justify-between px-4 z-20">
        <Pressable 
          onPress={() => router.back()} 
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100 -ml-2"
        >
          <ChevronLeftIcon size={28} className="text-mascot-navy" />
        </Pressable>
        <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">
          Chi tiết từ
        </Text>
        <Pressable 
          onPress={() => setIsReportOpen(true)}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100 -mr-2"
        >
          <AlertTriangleIcon size={20} className="text-neutral-400" />
        </Pressable>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 180 }}
        showsVerticalScrollIndicator={false}
      >
        
        {/* 2. WORD HERO */}
        <View className="px-6 py-4">
          <Text className="font-extrabold text-[42px] text-mascot-navy font-nunito mb-2 leading-tight">
            {data.word}
          </Text>
          <View className="flex-row items-center gap-4">
            {data.ipa ? (
              <Text className="font-medium text-[18px] text-neutral-500 font-inter">{data.ipa}</Text>
            ) : (
              <Text className="font-medium text-[16px] text-neutral-300 font-inter italic">Chưa có phiên âm</Text>
            )}
            
            <Pressable 
              onPress={handleAudio}
              className={cn(
                "h-10 px-4 rounded-full border-b-[3px] active:translate-y-[1.5px] active:border-b-[1.5px] transition-all flex-row items-center justify-center gap-2",
                isPlaying ? "bg-info-100 border-info-200" : "bg-info-50 border-info-200 active:bg-info-100",
                !data.hasAudio && "bg-neutral-100 border-neutral-200 opacity-70"
              )}
            >
              <Volume2Icon size={18} className={isPlaying ? "text-info-600" : "text-info-500"} />
              {isPlaying && <Text className="font-bold text-[12px] text-info-600 font-inter">Đang phát...</Text>}
            </Pressable>
          </View>
        </View>

        {/* 3. DETECTION IMAGE CROP */}
        {data.fromCamera && data.imageCropUrl && (
          <View className="px-6 py-2 mb-4">
            <View className="flex-row items-center gap-2 mb-2">
              <Text className="font-extrabold text-[12px] text-neutral-400 uppercase tracking-widest font-nunito">ẢNH NHẬN DIỆN</Text>
            </View>
            <View className="w-24 h-24 rounded-2xl bg-neutral-100 overflow-hidden shadow-sm shadow-black/5 border border-neutral-100">
              <Image 
                source={{ uri: data.imageCropUrl }} 
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>
        )}

        <View className="h-px bg-neutral-100 mx-6 my-4" />

        {/* 4. MEANINGS GROUPED BY POS */}
        <View className="px-6 mb-6">
          <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-4">Nghĩa</Text>
          <View className="gap-5">
            {data.meanings.map((group, idx) => (
              <View key={idx}>
                {/* POS Label */}
                <View className="bg-primary-50 self-start px-2.5 py-1 rounded-md mb-2">
                  <Text className="font-bold text-[13px] text-primary-700 font-inter italic">{group.pos}</Text>
                </View>
                {/* Definitions */}
                <View className="gap-2">
                  {group.definitions.map((def, i) => (
                    <View key={i} className="flex-row items-start gap-2">
                      <Text className="font-bold text-[15px] text-neutral-300 font-inter mt-0.5">{i + 1}.</Text>
                      <Text className="flex-1 font-medium text-[16px] text-neutral-700 font-inter leading-relaxed">
                        {def}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 5. EXAMPLE SENTENCE */}
        {data.example && (
          <View className="px-6 mb-8">
            <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-3">Ví dụ</Text>
            <View className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
              <Text className="font-bold text-[16px] text-mascot-navy font-inter leading-relaxed mb-1.5">
                {data.example.en}
              </Text>
              <Text className="font-medium text-[15px] text-neutral-500 font-inter leading-relaxed">
                {data.example.vi}
              </Text>
            </View>
          </View>
        )}

        {/* 6. RELATED VOCABULARY */}
        <View className="px-6 mb-8">
          <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-3">Từ liên quan</Text>
          
          {data.synonyms.length > 0 && (
            <View className="mb-4">
              <Text className="font-bold text-[13px] text-neutral-400 font-inter mb-2">Đồng nghĩa</Text>
              <View className="flex-row flex-wrap gap-2">
                {data.synonyms.map((word, i) => (
                  <Pressable key={i} className="bg-white px-3 py-1.5 rounded-lg border border-neutral-200 active:bg-neutral-50 shadow-sm shadow-black/5">
                    <Text className="font-medium text-[14px] text-mascot-navy font-inter">{word}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {data.antonyms.length > 0 && (
            <View className="mb-4">
              <Text className="font-bold text-[13px] text-neutral-400 font-inter mb-2">Trái nghĩa</Text>
              <View className="flex-row flex-wrap gap-2">
                {data.antonyms.map((word, i) => (
                  <Pressable key={i} className="bg-white px-3 py-1.5 rounded-lg border border-neutral-200 active:bg-neutral-50 shadow-sm shadow-black/5">
                    <Text className="font-medium text-[14px] text-mascot-navy font-inter">{word}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {data.related.length > 0 && (
            <View>
              <Text className="font-bold text-[13px] text-neutral-400 font-inter mb-2">Từ cùng gốc</Text>
              <View className="flex-row flex-wrap gap-2">
                {data.related.map((word, i) => (
                  <Pressable key={i} className="bg-white px-3 py-1.5 rounded-lg border border-neutral-200 active:bg-neutral-50 shadow-sm shadow-black/5">
                    <Text className="font-medium text-[14px] text-mascot-navy font-inter">{word}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>

      </ScrollView>

      {/* 7. STICKY ACTION AREA (SAVE) */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 p-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        
        {!data.isSaved ? (
          <>
            <View className="flex-row items-center justify-between px-2 mb-3">
              <Text className="font-bold text-[13px] text-neutral-400 font-inter uppercase tracking-wider">LƯU VÀO DECK</Text>
              <Text className="font-extrabold text-[14px] text-mascot-navy font-inter">{data.deckName}</Text>
            </View>
            <Pressable 
              onPress={handleSave}
              className="h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all flex-row items-center justify-center gap-2"
            >
              <BookmarkIcon size={20} fill="#FFFFFF" className="text-white" />
              <Text className="text-white font-extrabold text-[16px] uppercase font-nunito tracking-[0.04em]">LƯU TỪ VỰNG</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View className="items-center mb-3">
              <Text className="font-bold text-[14px] text-neutral-500 font-inter mb-0.5">Từ đã có trong Deck được chọn</Text>
              <Text className="font-extrabold text-[15px] text-mascot-navy font-inter">{data.deckName}</Text>
            </View>
            <View className="flex-row gap-3">
              <Pressable 
                onPress={handleRemove}
                className="h-14 px-5 bg-white rounded-2xl border-2 border-neutral-200 border-b-[4px] active:bg-neutral-50 active:translate-y-[2px] active:border-b-2 items-center justify-center transition-all"
              >
                <Trash2Icon size={20} className="text-danger-500" />
              </Pressable>
              
              <View className="flex-1 h-14 bg-neutral-100 rounded-2xl border-b-[2px] border-neutral-200 flex-row items-center justify-center gap-2">
                <CheckIcon size={20} className="text-neutral-400" />
                <Text className="text-neutral-400 font-extrabold text-[16px] uppercase font-nunito tracking-[0.04em]">ĐÃ LƯU ✓</Text>
              </View>
            </View>
          </>
        )}
      </View>

      {/* 8. REPORT ERROR MODAL */}
      <Modal visible={isReportOpen} transparent animationType="fade">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end bg-black/40"
        >
          <Pressable className="flex-1" onPress={() => setIsReportOpen(false)} />
          <View className="bg-white rounded-t-3xl p-6 shadow-xl">
            
            <View className="flex-row justify-between items-center mb-6">
              <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">Báo lỗi từ vựng</Text>
              <Pressable onPress={() => setIsReportOpen(false)} className="p-2 bg-neutral-100 rounded-full">
                <XIcon size={18} className="text-neutral-500" />
              </Pressable>
            </View>

            <View className="gap-3 mb-5">
              {['Nghĩa sai', 'Phiên âm sai', 'Từ vựng sai'].map((reason) => (
                <Pressable 
                  key={reason}
                  onPress={() => setReportReason(reason)}
                  className={cn(
                    "p-4 rounded-xl border-2 flex-row items-center justify-between transition-all",
                    reportReason === reason ? "border-primary-500 bg-primary-50" : "border-neutral-100 bg-white"
                  )}
                >
                  <Text className={cn("font-bold text-[15px] font-inter", reportReason === reason ? "text-primary-700" : "text-neutral-600")}>
                    {reason}
                  </Text>
                  {reportReason === reason && <CheckIcon size={18} className="text-primary-500" />}
                </Pressable>
              ))}
            </View>

            <Text className="font-bold text-[14px] text-neutral-500 font-inter mb-2">Ghi chú thêm (Tùy chọn)</Text>
            <TextInput 
              className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 font-inter text-[15px] text-mascot-navy mb-6 min-h-[80px]"
              placeholder="Bạn thấy có vấn đề gì ở từ này?"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
            />

            <Pressable 
              onPress={submitReport}
              disabled={!reportReason}
              className={cn(
                "w-full h-14 rounded-2xl border-b-[4px] flex-row items-center justify-center transition-all",
                reportReason 
                  ? "bg-primary-500 border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px]" 
                  : "bg-neutral-200 border-neutral-300 opacity-70"
              )}
            >
              <Text className={cn("font-extrabold text-[16px] uppercase font-nunito tracking-[0.04em]", reportReason ? "text-white" : "text-neutral-400")}>
                GỬI BÁO LỖI
              </Text>
            </Pressable>

          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}
