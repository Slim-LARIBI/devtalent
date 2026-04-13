"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Globe,
  Sparkles,
  Users,
  Clock3,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TRUST_ITEMS = [
  "500+ verified experts in international development",
  "EU, World Bank, UN & AfDB project experience",
  "Faster shortlisting with structured expert profiles",
];

const DONOR_LOGOS = ["EU", "World Bank", "UNDP", "GIZ", "AfDB", "USAID", "UNICEF", "FAO"];

export function Hero() {
  return (
    <section className="relative overflow-hidden hero-gradient">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border-strong)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border-strong)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[780px] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute top-32 right-0 h-[280px] w-[360px] rounded-full bg-accent/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[240px] w-[320px] rounded-full bg-success/5 blur-3xl" />

      <div className="landing-container relative">
        <div className="grid items-center gap-16 pt-10 pb-20 lg:grid-cols-2 lg:gap-12 lg:pt-14 lg:pb-24">
          {/* LEFT */}
          <div className="flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-muted/40 px-4 py-1.5 text-xs font-semibold text-brand-light">
                <Sparkles className="h-3.5 w-3.5" />
                AI-powered recruitment for international development
              </span>
            </motion.div>

            <motion.h1
              className="max-w-[760px] text-display-lg font-bold leading-[1.03] tracking-tight text-text-primary lg:text-display-xl"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06 }}
            >
              Hire top{" "}
              <span className="gradient-text">development experts</span>{" "}
              faster for donor-funded projects
            </motion.h1>

            <motion.p
              className="mt-6 max-w-[580px] text-body-lg leading-relaxed text-text-secondary"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.14 }}
            >
              DevTalent helps consulting firms and development organizations find,
              review, and hire qualified experts for EU, World Bank, UN, AfDB and
              other international projects — without the noise of generic hiring platforms.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22 }}
            >
              <Button variant="brand" size="xl" asChild>
                <Link href="/register?role=RECRUITER">
                  Hire top experts
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button variant="secondary" size="xl" asChild>
                <Link href="/register?role=EXPERT">
                  Browse missions
                </Link>
              </Button>
            </motion.div>

            <motion.div
              className="mt-8 grid gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.3 }}
            >
              {TRUST_ITEMS.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-text-secondary"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.38 }}
            >
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-light" />
                Curated expert network
              </span>
              <span className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-brand-light" />
                Faster shortlisting
              </span>
              <span className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-brand-light" />
                Structured hiring workflow
              </span>
            </motion.div>
          </div>

          {/* RIGHT */}
          <motion.div
            className="relative hidden min-h-[560px] lg:block"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.18 }}
          >
            {/* Main dashboard card */}
            <div className="absolute inset-y-10 right-0 left-10 rounded-[28px] border border-border/80 bg-surface shadow-elevation-4 backdrop-blur">
              {/* Top bar */}
              <div className="flex items-center gap-2 border-b border-border/70 px-5 py-4">
                <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                <div className="ml-4 flex-1 rounded-full border border-border bg-surface-raised px-4 py-2 text-center text-xs text-text-muted">
                  app.devtalent.tech/dashboard
                </div>
              </div>

              <div className="p-5">
                {/* KPIs */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-border bg-surface-raised p-4">
                    <p className="text-[11px] font-medium text-text-muted">Matched experts</p>
                    <p className="mt-2 text-2xl font-bold text-text-primary">127</p>
                    <p className="mt-1 text-[11px] text-brand-light">for this mission</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-surface-raised p-4">
                    <p className="text-[11px] font-medium text-text-muted">Avg shortlist time</p>
                    <p className="mt-2 text-2xl font-bold text-text-primary">48h</p>
                    <p className="mt-1 text-[11px] text-brand-light">faster review cycle</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-surface-raised p-4">
                    <p className="text-[11px] font-medium text-text-muted">Top match score</p>
                    <p className="mt-2 text-2xl font-bold text-text-primary">94%</p>
                    <p className="mt-1 text-[11px] text-success">excellent fit</p>
                  </div>
                </div>

                {/* Mission + candidates */}
                <div className="mt-5 rounded-2xl border border-border bg-surface-raised p-4">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        Senior Monitoring & Evaluation Expert
                      </p>
                      <p className="mt-1 text-xs text-text-muted">
                        EU-funded programme • Morocco • Long-term
                      </p>
                    </div>
                    <span className="rounded-full bg-success-muted px-2.5 py-1 text-[11px] font-semibold text-success">
                      18 new candidates
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        initials: "SK",
                        name: "Dr. Sarah Kimani",
                        title: "WASH & M&E Specialist",
                        meta: "Kenya • World Bank • 12 years",
                        score: "94%",
                        tone: "text-success",
                      },
                      {
                        initials: "KM",
                        name: "Karim Mansour",
                        title: "Senior Evaluation Consultant",
                        meta: "Morocco • EU • 10 years",
                        score: "91%",
                        tone: "text-brand-light",
                      },
                      {
                        initials: "LD",
                        name: "Leila Haddad",
                        title: "Results Measurement Expert",
                        meta: "Tunisia • UN • 9 years",
                        score: "88%",
                        tone: "text-accent",
                      },
                    ].map((candidate) => (
                      <div
                        key={candidate.name}
                        className="flex items-center justify-between rounded-xl border border-border bg-surface p-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-accent text-xs font-bold text-white">
                            {candidate.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-text-primary">
                              {candidate.name}
                            </p>
                            <p className="truncate text-xs text-text-muted">
                              {candidate.title}
                            </p>
                            <p className="truncate text-[11px] text-text-disabled">
                              {candidate.meta}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`text-sm font-bold ${candidate.tone}`}>
                            {candidate.score}
                          </p>
                          <p className="text-[11px] text-text-muted">match score</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-text-muted">
                      <span className="h-2 w-2 rounded-full bg-success" />
                      AI shortlist ready
                    </div>

                    <button className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-95">
                      Review candidates
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating chips */}
            <motion.div
              className="absolute left-0 top-14 rounded-2xl border border-border bg-surface px-4 py-3 shadow-elevation-3"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-muted/50">
                  <Briefcase className="h-4 w-4 text-brand-light" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-primary">18 new applications</p>
                  <p className="text-[10px] text-text-muted">on active missions</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-10 left-4 rounded-2xl border border-border bg-surface px-4 py-3 shadow-elevation-3"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-muted/50">
                  <Globe className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-primary">60+ countries</p>
                  <p className="text-[10px] text-text-muted">international expert coverage</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust strip */}
        <motion.div
          className="border-t border-border/40 pb-14 pt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.5 }}
        >
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-text-disabled">
            Trusted by professionals working on projects funded by
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {DONOR_LOGOS.map((donor) => (
              <span
                key={donor}
                className="text-sm font-semibold text-text-disabled/70 transition-colors hover:text-text-muted"
              >
                {donor}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}