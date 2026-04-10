"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";

export default function TogglePublicProfile({
  initialIsPublic,
  slug,
}: {
  initialIsPublic: boolean;
  slug: string | null;
}) {
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [publicSlug, setPublicSlug] = useState(slug);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    setMessage("");
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/expert/visibility", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isPublic: !isPublic,
          }),
        });

        if (!response.ok) {
          const text = await response.text();
          setError(text || "Unable to update visibility.");
          return;
        }

        const data = await response.json();

        setIsPublic(data.isPublic);
        setPublicSlug(data.slug || null);
        setMessage(
          data.isPublic
            ? "Your public profile is now visible to recruiters ✅"
            : "Your public profile is now hidden ✅"
        );

        router.refresh();
      } catch (err) {
        setError("Something went wrong.");
      }
    });
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Public profile</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Control whether recruiters can view your public expert profile.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              isPublic
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                : "border-border bg-background text-text-secondary"
            }`}
          >
            {isPublic ? "Visible to recruiters" : "Hidden"}
          </span>

          <button
            type="button"
            onClick={handleToggle}
            disabled={isPending}
            className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition hover:opacity-95 disabled:opacity-60"
          >
            {isPending
              ? "Updating..."
              : isPublic
              ? "Hide public profile"
              : "Make profile public"}
          </button>

          {publicSlug ? (
            <Link
              href={`/experts/${publicSlug}`}
              target="_blank"
              className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-raised"
            >
              View public profile
            </Link>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {message}
        </div>
      ) : null}
    </section>
  );
}