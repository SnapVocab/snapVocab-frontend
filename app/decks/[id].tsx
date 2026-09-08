import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform, Modal, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  ChevronLeftIcon,
  MoreVerticalIcon,
  FilterIcon,
  ArrowUpDownIcon,
  PlayIcon,
  BookOpenIcon,
  BrainCircuitIcon,
  XIcon,
  Edit3Icon,
  Trash2Icon,
  ArchiveIcon,
  CheckIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// ==========================================
// TYPES & MOCK DATA
// ==========================================
type FSRSState = 'new' | 'learning' | 'reviewing' | 'mastered';
type SourceTag = 'DICT' | 'SCAN' | 'TOPIC' | 'MANUAL';

interface Note {
  id: string;
  word: string;
  meaning: string;
  ipa: string;
  example: string;
  personalNote: string;
  state: FSRSState;
  source: SourceTag;
}

const MOCK_DECK = {
  id: 'd1',
  name: 'English Basics',
  template: 'CLASSIC',
  dueCount: 8,
};

const INITIAL_NOTES: Note[] = [
  {
    id: 'n1', word: 'boarding pass', meaning: 'thẻ lên máy bay', ipa: '/ˈbɔːrdɪŋ pæs/',
    example: 'Please show your boarding pass at the gate.', personalNote: '', state: 'reviewing', source: 'TOPIC'
  },
  {
    id: 'n2', word: 'departure', meaning: 'sự khởi hành', ipa: '/dɪˈpɑːrtʃər/',
    example: 'Our departure time is 8:00 AM.', personalNote: 'Từ này hay gặp ở sân bay', state: 'new', source: 'DICT'
  },
  {
    id: 'n3', word: 'luggage', meaning: 'hành lý', ipa: '/ˈlʌɡɪdʒ/',
    example: 'I have two pieces of luggage.', personalNote: '', state: 'learning', source: 'SCAN'
  },
  {
    id: 'n4', word: 'destination', meaning: 'điểm đến', ipa: '/ˌdestɪˈneɪʃn/',
    example: 'Paris is our final destination.', personalNote: '', state: 'mastered', source: 'TOPIC'
  },
  {
    id: 'n5', word: 'check-in', meaning: 'làm thủ tục', ipa: '/ˈtʃek ɪn/',
    example: 'We need to check in two hours before the flight.', personalNote: '', state: 'reviewing', source: 'TOPIC'
  }
];

