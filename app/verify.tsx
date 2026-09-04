import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { ArrowLeftIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';

export default function VerifyOTP() {
  const router = useRouter();
  const { email, mode } = useLocalSearchParams<{ email: string; mode: string }>();
  
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const [countdown, setCountdown] = useState(60);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const canSubmit = otp.length === 6 && !loading && attempts < 5;

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

    // Success
    if (mode === "reset") {
      router.replace({ pathname: "/reset-password", params: { email } });
    } else {
      // Auto login for signup
      router.replace("/");
    }
  }

  function handleResend() {
    if (countdown > 0) return;
    // Mock resend logic
    setCountdown(60);
    setAttempts(0);
    setFormError(null);
    setOtp("");
  }

  const field =
    "h-14 w-full rounded-2xl border-2 bg-neutral-50/60 px-4 text-center text-2xl font-bold text-mascot-navy tracking-[0.25em] placeholder:text-neutral-300 focus:border-info-500 focus:bg-white";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="mx-auto flex-1 w-full max-w-md flex-col px-6 pt-4 pb-10">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="-ml-2 rounded-full p-2 active:bg-neutral-100">
            <ArrowLeftIcon size={28} strokeWidth={3} className="text-neutral-300" />
          </Pressable>
        </View>

        <Text className="mt-6 text-center text-2xl font-extrabold text-mascot-navy">
          Xác thực Email
        </Text>
        <Text className="mt-3 text-center text-[15px] leading-6 text-neutral-500 px-4">
          Mã xác nhận đã được gửi đến{'\n'}
          <Text className="font-bold text-mascot-navy">{email}</Text>
        </Text>

        <View className="mt-8 flex-col gap-4">
          <View>
            <TextInput
              keyboardType="number-pad"
              placeholder="000000"
              placeholderTextColor="#9597ad"
              value={otp}
              maxLength={6}
              onChangeText={setOtp}
              editable={attempts < 5}
              className={cn(field, formError ? "border-danger-500" : "border-neutral-100")}
            />
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
            {loading ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white font-bold text-[15px] uppercase">Xác nhận</Text>}
          </Pressable>
          
          <Pressable 
            disabled={countdown > 0} 
            onPress={handleResend}
            className={cn("btn-3d flex-row gap-2 mt-2", countdown > 0 ? "bg-neutral-100" : "btn-ghost")}
          >
            <Text className={cn("font-bold text-[15px] uppercase", countdown > 0 ? "text-neutral-400" : "text-info-600")}>
              {countdown > 0 ? `Gửi lại mã (${countdown}s)` : "Gửi lại mã OTP"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
