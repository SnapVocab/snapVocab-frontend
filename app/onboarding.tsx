import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeftIcon,
  MessageSquareIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  HeartIcon,
  BookOpenIcon,
  SmartphoneIcon,
  SearchIcon,
  UsersIcon,
  Music2Icon,
  MoreHorizontalIcon,
  CheckIcon,
} from "lucide-react-native";
import { useCameraPermissions } from "expo-camera";
import { Snapy, SpeechBubble } from "@/components/Snapy";
import { cn } from "@/lib/utils";

type Option = { id: string; label: string; icon?: React.ReactNode; bars?: number };

const MOTIVATIONS: Option[] = [
  { id: "giao-tiep", label: "Giao tiếp", icon: <MessageSquareIcon size={20} className="text-info-500" /> },
  { id: "di-thi", label: "Đi thi (TOEIC/IELTS)", icon: <GraduationCapIcon size={20} className="text-primary-600" /> },
  { id: "cong-viec", label: "Công việc", icon: <BriefcaseIcon size={20} className="text-mascot-500" /> },
  { id: "so-thich", label: "Sở thích", icon: <HeartIcon size={20} className="text-danger-500" /> },
  { id: "hoc-tap", label: "Học tập", icon: <BookOpenIcon size={20} className="text-mascot-violet" /> },
];

const SOURCES: Option[] = [
  { id: "fb", label: "Facebook / Instagram", icon: <SmartphoneIcon size={20} className="text-info-500" /> },
  { id: "google", label: "Google Search", icon: <SearchIcon size={20} className="text-primary-600" /> },
  { id: "friend", label: "Bạn bè / Người thân", icon: <UsersIcon size={20} className="text-mascot-500" /> },
  { id: "tiktok", label: "TikTok", icon: <Music2Icon size={20} className="text-mascot-navy" /> },
  { id: "other", label: "Khác", icon: <MoreHorizontalIcon size={20} className="text-neutral-400" /> },
];

const LEVELS: Option[] = [
  { id: "l1", label: "Tôi mới bắt đầu", bars: 1 },
  { id: "l2", label: "Tôi biết một số từ cơ bản", bars: 2 },
  { id: "l3", label: "Tôi có thể giao tiếp cơ bản", bars: 3 },
  { id: "l4", label: "Tôi hiểu hầu hết mọi chủ đề", bars: 4 },
];

function LevelBars({ level }: { level: number }) {
  return (
    <View className="flex-row h-6 items-end gap-[4px] px-1">
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          className={cn("w-[5px] rounded-full", i <= level ? "bg-primary-500" : "bg-neutral-200")}
          style={{ height: 6 + i * 4 }}
        />
      ))}
    </View>
  );
}

function ProgressHeader({ step, onBack }: { step: number; onBack: () => void }) {
  return (
    <View className="flex-row items-center gap-3 pt-3 pb-2">
      <TouchableOpacity
        onPress={onBack}
        hitSlop={12}
        activeOpacity={0.6}
        className="-ml-2 rounded-full p-2.5"
      >
        <ArrowLeftIcon size={26} strokeWidth={2.8} className="text-neutral-700" />
      </TouchableOpacity>
      <View className="h-3.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
        <View
          className="h-full rounded-full bg-primary-500 transition-all"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </View>
    </View>
  );
}

