# Design Spec: Phase 1 - Wardrobe Health Dashboard ("The Impact Analyst")

## 1. Overview
WearWise is evolving from a session-based analysis tool to a persistent personal wardrobe assistant. Phase 1 introduces user accounts and a "Closet" feature that tracks the environmental impact of a user's collection over time.

## 2. Success Criteria
- Users can sign in securely using Magic Links (passwordless).
- Users can explicitly save analyzed items to their permanent "Closet."
- Existing `localStorage` history is automatically migrated to the database upon first login.
- A new `/closet` dashboard provides aggregated analytics on wardrobe sustainability, durability, and microplastic risk.

## 3. Architecture
- **Backend:** Supabase (PostgreSQL + Auth).
- **Frontend:** Next.js App Router (Server Components for data fetching, Client Components for charts).
- **Data Persistence:** Relational database storage for `AnalysisResult` objects linked to unique user IDs.

### 3.1 Database Schema (Supabase)
#### `profiles`
- `id`: uuid (references auth.users)
- `email`: string
- `preferred_lang`: string (en, pl, de, es)
- `updated_at`: timestamp

#### `closet_items`
- `id`: uuid (primary key)
- `user_id`: uuid (references profiles.id)
- `product_name`: string
- `brand`: string
- `category`: string
- `verdict`: enum (buy, consider, avoid)
- `microplastics_risk`: enum (low, medium, high)
- `data`: jsonb (stores the full `AnalysisResult` object)
- `created_at`: timestamp

## 4. Key Features

### 4.1 Magic Link Authentication
- A clean `/login` page using Supabase Auth.
- Seamless redirection and session management using Next.js middleware.

### 4.2 The Analytics Engine
A utility layer that processes all items in a user's closet to produce:
- **Sustainability Index:** Average `scores.sustainability` across all items.
- **Material Composition:** Total percentages of natural vs. synthetic fibers (aggregated from all `materials` arrays).
- **Risk Profile:** Percentage breakdown of microplastic risk levels.

### 4.3 UI Design ("The Digital Curator")
- **Editorial Stats:** Large, asymmetrical typography for the top-level metrics (e.g., "82% Natural").
- **Glassmorphism Dashboard:** Data visualization cards with backdrop blur and tonal layering.
- **Closet Gallery:** A grid of saved items with filtering by category and verdict.

## 5. Migration Strategy
- On first login, the client checks for `wearwise_history` in `localStorage`.
- If present, it performs a bulk `insert` to the `closet_items` table.
- Clears `localStorage` upon successful migration.

## 6. Testing Plan
- **Auth Flow:** Verify Magic Link generation and session persistence.
- **Data Integrity:** Ensure `localStorage` migration doesn't duplicate items or lose data.
- **Aggregation Logic:** Unit test the Analytics Engine with mock closet data to verify correct percentage calculations.
