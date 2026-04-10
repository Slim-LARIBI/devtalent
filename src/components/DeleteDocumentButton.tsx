"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteDocumentButton({
  documentId,
}: {
  documentId: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this document?");
    if (!confirmed) return;

    try {
      setIsDeleting(true);

      const response = await fetch("/api/expert/delete-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentId }),
      });

      if (!response.ok) {
        const text = await response.text();
        alert(text || "Failed to delete document.");
        return;
      }

      router.refresh();
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-sm font-medium text-red-600 disabled:opacity-60"
    >
      {isDeleting ? "Deleting..." : "Delete document"}
    </button>
  );
}