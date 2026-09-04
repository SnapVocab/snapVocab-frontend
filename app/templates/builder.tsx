import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Modal, ActivityIndicator, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeftIcon,
  CheckIcon,
  XIcon,
  LayoutIcon,
  ColumnsIcon,
  ImageIcon,
  HeadphonesIcon,
  MenuIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SettingsIcon,
  RotateCcwIcon,
  KeyboardIcon,
  ListIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// ==========================================
// TYPES & MOCK DATA
// ==========================================
type FieldType = 'WORD' | 'MEANING' | 'PART_OF_SPEECH' | 'EXAMPLE' | 'PERSONAL_NOTE' | 'IPA' | 'AUDIO' | 'IMAGE';
type BaseLayout = 'SINGLE_COLUMN' | 'TWO_COLUMN' | 'IMAGE_TOP' | 'AUDIO_CENTER';
type InteractionType = 'FLIP' | 'TYPE_IN' | 'TAP_TO_REVEAL';

interface FieldConfig {
  autoPlay?: boolean;
  maskPattern?: '___' | '•••';
  showAll?: boolean;
}

interface TemplateField {
  id: FieldType;
  label: string;
  sample: string;
  enabled: boolean;
  isPrimary: boolean;
  config?: FieldConfig;
}

const ALL_FIELDS_DEF: Omit<TemplateField, 'enabled' | 'isPrimary'>[] = [
  { id: 'WORD', label: 'Từ vựng', sample: 'abandon' },
  { id: 'MEANING', label: 'Nghĩa', sample: 'từ bỏ' },
  { id: 'PART_OF_SPEECH', label: 'Từ loại', sample: 'verb' },
  { id: 'EXAMPLE', label: 'Ví dụ', sample: 'He abandoned the plan.' },
  { id: 'PERSONAL_NOTE', label: 'Ghi chú cá nhân', sample: 'Remember this word.' },
  { id: 'IPA', label: 'Phiên âm', sample: '/əˈbændən/' },
  { id: 'AUDIO', label: 'Âm thanh', sample: '▶' },
  { id: 'IMAGE', label: 'Hình ảnh', sample: '🖼️ [image]' },
];

