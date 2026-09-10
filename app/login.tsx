import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { ArrowLeftIcon, FingerprintIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Snapy, SpeechBubble } from '@/components/Snapy';
import { AuthFormField } from '@/components/ui/AuthFormField';
import { EMAIL_RE, validateEmail } from '@/lib/validators';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const emailError = touched.email ? validateEmail(email) : null;
  const passwordError = touched.password && !password ? "Vui lòng nhập mật khẩu" : null;
  const canSubmit = EMAIL_RE.test(email.trim()) && password.length > 0 && !loading;

  async function handleSubmit() {
    setTouched({ email: true, password: true });
    if (!canSubmit) return;
    setFormError(null);
    setLoading(true);

    // Mock API call
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);

    router.replace("/(tabs)");
  }

  function handleBiometric() {
    Alert.alert("Sắp ra mắt!", "Tính năng đăng nhập sinh trắc học đang được phát triển. Vui lòng dùng email & mật khẩu.");
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="mx-auto flex-1 w-full max-w-md flex-col px-6 pt-4 pb-10">
          <View className="flex-row items-center">
            <Link href="/" asChild>
              <TouchableOpacity
                className="-ml-2 rounded-full p-2 active:bg-neutral-100"
                accessibilityLabel="Quay lại"
                accessibilityRole="button"
              >
                <ArrowLeftIcon size={28} strokeWidth={3} className="text-neutral-300" />
              </TouchableOpacity>
            </Link>
          </View>

          {/* Mascot + Welcome */}
          <View className="mt-4 items-center">
            <View style={{ width: 120, height: 120 }} className="items-center justify-center">
              <Snapy pose="welcome" animation="wave" style={{ width: 120, height: 120 }} />
            </View>
            <Text className="mt-3 text-center text-2xl font-extrabold text-mascot-navy">
              Chào mừng trở lại!
            </Text>
            <Text className="mt-1.5 text-center text-[15px] text-neutral-400">
              Đăng nhập để tiếp tục học nào
            </Text>
          </View>

          {/* Form */}
          <View className="mt-7 flex-col gap-4">
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
              placeholder="Mật khẩu"
              value={password}
              maxLength={128}
              onChangeText={setPassword}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              error={passwordError}
              accessibilityLabel="Mật khẩu"
            />

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

            {/* Primary CTA */}
            <TouchableOpacity
              disabled={!canSubmit}
              onPress={handleSubmit}
              activeOpacity={0.7}
              className="h-14 w-full rounded-2xl bg-primary-500 border-b-[4px] border-primary-700 items-center justify-center mt-1"
              accessibilityLabel="Đăng nhập"
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSubmit }}
              style={!canSubmit ? { opacity: 0.5 } : undefined}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-extrabold font-nunito text-[16px] uppercase tracking-wider">
                  Đăng nhập
                </Text>
              )}
            </TouchableOpacity>

            {/* Biometric */}
            <TouchableOpacity
              onPress={handleBiometric}
              activeOpacity={0.7}
              className="h-14 w-full rounded-2xl bg-white border-2 border-neutral-200 border-b-[4px] border-b-neutral-300 gap-2 flex-row items-center justify-center"
              accessibilityLabel="Đăng nhập sinh trắc học"
              accessibilityRole="button"
            >
              <FingerprintIcon size={22} className="text-info-600" />
              <Text className="text-info-600 font-extrabold font-nunito text-[15px] uppercase tracking-wide">
                Sinh trắc học
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center gap-3 mt-1">
              <View className="flex-1 h-[1px] bg-neutral-200" />
              <Text className="text-xs font-semibold text-neutral-300 uppercase">hoặc</Text>
              <View className="flex-1 h-[1px] bg-neutral-200" />
            </View>

            {/* Social Login (Mock) */}
            <TouchableOpacity
              onPress={() => Alert.alert("Sắp ra mắt!", "Đăng nhập bằng Google đang được phát triển.")}
              activeOpacity={0.7}
              className="h-14 w-full rounded-2xl bg-white border-2 border-neutral-200 border-b-[4px] border-b-neutral-300 flex-row items-center justify-center gap-2.5"
              accessibilityLabel="Đăng nhập bằng Google"
              accessibilityRole="button"
            >
              <Text className="text-lg font-bold">G</Text>
              <Text className="text-mascot-navy font-extrabold font-nunito text-[15px] uppercase tracking-wide">
                Google
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="mt-auto pt-10 flex-row justify-center">
            <Text className="text-sm font-medium text-neutral-400">
              Chưa có tài khoản?{" "}
            </Text>
            <Link href="/signup">
              <Text className="text-sm font-bold text-info-600">Đăng ký</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
