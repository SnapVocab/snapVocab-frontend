import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Snapy } from "@/components/Snapy";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Quên mật khẩu — SnapVocab" },
      {
        name: "description",
        content: "Khôi phục mật khẩu tài khoản SnapVocab của bạn qua mã OTP gửi tới email.",
      },
      { property: "og:title", content: "Quên mật khẩu — SnapVocab" },
      { property: "og:description", content: "Khôi phục mật khẩu tài khoản SnapVocab." },
    ],
  }),
  component: ForgotPassword,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailError =
    touched && !email.trim()
      ? "Vui lòng nhập email"
      : touched && !EMAIL_RE.test(email.trim())
        ? "Email không đúng định dạng"
        : null;
  const canSubmit = EMAIL_RE.test(email.trim()) && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    navigate({ to: "/verify", search: { email: email.trim().toLowerCase(), mode: "reset" } });
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pt-4 pb-10">
      <header className="flex items-center">
        <Link
          to="/login"
          aria-label="Quay lại đăng nhập"
          className="-ml-2 rounded-full p-2 text-neutral-300 transition hover:text-neutral-500"
        >
          <ArrowLeft size={28} strokeWidth={3} />
        </Link>
      </header>

      <div className="mt-4 flex flex-col items-center text-center">
        <Snapy pose="curious" animation="idle" className="h-32 w-32" />
        <h1 className="mt-2 text-2xl font-extrabold text-mascot-navy">Quên mật khẩu?</h1>
        <p className="mt-2 text-[15px] font-medium text-neutral-400">
          Nhập email của bạn, Snapy sẽ gửi mã OTP để đặt lại mật khẩu.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
        <div>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            maxLength={255}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={!!emailError}
            className={`h-14 w-full rounded-2xl border-2 bg-neutral-50/60 px-4 text-[15px] font-medium text-mascot-navy outline-none transition placeholder:text-neutral-300 focus:border-info-500 focus:bg-white ${
              emailError ? "border-danger-500" : "border-neutral-100"
            }`}
          />
          {emailError && <p className="mt-1.5 px-1 text-sm text-danger-600">{emailError}</p>}
        </div>

        <button type="submit" disabled={!canSubmit} className="btn-3d btn-primary mt-2">
          {loading ? <Loader2 className="animate-spin" size={22} /> : "Gửi mã OTP"}
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
