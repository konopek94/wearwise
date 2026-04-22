'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Locale } from '../i18n-config';

interface Dictionary {
  login: {
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    sendLink: string;
    sending: string;
    checkEmail: string;
    error: string;
  };
}

export default function LoginContent({
  dictionary,
  lang,
}: {
  dictionary: Dictionary;
  lang: Locale;
}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/${lang}/closet`,
      },
    });

    if (authError) {
      setError(dictionary.login.error);
    } else {
      setMessage(dictionary.login.checkEmail);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[--background]">
      <div className="w-full max-w-md p-8 glass rounded-[--radius-lg] shadow-ambient">
        <h1 className="text-3xl font-sans font-bold mb-2 text-[--color-on-surface]">
          {dictionary.login.title}
        </h1>
        <p className="text-[--color-primary-design] mb-8">
          {dictionary.login.subtitle}
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-sans mb-2 text-[--color-on-surface]">
              {dictionary.login.emailLabel}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={dictionary.login.emailPlaceholder}
              className="w-full p-3 rounded-[--radius-default] bg-[--color-surface-low] border-none focus:ring-2 focus:ring-[--color-secondary-design] text-[--color-on-surface] outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-[--radius-default] bg-[--color-secondary-design] text-white font-sans font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? dictionary.login.sending : dictionary.login.sendLink}
          </button>
        </form>

        {message && (
          <p className="mt-4 p-3 rounded-[--radius-default] bg-[rgba(0,108,73,0.1)] text-[--color-secondary-design] font-sans text-sm">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 p-3 rounded-[--radius-default] bg-[rgba(186,26,26,0.1)] text-[--color-error-design] font-sans text-sm">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
