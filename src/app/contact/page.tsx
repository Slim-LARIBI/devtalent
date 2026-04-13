import Link from "next/link";
import {
  Mail,
  Globe,
  Shield,
  Clock3,
  Briefcase,
  Building2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const CONTACT_POINTS = [
  {
    icon: Clock3,
    title: "Fast response",
    text: "Quick answers for partnerships and recruiter onboarding.",
    tone: "blue",
  },
  {
    icon: Briefcase,
    title: "Recruiter onboarding",
    text: "Support for firms hiring experts on donor-funded missions.",
    tone: "green",
  },
  {
    icon: Shield,
    title: "Trusted workflow",
    text: "Structured communication for serious development hiring.",
    tone: "purple",
  },
];

const BENEFITS = [
  "Development-focused hiring support",
  "Recruiter onboarding and product walkthrough",
  "Partnership and collaboration discussions",
  "International coverage across EU · Africa · MENA",
];

function toneClasses(tone: string) {
  switch (tone) {
    case "blue":
      return "border-brand/20 bg-brand/5 text-brand";
    case "green":
      return "border-success/20 bg-success/5 text-success";
    case "purple":
      return "border-violet-500/20 bg-violet-500/5 text-violet-600";
    default:
      return "border-border bg-surface text-text-primary";
  }
}

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--border-strong)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border-strong)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
        <div className="pointer-events-none absolute top-80 right-0 h-[260px] w-[320px] rounded-full bg-accent/8 blur-3xl" />

        <section className="landing-container relative py-16 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-muted/30 px-4 py-1.5 text-xs font-semibold text-brand-light">
              <Mail className="h-3.5 w-3.5" />
              Contact DevTalent
            </span>

            <h1 className="mt-6 text-display-sm font-bold tracking-tight text-text-primary lg:text-display-lg">
              Let’s talk about hiring top development experts
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-body-lg leading-relaxed text-text-secondary">
              Whether you want to onboard as a recruiter, discuss a partnership,
              or explore how DevTalent supports donor-funded recruitment, our team
              is here to help.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {CONTACT_POINTS.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`rounded-2xl border p-5 shadow-sm ${toneClasses(item.tone)}`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            {/* LEFT */}
            <div className="overflow-hidden rounded-[30px] border border-border bg-white shadow-elevation-4">
              <div className="bg-gradient-to-r from-brand to-accent px-7 py-6 text-white">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <p className="text-sm font-semibold uppercase tracking-[0.12em]">
                    Premium contact
                  </p>
                </div>

                <h2 className="mt-4 text-2xl font-bold tracking-tight">
                  Contact the DevTalent team
                </h2>

                <p className="mt-2 max-w-xl text-sm text-white/85">
                  For recruiter onboarding, platform walkthroughs, partnerships,
                  and hiring discussions.
                </p>
              </div>

              <div className="p-7">
                {/* FORM */}
                <form className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                        Full name
                      </label>
                      <input
                        type="text"
                        placeholder="Your name"
                        className="w-full rounded-xl border border-border-primary bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                        Work email
                      </label>
                      <input
                        type="email"
                        placeholder="you@company.com"
                        className="w-full rounded-xl border border-border-primary bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        placeholder="Company name"
                        className="w-full rounded-xl border border-border-primary bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                        Topic
                      </label>
                      <select
                        className="w-full rounded-xl border border-border-primary bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select a topic
                        </option>
                        <option>Recruiter onboarding</option>
                        <option>Partnership</option>
                        <option>Platform demo</option>
                        <option>General inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="How can we help?"
                      className="w-full rounded-xl border border-border-primary bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                      Message
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Tell us about your hiring needs, partnership request, or question..."
                      className="w-full rounded-xl border border-border-primary bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10 resize-none"
                    />
                  </div>

                  <div className="rounded-2xl border border-success/20 bg-success-muted/35 p-5">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          Built for serious, sector-specific hiring
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                          DevTalent is designed for organizations and consulting firms
                          that need relevant experts for development projects — not
                          generic mass-market recruitment.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button variant="brand" size="xl" type="button">
                      Send message
                      <ArrowRight className="h-4 w-4" />
                    </Button>

                    <Button variant="secondary" size="xl" asChild>
                      <a href="mailto:contact@devtalent.tech">
                        Email our team directly
                      </a>
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              <div className="rounded-[30px] border border-border bg-white p-7 shadow-elevation-3">
                <h3 className="text-2xl font-bold tracking-tight text-text-primary">
                  Why contact DevTalent?
                </h3>

                <div className="mt-6 space-y-4">
                  {BENEFITS.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-border bg-surface px-4 py-4"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                      <p className="text-sm font-medium leading-relaxed text-text-primary">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-border bg-white p-7 shadow-elevation-3">
                <h3 className="text-xl font-bold tracking-tight text-text-primary">
                  Contact details
                </h3>

                <div className="mt-5 space-y-5">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 text-brand" />
                    <div>
                      <p className="text-sm font-semibold text-text-primary">Email</p>
                      <p className="mt-1 text-sm text-text-secondary">
                        contact@devtalent.tech
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe className="mt-0.5 h-5 w-5 text-brand" />
                    <div>
                      <p className="text-sm font-semibold text-text-primary">Region</p>
                      <p className="mt-1 text-sm text-text-secondary">
                        International development · EU · Africa · MENA
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Briefcase className="mt-0.5 h-5 w-5 text-brand" />
                    <div>
                      <p className="text-sm font-semibold text-text-primary">Use cases</p>
                      <p className="mt-1 text-sm text-text-secondary">
                        Recruiter onboarding, partnerships, and hiring discussions
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-border pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                    Response context
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    Best for organizations looking to hire relevant experts for
                    donor-funded projects and consulting missions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}