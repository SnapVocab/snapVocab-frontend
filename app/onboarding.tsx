import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
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
} from "lucide-react-native";
import { Snapy, SpeechBubble } from "@/components/Snapy";
import { cn } from "@/lib/utils";

type Option = { id: string; label: string; icon?: React.ReactNode; bars?: number };

const MOTIVATIONS: Option[] = [
  { id: "giao-tiep", label: "Giao tiếp", icon: <MessageSquareIcon className="text-info-500" /> },
  { id: "di-thi", label: "Đi thi (TOEIC/IELTS)", icon: <GraduationCapIcon className="text-primary-600" /> },
  { id: "cong-viec", label: "Công việc", icon: <BriefcaseIcon className="text-mascot-500" /> },
  { id: "so-thich", label: "Sở thích", icon: <HeartIcon className="text-danger-500" /> },
  { id: "hoc-tap", label: "Học tập", icon: <BookOpenIcon className="text-mascot-violet" /> },
];

const SOURCES: Option[] = [
  { id: "fb", label: "Facebook / Instagram", icon: <SmartphoneIcon className="text-info-500" /> },
  { id: "google", label: "Google Search", icon: <SearchIcon className="text-primary-600" /> },
  { id: "friend", label: "Bạn bè / Người thân", icon: <UsersIcon className="text-mascot-500" /> },
  { id: "tiktok", label: "TikTok", icon: <Music2Icon className="text-mascot-navy" /> },
  { id: "other", label: "Khác", icon: <MoreHorizontalIcon className="text-neutral-400" /> },
];

const LEVELS: Option[] = [
  { id: "l1", label: "Tôi mới bắt đầu", bars: 1 },
  { id: "l2", label: "Tôi biết một số từ cơ bản", bars: 2 },
  { id: "l3", label: "Tôi có thể giao tiếp cơ bản", bars: 3 },
  { id: "l4", label: "Tôi hiểu hầu hết mọi chủ đề", bars: 4 },
];

function LevelBars({ level }: { level: number }) {
  return (
    <View className="flex-row h-6 items-end gap-[3px]">
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          className={cn("w-[5px] rounded-full", i <= level ? "bg-primary-500" : "bg-neutral-100")}
          style={{ height: 6 + i * 4 }}
        />
      ))}
    </View>
  );
}

