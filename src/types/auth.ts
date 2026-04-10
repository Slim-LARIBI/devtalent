// ─── Auth Types ───────────────────────────────────────────────────────────────
import type { UserRole } from "./common";

// ─── User / Session ───────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  emailVerified: Date | null;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
}

// ─── Auth DTOs ────────────────────────────────────────────────────────────────

export interface RegisterCredentialsDTO {
  email: string;
  password: string;
  name: string;
  role: UserRole.EXPERT | UserRole.RECRUITER;
}

export interface LoginCredentialsDTO {
  email: string;
  password: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordDTO {
  token: string;
  password: string;
  confirmPassword: string;
}

// ─── Auth Results ─────────────────────────────────────────────────────────────

export interface AuthResult {
  user: AuthUser;
  redirectTo: string;
}

export interface TokenPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
