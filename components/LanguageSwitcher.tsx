"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { i18n } from "../i18n-config";

export default function LanguageSwitcher() {
  const pathname = usePathname();

  const redirectedPathname = (locale: string) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const labels: Record<string, string> = {
    en: "English",
    pl: "Polski",
    de: "Deutsch",
    es: "Español",
  };

  return (
    <div className="flex space-x-2">
      {i18n.locales.map((locale) => {
        const isActive = pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`;
        return (
          <Link
            key={locale}
            href={redirectedPathname(locale)}
            className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
              isActive
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {labels[locale]}
          </Link>
        );
      })}
    </div>
  );
}
