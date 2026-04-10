// ─── Languages ────────────────────────────────────────────────────────────────
// Common languages in international development contexts.
// ─────────────────────────────────────────────────────────────────────────────

export interface Language {
  code: string; // ISO 639-1
  name: string;
  nativeName: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "zh", name: "Chinese (Mandarin)", nativeName: "中文" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
  { code: "ha", name: "Hausa", nativeName: "Hausa" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ" },
  { code: "so", name: "Somali", nativeName: "Soomaali" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "th", name: "Thai", nativeName: "ภาษาไทย" },
  { code: "km", name: "Khmer", nativeName: "ភាសាខ្មែរ" },
  { code: "my", name: "Burmese", nativeName: "မြန်မာဘာသာ" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "tg", name: "Tajik", nativeName: "Тоҷикӣ" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "ro", name: "Romanian", nativeName: "Română" },
  { code: "sq", name: "Albanian", nativeName: "Shqip" },
  { code: "sr", name: "Serbian", nativeName: "Српски" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "fa", name: "Persian / Dari", nativeName: "فارسی / دری" },
  { code: "ps", name: "Pashto", nativeName: "پښتو" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල" },
];

export const LANGUAGE_PROFICIENCY_LEVELS = [
  { value: "Native", label: "Native / Bilingual" },
  { value: "Fluent", label: "Full Professional Proficiency" },
  { value: "Professional", label: "Professional Working Proficiency" },
  { value: "Basic", label: "Elementary Proficiency" },
] as const;

export type LanguageProficiency =
  (typeof LANGUAGE_PROFICIENCY_LEVELS)[number]["value"];

export function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find((l) => l.code === code);
}
