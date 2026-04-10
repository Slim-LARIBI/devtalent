"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Globe, Briefcase, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const DONOR_LOGOS = ["EU", "World Bank", "UNDP", "GIZ", "AfDB", "USAID", "UNICEF", "FAO"];

const FLOATING_CARDS = [
  {
    type: "mission",
    title: "Senior M&E Expert",
    org: "EuroDev Consulting",
    tag: "EU-funded · Morocco",
    tagColor: "text-brand-light",
    icon: Briefcase,
    delay: 0,
    position: "top-12 right-6 lg:-right-6",
  },
  {
    type: "expert",
    name: "Dr. Sarah Kimani",
    title: "WASH Specialist · 12 yrs",
    badges: ["Kenya", "Ethiopia", "World Bank"],
    score: 94,
    delay: 0.15,
    position: "bottom-16 left-0 lg:-left-8",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden hero-gradient">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border-strong)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border-strong)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-brand/8 blur-3xl" />
      <div className="pointer-events-none absolute top-60 right-0 h-[300px] w-[400px] rounded-full bg-accent/5 blur-3xl" />

      <div className="landing-container relative">
        <div className="grid lg:grid-cols-2 gap-16 py-24 lg:py-32 items-center">

          {/* ─── Left: Copy ─── */}
          <div className="flex flex-col items-start">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-muted/40 px-4 py-1.5 text-xs font-semibold text-brand-light mb-8">
                <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
                The expert recruitment platform for international development
              </span>
            </motion.div>

            {/* Headline */}
                <motion.h1
                  className="text-display-lg lg:text-display-xl font-bold text-text-primary leading-[1.08] tracking-tight mb-6"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.08 }}
                >
                  Hire top{" "}
                  <span className="relative">
                    <span className="gradient-text">development experts</span>
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-brand/60 via-brand to-transparent"
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                    />
                  </span>{" "}
                  for EU, World Bank & UN-funded projects
                </motion.h1>

            {/* Sub copy */}
            <motion.p
              className="text-body-lg text-text-secondary max-w-[520px] leading-relaxed mb-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
            >
              Access a curated network of verified experts working on EU, World Bank, and UN-funded programmes.
              Find the right mission — or hire the right expert — without the noise of generic job platforms.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-12"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
            >
              <Button variant="brand" size="xl" asChild>
                <Link href="/register?role=EXPERT">
                  Browse missions
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="secondary" size="xl" asChild>
                <Link href="/register?role=RECRUITER">
                  <Briefcase className="h-4 w-4" />
                  Hire top experts
                </Link>
              </Button>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {[
              "500+ verified experts in international development",
              "200+ active missions across 60+ countries",
              "Projects funded by EU, World Bank, UN, AfDB & more",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-text-secondary">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ─── Right: Visual ─── */}
          <motion.div
            className="relative hidden lg:flex items-center justify-center min-h-[480px]"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Central globe icon */}
            <div className="relative flex items-center justify-center h-48 w-48 rounded-full border border-brand/20 bg-brand-muted/20 shadow-brand-glow-lg">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand shadow-brand-glow-lg">
                <Globe className="h-12 w-12 text-white" />
              </div>
              {/* Orbit rings */}
              <div className="absolute inset-0 rounded-full border border-brand/10 animate-pulse-slow" />
              <div className="absolute -inset-8 rounded-full border border-brand/5" />
              <div className="absolute -inset-16 rounded-full border border-brand/[0.03]" />
            </div>

            {/* Floating mission card */}
            <motion.div
              className="absolute top-8 right-0 w-64 rounded-xl border border-border bg-surface p-4 shadow-elevation-3"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-muted/60">
                  <Briefcase className="h-4 w-4 text-brand-light" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-primary leading-tight">Senior M&E Expert</p>
                  <p className="text-[10px] text-text-muted">EuroDev Consulting</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-brand/20 bg-brand-muted/30 text-brand-light">EU-funded</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-surface-raised text-text-muted">Morocco</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-surface-raised text-text-muted">Long-term</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-text-muted">Deadline: 30 days</span>
                <span className="text-[10px] font-semibold text-success">Open</span>
              </div>
            </motion.div>

            {/* Floating expert card */}
            <motion.div
              className="absolute bottom-12 left-0 w-56 rounded-xl border border-border bg-surface p-4 shadow-elevation-3"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                  SK
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-primary leading-tight">Dr. Sarah Kimani</p>
                  <p className="text-[10px] text-text-muted">WASH Specialist · 12 yrs</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="h-2.5 w-2.5 fill-accent text-accent" />
                ))}
                <span className="text-[10px] text-text-muted ml-1">Expert</span>
              </div>
              <div className="mt-2 flex gap-1 flex-wrap">
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-surface-overlay text-text-muted">Kenya</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-surface-overlay text-text-muted">World Bank</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-success-muted text-success">Available</span>
              </div>
            </motion.div>

            {/* New application notification */}
            <motion.div
              className="absolute top-1/2 right-4 w-52 -translate-y-1/2 rounded-lg border border-success/20 bg-success-muted/30 p-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <p className="text-xs font-medium text-success">New application received</p>
              </div>
              <p className="text-[10px] text-text-muted mt-1">Karim Mansour · Senior Expert</p>
            </motion.div>
          </motion.div>
        </div>

        {/* ─── Donor logos strip ─── */}
        <motion.div
          className="pb-16 border-t border-border/30 pt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-text-disabled mb-6">
            Trusted by professionals working on projects funded by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {DONOR_LOGOS.map((donor) => (
              <span
                key={donor}
                className="text-sm font-semibold text-text-disabled/70 hover:text-text-muted transition-colors"
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
