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
import { Comparison }     from "@/components/landing/comparison";
import { Features }       from "@/components/landing/features";
import { Proof }          from "@/components/landing/proof";
import { CTA }            from "@/components/landing/cta";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Comparison />
        <ForExperts />
        <Proof />
        <ForRecruiters />
        <HowItWorks />
        <Features />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
