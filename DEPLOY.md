# Who Paid? — from prototype to the App Store

This repo now contains a **real, deployable app**, not just the design export.

```
web/        → the React web app (deploy this today for a shareable link)
supabase/   → schema.sql for real cross-device sync
project/    → the original Claude Design prototype (reference only)
```

## Phase 0 — Get a live link today ✅ (built)

`web/` is a production React app. Deploy it (Vercel/Netlify/GitHub Pages — see
`web/README.md`) to get an `https://` URL you can text to anyone. On iPhone they
open it in Safari and **Share → Add to Home Screen** to install it like an app —
full-screen, its own icon, no App Store needed. Great for first testing.

## Phase 1 — Real sync ✅ (built, needs your Supabase keys)

The web app already speaks to Supabase when `VITE_SUPABASE_URL` /
`VITE_SUPABASE_ANON_KEY` are set. Create a free Supabase project, run
`supabase/schema.sql`, paste the keys into your host's env vars, redeploy.
Now tables sync live across phones and the Invite button shares a working link.

## Phase 2 — The native iPhone app (Expo / React Native)

We chose **Expo** because the logic above ports almost directly, and Expo's
cloud build service (EAS) lets you build and ship to the App Store **without a
Mac**.

What carries over unchanged: the data model (`web/src/lib/types.ts`), the store
+ sync logic (`store.ts`, `useTables.ts`), the Supabase client, and all screen
structure/styling decisions. What changes: DOM → React Native views, the coin's
`requestAnimationFrame` loop → `react-native-reanimated`, `<img>`/file input →
`expo-image-picker`, the invite link → `expo-linking` deep links + native share.

Scaffold:
```bash
npm create expo-app@latest mobile -- --template blank-typescript
cd mobile
npx expo install react-native-reanimated expo-image-picker expo-linking \
  @supabase/supabase-js @react-native-async-storage/async-storage
```
Then port screen-by-screen (Start → Table → EditSheet). Run on your phone with
the **Expo Go** app via `npx expo start` while developing.

## Phase 3 — Ship to the App Store

Prerequisites (these need **you**, not code):
1. **Apple Developer Program** — enroll at developer.apple.com ($99/year).
2. App identity: bundle id (e.g. `org.socialincome.whopaid`), app icon (1024px),
   2–3 screenshots, a short description, and a **privacy policy URL** (required;
   the camera/photo permission must be declared).

Build & submit from the cloud (no Mac):
```bash
npm i -g eas-cli
eas login
eas build:configure
eas build --platform ios          # cloud-builds a signed .ipa
eas submit --platform ios         # uploads to App Store Connect
```
Then in **App Store Connect**: add to **TestFlight** for beta testers, fill in
the listing, and **Submit for Review** (~1–3 days).

### Before launch — harden sync
The MVP Supabase policy is open (anon, no accounts). For a public app:
- Turn on **Sign in with Apple** (Supabase Auth supports it; required by Apple
  if you offer any other social login).
- Replace the open RLS policy with one that checks `auth.uid()` against a real
  `table_members` table, so people only see tables they were invited to.

## Honest cost / effort summary

| Item | Cost | Who |
|---|---|---|
| Web link + PWA | $0 | done — you just deploy |
| Supabase sync | $0 (free tier) | you create the project, paste keys |
| Apple Developer | $99/year | you enroll |
| Expo EAS builds | $0 (free tier covers low volume) | code port: ~the bulk of remaining work |
| App Review | $0 | ~1–3 days, Apple |
