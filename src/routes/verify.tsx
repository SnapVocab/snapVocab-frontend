import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Snapy } from "@/components/Snapy";

type VerifySearch = { email: string; mode: "signup" | "reset" };

export const Route = createFileRoute("/verify")({
  validateSearch: (search: Record<string, unknown>): VerifySearch => ({
    email: typeof search["email"] === "string" ? search["email"] : "",
    mode: search["mode"] === "reset" ? "reset" : "signup",
  }),
  head: () => ({
    meta: [
      { title: "Xác thực OTP — SnapVocab" },
      {
        name: "description",
        content: "Nhập mã OTP 6 số được gửi tới email để xác thực tài khoản SnapVocab.",
      },
      { property: "og:title", content: "Xác thực OTP — SnapVocab" },
      { property: "og:description", content: "Nhập mã OTP để kích hoạt tài khoản SnapVocab." },
    ],
  }),
  component: Verify,
});

const LENGTH = 6;
const MAX_ATTEMPTS = 5;
const COOLDOWN = 60;

function Verify() {
  const { email, mode } = Route.useSearch();
  const navigate = useNavigate();
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const [cooldown, setCooldown] = useState(COOLDOWN);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const code = digits.join("");
  const canSubmit = code.length === LENGTH && !loading && !locked;

  function setDigit(i: number, v: string) {
    const clean = v.replace(/\D/g, "");
    if (!clean) {
      setDigits((d) => d.map((x, idx) => (idx === i ? "" : x)));
      return;
    }
    setDigits((d) => {
      const next = [...d];
      clean.split("").forEach((ch, k) => {
        if (i + k < LENGTH) next[i + k] = ch;
      });
      return next;
    });
    const target = Math.min(i + clean.length, LENGTH - 1);
    inputs.current[target]?.focus();
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  }

  function resend() {
    setCooldown(COOLDOWN);
    setAttemptsLeft(MAX_ATTEMPTS);
    setLocked(false);
    setError(null);
    setDigits(Array(LENGTH).fill(""));
    inputs.current[0]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);

    // Demo: 123456 hợp lệ, 000000 giả lập mã hết hạn.
    if (code === "000000") {
      setError("Mã đã hết hạn, vui lòng gửi lại");
      return;
    }
    if (code !== "123456") {
      const left = attemptsLeft - 1;
      setAttemptsLeft(left);
      if (left <= 0) {
        setLocked(true);
        setError("Bạn đã nhập sai quá 5 lần. Vui lòng gửi lại mã mới.");
      } else {
        setError(`Mã không đúng, còn ${left} lần thử`);
      }
      return;
    }

    if (mode === "reset") {
      navigate({ to: "/reset-password", search: { email } });
    } else {
      navigate({ to: "/" });
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pt-4 pb-10">
      <header className="flex items-center">
        <Link
          to={mode === "reset" ? "/forgot-password" : "/signup"}
          aria-label="Quay lại"
          className="-ml-2 rounded-full p-2 text-neutral-300 transition hover:text-neutral-500"
        >
          <ArrowLeft size={28} strokeWidth={3} />
        </Link>
      </header>

      <div className="mt-4 flex flex-col items-center text-center">
        <Snapy pose="reading" animation="idle" className="h-32 w-32" />
        <h1 className="mt-2 text-2xl font-extrabold text-mascot-navy">Xác thực mã OTP</h1>
        <p className="mt-2 text-[15px] font-medium text-neutral-400">
          Mã gồm 6 số đã được gửi tới
        </p>
        <p className="mt-1 w-full truncate rounded-xl bg-neutral-50 px-4 py-2 text-[15px] font-bold text-mascot-navy">
          {email || "email của bạn"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
        <div className="flex justify-between gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={LENGTH}
              disabled={locked}
              aria-label={`Số thứ ${i + 1}`}
              className={`h-16 w-full rounded-2xl border-2 bg-neutral-50/60 text-center text-2xl font-extrabold text-mascot-navy outline-none transition focus:border-info-500 focus:bg-white disabled:opacity-50 ${
                error ? "border-danger-500" : "border-neutral-100"
              }`}
            />
          ))}
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-2xl border-2 border-danger-100 bg-danger-50 px-4 py-3 text-sm font-semibold text-danger-600"
          >
            {error}
          </div>
        )}

        <button type="submit" disabled={!canSubmit} className="btn-3d btn-primary mt-2">
          {loading ? <Loader2 className="animate-spin" size={22} /> : "Xác thực"}
        </button>

        <button
          type="button"
          onClick={resend}
          disabled={cooldown > 0}
          className="btn-3d btn-ghost disabled:text-neutral-300"
        >
          {cooldown > 0 ? `Gửi lại mã sau ${cooldown}s` : "Gửi lại mã OTP"}
        </button>
      </form>

      <p className="mt-auto pt-10 text-center text-sm font-medium text-neutral-400">
        <Link to="/login" className="font-bold text-info-600">
          Quay lại đăng nhập
        </Link>
      </p>
    </main>
  );
}
