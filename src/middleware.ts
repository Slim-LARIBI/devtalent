// ─── Next.js Middleware ───────────────────────────────────────────────────────
// Auth.js v5 middleware — runs on every matched route.
// Route protection is handled in auth.ts `authorized` callback.
// ─────────────────────────────────────────────────────────────────────────────

export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static  (Next.js static files)
     * - _next/image   (Next.js image optimization)
     * - favicon.ico   (favicon)
     * - /images/*     (public images)
     * - /api/uploadthing (file upload webhook)
     * - / (landing page — public)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|api/uploadthing).*)",
  ],
};
