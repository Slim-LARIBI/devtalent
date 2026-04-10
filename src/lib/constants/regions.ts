// ─── Regions & Countries ──────────────────────────────────────────────────────
// Geographic reference data for mission classification.
// ─────────────────────────────────────────────────────────────────────────────

export interface Region {
  value: string;
  label: string;
}

export const REGIONS: Region[] = [
  { value: "sub-saharan-africa", label: "Sub-Saharan Africa" },
  { value: "north-africa-middle-east", label: "North Africa & Middle East (MENA)" },
  { value: "east-africa", label: "East Africa" },
  { value: "west-africa", label: "West Africa" },
  { value: "central-africa", label: "Central Africa" },
  { value: "southern-africa", label: "Southern Africa" },
  { value: "south-asia", label: "South Asia" },
  { value: "east-asia-pacific", label: "East Asia & Pacific" },
  { value: "southeast-asia", label: "Southeast Asia" },
  { value: "central-asia", label: "Central Asia" },
  { value: "europe-central-asia", label: "Europe & Central Asia" },
  { value: "eastern-europe", label: "Eastern Europe" },
  { value: "western-balkans", label: "Western Balkans" },
  { value: "latin-america-caribbean", label: "Latin America & Caribbean" },
  { value: "caribbean", label: "Caribbean" },
  { value: "pacific-islands", label: "Pacific Islands" },
  { value: "global", label: "Global / Multi-country" },
];

// Common countries for international development work
export interface Country {
  code: string;  // ISO 3166-1 alpha-2
  name: string;
  region: string;
}

