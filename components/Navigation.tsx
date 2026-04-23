"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "./AuthButton";
import LanguageSwitcher from "./LanguageSwitcher";
import { Dictionary } from "../types";
import { Locale } from "../i18n-config";

export default function Navigation({ dictionary, lang }: { dictionary: Dictionary, lang: Locale }) {
  const pathname = usePathname();

  const isHome = pathname === `/${lang}` || pathname === `/${lang}/`;
  const isCloset = pathname.startsWith(`/${lang}/closet`);

  const activeClass = "bg-on-surface text-surface-lowest shadow-sm";
  const inactiveClass = "text-primary-design hover:bg-surface-highest/10";

  return (
    <div className="fixed top-6 right-6 z-50 glass px-6 py-3 rounded-full shadow-ambient flex items-center gap-6">
      <Link 
        href={`/${lang}`}
        className={`px-4 py-1.5 text-[10px] font-black tracking-widest transition-all rounded-full ${
          isHome ? activeClass : inactiveClass
        }`}
      >
        {dictionary.auth.home}
      </Link>
      
      <div className="w-px h-4 bg-surface-highest/30"></div>
      
      <AuthButton dictionary={dictionary.auth} lang={lang} activeStyle={isCloset ? activeClass : inactiveClass} />
      
      <div className="w-px h-4 bg-surface-highest/30"></div>
      
      <LanguageSwitcher />
    </div>
  );
}