const STATE_CONFIG = {
  new: { label: 'Mới', bg: 'bg-info-50', text: 'text-info-600', border: 'border-info-200' },
  learning: { label: 'Đang học', bg: 'bg-warning-50', text: 'text-warning-600', border: 'border-warning-200' },
  reviewing: { label: 'Đang ôn', bg: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-200' },
  mastered: { label: 'Đã thuộc', bg: 'bg-success-50', text: 'text-success-600', border: 'border-success-200' },
};

export default function DeckDetailScreen() {
  const { id } = useLocalSearchParams();
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastAnim] = useState(new Animated.Value(0));

  // Modals state
  const [activeNoteMenu, setActiveNoteMenu] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  // Edit Form State
  const [editForm, setEditForm] = useState({ meaning: '', ipa: '', example: '', personalNote: '' });

  // Filters State
  const [activeFilter, setActiveFilter] = useState<FSRSState | null>(null);

  const showToast = (message: string) => {
    setToastMsg(message);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start(() => setToastMsg(null));
  };

  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setEditForm({
      meaning: note.meaning,
      ipa: note.ipa,
      example: note.example,
      personalNote: note.personalNote
    });
    setActiveNoteMenu(null);
  };

  const handleSaveEdit = () => {
    if (!editingNote) return;
    setNotes(prev => prev.map(n => 
      n.id === editingNote.id ? { ...n, ...editForm } : n
    ));
    setEditingNote(null);
    showToast('Đã cập nhật từ');
  };

  const handleDelete = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
    setActiveNoteMenu(null);
    showToast('Đã xóa từ khỏi Deck');
  };

  const filteredNotes = activeFilter 
    ? notes.filter(n => n.state === activeFilter) 
    : notes;

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
          <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">{MOCK_DECK.name}</Text>
          <View className="bg-neutral-100 px-2 py-0.5 rounded mt-0.5">
            <Text className="font-bold text-[10px] text-neutral-500 font-inter uppercase tracking-widest">{MOCK_DECK.template}</Text>
          </View>
        </View>
        <Pressable 
          onPress={() => showToast('Tính năng Đổi Template sẽ mở màn hình MH-LEARN-06')}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100"
        >
          <MoreVerticalIcon size={24} className="text-mascot-navy" />
        </Pressable>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. SUMMARY & LEARNING ACTIONS */}
        <View className="bg-white px-4 py-5 border-b border-neutral-100 mb-2">
          
          <View className="flex-row items-center justify-center gap-3 mb-6">
            <Text className="font-bold text-[14px] text-neutral-600 font-inter">{notes.length} từ vựng</Text>
            <View className="w-1 h-1 rounded-full bg-neutral-300" />
            <Text className={cn(
              "font-bold text-[14px] font-inter",
              MOCK_DECK.dueCount > 0 ? "text-warning-600" : "text-neutral-600"
            )}>
              {MOCK_DECK.dueCount > 0 ? `${MOCK_DECK.dueCount} đến hạn` : "Không có từ đến hạn"}
            </Text>
          </View>

          <View className="gap-3">
            {/* Primary Action: Ôn SRS */}
            <Pressable 
              onPress={() => showToast('Chuyển sang màn hình Ôn tập SRS (MH-LEARN-05)')}
              className={cn(
                "h-14 rounded-2xl border-b-[4px] items-center justify-center flex-row gap-2 active:translate-y-[2px] active:border-b-[2px] transition-all",
                MOCK_DECK.dueCount > 0 
                  ? "bg-warning-500 border-warning-700 active:bg-warning-600" 
                  : "bg-neutral-100 border-neutral-300 active:bg-neutral-200"
              )}
            >
              <BrainCircuitIcon size={22} className={MOCK_DECK.dueCount > 0 ? "text-white" : "text-neutral-500"} />
              <Text className={cn(
                "font-extrabold text-[16px] uppercase font-nunito tracking-wide",
                MOCK_DECK.dueCount > 0 ? "text-white" : "text-neutral-500"
              )}>
                Ôn SRS
              </Text>
            </Pressable>

            {/* Secondary Actions */}
            <View className="flex-row gap-3">
              <Pressable 
                onPress={() => router.push('/study/srs-review')}
                className="flex-1 h-12 bg-primary-500 rounded-xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all flex-row items-center justify-center gap-2"
              >
                <BookOpenIcon size={18} className="text-white" />
                <Text className="font-extrabold text-[14px] text-white uppercase font-nunito tracking-wide">Học Cards</Text>
              </Pressable>
              <Pressable 
                onPress={() => router.push('/study/quiz-setup')}
                className="flex-1 h-12 bg-info-500 rounded-xl border-b-[4px] border-info-700 active:bg-info-600 active:translate-y-[2px] active:border-b-[2px] transition-all flex-row items-center justify-center gap-2"
              >
                <PlayIcon size={18} className="text-white" />
                <Text className="font-extrabold text-[14px] text-white uppercase font-nunito tracking-wide">Làm Quiz</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* 3. FILTER TOOLBAR */}
        <View className="px-4 py-3 flex-row items-center gap-2 border-b border-neutral-100 bg-white/50 mb-3">
          <Pressable 
            onPress={() => setActiveFilter(activeFilter === 'reviewing' ? null : 'reviewing')}
            className={cn(
              "flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg border",
              activeFilter 
                ? "bg-mascot-navy border-mascot-navy" 
                : "bg-white border-neutral-200"
            )}
          >
            <FilterIcon size={14} className={activeFilter ? "text-white" : "text-neutral-500"} />
            <Text className={cn(
              "font-bold text-[13px] font-inter",
              activeFilter ? "text-white" : "text-neutral-600"
            )}>
              {activeFilter ? STATE_CONFIG[activeFilter].label : 'Trạng thái'}
            </Text>
            {activeFilter && (
              <XIcon size={14} className="text-white ml-1 opacity-80" />
            )}
          </Pressable>
          
          <Pressable className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200">
            <ArrowUpDownIcon size={14} className="text-neutral-500" />
            <Text className="font-bold text-[13px] text-neutral-600 font-inter">Mới lưu nhất</Text>
          </Pressable>
        </View>

        {/* 4. NOTES LIST */}
        <View className="px-4 gap-3">
          <Text className="font-extrabold text-[13px] text-neutral-400 font-nunito uppercase tracking-widest px-1 mb-1">
            TỪ VỰNG ({filteredNotes.length})
          </Text>

          {filteredNotes.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Snapy pose="to_mo" animation="idle" className="w-24 h-24 mb-4 opacity-80" />
              <Text className="font-bold text-[15px] text-neutral-500 font-inter">Không có từ phù hợp</Text>
              {activeFilter && (
                <Pressable onPress={() => setActiveFilter(null)} className="mt-3 bg-neutral-100 px-4 py-2 rounded-lg">
                  <Text className="font-bold text-[14px] text-neutral-600 font-inter">Xóa bộ lọc</Text>
                </Pressable>
              )}
            </View>
          ) : (
            filteredNotes.map((note) => {
              const stateCfg = STATE_CONFIG[note.state];
              
              return (
                <Pressable 
                  key={note.id}
                  onPress={() => router.push(`/dictionary/${note.word}` as any)}
                  className="bg-white rounded-[16px] p-4 border border-neutral-100 shadow-sm shadow-black/5 active:bg-neutral-50 transition-all flex-row items-center"
                >
                  <View className="flex-1 pr-3">
                    <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-0.5">{note.word}</Text>
                    <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-2.5">{note.meaning}</Text>
                    
                    <View className="flex-row items-center gap-2">
                      <View className={cn("px-2 py-0.5 rounded border", stateCfg.bg, stateCfg.border)}>
                        <Text className={cn("font-bold text-[11px] font-inter uppercase tracking-wide", stateCfg.text)}>
                          {stateCfg.label}
                        </Text>
                      </View>
                      <View className="px-2 py-0.5 rounded border border-neutral-200 bg-neutral-50">
                        <Text className="font-bold text-[11px] text-neutral-400 font-inter uppercase tracking-wide">
                          {note.source}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Pressable 
                    onPress={(e) => {
                      e.stopPropagation();
                      setActiveNoteMenu(activeNoteMenu === note.id ? null : note.id);
                    }}
                    className="w-10 h-10 items-center justify-center rounded-full bg-neutral-50 active:bg-neutral-100 relative"
                  >
                    <MoreVerticalIcon size={20} className="text-neutral-500" />
                    
                    {/* INLINE ACTION MENU MOCK */}
                    {activeNoteMenu === note.id && (
                      <View className="absolute top-12 right-0 w-36 bg-white rounded-xl border border-neutral-100 shadow-lg shadow-black/10 py-1 z-50">
                        <Pressable 
                          onPress={(e) => { e.stopPropagation(); handleOpenEdit(note); }}
                          className="flex-row items-center gap-3 px-4 py-2.5 active:bg-neutral-50"
                        >
                          <Edit3Icon size={16} className="text-neutral-600" />
                          <Text className="font-bold text-[14px] text-neutral-600 font-inter">Sửa</Text>
                        </Pressable>
                        <Pressable 
                          onPress={(e) => { e.stopPropagation(); showToast('Đã lưu trữ từ'); setActiveNoteMenu(null); }}
                          className="flex-row items-center gap-3 px-4 py-2.5 active:bg-neutral-50 border-b border-neutral-100"
                        >
                          <ArchiveIcon size={16} className="text-neutral-600" />
                          <Text className="font-bold text-[14px] text-neutral-600 font-inter">Lưu trữ</Text>
                        </Pressable>
                        <Pressable 
                          onPress={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                          className="flex-row items-center gap-3 px-4 py-2.5 active:bg-error-50"
                        >
                          <Trash2Icon size={16} className="text-error-500" />
                          <Text className="font-bold text-[14px] text-error-600 font-inter">Xóa</Text>
                        </Pressable>
                      </View>
                    )}
                  </Pressable>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* 5. EDIT NOTE BOTTOM SHEET */}
      <Modal
        visible={!!editingNote}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingNote(null)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 bg-black/40 justify-end"
        >
          <View className="bg-white rounded-t-[24px] shadow-xl h-[85%]">
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-neutral-100">
              <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">Chỉnh sửa từ</Text>
              <Pressable 
                onPress={() => setEditingNote(null)}
                className="w-8 h-8 bg-neutral-100 rounded-full items-center justify-center active:bg-neutral-200"
              >
                <XIcon size={18} className="text-neutral-500" />
              </Pressable>
            </View>

            <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
              <View className="bg-primary-50 p-4 rounded-xl border border-primary-100 mb-6">
                <Text className="font-extrabold text-[24px] text-primary-700 font-nunito">{editingNote?.word}</Text>
              </View>

              <View className="mb-5">
                <Text className="font-bold text-[14px] text-neutral-500 font-inter mb-2">Nghĩa</Text>
                <TextInput 
                  value={editForm.meaning}
                  onChangeText={(t) => setEditForm(p => ({...p, meaning: t}))}
                  className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 font-inter text-[15px] text-mascot-navy"
                />
              </View>

              <View className="mb-5">
                <Text className="font-bold text-[14px] text-neutral-500 font-inter mb-2">Phiên âm</Text>
                <TextInput 
                  value={editForm.ipa}
                  onChangeText={(t) => setEditForm(p => ({...p, ipa: t}))}
                  placeholder="Nhập phiên âm..."
                  placeholderTextColor="#9597AD"
                  className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 font-inter text-[15px] text-mascot-navy"
                />
              </View>

              <View className="mb-5">
                <Text className="font-bold text-[14px] text-neutral-500 font-inter mb-2">Ví dụ</Text>
                <TextInput 
                  value={editForm.example}
                  onChangeText={(t) => setEditForm(p => ({...p, example: t}))}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 font-inter text-[15px] text-mascot-navy min-h-[80px]"
                />
              </View>

              <View className="mb-10">
                <Text className="font-bold text-[14px] text-info-600 font-inter mb-2">Ghi chú cá nhân</Text>
                <TextInput 
                  value={editForm.personalNote}
                  onChangeText={(t) => setEditForm(p => ({...p, personalNote: t}))}
                  placeholder="Thêm ghi chú của riêng bạn..."
                  placeholderTextColor="#9597AD"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="bg-info-50 border border-info-200 rounded-xl px-4 py-3 font-inter text-[15px] text-mascot-navy min-h-[80px]"
                />
              </View>
            </ScrollView>

            <View className="p-4 border-t border-neutral-100 bg-white">
              <Pressable 
                onPress={handleSaveEdit}
                className="h-14 bg-primary-500 rounded-xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] transition-all items-center justify-center flex-row gap-2"
              >
                <CheckIcon size={20} className="text-white" />
                <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wide">Lưu thay đổi</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 6. TOAST NOTIFICATION */}
      {toastMsg && (
        <Animated.View 
          style={{ opacity: toastAnim, transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }}
          className="absolute top-[60px] left-4 right-4 bg-mascot-navy px-4 py-3 rounded-xl shadow-lg flex-row items-center justify-center z-50"
        >
          <Text className="font-bold text-[14px] text-white font-inter text-center">{toastMsg}</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
