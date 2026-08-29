import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Fingerprint, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Đăng nhập SnapVocab" },
      {
        name: "description",
        content:
          "Đăng nhập SnapVocab bằng email và mật khẩu hoặc sinh trắc học để tiếp tục học từ vựng.",
      },
      { property: "og:title", content: "Đăng nhập SnapVocab" },
      {
        property: "og:description",
        content: "Đăng nhập để tiếp tục hành trình học từ vựng cùng Snapy.",
      },
    ],
  }),
  component: Login,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const emailError =
    touched.email && !email.trim()
      ? "Vui lòng nhập email"
      : touched.email && !EMAIL_RE.test(email.trim())
        ? "Email không đúng định dạng"
        : null;
  const passwordError = touched.password && !password ? "Vui lòng nhập mật khẩu" : null;
  const canSubmit = EMAIL_RE.test(email.trim()) && password.length > 0 && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!canSubmit) return;
    setFormError(null);
    setLoading(true);

    // Demo auth flow: các nhánh trạng thái theo đặc tả MH-AUTH-01.
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);

    const value = email.trim().toLowerCase();
    if (value.startsWith("unverified")) {
      navigate({ to: "/verify", search: { email: value, mode: "signup" } });
      return;
    }
    if (value.startsWith("locked")) {
      setFormError("Tài khoản đã bị khóa");
      return;
    }
    setFormError("Thông tin đăng nhập không đúng");
  }

  const field =
    "h-14 w-full rounded-2xl border-2 bg-neutral-50/60 px-4 text-[15px] font-medium text-mascot-navy outline-none transition placeholder:text-neutral-300 focus:border-info-500 focus:bg-white";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pt-4 pb-10">
      <header className="flex items-center">
        <Link
          to="/"
          aria-label="Quay lại"
          className="-ml-2 rounded-full p-2 text-neutral-300 transition hover:text-neutral-500"
        >
          <ArrowLeft size={28} strokeWidth={3} />
        </Link>
      </header>

      <h1 className="mt-6 text-center text-2xl font-extrabold text-mascot-navy">Đăng nhập</h1>

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
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            aria-invalid={!!emailError}
            className={`${field} ${emailError ? "border-danger-500" : "border-neutral-100"}`}
          />
          {emailError && <p className="mt-1.5 px-1 text-sm text-danger-600">{emailError}</p>}
        </div>

        <div>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Mật khẩu"
              value={password}
              maxLength={128}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              aria-invalid={!!passwordError}
              className={`${field} pr-12 ${passwordError ? "border-danger-500" : "border-neutral-100"}`}
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
          {passwordError && <p className="mt-1.5 px-1 text-sm text-danger-600">{passwordError}</p>}
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-bold text-info-600">
            Quên mật khẩu?
          </Link>
        </div>

        {formError && (
          <div
            role="alert"
            className="rounded-2xl border-2 border-danger-100 bg-danger-50 px-4 py-3 text-sm font-semibold text-danger-600"
          >
            {formError}
          </div>
        )}

        <button type="submit" disabled={!canSubmit} className="btn-3d btn-primary mt-2">
          {loading ? <Loader2 className="animate-spin" size={22} /> : "Đăng nhập"}
        </button>

        <button type="button" className="btn-3d btn-ghost gap-2">
          <Fingerprint size={22} />
          Đăng nhập sinh trắc học
        </button>
      </form>

      <p className="mt-auto pt-10 text-center text-sm font-medium text-neutral-400">
        Chưa có tài khoản?{" "}
        <Link to="/signup" className="font-bold text-info-600">
          Đăng ký
        </Link>
      </p>
    </main>
  );
}
