import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Policy: min 8 chars, at least 1 special char
const PASSWORD_POLICY_RE = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const nameError = touched.name && !name.trim() ? "Vui lòng nhập họ tên" : null;
  const emailError =
    touched.email && !email.trim()
      ? "Vui lòng nhập email"
      : touched.email && !EMAIL_RE.test(email.trim())
        ? "Email không đúng định dạng"
        : null;
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
    name.trim().length > 0 &&
    EMAIL_RE.test(email.trim()) && 
    PASSWORD_POLICY_RE.test(password) && 
    password === confirmPassword && 
    !loading;

  async function handleSubmit() {
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (!canSubmit) return;
    setFormError(null);
    setLoading(true);

    // Mock API call
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);

    const value = email.trim().toLowerCase();
    if (value.startsWith("exist")) {
      setFormError("Email đã được sử dụng");
      return;
    }
    
    // Redirect to OTP
    router.push({ pathname: "/verify", params: { email: value, mode: "signup" } });
  }

  const field =
    "h-14 w-full rounded-2xl border-2 bg-neutral-50/60 px-4 text-[15px] font-medium text-mascot-navy placeholder:text-neutral-300 focus:border-info-500 focus:bg-white";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="mx-auto flex-1 w-full max-w-md flex-col px-6 pt-4 pb-10">
          <View className="flex-row items-center">
            <Link href="/login" asChild>
              <Pressable className="-ml-2 rounded-full p-2 active:bg-neutral-100">
                <ArrowLeftIcon size={28} strokeWidth={3} className="text-neutral-300" />
              </Pressable>
            </Link>
          </View>

          <Text className="mt-6 text-center text-2xl font-extrabold text-mascot-navy">
            Đăng ký tài khoản
          </Text>

          <View className="mt-8 flex-col gap-4">
            <View>
              <TextInput
                autoCapitalize="words"
                placeholder="Họ và tên"
                placeholderTextColor="#9597ad"
                value={name}
                maxLength={100}
                onChangeText={setName}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                className={cn(field, nameError ? "border-danger-500" : "border-neutral-100")}
              />
              {nameError && <Text className="mt-1.5 px-1 text-sm text-danger-600">{nameError}</Text>}
            </View>

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
                  secureTextEntry={!showPwd}
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
                  placeholder="Xác nhận mật khẩu"
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
              {loading ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white font-extrabold font-nunito text-[15px] uppercase tracking-wide">Đăng ký</Text>}
            </Pressable>
          </View>

          <View className="mt-auto pt-10 flex-row justify-center pb-4">
            <Text className="text-sm font-medium text-neutral-400">
              Đã có tài khoản?{" "}
            </Text>
            <Link href="/login">
              <Text className="text-sm font-bold text-info-600">Đăng nhập</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
