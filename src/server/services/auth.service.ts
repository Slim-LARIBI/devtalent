// ─── Auth Service ─────────────────────────────────────────────────────────────
// Business logic for authentication and user management.
// No Next.js-specific imports. Can be extracted to NestJS unchanged.
// ─────────────────────────────────────────────────────────────────────────────

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  findUserByEmail,
  createUser,
  findUserById,
} from "@/server/repositories/user.repository";
import { generateExpertSlug } from "@/lib/utils";
import type { UserRole } from "@prisma/client";

const SALT_ROUNDS = 12;

// ─── Errors ───────────────────────────────────────────────────────────────────

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "AuthError";
  }
}

// ─── Service methods ──────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function registerUser(data: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}) {
  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw new AuthError("An account with this email already exists", "EMAIL_IN_USE");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await createUser({
    email: data.email.toLowerCase().trim(),
    name: data.name.trim(),
    password: hashedPassword,
    role: data.role,
  });

  // Automatically create the corresponding profile shell
  if (data.role === "EXPERT") {
    const slug = generateExpertSlug(user.name ?? user.email, user.id);
    await prisma.expertProfile.create({
      data: { userId: user.id, slug },
    });
  } else if (data.role === "RECRUITER") {
    await prisma.recruiterProfile.create({
      data: { userId: user.id },
    });
  }

  // Strip password before returning
  const { password: _pwd, ...safeUser } = user;
  return safeUser;
}

export async function validateCredentials(email: string, password: string) {
  const user = await findUserByEmail(email.toLowerCase().trim());

  if (!user || !user.password) {
    // Consistent timing to prevent user enumeration
    await bcrypt.hash("dummy-timing-prevention", SALT_ROUNDS);
    throw new AuthError("Invalid email or password", "INVALID_CREDENTIALS");
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    throw new AuthError("Invalid email or password", "INVALID_CREDENTIALS");
  }

  if (!user.isActive) {
    throw new AuthError(
      "Your account has been deactivated. Please contact support.",
      "ACCOUNT_INACTIVE"
    );
  }

  const { password: _pwd, ...safeUser } = user;
  return safeUser;
}

export async function getUserWithRole(userId: string) {
  return findUserById(userId);
}

export function getRedirectPathForRole(role: UserRole): string {
  switch (role) {
    case "EXPERT":
      return "/expert/dashboard";
    case "RECRUITER":
      return "/recruiter/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
    default:
      return "/";
  }
}
