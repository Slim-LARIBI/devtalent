"use client";
import type { Route } from "next";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Search, FileText, User, Settings,
  Briefcase, Users, Building2, Globe, ChevronLeft, ChevronRight,
  BarChart3, Bell, LogOut, Shield, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

// ─── Nav item config ──────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const EXPERT_NAV: NavItem[] = [
  { label: "Dashboard",     href: "/expert/dashboard",    icon: LayoutDashboard },
  { label: "Browse Missions", href: "/missions", icon: Search },
  { label: "My Applications", href: "/expert/applications", icon: FileText },
  { label: "My Profile",    href: "/expert/my-profile",   icon: User },
];

const RECRUITER_NAV: NavItem[] = [
  { label: "Dashboard",      href: "/recruiter/dashboard",   icon: LayoutDashboard },
  { label: "My Missions",    href: "/recruiter/missions",    icon: Briefcase },
  { label: "Applications",   href: "/recruiter/applications", icon: FileText },
  { label: "Find Experts",   href: "/recruiter/experts",     icon: Users },
  { label: "Organization",   href: "/recruiter/organization", icon: Building2 },
];

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard",   href: "/admin/dashboard",    icon: LayoutDashboard },
  { label: "Users",       href: "/admin/users",        icon: Users },
  { label: "Missions",    href: "/admin/missions",     icon: Briefcase },
  { label: "Applications",href: "/admin/applications", icon: FileText },
  { label: "Analytics",   href: "/admin/analytics",    icon: BarChart3 },
];

const BOTTOM_NAV: NavItem[] = [
  { label: "Settings", href: "settings", icon: Settings },
];

// ─── Props ────────────────────────────────────────────────────────────────────

export type SidebarRole = "EXPERT" | "RECRUITER" | "ADMIN";

interface SidebarProps {
  role: SidebarRole;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  collapsed?: boolean;
  onCollapseToggle?: () => void;
}

// ─── Single nav item ──────────────────────────────────────────────────────────

function NavLink({
  item,
  collapsed,
  active,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href as Route}
      className={cn(
        "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 group",
        active
          ? "bg-brand-muted/60 text-brand-light shadow-sm"
          : "text-text-secondary hover:text-text-primary hover:bg-surface-raised",
        collapsed && "justify-center px-2.5"
      )}
      title={collapsed ? item.label : undefined}
    >
      {/* Active indicator bar */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-brand" />
      )}
      <Icon
        className={cn(
          "shrink-0 transition-colors",
          active ? "text-brand" : "text-text-muted group-hover:text-text-secondary",
          collapsed ? "h-5 w-5" : "h-4.5 w-4.5"
        )}
      />
      {!collapsed && (
        <span className="truncate">{item.label}</span>
      )}
      {!collapsed && item.badge && item.badge > 0 && (
        <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white px-1.5">
          {item.badge > 99 ? "99+" : item.badge}
        </span>
      )}
    </Link>
  );
}

// ─── Sidebar component ────────────────────────────────────────────────────────

export function Sidebar({ role, user, collapsed = false, onCollapseToggle }: SidebarProps) {
  const pathname = usePathname();

  const navItems =
    role === "RECRUITER" ? RECRUITER_NAV :
    role === "ADMIN"     ? ADMIN_NAV     :
                           EXPERT_NAV;

  const roleLabel =
    role === "RECRUITER" ? "Recruiter" :
    role === "ADMIN"     ? "Admin"     :
                           "Expert";

  const basePath =
    role === "RECRUITER" ? "/recruiter" :
    role === "ADMIN"     ? "/admin"     :
                           "/expert";

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-border bg-surface transition-all duration-200 ease-out-expo",
        collapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* ─── Logo ─── */}
      <div className={cn("flex items-center h-16 px-4 border-b border-border shrink-0", collapsed && "justify-center px-2")}>
        {collapsed ? (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand">
            <Globe className="h-4 w-4 text-white" />
          </div>
        ) : (
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand">
              <Globe className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-[15px] font-bold text-text-primary">
              Dev<span className="text-brand">Talent</span>
            </span>
          </Link>
        )}
      </div>

      {/* ─── Nav items ─── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-0.5">
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-disabled">
            {roleLabel} menu
          </p>
        )}
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={collapsed}
            active={pathname === item.href || pathname.startsWith(item.href + "/")}
          />
        ))}

        <Separator className="my-3" />

        {/* Settings */}
        <NavLink
          item={{ label: "Settings", href: `${basePath}/settings`, icon: Settings }}
          collapsed={collapsed}
          active={pathname.startsWith(`${basePath}/settings`)}
        />
      </nav>

      {/* ─── User section ─── */}
      <div className={cn("border-t border-border p-3 shrink-0", collapsed && "px-2")}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-2.5 w-full rounded-lg p-2 text-left",
                "hover:bg-surface-raised transition-colors duration-150 group",
                collapsed && "justify-center"
              )}
            >
              <UserAvatar name={user.name} image={user.image} size="sm" className="shrink-0" />
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {user.name ?? "User"}
                  </p>
                  <p className="text-xs text-text-muted truncate">{user.email}</p>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align={collapsed ? "center" : "end"} className="w-52">
            <DropdownMenuLabel>
              <p className="font-medium text-text-primary">{user.name}</p>
              <p className="text-xs text-text-muted font-normal">{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={(role === "EXPERT" ? "/expert/my-profile" : `${basePath}/profile`) as Route}>
                <User className="h-4 w-4" />
                My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`${basePath}/settings` as Route}>
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              destructive
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ─── Collapse toggle ─── */}
      {onCollapseToggle && (
        <button
          onClick={onCollapseToggle}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface shadow-elevation-2 text-text-muted hover:text-text-primary transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      )}
    </aside>
  );
}

// ─── Mobile sidebar drawer ────────────────────────────────────────────────────

interface MobileSidebarProps extends SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose, ...props }: MobileSidebarProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 left-0 z-50 lg:hidden"
          >
            <Sidebar {...props} collapsed={false} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
