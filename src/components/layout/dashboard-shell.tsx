"use client";

import React, { useState } from "react";
import { Sidebar, MobileSidebar, type SidebarRole } from "./sidebar";
import { DashboardHeader } from "./dashboard-header";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
  role: SidebarRole;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  headerProps?: {
    title?: string;
    description?: string;
    action?: React.ReactNode;
    breadcrumbs?: Array<{ label: string; href?: string }>;
  };
  className?: string;
}

export function DashboardShell({
  children,
  role,
  user,
  headerProps,
  className,
}: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ─── Desktop Sidebar (fixed) ─── */}
      <div className="hidden lg:flex relative shrink-0">
        <Sidebar
          role={role}
          user={user}
          collapsed={sidebarCollapsed}
          onCollapseToggle={() => setSidebarCollapsed((v) => !v)}
        />
      </div>

      {/* ─── Mobile Sidebar (drawer) ─── */}
      <MobileSidebar
        role={role}
        user={user}
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* ─── Main content area ─── */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">

        {/* Header */}
        <DashboardHeader
          {...headerProps}
          user={user}
          onMobileMenuOpen={() => setMobileSidebarOpen(true)}
        />

        {/* Page content */}
        <main
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden",
            "px-4 py-6 lg:px-8 lg:py-8",
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

// ─── Page section wrapper ─────────────────────────────────────────────────────

export function PageSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-6", className)}>
      {children}
    </section>
  );
}