export default function TemplateBuilderScreen() {
  const params = useLocalSearchParams();
  const mode = params.mode as 'CREATE' | 'EDIT' | 'CREATE_FROM_SYSTEM';
  const sourceMode = params.sourceMode as string; // 'PICK_FOR_DECK' or undefined
  const deckId = params.deckId as string;

  // Wizard State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Modals & Bottom Sheets
  const [showApplyDeckConfirm, setShowApplyDeckConfirm] = useState(false);
  const [activeConfigField, setActiveConfigField] = useState<TemplateField | null>(null);
  
  // ==========================================
  // DRAFT STATE
  // ==========================================
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [baseLayout, setBaseLayout] = useState<BaseLayout>('SINGLE_COLUMN');
  
  const [frontFields, setFrontFields] = useState<TemplateField[]>(
    ALL_FIELDS_DEF.map(f => ({ ...f, enabled: f.id === 'WORD', isPrimary: f.id === 'WORD' }))
  );
  
  const [backFields, setBackFields] = useState<TemplateField[]>(
    ALL_FIELDS_DEF.map(f => ({ ...f, enabled: f.id === 'MEANING', isPrimary: f.id === 'MEANING' }))
  );
  
  const [interactionType, setInteractionType] = useState<InteractionType>('FLIP');
  const [strictMode, setStrictMode] = useState(false);
  
  const [validationError, setValidationError] = useState<string | null>(null);

  // ==========================================
  // HANDLERS: Navigation
  // ==========================================
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => (prev - 1) as any);
    } else {
      // Check if dirtied (simplified check for MVP: always warn if they typed a name or changed fields)
      if (name.length > 0 || frontFields.some(f => f.enabled) || backFields.some(f => f.enabled)) {
        setShowExitConfirm(true);
      } else {
        router.back();
      }
    }
  };

  const handleNext = () => {
    setValidationError(null);
    
    // Step 1 Validation
    if (currentStep === 1 && name.trim() === '') {
      setValidationError('Nhập tên cho template');
      return;
    }
    
    // Step 2 Validation
    if (currentStep === 2 && !frontFields.some(f => f.enabled)) {
      setValidationError('Mặt trước cần ít nhất 1 field');
      return;
    }
    
    // Step 3 Validation
    if (currentStep === 3 && !backFields.some(f => f.enabled)) {
      setValidationError('Mặt sau cần ít nhất 1 field');
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(prev => (prev + 1) as any);
    }
  };

  const handleSave = () => {
    // Step 4 Validation
    if (interactionType === 'TYPE_IN') {
      const hasWordInBack = backFields.find(f => f.id === 'WORD')?.enabled;
      if (!hasWordInBack) {
        setValidationError('Kiểu gõ đáp án cần field Từ vựng ở mặt sau');
        return;
      }
    }

    setIsSaving(true);
    
    // Simulate API Call
    setTimeout(() => {
      setIsSaving(false);
      
      if (sourceMode === 'PICK_FOR_DECK' && deckId) {
        setShowApplyDeckConfirm(true);
      } else {
        // Success, return to management
        router.back();
      }
    }, 1500);
  };
  
  const applyToDeck = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowApplyDeckConfirm(false);
      router.back(); // Go back to Builder
      setTimeout(() => router.back(), 100); // And go back to Deck
    }, 1000);
  };

  const fixTypeInError = () => {
    // Quick Add WORD to BACK
    setBackFields(prev => prev.map(f => f.id === 'WORD' ? { ...f, enabled: true } : f));
    setCurrentStep(3); // Go to Step 3
    setValidationError(null);
  };

  // ==========================================
  // HANDLERS: Fields Manipulation
  // ==========================================
  const toggleField = (side: 'front' | 'back', fieldId: FieldType) => {
    const setter = side === 'front' ? setFrontFields : setBackFields;
    setter(prev => {
      const newList = prev.map(f => f.id === fieldId ? { ...f, enabled: !f.enabled } : f);
      // Auto-assign primary if it's the only one
      const enabledFields = newList.filter(f => f.enabled);
      if (enabledFields.length === 1) {
        return newList.map(f => f.id === enabledFields[0].id ? { ...f, isPrimary: true } : { ...f, isPrimary: false });
      }
      return newList;
    });
  };

  const setPrimaryField = (side: 'front' | 'back', fieldId: FieldType) => {
    const setter = side === 'front' ? setFrontFields : setBackFields;
    setter(prev => prev.map(f => ({ ...f, isPrimary: f.id === fieldId })));
  };

  const moveField = (side: 'front' | 'back', index: number, direction: 'up' | 'down') => {
    const setter = side === 'front' ? setFrontFields : setBackFields;
    setter(prev => {
      const arr = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < arr.length) {
        // Swap
        [arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]];
      }
      return arr;
    });
  };

  // ==========================================
  // RENDER HELPERS
  // ==========================================
  const renderMiniPreview = (fields: TemplateField[]) => {
    const enabledFields = fields.filter(f => f.enabled);
    if (enabledFields.length === 0) {
      return (
        <View className="h-32 bg-[#F7F8FA] border border-neutral-200 border-dashed rounded-2xl items-center justify-center mb-6">
          <Text className="font-medium text-[13px] text-neutral-400 font-inter">Trống</Text>
        </View>
      );
    }

    return (
      <View className="bg-[#F7F8FA] border border-neutral-200 rounded-2xl p-4 items-center justify-center min-h-[140px] mb-6 shadow-sm shadow-black/5">
        <View className="absolute top-2 right-3">
          <Text className="font-bold text-[10px] text-neutral-400 font-inter uppercase">MINI PREVIEW</Text>
        </View>
        {enabledFields.map(f => (
          <Text 
            key={f.id}
            className={cn(
              "font-inter text-mascot-navy text-center mb-2",
              f.isPrimary ? "font-extrabold text-[24px] font-nunito" : "font-medium text-[15px]"
            )}
          >
            {f.id === 'EXAMPLE' && f.config?.maskPattern ? f.sample.replace('abandon', f.config.maskPattern) : f.sample}
          </Text>
        ))}
      </View>
    );
  };

  const renderFieldRow = (side: 'front' | 'back', field: TemplateField, index: number, total: number) => {
    const hasConfig = ['AUDIO', 'EXAMPLE', 'MEANING', 'IPA', 'PART_OF_SPEECH', 'PERSONAL_NOTE'].includes(field.id);
    const showUp = index > 0;
    const showDown = index < total - 1;

    return (
      <View 
        key={field.id} 
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          marginBottom: 8,
          borderRadius: 12,
          borderWidth: 1,
          backgroundColor: field.enabled ? '#FFFFFF' : '#FAFAFA',
          borderColor: field.enabled ? '#E0E7FF' : '#F5F5F5',
          opacity: field.enabled ? 1 : 0.6,
        }}
      >
        {/* Drag Handle (Simulated with up/down arrows for MVP) */}
        <View style={{ marginRight: 12, alignItems: 'center', justifyContent: 'center', width: 24 }}>
          {field.enabled ? (
            <View style={{ gap: 4 }}>
              <Pressable onPress={() => moveField(side, index, 'up')} disabled={!showUp} style={{ opacity: showUp ? 1 : 0.2 }}>
                <ArrowUpIcon size={16} color="#9CA3AF" />
              </Pressable>
              <Pressable onPress={() => moveField(side, index, 'down')} disabled={!showDown} style={{ opacity: showDown ? 1 : 0.2 }}>
                <ArrowDownIcon size={16} color="#9CA3AF" />
              </Pressable>
            </View>
          ) : (
            <MenuIcon size={18} color="#D1D5DB" />
          )}
        </View>
        
        {/* Toggle */}
        <Switch 
          value={field.enabled}
          onValueChange={() => toggleField(side, field.id)}
          trackColor={{ false: '#E5E7EB', true: '#58CC02' }}
          thumbColor={'#FFFFFF'}
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />

        {/* Info */}
        <View style={{ flex: 1, marginLeft: 8, justifyContent: 'center' }}>
          <Text style={{ fontWeight: '700', fontSize: 14, color: field.enabled ? '#1B2541' : '#9CA3AF' }}>
            {field.label}
          </Text>
          <Text style={{ fontWeight: '500', fontSize: 11, color: '#9CA3AF', marginTop: 2 }} numberOfLines={1}>
            {field.sample}
          </Text>
        </View>

        {/* Primary Radio */}
        {field.enabled && (
          <Pressable 
            onPress={() => setPrimaryField(side, field.id)}
            style={{ padding: 8, marginRight: 8, alignItems: 'center', justifyContent: 'center' }}
          >
            <View style={{
              width: 20, height: 20, borderRadius: 10, borderWidth: 2,
              borderColor: field.isPrimary ? '#3B82F6' : '#D1D5DB',
              alignItems: 'center', justifyContent: 'center',
            }}>
              {field.isPrimary && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#3B82F6' }} />}
            </View>
          </Pressable>
        )}

        {/* Config Button */}
        {field.enabled && hasConfig && (
          <Pressable onPress={() => setActiveConfigField(field)} style={{ padding: 8 }}>
            <SettingsIcon size={18} color="#9CA3AF" />
          </Pressable>
        )}
      </View>
    );
  };

  // ==========================================
  // RENDER STEPS
  // ==========================================
  const renderStep1 = () => (
    <View className="flex-1">
      <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-6">Thông tin & Layout</Text>
      
      <View className="mb-6">
        <Text className="font-bold text-[14px] text-neutral-600 font-inter mb-2">Tên template</Text>
        <TextInput 
          value={name}
          onChangeText={setName}
          maxLength={50}
          placeholder="Ví dụ: My Vocabulary Card"
          className="w-full h-14 bg-white border border-neutral-200 rounded-2xl px-4 font-bold text-[15px] text-mascot-navy font-inter focus:border-primary-500"
        />
        <View className="flex-row justify-between mt-1.5 px-1">
          {validationError && currentStep === 1 ? (
            <Text className="font-bold text-[12px] text-error-500 font-inter">{validationError}</Text>
          ) : (
            <Text />
          )}
          <Text className="font-medium text-[12px] text-neutral-400 font-inter">{name.length}/50</Text>
        </View>
      </View>
      
      <View className="mb-8">
        <Text className="font-bold text-[14px] text-neutral-600 font-inter mb-2">Mô tả ngắn (Tùy chọn)</Text>
        <TextInput 
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Mô tả về cách sử dụng mẫu này..."
          className="w-full h-24 bg-white border border-neutral-200 rounded-2xl p-4 font-medium text-[14px] text-mascot-navy font-inter focus:border-primary-500"
          textAlignVertical="top"
        />
      </View>

      <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-4">Base layout</Text>
      <View className="flex-row flex-wrap justify-between gap-y-4">
        {[
          { id: 'SINGLE_COLUMN', label: '1 cột', icon: LayoutIcon },
          { id: 'TWO_COLUMN', label: '2 cột', icon: ColumnsIcon },
          { id: 'IMAGE_TOP', label: 'Ảnh trên', icon: ImageIcon },
          { id: 'AUDIO_CENTER', label: 'Audio giữa', icon: HeadphonesIcon },
        ].map(layout => {
          const isSelected = baseLayout === layout.id;
          const Icon = layout.icon;
          return (
            <Pressable 
              key={layout.id}
              onPress={() => setBaseLayout(layout.id as BaseLayout)}
              className={cn(
                "w-[48%] bg-white rounded-2xl border-2 p-4 items-center justify-center h-28 shadow-sm",
                isSelected ? "border-primary-500 shadow-primary-500/20 bg-primary-50/20" : "border-neutral-100 shadow-black/5"
              )}
            >
              <Icon size={32} className={cn("mb-2", isSelected ? "text-primary-500" : "text-neutral-400")} />
              <Text className={cn(
                "font-bold text-[13px] font-inter text-center",
                isSelected ? "text-primary-700" : "text-neutral-500"
              )}>{layout.label}</Text>
              {isSelected && (
                <View className="absolute top-2 right-2 bg-primary-500 rounded-full p-0.5">
                  <CheckIcon size={12} color="white" />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View className="flex-1">
      <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-4">Mặt trước</Text>
      
      {renderMiniPreview(frontFields)}

      <View className="flex-row items-center justify-between mb-4 mt-2">
        <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">Trường dữ liệu</Text>
        <Text className="font-bold text-[12px] text-neutral-400 font-inter uppercase tracking-wide">Trường chính</Text>
      </View>

      {validationError && currentStep === 2 && (
        <Text className="font-bold text-[13px] text-error-500 font-inter mb-4 bg-error-50 p-3 rounded-xl border border-error-100">{validationError}</Text>
      )}

      {frontFields.map((f, i) => renderFieldRow('front', f, i, frontFields.length))}
    </View>
  );

  const renderStep3 = () => (
    <View className="flex-1">
      <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-4">Mặt sau</Text>
      
      {renderMiniPreview(backFields)}

      <View className="flex-row items-center justify-between mb-4 mt-2">
        <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">Trường dữ liệu</Text>
        <Text className="font-bold text-[12px] text-neutral-400 font-inter uppercase tracking-wide">Trường chính</Text>
      </View>

      {validationError && currentStep === 3 && (
        <Text className="font-bold text-[13px] text-error-500 font-inter mb-4 bg-error-50 p-3 rounded-xl border border-error-100">{validationError}</Text>
      )}

      {backFields.map((f, i) => renderFieldRow('back', f, i, backFields.length))}
    </View>
  );

  const renderStep4 = () => (
    <View className="flex-1">
      <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-6">Kiểu tương tác</Text>

      {validationError && currentStep === 4 && (
        <View className="bg-error-50 border border-error-200 rounded-xl p-4 mb-6">
          <Text className="font-bold text-[14px] text-error-600 font-inter mb-3">{validationError}</Text>
          <Pressable 
            onPress={fixTypeInError}
            className="bg-white border border-error-200 rounded-lg py-2 px-4 self-start active:bg-neutral-50"
          >
            <Text className="font-bold text-[13px] text-error-600 font-inter">Thêm Từ vựng vào mặt sau</Text>
          </Pressable>
        </View>
      )}

      {[
        { id: 'FLIP', label: 'Chạm để lật (Flip)', desc: 'Chạm màn hình để lật xem đáp án mặt sau.', icon: RotateCcwIcon },
        { id: 'TYPE_IN', label: 'Gõ đáp án (Type-in)', desc: 'Gõ đáp án, hệ thống sẽ tự động so khớp.', icon: KeyboardIcon },
        { id: 'TAP_TO_REVEAL', label: 'Lộ đáp án (Tap-to-reveal)', desc: 'Chạm vào từng phần ẩn để lộ dần đáp án.', icon: ListIcon },
      ].map(type => {
        const isSelected = interactionType === type.id;
        const Icon = type.icon;
        
        return (
          <Pressable 
            key={type.id}
            onPress={() => setInteractionType(type.id as InteractionType)}
            className={cn(
              "w-full bg-white rounded-2xl border-2 p-4 mb-4 flex-row shadow-sm",
              isSelected ? "border-primary-500 shadow-primary-500/20 bg-primary-50/10" : "border-neutral-100 shadow-black/5"
            )}
          >
            <View className={cn(
              "w-6 h-6 rounded-full border-2 items-center justify-center mr-4 mt-1",
              isSelected ? "border-primary-500" : "border-neutral-300"
            )}>
              {isSelected && <View className="w-3 h-3 rounded-full bg-primary-500" />}
            </View>
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Icon size={18} className={isSelected ? "text-primary-600 mr-2" : "text-neutral-400 mr-2"} />
                <Text className={cn("font-extrabold text-[16px] font-nunito", isSelected ? "text-primary-700" : "text-mascot-navy")}>
                  {type.label}
                </Text>
              </View>
              <Text className="font-medium text-[13px] text-neutral-500 font-inter leading-relaxed">
                {type.desc}
              </Text>
              
              {/* Type-in Strict Mode Config */}
              {type.id === 'TYPE_IN' && isSelected && (
                <View className="mt-4 pt-4 border-t border-primary-200/50 flex-row items-center justify-between">
                  <View>
                    <Text className="font-bold text-[14px] text-mascot-navy font-inter">Strict mode</Text>
                    <Text className="font-medium text-[12px] text-neutral-500 font-inter">Phân biệt chữ hoa/thường</Text>
                  </View>
                  <Switch 
                    value={strictMode}
                    onValueChange={setStrictMode}
                    trackColor={{ false: '#E5E7EB', true: '#58CC02' }}
                    thumbColor={'#FFFFFF'}
                  />
                </View>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );

  // ==========================================
  // MAIN RENDER
  // ==========================================
  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* HEADER */}
      <View className="px-4 py-3 border-b border-neutral-100 bg-white z-10 shadow-sm shadow-black/5">
        <View className="flex-row items-center justify-between mb-4">
          <Pressable onPress={handleBack} className="w-10 h-10 items-center justify-center -ml-2 active:bg-neutral-100 rounded-full">
            <ArrowLeftIcon size={24} className="text-mascot-navy" />
          </Pressable>
          <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">
            {mode === 'EDIT' ? 'Sửa template' : 'Tạo template'}
          </Text>
          <View className="w-10 h-10" />
        </View>

        {/* STEP INDICATOR */}
        <View className="flex-row items-center justify-between px-6 pb-2">
          {[1, 2, 3, 4].map((step, idx) => (
            <React.Fragment key={step}>
              <View className="items-center">
                <View className={cn(
                  "w-8 h-8 rounded-full items-center justify-center border-2",
                  currentStep === step 
                    ? "bg-primary-500 border-primary-500" 
                    : currentStep > step 
                      ? "bg-primary-100 border-primary-500" 
                      : "bg-white border-neutral-200"
                )}>
                  {currentStep > step ? (
                    <CheckIcon size={16} className="text-primary-500" />
                  ) : (
                    <Text className={cn(
                      "font-extrabold text-[14px] font-nunito tabular-nums",
                      currentStep === step ? "text-white" : "text-neutral-400"
                    )}>{step}</Text>
                  )}
                </View>
              </View>
              {idx < 3 && (
                <View className={cn(
                  "flex-1 h-1 rounded-full",
                  currentStep > step ? "bg-primary-500" : "bg-neutral-200"
                )} />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* EDIT WARNING BANNER */}
      {mode === 'EDIT' && currentStep === 1 && (
        <View className="bg-info-50 border-b border-info-100 p-3 px-4 flex-row items-start">
          <Text className="text-[16px] mr-2">ⓘ</Text>
          <View className="flex-1">
            <Text className="font-bold text-[13px] text-info-700 font-inter mb-0.5">3 Deck đang dùng template này.</Text>
            <Text className="font-medium text-[12px] text-info-600 font-inter leading-tight">Thay đổi áp dụng từ phiên học tiếp theo, không ảnh hưởng tiến độ SRS.</Text>
          </View>
        </View>
      )}

      {/* SCROLLABLE CONTENT */}
      <ScrollView 
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </ScrollView>

      {/* BOTTOM ACTIONS */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 p-4 pb-8 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <View className="flex-row gap-3">
          {currentStep === 4 && (
            <Pressable 
              onPress={() => {
                const config = JSON.stringify({
                  name,
                  baseLayout,
                  frontFields,
                  backFields,
                  interactionType,
                  strictMode,
                });
                router.push({ pathname: '/templates/preview' as any, params: { source: 'FROM_BUILDER', templateConfig: config } });
              }}
              className="flex-1 h-14 bg-white border-2 border-primary-500 rounded-2xl items-center justify-center active:bg-primary-50"
            >
              <Text className="font-extrabold text-[15px] text-primary-600 font-nunito tracking-wide">XEM TRƯỚC</Text>
            </Pressable>
          )}

          <Pressable 
            onPress={currentStep === 4 ? handleSave : handleNext}
            disabled={isSaving}
            className={cn(
              "h-14 rounded-2xl border-b-[4px] items-center justify-center active:translate-y-[2px] active:border-b-[2px]",
              currentStep === 4 ? "flex-1 bg-primary-500 border-primary-700 active:bg-primary-600" : "w-full bg-mascot-navy border-mascot-700 active:bg-mascot-800"
            )}
          >
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-extrabold text-[16px] text-white font-nunito uppercase tracking-wide">
                {currentStep === 4 ? 'LƯU TEMPLATE' : 'TIẾP TỤC'}
              </Text>
            )}
          </Pressable>
        </View>
      </View>

      {/* ==========================================
          MODALS & SHEETS
          ========================================== */}
      
      {/* EXIT CONFIRMATION */}
      <Modal visible={showExitConfirm} transparent animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center p-6">
          <View className="bg-white rounded-[32px] p-6 w-full max-w-[340px] shadow-xl">
            <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2 text-center">
              Hủy thay đổi?
            </Text>
            <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center mb-6 leading-relaxed">
              Bạn có dữ liệu chưa lưu. Mọi thay đổi sẽ bị mất nếu bạn thoát bây giờ.
            </Text>
            
            <View className="gap-3">
              <Pressable 
                onPress={() => setShowExitConfirm(false)}
                className="w-full h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 items-center justify-center active:bg-primary-600"
              >
                <Text className="font-extrabold text-[15px] text-white font-nunito uppercase tracking-wide">Tiếp tục sửa</Text>
              </Pressable>
              <Pressable 
                onPress={() => {
                  setShowExitConfirm(false);
                  router.back();
                }}
                className="w-full h-12 bg-neutral-100 rounded-xl items-center justify-center active:bg-error-50 border border-transparent active:border-error-200"
              >
                <Text className="font-bold text-[15px] text-error-500 font-inter">Bỏ thay đổi</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* APPLY TO DECK CONFIRMATION (PICK_FOR_DECK source) */}
      <Modal visible={showApplyDeckConfirm} transparent animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center p-6">
          <View className="bg-white rounded-[32px] p-6 w-full max-w-[340px] shadow-xl">
            <View className="w-16 h-16 bg-success-50 rounded-full items-center justify-center mb-4 border border-success-100 self-center">
              <CheckIcon size={32} className="text-success-500" />
            </View>
            <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2 text-center">
              Đã lưu Template
            </Text>
            <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center mb-6 leading-relaxed">
              Áp dụng luôn mẫu này cho Deck đang chọn không?
            </Text>
            
            <View className="gap-3">
              <Pressable 
                onPress={applyToDeck}
                disabled={isSaving}
                className="w-full h-14 bg-success-500 rounded-2xl border-b-[4px] border-success-700 items-center justify-center active:bg-success-600"
              >
                {isSaving ? <ActivityIndicator color="white" /> : <Text className="font-extrabold text-[15px] text-white font-nunito uppercase tracking-wide">Áp dụng ngay</Text>}
              </Pressable>
              <Pressable 
                onPress={() => {
                  setShowApplyDeckConfirm(false);
                  router.back();
                }}
                disabled={isSaving}
                className="w-full h-12 bg-neutral-100 rounded-xl items-center justify-center active:bg-neutral-200"
              >
                <Text className="font-bold text-[15px] text-neutral-600 font-inter">Để sau</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* FIELD CONFIG BOTTOM SHEET */}
      <Modal visible={!!activeConfigField} transparent animationType="slide">
        <View className="flex-1 bg-black/40 justify-end">
          <Pressable className="absolute inset-0" onPress={() => setActiveConfigField(null)} />
          <View className="bg-white rounded-t-[32px] p-6 pb-12 shadow-xl">
            <View className="w-12 h-1.5 bg-neutral-200 rounded-full mb-6 self-center" />
            
            <View className="flex-row items-center justify-between mb-6">
              <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">Cấu hình {activeConfigField?.label}</Text>
              <Pressable onPress={() => setActiveConfigField(null)} className="p-2 -mr-2 bg-neutral-100 rounded-full active:bg-neutral-200">
                <XIcon size={20} className="text-neutral-500" />
              </Pressable>
            </View>
            
            {/* EXAMPLE Config */}
            {activeConfigField?.id === 'EXAMPLE' && (
              <View className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="font-bold text-[15px] text-mascot-navy font-inter mb-1">Ẩn từ chính trong câu</Text>
                    <Text className="font-medium text-[12px] text-neutral-500 font-inter">Thay thế từ vựng bằng ký hiệu che</Text>
                  </View>
                  <Switch 
                    value={activeConfigField.config?.maskPattern !== undefined}
                    onValueChange={(val) => {
                      // Fake state update for prototype
                    }}
                    trackColor={{ false: '#E5E7EB', true: '#58CC02' }}
                    thumbColor={'#FFFFFF'}
                  />
                </View>
                
                {/* Options would appear here if Switch is on */}
              </View>
            )}

            {/* AUDIO Config */}
            {activeConfigField?.id === 'AUDIO' && (
              <View className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="font-bold text-[15px] text-mascot-navy font-inter mb-1">Tự động phát</Text>
                    <Text className="font-medium text-[12px] text-neutral-500 font-inter">Phát audio ngay khi mở thẻ</Text>
                  </View>
                  <Switch 
                    value={true}
                    onValueChange={() => {}}
                    trackColor={{ false: '#E5E7EB', true: '#58CC02' }}
                    thumbColor={'#FFFFFF'}
                  />
                </View>
              </View>
            )}

            {/* Generic Config for Others */}
            {['MEANING', 'IPA', 'PART_OF_SPEECH', 'PERSONAL_NOTE'].includes(activeConfigField?.id || '') && (
              <View className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="font-bold text-[15px] text-mascot-navy font-inter mb-1">Hiện tất cả giá trị</Text>
                    <Text className="font-medium text-[12px] text-neutral-500 font-inter">Nếu có nhiều nghĩa/giá trị</Text>
                  </View>
                  <Switch 
                    value={false}
                    onValueChange={() => {}}
                    trackColor={{ false: '#E5E7EB', true: '#58CC02' }}
                    thumbColor={'#FFFFFF'}
                  />
                </View>
              </View>
            )}

            <Pressable 
              onPress={() => setActiveConfigField(null)}
              className="w-full h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 items-center justify-center mt-6 active:bg-primary-600"
            >
              <Text className="font-extrabold text-[16px] text-white font-nunito tracking-wide uppercase">Xong</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
