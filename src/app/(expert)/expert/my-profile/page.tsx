import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UploadCV from "@/components/UploadCV";
import DeleteDocumentButton from "@/components/DeleteDocumentButton";
import TogglePublicProfile from "@/components/TogglePublicProfile";
import Link from "next/link";
import EditProfileForm from "./EditProfileForm";
import ExpertProfileAdvancedForm from "./ExpertProfileAdvancedForm";
import { redirect } from "next/navigation";

function formatLevel(value: string | null | undefined) {
  if (!value) return "Not set";
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getChecklist(profile: {
  title: string | null;
  bio: string | null;
  location: string | null;
  level: string | null;
  yearsOfExperience: number | null;
  languagesCount: number;
  expertiseCount: number;
  documentsCount: number;
}) {
  return [
    { label: "Professional title", done: Boolean(profile.title) },
    { label: "Bio / summary", done: Boolean(profile.bio) },
    { label: "Location", done: Boolean(profile.location) },
    { label: "Experience level", done: Boolean(profile.level) },
    { label: "Years of experience", done: Boolean(profile.yearsOfExperience) },
    { label: "Languages", done: profile.languagesCount > 0 },
    { label: "Expertise", done: profile.expertiseCount > 0 },
    { label: "CV uploaded", done: profile.documentsCount > 0 },
  ];
}

export default async function ExpertMyProfilePage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "EXPERT") {
    redirect("/login");
  }

  const expert = await prisma.expertProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      languages: {
        include: {
          language: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      expertise: {
        include: {
          expertise: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      documents: {
        where: {
          type: "CV",
        },
        select: {
          id: true,
          name: true,
          type: true,
          url: true,
          isPrimary: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!expert) {
    redirect("/expert/dashboard");
  }

  const [allExpertise, allLanguages] = await Promise.all([
    prisma.expertise.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    }),
    prisma.language.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  const checklist = getChecklist({
    title: expert.title,
    bio: expert.bio,
    location: expert.location,
    level: expert.level,
    yearsOfExperience: expert.yearsOfExperience,
    languagesCount: expert.languages.length,
    expertiseCount: expert.expertise.length,
    documentsCount: expert.documents.length,
  });

  const completedCount = checklist.filter((item) => item.done).length;
  const completion = Math.round((completedCount / checklist.length) * 100);

  const currentCv = expert.documents[0] || null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-text-muted">Expert / My Profile</p>
          <h1 className="text-3xl font-semibold text-text-primary">
            {expert.user.name || "My profile"}
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Complete your expert profile to improve visibility, invitations, and mission matching.
          </p>
        </div>

        <Link
          href="/missions"
          className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition hover:opacity-95"
        >
          Browse missions
        </Link>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Profile completion</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Recruiters are more likely to contact experts with complete profiles.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background px-5 py-4 text-center">
            <p className="text-xs uppercase tracking-wide text-text-muted">Profile score</p>
            <p className="mt-2 text-3xl font-semibold text-text-primary">{completion}%</p>
          </div>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-background">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {checklist.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm"
            >
              <span className={item.done ? "text-emerald-600" : "text-amber-600"}>
                {item.done ? "✅" : "⚠️"}
              </span>{" "}
              <span className="text-text-primary">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <TogglePublicProfile initialIsPublic={expert.isPublic} slug={expert.slug} />

      <EditProfileForm expert={expert} />

      <ExpertProfileAdvancedForm
        allExpertise={allExpertise}
        allLanguages={allLanguages}
        selectedExpertiseIds={expert.expertise.map((item) => item.expertise.id)}
        selectedLanguageIds={expert.languages.map((item) => item.language.id)}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-text-primary">Profile overview</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Email</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {expert.user.email}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Public profile</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {expert.isPublic ? "Visible to recruiters" : "Hidden"}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Title</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {expert.title || "Not set"}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Location</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {expert.location || "Not set"}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Level</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {formatLevel(expert.level)}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">Years of experience</p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {expert.yearsOfExperience ?? "Not set"}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Bio</p>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {expert.bio || "No bio added yet."}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-text-primary">Visibility tips</h2>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-sm font-medium text-text-primary">
                Complete your profile to get invited by recruiters
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Add expertise, languages, experience, and your CV to improve match quality and recruiter trust.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-sm font-medium text-text-primary">
                Strong profiles convert better
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Experts with complete profiles are easier to shortlist and more likely to receive direct invitations.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-sm font-medium text-text-primary">
                Next best action
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Make your profile public once your title, expertise, languages, and CV are ready.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Expertise</h2>
            <span className="text-sm text-text-muted">{expert.expertise.length} item(s)</span>
          </div>

          {expert.expertise.length === 0 ? (
            <div className="mt-4 rounded-xl border border-border bg-background p-4 text-sm text-text-secondary">
              No expertise added yet.
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {expert.expertise.map((item) => (
                <span
                  key={item.expertise.name}
                  className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs text-brand"
                >
                  {item.expertise.name}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Languages</h2>
            <span className="text-sm text-text-muted">{expert.languages.length} item(s)</span>
          </div>

          {expert.languages.length === 0 ? (
            <div className="mt-4 rounded-xl border border-border bg-background p-4 text-sm text-text-secondary">
              No languages added yet.
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {expert.languages.map((item) => (
                <span
                  key={item.language.name}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary"
                >
                  {item.language.name}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">CV management</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Uploading a new CV automatically replaces the previous one.
            </p>
          </div>

          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary">
            {currentCv ? "1 active CV" : "No CV"}
          </span>
        </div>

        <div className="mt-4 rounded-xl border border-border bg-background p-4">
          <p className="text-sm font-medium text-text-primary">Upload your CV</p>
          <p className="mt-1 text-sm text-text-secondary">
            Accepted formats: PDF, DOC, DOCX. Maximum size: 10 MB.
          </p>

          <UploadCV />
        </div>

        {!currentCv ? (
          <div className="mt-4 rounded-xl border border-border bg-background p-4 text-sm text-text-secondary">
            No CV uploaded yet. Add your CV to improve recruiter confidence and unlock applications.
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-border bg-background p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-text-primary">{currentCv.name}</p>
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
                    Primary CV
                  </span>
                </div>

                <p className="mt-2 text-sm text-text-secondary">
                  This CV will be used automatically when you apply to missions.
                </p>

                <p className="mt-2 text-xs text-text-muted">
                  Uploaded on {new Date(currentCv.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href={currentCv.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-brand"
                >
                  View CV
                </a>

                <DeleteDocumentButton documentId={currentCv.id} />
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}