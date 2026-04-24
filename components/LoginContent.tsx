'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Dictionary } from '../types';
import type { Locale } from '../i18n-config';

type AuthMode = 'magic' | 'password';

export default function LoginContent({
  dictionary,
  lang,
}: {
  dictionary: Dictionary;
  lang: Locale;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>('magic');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback?lang=${lang}&next=/closet`,
      },
    });

    if (authError) {
      setError(dictionary.login.error);
    } else {
      setMessage(dictionary.login.checkEmail);
    }
    setLoading(false);
  };

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (isSignUp) {
      // Sign up
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback?lang=${lang}&next=/closet`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        setMessage(dictionary.login.checkEmail);
      }
    } else {
      // Sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        // Redirect to closet on successful login
        window.location.href = `/${lang}/closet`;
      }
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (authMode === 'magic') {
      handleMagicLinkLogin(e);
    } else {
      handlePasswordAuth(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
      <div className="w-full max-w-md p-10 glass rounded-lg shadow-ambient">
        <h1 className="text-4xl font-bold mb-3 text-on-surface tracking-tight">
          {dictionary.login.title}
        </h1>
        <p className="text-primary-design mb-10 text-lg font-light">
          {dictionary.login.subtitle}
        </p>

        {/* Auth Mode Toggle */}
        <div className="flex gap-2 mb-8 p-1 bg-surface-low rounded-lg">
          <button
            type="button"
            onClick={() => setAuthMode('magic')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              authMode === 'magic'
                ? 'bg-surface-lowest text-on-surface shadow-sm'
                : 'text-primary-design hover:text-on-surface'
            }`}
          >
            {dictionary.login.magicLink}
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('password')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              authMode === 'password'
                ? 'bg-surface-lowest text-on-surface shadow-sm'
                : 'text-primary-design hover:text-on-surface'
            }`}
          >
            {dictionary.login.password}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-primary-design">
              {dictionary.login.emailLabel}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={dictionary.login.emailPlaceholder}
              className="w-full p-4 rounded-lg bg-surface-low border-none focus:bg-surface-lowest focus:ring-0 shadow-inner text-on-surface outline-none transition-all placeholder:text-surface-highest/60"
              required
            />
          </div>

          {authMode === 'password' && (
            <div className="space-y-3">
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-primary-design">
                {dictionary.login.passwordLabel}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={dictionary.login.passwordPlaceholder}
                className="w-full p-4 rounded-lg bg-surface-low border-none focus:bg-surface-lowest focus:ring-0 shadow-inner text-on-surface outline-none transition-all placeholder:text-surface-highest/60"
                required
                minLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 rounded-lg bg-secondary-design text-white font-bold uppercase tracking-widest text-sm shadow-ambient hover:bg-secondary-design/90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading
              ? dictionary.login.sending
              : isSignUp
              ? dictionary.login.signUp
              : authMode === 'magic'
              ? dictionary.login.sendLink
              : dictionary.login.signIn}
          </button>
        </form>

        {authMode === 'password' && (
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="mt-6 w-full text-sm text-primary-design hover:text-on-surface transition-colors"
          >
            {isSignUp
              ? dictionary.login.alreadyHaveAccount
              : dictionary.login.noAccount}
          </button>
        )}

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
