import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  MessagesSquare,
  GraduationCap,
  Briefcase,
  Heart,
  BookOpen,
  Facebook,
  Search,
  Users,
  Music2,
  MoreHorizontal,
} from "lucide-react";
import { Snapy, SpeechBubble } from "@/components/Snapy";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SnapVocab — Học từ vựng qua hình ảnh, miễn phí" },
      {
        name: "description",
        content:
          "Chụp ảnh, học từ vựng và ghi nhớ lâu cùng Snapy. Thiết lập mục tiêu học chỉ trong vài câu hỏi nhanh.",
      },
      { property: "og:title", content: "SnapVocab — Học từ vựng qua hình ảnh" },
      {
        property: "og:description",
        content: "Học từ vựng thông qua hình ảnh. Hoàn toàn miễn phí.",
      },
    ],
  }),
  component: Onboarding,
});

type Option = { id: string; label: string; icon?: React.ReactNode; bars?: number };

const MOTIVATIONS: Option[] = [
  { id: "giao-tiep", label: "Giao tiếp", icon: <MessagesSquare className="text-info-500" /> },
  { id: "di-thi", label: "Đi thi (TOEIC/IELTS)", icon: <GraduationCap className="text-primary-600" /> },
  { id: "cong-viec", label: "Công việc", icon: <Briefcase className="text-mascot-500" /> },
  { id: "so-thich", label: "Sở thích", icon: <Heart className="text-danger-500" /> },
  { id: "hoc-tap", label: "Học tập", icon: <BookOpen className="text-mascot-violet" /> },
];

const SOURCES: Option[] = [
  { id: "fb", label: "Facebook / Instagram", icon: <Facebook className="text-info-500" /> },
  { id: "google", label: "Google Search", icon: <Search className="text-primary-600" /> },
  { id: "friend", label: "Bạn bè / Người thân", icon: <Users className="text-mascot-500" /> },
  { id: "tiktok", label: "TikTok", icon: <Music2 className="text-mascot-navy" /> },
  { id: "other", label: "Khác", icon: <MoreHorizontal className="text-neutral-400" /> },
];

const LEVELS: Option[] = [
  { id: "l1", label: "Tôi mới bắt đầu", bars: 1 },
  { id: "l2", label: "Tôi biết một số từ cơ bản", bars: 2 },
  { id: "l3", label: "Tôi có thể giao tiếp cơ bản", bars: 3 },
  { id: "l4", label: "Tôi hiểu hầu hết mọi chủ đề", bars: 4 },
];

function LevelBars({ level }: { level: number }) {
  return (
    <span className="flex h-6 items-end gap-[3px]" aria-hidden>
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`w-[5px] rounded-full ${i <= level ? "bg-primary-500" : "bg-neutral-100"}`}
          style={{ height: `${6 + i * 4}px` }}
        />
      ))}
    </span>
  );
}

function ProgressHeader({ step, onBack }: { step: number; onBack: () => void }) {
  return (
    <header className="flex items-center gap-3 pt-4">
      <button
        onClick={onBack}
        aria-label="Quay lại"
        className="-ml-2 rounded-full p-2 text-neutral-300 transition hover:text-neutral-500"
      >
        <ArrowLeft size={28} strokeWidth={3} />
      </button>
      <div
        className="h-4 flex-1 overflow-hidden rounded-full bg-neutral-50"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={5}
        aria-label={`Bước ${step} trên 5`}
      >
        <div
          className="h-full rounded-full bg-primary-500 transition-[width] duration-300"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>
    </header>
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
      <div className="mt-6 flex items-end gap-3">
        <Snapy pose="curious" animation="idle" className="h-24 w-24 shrink-0" />
        <div className="flex-1 pb-2">
          <SpeechBubble>{question}</SpeechBubble>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {options.map((o) => {
          const selected = value === o.id;
          return (
            <button
              key={o.id}
              onClick={() => onSelect(o.id)}
              aria-pressed={selected}
              className={`card-option ${
                selected ? "border-info-500 bg-info-50 hover:bg-info-50" : ""
              }`}
            >
              {o.bars ? <LevelBars level={o.bars} /> : o.icon ? <span>{o.icon}</span> : null}
              <span className="font-bold text-mascot-navy">{o.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8">
        <button disabled={!value} onClick={onNext} className="btn-3d btn-primary">
          Tiếp tục
        </button>
      </div>
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
      <div className="mt-10 flex flex-1 flex-col items-center text-center">
        <Snapy pose={pose} animation={animation} className="h-56 w-56" />
        <p className="mt-6 max-w-xs text-xl leading-snug font-extrabold text-mascot-navy">{text}</p>
      </div>
      <div className="mt-auto flex flex-col gap-3 pt-8">
        <button onClick={onNext} className="btn-3d btn-primary">
          {primaryLabel}
        </button>
        <button onClick={onNext} className="btn-3d btn-ghost">
          {secondaryLabel}
        </button>
      </div>
    </>
  );
}

function Onboarding() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState(0); // 0 welcome, 1 transition, 2..6 steps
  const [motivation, setMotivation] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);

  const back = () => setScreen((s) => Math.max(0, s - 1));
  const next = () => setScreen((s) => s + 1);
  const finish = () => navigate({ to: "/signup" });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pb-10">
      {screen === 0 && (
        <section className="flex flex-1 flex-col items-center justify-center text-center">
          <Snapy pose="welcome" animation="wave" className="h-64 w-64" />
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-primary-500 lowercase">
            snapvocab
          </h1>
          <p className="mt-3 max-w-xs text-[17px] leading-snug font-bold text-neutral-400">
            Học từ vựng thông qua hình ảnh. Hoàn toàn miễn phí.
          </p>
          <div className="mt-10 flex w-full flex-col gap-3">
            <button onClick={next} className="btn-3d btn-primary">
              Bắt đầu
            </button>
            <Link to="/login" className="btn-3d btn-ghost">
              Tôi đã có tài khoản
            </Link>
          </div>
        </section>
      )}

      {screen === 1 && (
        <>
          <header className="flex items-center pt-4">
            <button
              onClick={back}
              aria-label="Quay lại"
              className="-ml-2 rounded-full p-2 text-neutral-300 transition hover:text-neutral-500"
            >
              <ArrowLeft size={28} strokeWidth={3} />
            </button>
          </header>
          <section className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <Snapy pose="happy" animation="bounce_in" className="h-52 w-52" />
            <div className="w-full text-left">
              <SpeechBubble>
                Chỉ vài câu hỏi nhanh trước khi chúng ta bắt đầu nhé!
              </SpeechBubble>
            </div>
          </section>
          <button onClick={next} className="btn-3d btn-primary mt-auto">
            Tiếp tục
          </button>
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
    </main>
  );
}
