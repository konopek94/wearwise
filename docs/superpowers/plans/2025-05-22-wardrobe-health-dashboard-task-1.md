# Wardrobe Health Dashboard Task 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Supabase setup and type definitions for wardrobe persistence and analytics.

**Architecture:** Use `@supabase/supabase-js` to create a singleton client. Define `ClosetItem` and `WardrobeAnalytics` types to represent closet items and aggregate analytics data.

**Tech Stack:** Supabase JS SDK, TypeScript.

---

### Task 1.1: Install Supabase Client

- [ ] **Step 1: Install @supabase/supabase-js**

Run: `npm install @supabase/supabase-js`

- [ ] **Step 2: Commit installation**

```bash
git add package.json package-lock.json
git commit -m "chore: install @supabase/supabase-js"
```

### Task 1.2: Define ClosetItem and WardrobeAnalytics types

**Files:**
- Modify: `types/index.ts`

- [ ] **Step 1: Write the type definitions in types/index.ts**

```typescript
// ... existing types ...

export interface ClosetItem {
  id: string;
  user_id: string;
  product_name: string;
  brand: string;
  category: string;
  verdict: "buy" | "consider" | "avoid";
  microplastics_risk: "low" | "medium" | "high";
  data: AnalysisResult;
  created_at: string;
}

export interface WardrobeAnalytics {
  sustainabilityScore: number;
  naturalPercentage: number;
  syntheticPercentage: number;
  riskProfile: {
    low: number;
    medium: number;
    high: number;
  };
}
```

- [ ] **Step 2: Verify types with tsc**

Run: `npx tsc --noEmit`
Expected: SUCCESS

- [ ] **Step 3: Commit type updates**

```bash
git add types/index.ts
git commit -m "feat: add closet and analytics types"
```

### Task 1.3: Initialize Supabase Client

**Files:**
- Create: `lib/supabase.ts`

- [ ] **Step 1: Write the failing test (Verify environment variables are checked)**

(Since it's a client initialization with environment variables, I'll write a small script to verify the export exists and uses variables.)

- [ ] **Step 2: Implement lib/supabase.ts**

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 3: Verify with tsc**

Run: `npx tsc --noEmit`
Expected: SUCCESS

- [ ] **Step 4: Commit Supabase client initialization**

```bash
git add lib/supabase.ts
git commit -m "feat: initialize supabase client"
```

### Task 1.4: Finalize Task 1

- [ ] **Step 1: Run lint and final type check**

Run: `npm run lint && npx tsc --noEmit`

- [ ] **Step 2: Final commit for Task 1 completion**

```bash
git commit --allow-empty -m "chore: finalize task 1"
```
