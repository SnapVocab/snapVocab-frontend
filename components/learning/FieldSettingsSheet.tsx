import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { XIcon, Trash2Icon, CheckIcon } from 'lucide-react-native';
import { TemplateFieldDTO, SemanticRole, Alignment } from '@/lib/topic-eav';
import { cn } from '@/lib/utils';

interface FieldSettingsSheetProps {
  visible: boolean;
  field: TemplateFieldDTO | null;
  onClose: () => void;
  onSave: (updatedField: TemplateFieldDTO) => void;
  onDelete: (fieldId: number | undefined) => void;
}

const SEMANTIC_ROLES: { role: SemanticRole; label: string }[] = [
  { role: 'TARGET_WORD', label: 'Từ vựng chính' },
  { role: 'DEFINITION', label: 'Giải nghĩa' },
  { role: 'NATIVE_TRANSLATION', label: 'Bản dịch / Nghĩa' },
  { role: 'EXAMPLE_SENTENCE', label: 'Câu ví dụ' },
  { role: 'AUDIO', label: 'Âm thanh' },
  { role: 'IMAGE', label: 'Hình ảnh' },
];

const FONT_SIZES: { label: string; size: number }[] = [
  { label: 'S', size: 14 },
  { label: 'M', size: 18 },
  { label: 'L', size: 22 },
  { label: 'XL', size: 26 },
];

const ALIGNMENTS: { label: string; value: Alignment }[] = [
  { label: 'Trái', value: 'LEFT' },
  { label: 'Giữa', value: 'CENTER' },
  { label: 'Phải', value: 'RIGHT' },
];

// 7 Màu chuẩn từ SnapVocab Color System (docs/design.md §03)
const COLOR_SWATCHES: string[] = [
  '#171A2F', // neutral-800
  '#58CC02', // primary-500
  '#FF8A00', // mascot-500
  '#1CB0F6', // info-500
  '#FFC42E', // reward-500
  '#EF4444', // danger-500
  '#757793', // neutral-400
];

