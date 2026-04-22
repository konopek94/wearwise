# Wardrobe Health Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform WearWise into a persistent wardrobe assistant using Supabase for authentication, data storage, and analytics.

**Architecture:** A Next.js App Router frontend connected to a Supabase backend. Magic Link authentication for passwordless entry, a PostgreSQL database to store closet items, and a client-side analytics engine for dashboard visualizations.

**Tech Stack:** Next.js 16, Supabase (Auth + DB), Tailwind CSS v4, Lucide React icons.

---

## File Structure

### New Files
- `lib/supabase.ts`: Supabase client initialization.
- `lib/analytics.ts`: Pure logic for calculating sustainability scores and material ratios.
- `app/[lang]/login/page.tsx`: Magic link login interface.
- `app/[lang]/closet/page.tsx`: Main dashboard server component.
- `components/ClosetDashboard.tsx`: Client component for charts and filtering.
- `components/AnalyticsCards.tsx`: Editorial-style stat cards for top-level metrics.
- `components/SaveToClosetButton.tsx`: Button to push items to Supabase.
- `middleware.ts`: (Modify) Add auth protection for `/closet`.

### Modified Files
- `components/ResultsCard.tsx`: Integrate "Save to Closet" button.
- `components/HomeContent.tsx`: Check for `localStorage` migration on mount.
- `types/index.ts`: Add `ClosetItem` and `AnalyticsResult` types.

---

## Tasks

### Task 1: Supabase Setup & Type Definitions

**Files:**
- Create: `lib/supabase.ts`
- Modify: `types/index.ts`
- Modify: `.env.local` (instruction only)

- [ ] **Step 1: Update type definitions**
```typescript
// types/index.ts
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

- [ ] **Step 2: Initialize Supabase client**
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 3: Commit**
```bash
git add types/index.ts lib/supabase.ts
git commit -m "chore: setup supabase client and wardrobe types"
```

### Task 2: Magic Link Authentication

**Files:**
- Create: `app/[lang]/login/page.tsx`
- Modify: `middleware.ts`

- [ ] **Step 1: Create Login Page**
```tsx
// app/[lang]/login/page.tsx
"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function LoginPage({ params }: { params: { lang: string } }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/closet` }
    });
    setLoading(false);
    if (error) setMessage(error.message);
    else setMessage("Check your email for the magic link!");
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="glass p-12 rounded-lg shadow-ambient max-w-md w-full space-y-8">
        <h1 className="text-4xl font-bold text-on-surface tracking-tight">Sign In</h1>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter your email"
          className="w-full p-4 bg-surface-low rounded-lg border-none focus:bg-surface-lowest transition-all"
          required 
        />
        <button 
          disabled={loading}
          className="w-full py-4 bg-secondary-design text-white font-bold rounded-lg shadow-ambient active:scale-95 transition-all"
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>
        {message && <p className="text-sm text-primary-design italic">{message}</p>}
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Update middleware for auth protection**
```typescript
// middleware.ts
// Add this check inside the middleware function
const { data: { session } } = await supabase.auth.getSession();
if (pathname.includes('/closet') && !session) {
  return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
}
```

- [ ] **Step 3: Commit**
```bash
git add app/[lang]/login/page.tsx middleware.ts
git commit -m "feat: implement magic link authentication"
```

### Task 3: The Analytics Engine

**Files:**
- Create: `lib/analytics.ts`
- Create: `tests/analytics.test.ts`

- [ ] **Step 1: Write failing test for aggregation**
```typescript
// tests/analytics.test.ts
import { calculateAnalytics } from '../lib/analytics';
import { ClosetItem } from '../types';

const mockItems: Partial<ClosetItem>[] = [
  { 
    verdict: 'buy', 
    microplastics_risk: 'low',
    data: { scores: { sustainability: 8 }, materials: [{ name: 'Cotton', percentage: 100 }] } as any 
  },
  { 
    verdict: 'avoid', 
    microplastics_risk: 'high',
    data: { scores: { sustainability: 2 }, materials: [{ name: 'Polyester', percentage: 100 }] } as any 
  }
];

test('calculates correct averages and ratios', () => {
  const result = calculateAnalytics(mockItems as ClosetItem[]);
  expect(result.sustainabilityScore).toBe(5);
  expect(result.naturalPercentage).toBe(50);
});
```

- [ ] **Step 2: Implement Analytics Logic**
```typescript
// lib/analytics.ts
import { ClosetItem, WardrobeAnalytics } from '../types';

export function calculateAnalytics(items: ClosetItem[]): WardrobeAnalytics {
  if (items.length === 0) return { sustainabilityScore: 0, naturalPercentage: 0, syntheticPercentage: 0, riskProfile: { low: 0, medium: 0, high: 0 } };

  const total = items.length;
  let totalSus = 0;
  let totalNatural = 0;
  let risk = { low: 0, medium: 0, high: 0 };

  items.forEach(item => {
    totalSus += item.data.scores.sustainability;
    risk[item.microplastics_risk]++;
    
    const itemNatural = item.data.materials
      .filter(m => ['cotton', 'linen', 'wool', 'silk', 'hemp'].includes(m.name.toLowerCase()))
      .reduce((acc, m) => acc + m.percentage, 0);
    totalNatural += itemNatural;
  });

  return {
    sustainabilityScore: Number((totalSus / total).toFixed(1)),
    naturalPercentage: Math.round(totalNatural / total),
    syntheticPercentage: 100 - Math.round(totalNatural / total),
    riskProfile: {
      low: Math.round((risk.low / total) * 100),
      medium: Math.round((risk.medium / total) * 100),
      high: Math.round((risk.high / total) * 100),
    }
  };
}
```

