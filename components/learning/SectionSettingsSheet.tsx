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
import { XIcon, Trash2Icon, LayoutGridIcon, ColumnsIcon, SquareIcon } from 'lucide-react-native';
import { cn } from '@/lib/utils';

interface SectionSettingsSheetProps {
  visible: boolean;
  sectionName: string;
  repeatable: boolean;
  columnsCount: 1 | 2;
  onClose: () => void;
  onSave: (data: { sectionName: string; repeatable: boolean; columnsCount: 1 | 2 }) => void;
  onDelete: () => void;
}

export const SectionSettingsSheet: React.FC<SectionSettingsSheetProps> = ({
  visible,
  sectionName: initialName,
  repeatable: initialRepeatable,
  columnsCount: initialColumns,
  onClose,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState(initialName);
  const [repeatable, setRepeatable] = useState(initialRepeatable);
  const [columns, setColumns] = useState<1 | 2>((Math.min(2, Math.max(1, initialColumns || 1))) as 1 | 2);

  useEffect(() => {
    setName(initialName);
    setRepeatable(initialRepeatable);
    setColumns((Math.min(2, Math.max(1, initialColumns || 1))) as 1 | 2);
  }, [initialName, initialRepeatable, initialColumns, visible]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-black/40 justify-end"
      >
        <View className="bg-white rounded-t-[32px] p-6 pb-10 border-t-2 border-neutral-200 max-w-lg mx-auto w-full">
          {/* DRAG HANDLE & CLOSE BUTTON */}
          <View className="items-center mb-2 -mt-2">
            <View className="w-12 h-1.5 bg-neutral-300 rounded-full" />
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1 pr-2">
              <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">
                Cài đặt phần hiển thị
              </Text>
              <Text className="font-medium text-[14px] text-neutral-500 font-inter">
                Chỉnh sửa tên và cấu trúc hiển thị của phần này
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
            {/* KHỐI 1: TÊN PHẦN HIỂN THỊ */}
            <View>
              <Text className="font-bold text-[14px] text-neutral-600 font-inter uppercase tracking-wider mb-1.5">
                TÊN PHẦN HIỂN THỊ
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="VD: Thông tin chung, Nghĩa & Ví dụ..."
                placeholderTextColor="#9597AD"
                className="h-13 bg-neutral-50 border-2 border-neutral-200 rounded-2xl px-4 font-inter text-[16px] text-mascot-navy font-medium focus:border-primary-500 focus:bg-primary-50/40"
              />
              <Text className="font-medium text-[14px] text-neutral-500 font-inter mt-1.5">
                Hiển thị làm tiêu đề nhóm các ô thông tin trên thẻ từ vựng
              </Text>
            </View>

            {/* KHỐI 2: CHẾ ĐỘ LẶP LẠI (1-N) */}
            <View className="bg-neutral-50 p-4 rounded-2xl border-2 border-neutral-200 flex-row items-center justify-between min-h-[56px]">
              <View className="flex-1 pr-3">
                <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito mb-0.5">
                  Cho phép lặp lại (Danh sách 1-n)
                </Text>
                <Text className="font-medium text-[14px] text-neutral-500 font-inter leading-5">
                  Phù hợp nhóm mục như: nhiều nghĩa, nhiều ví dụ, cụm từ...
                </Text>
              </View>
              <Switch
                value={repeatable}
                onValueChange={setRepeatable}
                trackColor={{ false: '#D4D5DF', true: '#58CC02' }}
                thumbColor="#ffffff"
              />
            </View>

            {/* KHỐI 3: SỐ CỘT HIỂN THỊ (TỐI ĐA 2 CỘT) */}
            <View>
              <Text className="font-bold text-[14px] text-neutral-600 font-inter uppercase tracking-wider mb-2">
                SỐ CỘT HIỂN THỊ (TỐI ĐA 2 CỘT)
              </Text>
              <View className="flex-row gap-3">
                {/* 1 CỘT */}
                <Pressable
                  onPress={() => setColumns(1)}
                  className={cn(
                    'flex-1 p-4 rounded-2xl border-2 items-center justify-center gap-1.5 transition-all min-h-[72px]',
                    columns === 1
                      ? 'bg-primary-50 border-primary-500 border-b-[4px]'
                      : 'bg-neutral-50 border-neutral-200 border-b-[3px] active:bg-neutral-100'
                  )}
                >
                  <SquareIcon size={22} color={columns === 1 ? '#3C8C00' : '#757793'} />
                  <Text
                    className={cn(
                      'font-extrabold text-[15px] font-nunito',
                      columns === 1 ? 'text-primary-800' : 'text-neutral-700'
                    )}
                  >
                    1 Cột
                  </Text>
                  <Text className="text-[12.5px] text-neutral-400 font-inter font-medium text-center">
                    Toàn chiều rộng (100%)
                  </Text>
                </Pressable>

                {/* 2 CỘT */}
                <Pressable
                  onPress={() => setColumns(2)}
                  className={cn(
                    'flex-1 p-4 rounded-2xl border-2 items-center justify-center gap-1.5 transition-all min-h-[72px]',
                    columns === 2
                      ? 'bg-primary-50 border-primary-500 border-b-[4px]'
                      : 'bg-neutral-50 border-neutral-200 border-b-[3px] active:bg-neutral-100'
                  )}
                >
                  <ColumnsIcon size={22} color={columns === 2 ? '#3C8C00' : '#757793'} />
                  <Text
                    className={cn(
                      'font-extrabold text-[15px] font-nunito',
                      columns === 2 ? 'text-primary-800' : 'text-neutral-700'
                    )}
                  >
                    2 Cột
                  </Text>
                  <Text className="text-[12.5px] text-neutral-400 font-inter font-medium text-center">
                    Chia đôi (50% - 50%)
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* KHỐI 4: BOTTOM ACTIONS */}
            <View className="pt-4 flex-row items-center gap-3">
              <Pressable
                onPress={onDelete}
                className="h-13 px-5 rounded-2xl bg-danger-50 border-2 border-danger-200 border-b-[4px] border-danger-300 items-center justify-center flex-row gap-1.5 active:translate-y-[2px] active:border-b-[2px]"
              >
                <Trash2Icon size={18} color="#EF4444" />
                <Text className="font-extrabold text-[15px] text-danger-600 font-nunito uppercase tracking-[0.04em]">
                  XÓA PHẦN
                </Text>
              </Pressable>

              <Pressable
                onPress={() => onSave({ sectionName: name, repeatable, columnsCount: columns })}
                className="flex-1 h-13 bg-primary-500 border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] rounded-2xl items-center justify-center shadow-sm"
              >
                <Text className="font-extrabold text-[15px] text-white uppercase font-nunito tracking-[0.04em]">
                  LƯU CÀI ĐẶT PHẦN
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