export const DEVELOPMENT_COUNTRIES: Country[] = [
  // Sub-Saharan Africa
  { code: "NG", name: "Nigeria", region: "sub-saharan-africa" },
  { code: "ET", name: "Ethiopia", region: "sub-saharan-africa" },
  { code: "KE", name: "Kenya", region: "sub-saharan-africa" },
  { code: "GH", name: "Ghana", region: "sub-saharan-africa" },
  { code: "TZ", name: "Tanzania", region: "sub-saharan-africa" },
  { code: "UG", name: "Uganda", region: "sub-saharan-africa" },
  { code: "SN", name: "Senegal", region: "sub-saharan-africa" },
  { code: "ML", name: "Mali", region: "sub-saharan-africa" },
  { code: "BF", name: "Burkina Faso", region: "sub-saharan-africa" },
  { code: "NE", name: "Niger", region: "sub-saharan-africa" },
  { code: "TD", name: "Chad", region: "sub-saharan-africa" },
  { code: "SO", name: "Somalia", region: "sub-saharan-africa" },
  { code: "SS", name: "South Sudan", region: "sub-saharan-africa" },
  { code: "SD", name: "Sudan", region: "sub-saharan-africa" },
  { code: "CD", name: "DRC (Congo)", region: "sub-saharan-africa" },
  { code: "MZ", name: "Mozambique", region: "sub-saharan-africa" },
  { code: "MG", name: "Madagascar", region: "sub-saharan-africa" },
  { code: "ZW", name: "Zimbabwe", region: "sub-saharan-africa" },
  { code: "ZM", name: "Zambia", region: "sub-saharan-africa" },
  { code: "RW", name: "Rwanda", region: "sub-saharan-africa" },
  { code: "BI", name: "Burundi", region: "sub-saharan-africa" },
  { code: "MW", name: "Malawi", region: "sub-saharan-africa" },
  { code: "CM", name: "Cameroon", region: "sub-saharan-africa" },
  { code: "CI", name: "Côte d'Ivoire", region: "sub-saharan-africa" },
  { code: "GN", name: "Guinea", region: "sub-saharan-africa" },
  { code: "SL", name: "Sierra Leone", region: "sub-saharan-africa" },
  { code: "LR", name: "Liberia", region: "sub-saharan-africa" },

  // MENA
  { code: "TN", name: "Tunisia", region: "north-africa-middle-east" },
  { code: "MA", name: "Morocco", region: "north-africa-middle-east" },
  { code: "DZ", name: "Algeria", region: "north-africa-middle-east" },
  { code: "EG", name: "Egypt", region: "north-africa-middle-east" },
  { code: "LY", name: "Libya", region: "north-africa-middle-east" },
  { code: "JO", name: "Jordan", region: "north-africa-middle-east" },
  { code: "LB", name: "Lebanon", region: "north-africa-middle-east" },
  { code: "IQ", name: "Iraq", region: "north-africa-middle-east" },
  { code: "YE", name: "Yemen", region: "north-africa-middle-east" },
  { code: "PS", name: "Palestine", region: "north-africa-middle-east" },
  { code: "SY", name: "Syria", region: "north-africa-middle-east" },

  // South Asia
  { code: "AF", name: "Afghanistan", region: "south-asia" },
  { code: "BD", name: "Bangladesh", region: "south-asia" },
  { code: "NP", name: "Nepal", region: "south-asia" },
  { code: "PK", name: "Pakistan", region: "south-asia" },
  { code: "MM", name: "Myanmar", region: "south-asia" },
  { code: "LK", name: "Sri Lanka", region: "south-asia" },
  { code: "IN", name: "India", region: "south-asia" },

  // Southeast Asia
  { code: "KH", name: "Cambodia", region: "southeast-asia" },
  { code: "LA", name: "Laos", region: "southeast-asia" },
  { code: "VN", name: "Vietnam", region: "southeast-asia" },
  { code: "PH", name: "Philippines", region: "southeast-asia" },
  { code: "ID", name: "Indonesia", region: "southeast-asia" },
  { code: "TL", name: "Timor-Leste", region: "southeast-asia" },

  // Central Asia
  { code: "TJ", name: "Tajikistan", region: "central-asia" },
  { code: "KG", name: "Kyrgyzstan", region: "central-asia" },
  { code: "UZ", name: "Uzbekistan", region: "central-asia" },
  { code: "KZ", name: "Kazakhstan", region: "central-asia" },
  { code: "TM", name: "Turkmenistan", region: "central-asia" },

  // Eastern Europe / Balkans
  { code: "UA", name: "Ukraine", region: "eastern-europe" },
  { code: "MD", name: "Moldova", region: "eastern-europe" },
  { code: "GE", name: "Georgia", region: "eastern-europe" },
  { code: "AM", name: "Armenia", region: "eastern-europe" },
  { code: "AZ", name: "Azerbaijan", region: "eastern-europe" },
  { code: "BA", name: "Bosnia and Herzegovina", region: "western-balkans" },
  { code: "MK", name: "North Macedonia", region: "western-balkans" },
  { code: "AL", name: "Albania", region: "western-balkans" },
  { code: "XK", name: "Kosovo", region: "western-balkans" },
  { code: "RS", name: "Serbia", region: "western-balkans" },
  { code: "ME", name: "Montenegro", region: "western-balkans" },

  // Latin America
  { code: "HT", name: "Haiti", region: "latin-america-caribbean" },
  { code: "HN", name: "Honduras", region: "latin-america-caribbean" },
  { code: "GT", name: "Guatemala", region: "latin-america-caribbean" },
  { code: "SV", name: "El Salvador", region: "latin-america-caribbean" },
  { code: "BO", name: "Bolivia", region: "latin-america-caribbean" },
  { code: "CO", name: "Colombia", region: "latin-america-caribbean" },
  { code: "VE", name: "Venezuela", region: "latin-america-caribbean" },
  { code: "PE", name: "Peru", region: "latin-america-caribbean" },
  { code: "EC", name: "Ecuador", region: "latin-america-caribbean" },
  { code: "PY", name: "Paraguay", region: "latin-america-caribbean" },
  { code: "NI", name: "Nicaragua", region: "latin-america-caribbean" },

  // Pacific
  { code: "PG", name: "Papua New Guinea", region: "pacific-islands" },
  { code: "VU", name: "Vanuatu", region: "pacific-islands" },
  { code: "SB", name: "Solomon Islands", region: "pacific-islands" },
];

export function getCountriesByRegion(region: string): Country[] {
  return DEVELOPMENT_COUNTRIES.filter((c) => c.region === region);
}

export function getCountryName(code: string): string {
  return DEVELOPMENT_COUNTRIES.find((c) => c.code === code)?.name ?? code;
}

export function getRegionLabel(value: string): string {
  return REGIONS.find((r) => r.value === value)?.label ?? value;
}
