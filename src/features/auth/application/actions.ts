"use server";
// ─── Auth Server Actions ──────────────────────────────────────────────────────
// Thin actions — validation + service call + redirect.
// All business logic lives in server/services/auth.service.ts.
// ─────────────────────────────────────────────────────────────────────────────

import { signIn } from "@/lib/auth";
import { registerSchema } from "@/lib/validations/auth";
import { registerUser, AuthError, getRedirectPathForRole } from "@/server/services/auth.service";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import type { UserRole } from "@prisma/client";

// ─── Response shape ───────────────────────────────────────────────────────────

export type ActionResult =
  | { success: true; error?: undefined; fieldErrors?: undefined }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

// ─── Register ─────────────────────────────────────────────────────────────────

export async function registerAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name:            formData.get("name"),
    email:           formData.get("email"),
    password:        formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    role:            formData.get("role"),
    acceptTerms:     formData.get("acceptTerms") === "on" ? true : undefined,
  };

  const parsed = registerSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.errors.forEach((e) => {
      const key = e.path.join(".");
      if (key) fieldErrors[key] = e.message;
    });
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Please check your inputs",
      fieldErrors,
    };
  }

  try {
    await registerUser({
      email:    parsed.data.email,
      password: parsed.data.password,
      name:     parsed.data.name,
      role:     parsed.data.role as UserRole,
    });

    // Sign in immediately after registration
    await signIn("credentials", {
      email:      parsed.data.email,
      password:   parsed.data.password,
      redirectTo: getRedirectPathForRole(parsed.data.role as UserRole),
    });

    // signIn throws a redirect, so this line is never reached
    return { success: true };
  } catch (error) {
    // Re-throw Next.js redirects — they MUST propagate
    if (isRedirectError(error)) throw error;

    if (error instanceof AuthError) {
      return { success: false, error: error.message };
    }

    console.error("[registerAction]", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const email    = (formData.get("email") as string | null)?.toLowerCase().trim();
  const password = formData.get("password") as string | null;
  const callbackUrl = formData.get("callbackUrl") as string | null;

  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl ?? "/dashboard",
    });

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    // Auth.js credential errors
    const message = (error as { cause?: { err?: { message?: string } } })
      ?.cause?.err?.message;

    return {
      success: false,
      error: message ?? "Invalid email or password",
    };
  }
}
