"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function EditProfileForm({
  expert,
}: {
  expert: any;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: expert.title || "",
    bio: expert.bio || "",
    location: expert.location || "",
    level: expert.level || "",
    yearsOfExperience: expert.yearsOfExperience?.toString() || "",
    availability: expert.availability || "",
    linkedinUrl: expert.linkedinUrl || "",
    portfolioUrl: expert.portfolioUrl || "",
  });

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/expert/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          const text = await response.text();
          setError(text || "Something went wrong");
          return;
        }

        setSuccess("Profile updated successfully ✅");
        router.refresh();
      } catch (err) {
        setError("Something went wrong");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-8 space-y-6"
    >
      <div>
        <label className="text-sm font-medium">Professional title</label>
        <input
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="Senior M&E Expert | EU-funded programmes | Governance"
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3"
        />
        <p className="mt-1 text-xs text-text-muted">
          Tip: Mention role + sector + experience
        </p>
      </div>

      <div>
        <label className="text-sm font-medium">Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => updateField("bio", e.target.value)}
          placeholder="International development expert with 10+ years of experience in EU and World Bank funded programmes..."
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3"
          rows={4}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Location</label>
        <input
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
          placeholder="Tunis, Tunisia"
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Experience level</label>
        <select
          value={form.level}
          onChange={(e) => updateField("level", e.target.value)}
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3"
        >
          <option value="">Select level</option>
          <option value="JUNIOR">Junior</option>
          <option value="MID">Mid</option>
          <option value="SENIOR">Senior</option>
          <option value="PRINCIPAL">Principal</option>
          <option value="DIRECTOR">Director</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Years of experience</label>
        <input
          type="number"
          value={form.yearsOfExperience}
          onChange={(e) => updateField("yearsOfExperience", e.target.value)}
          placeholder="10"
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Availability</label>
        <input
          value={form.availability}
          onChange={(e) => updateField("availability", e.target.value)}
          placeholder="Available immediately for short-term missions"
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3"
        />
      </div>

      <div>
        <label className="text-sm font-medium">LinkedIn</label>
        <input
          value={form.linkedinUrl}
          onChange={(e) => updateField("linkedinUrl", e.target.value)}
          placeholder="https://linkedin.com/in/your-name"
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Portfolio</label>
        <input
          value={form.portfolioUrl}
          onChange={(e) => updateField("portfolioUrl", e.target.value)}
          placeholder="https://yourportfolio.com"
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3"
        />
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-emerald-600">{success}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-brand px-5 py-2.5 text-white disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}