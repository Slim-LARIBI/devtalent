"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { submitApplicationAction } from "@/app/missions/[id]/apply/actions";

type ApplyFormProps = {
  missionId: string;
  missionTitle: string;
  organizationName: string;
  hasCv: boolean;
  cvName: string | null;
};

export function ApplyForm({
  missionId,
  missionTitle,
  organizationName,
  hasCv,
  cvName,
}: ApplyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [coverNote, setCoverNote] = useState("");
  const [availability, setAvailability] = useState("");
  const [expectedRate, setExpectedRate] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!hasCv) {
      setError("Please upload your CV before applying to this mission.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await submitApplicationAction({
        missionId,
        coverNote,
        availability,
        expectedRate,
      });

      if (!result.ok) {
        setError(result.error || "Unable to submit application.");
        return;
      }

      setSuccess("Application submitted successfully ✅");

      setTimeout(() => {
        router.push("/expert/applications");
        router.refresh();
      }, 900);
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-text-muted">Expert / Missions / Apply</p>
          <h1 className="text-3xl font-semibold text-text-primary">
            Apply to mission
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Submit your application for this consulting opportunity.
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Mission summary
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">
              Mission
            </p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {missionTitle}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">
              Organization
            </p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {organizationName}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">Required document</h2>

        {hasCv ? (
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
            CV ready: <span className="font-medium">{cvName || "CV uploaded"}</span>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
            You must upload your CV before applying to this mission.
            <div className="mt-3">
              <Link
                href="/expert/my-profile"
                className="inline-flex rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition hover:opacity-95"
              >
                Go to My Profile
              </Link>
            </div>
          </div>
        )}
      </section>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-surface p-6"
      >
        <h2 className="text-lg font-semibold text-text-primary">
          Your application
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Keep it short, clear, and relevant to the mission.
        </p>

        <div className="mt-6 space-y-6">
          <div>
            <label className="text-sm font-medium text-text-primary">
              Cover note
            </label>
            <textarea
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              rows={7}
              placeholder="Example: I am a senior M&E expert with experience in donor-funded programmes across Africa, including governance and results framework assignments. I believe my background aligns strongly with this mission because..."
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand"
            />
            <p className="mt-2 text-xs text-text-muted">
              Tip: explain why your profile matches this mission in 4–6 lines.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary">
              Availability
            </label>
            <input
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="Example: Available immediately for short-term assignments"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary">
              Expected daily rate (optional)
            </label>
            <input
              type="number"
              value={expectedRate}
              onChange={(e) => setExpectedRate(e.target.value)}
              placeholder="Example: 450"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand"
            />
            <p className="mt-2 text-xs text-text-muted">
              Add only the numeric value. Currency can be discussed later if needed.
            </p>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            {success}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-text-primary transition hover:bg-surface-raised"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={isPending || !hasCv}
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-95 disabled:opacity-60"
          >
            {isPending ? "Submitting..." : "Submit application"}
          </button>
        </div>
      </form>
    </div>
  );
}