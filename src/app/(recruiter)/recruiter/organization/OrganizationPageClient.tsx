"use client";

import { useState, useTransition } from "react";
import {
  Building2,
  Globe,
  MapPin,
  ShieldCheck,
  Users,
  UserPlus,
  Copy,
} from "lucide-react";
import { updateOrganizationAction } from "./actions";
import { createInvitationAction } from "./invite-actions";

const TYPES = [
  "NGO",
  "CONSULTING_FIRM",
  "DONOR_AGENCY",
  "INTERNATIONAL_ORGANIZATION",
  "GOVERNMENT",
];

function formatTypeLabel(type: string) {
  return type.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatRoleLabel(role: string) {
  return role.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function OrganizationPageClient({
  organization,
  currentRecruiterRole,
}: {
  organization: {
    name: string;
    type: string;
    country: string | null;
    logoUrl?: string | null;
    recruiters: {
      id: string;
      organizationRole: string;
      user: {
        name: string | null;
        email: string;
      };
      jobTitle: string | null;
      createdAt: Date;
    }[];
  };
  currentRecruiterRole: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [invitePending, startInviteTransition] = useTransition();

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");
  const [inviteError, setInviteError] = useState("");

  const canEdit = currentRecruiterRole === "OWNER";

  const [form, setForm] = useState({
    name: organization.name || "",
    type: organization.type || "",
    country: organization.country || "",
    logoUrl: organization.logoUrl || "",
  });

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!canEdit) {
      setError("Only organization owners can update company settings.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");

    startTransition(async () => {
      const res = await updateOrganizationAction(form);

      if (!res.ok) {
        setError(res.error || "Error");
        return;
      }

      setSuccess("Organization updated successfully ✅");
    });
  }

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();

    if (!canEdit) {
      setInviteError("Only organization owners can invite recruiters.");
      setInviteSuccess("");
      setInviteLink("");
      return;
    }

    setInviteError("");
    setInviteSuccess("");
    setInviteLink("");

    startInviteTransition(async () => {
      const res = await createInvitationAction(inviteEmail);

      if (!res.ok) {
        setInviteError(res.error || "Unable to create invitation.");
        return;
      }

      setInviteSuccess("Invitation link generated successfully ✅");
      setInviteLink(res.inviteLink ?? "");
      setInviteEmail("");
    });
  }

  async function copyInviteLink() {
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);
      setInviteSuccess("Invitation link copied ✅");
    } catch {
      setInviteError("Unable to copy invitation link.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-text-muted">Recruiter / Organization</p>
          <h1 className="text-3xl font-semibold text-text-primary">
            Organization settings
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Manage your company profile, visual identity, team access, and recruiter invitations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              currentRecruiterRole === "OWNER"
                ? "border-brand/20 bg-brand/10 text-brand"
                : "border-border bg-background text-text-secondary"
            }`}
          >
            {formatRoleLabel(currentRecruiterRole)}
          </span>
        </div>
      </div>

      {!canEdit ? (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          You are a member of this organization. You can view company settings, but only the owner can edit them.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-surface p-8 shadow-sm"
        >
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-text-primary">
                Organization name
              </label>
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                disabled={!canEdit}
                placeholder="Global Impact Consulting"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-text-primary">
                Organization type
              </label>
              <select
                value={form.type}
                onChange={(e) => updateField("type", e.target.value)}
                disabled={!canEdit}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand disabled:cursor-not-allowed disabled:opacity-60"
              >
                {TYPES.map((type) => (
                  <option key={type} value={type}>
                    {formatTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-text-primary">
                Country
              </label>
              <input
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                disabled={!canEdit}
                placeholder="Belgium"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-text-primary">
                Logo URL
              </label>
              <input
                value={form.logoUrl}
                onChange={(e) => updateField("logoUrl", e.target.value)}
                disabled={!canEdit}
                placeholder="https://yourdomain.com/logo.png"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand disabled:cursor-not-allowed disabled:opacity-60"
              />
              <p className="mt-2 text-xs text-text-muted">
                Step 1 = paste image URL. Step 2 = real file upload.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-sm">
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-emerald-500">{success}</p>}
              </div>

              <button
                type="submit"
                disabled={isPending || !canEdit}
                className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-brand-glow transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Saving..." : canEdit ? "Save changes" : "Owner only"}
              </button>
            </div>
          </div>
        </form>

        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Brand preview</p>
              <h2 className="mt-1 text-lg font-semibold text-text-primary">
                Recruiter-facing identity
              </h2>
            </div>

            <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
              Live preview
            </span>
          </div>

          <div className="mt-6 rounded-3xl border border-border bg-background p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                {form.logoUrl ? (
                  <img
                    src={form.logoUrl}
                    alt={form.name || "Organization logo"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-text-muted">
                    {form.name?.charAt(0)?.toUpperCase() || "O"}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold text-text-primary">
                    {form.name || "Organization name"}
                  </h3>

                  <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
                    {form.type ? formatTypeLabel(form.type) : "Organization type"}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary">
                    <Building2 className="h-3.5 w-3.5" />
                    Recruiter profile
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary">
                    <MapPin className="h-3.5 w-3.5" />
                    {form.country || "Country"}
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary">
                    <Globe className="h-3.5 w-3.5" />
                    Brand visible to experts
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-border bg-surface p-4">
                  <p className="text-sm font-medium text-text-primary">
                    Preview note
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    This is how your organization identity appears across recruiter workflows and future expert-facing touchpoints.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">
                Brand name
              </p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {form.name || "Not set"}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">
                Display country
              </p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {form.country || "Not set"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {canEdit ? (
        <section className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-brand" />
                <h2 className="text-lg font-semibold text-text-primary">Invite recruiter</h2>
              </div>
              <p className="mt-1 text-sm text-text-secondary">
                Generate a secure invitation link for a new recruiter to join this organization.
              </p>
            </div>

            <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary">
              Owner only
            </span>
          </div>

          <form onSubmit={handleInvite} className="mt-6 space-y-4">
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@company.com"
                className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand"
              />

              <button
                type="submit"
                disabled={invitePending || !inviteEmail}
                className="rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white shadow-brand-glow transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {invitePending ? "Generating..." : "Generate invite"}
              </button>
            </div>

            {inviteError ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {inviteError}
              </div>
            ) : null}

            {inviteSuccess ? (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                {inviteSuccess}
              </div>
            ) : null}

            {inviteLink ? (
              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="text-sm font-medium text-text-primary">Invitation link</p>
                <p className="mt-2 break-all text-sm text-text-secondary">{inviteLink}</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={copyInviteLink}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-raised"
                  >
                    <Copy className="h-4 w-4" />
                    Copy link
                  </button>
                </div>
              </div>
            ) : null}
          </form>
        </section>
      ) : null}

      <section className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand" />
              <h2 className="text-lg font-semibold text-text-primary">Team members</h2>
            </div>
            <p className="mt-1 text-sm text-text-secondary">
              Current recruiters linked to this organization.
            </p>
          </div>

          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary">
            {organization.recruiters.length} member(s)
          </span>
        </div>

        <div className="mt-6 grid gap-4">
          {organization.recruiters.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl border border-border bg-background p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {member.user.name || "Unnamed recruiter"}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {member.user.email}
                  </p>
                  <p className="mt-2 text-xs text-text-muted">
                    {member.jobTitle || "No job title"} · Joined{" "}
                    {new Date(member.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    member.organizationRole === "OWNER"
                      ? "border-brand/20 bg-brand/10 text-brand"
                      : "border-border bg-surface text-text-secondary"
                  }`}
                >
                  {formatRoleLabel(member.organizationRole)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
