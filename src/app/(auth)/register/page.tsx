"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, UserCircle, Briefcase, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { registerAction, type ActionResult } from "@/features/auth/application/actions";
import { Button }    from "@/components/ui/button";
import { Input }     from "@/components/ui/input";
import { Label }     from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn }        from "@/lib/utils";

// ─── Role selector ────────────────────────────────────────────────────────────

type Role = "EXPERT" | "RECRUITER";

interface RoleCardProps {
  role: Role;
  selected: boolean;
  onSelect: () => void;
  icon: React.ElementType;
  title: string;
  description: string;
}

function RoleCard({ role, selected, onSelect, icon: Icon, title, description }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative flex flex-col gap-2 rounded-xl border p-4 text-left transition-all duration-150",
        selected
          ? "border-brand bg-brand-muted/40 shadow-brand-glow"
          : "border-border bg-surface hover:border-border-strong hover:bg-surface-raised"
      )}
    >
      {selected && (
        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-brand" />
      )}
      <div className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg [&_svg]:size-4.5",
        selected ? "bg-brand text-white" : "bg-surface-overlay text-text-muted"
      )}>
        <Icon />
      </div>
      <div>
        <p className={cn("text-sm font-semibold", selected ? "text-text-primary" : "text-text-secondary")}>
          {title}
        </p>
        <p className="text-xs text-text-muted leading-relaxed mt-0.5">{description}</p>
      </div>
    </button>
  );
}

// ─── Submit button ─────────────────────────────────────────────────────────────

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="brand" className="w-full" size="lg" loading={pending} disabled={pending}>
      {pending ? "Creating account…" : "Create account"}
    </Button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const defaultRole  = (searchParams.get("role") as Role | null) ?? "EXPERT";

  const [role, setRole]       = useState<Role>(defaultRole);
  const [showPwd, setShowPwd] = useState(false);
  const [state, formAction]   = useActionState<ActionResult | null, FormData>(registerAction, null);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-display-sm font-bold text-text-primary tracking-tight">
          Create your account
        </h1>
        <p className="text-body-sm text-text-secondary">
          Join 500+ international development professionals
        </p>
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {state && !state.success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg border border-destructive/20 bg-destructive-muted/30 px-4 py-3 text-sm text-destructive"
          >
            {state.error}
          </motion.div>
        )}
      </AnimatePresence>

      <form action={formAction} className="space-y-5">

        {/* Role selector */}
        <div className="space-y-2">
          <Label>I want to…</Label>
          <div className="grid grid-cols-2 gap-3">
            <RoleCard
              role="EXPERT"
              selected={role === "EXPERT"}
              onSelect={() => setRole("EXPERT")}
              icon={UserCircle}
              title="Find missions"
              description="Browse and apply to international development projects"
            />
            <RoleCard
              role="RECRUITER"
              selected={role === "RECRUITER"}
              onSelect={() => setRole("RECRUITER")}
              icon={Briefcase}
              title="Hire experts"
              description="Post missions and find qualified consultants"
            />
          </div>
          {/* Hidden input for role */}
          <input type="hidden" name="role" value={role} />
        </div>

        {/* Full name */}
        <div className="space-y-1.5">
          <Label htmlFor="name" required>Full name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Dr. Karim Mansour"
            leftIcon={<User />}
            error={!!state?.fieldErrors?.["name"]}
            required
          />
          {state?.fieldErrors?.["name"] && (
            <p className="text-xs text-destructive">{state.fieldErrors["name"]}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" required>Work email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@organization.org"
            leftIcon={<Mail />}
            error={!!state?.fieldErrors?.["email"]}
            required
          />
          {state?.fieldErrors?.["email"] && (
            <p className="text-xs text-destructive">{state.fieldErrors["email"]}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" required hint="Min. 8 chars, uppercase & number">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPwd ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a strong password"
              leftIcon={<Lock />}
              className="pr-11"
              error={!!state?.fieldErrors?.["password"]}
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
          {state?.fieldErrors?.["password"] && (
            <p className="text-xs text-destructive">{state.fieldErrors["password"]}</p>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" required>Confirm password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            leftIcon={<Lock />}
            error={!!state?.fieldErrors?.["confirmPassword"]}
            required
          />
          {state?.fieldErrors?.["confirmPassword"] && (
            <p className="text-xs text-destructive">{state.fieldErrors["confirmPassword"]}</p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2.5">
          <input
            id="acceptTerms"
            name="acceptTerms"
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-border bg-surface accent-brand cursor-pointer"
            required
          />
          <label htmlFor="acceptTerms" className="text-xs text-text-secondary leading-relaxed cursor-pointer">
            I agree to DevTalent&apos;s{" "}
            <Link href="/terms" className="text-brand hover:text-brand-light transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-brand hover:text-brand-light transition-colors">
              Privacy Policy
            </Link>
          </label>
        </div>

        <SubmitButton />
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-text-muted">or</span>
        <Separator className="flex-1" />
      </div>

      {/* Google OAuth */}
      <form action="/api/auth/signin/google" method="POST">
        <input type="hidden" name="callbackUrl" value="/dashboard" />
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

      {/* Login link */}
      <p className="text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:text-brand-light transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
