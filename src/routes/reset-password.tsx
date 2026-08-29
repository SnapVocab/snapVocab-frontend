import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { PolicyHint, passwordRules } from "./signup";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search["email"] === "string" ? search["email"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Đặt lại mật khẩu — SnapVocab" },
      {
        name: "description",
        content: "Tạo mật khẩu mới cho tài khoản SnapVocab sau khi xác thực mã OTP.",
      },
      { property: "og:title", content: "Đặt lại mật khẩu — SnapVocab" },
      { property: "og:description", content: "Tạo mật khẩu mới cho tài khoản SnapVocab." },
    ],
  }),
  component: ResetPassword,
});

const FIELD =
  "h-14 w-full rounded-2xl border-2 bg-neutral-50/60 px-4 text-[15px] font-medium text-mascot-navy outline-none transition placeholder:text-neutral-300 focus:border-info-500 focus:bg-white";

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const pwOk = passwordRules(password).every((r) => r.ok);
  const confirmError =
    touched.confirm && confirm !== password ? "Mật khẩu xác nhận không khớp" : null;
  const canSubmit = pwOk && confirm === password && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ password: true, confirm: true });
    if (!canSubmit) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    navigate({ to: "/login" });
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

      <h1 className="mt-6 text-center text-2xl font-extrabold text-mascot-navy">
        Đặt mật khẩu mới
      </h1>
      <p className="mt-2 text-center text-[15px] font-medium text-neutral-400">
        Mật khẩu mới cần khác mật khẩu cũ và đủ mạnh.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
        <div>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Mật khẩu mới"
              value={password}
              maxLength={128}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              aria-invalid={touched.password && !pwOk}
              className={`${FIELD} pr-12 ${touched.password && !pwOk ? "border-danger-500" : "border-neutral-100"}`}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-neutral-300 hover:text-neutral-500"
            >
              {show ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
          <PolicyHint password={password} />
        </div>

        <div>
          <input
            type={show ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Nhập lại mật khẩu mới"
            value={confirm}
            maxLength={128}
            onChange={(e) => setConfirm(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
            aria-invalid={!!confirmError}
            className={`${FIELD} ${confirmError ? "border-danger-500" : "border-neutral-100"}`}
          />
          {confirmError && <p className="mt-1.5 px-1 text-sm text-danger-600">{confirmError}</p>}
        </div>

        <button type="submit" disabled={!canSubmit} className="btn-3d btn-primary mt-2">
          {loading ? <Loader2 className="animate-spin" size={22} /> : "Đặt lại mật khẩu"}
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