export const FieldSettingsSheet: React.FC<FieldSettingsSheetProps> = ({
  visible,
  field,
  onClose,
  onSave,
  onDelete,
}) => {
  const [label, setLabel] = useState('');
  const [role, setRole] = useState<SemanticRole>('TARGET_WORD');
  const [required, setRequired] = useState(false);
  const [hideIfEmpty, setHideIfEmpty] = useState(false);
  const [audioAction, setAudioAction] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [alignment, setAlignment] = useState<Alignment>('LEFT');
  const [color, setColor] = useState('#171A2F');

  useEffect(() => {
    if (field) {
      setLabel(field.fieldLabel || '');
      setRole(field.semanticRole || 'TARGET_WORD');
      setRequired(!!field.required);
      setHideIfEmpty(!!field.hideIfEmpty);
      setAudioAction(!!field.audioAction);
      setFontSize(field.fontSize || 18);
      setAlignment(field.alignment || 'LEFT');
      setColor(field.color || '#171A2F');
    }
  }, [field]);

  if (!field) return null;

  const handleSave = () => {
    onSave({
      ...field,
      fieldLabel: label.trim() || undefined,
      semanticRole: role,
      required,
      hideIfEmpty,
      audioAction,
      fontSize,
      alignment,
      color,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-black/40 justify-end"
      >
        <View className="bg-white rounded-t-[32px] p-6 pb-10 border-t-2 border-neutral-200 max-w-lg mx-auto w-full max-h-[85vh]">
          {/* DRAG HANDLE & CLOSE BUTTON */}
          <View className="items-center mb-2 -mt-2">
            <View className="w-12 h-1.5 bg-neutral-300 rounded-full" />
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1 pr-2">
              <View className="flex-row items-center gap-1.5">
                <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">
                  Tùy chỉnh trường:
                </Text>
                <Text className="font-extrabold text-[18px] text-primary-600 font-nunito">
                  {field.attributeName || label || 'Trường dữ liệu'}
                </Text>
              </View>
              <Text className="font-medium text-[14px] text-neutral-500 font-inter">
                Điều chỉnh cách hiển thị và kiểu dáng trên thẻ học
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              className="w-10 h-10 bg-neutral-100 rounded-full items-center justify-center active:bg-neutral-200"
            >
              <XIcon size={20} color="#757793" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="gap-5">
            {/* 1. TÊN NHÃN HIỂN THỊ */}
            <View>
              <Text className="font-bold text-[14px] text-neutral-600 font-inter uppercase tracking-wider mb-1.5">
                TÊN NHÃN HIỂN THỊ
              </Text>
              <TextInput
                value={label}
                onChangeText={setLabel}
                placeholder="VD: Từ vựng, Bản dịch tiếng Việt..."
                placeholderTextColor="#9597AD"
                className="h-13 bg-neutral-50 border-2 border-neutral-200 rounded-2xl px-4 font-inter text-[16px] text-mascot-navy font-medium focus:border-primary-500 focus:bg-primary-50/40"
              />
            </View>

            {/* 2. VAI TRÒ NỘI DUNG (CONTENT ROLE PILLS) */}
            <View>
              <Text className="font-bold text-[14px] text-neutral-600 font-inter uppercase tracking-wider mb-2">
                VAI TRÒ NỘI DUNG (SEMANTIC ROLE)
              </Text>
              <View className="flex-row flex-wrap gap-2.5">
                {SEMANTIC_ROLES.map((r) => {
                  const isSelected = role === r.role;
                  return (
                    <Pressable
                      key={r.role}
                      onPress={() => setRole(r.role)}
                      className={cn(
                        'min-h-[48px] px-4 py-2.5 rounded-2xl border-2 flex-row items-center gap-2 transition-all',
                        isSelected
                          ? 'bg-primary-50 border-primary-500 border-b-[4px]'
                          : 'bg-neutral-50 border-neutral-200 border-b-[3px] active:bg-neutral-100'
                      )}
                    >
                      <Text
                        className={cn(
                          'font-extrabold text-[14px] font-nunito',
                          isSelected ? 'text-primary-700' : 'text-neutral-700'
                        )}
                      >
                        {r.label}
                      </Text>
                      {isSelected && <CheckIcon size={16} color="#3C8C00" strokeWidth={3} />}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 3. QUY TẮC HIỂN THỊ */}
            <View className="bg-neutral-50 p-4 rounded-2xl border-2 border-neutral-200 gap-4">
              <Text className="font-bold text-[14px] text-neutral-600 font-inter uppercase tracking-wider">
                QUY TẮC HIỂN THỊ
              </Text>

              {/* REQUIRED SWITCH */}
              <View className="flex-row items-center justify-between min-h-[48px]">
                <View className="flex-1 pr-3">
                  <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito">
                    Bắt buộc điền thông tin
                  </Text>
                  <Text className="font-medium text-[14px] text-neutral-500 font-inter">
                    Yêu cầu phải có dữ liệu khi tạo thẻ
                  </Text>
                </View>
                <Switch
                  value={required}
                  onValueChange={setRequired}
                  trackColor={{ false: '#D4D5DF', true: '#58CC02' }}
                  thumbColor="#ffffff"
                />
              </View>

              {/* HIDE IF EMPTY SWITCH */}
              <View className="flex-row items-center justify-between min-h-[48px] pt-3 border-t border-neutral-200">
                <View className="flex-1 pr-3">
                  <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito">
                    Tự động ẩn ô này nếu để trống
                  </Text>
                  <Text className="font-medium text-[14px] text-neutral-500 font-inter">
                    Không để lại khoảng trắng thừa trên thẻ học
                  </Text>
                </View>
                <Switch
                  value={hideIfEmpty}
                  onValueChange={setHideIfEmpty}
                  trackColor={{ false: '#D4D5DF', true: '#58CC02' }}
                  thumbColor="#ffffff"
                />
              </View>

              {/* AUDIO ACTION SWITCH */}
              <View className="flex-row items-center justify-between min-h-[48px] pt-3 border-t border-neutral-200">
                <View className="flex-1 pr-3">
                  <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito">
                    Phát âm thanh khi chạm
                  </Text>
                  <Text className="font-medium text-[14px] text-neutral-500 font-inter">
                    Bấm vào ô này sẽ tự động đọc phát âm
                  </Text>
                </View>
                <Switch
                  value={audioAction}
                  onValueChange={setAudioAction}
                  trackColor={{ false: '#D4D5DF', true: '#58CC02' }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>

            {/* 4. STYLE & TYPOGRAPHY */}
            <View className="gap-4">
              <Text className="font-bold text-[14px] text-neutral-600 font-inter uppercase tracking-wider">
                ĐỊNH DẠNG & MÀU SẮC
              </Text>

              {/* FONT SIZE (MIN 48px TAP TARGET) */}
              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-[15px] text-neutral-700 font-inter">Cỡ chữ</Text>
                <View className="flex-row gap-2">
                  {FONT_SIZES.map((f) => (
                    <Pressable
                      key={f.label}
                      onPress={() => setFontSize(f.size)}
                      className={cn(
                        'min-w-[48px] min-h-[48px] rounded-2xl items-center justify-center border-2 font-inter transition-all',
                        fontSize === f.size
                          ? 'bg-primary-500 border-primary-700 border-b-[4px]'
                          : 'bg-white border-neutral-200 border-b-[3px] active:bg-neutral-100'
                      )}
                    >
                      <Text
                        className={cn(
                          'font-extrabold text-[15px] font-nunito',
                          fontSize === f.size ? 'text-white' : 'text-neutral-700'
                        )}
                      >
                        {f.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* ALIGNMENT (MIN 48px TAP TARGET) */}
              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-[15px] text-neutral-700 font-inter">Căn lề</Text>
                <View className="flex-row gap-2">
                  {ALIGNMENTS.map((a) => (
                    <Pressable
                      key={a.value}
                      onPress={() => setAlignment(a.value)}
                      className={cn(
                        'min-h-[48px] px-4 rounded-2xl items-center justify-center border-2 font-inter transition-all',
                        alignment === a.value
                          ? 'bg-primary-500 border-primary-700 border-b-[4px]'
                          : 'bg-white border-neutral-200 border-b-[3px] active:bg-neutral-100'
                      )}
                    >
                      <Text
                        className={cn(
                          'font-extrabold text-[14px] font-nunito',
                          alignment === a.value ? 'text-white' : 'text-neutral-700'
                        )}
                      >
                        {a.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* COLOR SWATCHES (MIN 48px TAP TARGET) */}
              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-[15px] text-neutral-700 font-inter">Màu chữ</Text>
                <View className="flex-row gap-1.5">
                  {COLOR_SWATCHES.map((c) => {
                    const isSelected = color === c;
                    return (
                      <Pressable
                        key={c}
                        onPress={() => setColor(c)}
                        className="w-12 h-12 items-center justify-center"
                      >
                        <View
                          style={{ backgroundColor: c }}
                          className={cn(
                            'w-8 h-8 rounded-full items-center justify-center border border-black/15 shadow-sm',
                            isSelected && 'ring-4 ring-primary-500/50 scale-110'
                          )}
                        >
                          {isSelected && <CheckIcon size={14} color="#ffffff" strokeWidth={3} />}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* 5. BOTTOM ACTIONS */}
            <View className="pt-4 flex-row items-center gap-3">
              <Pressable
                onPress={() => onDelete(field.id)}
                className="h-13 px-5 rounded-2xl bg-danger-50 border-2 border-danger-200 border-b-[4px] border-danger-300 items-center justify-center flex-row gap-1.5 active:translate-y-[2px] active:border-b-[2px]"
              >
                <Trash2Icon size={18} color="#EF4444" />
                <Text className="font-extrabold text-[15px] text-danger-600 font-nunito uppercase tracking-[0.04em]">
                  XÓA
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                className="flex-1 h-13 bg-primary-500 border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] rounded-2xl items-center justify-center shadow-sm"
              >
                <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-[0.04em]">
                  LƯU TÙY CHỈNH
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
