import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { ArrowLeftIcon, CircleCheckIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Snapy } from '@/components/Snapy';
import { AuthFormField } from '@/components/ui/AuthFormField';
import { PASSWORD_POLICY_RE, validatePassword, validateConfirmPassword } from '@/lib/validators';

export default function ResetPassword() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordError = touched.password ? validatePassword(password) : null;
  const confirmError = touched.confirm ? validateConfirmPassword(password, confirmPassword) : null;

  const canSubmit =
    PASSWORD_POLICY_RE.test(password) &&
    password === confirmPassword &&
    !loading &&
    !success;

  async function handleSubmit() {
    setTouched({ password: true, confirm: true });
    if (!canSubmit) return;
    setFormError(null);
    setLoading(true);

    // Mock API call
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);

    // Mock: if password starts with "fail" → show error
    if (password.startsWith("fail")) {
      setFormError("Có lỗi xảy ra, vui lòng thử lại");
      return;
    }

    // Show success state before redirect
    setSuccess(true);
    setTimeout(() => {
      router.replace("/login");
    }, 2000);
  }

  // Success state
  if (success) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-6">
          <View style={{ width: 140, height: 140 }} className="items-center justify-center">
            <Snapy pose="an_mung" animation="celebrate" style={{ width: 140, height: 140 }} />
          </View>
          <View className="mt-5 h-16 w-16 rounded-full bg-primary-100 items-center justify-center">
            <CircleCheckIcon size={36} className="text-primary-500" />
          </View>
          <Text className="mt-5 text-2xl font-extrabold text-mascot-navy text-center">
            Đổi mật khẩu thành công!
          </Text>
          <Text className="mt-2 text-[15px] text-neutral-500 text-center">
            Đang chuyển về trang đăng nhập...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="mx-auto flex-1 w-full max-w-md flex-col px-6 pt-4 pb-10">
          <View className="flex-row items-center">
            <Link href="/login" asChild>
              <TouchableOpacity
                className="-ml-2 rounded-full p-2 active:bg-neutral-100"
                accessibilityLabel="Quay lại đăng nhập"
                accessibilityRole="button"
              >
                <ArrowLeftIcon size={28} strokeWidth={3} className="text-neutral-300" />
              </TouchableOpacity>
            </Link>
          </View>

          {/* Mascot */}
          <View className="mt-4 items-center">
            <View style={{ width: 100, height: 100 }} className="items-center justify-center">
              <Snapy pose="tap_trung" animation="idle" style={{ width: 100, height: 100 }} />
            </View>
          </View>

          <Text className="mt-4 text-center text-2xl font-extrabold text-mascot-navy">
            Đặt lại mật khẩu
          </Text>
          <Text className="mt-2 text-center text-[15px] leading-6 text-neutral-500 px-4">
            Tạo mật khẩu mới cho tài khoản{'\n'}
            <Text className="font-bold text-mascot-navy">{email}</Text>
          </Text>

          <View className="mt-7 flex-col gap-4">
            <AuthFormField
              isPassword
              autoCapitalize="none"
              autoComplete="new-password"
              placeholder="Mật khẩu mới"
              value={password}
              maxLength={128}
              onChangeText={setPassword}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              error={passwordError}
              hint="Ít nhất 8 ký tự và 1 ký tự đặc biệt (!@#$)"
              accessibilityLabel="Mật khẩu mới"
            />

            <AuthFormField
              isPassword
              autoCapitalize="none"
              autoComplete="new-password"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              maxLength={128}
              onChangeText={setConfirmPassword}
              onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
              error={confirmError}
              accessibilityLabel="Xác nhận mật khẩu mới"
            />

            {formError && (
              <View className="rounded-2xl border-2 border-danger-100 bg-danger-50 px-4 py-3">
                <Text className="text-sm font-semibold text-danger-600">{formError}</Text>
              </View>
            )}

            <TouchableOpacity
              disabled={!canSubmit}
              onPress={handleSubmit}
              activeOpacity={0.7}
              className="h-14 w-full rounded-2xl bg-primary-500 border-b-[4px] border-primary-700 items-center justify-center mt-2"
              accessibilityLabel="Xác nhận đổi mật khẩu"
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSubmit }}
              style={!canSubmit ? { opacity: 0.5 } : undefined}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-extrabold font-nunito text-[16px] uppercase tracking-wider">
                  Xác nhận
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
