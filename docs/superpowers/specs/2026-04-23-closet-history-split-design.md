# Design Spec: Closet vs. History Split ("The Curated Wardrobe")

## 1. Overview
This design refines the persistence model of WearWise by distinguishing between a user's actual **Wardrobe** (curated items they own) and their **Scan History** (all analyzed items). This allows for accurate sustainability analytics based only on owned garments.

## 2. Success Criteria
- The `/closet` page features a tabbed interface to toggle between "My Wardrobe" and "Scan History."
- The Analytics Dashboard only calculates and displays metrics for items in the "My Wardrobe" tab.
- All new analyses via the home page are automatically saved to "Scan History."
- Users can move items between "Scan History" and "My Wardrobe" with a single click.

## 3. Architecture & Data Changes

### 3.1 Database Updates (Supabase)
- **Table:** `closet_items`
- **New Column:** `status` (text, default: 'history', check constraint: ['history', 'wardrobe'])
- **Migration:** Existing items in the table will be migrated to `status: 'wardrobe'` (assuming they were explicitly saved).

### 3.2 API Updates
- **`POST /api/analyze`**: 
    - Automatically checks for user session.
    - If logged in, inserts the result into `closet_items` with `status: 'history'`.
    - Implements basic deduplication (checking `user_id`, `product_name`, and `brand`).
- **`PATCH /api/closet/[id]`**: 
    - New endpoint to update the `status` of an item.
- **`DELETE /api/closet/[id]`**:
    - Standard endpoint to remove an item entirely from persistence.

## 4. UI Components

### 4.1 Closet Toggle Bar
A glassmorphism toggle at the top of `/closet`:
- **My Wardrobe (Count):** Active state shows Analytics Cards + Item Grid.
- **Scan History (Count):** Active state shows simple list of all scans.

### 4.2 Dynamic Action Buttons
- **In "Scan History":** Items show an "Add to Wardrobe" button.
- **In "My Wardrobe":** Items show a "Remove from Wardrobe" (moves to history) or "Delete" option.
- **On Home Page:** Search results show "Add to Wardrobe" (instantly promotes from history).

## 5. Implementation Strategy
- **Refactor `ClosetDashboard`**: Convert to a stateful client component managing the active tab and filtering logic.
- **Update `ResultsCard`**: Support context-aware actions (Add, Remove, Move).
- **Backend Refactor**: Shift the "Save" responsibility from a manual button click to an automatic API-level event for history.

## 6. Testing Plan
- **Verification:** Ensure a new scan appears in the "Scan History" tab but does NOT affect the sustainability score until moved to "My Wardrobe."
- **Deduplication:** Verify that scanning the same item twice does not create duplicate rows in "Scan History."
- **Status Change:** Verify the `PATCH` request correctly updates the UI without requiring a full page refresh (optimistic UI update).
