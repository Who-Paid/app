# Connect GitHub + Vercel + Supabase

End state: **code lives in GitHub → Vercel auto-deploys it → Supabase holds the data.**
Every future `git push` redeploys automatically.

## 1. GitHub (code)
Create an empty repo at <https://github.com/new> (e.g. `who-paid`), **without**
a README/.gitignore. Then the code here gets pushed to it (see chat for the two
auth options). Result: your repo has `web/`, `supabase/`, and the docs.

## 2. Vercel (hosting) — browser, ~2 min
1. <https://vercel.com/new> → **Import** your `who-paid` GitHub repo.
2. **Root Directory** → click *Edit* → choose **`web`**. (Vercel auto-detects Vite.)
3. **Deploy**. You get a live `https://…vercel.app` URL.
4. Later pushes to GitHub redeploy automatically.

## 3. Supabase (data) — browser, ~3 min
1. <https://supabase.com/dashboard> → **New project** (pick a region near you).
2. **SQL Editor** → paste all of `supabase/schema.sql` → **Run**.
3. **Settings → API** → copy **Project URL** and the **anon public** key.

## 4. Wire Supabase into Vercel
1. Vercel project → **Settings → Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon public key
2. **Deployments → ⋯ → Redeploy** (so the new vars are baked in).

Now the app uses real sync: tables update live across phones and the **Invite**
button shares a working link. Keys live only in Vercel — never in the repo.
