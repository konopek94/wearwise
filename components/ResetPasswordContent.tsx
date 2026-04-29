'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Dictionary } from '../types';
import type { Locale } from '../i18n-config';

export default function ResetPasswordContent({
  dictionary,
  lang,
}: {
  dictionary: Dictionary;
  lang: Locale;
}) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirm) {
      setError(dictionary.login.passwordMismatch);
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage(dictionary.login.passwordUpdated);
      setTimeout(() => {
        window.location.href = `/${lang}/closet`;
      }, 1500);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
      <div className="w-full max-w-md p-10 glass rounded-lg shadow-ambient">
        <h1 className="text-4xl font-bold mb-3 text-on-surface tracking-tight">
          {dictionary.login.resetPasswordTitle}
        </h1>
        <p className="text-primary-design mb-10 text-lg font-light">
          {dictionary.login.resetPasswordSubtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-primary-design">
              {dictionary.login.newPassword}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={dictionary.login.newPasswordPlaceholder}
              className="w-full p-4 rounded-lg bg-surface-low border-none focus:bg-surface-lowest focus:ring-0 shadow-inner text-on-surface outline-none transition-all placeholder:text-surface-highest/60"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-primary-design">
              {dictionary.login.confirmPassword}
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={dictionary.login.confirmPasswordPlaceholder}
              className="w-full p-4 rounded-lg bg-surface-low border-none focus:bg-surface-lowest focus:ring-0 shadow-inner text-on-surface outline-none transition-all placeholder:text-surface-highest/60"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 rounded-lg bg-secondary-design text-white font-bold uppercase tracking-widest text-sm shadow-ambient hover:bg-secondary-design/90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? dictionary.login.sending : dictionary.login.updatePassword}
          </button>
        </form>

        {message && (
          <p className="mt-8 p-4 rounded-lg bg-secondary-design/10 text-secondary-design font-medium text-sm animate-in fade-in slide-in-from-top-2">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-8 p-4 rounded-lg bg-error-design/10 text-error-design font-medium text-sm animate-in fade-in slide-in-from-top-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
