import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Eye, EyeOff, Loader2, X } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Đăng ký SnapVocab — Tạo tài khoản miễn phí" },
      {
        name: "description",
        content:
          "Tạo tài khoản SnapVocab để lưu tiến độ học từ vựng qua hình ảnh, đồng bộ trên mọi thiết bị.",
      },
      { property: "og:title", content: "Đăng ký SnapVocab" },
      {
        property: "og:description",
        content: "Tạo tài khoản miễn phí để bắt đầu học từ vựng bằng hình ảnh.",
      },
    ],
  }),
  component: Signup,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD =
  "h-14 w-full rounded-2xl border-2 bg-neutral-50/60 px-4 text-[15px] font-medium text-mascot-navy outline-none transition placeholder:text-neutral-300 focus:border-info-500 focus:bg-white";

export function passwordRules(pw: string) {
  return [
    { label: "Ít nhất 8 ký tự", ok: pw.length >= 8 },
    { label: "Có chữ hoa và chữ thường", ok: /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
    { label: "Có ít nhất 1 chữ số", ok: /\d/.test(pw) },
    { label: "Có ít nhất 1 ký tự đặc biệt", ok: /[^A-Za-z0-9]/.test(pw) },
  ];
}

export function PolicyHint({ password }: { password: string }) {
  return (
    <ul className="mt-2 grid gap-1 px-1">
      {passwordRules(password).map((r) => (
        <li
          key={r.label}
          className={`flex items-center gap-2 text-sm font-medium ${
            r.ok ? "text-primary-600" : "text-neutral-400"
          }`}
        >
          {r.ok ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}
          {r.label}
        </li>
      ))}
    </ul>
  );
}

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const rules = passwordRules(password);
  const pwOk = rules.every((r) => r.ok);

  const emailError =
    touched["email"] && !email.trim()
      ? "Vui lòng nhập email"
      : touched["email"] && !EMAIL_RE.test(email.trim())
        ? "Email không đúng định dạng"
        : null;
  const nameError = touched["name"] && !name.trim() ? "Vui lòng nhập tên hiển thị" : null;
  const passwordError = touched["password"] && !pwOk ? "Mật khẩu chưa đạt yêu cầu" : null;
  const confirmError =
    touched["confirm"] && confirm !== password ? "Mật khẩu xác nhận không khớp" : null;

  const canSubmit =
    EMAIL_RE.test(email.trim()) &&
    name.trim().length > 0 &&
    pwOk &&
    confirm === password &&
    agree &&
    !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, name: true, password: true, confirm: true });
    if (!canSubmit) return;
    setFormError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);

    const value = email.trim().toLowerCase();
    if (value.startsWith("exists")) {
      setFormError("Email đã được sử dụng");
      return;
    }
    navigate({ to: "/verify", search: { email: value, mode: "signup" } });
  }

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

      <h1 className="mt-6 text-center text-2xl font-extrabold text-mascot-navy">Tạo tài khoản</h1>

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
            className={`${FIELD} ${emailError ? "border-danger-500" : "border-neutral-100"}`}
          />
          {emailError && <p className="mt-1.5 px-1 text-sm text-danger-600">{emailError}</p>}
        </div>

        <div>
          <input
            type="text"
            autoComplete="name"
            placeholder="Tên hiển thị"
            value={name}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            aria-invalid={!!nameError}
            className={`${FIELD} ${nameError ? "border-danger-500" : "border-neutral-100"}`}
          />
          {nameError && <p className="mt-1.5 px-1 text-sm text-danger-600">{nameError}</p>}
        </div>

        <div>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Mật khẩu"
              value={password}
              maxLength={128}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              aria-invalid={!!passwordError}
              className={`${FIELD} pr-12 ${passwordError ? "border-danger-500" : "border-neutral-100"}`}
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
            placeholder="Nhập lại mật khẩu"
            value={confirm}
            maxLength={128}
            onChange={(e) => setConfirm(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
            aria-invalid={!!confirmError}
            className={`${FIELD} ${confirmError ? "border-danger-500" : "border-neutral-100"}`}
          />
          {confirmError && <p className="mt-1.5 px-1 text-sm text-danger-600">{confirmError}</p>}
        </div>

        <label className="flex items-start gap-3 px-1 text-sm font-medium text-neutral-500">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-primary-500"
          />
          <span>
            Tôi đồng ý với <span className="font-bold text-info-600">Điều khoản sử dụng</span> và{" "}
            <span className="font-bold text-info-600">Chính sách bảo mật</span>
          </span>
        </label>

        {formError && (
          <div
            role="alert"
            className="rounded-2xl border-2 border-danger-100 bg-danger-50 px-4 py-3 text-sm font-semibold text-danger-600"
          >
            {formError}
          </div>
        )}

        <button type="submit" disabled={!canSubmit} className="btn-3d btn-primary mt-2">
          {loading ? <Loader2 className="animate-spin" size={22} /> : "Đăng ký"}
        </button>
      </form>

      <p className="mt-auto pt-10 text-center text-sm font-medium text-neutral-400">
        Đã có tài khoản?{" "}
        <Link to="/login" className="font-bold text-info-600">
          Đăng nhập
        </Link>
      </p>
    </main>
  );
}
