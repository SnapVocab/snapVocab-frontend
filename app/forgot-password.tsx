import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { ArrowLeftIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const emailError =
    touched && !email.trim()
      ? "Vui lòng nhập email"
      : touched && !EMAIL_RE.test(email.trim())
        ? "Email không đúng định dạng"
        : null;

  const canSubmit = EMAIL_RE.test(email.trim()) && !loading;

  async function handleSubmit() {
    setTouched(true);
    if (!canSubmit) return;
    setFormError(null);
    setLoading(true);

    // Mock API call
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);

    const value = email.trim().toLowerCase();
    
    // Redirect to OTP with mode=reset
    router.push({ pathname: "/verify", params: { email: value, mode: "reset" } });
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
          Quên mật khẩu
        </Text>
        <Text className="mt-3 text-center text-[15px] leading-6 text-neutral-500 px-4">
          Nhập email bạn đã đăng ký, chúng tôi sẽ gửi mã xác thực để đặt lại mật khẩu.
        </Text>

        <View className="mt-8 flex-col gap-4">
          <View>
            <TextInput
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="Email"
              placeholderTextColor="#9597ad"
              value={email}
              maxLength={255}
              onChangeText={setEmail}
              onBlur={() => setTouched(true)}
              className={cn(field, emailError ? "border-danger-500" : "border-neutral-100")}
            />
            {emailError && <Text className="mt-1.5 px-1 text-sm text-danger-600">{emailError}</Text>}
          </View>

          {formError && (
            <View className="rounded-2xl border-2 border-danger-100 bg-danger-50 px-4 py-3">
              <Text className="text-sm font-semibold text-danger-600">{formError}</Text>
            </View>
          )}

          <Pressable 
            disabled={!canSubmit} 
            onPress={handleSubmit} 
            className="btn-3d btn-primary mt-2"
          >
            {loading ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white font-bold text-[15px] uppercase">Gửi mã OTP</Text>}
          </Pressable>
        </View>

        <View className="mt-auto pt-10 flex-row justify-center pb-4">
          <Link href="/login">
            <Text className="text-sm font-bold text-info-600">Quay lại đăng nhập</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
