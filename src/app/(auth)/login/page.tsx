"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { loginAction, type ActionResult } from "@/features/auth/application/actions";
import { Button }    from "@/components/ui/button";
import { Input }     from "@/components/ui/input";
import { Label }     from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// ─── Submit button with pending state ─────────────────────────────────────────

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="brand"
      className="w-full"
      size="lg"
      loading={pending}
      disabled={pending}
    >
      {pending ? "Signing in…" : "Sign in"}
    </Button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const searchParams  = useSearchParams();
  const callbackUrl   = searchParams.get("callbackUrl") ?? "/dashboard";
  const [showPwd, setShowPwd]     = useState(false);
  const [state, formAction]       = useActionState<ActionResult | null, FormData>(loginAction, null);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-display-sm font-bold text-text-primary tracking-tight">
          Welcome back
        </h1>
        <p className="text-body-sm text-text-secondary">
          Sign in to your DevTalent account
        </p>
      </div>

      {/* Error banner */}
      {state && !state.success && (
        <div className="rounded-lg border border-destructive/20 bg-destructive-muted/30 px-4 py-3 text-sm text-destructive animate-fade-in">
          {state.error}
        </div>
      )}

      {/* Form */}
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@organization.org"
            leftIcon={<Mail />}
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-brand hover:text-brand-light transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPwd ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              leftIcon={<Lock />}
              className="pr-11"
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              tabIndex={-1}
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <SubmitButton />
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-text-muted">or continue with</span>
        <Separator className="flex-1" />
      </div>

      {/* Google OAuth */}
      <form action="/api/auth/signin/google" method="POST">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <Button type="submit" variant="secondary" className="w-full" size="lg">
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"/>
            <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"/>
            <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"/>
            <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853"/>
          </svg>
          Continue with Google
        </Button>
      </form>

      {/* Register link */}
      <p className="text-center text-sm text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-brand hover:text-brand-light transition-colors">
          Create one for free
        </Link>
      </p>
    </div>
  );
}
