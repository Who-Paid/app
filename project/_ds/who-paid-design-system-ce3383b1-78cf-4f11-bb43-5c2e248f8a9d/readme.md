# Who Paid? — Design System

A complete brand + UI design system for **Who Paid?**, a fun, focused little app
for settling the eternal question: *who paid last time?* The whole app does one
thing — it remembers who paid last. Two (or three) friends share a **table** split
into bands, a **coin** sits in the last payer's half, and you **flick it across**
when it's someone else's shout. Because the app does so little, the design makes
that one moment **delightful, bold, and crystal clear**.

> **Sources:** This system was created from a brand brief only — no existing
> codebase, Figma, or assets were provided. Brief: *"Who Paid? is a fun app to
> see who paid last time, so there are not many functions — make these stand out.
> Fun, clean design."* Everything here (logo, palette, type, components) is
> original brand work. If you have real brand assets or product code, share them
> and this system will be updated to match.

---

## Personality

Playful, decisive, warm, and a little cheeky. Who Paid? turns a small, slightly
awkward social moment into a tiny celebration. It never feels like accounting
software. Think: a friend who keeps score so you don't have to — with confetti.

---

## CONTENT FUNDAMENTALS

How Who Paid? writes copy.

- **Voice:** casual, friendly, second-person. We talk *to* the user ("It's your
  turn!", "You're up in 2 groups 😅"), never *about* them in the third person.
- **Tone:** upbeat and light. Even "bad news" (you have to pay) is framed with a
  wink: *"Looks like you 😬"*, *"Ah, bad luck"*, *"Fine, I'll pay"*.
- **Casing:** sentence case everywhere — buttons, titles, labels. The only
  uppercase is the small tracked **eyebrow** label (e.g. `LAST SETTLED · 2 DAYS AGO`).
- **Length:** short. Headlines are 2–5 words. Buttons are 1–3 words and start with
  a verb where possible: *"Spin to decide"*, *"Log it"*, *"They paid"*.
- **Numbers & money:** always in the mono "receipt" face, e.g. `$48.20`. Two
  decimals for amounts; bare counts for rounds (`5×`, `12 rounds`).
- **Emoji:** yes, sparingly and purposefully — as punctuation on a friendly beat
  (🎉 celebration, 😅/😬 mild stakes, 🌮🏠☕️ as group identity). Never more than
  one per line; never decorative clutter. Skip them in production-serious surfaces
  (legal, errors).
- **Punctuation:** the brand name keeps its question mark — **Who Paid?** — always.

**We say** ✓
- "It's your turn to pay! 🎉"
- "Sam got it last time."
- "Settle up — takes 2 taps."

**Not this** ✕
- "Outstanding balance: $0.00"
- "Payment obligation assigned."
- "Initiate reconciliation workflow."

---

## VISUAL FOUNDATIONS

- **Colors.** A warm **cream paper** background (`--paper #FFF7EE`) and deep
  **plum-ink** text (`--ink-900 #1C1B29`) — never pure white or pure black. The
  hero hue is a fresh **mint "money" green** (`--mint-400 #1FCD7C`) for primary
  actions and positive/settled states. A playful supporting cast does the rest:
  **coral** (`#FF6353`, attention / "your turn"), **sun** (`#FFC93D`, highlight),
  **sky** (`#4DA2FF`, info), **grape** (`#9B79FF`, fun). People get stable,
  auto-assigned colors from an 8-swatch avatar palette.
- **Type.** Display & UI headings in **Fredoka** (rounded, chunky, friendly) with
  tight tracking; body & labels in **Nunito Sans** (clean, legible, extra-bold for
  emphasis); amounts & receipts in **Space Mono** (tabular). Big, confident size
  jumps — verdicts go up to 44–64px.
- **Backgrounds.** Mostly flat warm paper. The app shell uses one soft radial
  cream wash. No photography, no busy patterns. The single allowed "gradient" is
  that subtle paper wash; celebratory screens go full-bleed flat color (mint or
  coral) with falling **confetti** as the only ornament.
- **Corner radii.** Generous and rounded throughout: inputs `16px`, cards `24px`,
  hero panels/sheets `32px`, and **pills (`999px`)** for buttons, chips, avatars,
  toggles, and the segmented control.
- **Cards.** White (`--card #FFFFFF`) with a 1px warm border and a **soft,
  warm-tinted shadow** (`--shadow-md`). A playful **"pop" variant** swaps in a 2px
  ink border + a solid offset shadow for hero moments. Tinted card surfaces (mint /
  sun / sky / sunken-cream) are available for emphasis.
- **Shadows.** Two systems: (1) **soft** elevation — low-spread, warm-tinted,
  `sm → xl`; (2) the **signature "pop"** — a *solid, blur-less* offset shadow
  (e.g. `0 4px 0 var(--mint-600)`) under primary buttons and pop cards.
- **Hover / press.** Buttons brighten ~4% on hover; on **press** they translate
  **down ~3px into their pop shadow** (the shadow shrinks to `0 1px 0`), giving a
  chunky, tactile "click." Icon buttons scale to `0.92` on press. Cards marked
  interactive lift `-2px` on hover and settle on press.
- **Borders.** Hairlines are warm (`--line #ECE6DC` on paper, `--line-card`
  on white). Bold ink borders (`2px var(--ink-900)`) appear only on "pop"
  elements and the secondary button.
- **Focus.** Always-visible **coral focus ring** (`0 0 0 4px rgba(255,99,83,.35)`)
  — friendly and high-contrast, layered over the pop shadow on buttons.
- **Animation.** Springy and joyful but quick. Easing leans on overshoot
  (`cubic-bezier(.34,1.56,.64,1)`) for toggle thumbs, pop-ins, and sheets. Signature
  motions: the **reveal spin** (cycles through people, eases out, lands), **confetti**
  fall, **pop-in** scale, sheet **slide-up**, and content **rise** on entrance.
  Respect `prefers-reduced-motion` for decorative loops in production.
- **Transparency & blur.** Used sparingly: the bottom tab bar and toasts use a
  light backdrop blur over translucent paper; modal scrims are `rgba(28,27,41,.45)`.
- **Layout.** Mobile-first, single column, breezy 20px screen padding on a 4px
  spacing grid. Fixed elements: top header / nav bar and the bottom tab bar; sheets
  dock to the bottom. Minimum 44px tap targets.
- **Imagery vibe.** No stock photography. Identity comes from the coin mark, emoji,
  bold color, and avatars. If imagery is ever added, keep it warm and high-key.

---

## ICONOGRAPHY

- **Icon set:** [**Lucide**](https://lucide.dev) — a clean, open-source line-icon
  set with **rounded caps/joins** that echo Fredoka's roundness. Loaded from CDN
  (`unpkg.com/lucide`). Default stroke weight **2.25**, sized 18–24px in UI.
  ⚠️ *Substitution flag:* no custom icon set was provided, so Lucide is the chosen
  stand-in. Swap it if the brand later adopts a bespoke set.
- **Usage:** via the `<Icon name="…" />` helper in `ui_kits/app/util.jsx`. Common
  glyphs: `users`, `history`, `user`, `dices`, `plus`, `check`, `x`, `arrow-left`,
  `chevron-right`, `share-2`, `more-horizontal`.
- **Brand mark:** a custom **coin + checkmark** ("settled") — `assets/logo-mark.svg`
  and `assets/app-icon.svg` (squircle). These are original SVGs, the only
  hand-built vector art in the system.
- **Emoji** are part of the visual language (see Content Fundamentals) and double
  as lightweight group icons (🌮🏠☕️). Used intentionally, never as filler.

---

## INDEX

**Foundations & entry**
- `styles.css` — global entry point (imports only). Link this one file.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`,
  `radius.css`, `shadow.css`, `base.css`.
- `foundations/` — specimen cards shown in the Design System tab (Colors, Type,
  Spacing, Brand).
- `assets/` — `logo-mark.svg`, `app-icon.svg`.

**Components** (`window.WhoPaidDesignSystem_ce3383`)
- `components/buttons/` — `Button`, `IconButton`
- `components/data-display/` — `Avatar`, `Badge`, `Card`
- `components/forms/` — `Input`, `Toggle`
- `components/navigation/` — `SegmentedControl`

Each directory has a `.card.html` (Design System tab) and each component a
`.d.ts` + `.prompt.md`.

**UI kits**
- `ui_kits/app/` — the **Who Paid?** mobile app: the split “table”, the coin, and
  the flick (interactive). See its `README.md`.

**Other**
- `SKILL.md` — Agent-Skill manifest for using this system elsewhere.

> Generated files — do **not** edit: `_ds_bundle.js`, `_ds_manifest.json`,
> `_adherence.oxlintrc.json`.
