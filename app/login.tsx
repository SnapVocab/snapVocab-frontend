import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, FingerprintIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const emailError =
    touched.email && !email.trim()
      ? "Vui lòng nhập email"
      : touched.email && !EMAIL_RE.test(email.trim())
        ? "Email không đúng định dạng"
        : null;
  const passwordError = touched.password && !password ? "Vui lòng nhập mật khẩu" : null;
  const canSubmit = !loading; // Tạm thời luôn cho phép submit

  async function handleSubmit() {
    setLoading(true);
    // Tạm thời bỏ qua validate và fake API delay nhỏ
    await new Promise((r) => setTimeout(r, 300));
    setLoading(false);
    
    router.replace("/(tabs)"); // Chuyển thẳng vào màn chính
  }

  const field =
    "h-14 w-full rounded-2xl border-2 bg-neutral-50/60 px-4 text-[15px] font-medium text-mascot-navy placeholder:text-neutral-300 focus:border-info-500 focus:bg-white";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="mx-auto flex-1 w-full max-w-md flex-col px-6 pt-4 pb-10">
        <View className="flex-row items-center">
          <Link href="/" asChild>
            <Pressable className="-ml-2 rounded-full p-2 active:bg-neutral-100">
              <ArrowLeftIcon size={28} strokeWidth={3} className="text-neutral-300" />
            </Pressable>
          </Link>
        </View>

        <Text className="mt-6 text-center text-2xl font-extrabold text-mascot-navy">
          Đăng nhập
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
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              className={cn(field, emailError ? "border-danger-500" : "border-neutral-100")}
            />
            {emailError && <Text className="mt-1.5 px-1 text-sm text-danger-600">{emailError}</Text>}
          </View>

          <View>
            <View className="relative justify-center">
              <TextInput
                secureTextEntry={!show}
                autoCapitalize="none"
                placeholder="Mật khẩu"
                placeholderTextColor="#9597ad"
                value={password}
                maxLength={128}
                onChangeText={setPassword}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                className={cn(field, "pr-12", passwordError ? "border-danger-500" : "border-neutral-100")}
              />
              <Pressable
                onPress={() => setShow((s) => !s)}
                className="absolute right-3 p-1"
              >
                {show ? <EyeOffIcon size={22} className="text-neutral-300" /> : <EyeIcon size={22} className="text-neutral-300" />}
              </Pressable>
            </View>
            {passwordError && <Text className="mt-1.5 px-1 text-sm text-danger-600">{passwordError}</Text>}
          </View>

          <View className="flex-row justify-end">
            <Link href="/forgot-password">
              <Text className="text-sm font-bold text-info-600">Quên mật khẩu?</Text>
            </Link>
          </View>

          {formError && (
            <View className="rounded-2xl border-2 border-danger-100 bg-danger-50 px-4 py-3">
              <Text className="text-sm font-semibold text-danger-600">{formError}</Text>
            </View>
          )}

          <Pressable 
            disabled={!canSubmit} 
            onPress={handleSubmit} 
            className="h-14 w-full rounded-xl bg-primary-500 items-center justify-center active:scale-[0.98] active:bg-primary-600 disabled:opacity-50 mt-2"
          >
            {loading ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white font-extrabold font-nunito text-[15px] uppercase tracking-wide">Đăng nhập</Text>}
          </Pressable>

          <Pressable className="h-14 w-full rounded-xl bg-white border border-neutral-200 gap-2 flex-row items-center justify-center active:scale-[0.98] active:bg-neutral-50">
            <FingerprintIcon size={22} className="text-info-600" />
            <Text className="text-info-600 font-extrabold font-nunito text-[15px] uppercase tracking-wide">Đăng nhập sinh trắc học</Text>
          </Pressable>
        </View>

        <View className="mt-auto pt-10 flex-row justify-center">
          <Text className="text-sm font-medium text-neutral-400">
            Chưa có tài khoản?{" "}
          </Text>
          <Link href="/signup">
            <Text className="text-sm font-bold text-info-600">Đăng ký</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
