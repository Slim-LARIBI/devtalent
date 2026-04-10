"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, Search, Send, BarChart3, Building2, Megaphone, Users, CheckCircle } from "lucide-react";

const EXPERT_STEPS = [
  {
    step: "01",
    icon: UserCircle,
    title: "Create your expert profile",
    description: "List your expertise, sector experience, donor exposure (EU, WB, UN...), languages, and upload your CV. Your profile becomes your universal application.",
    detail: "Takes less than 15 minutes. No need to upload a CV every time you apply.",
  },
  {
    step: "02",
    icon: Search,
    title: "Browse and filter missions",
    description: "Search missions by sector, country, donor, experience level, or work mode. Every listing is from vetted organizations.",
    detail: "Filter by EU-funded, World Bank, UNDP, AfDB, GIZ, and 40+ other donors.",
  },
  {
    step: "03",
    icon: Send,
    title: "Apply in one click",
    description: "Click apply and your complete profile — including CV, expertise, donor experience — is instantly sent to the recruiter.",
    detail: "No cover letter required unless you want to add one.",
  },
  {
    step: "04",
    icon: BarChart3,
    title: "Track your applications",
    description: "Follow the status of every application in real time. See when recruiters review your profile, shortlist, or hire you.",
    detail: "Receive email notifications on every status change.",
  },
];

const RECRUITER_STEPS = [
  {
    step: "01",
    icon: Building2,
    title: "Set up your organization",
    description: "Create your organization profile — add your type (NGO, consulting firm, donor agency), country, website, and a description.",
    detail: "Verified organizations get a trust badge visible to all experts.",
  },
  {
    step: "02",
    icon: Megaphone,
    title: "Publish a mission",
    description: "Create a detailed mission post with sector, country, donor, required expertise, duration, and seniority level.",
    detail: "Draft and save before publishing. Edit anytime until closed.",
  },
  {
    step: "03",
    icon: Users,
    title: "Receive qualified applications",
    description: "Every application includes the expert's full profile, CV, donor experience, and a cover note. You get an email the moment someone applies.",
    detail: "Applications come pre-filtered by your mission's requirements.",
  },
  {
    step: "04",
    icon: CheckCircle,
    title: "Manage and hire",
    description: "Move candidates through your pipeline: Reviewed, Shortlisted, Hired. Add private recruiter notes at each stage.",
    detail: "The expert is notified automatically when their status changes.",
  },
];

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"expert" | "recruiter">("expert");
  const steps = activeTab === "expert" ? EXPERT_STEPS : RECRUITER_STEPS;

  return (
    <section className="section" id="how-it-works">
      <div className="landing-container">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-label-xs font-semibold uppercase tracking-widest text-brand block mb-4">
            How it works
          </span>
          <h2 className="text-display-md font-bold text-text-primary mb-4 tracking-tight">
            Simple. Fast. Built for professionals.
          </h2>
          <p className="text-body-md text-text-secondary max-w-xl mx-auto">
            DevTalent is designed around the real workflow of international development recruitment — not generic job boards.
          </p>
        </motion.div>

        {/* Tab toggle */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface-raised p-1">
            {(["expert", "recruiter"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-brand text-white shadow-brand-glow"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab === "expert" ? "I am an Expert" : "I am Hiring"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  className="relative rounded-2xl border border-border bg-surface p-6 shadow-elevation-1 hover:shadow-elevation-2 hover:border-border-strong transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 -right-3 w-6 h-px bg-gradient-to-r from-border to-transparent z-10" />
                  )}

                  {/* Step number */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/20 bg-brand-muted/40 [&_svg]:size-5">
                      <Icon className="text-brand-light" />
                    </div>
                    <span className="text-2xl font-bold text-text-disabled tabular-nums">{step.step}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-text-primary mb-2 leading-tight">{step.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed mb-3">{step.description}</p>
                  <p className="text-[11px] text-text-muted italic">{step.detail}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
