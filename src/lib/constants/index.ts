export * from "./sectors";
export * from "./donors";
export * from "./languages";
export * from "./regions";

// ─── Expertise / Skills Reference Data ───────────────────────────────────────
// Common expertise areas across international development.

export const EXPERTISE_AREAS = [
  // Technical skills
  { slug: "monitoring-evaluation", name: "Monitoring & Evaluation (M&E)", category: "Technical" },
  { slug: "logframe-design", name: "Logframe & Theory of Change Design", category: "Technical" },
  { slug: "data-analysis", name: "Data Analysis & Statistics", category: "Technical" },
  { slug: "gis-remote-sensing", name: "GIS & Remote Sensing", category: "Technical" },
  { slug: "impact-evaluation", name: "Impact Evaluation", category: "Technical" },
  { slug: "project-cycle-management", name: "Project Cycle Management (PCM)", category: "Technical" },
  { slug: "public-finance-management", name: "Public Finance Management (PFM)", category: "Technical" },
  { slug: "institutional-assessment", name: "Institutional Assessment & Reform", category: "Technical" },
  { slug: "environmental-impact-assessment", name: "Environmental Impact Assessment (EIA)", category: "Technical" },
  { slug: "social-impact-assessment", name: "Social Impact Assessment (SIA)", category: "Technical" },
  { slug: "supply-chain-management", name: "Supply Chain & Logistics Management", category: "Technical" },
  { slug: "financial-management", name: "Financial Management & Accounting", category: "Technical" },
  { slug: "procurement-contracting", name: "Procurement & Contracting", category: "Technical" },
  { slug: "legal-regulatory", name: "Legal & Regulatory Reform", category: "Technical" },
  { slug: "digital-transformation", name: "Digital Transformation & ICT4D", category: "Technical" },

  // Thematic areas
  { slug: "wash-engineering", name: "WASH Engineering", category: "Thematic" },
  { slug: "health-systems-strengthening", name: "Health Systems Strengthening", category: "Thematic" },
  { slug: "nutrition", name: "Nutrition & Food Systems", category: "Thematic" },
  { slug: "education-reform", name: "Education Reform & Curriculum", category: "Thematic" },
  { slug: "early-childhood", name: "Early Childhood Development", category: "Thematic" },
  { slug: "gender-mainstreaming", name: "Gender Mainstreaming & GBV", category: "Thematic" },
  { slug: "social-protection", name: "Social Protection Programme Design", category: "Thematic" },
  { slug: "cash-transfer", name: "Cash Transfer Programming", category: "Thematic" },
  { slug: "climate-finance", name: "Climate Finance & Carbon Markets", category: "Thematic" },
  { slug: "renewable-energy", name: "Renewable Energy & Energy Efficiency", category: "Thematic" },
  { slug: "value-chain-development", name: "Value Chain Development", category: "Thematic" },
  { slug: "market-systems", name: "Market Systems & Private Sector Engagement", category: "Thematic" },
  { slug: "financial-inclusion", name: "Financial Inclusion & Microfinance", category: "Thematic" },
  { slug: "conflict-sensitivity", name: "Conflict Sensitivity & Peacebuilding", category: "Thematic" },
  { slug: "protection-cluster", name: "Protection Cluster Coordination", category: "Thematic" },
  { slug: "refugee-livelihoods", name: "Refugee Livelihoods & DURABLE Solutions", category: "Thematic" },

  // Cross-cutting
  { slug: "capacity-development", name: "Capacity Development & Training", category: "Cross-cutting" },
  { slug: "stakeholder-engagement", name: "Stakeholder Engagement & Facilitation", category: "Cross-cutting" },
  { slug: "results-based-management", name: "Results-Based Management (RBM)", category: "Cross-cutting" },
  { slug: "do-no-harm", name: "Do No Harm & PSEAH", category: "Cross-cutting" },
  { slug: "communications-visibility", name: "Communications & Visibility", category: "Cross-cutting" },
  { slug: "report-writing", name: "Technical Report Writing", category: "Cross-cutting" },
  { slug: "team-leadership", name: "Team Leadership & Management", category: "Cross-cutting" },
  { slug: "grants-management", name: "Grants Management", category: "Cross-cutting" },
] as const;

export type ExpertiseSlug = (typeof EXPERTISE_AREAS)[number]["slug"];

// ─── Expert / Mission enum labels ─────────────────────────────────────────────

export const EXPERT_LEVEL_LABELS: Record<string, string> = {
  JUNIOR: "Junior Expert",
  MID: "Mid-level Expert",
  SENIOR: "Senior Expert",
  PRINCIPAL: "Principal Expert",
  DIRECTOR: "Director / Team Leader",
};

export const MISSION_TYPE_LABELS: Record<string, string> = {
  SHORT_TERM: "Short-term",
  LONG_TERM: "Long-term",
};

export const WORK_MODE_LABELS: Record<string, string> = {
  REMOTE: "Remote",
  ON_SITE: "On-site",
  HYBRID: "Hybrid",
};

export const CONTRACT_TYPE_LABELS: Record<string, string> = {
  CONSULTANT: "Consultant",
  EMPLOYEE: "Employee",
  FREELANCE: "Freelance",
  FIXED_TERM: "Fixed-term Contract",
};

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  REVIEWED: "Under Review",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Not Selected",
  HIRED: "Hired",
};

export const ORGANIZATION_TYPE_LABELS: Record<string, string> = {
  NGO: "NGO",
  CONSULTING_FIRM: "Consulting Firm",
  DONOR_AGENCY: "Donor Agency",
  INTERNATIONAL_ORGANIZATION: "International Organization",
  GOVERNMENT: "Government",
  BILATERAL_AGENCY: "Bilateral Agency",
  MULTILATERAL_BANK: "Multilateral Bank",
  THINK_TANK: "Think Tank",
  FOUNDATION: "Foundation",
  OTHER: "Other",
};

export const AVAILABILITY_OPTIONS = [
  "Immediately available",
  "Available in 2 weeks",
  "Available in 1 month",
  "Available in 3 months",
  "Open to discuss",
  "Currently unavailable",
] as const;
