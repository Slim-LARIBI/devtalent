import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatLevel(value: string | null | undefined) {
  if (!value) return "Not specified";
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function PublicExpertProfilePage({ params }: PageProps) {
  const { slug } = await params;

  const expert = await prisma.expertProfile.findFirst({
    where: {
      slug,
      isPublic: true,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      expertise: {
        include: {
          expertise: {
            select: {
              name: true,
            },
          },
        },
      },
      languages: {
        include: {
          language: {
            select: {
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
          name: true,
          url: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!expert) {
    notFound();
  }

  const currentCv = expert.documents[0] || null;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-text-muted">Public Expert Profile</p>
          <h1 className="text-3xl font-semibold text-text-primary">
            {expert.user.name || "Expert profile"}
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            {expert.title || "Independent expert in international development"}
          </p>
        </div>

        <Link
          href="/"
          className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-raised"
        >
          Back to home
        </Link>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Location</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {expert.location || "Not specified"}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Level</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {formatLevel(expert.level)}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Experience</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {expert.yearsOfExperience ? `${expert.yearsOfExperience} years` : "Not specified"}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-text-muted">Availability</p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {expert.availability || "Not specified"}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-border bg-background p-4">
          <p className="text-xs uppercase tracking-wide text-text-muted">Bio</p>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-text-secondary">
            {expert.bio || "No bio provided yet."}
          </p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Expertise</h2>
            <span className="text-sm text-text-muted">{expert.expertise.length} item(s)</span>
          </div>

          {expert.expertise.length === 0 ? (
            <div className="mt-4 rounded-xl border border-border bg-background p-4 text-sm text-text-secondary">
              No expertise listed.
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
              No languages listed.
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
        <h2 className="text-lg font-semibold text-text-primary">CV</h2>

        {!currentCv ? (
          <div className="mt-4 rounded-xl border border-border bg-background p-4 text-sm text-text-secondary">
            No CV available.
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-border bg-background p-4">
            <p className="font-medium text-text-primary">{currentCv.name}</p>
            <p className="mt-2 text-sm text-text-secondary">
              Latest uploaded CV available for recruiter review.
            </p>

            <a
              href={currentCv.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-medium text-brand"
            >
              View CV
            </a>
          </div>
        )}
      </section>
    </div>
  );
}