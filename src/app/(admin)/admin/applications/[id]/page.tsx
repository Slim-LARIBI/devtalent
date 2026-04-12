import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

function getStatusColor(status: string) {
  switch (status) {
    case "NEW":
      return "bg-blue-50 text-blue-700";
    case "SHORTLISTED":
      return "bg-amber-50 text-amber-700";
    case "HIRED":
      return "bg-emerald-50 text-emerald-700";
    case "REJECTED":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: {
      expert: {
        include: {
          user: true,
        },
      },
      mission: {
        include: {
          organization: true,
          recruiter: {
            include: {
              user: true,
            },
          },
        },
      },
      documents: {
        include: {
          document: true,
        },
      },
    },
  });

  if (!application) return notFound();

  // 🔥 FAKE AI SCORE (pour demo investor)
  const aiScore = 94;

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">
          Application Detail
        </h1>
        <p className="text-sm text-text-secondary">
          Candidate profile and evaluation overview.
        </p>
      </div>

      {/* TOP GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* EXPERT */}
        <div className="rounded-xl border p-5 bg-white space-y-2">
          <p className="text-xs uppercase text-text-tertiary">Expert</p>
          <p className="font-semibold text-text-primary">
            {application.expert.user.name}
          </p>
          <p className="text-sm text-text-secondary">
            {application.expert.user.email}
          </p>
        </div>

        {/* AI SCORE */}
        <div className="rounded-xl border p-5 bg-white">
          <p className="text-xs uppercase text-text-tertiary mb-2">
            AI Matching Score
          </p>
          <p className={`text-4xl font-bold ${getScoreColor(aiScore)}`}>
            {aiScore}%
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Based on skills, experience, and mission fit
          </p>
        </div>

      </div>

      {/* MISSION INFO */}
      <div className="rounded-xl border p-5 bg-white space-y-3">
        <p className="text-xs uppercase text-text-tertiary">Mission</p>

        <p className="font-semibold text-text-primary">
          {application.mission.title}
        </p>

        <p className="text-sm text-text-secondary">
          {application.mission.organization?.name || "—"} •{" "}
          {application.mission.recruiter.user.name}
        </p>
      </div>

      {/* STATUS */}
      <div className="rounded-xl border p-5 bg-white">
        <p className="text-xs uppercase text-text-tertiary mb-2">Status</p>
        <span
          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            application.status
          )}`}
        >
          {application.status}
        </span>
      </div>

      {/* CV UPLOAD */}
      <div className="rounded-xl border p-5 bg-white">
        <p className="text-xs uppercase text-text-tertiary mb-3">
          Documents (CV)
        </p>

        {application.documents.length === 0 ? (
          <p className="text-sm text-text-secondary">
            No documents uploaded
          </p>
        ) : (
          <div className="space-y-2">
            {application.documents.map((doc) => (
              <a
                key={doc.id}
                href={doc.document.url}
                target="_blank"
                className="block text-sm text-brand hover:underline"
              >
                📄 {doc.document.name}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* TIMELINE */}
      <div className="rounded-xl border p-5 bg-white">
        <p className="text-xs uppercase text-text-tertiary mb-4">
          Timeline
        </p>

        <div className="space-y-3 text-sm">

          <div className="flex justify-between">
            <span>Applied</span>
            <span className="text-text-secondary">
              {new Date(application.createdAt).toLocaleDateString()}
            </span>
          </div>

          {application.reviewedAt && (
            <div className="flex justify-between">
              <span>Reviewed</span>
              <span>{new Date(application.reviewedAt).toLocaleDateString()}</span>
            </div>
          )}

          {application.shortlistedAt && (
            <div className="flex justify-between">
              <span>Shortlisted</span>
              <span>{new Date(application.shortlistedAt).toLocaleDateString()}</span>
            </div>
          )}

          {application.closedAt && (
            <div className="flex justify-between">
              <span>Closed</span>
              <span>{new Date(application.closedAt).toLocaleDateString()}</span>
            </div>
          )}

        </div>
      </div>

      {/* COVER NOTE */}
      {application.coverNote && (
        <div className="rounded-xl border p-5 bg-white">
          <p className="text-xs uppercase text-text-tertiary mb-2">
            Cover Note
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            {application.coverNote}
          </p>
        </div>
      )}

    </div>
  );
}