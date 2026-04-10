"use client";

import { useState, useTransition } from "react";
import { MessageSquareText, Clock3, Send } from "lucide-react";
import { addMissionInternalNoteAction } from "@/app/(recruiter)/recruiter/missions/[id]/actions";

type NoteItem = {
  id: string;
  content: string;
  createdAt: string;
  authorName: string;
  authorEmail: string;
  authorRole: string;
  isCurrentUser: boolean;
};

function formatRoleLabel(role: string) {
  return role.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(date: string) {
  return new Date(date).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MissionInternalNotes({
  missionId,
  notes,
}: {
  missionId: string;
  notes: NoteItem[];
}) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await addMissionInternalNoteAction({
        missionId,
        content,
      });

      if (!result.ok) {
        setError(result.error || "Unable to save note.");
        return;
      }

      setContent("");
      setSuccess("Internal note added ✅");
    });
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-brand/10 p-2 text-brand">
          <MessageSquareText className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Internal notes</h2>
          <p className="text-sm text-text-secondary">
            Team-only mission comments, recommendations, and coordination notes.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="Example: I know two strong M&E experts for this mission. One is immediately available and strong on EU reporting."
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-text-muted focus:border-brand"
        />

        <div className="flex items-center justify-between gap-4">
          <div className="text-sm">
            {error ? <p className="text-red-500">{error}</p> : null}
            {success ? <p className="text-emerald-500">{success}</p> : null}
          </div>

          <button
            type="submit"
            disabled={isPending || content.trim().length < 3}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-brand-glow transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {isPending ? "Posting..." : "Add note"}
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-4">
        {notes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background px-4 py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface text-text-muted">
              <Clock3 className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-medium text-text-primary">No internal notes yet</p>
            <p className="mt-1 text-sm text-text-secondary">
              Start the team discussion around this mission here.
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="rounded-2xl border border-border bg-background p-4 transition hover:border-border-strong"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-text-primary">
                      {note.authorName}
                    </p>

                    <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-text-secondary">
                      {formatRoleLabel(note.authorRole)}
                    </span>

                    {note.isCurrentUser ? (
                      <span className="rounded-full border border-brand/20 bg-brand/10 px-2.5 py-1 text-[11px] font-medium text-brand">
                        You
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 text-xs text-text-muted">{note.authorEmail}</p>
                </div>

                <span className="text-xs text-text-muted">
                  {formatDate(note.createdAt)}
                </span>
              </div>

              <div className="mt-4 rounded-2xl border border-border bg-surface px-4 py-3">
                <p className="whitespace-pre-line text-sm leading-7 text-text-secondary">
                  {note.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}