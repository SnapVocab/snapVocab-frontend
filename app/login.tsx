import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { ArrowLeftIcon, FingerprintIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Snapy, SpeechBubble } from '@/components/Snapy';
import { AuthFormField } from '@/components/ui/AuthFormField';
import { GoogleLogo, FacebookLogo } from '@/components/ui/SocialLogos';
import { EMAIL_RE, validateEmail } from '@/lib/validators';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
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
    setBiometricLoading(true);
    setTimeout(() => {
      setBiometricLoading(false);
      Alert.alert(
        "Xác thực sinh trắc học",
        "Nhận diện vân tay / Face ID thành công!",
        [
          {
            text: "Vào học ngay",
            onPress: () => router.replace("/(tabs)")
          }
        ]
      );
    }, 600);
  }

  function handleSocialLogin(provider: 'Google' | 'Facebook') {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        `Đăng nhập ${provider}`,
        `Đã kết nối tài khoản ${provider} thành công!`,
        [
          {
            text: "Vào học ngay",
            onPress: () => router.replace("/(tabs)")
          }
        ]
      );
    }, 600);
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

            {/* Action Row: Primary Login + Compact Biometric Icon Button */}
            <View className="flex-row items-center gap-2.5 mt-1">
              <TouchableOpacity
                disabled={!canSubmit}
                onPress={handleSubmit}
                activeOpacity={0.7}
                className="flex-1 h-14 rounded-2xl bg-primary-500 border-b-[4px] border-primary-700 items-center justify-center active:translate-y-[1px] active:border-b-[2px]"
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

              {/* Compact Biometric Icon Button */}
              <TouchableOpacity
                onPress={handleBiometric}
                activeOpacity={0.7}
                className="w-14 h-14 rounded-2xl bg-info-50 border-2 border-info-200 border-b-[4px] border-b-info-300 items-center justify-center active:translate-y-[1px] active:border-b-[2px] shadow-sm"
                accessibilityLabel="Đăng nhập bằng vân tay hoặc Face ID"
                accessibilityRole="button"
              >
                {biometricLoading ? (
                  <ActivityIndicator color="#0b8fce" size="small" />
                ) : (
                  <FingerprintIcon size={28} color="#0b8fce" />
                )}
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="flex-row items-center gap-3 my-1">
              <View className="flex-1 h-[1px] bg-neutral-200" />
              <Text className="text-xs font-bold text-neutral-400 font-nunito uppercase tracking-wider">
                hoặc tiếp tục với
              </Text>
              <View className="flex-1 h-[1px] bg-neutral-200" />
            </View>

            {/* Social Login: Authentic Google & Facebook */}
            <View className="flex-row items-center gap-3">
              {/* Google */}
              <TouchableOpacity
                onPress={() => handleSocialLogin('Google')}
                activeOpacity={0.8}
                className="flex-1 h-14 rounded-2xl bg-white border-2 border-neutral-200 border-b-[4px] border-b-neutral-300 flex-row items-center justify-center gap-2.5 shadow-sm active:translate-y-[1px] active:border-b-[2px]"
                accessibilityLabel="Đăng nhập bằng Google"
                accessibilityRole="button"
              >
                <GoogleLogo size={22} />
                <Text className="text-neutral-700 font-extrabold font-nunito text-[15px] tracking-wide">
                  Google
                </Text>
              </TouchableOpacity>

              {/* Facebook */}
              <TouchableOpacity
                onPress={() => handleSocialLogin('Facebook')}
                activeOpacity={0.8}
                className="flex-1 h-14 rounded-2xl bg-[#0866FF] border-2 border-[#408BFF] border-b-[4px] border-b-[#0048B5] flex-row items-center justify-center gap-2.5 shadow-md shadow-[#0866FF]/25 active:translate-y-[1px] active:border-b-[2px]"
                accessibilityLabel="Đăng nhập bằng Facebook"
                accessibilityRole="button"
              >
                <FacebookLogo size={22} variant="badge" badgeColor="#FFFFFF" iconColor="#0866FF" />
                <Text className="text-white font-extrabold font-nunito text-[15px] tracking-wide">
                  Facebook
                </Text>
              </TouchableOpacity>
            </View>
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
