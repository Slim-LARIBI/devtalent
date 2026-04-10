import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    redirect("/login");
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="rounded-xl border p-4">
        <p>Email: {session.user.email}</p>
        <p>Role: {session.user.role}</p>
      </div>
    </div>
  );
}