# AI Agent Instructions

This file contains everything an AI assistant needs to work effectively on this codebase.

---

## What This Project Is

WearWise is a Next.js web app that analyzes clothing labels for sustainability, durability, and comfort using Google Gemini AI. Users paste or photograph a fabric composition label (e.g. "60% Polyester, 40% Cotton") and receive scores, a microplastics risk rating, and a Buy / Consider / Avoid verdict. Logged-in users get a persistent closet with wardrobe analytics.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5, React 19 |
| Styling | Tailwind CSS v4 |
| Database + Auth | Supabase (PostgreSQL + Auth) |
| AI | Google Gemini 2.5 Flash via `@google/genai` |
| OCR | Tesseract.js (client-side) |
| Cache (Top 10) | Upstash Redis |
| i18n | Custom — `@formatjs/intl-localematcher` + JSON dictionaries |

---

## Commands

```bash
npm run dev      # start dev server on :3000
npm run build    # production build
npm run lint     # eslint
```

No test runner is wired into `npm test` yet; vitest is installed as a dev dependency.

---

## Project Structure

```
app/
  [lang]/                    # all pages are locale-scoped
    page.tsx                 # home — scan input
    layout.tsx
    login/page.tsx
    reset-password/page.tsx
    closet/page.tsx          # protected — redirects to login if unauthenticated
  api/
    analyze/route.ts         # POST — calls Gemini, auto-saves to history
    auth/callback/route.ts   # GET — exchanges Supabase PKCE code for session
    closet/route.ts          # DELETE ?status= — bulk clear by tab
    closet/[id]/route.ts     # PATCH (status) / DELETE (single item)
    top10/route.ts           # GET — cached top 10 from Redis

components/
  HomeContent.tsx            # main scan page client component
  LoginContent.tsx           # magic link + password auth, forgot password
  ResetPasswordContent.tsx   # post-reset-link password update form
  ClosetDashboard.tsx        # tabbed wardrobe/history UI with analytics
  ResultsCard.tsx            # renders a single analysis result
  SaveToClosetButton.tsx     # checks history → promotes or inserts as wardrobe
  ConfirmDialog.tsx          # reusable destructive-action modal
  AnalyticsCards.tsx         # sustainability index, natural fiber %, high risk %
  HistoryList.tsx            # localStorage recent searches (logged-out)
  Top10List.tsx              # global top 10 from Redis
  Navigation.tsx
  InputForm.tsx
  LanguageSwitcher.tsx
  AuthButton.tsx

lib/
  google-ai.ts               # Gemini prompt + structured output schema
  analytics.ts               # pure functions — calculateAnalytics(items)
  materialNames.ts           # material name translations (see i18n section)
  store.ts                   # Upstash Redis top-10 logic
  supabase.ts                # client-side Supabase client
  supabase-server.ts         # server-side Supabase client (SSR cookies)

types/index.ts               # AnalysisResult, ClosetItem, Dictionary, etc.
dictionaries/                # en.json, pl.json, de.json, es.json
i18n-config.ts               # locales: ["en", "pl", "de", "es"]
proxy.ts                     # middleware: locale redirect + /closet auth guard
```

---

## i18n Pattern

All pages live under `app/[lang]/`. Every user-facing string comes from `getDictionary(lang)` which imports the matching JSON from `dictionaries/`.

**Adding a string:**
1. Add to all 4 JSON files (`en`, `pl`, `de`, `es`)
2. Add to the `Dictionary` interface in `types/index.ts`
3. Use via `dictionary.section.key` in components

**Material names** are a special case. The AI always returns English-normalized names (e.g. `"cotton"`, `"recycled polyester"`) because `lib/analytics.ts` depends on those English keys for natural-fiber detection. Translations happen client-side via `getMaterialName(name, lang)` from `lib/materialNames.ts`. **Never ask Gemini to translate material names** — it breaks analytics.

**Future:** When languages exceed 6, see `IDEAS.md` for the Gemini-powered generation script approach.

---

## Supabase

### Table: `closet_items`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| product_name | text | |
| brand | text | |
| category | text | |
| verdict | text | `"buy"` \| `"consider"` \| `"avoid"` |
| microplastics_risk | text | `"low"` \| `"medium"` \| `"high"` |
| status | text | `"history"` \| `"wardrobe"` — **required, was added via migration** |
| data | jsonb | full `AnalysisResult` object |
| created_at | timestamptz | |

**RLS must allow users to select/insert/update/delete their own rows** (`user_id = auth.uid()`).

### Auth flow

- Magic link and email/password both supported
- PKCE flow — `api/auth/callback` exchanges the `?code=` param for a session
- Password reset: `resetPasswordForEmail` → callback with `next=/reset-password` → `ResetPasswordContent` calls `supabase.auth.updateUser({ password })`
- `/closet` is protected by `proxy.ts` using `supabase.auth.getUser()` (not `getSession`)
- Redirect URLs in Supabase dashboard must include `http://localhost:3000/**` (dev) and the production domain

### Local dev

- Email confirmation is **disabled** in the Supabase dashboard for local dev (re-enable for production)
- Use Sign Up then Sign In with email/password — magic links require the redirect URL allowlist

---

## AI Integration

`lib/google-ai.ts` — `analyzeProduct(text, lang)`:
- Uses structured output (`responseSchema`) so the response is always valid JSON matching `AnalysisResult`
- `summary`, `product_name`, `brand`, `category` are returned in the target language
- `verdict` and `microplastics_risk` stay as English enum values
- `materials[].name` stays in English (analytics dependency — see i18n section)
- Temperature 0.2 for deterministic scoring

---

## Key Conventions

- **TypeScript everywhere** — no `.js` files in `app/`, `components/`, `lib/`
- **Immutability** — never mutate state in place; use spread / `.map` / `.filter`
- **No `console.log`** in production code
- **API routes validate auth** with `supabase.auth.getUser()` and check `user_id` on every mutation
- **Optimistic UI** in `ClosetDashboard` — update state immediately, revert on API error
- **No native browser dialogs** (`alert`, `confirm`, `prompt`) — use `ConfirmDialog` component
- **Conventional commits** — `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
- **Dictionary keys must be added to all 4 language files** and `types/index.ts` together

---

## Environment Variables

```env
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
UPSTASH_REDIS_REST_URL=        # optional — Top 10 feature degrades gracefully
UPSTASH_REDIS_REST_TOKEN=      # optional
```
