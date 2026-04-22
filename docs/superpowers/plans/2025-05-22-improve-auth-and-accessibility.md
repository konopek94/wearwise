# Improve Auth Security, Middleware, and Accessibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transition to `@supabase/ssr` for server-safe authentication in middleware, improve security by using `getUser()`, refine middleware path matching, and enhance accessibility of the login form.

**Architecture:** Replace the singleton `supabase` client with context-aware client creators from `@supabase/ssr`. Update middleware to handle cookies for session persistence.

**Tech Stack:** Next.js 16, `@supabase/ssr`, `@supabase/supabase-js`, TypeScript.

---

### Task 1: Install @supabase/ssr

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

Run: `npm install @supabase/ssr`

- [ ] **Step 2: Verify installation**

Check `package.json` for `@supabase/ssr`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @supabase/ssr"
```

### Task 2: Refactor `lib/supabase.ts`

**Files:**
- Modify: `lib/supabase.ts`

- [ ] **Step 1: Update `lib/supabase.ts` to export client creators**

```typescript
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { type NextRequest, type NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export function createClient() {
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!)
}

export function createServerSupabaseClient(
  request: NextRequest,
  response: NextResponse
) {
  return createServerClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )
}

// Keep the old export for now to avoid breaking things immediately, or update all at once
// Better to update all at once if possible.
```

- [ ] **Step 2: Commit**

```bash
git add lib/supabase.ts
git commit -m "refactor: update supabase client to use @supabase/ssr"
```

### Task 3: Update `middleware.ts`

**Files:**
- Modify: `middleware.ts`

- [ ] **Step 1: Update middleware to use `createServerSupabaseClient` and `getUser()`**

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  // and uses getUser() which is more secure than getSession()
  const { data: { user } } = await supabase.auth.getUser()

  // Handle locale and other logic...
  
  // Refined path check for /closet
  const isClosetPath = i18n.locales.some(locale => 
    pathname === `/${locale}/closet` || pathname.startsWith(`/${locale}/closet/`)
  ) || pathname === '/closet' || pathname.startsWith('/closet/');

  if (isClosetPath && !user) {
    // Redirect to login
  }

  return response
}
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "refactor: update middleware to use @supabase/ssr and secure getUser()"
```

### Task 4: Update `components/LoginContent.tsx`

**Files:**
- Modify: `components/LoginContent.tsx`

- [ ] **Step 1: Update to use `createClient` (browser client)**
- [ ] **Step 2: Add `id` to input and `htmlFor` to label**
- [ ] **Step 3: Add `role="alert"` or `aria-live="polite"` to messages**

- [ ] **Step 4: Commit**

```bash
git add components/LoginContent.tsx
git commit -m "refactor: improve login form accessibility and update supabase client"
```

### Task 5: Final Verification

- [ ] **Step 1: Run linting**
- [ ] **Step 2: Verify build**
