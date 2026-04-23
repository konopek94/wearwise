# Closet vs. History Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the persistence model by distinguishing between a user's curated Wardrobe and their full Scan History, providing localized analytics only for owned items.

**Architecture:** Database schema update to add a `status` column, API refactor to auto-save scans to history, and a tabbed dashboard UI.

**Tech Stack:** Next.js 16, Supabase, Tailwind CSS v4.

---

## File Structure

### New Files
- `app/api/closet/[id]/route.ts`: API handler for updating/deleting items.

### Modified Files
- `app/api/analyze/route.ts`: Implement auto-save to history.
- `components/ClosetDashboard.tsx`: Add tabbed navigation and filtering.
- `components/ResultsCard.tsx`: Update buttons based on item status.
- `types/index.ts`: Update `ClosetItem` type definition.

---

## Tasks

### Task 1: Database Migration & Type Update

**Files:**
- Modify: `types/index.ts`
- SQL (Manual): Update `closet_items` table in Supabase.

- [ ] **Step 1: Update ClosetItem type**
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
  status: "history" | "wardrobe"; // New field
  data: AnalysisResult;
  created_at: string;
}
```

- [ ] **Step 2: Commit type change**
```bash
git add types/index.ts
git commit -m "chore: update ClosetItem type to include status"
```

- [ ] **Step 3: Run SQL Migration in Supabase Dashboard**
```sql
-- Add status column with default
ALTER TABLE closet_items ADD COLUMN status text DEFAULT 'wardrobe' CHECK (status IN ('history', 'wardrobe'));

-- Migrate existing items to 'wardrobe' (assuming they were explicitly saved)
UPDATE closet_items SET status = 'wardrobe' WHERE status IS NULL;
```

### Task 2: API Refactor (Auto-Save & Status Update)

**Files:**
- Modify: `app/api/analyze/route.ts`
- Create: `app/api/closet/[id]/route.ts`

- [ ] **Step 1: Implement auto-save in Analyze route**
```typescript
// app/api/analyze/route.ts
// Inside POST after analyzeProduct:
const supabase = await createServerClientSide();
const { data: { user } } = await supabase.auth.getUser();

if (user) {
  // Basic deduplication check
  const { data: existing } = await supabase
    .from('closet_items')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_name', result.product_name)
    .eq('brand', result.brand)
    .single();

  if (!existing) {
    await supabase.from('closet_items').insert({
      user_id: user.id,
      product_name: result.product_name,
      brand: result.brand,
      category: result.category,
      verdict: result.verdict,
      microplastics_risk: result.microplastics_risk,
      status: 'history', // Auto-saved as history
      data: result
    });
  }
}
```

- [ ] **Step 2: Create Closet Management API**
```typescript
// app/api/closet/[id]/route.ts
import { NextResponse } from "next/server";
import { createServerClientSide } from "../../../../lib/supabase-server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const { status } = await req.json();
  const supabase = await createServerClientSide();
  
  const { error } = await supabase
    .from('closet_items')
    .update({ status })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createServerClientSide();
  
  const { error } = await supabase
    .from('closet_items')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Commit API changes**
```bash
git add app/api/analyze/route.ts app/api/closet/[id]/route.ts
git commit -m "feat: implement auto-save to history and status update API"
```

### Task 3: Tabbed Dashboard UI

**Files:**
- Modify: `components/ClosetDashboard.tsx`

- [ ] **Step 1: Implement Tabs and Local Filtering**
```tsx
// components/ClosetDashboard.tsx
"use client";
import { useState, useMemo } from "react";
// ... imports

export default function ClosetDashboard({ initialItems, dictionary, lang }: ...) {
  const [items, setItems] = useState(initialItems);
  const [activeTab, setActiveTab] = useState<"wardrobe" | "history">("wardrobe");

  const wardrobeItems = useMemo(() => items.filter(i => i.status === "wardrobe"), [items]);
  const historyItems = useMemo(() => items.filter(i => i.status === "history"), [items]);
  
  const displayedItems = activeTab === "wardrobe" ? wardrobeItems : historyItems;
  const analytics = useMemo(() => calculateAnalytics(wardrobeItems), [wardrobeItems]);

  const handleStatusChange = async (id: string, newStatus: "wardrobe" | "history") => {
    // Optimistic UI update
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    await fetch(`/api/closet/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });
  };

  const handleDelete = async (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    await fetch(`/api/closet/${id}`, { method: 'DELETE' });
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* ... Navigation ... */}
      
      <div className="flex gap-8 mb-16 border-b border-surface-highest/10">
        <button 
          onClick={() => setActiveTab("wardrobe")}
          className={`pb-4 text-xl font-bold transition-all ${activeTab === "wardrobe" ? "text-on-surface border-b-2 border-secondary-design" : "text-primary-design opacity-50"}`}
        >
          My Wardrobe ({wardrobeItems.length})
        </button>
        <button 
          onClick={() => setActiveTab("history")}
          className={`pb-4 text-xl font-bold transition-all ${activeTab === "history" ? "text-on-surface border-b-2 border-secondary-design" : "text-primary-design opacity-50"}`}
        >
          Scan History ({historyItems.length})
        </button>
      </div>

      {activeTab === "wardrobe" && <AnalyticsCards analytics={analytics} />}

      <div className="space-y-12">
        {displayedItems.map(item => (
          <ResultsCard 
            key={item.id} 
            result={item.data} 
            dictionary={dictionary.results}
            itemId={item.id}
            status={item.status}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit UI changes**
```bash
git add components/ClosetDashboard.tsx
git commit -m "feat: implement tabbed navigation and item management in closet"
```

### Task 4: Context-Aware ResultsCard

**Files:**
- Modify: `components/ResultsCard.tsx`
- Modify: `components/SaveToClosetButton.tsx` (Remove usage)

- [ ] **Step 1: Update ResultsCard to handle management actions**
```tsx
// components/ResultsCard.tsx
interface ResultsCardProps {
  result: AnalysisResult;
  dictionary: Dictionary["results"];
  itemId?: string; // Optional for home page
  status?: "history" | "wardrobe";
  onStatusChange?: (id: string, status: "history" | "wardrobe") => void;
  onDelete?: (id: string) => void;
}

// Inside component UI:
<div className="flex flex-col items-end gap-4">
  <div className={`px-8 py-3 rounded-full border-2 font-black uppercase tracking-widest text-sm ${getVerdictStyle(result.verdict)}`}>
    {getVerdictLabel(result.verdict)}
  </div>
  
  {itemId && (
    <div className="flex gap-3">
       {status === "history" ? (
         <button 
           onClick={() => onStatusChange?.(itemId, "wardrobe")}
           className="px-6 py-2 bg-on-surface text-surface-lowest rounded-full text-xs font-bold uppercase"
         >
           Add to Wardrobe
         </button>
       ) : (
         <button 
           onClick={() => onStatusChange?.(itemId, "history")}
           className="px-6 py-2 bg-surface-highest text-primary-design rounded-full text-xs font-bold uppercase"
         >
           Remove from Wardrobe
         </button>
       )}
       <button 
         onClick={() => onDelete?.(itemId)}
         className="p-2 text-error-design opacity-50 hover:opacity-100 transition-opacity"
       >
         <TrashIcon size={16} />
       </button>
    </div>
  )}
</div>
```

- [ ] **Step 2: Commit final UI refinement**
```bash
git add components/ResultsCard.tsx
git commit -m "feat: make ResultsCard context-aware for closet management"
```
