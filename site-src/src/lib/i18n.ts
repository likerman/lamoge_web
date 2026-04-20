import siteEs from "../content/es/site.json";
import siteEn from "../content/en/site.json";

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export const siteContent = {
  es: siteEs,
  en: siteEn
};

export function localizeText(value: string | Record<string, string>, locale: Locale) {
  if (typeof value === "string") {
    return value;
  }

  return value[locale] ?? value.es ?? Object.values(value)[0] ?? "";
}

export function localizeArray(value: string[] | Record<string, string[]>, locale: Locale) {
  if (Array.isArray(value)) {
    return value;
  }

  return value[locale] ?? value.es ?? Object.values(value)[0] ?? [];
}
