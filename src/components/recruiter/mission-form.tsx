"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  MapPin,
  Globe,
  CalendarDays,
  GraduationCap,
  FileText,
  Save,
  Send,
} from "lucide-react";

type WorkMode = "REMOTE" | "ON_SITE" | "HYBRID";
type MissionType = "SHORT_TERM" | "LONG_TERM";
type ContractType = "CONSULTANT" | "EMPLOYEE" | "FREELANCE" | "FIXED_TERM";
type ExpertLevel = "JUNIOR" | "MID" | "SENIOR" | "PRINCIPAL" | "DIRECTOR";

const LANGUAGES = ["English", "French", "Arabic", "Spanish", "Portuguese"];
const DONORS = ["EU", "World Bank", "UNDP", "GIZ", "AfDB", "USAID", "UNICEF"];
const SECTORS = [
  "Governance",
  "Education",
  "Health",
  "Agriculture",
  "Climate",
  "WASH",
  "M&E",
  "Procurement",
  "Finance",
];

export type MissionFormValues = {
  id?: string;
  title: string;
  shortDescription: string;
  description: string;
  sector: string;
  donorFunder: string;
  country: string;
  cityRegion: string;
  workMode: WorkMode;
  missionType: MissionType;
  contractType: ContractType;
  seniorityRequired: ExpertLevel;
  yearsOfExperience: string;
  duration: string;
  startDate: string;
  deadline: string;
  budgetMin: string;
  budgetMax: string;
  budgetCurrency: string;
  requiredExpertise: string;
  requiredLanguages: string[];
  donorExperienceRequired: string;
  cvRequired: boolean;
  coverLetterRequired: boolean;
  publishNow: boolean;
};

type MissionFormProps = {
  mode: "create" | "edit";
  initialValues: MissionFormValues;
  onSubmitAction: (values: MissionFormValues) => Promise<{ ok: boolean; error?: string }>;
};

