"use client";

import { motion } from "framer-motion";
import {
  Filter, Globe2, FileUp, Bell, Shield, Zap,
  BarChart3, Languages, Building2, Clock,
} from "lucide-react";

const FEATURES = [
  {
    icon: Filter,
    title: "Multi-layer smart filtering",
    description: "Filter missions by donor, sector, region, seniority, work mode, and language simultaneously.",
    tag: "Search",
  },
  {
    icon: Globe2,
    title: "Global coverage",
    description: "Missions across 60+ countries in Africa, MENA, Asia, the Balkans, and Latin America.",
    tag: "Reach",
  },
  {
    icon: Languages,
    title: "Multilingual support",
    description: "Experts and missions can list proficiency in English, French, Arabic, Spanish, Portuguese and more.",
    tag: "Language",
  },
  {
    icon: FileUp,
    title: "Secure document management",
    description: "Upload your CV and supporting documents once. They are automatically attached to every application.",
    tag: "Documents",
  },
  {
    icon: Bell,
    title: "Real-time email notifications",
    description: "Recruiters are notified instantly when an expert applies. Experts are updated on every status change.",
    tag: "Notifications",
  },
  {
    icon: Building2,
    title: "Verified organizations",
    description: "Recruiters from NGOs, consulting firms, and international organizations receive verified badges.",
    tag: "Trust",
  },
  {
    icon: BarChart3,
    title: "Recruitment analytics",
    description: "Recruiters see views, applications, and conversion rates for every posted mission.",
    tag: "Analytics",
  },
  {
    icon: Clock,
    title: "Deadline tracking",
    description: "Missions show countdown timers. Experts see at a glance which opportunities are closing soon.",
    tag: "Timeline",
  },
  {
    icon: Shield,
    title: "Role-based access control",
    description: "Separate, secure dashboards for experts, recruiters, and platform administrators.",
    tag: "Security",
  },
  {
    icon: Zap,
    title: "One-click application",
    description: "Your complete profile is your CV. Apply to any mission in under 60 seconds with a single click.",
    tag: "Speed",
  },
];

export function Features() {
  return (
    <section className="section bg-background-subtle border-y border-border">
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
            Platform features
          </span>
          <h2 className="text-display-md font-bold text-text-primary mb-4 tracking-tight">
            Everything you need.{" "}
            <span className="gradient-text">Nothing you don't.</span>
          </h2>
          <p className="text-body-md text-text-secondary max-w-xl mx-auto">
            Built specifically for the international development recruitment workflow — not adapted from a generic template.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="group rounded-2xl border border-border bg-surface p-5 shadow-elevation-1 hover:shadow-elevation-3 hover:border-border-strong transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 5) * 0.06 }}
                whileHover={{ y: -2 }}
              >
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-brand/20 bg-brand-muted/30 [&_svg]:size-4.5 group-hover:border-brand/40 group-hover:bg-brand-muted/50 transition-all">
                  <Icon className="text-brand-light" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2 block">
                  {feature.tag}
                </span>
                <h3 className="text-sm font-semibold text-text-primary leading-tight mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
