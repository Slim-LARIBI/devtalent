import { prisma } from "@/lib/prisma";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border-primary bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function Toggle({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-text-primary">{label}</span>
      <button className="h-6 w-11 rounded-full bg-brand relative">
        <span className="absolute left-6 top-0.5 h-5 w-5 rounded-full bg-white shadow" />
      </button>
    </div>
  );
}

function Input({
  label,
  placeholder,
}: {
  label: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold uppercase text-text-tertiary">
        {label}
      </label>
      <input
        placeholder={placeholder}
        className="w-full rounded-xl border border-border-primary px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/10"
      />
    </div>
  );
}

export default async function AdminSettingsPage() {
  const totalUsers = await prisma.user.count();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-text-primary">
          Settings
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage platform configuration and system behavior.
        </p>
      </div>

      {/* PLATFORM STATUS */}
      <div className="rounded-2xl border border-border-primary bg-white p-5 shadow-sm flex justify-between items-center">
        <div>
          <p className="text-sm text-text-secondary">Platform status</p>
          <p className="text-lg font-semibold text-emerald-600">
            ✅ Healthy
          </p>
        </div>
        <div className="text-sm text-text-secondary">
          {totalUsers} users registered
        </div>
      </div>

      {/* ACCOUNT */}
      <Section title="Admin account">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Name" placeholder="Admin name" />
          <Input label="Email" placeholder="admin@email.com" />
          <Input label="Role" placeholder="ADMIN" />
          <Input label="Password" placeholder="••••••••" />
        </div>
      </Section>

      {/* PLATFORM */}
      <Section
        title="Platform configuration"
        description="Global platform settings"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Platform name" placeholder="DevTalent" />
          <Input label="Domain" placeholder="devtalent.tech" />
          <Input label="Timezone" placeholder="UTC+1" />
          <Input label="Language" placeholder="English" />
        </div>
      </Section>

      {/* RECRUITMENT RULES */}
      <Section
        title="Recruitment rules"
        description="Control how hiring works on the platform"
      >
        <div className="space-y-4">
          <Input label="Max applications per mission" placeholder="100" />
          <Input label="Auto close mission (days)" placeholder="30" />

          <Toggle label="Allow multiple recruiters per mission" />
          <Toggle label="Enable mission competition view" />
        </div>
      </Section>

      {/* AI / MATCHING */}
      <Section
        title="AI Matching"
        description="Configure intelligent matching system"
      >
        <div className="space-y-4">
          <Toggle label="Enable AI scoring" />
          <Input label="Matching threshold (%)" placeholder="70" />
        </div>
      </Section>

      {/* NOTIFICATIONS */}
      <Section
        title="Notifications"
        description="Control platform alerts and emails"
      >
        <div className="space-y-4">
          <Toggle label="Email on new application" />
          <Toggle label="Email on hire" />
          <Toggle label="Admin alerts" />
        </div>
      </Section>

      {/* SECURITY */}
      <Section
        title="Security"
        description="Platform access and protection"
      >
        <div className="space-y-4">
          <Toggle label="Require email verification" />
          <Toggle label="Allow public signup" />
        </div>
      </Section>

      {/* SAVE */}
      <div className="flex justify-end">
        <button className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow hover:opacity-95">
          Save changes
        </button>
      </div>
    </div>
  );
}