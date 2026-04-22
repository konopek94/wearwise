# Design Doc: Supabase Environment Variable Validation

**Date:** 2024-05-24
**Topic:** Validation of Supabase environment variables in `lib/supabase.ts`

## Problem
The current implementation of `lib/supabase.ts` uses non-null assertion operators (`!`) for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. If these environment variables are missing, the application might fail later with confusing errors or attempt to initialize the Supabase client with undefined values.

## Proposed Solution
Add explicit checks for both environment variables at the module level. If either is missing, throw a descriptive `Error`.

## Architecture
- **Location:** `lib/supabase.ts`
- **Validation:** Check `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Error Message:** `Missing environment variable: NEXT_PUBLIC_SUPABASE_URL` or `Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Testing Strategy
- Create a test script or use an existing test runner to verify that `lib/supabase.ts` throws an error when environment variables are not set.
- Since this is a module-level check, we can test it by clearing the env vars and importing the module.

## Success Criteria
- [ ] Non-null assertions are removed.
- [ ] Explicit `if` checks are added.
- [ ] Descriptive errors are thrown.
- [ ] The Supabase client is initialized only if variables are present.
