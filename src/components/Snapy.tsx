import welcome from "@/assets/snapy-welcome.png";
import happy from "@/assets/snapy-happy.png";
import curious from "@/assets/snapy-curious.png";
import snap from "@/assets/snapy-snap.png";
import reading from "@/assets/snapy-reading.png";

const POSES = { welcome, happy, curious, snap, reading } as const;

export type SnapyPose = keyof typeof POSES;

const ANIM: Record<string, string> = {
  wave: "animate-[snapy-wave_2.4s_ease-in-out_infinite]",
  bounce_in: "animate-[snapy-bounce_1.8s_ease-in-out_infinite]",
  idle: "animate-[snapy-idle_3.5s_ease-in-out_infinite]",
  none: "",
};

export function Snapy({
  pose,
  animation = "idle",
  className = "",
}: {
  pose: SnapyPose;
  animation?: keyof typeof ANIM;
  className?: string;
}) {
  return (
    <img
      src={POSES[pose]}
      alt="Snapy - mascot của SnapVocab"
      width={768}
      height={768}
      className={`select-none object-contain drop-shadow-sm ${ANIM[animation]} ${className}`}
    />
  );
}

export function SpeechBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl border-2 border-mascot-200 bg-mascot-cream px-4 py-3 text-mascot-navy">
      <span
        className="absolute -bottom-[9px] left-8 h-4 w-4 rotate-45 border-r-2 border-b-2 border-mascot-200 bg-mascot-cream"
        aria-hidden
      />
      <p className="text-[15px] leading-snug font-semibold">{children}</p>
    </div>
  );
}
