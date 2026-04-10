"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Option = {
  id: string;
  name: string;
};

export default function ExpertProfileAdvancedForm({
  allExpertise,
  allLanguages,
  selectedExpertiseIds,
  selectedLanguageIds,
}: {
  allExpertise: Option[];
  allLanguages: Option[];
  selectedExpertiseIds: string[];
  selectedLanguageIds: string[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [expertiseIds, setExpertiseIds] = useState<string[]>(selectedExpertiseIds);
  const [languageIds, setLanguageIds] = useState<string[]>(selectedLanguageIds);

  function toggleExpertise(id: string) {
    setExpertiseIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function toggleLanguage(id: string) {
    setLanguageIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/expert/profile-advanced", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            expertiseIds,
            languageIds,
          }),
        });

        if (!response.ok) {
          const text = await response.text();
          setError(text || "Something went wrong.");
          return;
        }

        setSuccess("Expertise and languages updated successfully ✅");
        router.refresh();
      } catch (err) {
        setError("Something went wrong.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-8 space-y-8"
    >
      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          Expertise & languages
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Complete these fields to improve your match score and visibility to recruiters.
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-text-primary">
          Select your expertise
        </label>
        <p className="mt-1 text-xs text-text-muted">
          Tip: choose the expertise areas you want recruiters to find you for.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {allExpertise.map((item) => {
            const active = expertiseIds.includes(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleExpertise(item.id)}
                className={`rounded-full border px-3 py-2 text-sm transition ${
                  active
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border bg-background text-text-secondary hover:border-brand/40"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-text-primary">
          Select your languages
        </label>
        <p className="mt-1 text-xs text-text-muted">
          Tip: add all working languages relevant to international consulting missions.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {allLanguages.map((item) => {
            const active = languageIds.includes(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleLanguage(item.id)}
                className={`rounded-full border px-3 py-2 text-sm transition ${
                  active
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border bg-background text-text-secondary hover:border-brand/40"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-sm">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-emerald-600">{success}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-brand px-5 py-2.5 text-white disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save expertise & languages"}
        </button>
      </div>
    </form>
  );
}