import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, isValid } from "date-fns";

// ─── Tailwind utility ─────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── Slug generation ──────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function generateMissionSlug(title: string, id: string): string {
  const base = slugify(title).slice(0, 60);
  const suffix = id.slice(-6);
  return `${base}-${suffix}`;
}

export function generateExpertSlug(name: string, id: string): string {
  const base = slugify(name).slice(0, 60);
  const suffix = id.slice(-6);
  return `${base}-${suffix}`;
}

// ─── Date formatting ──────────────────────────────────────────────────────────

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = new Date(date);
  if (!isValid(d)) return "—";
  return format(d, "MMM d, yyyy");
}

export function formatDateRelative(
  date: Date | string | null | undefined
): string {
  if (!date) return "—";
  const d = new Date(date);
  if (!isValid(d)) return "—";
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatDeadline(date: Date | null | undefined): string {
  if (!date) return "Open";
  const d = new Date(date);
  const now = new Date();
  if (d < now) return "Expired";
  const daysLeft = Math.ceil(
    (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysLeft <= 7) return `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;
  return format(d, "MMM d, yyyy");
}

// ─── Number formatting ────────────────────────────────────────────────────────

export function formatCurrency(
  amount: number | null | undefined,
  currency = "EUR"
): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatBudgetRange(
  min: number | null | undefined,
  max: number | null | undefined,
  currency = "EUR"
): string {
  if (!min && !max) return "Negotiable";
  if (min && !max) return `From ${formatCurrency(min, currency)}`;
  if (!min && max) return `Up to ${formatCurrency(max, currency)}`;
  return `${formatCurrency(min, currency)} – ${formatCurrency(max, currency)}`;
}

export function formatDailyRate(
  min: number | null | undefined,
  max: number | null | undefined,
  currency = "EUR"
): string {
  if (!min && !max) return "Rate on request";
  if (min && !max) return `From ${formatCurrency(min, currency)}/day`;
  if (!min && max) return `Up to ${formatCurrency(max, currency)}/day`;
  return `${formatCurrency(min, currency)} – ${formatCurrency(max, currency)}/day`;
}

// ─── String utilities ─────────────────────────────────────────────────────────

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length).trim()}…`;
}

export function initials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ─── URL utilities ────────────────────────────────────────────────────────────

export function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function absoluteUrl(path: string): string {
  return `${getBaseUrl()}${path}`;
}

// ─── Array utilities ──────────────────────────────────────────────────────────

export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

export function groupBy<T, K extends string | number | symbol>(
  arr: T[],
  key: (item: T) => K
): Record<K, T[]> {
  return arr.reduce(
    (acc, item) => {
      const groupKey = key(item);
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey]!.push(item);
      return acc;
    },
    {} as Record<K, T[]>
  );
}

// ─── Validation utilities ─────────────────────────────────────────────────────

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ─── Profile score calculator ─────────────────────────────────────────────────

interface ProfileScoreInput {
  title?: string | null;
  bio?: string | null;
  level?: string | null;
  yearsOfExperience?: number | null;
  linkedinUrl?: string | null;
  expertiseCount: number;
  languageCount: number;
  sectorCount: number;
  regionCount: number;
  donorCount: number;
  documentCount: number;
}

export function calculateProfileScore(data: ProfileScoreInput): number {
  let score = 0;

  // Basic info (30 points)
  if (data.title) score += 10;
  if (data.bio && data.bio.length > 100) score += 10;
  if (data.level) score += 5;
  if (data.yearsOfExperience) score += 5;

  // Skills & experience (40 points)
  if (data.expertiseCount >= 3) score += 10;
  else if (data.expertiseCount > 0) score += 5;

  if (data.sectorCount >= 2) score += 10;
  else if (data.sectorCount > 0) score += 5;

  if (data.regionCount >= 2) score += 10;
  else if (data.regionCount > 0) score += 5;

  if (data.donorCount >= 2) score += 10;
  else if (data.donorCount > 0) score += 5;

  // Languages (15 points)
  if (data.languageCount >= 3) score += 15;
  else if (data.languageCount === 2) score += 10;
  else if (data.languageCount === 1) score += 5;

  // Documents & links (15 points)
  if (data.documentCount > 0) score += 10;
  if (data.linkedinUrl) score += 5;

  return Math.min(score, 100);
}
