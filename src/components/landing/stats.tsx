"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";
import { Users, Briefcase, Globe2, Building2 } from "lucide-react";

const STATS = [
  { value: 500,  suffix: "+", label: "Verified Experts",     icon: Users,     description: "Active in the platform" },
  { value: 200,  suffix: "+", label: "Open Missions",        icon: Briefcase, description: "Across all sectors" },
  { value: 60,   suffix: "+", label: "Countries Covered",    icon: Globe2,    description: "Global reach" },
  { value: 40,   suffix: "+", label: "Donor Organizations",  icon: Building2, description: "EU, WB, UN & more" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { damping: 60, stiffness: 200 });

  useEffect(() => {
    if (inView) motionVal.set(target);
  }, [inView, motionVal, target]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
    });
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export function Stats() {
  return (
    <section className="py-16 border-y border-border bg-surface/30">
      <div className="landing-container">
        <div className="grid grid-cols-2 gap-px lg:grid-cols-4 overflow-hidden rounded-2xl border border-border bg-border">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center gap-1 bg-surface px-6 py-10 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-muted/50 [&_svg]:size-5">
                  <Icon className="text-brand-light" />
                </div>
                <p className="text-4xl font-bold tracking-tight text-text-primary tabular-nums">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm font-semibold text-text-primary mt-0.5">{stat.label}</p>
                <p className="text-xs text-text-muted">{stat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
