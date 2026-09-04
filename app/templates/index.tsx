import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeftIcon,
  CopyIcon,
  Edit2Icon,
  Trash2Icon,
  MoreVerticalIcon,
  CheckIcon,
  PlusIcon,
  SearchIcon,
  BookOpenIcon,
  RotateCcwIcon,
  HeadphonesIcon,
  ImageIcon,
  KeyboardIcon,
  MessageSquareIcon,
  XIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// ==========================================
// TYPES & MOCK DATA
// ==========================================
type TemplateType = 'system' | 'custom';
type InteractionType = 'Flip' | 'Type-in' | 'Tap-to-reveal' | 'Audio';

interface Template {
  id: string;
  name: string;
  description: string;
  type: TemplateType;
  interactionType: InteractionType;
  usageCount: number;
  icon: any;
  iconColor: string;
  updatedAt?: string;
}

const SYSTEM_TEMPLATES: Template[] = [
  { id: 'sys_classic', name: 'CLASSIC', description: 'Flashcard cơ bản với mặt trước là từ vựng, mặt sau là nghĩa.', type: 'system', interactionType: 'Flip', usageCount: 12, icon: BookOpenIcon, iconColor: 'text-primary-500 bg-primary-50 border-primary-200' },
  { id: 'sys_reverse', name: 'REVERSE', description: 'Mặt trước là nghĩa, mặt sau là từ vựng.', type: 'system', interactionType: 'Flip', usageCount: 5, icon: RotateCcwIcon, iconColor: 'text-warning-500 bg-warning-50 border-warning-200' },
  { id: 'sys_listening', name: 'LISTENING', description: 'Luyện nghe với audio trước, hiển thị chữ sau.', type: 'system', interactionType: 'Audio', usageCount: 8, icon: HeadphonesIcon, iconColor: 'text-info-500 bg-info-50 border-info-200' },
  { id: 'sys_image', name: 'IMAGE_VOCAB', description: 'Học qua hình ảnh minh hoạ trực quan.', type: 'system', interactionType: 'Flip', usageCount: 15, icon: ImageIcon, iconColor: 'text-success-500 bg-success-50 border-success-200' },
  { id: 'sys_spelling', name: 'SPELLING', description: 'Gõ lại từ vựng dựa trên nghĩa hoặc âm thanh.', type: 'system', interactionType: 'Type-in', usageCount: 3, icon: KeyboardIcon, iconColor: 'text-error-500 bg-error-50 border-error-200' },
  { id: 'sys_context', name: 'CONTEXT', description: 'Học từ vựng qua câu ví dụ thực tế.', type: 'system', interactionType: 'Flip', usageCount: 20, icon: MessageSquareIcon, iconColor: 'text-mascot-navy bg-mascot-50 border-mascot-200' },
];

const INITIAL_CUSTOM_TEMPLATES: Template[] = [
  { id: 'cus_1', name: 'IELTS Vocabulary', description: 'Mẫu riêng dành cho bộ từ vựng IELTS của tôi.', type: 'custom', interactionType: 'Flip', usageCount: 2, icon: BookOpenIcon, iconColor: 'text-primary-500 bg-primary-50 border-primary-200', updatedAt: '2 days ago' },
  { id: 'cus_2', name: 'Hard Spelling', description: 'Chuyên dùng để gõ lại những từ hay viết sai.', type: 'custom', interactionType: 'Type-in', usageCount: 0, icon: KeyboardIcon, iconColor: 'text-error-500 bg-error-50 border-error-200', updatedAt: '1 week ago' },
];

