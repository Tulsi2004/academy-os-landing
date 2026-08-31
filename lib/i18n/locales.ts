export type LocaleCode = "en" | "es" | "pt-BR" | "de" | "ja" | "fr-CA" | "zh-CN" | "ko";

export const DEFAULT_LOCALE: LocaleCode = "en";

export const LOCALES: { code: LocaleCode; label: string; flag: string }[] = [
  { code: "en", label: "English (Global)", flag: "globe" },
  { code: "es", label: "Español", flag: "globe" },
  { code: "pt-BR", label: "Português (Brasil)", flag: "🇧🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "fr-CA", label: "Français (Canada)", flag: "🇨🇦" },
  { code: "zh-CN", label: "简体中文", flag: "🇨🇳" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
];
