// ─── Landing Page ─────────────────────────────────────────────────────────────
// Server component root. All sections are client components for animation.
// ─────────────────────────────────────────────────────────────────────────────

import { Navbar }         from "@/components/layout/navbar";
import { Footer }         from "@/components/layout/footer";
import { Hero }           from "@/components/landing/hero";
import { Stats }          from "@/components/landing/stats";
import { ForExperts }     from "@/components/landing/for-experts";
import { ForRecruiters }  from "@/components/landing/for-recruiters";
import { HowItWorks }     from "@/components/landing/how-it-works";
import { Features }       from "@/components/landing/features";
import { CTA }            from "@/components/landing/cta";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <ForExperts />
        <ForRecruiters />
        <HowItWorks />
        <Features />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
