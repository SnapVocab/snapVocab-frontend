import React, { useRef, useState, useCallback } from 'react';
import { View, TextInput, Pressable, Text, type NativeSyntheticEvent, type TextInputKeyPressEventData } from 'react-native';
import { cn } from '@/lib/utils';

const CELL_COUNT = 6;

interface OtpInputProps {
  value: string;
  onChange: (code: string) => void;
  /** Disable all cells (e.g. after max attempts) */
  disabled?: boolean;
  /** Show error styling on cells */
  hasError?: boolean;
}

export function OtpInput({ value, onChange, disabled = false, hasError = false }: OtpInputProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const digits = value.split('').concat(Array(CELL_COUNT).fill('')).slice(0, CELL_COUNT);

  const focusCell = useCallback((index: number) => {
    if (index >= 0 && index < CELL_COUNT) {
      inputRefs.current[index]?.focus();
    }
  }, []);

  const handleChange = useCallback(
    (text: string, index: number) => {
      // Handle paste – user pastes full OTP code
      if (text.length > 1) {
        const pasted = text.replace(/\D/g, '').slice(0, CELL_COUNT);
        onChange(pasted);
        // Focus last filled cell or last cell
        focusCell(Math.min(pasted.length, CELL_COUNT - 1));
        return;
      }

      const digit = text.replace(/\D/g, '');
      const arr = value.split('');

      if (digit) {
        arr[index] = digit;
        const newValue = arr.join('').slice(0, CELL_COUNT);
        onChange(newValue);
        // Auto-advance to next cell
        if (index < CELL_COUNT - 1) {
          focusCell(index + 1);
        }
      }
    },
    [value, onChange, focusCell],
  );

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
      if (e.nativeEvent.key === 'Backspace') {
        const arr = value.split('');
        if (arr[index]) {
          // Clear current cell
          arr[index] = '';
          onChange(arr.join(''));
        } else if (index > 0) {
          // Go back to previous cell and clear it
          arr[index - 1] = '';
          onChange(arr.join(''));
          focusCell(index - 1);
        }
      }
    },
    [value, onChange, focusCell],
  );

  return (
    <View className="flex-row justify-center gap-2.5">
      {digits.map((digit, i) => {
        const isFocused = focusedIndex === i;
        const isFilled = !!digit;

        return (
          <View
            key={i}
            className={cn(
              'h-14 w-12 rounded-xl border-2 items-center justify-center overflow-hidden',
              hasError
                ? 'border-danger-500 bg-danger-50/50'
                : isFocused
                  ? 'border-info-500 bg-white'
                  : isFilled
                    ? 'border-primary-500 bg-primary-50/40'
                    : 'border-neutral-200 bg-neutral-50/60',
            )}
          >
            <TextInput
              ref={(ref) => { inputRefs.current[i] = ref; }}
              value={digit}
              onChangeText={(text) => handleChange(text, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              onFocus={() => setFocusedIndex(i)}
              onBlur={() => setFocusedIndex(-1)}
              keyboardType="number-pad"
              maxLength={i === 0 ? CELL_COUNT : 1} // Allow paste on first cell
              editable={!disabled}
              selectTextOnFocus
              className="h-full w-full text-center text-2xl font-bold text-mascot-navy"
              accessibilityLabel={`Mã OTP ô ${i + 1}`}
            />
          </View>
        );
      })}
    </View>
  );
}
