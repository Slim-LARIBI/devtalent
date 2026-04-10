"use client";

import React from "react";
import Link from "next/link";
import { Menu, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title?: string;
  description?: string;
  user: {
    name?: string | null;
    image?: string | null;
  };
  onMobileMenuOpen?: () => void;
  action?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function DashboardHeader({
  title,
  description,
  user,
  onMobileMenuOpen,
  action,
  breadcrumbs,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-md px-4 lg:px-6">

      {/* Mobile menu toggle */}
      <button
        className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:bg-surface-raised transition-colors"
        onClick={onMobileMenuOpen}
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Breadcrumbs / Title */}
      <div className="flex-1 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <span className="text-text-disabled">/</span>
                )}
                {crumb.href && i < breadcrumbs.length - 1 ? (
                  <Link
                    href={crumb.href}
                    className="text-text-muted hover:text-text-secondary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={cn(
                    i === breadcrumbs.length - 1
                      ? "font-medium text-text-primary"
                      : "text-text-muted"
                  )}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        ) : title ? (
          <h1 className="text-base font-semibold text-text-primary truncate">{title}</h1>
        ) : null}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 shrink-0">
        {action}

        {/* Notification bell */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-surface-raised hover:text-text-secondary transition-colors">
          <Bell className="h-4 w-4" />
          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
        </button>

        {/* User avatar */}
        <UserAvatar name={user.name} image={user.image} size="sm" />
      </div>
    </header>
  );
}
