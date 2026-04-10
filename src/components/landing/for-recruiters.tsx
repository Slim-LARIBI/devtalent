"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Search, FileCheck, Mail, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const RECRUITER_BENEFITS = [
  {
    icon: Search,
    title: "Search a vetted talent pool",
    description: "Every expert has verified sector experience, donor exposure, and language skills — all searchable and filterable.",
  },
  {
    icon: Mail,
    title: "Instant application notifications",
    description: "As soon as an expert applies, you receive a detailed email with their profile, CV, and donor experience.",
  },
  {
    icon: FileCheck,
    title: "Manage the full pipeline",
    description: "Move candidates from New to Shortlisted to Hired with one click. Keep recruiter notes private.",
  },
  {
    icon: BarChart3,
    title: "Analytics on every mission",
    description: "See how many experts viewed, applied, and were shortlisted for each posted mission in real time.",
  },
];

const CANDIDATE_CARDS = [
  { name: "Amara Diallo",   title: "Governance Advisor",    level: "Senior",  score: 96, donors: ["EU", "UNDP"],         available: true },
  { name: "Marie Chen",     title: "M&E Specialist",        level: "Mid",     score: 88, donors: ["World Bank", "GIZ"],  available: true },
  { name: "Yusuf Al-Rashid",title: "PFM Expert",            level: "Principal",score: 92, donors: ["EU", "AfDB"],        available: false },
];

export function ForRecruiters() {
  return (
    <section className="section bg-background-subtle border-y border-border" id="for-recruiters">
      <div className="landing-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ─── Left: Copy ─── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-label-xs font-semibold uppercase tracking-widest text-brand mb-4 block">
              For Recruiters
            </span>
            <h2 className="text-display-md font-bold text-text-primary leading-tight tracking-tight mb-5">
              Hire qualified experts{" "}
              <span className="gradient-text">faster than ever</span>
            </h2>
            <p className="text-body-md text-text-secondary leading-relaxed mb-8">
              Stop sifting through unqualified CVs. Access a curated network of senior and junior consultants
              with verifiable field experience, ready for deployment to your next mission.
            </p>

            <div className="space-y-5 mb-10">
              {RECRUITER_BENEFITS.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    className="flex gap-4"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand-muted/30 [&_svg]:size-4">
                      <Icon className="text-brand-light" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary mb-1">{benefit.title}</p>
                      <p className="text-sm text-text-secondary leading-relaxed">{benefit.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Button variant="brand" size="lg" asChild>
              <Link href="/register?role=RECRUITER">
                Post your first mission
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* ─── Right: Visual ─── */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            {/* Search bar mock */}
            <div className="mb-3 rounded-xl border border-border bg-surface p-4 shadow-elevation-2">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-raised px-4 py-2.5">
                <Search className="h-4 w-4 text-text-muted shrink-0" />
                <span className="text-sm text-text-muted">Senior M&E expert · EU experience · Africa</span>
                <span className="ml-auto text-[11px] font-semibold text-brand">12 matches</span>
              </div>
            </div>

            {/* Candidate cards */}
            <div className="space-y-2.5">
              {CANDIDATE_CARDS.map((card, i) => (
                <motion.div
                  key={card.name}
                  className="rounded-xl border border-border bg-surface p-4 shadow-elevation-1 hover:shadow-elevation-2 hover:border-border-strong transition-all cursor-pointer"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand/60 to-accent/40 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {card.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-text-primary truncate">{card.name}</p>
                        <span
                          className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                            card.available
                              ? "bg-success-muted border-success/20 text-success"
                              : "bg-surface-overlay border-border text-text-muted"
                          }`}
                        >
                          {card.available ? "Available" : "Not available"}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted truncate">{card.title} · {card.level}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-bold text-text-primary">{card.score}%</div>
                      <div className="text-[10px] text-text-muted">match</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-1.5 flex-wrap">
                    {card.donors.map((d) => (
                      <span key={d} className="text-[10px] px-2 py-0.5 rounded-full border border-brand/20 bg-brand-muted/30 text-brand-light">
                        {d}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
