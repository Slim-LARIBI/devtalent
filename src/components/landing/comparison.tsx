"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";

const comparisonCards = [
  {
    title: "Generic job platforms",
    subtitle: "Broad reach, low relevance for development hiring",
    tone: "default",
    points: [
      { label: "Broad candidate pool", positive: false },
      { label: "Mixed expert quality", positive: false },
      { label: "Weak donor-project relevance", positive: false },
      { label: "Manual filtering still required", positive: false },
      { label: "Limited sector specialization", positive: false },
    ],
    footerTitle: "Best for",
    footerText: "High-volume hiring, not niche expert recruitment.",
  },
  {
    title: "DevelopmentAid-style platforms",
    subtitle: "Strong sector access, heavier hiring workflow",
    tone: "middle",
    points: [
      { label: "Strong development ecosystem relevance", positive: true },
      { label: "Recognized by sector firms", positive: true },
      { label: "Good access to experts and tenders", positive: true },
      { label: "Heavier sourcing workflow", positive: false },
      { label: "Slower recruiter execution", positive: false },
    ],
    footerTitle: "Best for",
    footerText: "Sector visibility and network access.",
  },
  {
    title: "DevTalent",
    subtitle: "Built for faster development-focused hiring execution",
    tone: "highlight",
    points: [
      { label: "Curated expert profiles", positive: true },
      { label: "High donor-project relevance", positive: true },
      { label: "Faster shortlist workflow", positive: true },
      { label: "Cleaner recruiter experience", positive: true },
      { label: "Multi-firm mission visibility", positive: true },
    ],
    footerTitle: "Best for",
    footerText: "Fast, focused hiring for consulting firms and organizations.",
  },
];

export function Comparison() {
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
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-muted/30 px-4 py-1.5 text-xs font-semibold text-brand-light">
            <Sparkles className="h-3.5 w-3.5" />
            Why DevTalent
          </span>

          <h2 className="mt-5 text-display-sm font-bold tracking-tight text-text-primary lg:text-display-md">
            More focused than generic platforms. Faster than legacy sector tools.
          </h2>

          <p className="mt-4 text-body-lg text-text-secondary">
            DevTalent is designed for firms and organizations hiring experts for
            international development missions — with a workflow built for speed,
            relevance, and execution.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {comparisonCards.map((card, index) => {
            const isHighlight = card.tone === "highlight";
            const isMiddle = card.tone === "middle";

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className={[
                  "relative rounded-[28px] border p-7 shadow-elevation-3 transition-all",
                  isHighlight
                    ? "border-brand/20 bg-gradient-to-b from-brand-muted/25 to-white shadow-brand-glow"
                    : isMiddle
                    ? "border-border bg-surface-raised/70"
                    : "border-border bg-white",
                ].join(" ")}
              >
                {isHighlight && (
                  <div className="mb-5 inline-flex rounded-full bg-brand px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    Best fit
                  </div>
                )}

                <h3 className="text-2xl font-bold tracking-tight text-text-primary">
                  {card.title}
                </h3>

                <p className="mt-2 text-sm text-text-secondary">
                  {card.subtitle}
                </p>

                <div className="mt-8 space-y-4">
                  {card.points.map((point) => (
                    <div
                      key={point.label}
                      className={[
                        "flex items-start gap-3 rounded-2xl border px-4 py-4",
                        isHighlight
                          ? "border-brand/10 bg-white/85"
                          : "border-border bg-surface/60",
                      ].join(" ")}
                    >
                      {point.positive ? (
                        <CheckCircle2
                          className={`mt-0.5 h-5 w-5 shrink-0 ${
                            isHighlight ? "text-success" : "text-brand-light"
                          }`}
                        />
                      ) : (
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                      )}

                      <span
                        className={
                          point.positive
                            ? "text-sm font-medium text-text-primary"
                            : "text-sm text-text-secondary"
                        }
                      >
                        {point.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className={[
                    "mt-8 rounded-2xl border px-4 py-4",
                    isHighlight
                      ? "border-success/20 bg-success-muted/40"
                      : "border-border bg-surface/50",
                  ].join(" ")}
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-[0.12em] ${
                      isHighlight ? "text-success" : "text-text-tertiary"
                    }`}
                  >
                    {card.footerTitle}
                  </p>
                  <p className="mt-2 text-sm font-medium text-text-primary">
                    {card.footerText}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}