import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';

// Policy: min 8 chars, at least 1 special char
const PASSWORD_POLICY_RE = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

export default function ResetPassword() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const passwordError = 
    touched.password && !password 
      ? "Vui lòng nhập mật khẩu" 
      : touched.password && !PASSWORD_POLICY_RE.test(password)
        ? "Mật khẩu chưa đạt yêu cầu"
        : null;
  const confirmError = 
    touched.confirm && password !== confirmPassword 
      ? "Mật khẩu xác nhận không khớp" 
      : null;

  const canSubmit = 
    PASSWORD_POLICY_RE.test(password) && 
    password === confirmPassword && 
    !loading;

  async function handleSubmit() {
    setTouched({ password: true, confirm: true });
    if (!canSubmit) return;
    setFormError(null);
    setLoading(true);

    // Mock API call
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);

    // Redirect to login
    router.replace("/login");
  }

  const field =
    "h-14 w-full rounded-2xl border-2 bg-neutral-50/60 px-4 text-[15px] font-medium text-mascot-navy placeholder:text-neutral-300 focus:border-info-500 focus:bg-white";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="mx-auto flex-1 w-full max-w-md flex-col px-6 pt-4 pb-10">
        <View className="flex-row items-center">
          <Link href="/login" asChild>
            <Pressable className="-ml-2 rounded-full p-2 active:bg-neutral-100">
              <ArrowLeftIcon size={28} strokeWidth={3} className="text-neutral-300" />
            </Pressable>
          </Link>
        </View>

        <Text className="mt-6 text-center text-2xl font-extrabold text-mascot-navy">
          Đặt lại mật khẩu
        </Text>
        <Text className="mt-3 text-center text-[15px] leading-6 text-neutral-500 px-4">
          Tạo mật khẩu mới cho tài khoản{'\n'}
          <Text className="font-bold text-mascot-navy">{email}</Text>
        </Text>

        <View className="mt-8 flex-col gap-4">
          <View>
            <View className="relative justify-center">
              <TextInput
                secureTextEntry={!showPwd}
                autoCapitalize="none"
                placeholder="Mật khẩu mới"
                placeholderTextColor="#9597ad"
                value={password}
                maxLength={128}
                onChangeText={setPassword}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                className={cn(field, "pr-12", passwordError ? "border-danger-500" : "border-neutral-100")}
              />
              <Pressable
                onPress={() => setShowPwd((s) => !s)}
                className="absolute right-3 p-1"
              >
                {showPwd ? <EyeOffIcon size={22} className="text-neutral-300" /> : <EyeIcon size={22} className="text-neutral-300" />}
              </Pressable>
            </View>
            {passwordError ? (
              <Text className="mt-1.5 px-1 text-sm text-danger-600">{passwordError}</Text>
            ) : (
              <Text className="mt-1.5 px-1 text-xs text-neutral-400">Ít nhất 8 ký tự và 1 ký tự đặc biệt (!@#$)</Text>
            )}
          </View>

          <View>
            <View className="relative justify-center">
              <TextInput
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
                placeholder="Xác nhận mật khẩu mới"
                placeholderTextColor="#9597ad"
                value={confirmPassword}
                maxLength={128}
                onChangeText={setConfirmPassword}
                onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                className={cn(field, "pr-12", confirmError ? "border-danger-500" : "border-neutral-100")}
              />
              <Pressable
                onPress={() => setShowConfirm((s) => !s)}
                className="absolute right-3 p-1"
              >
                {showConfirm ? <EyeOffIcon size={22} className="text-neutral-300" /> : <EyeIcon size={22} className="text-neutral-300" />}
              </Pressable>
            </View>
            {confirmError && <Text className="mt-1.5 px-1 text-sm text-danger-600">{confirmError}</Text>}
          </View>

          {formError && (
            <View className="rounded-2xl border-2 border-danger-100 bg-danger-50 px-4 py-3">
              <Text className="text-sm font-semibold text-danger-600">{formError}</Text>
            </View>
          )}

          <Pressable 
            disabled={!canSubmit} 
            onPress={handleSubmit} 
            className="h-14 w-full rounded-xl bg-primary-500 items-center justify-center active:scale-[0.98] active:bg-primary-600 disabled:opacity-50 mt-4"
          >
            {loading ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white font-extrabold font-nunito text-[15px] uppercase tracking-wide">Xác nhận</Text>}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
