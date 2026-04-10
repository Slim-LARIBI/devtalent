// ─── NextAuth v5 (Auth.js) Configuration ─────────────────────────────────────
// Credentials + Google OAuth
// Role-based redirects
// Session enriched with role + profile IDs
// ─────────────────────────────────────────────────────────────────────────────

import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { validateCredentials } from "@/server/services/auth.service";
import { loginSchema } from "@/lib/validations/auth";
import type { UserRole } from "@prisma/client";

const config: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt", // JWT for credentials; database sessions for OAuth
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/onboarding",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          const user = await validateCredentials(
            parsed.data.email,
            parsed.data.password
          );
          return user;
        } catch {
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // On first sign-in, enrich token with role
      if (user) {
        token.role = (user as { role?: UserRole }).role ?? "EXPERT";
        token.id = user.id!;
      }

      // Handle session updates (e.g. role change)
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },

    async signIn({ user, account }) {
      // For OAuth users: ensure role is set (default EXPERT)
      if (account?.provider !== "credentials") {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (dbUser && !dbUser.role) {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { role: "EXPERT" },
          });
        }

        // Create expert profile shell if new OAuth user
        if (dbUser) {
          const existingProfile = await prisma.expertProfile.findUnique({
            where: { userId: dbUser.id },
          });

          if (!existingProfile && dbUser.role === "EXPERT") {
            await prisma.expertProfile.create({
              data: { userId: dbUser.id },
            });
          }
        }
      }

      return true;
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role as UserRole | undefined;

      // Protected route prefixes
      const isExpertRoute = nextUrl.pathname.startsWith("/expert");
      const isRecruiterRoute = nextUrl.pathname.startsWith("/recruiter");
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isAuthRoute = nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");

      // Redirect authenticated users away from auth pages
      if (isLoggedIn && isAuthRoute) {
        const redirect = getRedirectForRole(role);
        return Response.redirect(new URL(redirect, nextUrl));
      }

      // Enforce role-based access
      if (isExpertRoute) {
        if (!isLoggedIn) {
          return Response.redirect(new URL("/login?callbackUrl=" + nextUrl.pathname, nextUrl));
        }
        if (role !== "EXPERT" && role !== "ADMIN") {
          return Response.redirect(new URL("/unauthorized", nextUrl));
        }
      }

      if (isRecruiterRoute) {
        if (!isLoggedIn) {
          return Response.redirect(new URL("/login?callbackUrl=" + nextUrl.pathname, nextUrl));
        }
        if (role !== "RECRUITER" && role !== "ADMIN") {
          return Response.redirect(new URL("/unauthorized", nextUrl));
        }
      }

      if (isAdminRoute) {
        if (!isLoggedIn || role !== "ADMIN") {
          return Response.redirect(new URL("/login", nextUrl));
        }
      }

      return true;
    },
  },
};

function getRedirectForRole(role?: UserRole): string {
  switch (role) {
    case "EXPERT":
      return "/expert/dashboard";
    case "RECRUITER":
      return "/recruiter/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
    default:
      return "/";
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(config);
