"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateApplicationStatusAction } from "@/app/(recruiter)/recruiter/applications/[id]/actions";

const STATUSES = [
  { value: "NEW", label: "New" },
  { value: "REVIEWED", label: "Reviewed" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "REJECTED", label: "Rejected" },
  { value: "HIRED", label: "Hired" },
] as const;

type ApplicationStatusFormProps = {
  applicationId: string;
  currentStatus: string;
};

export function ApplicationStatusForm({
  applicationId,
  currentStatus,
}: ApplicationStatusFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await updateApplicationStatusAction({
        applicationId,
        status: status as "NEW" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "HIRED",
      });

      if (!result.ok) {
        setError(result.error || "Unable to update status.");
        return;
      }

      setSuccess("Status updated successfully.");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {success}
        </div>
      ) : null}

      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">
          Application status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
        >
          {STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white shadow-brand-glow transition hover:opacity-95 disabled:opacity-60"
      >
        {isPending ? "Updating..." : "Update status"}
      </button>
    </form>
  );
}