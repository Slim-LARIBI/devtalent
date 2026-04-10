"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Filter, BellRing, Clock, Star, MapPin,
  CheckCircle2, Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const EXPERT_BENEFITS = [
  {
    icon: Filter,
    title: "Filter by donor, sector & country",
    description: "Stop scrolling through irrelevant listings. Find EU, World Bank, UN, and GIZ projects that match your exact profile.",
  },
  {
    icon: BellRing,
    title: "Get notified on new matches",
    description: "Set up your preferences once. Receive alerts when a mission that fits your expertise is published.",
  },
  {
    icon: Clock,
    title: "Apply in under 60 seconds",
    description: "Your profile is your application. One click sends your CV, expertise, and donor experience to the recruiter.",
  },
  {
    icon: Star,
    title: "Track every application",
    description: "See exactly where each application stands — from submitted to shortlisted to hired — in a clean dashboard.",
  },
];

const MISSION_PREVIEW = {
  title: "Senior Governance Reform Expert",
  org: "International Advisory Group",
  tags: ["EU-funded", "Tunisia", "Long-term", "Hybrid"],
  deadline: "22 days left",
  sector: "Governance",
  seniority: "Senior",
  duration: "18 months",
};

export function ForExperts() {
  return (
    <section className="section" id="for-experts">
      <div className="landing-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ─── Left: Visual ─── */}
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            {/* Background glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-radial from-brand/8 to-transparent blur-2xl" />

            {/* Main card */}
            <div className="relative rounded-2xl border border-border bg-surface p-6 shadow-elevation-3">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-brand-muted/60 flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-brand-light" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary leading-tight">{MISSION_PREVIEW.title}</p>
                    <p className="text-xs text-text-muted">{MISSION_PREVIEW.org}</p>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-warning bg-warning-muted px-2 py-0.5 rounded-full border border-warning/20">
                  {MISSION_PREVIEW.deadline}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {MISSION_PREVIEW.tags.map((tag) => (
                  <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-surface-raised text-text-secondary">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Sector", value: MISSION_PREVIEW.sector },
                  { label: "Level", value: MISSION_PREVIEW.seniority },
                  { label: "Duration", value: MISSION_PREVIEW.duration },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-surface-raised p-3">
                    <p className="text-[10px] text-text-muted mb-1">{label}</p>
                    <p className="text-xs font-semibold text-text-primary">{value}</p>
                  </div>
                ))}
              </div>
              <button className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition-colors shadow-brand-glow">
                Apply with Profile
              </button>
            </div>

            {/* Application tracker card below */}
            <motion.div
              className="mt-3 rounded-xl border border-border bg-surface p-4 shadow-elevation-2"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xs font-semibold text-text-secondary mb-3">Your recent applications</p>
              <div className="space-y-2">
                {[
                  { title: "Senior M&E Expert — Morocco", status: "Shortlisted", color: "text-brand-light bg-brand-muted/50 border-brand/20" },
                  { title: "WASH Engineer — Somalia",      status: "Reviewed",   color: "text-warning bg-warning-muted border-warning/20" },
                  { title: "PFM Advisor — Senegal",        status: "New",        color: "text-info bg-info-muted border-info/20" },
                ].map(({ title, status, color }) => (
                  <div key={title} className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary truncate flex-1 mr-2">{title}</span>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${color}`}>
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ─── Right: Copy ─── */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-label-xs font-semibold uppercase tracking-widest text-brand mb-4 block">
              For Experts
            </span>
            <h2 className="text-display-md font-bold text-text-primary leading-tight tracking-tight mb-5">
              Find the missions that{" "}
              <span className="gradient-text">match your expertise</span>
            </h2>
            <p className="text-body-md text-text-secondary leading-relaxed mb-8">
              Stop wasting hours on irrelevant job boards. DevTalent understands international development.
              It matches you to the right missions based on your actual profile — not just keywords.
            </p>

            <div className="space-y-5 mb-10">
              {EXPERT_BENEFITS.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    className="flex gap-4"
                    initial={{ opacity: 0, x: 16 }}
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
              <Link href="/register?role=EXPERT">
                Create your expert profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
