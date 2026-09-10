import { Link, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeftIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Snapy, SpeechBubble } from '@/components/Snapy';
import { AuthFormField } from '@/components/ui/AuthFormField';
import { EMAIL_RE, validateEmail } from '@/lib/validators';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const emailError = touched ? validateEmail(email) : null;
  const canSubmit = EMAIL_RE.test(email.trim()) && !loading && countdown === 0;

  // Countdown timer after sending
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  async function handleSubmit() {
    setTouched(true);
    if (!canSubmit) return;
    setFormError(null);
    setLoading(true);

    // Mock API call
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);

    const value = email.trim().toLowerCase();

    // Mock: email starts with "notfound" → show error
    if (value.startsWith("notfound")) {
      setFormError("Email không tồn tại trong hệ thống");
      return;
    }

    // Success – start countdown and redirect to OTP
    setSent(true);
    setCountdown(60);
    router.push({ pathname: "/verify", params: { email: value, mode: "reset" } });
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
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

        {/* Mascot illustration */}
        <View className="mt-6 items-center">
          <View style={{ width: 120, height: 120 }} className="items-center justify-center">
            <Snapy pose="suy_nghi" animation="idle" style={{ width: 120, height: 120 }} />
          </View>
          <View className="mt-3 w-full max-w-[280px]">
            <SpeechBubble direction="top" arrowClassName="left-1/2 -ml-2">
              Đừng lo, mình sẽ giúp bạn lấy lại mật khẩu!
            </SpeechBubble>
          </View>
        </View>

        <Text className="mt-6 text-center text-2xl font-extrabold text-mascot-navy">
          Quên mật khẩu
        </Text>
        <Text className="mt-2 text-center text-[15px] leading-6 text-neutral-500 px-4">
          Nhập email bạn đã đăng ký, chúng tôi sẽ gửi mã xác thực để đặt lại mật khẩu.
        </Text>

        <View className="mt-7 flex-col gap-4">
          <AuthFormField
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="Email"
            value={email}
            maxLength={255}
            onChangeText={setEmail}
            onBlur={() => setTouched(true)}
            error={emailError}
            accessibilityLabel="Email"
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
            className="h-14 w-full rounded-2xl bg-primary-500 border-b-[4px] border-primary-700 items-center justify-center mt-1"
            accessibilityLabel="Gửi mã OTP"
            accessibilityRole="button"
            accessibilityState={{ disabled: !canSubmit }}
            style={!canSubmit ? { opacity: 0.5 } : undefined}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-white font-extrabold font-nunito text-[16px] uppercase tracking-wider">
                {countdown > 0 ? `Gửi lại (${countdown}s)` : "Gửi mã OTP"}
              </Text>
            )}
          </TouchableOpacity>
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
