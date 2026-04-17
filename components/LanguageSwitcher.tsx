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
    en: "EN",
    pl: "PL",
    de: "DE",
    es: "ES",
  };

  return (
    <div className="flex items-center space-x-1">
      {i18n.locales.map((locale) => {
        const isActive = pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`;
        return (
          <Link
            key={locale}
            href={redirectedPathname(locale)}
            className={`px-3 py-1.5 text-[10px] font-black tracking-widest transition-all rounded-full ${
              isActive
                ? "bg-on-surface text-surface-lowest shadow-sm"
                : "text-primary-design hover:bg-surface-highest/10"
            }`}
          >
            {labels[locale]}
          </Link>
        );
      })}
    </div>
  );
}
