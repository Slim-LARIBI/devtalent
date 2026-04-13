"use client";

import { motion } from "framer-motion";
import {
  Users,
  Globe2,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const proofStats = [
  {
    value: "500+",
    label: "Verified experts",
    description: "Profiles with relevant development sector experience.",
    icon: Users,
    tone: "blue",
  },
  {
    value: "60+",
    label: "Countries covered",
    description: "Experts with experience across Africa, MENA, and beyond.",
    icon: Globe2,
    tone: "green",
  },
  {
    value: "200+",
    label: "Active missions",
    description: "Opportunities across consulting firms and organizations.",
    icon: Briefcase,
    tone: "orange",
  },
  {
    value: "48h",
    label: "Average shortlist speed",
    description: "Faster identification of relevant experts for open missions.",
    icon: TrendingUp,
    tone: "purple",
  },
];

const proofBullets = [
  "Built for consulting firms, donors, and implementing partners",
  "Structured expert profiles instead of noisy generic job listings",
  "Clearer matching for development-focused hiring decisions",
];

function toneClasses(tone: string) {
  switch (tone) {
    case "blue":
      return {
        iconWrap: "bg-brand/10 text-brand",
        value: "text-brand",
        card: "from-brand/5 to-transparent",
      };
    case "green":
      return {
        iconWrap: "bg-success-muted text-success",
        value: "text-success",
        card: "from-success/5 to-transparent",
      };
    case "orange":
      return {
        iconWrap: "bg-accent/10 text-accent",
        value: "text-accent",
        card: "from-accent/5 to-transparent",
      };
    case "purple":
      return {
        iconWrap: "bg-violet-500/10 text-violet-600",
        value: "text-violet-600",
        card: "from-violet-500/5 to-transparent",
      };
    default:
      return {
        iconWrap: "bg-brand/10 text-brand",
        value: "text-brand",
        card: "from-brand/5 to-transparent",
      };
  }
}

export function Proof() {
  return (
    <section className="py-24 lg:py-28">
      <div className="landing-container">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success-muted/40 px-4 py-1.5 text-xs font-semibold text-success">
            <Sparkles className="h-3.5 w-3.5" />
            Trusted by development professionals
          </span>

          <h2 className="mt-5 text-display-sm font-bold tracking-tight text-text-primary lg:text-display-md">
            Built to move faster from mission to shortlist
          </h2>

          <p className="mt-4 text-body-lg text-text-secondary">
            DevTalent combines a focused expert network, clearer hiring workflows,
            and development-specific relevance to help teams hire with more speed
            and confidence.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* LEFT BIG PANEL */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="rounded-[32px] border border-border bg-white p-8 shadow-elevation-4"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {proofStats.map((item, index) => {
                const Icon = item.icon;
                const tone = toneClasses(item.tone);

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    className={`rounded-[24px] border border-border bg-gradient-to-b ${tone.card} p-6`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone.iconWrap}`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="text-right">
                        <p className={`text-4xl font-bold tracking-tight ${tone.value}`}>
                          {item.value}
                        </p>
                      </div>
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-text-primary">
                      {item.label}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT SUPPORT PANEL */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="rounded-[32px] border border-border bg-gradient-to-b from-surface to-white p-8 shadow-elevation-3"
          >
            <div className="rounded-2xl border border-brand/15 bg-brand-muted/20 px-4 py-3 text-sm font-medium text-brand-light">
              Why this matters
            </div>

            <h3 className="mt-6 text-2xl font-bold tracking-tight text-text-primary">
              Better signal, less noise
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              In development hiring, speed alone is not enough. Teams need relevant
              experts, donor familiarity, regional context, and a workflow that
              makes shortlisting easier.
            </p>

            <div className="mt-8 space-y-4">
              {proofBullets.map((bullet, index) => (
                <motion.div
                  key={bullet}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.4, delay: 0.12 + index * 0.08 }}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-white px-4 py-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <p className="text-sm font-medium leading-relaxed text-text-primary">
                    {bullet}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-success/20 bg-success-muted/35 px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-success">
                Positioning
              </p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-text-primary">
                DevTalent is not trying to be everything for everyone. It is built
                to win in one category: development-focused expert hiring.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}