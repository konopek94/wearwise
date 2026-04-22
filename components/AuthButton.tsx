"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { Dictionary } from "../types";
import { Locale } from "../i18n-config";

export default function AuthButton({ dictionary, lang }: { dictionary: Dictionary["auth"], lang: Locale }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = `/${lang}`;
  };

  if (loading) return <div className="w-8 h-8 bg-surface-low rounded-full animate-pulse"></div>;

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link 
          href={`/${lang}/closet`}
          className="px-4 py-1.5 text-[10px] font-black tracking-widest transition-all rounded-full bg-secondary-design/10 text-secondary-design hover:bg-secondary-design/20"
        >
          {dictionary.closet}
        </Link>
        <button 
          onClick={handleLogout}
          className="px-4 py-1.5 text-[10px] font-black tracking-widest transition-all rounded-full text-primary-design hover:bg-surface-highest/10"
        >
          {dictionary.logout}
        </button>
      </div>
    );
  }

  return (
    <Link 
      href={`/${lang}/login`}
      className="px-4 py-1.5 text-[10px] font-black tracking-widest transition-all rounded-full bg-on-surface text-surface-lowest shadow-sm active:scale-95"
    >
      {dictionary.login}
    </Link>
  );
}