- [ ] **Step 3: Commit**
```bash
git add lib/analytics.ts tests/analytics.test.ts
git commit -m "feat: add analytics engine for wardrobe health"
```

### Task 4: Closet Page & Migration Logic

**Files:**
- Create: `app/[lang]/closet/page.tsx`
- Create: `components/ClosetDashboard.tsx`
- Create: `components/AnalyticsCards.tsx`
- Create: `components/SaveToClosetButton.tsx`
- Modify: `components/ResultsCard.tsx`
- Modify: `components/HomeContent.tsx`

- [ ] **Step 1: Create SaveToClosetButton component**
```tsx
// components/SaveToClosetButton.tsx
"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { AnalysisResult } from "../types";

export default function SaveToClosetButton({ result }: { result: AnalysisResult }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
       window.location.href = "/login";
       return;
    }
    const { error } = await supabase.from('closet_items').insert({
      user_id: session.user.id,
      product_name: result.product_name,
      brand: result.brand,
      category: result.category,
      verdict: result.verdict,
      microplastics_risk: result.microplastics_risk,
      data: result
    });
    setLoading(false);
    if (!error) setSaved(true);
  };

  return (
    <button 
      onClick={handleSave}
      disabled={saved || loading}
      className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all ${
        saved ? "bg-secondary-design/20 text-secondary-design" : "bg-on-surface text-surface-lowest shadow-ambient active:scale-95"
      }`}
    >
      {loading ? "Saving..." : saved ? "Added to Closet" : "Add to Closet"}
    </button>
  );
}
```

- [ ] **Step 2: Create AnalyticsCards component**
```tsx
// components/AnalyticsCards.tsx
import { WardrobeAnalytics } from "../types";

export default function AnalyticsCards({ analytics }: { analytics: WardrobeAnalytics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      <div className="glass p-8 rounded-lg shadow-ambient">
        <p className="text-xs font-black text-primary-design uppercase tracking-widest mb-2">Sustainability Index</p>
        <p className="text-5xl font-bold text-on-surface">{analytics.sustainabilityScore}/10</p>
      </div>
      <div className="glass p-8 rounded-lg shadow-ambient">
        <p className="text-xs font-black text-primary-design uppercase tracking-widest mb-2">Natural Fibers</p>
        <p className="text-5xl font-bold text-secondary-design">{analytics.naturalPercentage}%</p>
      </div>
      <div className="glass p-8 rounded-lg shadow-ambient">
        <p className="text-xs font-black text-primary-design uppercase tracking-widest mb-2">High Risk Items</p>
        <p className="text-5xl font-bold text-error-design">{analytics.riskProfile.high}%</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create ClosetDashboard component**
```tsx
// components/ClosetDashboard.tsx
"use client";
import { useState, useMemo } from "react";
import { ClosetItem, Dictionary } from "../types";
import { calculateAnalytics } from "../lib/analytics";
import AnalyticsCards from "./AnalyticsCards";
import ResultsCard from "./ResultsCard";

export default function ClosetDashboard({ initialItems, dictionary }: { initialItems: ClosetItem[], dictionary: Dictionary }) {
  const [items] = useState(initialItems);
  const analytics = useMemo(() => calculateAnalytics(items), [items]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-7xl font-bold text-on-surface mb-16 tracking-tighter">Your Closet</h1>
      <AnalyticsCards analytics={analytics} />
      <div className="space-y-12">
        {items.map(item => (
          <ResultsCard key={item.id} result={item.data} dictionary={dictionary.results} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Update ResultsCard to include Save button**
```tsx
// components/ResultsCard.tsx
// Import SaveToClosetButton and add it next to the verdict badge
// ...
<div className="flex flex-col items-end gap-4">
  <div className={`px-8 py-3 rounded-full border-2 font-black uppercase tracking-widest text-sm ${getVerdictStyle(result.verdict)}`}>
    {getVerdictLabel(result.verdict)}
  </div>
  <SaveToClosetButton result={result} />
</div>
// ...
```

- [ ] **Step 5: Implement migration in HomeContent**
```tsx
// components/HomeContent.tsx
useEffect(() => {
  const migrate = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const localHistory = localStorage.getItem("wearwise_history");
    if (session && localHistory) {
      const items = JSON.parse(localHistory);
      await supabase.from('closet_items').insert(
        items.map((item: any) => ({
          user_id: session.user.id,
          product_name: item.product_name,
          brand: item.brand,
          category: item.category,
          verdict: item.verdict,
          microplastics_risk: item.microplastics_risk,
          data: item
        }))
      );
      localStorage.removeItem("wearwise_history");
    }
  };
  migrate();
}, []);
```

- [ ] **Step 6: Create Closet Page**
```tsx
// app/[lang]/closet/page.tsx
import { getDictionary } from "../../../get-dictionary";
import { Locale } from "../../../i18n-config";
import ClosetDashboard from "../../../components/ClosetDashboard";
import { supabase } from "../../../lib/supabase";

export default async function ClosetPage({ params }: { params: { lang: Locale } }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  
  const { data: items } = await supabase
    .from('closet_items')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-surface py-24 px-6">
      <ClosetDashboard initialItems={items || []} dictionary={dictionary} />
    </div>
  );
}
```

- [ ] **Step 7: Commit**
```bash
git add .
git commit -m "feat: implement closet page, components and migration"
```
