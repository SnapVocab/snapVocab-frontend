import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Volume2Icon } from 'lucide-react-native';
import { TemplateDTO, TemplateElementDTO, TemplateFieldDTO } from '@/lib/topic-eav';
import { cn } from '@/lib/utils';

interface DynamicCardRendererProps {
  template: TemplateDTO;
  itemValues: Record<string | number, any>;
  side: 'FRONT' | 'BACK';
  columnsCount?: 1 | 2;
  onPlayAudio?: (value: string) => void;
}

export const DynamicCardRenderer: React.FC<DynamicCardRendererProps> = ({
  template,
  itemValues,
  side,
  columnsCount,
  onPlayAudio,
}) => {
  const sortedElements = [...template.elements].sort((a, b) => a.position - b.position);
  const sectionBreakIndex = sortedElements.findIndex((el) => el.type === 'SECTION_BREAK');

  let activeElements: TemplateElementDTO[] = [];
  if (sectionBreakIndex === -1) {
    activeElements = side === 'FRONT' ? sortedElements.slice(0, 2) : sortedElements.slice(2);
  } else {
    activeElements =
      side === 'FRONT'
        ? sortedElements.slice(0, sectionBreakIndex)
        : sortedElements.slice(sectionBreakIndex + 1);
  }

  // Filter only field elements
  const fieldElements = activeElements.filter((el) => el.type === 'FIELD' && el.field);

  // Group elements into rows based on columnsCount (max 2 columns)
  const effectiveCols = columnsCount !== undefined ? Math.min(2, Math.max(1, columnsCount)) : (side === 'FRONT' ? 2 : 1);
  const rows: TemplateElementDTO[][] = [];

  if (effectiveCols === 1) {
    // 1 Cột: Mỗi trường là một hàng riêng biệt toàn chiều rộng
    fieldElements.forEach((el) => rows.push([el]));
  } else {
    // 2 Cột: Ghép tối đa 2 trường trên một hàng
    for (let i = 0; i < fieldElements.length; i += 2) {
      rows.push(fieldElements.slice(i, i + 2));
    }
  }

  const getFieldValue = (field: TemplateFieldDTO): any => {
    if (!field) return null;
    if (itemValues[field.schemaAttributeId] !== undefined) {
      return itemValues[field.schemaAttributeId];
    }
    if (field.attributeName && itemValues[field.attributeName] !== undefined) {
      return itemValues[field.attributeName];
    }
    if (field.semanticRole) {
      const roleKey = field.semanticRole.toLowerCase();
      if (itemValues[roleKey] !== undefined) return itemValues[roleKey];
    }
    return null;
  };

  const renderField = (field: TemplateFieldDTO, isMultipleColumns: boolean) => {
    const rawValue = getFieldValue(field);
    const isEmpty = rawValue === null || rawValue === undefined || rawValue === '';

    if (field.hideIfEmpty && isEmpty) {
      return null;
    }

    const displayValue = isEmpty ? `[${field.fieldLabel || 'Trống'}]` : String(rawValue);

    let textAlignClass = 'text-center';
    let alignItemsClass = 'items-center';
    let justifyClass = 'justify-center';
    if (field.alignment === 'LEFT') {
      textAlignClass = 'text-left';
      alignItemsClass = 'items-start';
      justifyClass = 'justify-start';
    } else if (field.alignment === 'RIGHT') {
      textAlignClass = 'text-right';
      alignItemsClass = 'items-end';
      justifyClass = 'justify-end';
    } else if (field.alignment === 'JUSTIFY') {
      textAlignClass = 'text-justify';
      alignItemsClass = 'items-stretch';
      justifyClass = 'justify-between';
    }

    const isImage = field.semanticRole === 'IMAGE';
    const isAudio = field.semanticRole === 'AUDIO' || field.audioAction;

    return (
      <View
        key={field.id || field.schemaAttributeId}
        className={cn('my-1 min-w-0', isMultipleColumns ? 'flex-1 px-1' : 'w-full px-3', alignItemsClass)}
      >
        {field.fieldLabel && (
          <Text className="text-[12px] font-bold text-neutral-400 font-inter uppercase tracking-wider mb-1">
            {field.fieldLabel}
          </Text>
        )}

        {isImage && !isEmpty ? (
          <Image
            source={{ uri: displayValue }}
            className="w-full h-44 rounded-2xl bg-neutral-100 my-1 border-2 border-neutral-100"
            resizeMode="cover"
          />
        ) : (
          <Pressable
            disabled={!isAudio}
            onPress={() => isAudio && onPlayAudio && onPlayAudio(displayValue)}
            className={cn(
              'flex-row items-center gap-1.5 max-w-full min-h-[38px]',
              justifyClass,
              isAudio && 'active:opacity-75'
            )}
          >
            <Text
              style={{
                fontSize: isMultipleColumns
                  ? 14
                  : Math.max(16, field.fontSize || 18),
                color: field.color || '#171A2F',
              }}
              className={cn('font-nunito font-extrabold shrink min-w-0', textAlignClass)}
              numberOfLines={isMultipleColumns ? 2 : undefined}
            >
              {displayValue}
            </Text>

            {isAudio && (
              <View className="w-6 h-6 rounded-lg bg-info-50 items-center justify-center border border-info-200 shrink-0">
                <Volume2Icon size={12} color="#1CB0F6" />
              </View>
            )}
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <View className="w-full py-2 items-center justify-center">
      {rows.map((row, rowIndex) => {
        const isMultiCol = row.length > 1;
        return (
          <View
            key={`row-${rowIndex}`}
            className={cn(
              'w-full my-1',
              isMultiCol ? 'flex-row items-start justify-between gap-3' : 'flex-col items-center'
            )}
          >
            {row.map((element) => {
              if (!element.field) return null;
              return renderField(element.field, isMultiCol);
            })}
          </View>
        );
      })}
    </View>
  );
};
