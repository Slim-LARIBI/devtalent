"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Briefcase, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-brand/8 blur-3xl" />

      <div className="landing-container relative">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-muted/40 px-4 py-1.5 text-xs font-semibold text-brand-light mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
            Join 500+ development professionals
          </span>

          <h2 className="text-display-lg font-bold text-text-primary tracking-tight mb-5">
            Ready to transform{" "}
            <span className="gradient-text">development recruitment?</span>
          </h2>
          <p className="text-body-lg text-text-secondary mb-10 max-w-xl mx-auto leading-relaxed">
            Whether you are a seasoned expert looking for your next mission or an organization
            building a project team — DevTalent is built for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="brand" size="2xl" asChild>
                <Link href="/register?role=EXPERT">
                  <UserCircle className="h-5 w-5" />
                  I am an Expert
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="secondary" size="2xl" asChild>
                <Link href="/register?role=RECRUITER">
                  <Briefcase className="h-5 w-5" />
                  I am Hiring
                </Link>
              </Button>
            </motion.div>
          </div>

          <p className="mt-6 text-xs text-text-muted">
            Free to join. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
