# Who Paid?

Whose round was it again? One coin per table — flick it over when it's your shout.

A playful tracker for whose turn it is to pay among friends, flatmates, or couples.
Each **table** is a shared surface split into a band per person; a **coin** sits with
whoever paid last. Flick it (or roll the dice) and it bounces to the next person and
stamps the date. Add photos, names, and amounts; share a table and it syncs live.

## Repo layout

| Path | What |
|------|------|
| [`web/`](web/) | The app — React + TypeScript + Vite. **Deploy this.** |
| [`supabase/`](supabase/) | `schema.sql` for real cross-device sync |
| [`CONNECT.md`](CONNECT.md) | Wire up GitHub → Vercel → Supabase (step by step) |
| [`DEPLOY.md`](DEPLOY.md) | Full roadmap incl. the native iPhone / App Store path |
| `project/`, `chats/` | Original Claude Design prototype + transcript (reference) |

## Quick start 

```bash
cd web
npm install
npm run dev        # http://localhost:5173
```

Works on-device with no backend. Add Supabase keys (see `CONNECT.md`) to turn on
real sync and invite links. Deploys to Vercel with **Root Directory = `web`**.
