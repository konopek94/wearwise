# WearWise: Future Ideas & Roadmap

## Phase 1: Persistence & Analytics (The "Wardrobe Health" Dashboard)
Move from session-based `localStorage` to a persistent database (e.g., Supabase, PostgreSQL) with user authentication.
- **User Accounts:** Allow users to save their "Closet" across devices.
- **Wardrobe Sustainability Index:** Calculate a total score for a user's entire collection.
- **Insights:** Show trends (e.g., "70% of your wardrobe contains microplastics").

## Phase 2: Actionable Intelligence (The "Green Switch")
Transform the app from an analysis tool into a shopping assistant.
- **Better Alternatives:** When an item gets an "Avoid" verdict, the AI suggests similar products from sustainable brands.
- **Second-Hand Integration:** Links to similar items on marketplaces like Vinted or Depop.

## Internationalisation: AI-Assisted Translation Script
When the number of languages grows (6+), replace manual dictionary editing with a generation script.
- **How:** `scripts/generate-translations.ts` uses Gemini to translate `dictionaries/en.json` and `lib/materialNames.ts` into a target locale and writes the output files automatically.
- **Usage:** `npx tsx scripts/generate-translations.ts fr` — adds French in one command.
- **Why:** Currently adding a language means editing 5 files by hand. English stays the single source of truth; the script derives everything else.

## Phase 3: Mobile-First Experience (The "Live Scan")
Enhance the OCR experience for in-store use.
- **Live Camera Stream:** Real-time label scanning with a visual "scanning" overlay.
- **Haptic Feedback:** Vibrations and sound effects when a label is successfully captured.
- **Offline Mode:** Basic material analysis available without an internet connection.