function QuestionStep({
  step,
  question,
  options,
  value,
  onSelect,
  onBack,
  onNext,
}: {
  step: number;
  question: string;
  options: Option[];
  value: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <View className="flex-1 flex-col">
      <ProgressHeader step={step} onBack={onBack} />
      
      {/* Snapy mascot + Question bubble in row */}
      <View className="mt-3 mb-5 flex-row items-end gap-3.5">
        <View style={{ width: 84, height: 84 }} className="shrink-0 items-center justify-center">
          <Snapy 
            pose={step === 1 ? "to_mo" : step === 2 ? "suy_nghi" : "tap_trung"} 
            animation="idle" 
            style={{ width: 84, height: 84 }}
          />
        </View>
        <View className="flex-1 pb-1">
          <SpeechBubble direction="left" arrowClassName="top-5">
            {question}
          </SpeechBubble>
        </View>
      </View>

      {/* Options list: 3D chunky cards */}
      <View className="flex-col gap-3">
        {options.map((o) => {
          const selected = value === o.id;
          return (
            <TouchableOpacity
              key={o.id}
              onPress={() => onSelect(o.id)}
              activeOpacity={0.7}
              className={cn(
                "flex-row items-center gap-3.5 w-full p-4 rounded-2xl border-2 transition-all",
                selected
                  ? "bg-primary-50/80 border-primary-500 border-b-[4px] border-b-primary-600"
                  : "bg-white border-neutral-200/90 border-b-[4px] border-b-neutral-300"
              )}
            >
              <View className="w-8 items-center justify-center">
                {o.bars ? <LevelBars level={o.bars} /> : o.icon ? <View>{o.icon}</View> : null}
              </View>
              <Text className={cn(
                "flex-1 font-bold text-[15.5px]",
                selected ? "text-primary-900 font-extrabold" : "text-mascot-navy"
              )}>
                {o.label}
              </Text>
              {selected && (
                <View className="h-6 w-6 rounded-full bg-primary-500 items-center justify-center">
                  <CheckIcon size={14} strokeWidth={3.5} color="white" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="mt-auto pt-6 pb-2">
        <TouchableOpacity
          disabled={!value}
          onPress={onNext}
          activeOpacity={0.7}
          className={cn(
            "h-14 w-full rounded-2xl items-center justify-center transition-all",
            value
              ? "bg-primary-500 border-b-[4px] border-primary-700"
              : "bg-neutral-200 border-b-[4px] border-b-neutral-300 opacity-60"
          )}
        >
          <Text className={cn(
            "font-extrabold font-nunito text-[16px] uppercase tracking-wider",
            value ? "text-white" : "text-neutral-400"
          )}>
            Tiếp tục
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PermissionStep({
  step,
  pose,
  animation,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onBack,
  onPrimary,
  onSecondary,
}: {
  step: number;
  pose: "snap" | "reading";
  animation: "bounce_in" | "idle";
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  onBack: () => void;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  return (
    <View className="flex-1 flex-col">
      <ProgressHeader step={step} onBack={onBack} />
      
      <View className="mt-4 flex-1 flex-col items-center justify-center px-4">
        <View style={{ width: 160, height: 160 }} className="items-center justify-center">
          <Snapy 
            pose={pose} 
            animation={animation} 
            style={{ width: 160, height: 160 }} 
          />
        </View>
        <Text className="mt-5 text-2xl text-center leading-snug font-extrabold text-mascot-navy font-nunito max-w-xs">
          {title}
        </Text>
        <Text className="mt-2.5 text-[15px] text-center leading-relaxed text-neutral-500 font-inter max-w-xs">
          {description}
        </Text>
      </View>

      <View className="mt-auto flex-col gap-3 pt-6 pb-2">
        <TouchableOpacity
          onPress={onPrimary}
          activeOpacity={0.7}
          className="h-14 w-full rounded-2xl bg-primary-500 border-b-[4px] border-primary-700 items-center justify-center"
        >
          <Text className="text-white font-extrabold font-nunito text-[16px] uppercase tracking-wider">
            {primaryLabel}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSecondary}
          activeOpacity={0.7}
          className="h-14 w-full rounded-2xl bg-white border-2 border-neutral-200 border-b-[4px] border-b-neutral-300 items-center justify-center"
        >
          <Text className="text-mascot-navy font-extrabold font-nunito text-[16px] uppercase tracking-wider">
            {secondaryLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const [screen, setScreen] = useState(0);
  const [motivation, setMotivation] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);

  const [, requestCameraPermission] = useCameraPermissions();

  const back = () => setScreen((s) => Math.max(0, s - 1));
  const next = () => setScreen((s) => s + 1);

  const handleCameraPermission = async () => {
    try {
      if (requestCameraPermission) {
        await requestCameraPermission();
      }
    } catch (e) {
      console.log("Camera permission request handled:", e);
    }
    next();
  };

  const finish = (notificationAllowed: boolean) => {
    router.push({
      pathname: "/signup",
      params: {
        motivation: motivation || "",
        source: source || "",
        level: level || "",
        notif: notificationAllowed ? "1" : "0",
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-auto flex-1 w-full max-w-md flex-col px-6 pb-6">
          {screen === 0 && (
            <View className="flex-1 flex-col items-center justify-center py-6">
              <View style={{ width: 220, height: 220 }} className="items-center justify-center">
                <Snapy pose="welcome" animation="wave" style={{ width: 220, height: 220 }} />
              </View>
              <Text className="mt-5 text-4xl text-center font-extrabold tracking-tight text-primary-500 lowercase font-nunito">
                snapvocab
              </Text>
              <Text className="mt-3 max-w-xs text-[17px] text-center leading-relaxed font-bold text-neutral-500 font-inter">
                Học từ vựng thông qua hình ảnh. Hoàn toàn miễn phí.
              </Text>
              <View className="mt-12 w-full flex-col gap-3.5">
                <TouchableOpacity
                  onPress={next}
                  activeOpacity={0.7}
                  className="h-14 w-full rounded-2xl bg-primary-500 border-b-[4px] border-primary-700 items-center justify-center"
                >
                  <Text className="text-white font-extrabold font-nunito text-[16px] uppercase tracking-wider">
                    Bắt đầu
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/login")}
                  activeOpacity={0.7}
                  className="h-14 w-full rounded-2xl bg-white border-2 border-neutral-200 border-b-[4px] border-b-neutral-300 items-center justify-center"
                >
                  <Text className="text-info-600 font-extrabold font-nunito text-[16px] uppercase tracking-wider">
                    Tôi đã có tài khoản
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {screen === 1 && (
            <View className="flex-1 flex-col">
              <View className="flex-row items-center pt-3 pb-2">
                <TouchableOpacity
                  onPress={back}
                  hitSlop={12}
                  activeOpacity={0.6}
                  className="-ml-2 rounded-full p-2.5"
                >
                  <ArrowLeftIcon size={26} strokeWidth={2.8} className="text-neutral-700" />
                </TouchableOpacity>
              </View>
              <View className="flex-1 flex-col items-center justify-center gap-5 px-4">
                <View style={{ width: 170, height: 170 }} className="items-center justify-center">
                  <Snapy pose="happy" animation="wave" style={{ width: 170, height: 170 }} />
                </View>
                <View className="w-full max-w-xs">
                  <SpeechBubble direction="top" arrowClassName="left-1/2 -ml-2">
                    Chỉ vài câu hỏi nhanh trước khi chúng ta bắt đầu nhé!
                  </SpeechBubble>
                </View>
              </View>
              <View className="mt-auto pt-6 pb-2">
                <TouchableOpacity
                  onPress={next}
                  activeOpacity={0.7}
                  className="h-14 w-full rounded-2xl bg-primary-500 border-b-[4px] border-primary-700 items-center justify-center"
                >
                  <Text className="text-white font-extrabold font-nunito text-[16px] uppercase tracking-wider">
                    Tiếp tục
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {screen === 2 && (
            <QuestionStep
              step={1}
              question="Mục tiêu học từ vựng của bạn là gì?"
              options={MOTIVATIONS}
              value={motivation}
              onSelect={setMotivation}
              onBack={back}
              onNext={next}
            />
          )}

          {screen === 3 && (
            <QuestionStep
              step={2}
              question="Bạn biết đến SnapVocab từ đâu?"
              options={SOURCES}
              value={source}
              onSelect={setSource}
              onBack={back}
              onNext={next}
            />
          )}

          {screen === 4 && (
            <QuestionStep
              step={3}
              question="Vốn từ vựng của bạn đang ở mức nào?"
              options={LEVELS}
              value={level}
              onSelect={setLevel}
              onBack={back}
              onNext={next}
            />
          )}

          {screen === 5 && (
            <PermissionStep
              step={4}
              pose="snap"
              animation="bounce_in"
              title="Cho mình dùng camera nhé!"
              description="SnapVocab nhận diện đồ vật xung quanh để tạo flashcard từ vựng tức thì."
              primaryLabel="Cho phép"
              secondaryLabel="Để sau"
              onBack={back}
              onPrimary={handleCameraPermission}
              onSecondary={next}
            />
          )}

          {screen === 6 && (
            <PermissionStep
              step={5}
              pose="reading"
              animation="idle"
              title="Mình sẽ nhắc bạn ôn tập!"
              description="Học đúng thời điểm ngắt quãng (FSRS) giúp bạn nhớ từ vựng lâu hơn x3 lần."
              primaryLabel="Bật thông báo"
              secondaryLabel="Lúc khác"
              onBack={back}
              onPrimary={() => finish(true)}
              onSecondary={() => finish(false)}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
