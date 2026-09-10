import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeftIcon, CircleCheckIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Snapy } from '@/components/Snapy';
import { OtpInput } from '@/components/ui/OtpInput';

export default function VerifyOTP() {
  const router = useRouter();
  const { email, mode } = useLocalSearchParams<{ email: string; mode: string }>();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [countdown, setCountdown] = useState(60);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const canSubmit = otp.length === 6 && !loading && attempts < 5 && !success;

  async function handleSubmit() {
    if (!canSubmit) return;
    setFormError(null);
    setLoading(true);

    // Mock API call
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);

    if (otp === "000000") {
      setFormError("Mã đã hết hạn, vui lòng gửi lại");
      return;
    }

    if (otp !== "123456") {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 5) {
        setFormError("Quá 5 lần thử. Vui lòng yêu cầu mã mới.");
      } else {
        setFormError(`Mã không đúng, còn ${5 - newAttempts} lần thử`);
      }
      return;
    }

    // Success – show celebration before redirect
    setSuccess(true);
    setTimeout(() => {
      if (mode === "reset") {
        router.replace({ pathname: "/reset-password", params: { email } });
      } else {
        // Auto login for signup
        router.replace("/(tabs)");
      }
    }, 1800);
  }

  function handleResend() {
    if (countdown > 0) return;
    // Mock resend logic
    setCountdown(60);
    setAttempts(0);
    setFormError(null);
    setOtp("");
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
            Xác thực thành công!
          </Text>
          <Text className="mt-2 text-[15px] text-neutral-500 text-center">
            {mode === "reset" ? "Đang chuyển tới đặt lại mật khẩu..." : "Đang đưa bạn vào ứng dụng..."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
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

        {/* Mascot */}
        <View className="mt-4 items-center">
          <View style={{ width: 110, height: 110 }} className="items-center justify-center">
            <Snapy
              pose={formError ? "bat_ngo" : "to_mo"}
              animation={formError ? "shake" : "bounce"}
              style={{ width: 110, height: 110 }}
            />
          </View>
        </View>

        <Text className="mt-4 text-center text-2xl font-extrabold text-mascot-navy">
          Xác thực Email
        </Text>
        <Text className="mt-2 text-center text-[15px] leading-6 text-neutral-500 px-4">
          Mã xác nhận đã được gửi đến{'\n'}
          <Text className="font-bold text-mascot-navy">{email}</Text>
        </Text>

        <View className="mt-8 flex-col gap-4">
          {/* 6-cell OTP input */}
          <OtpInput
            value={otp}
            onChange={setOtp}
            disabled={attempts >= 5}
            hasError={!!formError}
          />

          {formError && (
            <View className="rounded-2xl border-2 border-danger-100 bg-danger-50 px-4 py-3">
              <Text className="text-sm font-semibold text-danger-600 text-center">{formError}</Text>
            </View>
          )}

          <TouchableOpacity
            disabled={!canSubmit}
            onPress={handleSubmit}
            activeOpacity={0.7}
            className="h-14 w-full rounded-2xl bg-primary-500 border-b-[4px] border-primary-700 items-center justify-center mt-1"
            accessibilityLabel="Xác nhận mã OTP"
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

          <TouchableOpacity
            disabled={countdown > 0}
            onPress={handleResend}
            activeOpacity={0.7}
            className="h-14 w-full rounded-2xl items-center justify-center mt-1"
            style={[
              countdown > 0
                ? { backgroundColor: '#eeeff3' }
                : { backgroundColor: '#fff', borderWidth: 2, borderColor: '#d4d5df' },
            ]}
            accessibilityLabel={countdown > 0 ? `Gửi lại mã sau ${countdown} giây` : "Gửi lại mã OTP"}
            accessibilityRole="button"
          >
            <Text
              className="font-extrabold font-nunito text-[15px] uppercase tracking-wide"
              style={{ color: countdown > 0 ? '#9597ad' : '#1cb0f6' }}
            >
              {countdown > 0 ? `Gửi lại mã (${countdown}s)` : "Gửi lại mã OTP"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