export default function TemplateManagementScreen() {
  const params = useLocalSearchParams();
  const mode = params.mode === 'PICK_FOR_DECK' ? 'PICK_FOR_DECK' : 'MANAGE';
  const deckId = params.deckId as string;
  const initialTemplateId = (params.currentTemplateId as string) || 'sys_classic';

  const [activeTab, setActiveTab] = useState<'system' | 'custom'>('system');
  const [customTemplates, setCustomTemplates] = useState<Template[]>(INITIAL_CUSTOM_TEMPLATES);
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(initialTemplateId);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  
  // Modals
  const [showApplyConfirm, setShowApplyConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Constants
  const MAX_CUSTOM_TEMPLATES = 20;
  const isAtLimit = customTemplates.length >= MAX_CUSTOM_TEMPLATES;

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleApply = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowApplyConfirm(false);
      router.back();
      // In real app: show Toast "Đã áp dụng template"
    }, 1000);
  };

  const handleDelete = () => {
    if (!templateToDelete) return;
    setIsProcessing(true);
    setTimeout(() => {
      setCustomTemplates(prev => prev.filter(t => t.id !== templateToDelete.id));
      setIsProcessing(false);
      setShowDeleteConfirm(false);
      setTemplateToDelete(null);
    }, 1000);
  };

  const openActionMenu = (item: Template) => {
    setActionMenuId(item.id);
  };

  // ==========================================
  // RENDER CARDS
  // ==========================================
  const renderTemplateCard = (item: Template) => {
    const isCurrentForDeck = mode === 'PICK_FOR_DECK' && item.id === initialTemplateId;
    const isSelected = mode === 'PICK_FOR_DECK' && item.id === selectedTemplateId;
    const Icon = item.icon;

    return (
      <Pressable 
        key={item.id} 
        onPress={() => {
          if (mode === 'PICK_FOR_DECK') {
            setSelectedTemplateId(item.id);
          } else {
            // Open preview
            const config = JSON.stringify({
              name: item.name,
              baseLayout: 'SINGLE_COLUMN',
              frontFields: [
                { id: 'WORD', label: 'Từ vựng', sample: 'abandon', enabled: true, isPrimary: true },
                { id: 'IPA', label: 'Phiên âm', sample: '/əˈbændən/', enabled: true, isPrimary: false },
              ],
              backFields: [
                { id: 'MEANING', label: 'Nghĩa', sample: 'từ bỏ', enabled: true, isPrimary: true },
                { id: 'EXAMPLE', label: 'Ví dụ', sample: 'He abandoned the plan.', enabled: true, isPrimary: false },
              ],
              interactionType: item.interactionType === 'Type-in' ? 'TYPE_IN' : item.interactionType === 'Tap-to-reveal' ? 'TAP_TO_REVEAL' : 'FLIP',
              strictMode: false,
              templateType: item.type,
            });
            router.push({ pathname: '/templates/preview' as any, params: { source: 'FROM_TEMPLATE_LIST', templateConfig: config, templateId: item.id } });
          }
        }}
        className={cn(
          "bg-white rounded-[24px] border-2 shadow-sm shadow-black/5 overflow-hidden mb-4 p-4",
          isSelected ? "border-primary-500 bg-primary-50/30" : "border-neutral-100"
        )}
      >
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-row items-center flex-1 pr-2">
            <View className={cn(
              "w-12 h-12 rounded-xl items-center justify-center border mr-3 shadow-sm",
              item.iconColor.split(' ').slice(1).join(' ')
            )}>
              <Icon size={24} className={item.iconColor.split(' ')[0]} />
            </View>
            <View className="flex-1">
              <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-0.5">
                {item.name}
              </Text>
              <View className="flex-row items-center">
                <View className="bg-neutral-100 px-2 py-0.5 rounded-md mr-2">
                  <Text className="font-bold text-[10px] text-neutral-500 font-inter uppercase">
                    {item.interactionType}
                  </Text>
                </View>
                {isCurrentForDeck && (
                  <View className="bg-success-100 px-2 py-0.5 rounded-md flex-row items-center gap-1 border border-success-200">
                    <CheckIcon size={10} className="text-success-600" />
                    <Text className="font-bold text-[10px] text-success-600 font-inter uppercase">Đang dùng</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          
          {item.type === 'custom' && mode === 'MANAGE' && (
            <Pressable onPress={() => openActionMenu(item)} className="p-2 -mr-2 -mt-2">
              <MoreVerticalIcon size={20} className="text-neutral-400" />
            </Pressable>
          )}
        </View>

        <Text className="font-medium text-[13px] text-neutral-500 font-inter mb-4 leading-relaxed">
          {item.description}
        </Text>

        <View className="flex-row items-center justify-between mt-auto">
          <Text className="font-bold text-[12px] text-neutral-400 font-inter">
            {item.usageCount} Deck đang dùng
          </Text>
          {item.type === 'system' ? (
            <Pressable 
              onPress={() => {
                router.push({ pathname: '/templates/builder' as any, params: { mode: 'CREATE_FROM_SYSTEM', id: item.id } });
              }}
              className="flex-row items-center gap-1 active:opacity-70"
            >
              <CopyIcon size={14} className="text-primary-500" />
              <Text className="font-bold text-[13px] text-primary-500 font-inter">Nhân bản để sửa</Text>
            </Pressable>
          ) : (
            <Text className="font-medium text-[12px] text-neutral-400 font-inter">
              Updated {item.updatedAt}
            </Text>
          )}
        </View>
      </Pressable>
    );
  };

  // ==========================================
  // RENDER MAIN SCREEN
  // ==========================================
  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* 1. HEADER */}
      <View className="px-4 py-3 border-b border-neutral-100 bg-white flex-row items-center justify-between z-10 shadow-sm shadow-black/5">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2 active:bg-neutral-100 rounded-full">
          <ArrowLeftIcon size={24} className="text-mascot-navy" />
        </Pressable>
        <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito flex-1 ml-2">Card Templates</Text>
      </View>

      {/* 2. TABS */}
      <View className="bg-white border-b border-neutral-100 flex-row px-4 pt-2">
        <Pressable 
          onPress={() => setActiveTab('system')}
          className={cn(
            "flex-1 items-center py-3 border-b-2",
            activeTab === 'system' ? "border-primary-500" : "border-transparent"
          )}
        >
          <Text className={cn(
            "font-extrabold text-[15px] font-nunito",
            activeTab === 'system' ? "text-primary-600" : "text-neutral-400"
          )}>Hệ thống</Text>
        </Pressable>
        <Pressable 
          onPress={() => setActiveTab('custom')}
          className={cn(
            "flex-1 items-center py-3 border-b-2 flex-row justify-center gap-2",
            activeTab === 'custom' ? "border-primary-500" : "border-transparent"
          )}
        >
          <Text className={cn(
            "font-extrabold text-[15px] font-nunito",
            activeTab === 'custom' ? "text-primary-600" : "text-neutral-400"
          )}>Của tôi</Text>
          <View className="bg-neutral-100 px-2 py-0.5 rounded-full">
            <Text className="font-bold text-[10px] text-neutral-500 font-inter tabular-nums">
              {customTemplates.length}/20
            </Text>
          </View>
        </Pressable>
      </View>

      {/* 3. LIST */}
      <ScrollView 
        contentContainerStyle={{ padding: 16, paddingBottom: mode === 'PICK_FOR_DECK' ? 100 : 100 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'system' && SYSTEM_TEMPLATES.map(renderTemplateCard)}

        {activeTab === 'custom' && (
          <>
            {customTemplates.map(renderTemplateCard)}

            {customTemplates.length === 0 && (
              <View className="items-center justify-center py-10 opacity-70 bg-white rounded-3xl border border-neutral-100 border-dashed mb-6">
                <Snapy pose="curious" className="w-20 h-20 mb-4" />
                <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-1">Chưa có template nào</Text>
                <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center px-6">
                  Hãy nhân bản một mẫu hệ thống để bắt đầu tùy chỉnh theo ý bạn.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* ==========================================
          4. FLOATING ACTIONS
          ========================================== */}
      
      {/* MANAGE MODE: Create Button */}
      {mode === 'MANAGE' && activeTab === 'custom' && (
        <View className="absolute bottom-6 left-0 right-0 px-6">
          <Pressable 
            onPress={() => {
              if (!isAtLimit) {
                router.push({ pathname: '/templates/builder' as any, params: { mode: 'CREATE' } });
              }
            }}
            disabled={isAtLimit}
            className={cn(
              "w-full h-14 rounded-2xl flex-row items-center justify-center shadow-lg border-b-[4px]",
              isAtLimit 
                ? "bg-neutral-300 border-neutral-400 shadow-neutral-400/30 opacity-90"
                : "bg-primary-500 border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] shadow-primary-500/30"
            )}
          >
            <PlusIcon size={20} className="text-white mr-2" />
            <Text className="font-extrabold text-[16px] text-white font-nunito tracking-wide">
              {isAtLimit ? 'Đã đạt giới hạn 20 template' : 'Tạo template mới'}
            </Text>
          </Pressable>
        </View>
      )}

      {/* PICK_FOR_DECK MODE: Apply Button */}
      {mode === 'PICK_FOR_DECK' && selectedTemplateId !== initialTemplateId && (
        <View className="absolute bottom-6 left-0 right-0 px-6">
          <Pressable 
            onPress={() => setShowApplyConfirm(true)}
            className="w-full h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 items-center justify-center shadow-lg shadow-primary-500/30 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px]"
          >
            <Text className="font-extrabold text-[16px] text-white font-nunito tracking-wide">
              Áp dụng cho Deck
            </Text>
          </Pressable>
        </View>
      )}

      {/* ==========================================
          5. MODALS & BOTTOM SHEETS
          ========================================== */}

      {/* Action Menu Bottom Sheet (Custom Templates) */}
      <Modal
        visible={!!actionMenuId}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/40 justify-end">
          <Pressable className="absolute inset-0" onPress={() => setActionMenuId(null)} />
          <View className="bg-white rounded-t-[32px] p-4 pb-8 shadow-xl">
            <View className="w-12 h-1.5 bg-neutral-200 rounded-full mb-6 self-center" />
            
            <Pressable 
              onPress={() => {
                const id = actionMenuId;
                setActionMenuId(null);
                if (id) {
                  router.push({ pathname: '/templates/builder' as any, params: { mode: 'EDIT', id } });
                }
              }}
              className="flex-row items-center p-4 active:bg-neutral-50 rounded-xl"
            >
              <Edit2Icon size={20} className="text-neutral-600 mr-4" />
              <Text className="font-bold text-[16px] text-mascot-navy font-inter">Chỉnh sửa (Edit)</Text>
            </Pressable>
            
            <Pressable 
              onPress={() => {
                const id = actionMenuId;
                setActionMenuId(null);
                if (id && !isAtLimit) {
                  router.push({ pathname: '/templates/builder' as any, params: { mode: 'CREATE', id } });
                }
              }}
              className="flex-row items-center p-4 active:bg-neutral-50 rounded-xl"
            >
              <CopyIcon size={20} className="text-neutral-600 mr-4" />
              <Text className="font-bold text-[16px] text-mascot-navy font-inter">Nhân bản (Duplicate)</Text>
            </Pressable>
            
            <Pressable 
              onPress={() => {
                const target = customTemplates.find(t => t.id === actionMenuId);
                if (target) {
                  setTemplateToDelete(target);
                  setShowDeleteConfirm(true);
                }
                setActionMenuId(null);
              }}
              className="flex-row items-center p-4 active:bg-error-50 rounded-xl mt-2 border border-error-100 bg-error-50/50"
            >
              <Trash2Icon size={20} className="text-error-500 mr-4" />
              <Text className="font-bold text-[16px] text-error-600 font-inter">Xóa template</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Apply Confirmation */}
      <Modal visible={showApplyConfirm} transparent animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center p-6">
          <View className="bg-white rounded-[32px] p-6 w-full max-w-[340px] shadow-xl">
            <View className="w-16 h-16 bg-primary-50 rounded-full items-center justify-center mb-4 border border-primary-100 self-center">
              <CheckIcon size={32} className="text-primary-500" />
            </View>
            <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2 text-center">
              Đổi Template
            </Text>
            <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center mb-6 leading-relaxed">
              Thẻ trong Deck sẽ hiển thị theo mẫu mới từ phiên học tiếp theo. <Text className="font-bold text-mascot-navy">Tiến độ ôn tập SRS vẫn được giữ nguyên.</Text>
            </Text>
            
            <View className="gap-3">
              <Pressable 
                onPress={handleApply}
                disabled={isProcessing}
                className="w-full h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 items-center justify-center active:bg-primary-600"
              >
                {isProcessing ? <ActivityIndicator color="white" /> : <Text className="font-extrabold text-[16px] text-white font-nunito">Áp dụng</Text>}
              </Pressable>
              <Pressable 
                onPress={() => setShowApplyConfirm(false)}
                disabled={isProcessing}
                className="w-full h-12 bg-neutral-100 rounded-xl items-center justify-center active:bg-neutral-200"
              >
                <Text className="font-bold text-[15px] text-neutral-600 font-inter">Hủy bỏ</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation */}
      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center p-6">
          <View className="bg-white rounded-[32px] p-6 w-full max-w-[340px] shadow-xl">
            <View className="w-16 h-16 bg-error-50 rounded-full items-center justify-center mb-4 border border-error-100 self-center">
              <Trash2Icon size={32} className="text-error-500" />
            </View>
            <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2 text-center">
              Xóa Template?
            </Text>
            <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center mb-6 leading-relaxed">
              {templateToDelete?.usageCount && templateToDelete.usageCount > 0 
                ? <><Text className="font-bold text-error-600">{templateToDelete.usageCount} Deck</Text> đang dùng template này sẽ được tự động chuyển về mặc định (CLASSIC). Card và tiến độ học không bị mất.</>
                : "Bạn có chắc chắn muốn xóa template này không?"
              }
            </Text>
            
            <View className="gap-3">
              <Pressable 
                onPress={handleDelete}
                disabled={isProcessing}
                className="w-full h-14 bg-error-500 rounded-2xl border-b-[4px] border-error-700 items-center justify-center active:bg-error-600"
              >
                {isProcessing ? <ActivityIndicator color="white" /> : <Text className="font-extrabold text-[16px] text-white font-nunito uppercase tracking-wide">Xóa</Text>}
              </Pressable>
              <Pressable 
                onPress={() => setShowDeleteConfirm(false)}
                disabled={isProcessing}
                className="w-full h-12 bg-neutral-100 rounded-xl items-center justify-center active:bg-neutral-200"
              >
                <Text className="font-bold text-[15px] text-neutral-600 font-inter">Hủy bỏ</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
