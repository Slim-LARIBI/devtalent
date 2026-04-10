import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DevTalent — Expert Recruitment for International Development",
    template: "%s | DevTalent",
  },
  description:
    "The premium recruitment platform connecting international development experts with NGOs, consulting firms, and donor-funded projects.",
  keywords: [
    "international development",
    "expert recruitment",
    "NGO jobs",
    "consulting missions",
    "World Bank",
    "EU projects",
    "UN jobs",
    "development consultant",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "DevTalent",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        "antialiased"
      )}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}