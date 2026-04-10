"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";

type UploadResultItem = {
  url?: string;
  ufsUrl?: string;
  name?: string;
  size?: number;
  type?: string;
  key?: string;
};

export default function UploadCV() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { startUpload, isUploading } = useUploadThing("expertDocuments", {
    onClientUploadComplete: async (files) => {
      try {
        setError("");
        setSuccess("");

        const file = files?.[0] as UploadResultItem | undefined;

        if (!file) {
          setError("Upload failed. No file returned.");
          return;
        }

        const response = await fetch("/api/expert/upload-cv", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: file.name,
            url: file.ufsUrl || file.url,
            key: file.key,
            size: file.size,
            mimeType: file.type,
            type: "CV",
          }),
        });

        if (!response.ok) {
          const text = await response.text();
          setError(text || "Failed to save document.");
          return;
        }

        setSuccess("CV uploaded successfully ✅");
        router.refresh();
      } catch (err) {
        setError("Something went wrong while saving the document.");
      }
    },
    onUploadError: (err) => {
      setSuccess("");
      setError(err.message || "Upload failed.");
    },
  });

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    setSuccess("");

    const file = e.target.files?.[0];
    if (!file) return;

    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const lowerName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some((ext) => lowerName.endsWith(ext));

    if (!allowedMimeTypes.includes(file.type) && !hasValidExtension) {
      setError("Only PDF, DOC, and DOCX files are allowed.");
      return;
    }

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      setError("File is too large. Maximum size is 10 MB.");
      return;
    }

    await startUpload([file]);

    // reset input so same file can be re-selected if needed
    e.target.value = "";
  }

  return (
    <div className="mt-4">

      <input
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        disabled={isUploading}
        className="mt-3 block w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary file:mr-4 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-95 disabled:opacity-60"
      />

      {isUploading ? (
        <p className="mt-3 text-sm text-text-muted">Uploading CV...</p>
      ) : null}

      {error ? (
        <p className="mt-3 text-sm text-red-500">{error}</p>
      ) : null}

      {success ? (
        <p className="mt-3 text-sm text-emerald-600">{success}</p>
      ) : null}
    </div>
  );
}