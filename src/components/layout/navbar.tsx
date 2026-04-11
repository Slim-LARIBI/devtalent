"use client";
import type { Route } from "next";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "For Experts", href: "/experts" },
  { label: "For Recruiters", href: "/recruiters" },
  { label: "How it works", href: "/#how-it-works" },
];

export function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-elevation-1"
            : "bg-transparent"
        )}
      >
        <div className="landing-container">
          <div className="flex h-16 items-center justify-between">

            {/* ─── Logo ─── */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              aria-label="DevTalent home"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand shadow-brand-glow group-hover:shadow-brand-glow-lg transition-shadow duration-300">
                <Globe className="h-4 w-4 text-white" />
              </div>
              <span className="text-[17px] font-bold tracking-tight text-text-primary">
                Dev<span className="text-brand">Talent</span>
              </span>
            </Link>

            {/* ─── Desktop nav ─── */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href as Route}
                  className={cn(
                    "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
                    pathname === link.href
                      ? "text-text-primary bg-surface-raised"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-raised"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ─── Desktop CTAs ─── */}
            <div className="hidden md:flex items-center gap-2.5">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button variant="brand" size="sm" asChild>
                <Link href="/register">Get started</Link>
              </Button>
            </div>

            {/* ─── Mobile menu button ─── */}
            <button
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-surface-raised transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile menu ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-x-0 top-16 z-40 border-b border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="landing-container py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href as Route}
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 pb-1 flex flex-col gap-2">
                <Button variant="outline" className="w-full justify-center" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button variant="brand" className="w-full justify-center" asChild>
                  <Link href="/register">Get started</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to push content below fixed navbar */}
      <div className="h-16" />
    </>
  );
}
