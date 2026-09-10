/**
 * Shared validation constants & helpers for auth screens.
 */

/** Basic email format check */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Password policy: min 8 chars, at least 1 special character */
export const PASSWORD_POLICY_RE = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Vui lòng nhập email";
  if (!EMAIL_RE.test(trimmed)) return "Email không đúng định dạng";
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return "Vui lòng nhập mật khẩu";
  if (!PASSWORD_POLICY_RE.test(value)) return "Mật khẩu chưa đạt yêu cầu";
  return null;
}

export function validateConfirmPassword(
  password: string,
  confirm: string,
): string | null {
  if (password !== confirm) return "Mật khẩu xác nhận không khớp";
  return null;
}

export function validateName(value: string): string | null {
  if (!value.trim()) return "Vui lòng nhập họ tên";
  return null;
}
