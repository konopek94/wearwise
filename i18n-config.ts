export const i18n = {
  defaultLocale: "en",
  locales: ["en", "pl", "de", "es"],
} as const;

export type Locale = (typeof i18n)["locales"][number];
