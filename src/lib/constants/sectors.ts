// ─── International Development Sectors ───────────────────────────────────────
// Used for mission classification and expert profile sector experience.
// ─────────────────────────────────────────────────────────────────────────────

export interface Sector {
  value: string;
  label: string;
  category: string;
}

export const SECTORS: Sector[] = [
  // Governance & Rule of Law
  { value: "governance", label: "Governance & Public Administration", category: "Governance" },
  { value: "rule-of-law", label: "Rule of Law & Justice", category: "Governance" },
  { value: "anti-corruption", label: "Anti-Corruption & Transparency", category: "Governance" },
  { value: "decentralization", label: "Decentralization & Local Governance", category: "Governance" },
  { value: "public-finance", label: "Public Finance Management (PFM)", category: "Governance" },
  { value: "civil-society", label: "Civil Society & Democracy", category: "Governance" },
  { value: "electoral-support", label: "Electoral Support", category: "Governance" },

  // Economic Development
  { value: "private-sector", label: "Private Sector Development", category: "Economic Development" },
  { value: "trade-competitiveness", label: "Trade & Competitiveness", category: "Economic Development" },
  { value: "financial-inclusion", label: "Financial Inclusion & Microfinance", category: "Economic Development" },
  { value: "agribusiness", label: "Agribusiness & Value Chains", category: "Economic Development" },
  { value: "sme-development", label: "SME Development & Entrepreneurship", category: "Economic Development" },
  { value: "investment-climate", label: "Investment Climate & Business Environment", category: "Economic Development" },
  { value: "digital-economy", label: "Digital Economy & E-Government", category: "Economic Development" },

  // Agriculture & Food Security
  { value: "agriculture", label: "Agriculture & Rural Development", category: "Agriculture" },
  { value: "food-security", label: "Food Security & Nutrition", category: "Agriculture" },
  { value: "natural-resources", label: "Natural Resources Management", category: "Agriculture" },
  { value: "fisheries", label: "Fisheries & Aquaculture", category: "Agriculture" },
  { value: "livestock", label: "Livestock & Animal Health", category: "Agriculture" },
  { value: "irrigation", label: "Irrigation & Water for Agriculture", category: "Agriculture" },

  // Social Development
  { value: "education", label: "Education & Vocational Training", category: "Social" },
  { value: "health", label: "Health Systems & RMNCAH", category: "Social" },
  { value: "wash", label: "WASH (Water, Sanitation & Hygiene)", category: "Social" },
  { value: "social-protection", label: "Social Protection & Safety Nets", category: "Social" },
  { value: "gender-equality", label: "Gender Equality & Women's Empowerment", category: "Social" },
  { value: "youth-employment", label: "Youth Employment & TVET", category: "Social" },
  { value: "migration", label: "Migration & Forced Displacement", category: "Social" },
  { value: "urban-development", label: "Urban Development & Housing", category: "Social" },

  // Environment & Climate
  { value: "climate-change", label: "Climate Change & Adaptation", category: "Environment" },
  { value: "biodiversity", label: "Biodiversity & Ecosystem Services", category: "Environment" },
  { value: "energy", label: "Energy & Renewable Energy", category: "Environment" },
  { value: "environmental-management", label: "Environmental Management & EIA", category: "Environment" },
  { value: "sustainable-landscapes", label: "Sustainable Landscapes & REDD+", category: "Environment" },
  { value: "blue-economy", label: "Blue Economy & Coastal Management", category: "Environment" },

  // Infrastructure & Transport
  { value: "transport", label: "Transport & Infrastructure", category: "Infrastructure" },
  { value: "roads-bridges", label: "Roads, Bridges & Urban Mobility", category: "Infrastructure" },
  { value: "ict-infrastructure", label: "ICT Infrastructure & Connectivity", category: "Infrastructure" },

  // Humanitarian
  { value: "humanitarian-aid", label: "Humanitarian Aid & Emergency Response", category: "Humanitarian" },
  { value: "disaster-risk", label: "Disaster Risk Reduction (DRR)", category: "Humanitarian" },
  { value: "conflict-fragility", label: "Conflict, Fragility & Peacebuilding", category: "Humanitarian" },

  // Cross-cutting
  { value: "monitoring-evaluation", label: "Monitoring & Evaluation (M&E)", category: "Cross-cutting" },
  { value: "capacity-building", label: "Capacity Building & Institutional Strengthening", category: "Cross-cutting" },
  { value: "project-management", label: "Project Management & Coordination", category: "Cross-cutting" },
  { value: "procurement", label: "Procurement & Contract Management", category: "Cross-cutting" },
  { value: "communications", label: "Communications & Visibility", category: "Cross-cutting" },
  { value: "research-policy", label: "Research, Policy & Analysis", category: "Cross-cutting" },
];

export const SECTOR_CATEGORIES = [
  "Governance",
  "Economic Development",
  "Agriculture",
  "Social",
  "Environment",
  "Infrastructure",
  "Humanitarian",
  "Cross-cutting",
] as const;

export type SectorCategory = (typeof SECTOR_CATEGORIES)[number];

export function getSectorsByCategory(category: SectorCategory): Sector[] {
  return SECTORS.filter((s) => s.category === category);
}

export function getSectorLabel(value: string): string {
  return SECTORS.find((s) => s.value === value)?.label ?? value;
}
