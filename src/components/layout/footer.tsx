import Link from "next/link";
import type { Route } from "next";
import { Globe, Twitter, Linkedin, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS = {
  Platform: [
    { label: "Browse Missions", href: "/missions" },
    { label: "Find Experts", href: "/experts" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/pricing" },
  ],
  "For Experts": [
    { label: "Create Profile", href: "/register?role=EXPERT" },
    { label: "Browse Missions", href: "/missions" },
    { label: "Application Tracker", href: "/expert/applications" },
    { label: "Career Resources", href: "/resources" },
  ],
  "For Recruiters": [
    { label: "Post a Mission", href: "/register?role=RECRUITER" },
    { label: "Search Experts", href: "/experts" },
    { label: "Manage Applications", href: "/recruiter/dashboard" },
    { label: "Organization Profile", href: "/recruiter/organization" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="landing-container py-16">
        {/* Top section */}
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6 mb-12">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand shadow-brand-glow">
                <Globe className="h-4 w-4 text-white" />
              </div>
              <span className="text-[17px] font-bold tracking-tight text-text-primary">
                Dev<span className="text-brand">Talent</span>
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-[260px]">
              The premium recruitment platform for international development experts and organizations.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-border-strong hover:text-text-secondary"
              >
                <Twitter className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-border-strong hover:text-text-secondary"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
              <a
                href="mailto:hello@devtalent.io"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-border-strong hover:text-text-secondary"
              >
                <Mail className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-label-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href as Route}
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator />

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} DevTalent. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <span>Built for the</span>
            <span className="font-medium text-text-secondary">international development</span>
            <span>community.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
