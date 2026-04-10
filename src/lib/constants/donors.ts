// ─── Donor / Funder Organizations ─────────────────────────────────────────────
// Major donors and funders in international development.
// ─────────────────────────────────────────────────────────────────────────────

export interface Donor {
  value: string;
  label: string;
  shortName: string;
  type: DonorType;
  region?: string;
}

export type DonorType =
  | "MULTILATERAL_BANK"
  | "UN_AGENCY"
  | "BILATERAL"
  | "EU"
  | "PRIVATE_FOUNDATION"
  | "OTHER";

export const DONORS: Donor[] = [
  // ─── European Union ─────────────────────────────────────────────────────
  {
    value: "eu",
    label: "European Union (EU/DEVCO/INTPA)",
    shortName: "EU",
    type: "EU",
  },
  {
    value: "echo",
    label: "EU Humanitarian Aid (ECHO/HUMA)",
    shortName: "ECHO",
    type: "EU",
  },
  {
    value: "eu-neighbourhood",
    label: "EU Neighbourhood Policy (NEAR)",
    shortName: "EU NEAR",
    type: "EU",
  },

  // ─── World Bank Group ────────────────────────────────────────────────────
  {
    value: "world-bank",
    label: "World Bank / IBRD / IDA",
    shortName: "World Bank",
    type: "MULTILATERAL_BANK",
  },
  {
    value: "ifc",
    label: "International Finance Corporation (IFC)",
    shortName: "IFC",
    type: "MULTILATERAL_BANK",
  },
  {
    value: "miga",
    label: "Multilateral Investment Guarantee Agency (MIGA)",
    shortName: "MIGA",
    type: "MULTILATERAL_BANK",
  },

  // ─── UN System ───────────────────────────────────────────────────────────
  { value: "undp", label: "United Nations Development Programme (UNDP)", shortName: "UNDP", type: "UN_AGENCY" },
  { value: "unicef", label: "UNICEF", shortName: "UNICEF", type: "UN_AGENCY" },
  { value: "unhcr", label: "UN High Commissioner for Refugees (UNHCR)", shortName: "UNHCR", type: "UN_AGENCY" },
  { value: "wfp", label: "World Food Programme (WFP)", shortName: "WFP", type: "UN_AGENCY" },
  { value: "who", label: "World Health Organization (WHO)", shortName: "WHO", type: "UN_AGENCY" },
  { value: "fao", label: "Food and Agriculture Organization (FAO)", shortName: "FAO", type: "UN_AGENCY" },
  { value: "ifad", label: "International Fund for Agricultural Development (IFAD)", shortName: "IFAD", type: "UN_AGENCY" },
  { value: "unops", label: "United Nations Office for Project Services (UNOPS)", shortName: "UNOPS", type: "UN_AGENCY" },
  { value: "unfpa", label: "United Nations Population Fund (UNFPA)", shortName: "UNFPA", type: "UN_AGENCY" },
  { value: "unhabitat", label: "UN-Habitat", shortName: "UN-Habitat", type: "UN_AGENCY" },
  { value: "unwomen", label: "UN Women", shortName: "UN Women", type: "UN_AGENCY" },
  { value: "ilo", label: "International Labour Organization (ILO)", shortName: "ILO", type: "UN_AGENCY" },
  { value: "unodc", label: "UN Office on Drugs and Crime (UNODC)", shortName: "UNODC", type: "UN_AGENCY" },

  // ─── Regional Development Banks ──────────────────────────────────────────
  { value: "afdb", label: "African Development Bank (AfDB)", shortName: "AfDB", type: "MULTILATERAL_BANK", region: "Africa" },
  { value: "adb", label: "Asian Development Bank (ADB)", shortName: "ADB", type: "MULTILATERAL_BANK", region: "Asia" },
  { value: "iadb", label: "Inter-American Development Bank (IDB/IADB)", shortName: "IDB", type: "MULTILATERAL_BANK", region: "Latin America" },
  { value: "ebrd", label: "European Bank for Reconstruction and Development (EBRD)", shortName: "EBRD", type: "MULTILATERAL_BANK", region: "Europe & Central Asia" },
  { value: "eib", label: "European Investment Bank (EIB)", shortName: "EIB", type: "MULTILATERAL_BANK", region: "Europe" },
  { value: "isdb", label: "Islamic Development Bank (IsDB)", shortName: "IsDB", type: "MULTILATERAL_BANK" },
  { value: "aiib", label: "Asian Infrastructure Investment Bank (AIIB)", shortName: "AIIB", type: "MULTILATERAL_BANK", region: "Asia" },

  // ─── Bilateral Agencies ───────────────────────────────────────────────────
  { value: "usaid", label: "U.S. Agency for International Development (USAID)", shortName: "USAID", type: "BILATERAL" },
  { value: "giz", label: "Deutsche Gesellschaft für Internationale Zusammenarbeit (GIZ)", shortName: "GIZ", type: "BILATERAL" },
  { value: "kfw", label: "KfW Development Bank (Germany)", shortName: "KfW", type: "BILATERAL" },
  { value: "dfid-fcdo", label: "Foreign, Commonwealth & Development Office (FCDO/DFID)", shortName: "FCDO", type: "BILATERAL" },
  { value: "bmc", label: "British International Investment (BII)", shortName: "BII", type: "BILATERAL" },
  { value: "afd", label: "Agence Française de Développement (AFD)", shortName: "AFD", type: "BILATERAL" },
  { value: "sida", label: "Swedish International Development Cooperation Agency (Sida)", shortName: "Sida", type: "BILATERAL" },
  { value: "norad", label: "Norwegian Agency for Development Cooperation (Norad)", shortName: "Norad", type: "BILATERAL" },
  { value: "danida", label: "Danish International Development Agency (Danida)", shortName: "Danida", type: "BILATERAL" },
  { value: "finida", label: "Finland Development Cooperation (FinAid)", shortName: "FinAid", type: "BILATERAL" },
  { value: "jica", label: "Japan International Cooperation Agency (JICA)", shortName: "JICA", type: "BILATERAL" },
  { value: "koica", label: "Korea International Cooperation Agency (KOICA)", shortName: "KOICA", type: "BILATERAL" },
  { value: "dfat", label: "Australian Dept. of Foreign Affairs & Trade (DFAT)", shortName: "DFAT", type: "BILATERAL" },
  { value: "mcc", label: "Millennium Challenge Corporation (MCC)", shortName: "MCC", type: "BILATERAL" },
  { value: "cdc-group", label: "CDC Group / British International Investment", shortName: "CDC", type: "BILATERAL" },
  { value: "expertise-france", label: "Expertise France", shortName: "Expertise France", type: "BILATERAL" },
  { value: "enabel", label: "Belgian Development Agency (Enabel)", shortName: "Enabel", type: "BILATERAL" },

  // ─── Private Foundations ─────────────────────────────────────────────────
  { value: "bill-melinda-gates", label: "Bill & Melinda Gates Foundation", shortName: "BMGF", type: "PRIVATE_FOUNDATION" },
  { value: "mastercard-foundation", label: "Mastercard Foundation", shortName: "Mastercard Foundation", type: "PRIVATE_FOUNDATION" },
  { value: "open-society", label: "Open Society Foundations", shortName: "OSF", type: "PRIVATE_FOUNDATION" },
  { value: "agha-khan", label: "Aga Khan Development Network (AKDN)", shortName: "AKDN", type: "PRIVATE_FOUNDATION" },

  // ─── Other ───────────────────────────────────────────────────────────────
  { value: "imf", label: "International Monetary Fund (IMF)", shortName: "IMF", type: "OTHER" },
  { value: "wto", label: "World Trade Organization (WTO)", shortName: "WTO", type: "OTHER" },
  { value: "au", label: "African Union (AU)", shortName: "AU", type: "OTHER" },
  { value: "gfatm", label: "Global Fund (GFATM)", shortName: "Global Fund", type: "OTHER" },
  { value: "gavi", label: "Gavi, the Vaccine Alliance", shortName: "Gavi", type: "OTHER" },
  { value: "other", label: "Other / Multiple Donors", shortName: "Other", type: "OTHER" },
];

export const DONOR_TYPES: Record<DonorType, string> = {
  MULTILATERAL_BANK: "Multilateral Development Bank",
  UN_AGENCY: "UN Agency",
  BILATERAL: "Bilateral Agency",
  EU: "European Union",
  PRIVATE_FOUNDATION: "Private Foundation",
  OTHER: "Other",
};

export function getDonorLabel(value: string): string {
  return DONORS.find((d) => d.value === value)?.shortName ?? value;
}

export function getDonorsByType(type: DonorType): Donor[] {
  return DONORS.filter((d) => d.type === type);
}
