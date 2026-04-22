# Supabase Environment Variable Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add explicit environment variable validation in `lib/supabase.ts` and throw descriptive errors if they are missing.

**Architecture:** Add guard clauses at the top of the file to check for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

**Tech Stack:** TypeScript, Supabase JS Client.

---

### Task 1: Verification Script

**Files:**
- Create: `tests/verify-supabase-env.ts`

- [ ] **Step 1: Write verification script**
Create a script that attempts to import `supabase.ts` and catches the expected error.

```typescript
import { execSync } from 'child_process';

try {
  // Try to run a script that imports supabase.ts with env vars cleared
  execSync('env -u NEXT_PUBLIC_SUPABASE_URL -u NEXT_PUBLIC_SUPABASE_ANON_KEY npx ts-node -e "import \'./lib/supabase\'"', { stdio: 'pipe' });
  console.error('Verification failed: supabase.ts did not throw an error when env vars were missing');
  process.exit(1);
} catch (error: any) {
  const output = error.stderr.toString();
  if (output.includes('Missing environment variable')) {
    console.log('Verification passed: supabase.ts threw the correct error');
  } else {
    console.error('Verification failed: supabase.ts threw an unexpected error:', output);
    process.exit(1);
  }
}
```

- [ ] **Step 2: Run verification script (expected to fail)**
Run: `npx ts-node tests/verify-supabase-env.ts`
Expected: FAIL (because current implementation doesn't throw "Missing environment variable")

### Task 2: Implement Validation

**Files:**
- Modify: `lib/supabase.ts`

- [ ] **Step 1: Add explicit checks**

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 2: Run verification script (expected to pass)**
Run: `npx ts-node tests/verify-supabase-env.ts`
Expected: PASS

### Task 3: Cleanup and Commit

- [ ] **Step 1: Remove verification script**
Run: `rm tests/verify-supabase-env.ts`

- [ ] **Step 2: Commit changes**
Run: `git add lib/supabase.ts && git commit -m "refactor: add environment variable validation in supabase client"`