export function MissionForm({ mode, initialValues, onSubmitAction }: MissionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<MissionFormValues>(initialValues);

  function updateField<K extends keyof MissionFormValues>(
    key: K,
    value: MissionFormValues[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleLanguage(language: string) {
    setForm((prev) => {
      const exists = prev.requiredLanguages.includes(language);
      return {
        ...prev,
        requiredLanguages: exists
          ? prev.requiredLanguages.filter((l) => l !== language)
          : [...prev.requiredLanguages, language],
      };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await onSubmitAction(form);

      if (!result.ok) {
        setError(result.error || "Something went wrong.");
        return;
      }

      setSuccess(mode === "create" ? "Mission created successfully." : "Mission updated successfully.");

      if (mode === "create") {
        router.push("/recruiter/dashboard");
      } else if (form.id) {
        router.push(`/recruiter/missions/${form.id}`);
      }

      router.refresh();
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border/60 bg-background/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-text-muted">Recruiter / Missions</p>
              <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
                {mode === "create" ? "Create a new mission" : "Edit mission"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-text-secondary">
                {mode === "create"
                  ? "Publish a premium mission brief with clear project scope, candidate requirements, and funding details."
                  : "Update your mission details, candidate requirements, and project information."}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => updateField("publishNow", false)}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-raised"
              >
                <Save className="h-4 w-4" />
                Save draft
              </button>

              <button
                type="submit"
                form="mission-form"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white shadow-brand-glow transition hover:opacity-95"
              >
                <Send className="h-4 w-4" />
                {isPending
                  ? mode === "create"
                    ? "Publishing..."
                    : "Updating..."
                  : mode === "create"
                  ? "Publish mission"
                  : "Update mission"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <form
        id="mission-form"
        onSubmit={handleSubmit}
        className="mx-auto grid max-w-7xl gap-6 px-6 py-8 xl:grid-cols-[1.4fr_0.6fr]"
      >
        <div className="space-y-6">
          {error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              {success}
            </div>
          ) : null}

          <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-brand/10 p-2 text-brand">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Mission overview</h2>
                <p className="text-sm text-text-secondary">
                  Define the role, the project context, and the core mission summary.
                </p>
              </div>
            </div>

            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">Job title</label>
                <input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-text-muted focus:border-brand"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Short description
                </label>
                <input
                  value={form.shortDescription}
                  onChange={(e) => updateField("shortDescription", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-text-muted focus:border-brand"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Full description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={7}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-text-muted focus:border-brand"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-brand/10 p-2 text-brand">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Scope & location</h2>
                <p className="text-sm text-text-secondary">
                  Clarify where the mission takes place and how the work is structured.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">Country</label>
                <input
                  value={form.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  City / region
                </label>
                <input
                  value={form.cityRegion}
                  onChange={(e) => updateField("cityRegion", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">Work mode</label>
                <select
                  value={form.workMode}
                  onChange={(e) => updateField("workMode", e.target.value as WorkMode)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
                >
                  <option value="REMOTE">Remote</option>
                  <option value="ON_SITE">On-site</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Mission type
                </label>
                <select
                  value={form.missionType}
                  onChange={(e) => updateField("missionType", e.target.value as MissionType)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
                >
                  <option value="SHORT_TERM">Short-term</option>
                  <option value="LONG_TERM">Long-term</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Contract type
                </label>
                <select
                  value={form.contractType}
                  onChange={(e) => updateField("contractType", e.target.value as ContractType)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
                >
                  <option value="CONSULTANT">Consultant</option>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="FREELANCE">Freelance</option>
                  <option value="FIXED_TERM">Fixed-term</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">Duration</label>
                <input
                  value={form.duration}
                  onChange={(e) => updateField("duration", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-brand/10 p-2 text-brand">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Candidate requirements</h2>
                <p className="text-sm text-text-secondary">
                  Define the ideal profile, expertise, languages, and donor exposure required.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">Seniority</label>
                <select
                  value={form.seniorityRequired}
                  onChange={(e) => updateField("seniorityRequired", e.target.value as ExpertLevel)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
                >
                  <option value="JUNIOR">Junior</option>
                  <option value="MID">Mid</option>
                  <option value="SENIOR">Senior</option>
                  <option value="PRINCIPAL">Principal</option>
                  <option value="DIRECTOR">Director</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Years of experience
                </label>
                <input
                  value={form.yearsOfExperience}
                  onChange={(e) => updateField("yearsOfExperience", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Required expertise
                </label>
                <textarea
                  value={form.requiredExpertise}
                  onChange={(e) => updateField("requiredExpertise", e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-3 block text-sm font-medium text-text-primary">
                  Required languages
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((language) => {
                    const active = form.requiredLanguages.includes(language);
                    return (
                      <button
                        key={language}
                        type="button"
                        onClick={() => toggleLanguage(language)}
                        className={`rounded-full border px-3 py-2 text-sm transition ${
                          active
                            ? "border-brand bg-brand/10 text-brand"
                            : "border-border bg-background text-text-secondary hover:border-brand/50"
                        }`}
                      >
                        {language}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Donor experience required
                </label>
                <input
                  value={form.donorExperienceRequired}
                  onChange={(e) => updateField("donorExperienceRequired", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-brand/10 p-2 text-brand">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Project details</h2>
                <p className="text-sm text-text-secondary">
                  Add donor, sector, timeline, and budget details for better candidate matching.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">Sector</label>
                <select
                  value={form.sector}
                  onChange={(e) => updateField("sector", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
                >
                  <option value="">Select a sector</option>
                  {SECTORS.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Donor / funder
                </label>
                <select
                  value={form.donorFunder}
                  onChange={(e) => updateField("donorFunder", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
                >
                  <option value="">Select donor</option>
                  {DONORS.map((donor) => (
                    <option key={donor} value={donor}>
                      {donor}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">Start date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => updateField("startDate", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Application deadline
                </label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => updateField("deadline", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Budget minimum
                </label>
                <input
                  value={form.budgetMin}
                  onChange={(e) => updateField("budgetMin", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Budget maximum
                </label>
                <input
                  value={form.budgetMax}
                  onChange={(e) => updateField("budgetMax", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-brand/10 p-2 text-brand">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Publish settings</h2>
                <p className="text-sm text-text-secondary">
                  Configure how candidates apply and how the mission is published.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                <input
                  type="checkbox"
                  checked={form.cvRequired}
                  onChange={(e) => updateField("cvRequired", e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">CV required</p>
                  <p className="text-sm text-text-secondary">
                    Experts must submit a CV to apply.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                <input
                  type="checkbox"
                  checked={form.coverLetterRequired}
                  onChange={(e) => updateField("coverLetterRequired", e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">Cover letter required</p>
                  <p className="text-sm text-text-secondary">
                    Ask candidates for a brief motivation note.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                <input
                  type="checkbox"
                  checked={form.publishNow}
                  onChange={(e) => updateField("publishNow", e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">Publish immediately</p>
                  <p className="text-sm text-text-secondary">
                    If disabled, the mission will be saved as draft.
                  </p>
                </div>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-brand/10 p-2 text-brand">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Mission preview</h2>
                <p className="text-sm text-text-secondary">
                  Quick summary of how your listing will look.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-5">
              <p className="text-lg font-semibold text-text-primary">
                {form.title || "Mission title"}
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                {form.shortDescription || "Short mission description will appear here."}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {form.donorFunder && (
                  <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs text-brand">
                    {form.donorFunder}
                  </span>
                )}
                {form.country && (
                  <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary">
                    {form.country}
                  </span>
                )}
                {form.missionType && (
                  <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary">
                    {form.missionType === "SHORT_TERM" ? "Short-term" : "Long-term"}
                  </span>
                )}
                {form.workMode && (
                  <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary">
                    {form.workMode === "ON_SITE"
                      ? "On-site"
                      : form.workMode === "REMOTE"
                      ? "Remote"
                      : "Hybrid"}
                  </span>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-text-primary">Notes</h2>
            <ul className="mt-4 space-y-3 text-sm text-text-secondary">
              <li>• Keep the title clear and donor-friendly.</li>
              <li>• Be specific about seniority and deliverables.</li>
              <li>• Mention language and donor requirements explicitly.</li>
              <li>• Use “Save draft” first if you want internal review.</li>
            </ul>
          </section>
        </div>
      </form>
    </div>
  );
}