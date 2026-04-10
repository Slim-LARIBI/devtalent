import Link from "next/link";
import { ShieldX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background hero-gradient">
      <div className="text-center px-6 animate-fade-in-up">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive-muted/30">
            <ShieldX className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <h1 className="text-display-sm font-bold text-text-primary mb-3 tracking-tight">
          Access denied
        </h1>
        <p className="text-body-sm text-text-secondary max-w-sm mx-auto mb-8">
          You don&apos;t have permission to view this page.
          Please sign in with the correct account type.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="brand" asChild>
            <Link href="/dashboard">
              Go to my dashboard
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