function ProgressHeader({ step, onBack }: { step: number; onBack: () => void }) {
  return (
    <View className="flex-row items-center gap-3 pt-4">
      <Pressable
        onPress={onBack}
        className="-ml-2 rounded-full p-2 active:bg-neutral-100"
      >
        <ArrowLeftIcon size={28} strokeWidth={3} className="text-neutral-300" />
      </Pressable>
      <View
        className="h-4 flex-1 overflow-hidden rounded-full bg-neutral-50"
      >
        <View
          className="h-full rounded-full bg-primary-500"
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
    <>
      <ProgressHeader step={step} onBack={onBack} />
      <View className="mt-6 flex-row items-end gap-3">
        <Snapy 
          pose={step === 1 ? "to_mo" : step === 2 ? "suy_nghi" : "tap_trung"} 
          animation="idle" 
          className="h-24 w-24 shrink-0" 
        />
        <View className="flex-1 pb-2">
          <SpeechBubble>{question}</SpeechBubble>
        </View>
      </View>

      <View className="mt-6 flex-col gap-3">
        {options.map((o) => {
          const selected = value === o.id;
          return (
            <Pressable
              key={o.id}
              onPress={() => onSelect(o.id)}
              className={cn(
                "flex-row items-center gap-3.5 w-full p-4 rounded-2xl bg-white border border-neutral-200/70 active:scale-[0.99] active:bg-neutral-50", 
                selected ? "border-info-500 bg-info-50/60" : ""
              )}
            >
              {o.bars ? <LevelBars level={o.bars} /> : o.icon ? <View>{o.icon}</View> : null}
              <Text className="font-bold text-mascot-navy text-[15px]">{o.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-auto pt-8">
        <Pressable disabled={!value} onPress={onNext} className="h-14 w-full rounded-xl bg-primary-500 items-center justify-center active:scale-[0.98] active:bg-primary-600 disabled:opacity-50">
          <Text className="text-white font-extrabold font-nunito text-[15px] uppercase tracking-wide">Tiếp tục</Text>
        </Pressable>
      </View>
    </>
  );
}

function PermissionStep({
  step,
  pose,
  animation,
  text,
  primaryLabel,
  secondaryLabel,
  onBack,
  onNext,
}: {
  step: number;
  pose: "snap" | "reading";
  animation: "bounce_in" | "idle";
  text: string;
  primaryLabel: string;
  secondaryLabel: string;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <ProgressHeader step={step} onBack={onBack} />
      <View className="mt-10 flex-1 flex-col items-center">
        <Snapy pose={pose} animation={animation} className="h-56 w-56" />
        <Text className="mt-6 max-w-xs text-xl text-center leading-snug font-extrabold text-mascot-navy">{text}</Text>
      </View>
      <View className="mt-auto flex-col gap-3 pt-8">
        <Pressable onPress={onNext} className="h-14 w-full rounded-xl bg-primary-500 items-center justify-center active:scale-[0.98] active:bg-primary-600">
          <Text className="text-white font-extrabold font-nunito text-[15px] uppercase tracking-wide">{primaryLabel}</Text>
        </Pressable>
        <Pressable onPress={onNext} className="h-14 w-full rounded-xl bg-white border border-neutral-200 items-center justify-center active:scale-[0.98] active:bg-neutral-50">
          <Text className="text-info-600 font-extrabold font-nunito text-[15px] uppercase tracking-wide">{secondaryLabel}</Text>
        </Pressable>
      </View>
    </>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const [screen, setScreen] = useState(0);
  const [motivation, setMotivation] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);

  const back = () => setScreen((s) => Math.max(0, s - 1));
  const next = () => setScreen((s) => s + 1);
  const finish = () => router.push("/signup");

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="mx-auto flex-1 w-full max-w-md flex-col px-6 pb-10">
        {screen === 0 && (
          <View className="flex-1 flex-col items-center justify-center">
            <Snapy pose="main" animation="bounce" className="h-64 w-64" />
            <Text className="mt-4 text-4xl text-center font-extrabold tracking-tight text-primary-500 lowercase font-nunito">
              snapvocab
            </Text>
            <Text className="mt-3 max-w-xs text-[17px] text-center leading-snug font-bold text-neutral-400 font-inter">
              Học từ vựng thông qua hình ảnh. Hoàn toàn miễn phí.
            </Text>
            <View className="mt-10 w-full flex-col gap-3">
              <Pressable onPress={next} className="h-14 w-full rounded-xl bg-primary-500 items-center justify-center active:scale-[0.98] active:bg-primary-600">
                <Text className="text-white font-extrabold font-nunito text-[15px] uppercase tracking-wide">Bắt đầu</Text>
              </Pressable>
              <Link href="/login" asChild>
                <Pressable className="h-14 w-full rounded-xl bg-white border border-neutral-200 items-center justify-center active:scale-[0.98] active:bg-neutral-50">
                  <Text className="text-info-600 font-extrabold font-nunito text-[15px] uppercase tracking-wide">Tôi đã có tài khoản</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        )}

        {screen === 1 && (
          <>
            <View className="flex-row items-center pt-4">
              <Pressable
                onPress={back}
                className="-ml-2 rounded-full p-2 active:bg-neutral-100"
              >
                <ArrowLeftIcon size={28} strokeWidth={3} className="text-neutral-300" />
              </Pressable>
            </View>
            <View className="flex-1 flex-col items-center justify-center gap-4">
              <Snapy pose="nhay_mat" animation="wave" className="h-56 w-56" />
              <View className="w-full">
                <SpeechBubble>
                  Chỉ vài câu hỏi nhanh trước khi chúng ta bắt đầu nhé!
                </SpeechBubble>
              </View>
            </View>
            <Pressable onPress={next} className="h-14 w-full rounded-xl bg-primary-500 items-center justify-center active:scale-[0.98] active:bg-primary-600 mt-auto">
              <Text className="text-white font-extrabold font-nunito text-[15px] uppercase tracking-wide">Tiếp tục</Text>
            </Pressable>
          </>
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
            text="Cho mình dùng camera để quét từ vựng nhé!"
            primaryLabel="Cho phép"
            secondaryLabel="Để sau"
            onBack={back}
            onNext={next}
          />
        )}

        {screen === 6 && (
          <PermissionStep
            step={5}
            pose="reading"
            animation="idle"
            text="Mình sẽ nhắc bạn ôn đúng lúc! Đừng lo!"
            primaryLabel="Bật thông báo"
            secondaryLabel="Lúc khác"
            onBack={back}
            onNext={finish}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
