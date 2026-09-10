import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { ArrowLeftIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Snapy } from '@/components/Snapy';
import { AuthFormField } from '@/components/ui/AuthFormField';
import {
  EMAIL_RE,
  PASSWORD_POLICY_RE,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
} from '@/lib/validators';

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const nameError = touched.name ? validateName(name) : null;
  const emailError = touched.email ? validateEmail(email) : null;
  const passwordError = touched.password ? validatePassword(password) : null;
  const confirmError = touched.confirm ? validateConfirmPassword(password, confirmPassword) : null;

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

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="mx-auto flex-1 w-full max-w-md flex-col px-6 pt-4 pb-10">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="-ml-2 rounded-full p-2 active:bg-neutral-100"
              accessibilityLabel="Quay lại"
              accessibilityRole="button"
            >
              <ArrowLeftIcon size={28} strokeWidth={3} className="text-neutral-300" />
            </TouchableOpacity>
          </View>

          {/* Mascot + Title */}
          <View className="mt-3 flex-row items-center justify-center gap-3">
            <View style={{ width: 64, height: 64 }} className="items-center justify-center">
              <Snapy pose="happy" animation="idle" style={{ width: 64, height: 64 }} />
            </View>
            <View className="flex-col">
              <Text className="text-2xl font-extrabold text-mascot-navy">
                Đăng ký tài khoản
              </Text>
              <Text className="mt-0.5 text-[13px] text-neutral-400">
                Miễn phí, chỉ 30 giây!
              </Text>
            </View>
          </View>

          {/* Form */}
          <View className="mt-7 flex-col gap-4">
            <AuthFormField
              autoCapitalize="words"
              placeholder="Họ và tên"
              value={name}
              maxLength={100}
              onChangeText={setName}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              error={nameError}
              accessibilityLabel="Họ và tên"
            />

            <AuthFormField
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="Email"
              value={email}
              maxLength={255}
              onChangeText={setEmail}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              error={emailError}
              accessibilityLabel="Email"
            />

            <AuthFormField
              isPassword
              autoCapitalize="none"
              autoComplete="new-password"
              placeholder="Mật khẩu"
              value={password}
              maxLength={128}
              onChangeText={setPassword}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              error={passwordError}
              hint="Ít nhất 8 ký tự và 1 ký tự đặc biệt (!@#$)"
              accessibilityLabel="Mật khẩu"
            />

            <AuthFormField
              isPassword
              autoCapitalize="none"
              autoComplete="new-password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              maxLength={128}
              onChangeText={setConfirmPassword}
              onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
              error={confirmError}
              accessibilityLabel="Xác nhận mật khẩu"
            />

            {formError && (
              <View className="rounded-2xl border-2 border-danger-100 bg-danger-50 px-4 py-3">
                <Text className="text-sm font-semibold text-danger-600">{formError}</Text>
              </View>
            )}

            {/* Primary CTA */}
            <TouchableOpacity
              disabled={!canSubmit}
              onPress={handleSubmit}
              activeOpacity={0.7}
              className="h-14 w-full rounded-2xl bg-primary-500 border-b-[4px] border-primary-700 items-center justify-center mt-2"
              accessibilityLabel="Đăng ký"
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSubmit }}
              style={!canSubmit ? { opacity: 0.5 } : undefined}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-extrabold font-nunito text-[16px] uppercase tracking-wider">
                  Đăng ký
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center gap-3 mt-1">
              <View className="flex-1 h-[1px] bg-neutral-200" />
              <Text className="text-xs font-semibold text-neutral-300 uppercase">hoặc</Text>
              <View className="flex-1 h-[1px] bg-neutral-200" />
            </View>

            {/* Social Login (Mock) */}
            <TouchableOpacity
              onPress={() => Alert.alert("Sắp ra mắt!", "Đăng ký bằng Google đang được phát triển.")}
              activeOpacity={0.7}
              className="h-14 w-full rounded-2xl bg-white border-2 border-neutral-200 border-b-[4px] border-b-neutral-300 flex-row items-center justify-center gap-2.5"
              accessibilityLabel="Đăng ký bằng Google"
              accessibilityRole="button"
            >
              <Text className="text-lg font-bold">G</Text>
              <Text className="text-mascot-navy font-extrabold font-nunito text-[15px] uppercase tracking-wide">
                Google
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="mt-auto pt-8 flex-row justify-center pb-4">
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
