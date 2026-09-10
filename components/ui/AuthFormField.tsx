import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, type TextInputProps } from 'react-native';
import { EyeIcon, EyeOffIcon } from 'lucide-react-native';
import { cn } from '@/lib/utils';

export interface AuthFormFieldProps extends Omit<TextInputProps, 'className'> {
  /** Error message – when set, field border turns red */
  error?: string | null;
  /** Hint text shown below field when no error (e.g. password policy) */
  hint?: string;
  /** If true, renders password toggle icon */
  isPassword?: boolean;
  /** Extra tailwind classes on the outer wrapper */
  wrapperClassName?: string;
}

const FIELD_BASE =
  'h-14 w-full rounded-2xl border-2 bg-neutral-50/60 px-4 text-[15px] font-medium text-mascot-navy placeholder:text-neutral-300';

export function AuthFormField({
  error,
  hint,
  isPassword = false,
  wrapperClassName,
  ...inputProps
}: AuthFormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={wrapperClassName}>
      <View className="relative justify-center">
        <TextInput
          placeholderTextColor="#9597ad"
          {...inputProps}
          secureTextEntry={isPassword ? !showPassword : inputProps.secureTextEntry}
          className={cn(
            FIELD_BASE,
            error ? 'border-danger-500' : 'border-neutral-100',
            isPassword && 'pr-12',
          )}
        />
        {isPassword && (
          <Pressable
            onPress={() => setShowPassword((s) => !s)}
            className="absolute right-3 p-1"
            accessibilityLabel={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            accessibilityRole="button"
          >
            {showPassword ? (
              <EyeOffIcon size={22} className="text-neutral-300" />
            ) : (
              <EyeIcon size={22} className="text-neutral-300" />
            )}
          </Pressable>
        )}
      </View>
      {error ? (
        <Text className="mt-1.5 px-1 text-sm text-danger-600">{error}</Text>
      ) : hint ? (
        <Text className="mt-1.5 px-1 text-xs text-neutral-400">{hint}</Text>
      ) : null}
    </View>
  );
}
