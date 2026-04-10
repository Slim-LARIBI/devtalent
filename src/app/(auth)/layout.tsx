import Link from "next/link";
import { Globe } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* ─── Left: Form column ─── */}
      <div className="relative flex flex-col bg-background">
        {/* Logo */}
        <div className="shrink-0 p-8">
          <Link href="/" className="flex items-center gap-2.5 w-fit group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand shadow-brand-glow group-hover:shadow-brand-glow-lg transition-shadow">
              <Globe className="h-4 w-4 text-white" />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-text-primary">
              Dev<span className="text-brand">Talent</span>
            </span>
          </Link>
        </div>

        {/* Form content */}
        <div className="flex flex-1 items-center justify-center px-8 pb-12">
          <div className="w-full max-w-sm">
            {children}
          </div>
        </div>

        {/* Bottom links */}
        <div className="shrink-0 p-8 flex items-center justify-center gap-6">
          <Link href="/privacy" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
            Contact
          </Link>
        </div>
      </div>

      {/* ─── Right: Visual column (desktop only) ─── */}
      <div className="relative hidden lg:flex flex-col hero-gradient overflow-hidden">
        {/* Background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--border-strong)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border-strong)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow */}
        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-brand/10 blur-3xl" />

        <div className="relative flex flex-1 flex-col items-center justify-center p-16 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand shadow-brand-glow-lg">
            <Globe className="h-8 w-8 text-white" />
          </div>

          <h2 className="text-display-sm font-bold text-text-primary mb-4 tracking-tight">
            The premium platform for<br />
            <span className="gradient-text">international development</span>
          </h2>
          <p className="text-body-md text-text-secondary max-w-sm mx-auto leading-relaxed">
            Connect with EU-funded projects, World Bank programmes, UN agencies,
            and leading consulting firms worldwide.
          </p>

          {/* Social proof */}
          <div className="mt-12 grid grid-cols-3 gap-6 w-full max-w-xs">
            {[
              { value: "500+", label: "Experts" },
              { value: "200+", label: "Missions" },
              { value: "60+",  label: "Countries" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-text-primary">{value}</p>
                <p className="text-xs text-text-muted mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Donor logos */}
          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {["EU", "World Bank", "UNDP", "GIZ", "AfDB"].map((donor) => (
              <span key={donor} className="text-xs font-semibold text-text-disabled">
                {donor}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
