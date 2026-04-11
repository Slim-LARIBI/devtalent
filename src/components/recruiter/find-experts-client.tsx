"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  Globe2,
  Briefcase,
  CheckCircle2,
  Mail,
  MapPin,
  SlidersHorizontal,
  Sparkles,
  Eye,
} from "lucide-react";
import { inviteExpertsAction } from "@/app/(recruiter)/recruiter/experts/actions";

export type RecruiterExpertItem = {
  id: string;
  slug: string | null;
  name: string;
  email: string;
  title: string;
  location: string;
  level: string;
  availability: string;
  profileScore: number;
  reasons?: string[];
  yearsOfExperience: number | null;
  isPublic: boolean;
  languages: string[];
  expertise: string[];
  donorExperience: string[];
};

type FindExpertsClientProps = {
  experts: RecruiterExpertItem[];
  missionId?: string;
  missionTitle?: string | null;
  missionOrganizationName?: string | null;
};

const LEVELS = ["ALL", "JUNIOR", "MID", "SENIOR", "PRINCIPAL", "DIRECTOR"] as const;
const DONORS = ["ALL", "EU", "World Bank", "UNICEF", "USAID", "GIZ", "AfDB", "UNDP"] as const;

function formatLevel(level: string) {
  return level
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getScoreClasses(score: number) {
  if (score >= 90) return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  if (score >= 75) return "border-brand/20 bg-brand/10 text-brand";
  return "border-amber-500/20 bg-amber-500/10 text-amber-300";
}

export function FindExpertsClient({
  experts,
  missionId,
  missionTitle,
  missionOrganizationName,
}: FindExpertsClientProps) {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("ALL");
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [donor, setDonor] = useState<(typeof DONORS)[number]>("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredExperts = useMemo(() => {
    return experts.filter((expert) => {
      const q = search.trim().toLowerCase();

      const matchesSearch =
        q === "" ||
        expert.name.toLowerCase().includes(q) ||
        expert.title.toLowerCase().includes(q) ||
        expert.location.toLowerCase().includes(q) ||
        expert.expertise.some((item) => item.toLowerCase().includes(q)) ||
        expert.languages.some((item) => item.toLowerCase().includes(q)) ||
        expert.donorExperience.some((item) => item.toLowerCase().includes(q));

      const matchesLevel = level === "ALL" || expert.level === level;

      const matchesAvailability = !availabilityOnly
        ? true
        : expert.availability.toLowerCase().includes("immediately") ||
          expert.availability.toLowerCase().includes("available");

      const matchesDonor = donor === "ALL" || expert.donorExperience.includes(donor);

      return matchesSearch && matchesLevel && matchesAvailability && matchesDonor;
    });
  }, [experts, search, level, availabilityOnly, donor]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function toggleSelectAllVisible() {
    const visibleIds = filteredExperts.map((expert) => expert.id);
    const allVisibleSelected =
      visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  }

  function handleInviteSelected() {
    setInviteMessage("");
    setInviteError("");

    if (!missionId) {
      setInviteError(
        "Mission context is missing. Please open Find Experts from a mission detail page."
      );
      return;
    }

    if (selectedIds.length === 0) {
      setInviteError("Select at least one expert first.");
      return;
    }

    startTransition(async () => {
      const result = await inviteExpertsAction({
        expertIds: selectedIds,
        missionId,
      });

      if (!result.ok) {
        setInviteError(result.error || "Unable to send invitations.");
        return;
      }

      setInviteMessage(result.message || `${result.sentCount} invitation email(s) sent successfully.`);
      setSelectedIds([]);
    });
  }

  const allVisibleSelected =
    filteredExperts.length > 0 &&
    filteredExperts.every((expert) => selectedIds.includes(expert.id));

  const topMatches = filteredExperts.filter((expert) => expert.profileScore >= 85).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-sm text-text-muted">Recruiter / Find Experts</p>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
            Find Experts
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary">
            Search your expert database, surface strong matches, and invite the best profiles in one click.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-secondary">
          <span className="font-medium text-text-primary">{filteredExperts.length}</span> expert(s) found
        </div>
      </div>

      {missionId ? (
        <div className="rounded-2xl border border-brand/20 bg-brand/10 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white/10 p-2 text-brand">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-brand">
                You are sourcing for a specific mission
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                {missionTitle || "Mission selected"}
                {missionOrganizationName ? ` · ${missionOrganizationName}` : ""}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Invitations sent from this page will be linked to that mission.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
          No mission selected. Open this page from a mission detail screen to send mission-linked invitations.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">Total experts</p>
            <div className="rounded-lg bg-brand/10 p-2 text-brand">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold text-text-primary">{experts.length}</p>
          <p className="mt-1 text-sm text-text-muted">Live public expert profiles</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">Visible results</p>
            <div className="rounded-lg bg-brand/10 p-2 text-brand">
              <Search className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold text-text-primary">{filteredExperts.length}</p>
          <p className="mt-1 text-sm text-text-muted">Based on current filters</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">Selected</p>
            <div className="rounded-lg bg-violet-500/10 p-2 text-violet-300">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold text-text-primary">{selectedIds.length}</p>
          <p className="mt-1 text-sm text-text-muted">Ready for outreach</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">High match</p>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-300">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold text-text-primary">{topMatches}</p>
          <p className="mt-1 text-sm text-text-muted">Profiles above 85%</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
          <SlidersHorizontal className="h-4 w-4" />
          Search & filters
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-4">
          <div className="xl:col-span-1">
            <label className="mb-2 block text-sm text-text-secondary">Search</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, title, skill, location, donor..."
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-text-secondary">Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as (typeof LEVELS)[number])}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand"
            >
              {LEVELS.map((item) => (
                <option key={item} value={item}>
                  {item === "ALL" ? "All levels" : formatLevel(item)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-text-secondary">Donor experience</label>
            <select
              value={donor}
              onChange={(e) => setDonor(e.target.value as (typeof DONORS)[number])}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand"
            >
              {DONORS.map((item) => (
                <option key={item} value={item}>
                  {item === "ALL" ? "All donors" : item}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex w-full items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary">
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => setAvailabilityOnly(e.target.checked)}
                className="h-4 w-4 rounded border-border bg-background"
              />
              Available / active only
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggleSelectAllVisible}
              className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-raised"
            >
              {allVisibleSelected ? "Unselect visible" : "Select visible"}
            </button>

            <span className="text-sm text-text-secondary">
              {selectedIds.length} selected
            </span>
          </div>

          <button
            type="button"
            onClick={handleInviteSelected}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-brand-glow transition hover:opacity-95 disabled:opacity-60"
          >
            <Mail className="h-4 w-4" />
            {isPending ? "Sending..." : "Invite experts"}
          </button>
        </div>

        {inviteError ? (
          <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {inviteError}
          </div>
        ) : null}

        {inviteMessage ? (
          <div className="mt-4 rounded-xl border border-brand/20 bg-brand/10 px-4 py-3 text-sm text-brand">
            {inviteMessage}
          </div>
        ) : null}
      </div>

      {filteredExperts.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-text-primary">
            No experts found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
            Try a broader search or remove one of your filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredExperts.map((expert) => {
            const selected = selectedIds.includes(expert.id);

            return (
              <div
                key={expert.id}
                className={`rounded-2xl border bg-surface p-5 transition ${
                  selected
                    ? "border-brand/50 shadow-brand-glow"
                    : "border-border hover:border-border-strong"
                }`}
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleSelect(expert.id)}
                        className="h-4 w-4 rounded border-border bg-background"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-text-primary">
                          {expert.name}
                        </h2>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${getScoreClasses(
                            expert.profileScore
                          )}`}
                        >
                          {expert.profileScore}% match
                        </span>

                        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-text-secondary">
                          {formatLevel(expert.level)}
                        </span>
                      </div>

                      {expert.reasons && expert.reasons.length > 0 ? (
                        <ul className="mt-3 space-y-1 text-xs text-text-secondary">
                          {expert.reasons.slice(0, 3).map((reason, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      <p className="mt-2 text-sm text-text-secondary">{expert.title}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary">
                          <MapPin className="h-3.5 w-3.5" />
                          {expert.location}
                        </span>

                        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary">
                          {expert.availability}
                        </span>

                        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary">
                          {expert.yearsOfExperience
                            ? `${expert.yearsOfExperience} yrs exp.`
                            : "Experience n/a"}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div>
                          <p className="mb-2 text-xs uppercase tracking-wide text-text-muted">
                            Expertise
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {expert.expertise.map((item) => (
                              <span
                                key={item}
                                className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs text-brand"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-xs uppercase tracking-wide text-text-muted">
                            Languages
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {expert.languages.map((item) => (
                              <span
                                key={item}
                                className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-xs uppercase tracking-wide text-text-muted">
                            Donor experience
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {expert.donorExperience.map((item) => (
                              <span
                                key={item}
                                className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-300"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-3 xl:items-end">
                    <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-secondary">
                      <p className="text-xs uppercase tracking-wide text-text-muted">Contact</p>
                      <p className="mt-1 font-medium text-text-primary">{expert.email}</p>
                    </div>

                    <Link
                      href={expert.slug ? `/experts/${expert.slug}` : "#"}
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-raised"
                    >
                      <Eye className="h-4 w-4" />
                      View profile
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}