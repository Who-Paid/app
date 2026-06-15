# Who Paid? — web app

Whose round was it again? One coin per table — flick it when it's your shout.

A real, deployable React app built from the Claude Design prototype. Mobile-first,
installable as a PWA ("Add to Home Screen" on iPhone), and ready to plug into a
Supabase backend for real cross-device sync.

## Run locally

```bash
cd web
npm install
npm run dev        # http://localhost:5173
```

By default it stores tables **on your device** (no backend needed) — fully usable
for a solo demo. To turn on real sync, see below.

## Deploy a live link (pick one — all free)

You need an account with the host; each is a single command.

### Vercel (recommended, easiest)
```bash
npm i -g vercel
cd web
vercel            # follow prompts; set build command "npm run build", output "dist"
vercel --prod     # gives you a public https URL
```

### Netlify
```bash
npm i -g netlify-cli
cd web && npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages
Set `VITE_BASE="/<repo-name>/"` at build time, push `dist/` to a `gh-pages`
branch (or use the GitHub Pages action). Example:
```bash
VITE_BASE="/who-paid/" npm run build
```

Add your host's URL anywhere and people can open it on their phone and tap
**Share → Add to Home Screen** to install it like an app.

## Turn on real sync (Supabase — ~3 minutes, free tier)

1. Create a project at <https://supabase.com>.
2. Open **SQL Editor**, paste `../supabase/schema.sql`, and **Run**.
3. In **Settings → API**, copy the **Project URL** and the **anon public** key.
4. Locally: `cp .env.example .env.local` and fill both values.
   On Vercel/Netlify: add them as environment variables named
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then redeploy.

Once keys are present the app automatically uses Supabase: tables sync live
across devices, and the **Invite** button shares a link that drops the other
person straight into the shared table (their coin flips show up in realtime).

> The MVP RLS policy in `schema.sql` is intentionally open (anon, no accounts)
> so you can test fast. Before App Store launch, swap it for Sign in with Apple
> + an auth-scoped membership policy — see `../DEPLOY.md`.

## How it works

- `src/screens/` — Start (table list), Table (the flickable coin), EditSheet.
- `src/lib/store.ts` — data layer with two interchangeable backends
  (localStorage ↔ Supabase), chosen automatically by whether keys are set.
- `src/lib/useTables.ts` — React state, optimistic updates, realtime refresh,
  and invite-link joining.
- The coin uses a single `requestAnimationFrame` loop that ricochets off the
  top/bottom edges and rolls to a stop — ported from the prototype.
