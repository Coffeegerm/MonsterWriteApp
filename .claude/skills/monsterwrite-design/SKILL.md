---
name: monsterwrite-design
description: Generate well-branded MonsterWrite interfaces and assets — warm dark-academia design guidelines, colors, type, fonts, monster art, and component conventions. Use whenever building or restyling MonsterWrite UI.
user-invocable: true
---

# monsterwrite-design

You are an expert MonsterWrite product designer. The brand is **warm dark academia** — a
candle-lit study by day, a midnight library by night. Parchment and espresso neutrals,
brass / oxblood / olive / terracotta accents, serif-forward type, and **no emoji**. The
only whimsy comes from the monsters themselves.

## Before you design anything, read

1. [`docs/design-system.md`](../../../docs/design-system.md) — the master guide (color,
   type, spacing, components, monsters & moods, do/don't).
2. [`docs/content-style.md`](../../../docs/content-style.md) — voice & copy rules.
3. [`docs/iconography.md`](../../../docs/iconography.md) — Lucide-only icon rules.

Then read the live source-of-truth token files and match them exactly:

- [`constants/theme.ts`](../../../constants/theme.ts) — `BrandColors`, `MoodColors`, `Colors`, `Fonts`
- [`global.css`](../../../global.css) — shadcn HSL custom properties (`:root` / `.dark`)
- [`tailwind.config.js`](../../../tailwind.config.js) — NativeWind token + font classes

## Non-negotiables

- **Two themes, both warm.** Light = candle-lit study (parchment `#F0E6D1`). Dark =
  midnight library (espresso `#14100A` / `#1E1810`). No pure white, no pure grey.
- **Color with meaning.** Brass = primary accent/gilt. Olive = success/"fed". Terracotta =
  warning/hunger. Oxblood = emphasis/destructive. Study teal = info. Mood scale runs
  olive-green (flourishing) → ashen plum (fading).
- **Primary CTA is ink-on-parchment**, not green. Use olive only for the goal-met / fed
  success state; oxblood for destructive.
- **Type.** `font-display` (Cormorant Garamond) for titles & monster names; `font-mono`
  (Courier Prime) for word counts, stats, and the editor; `font-serif` (EB Garamond) for
  body & UI. Section labels are UPPERCASE with wide tracking (`tracking-[0.16em]`).
- **No emoji, anywhere.** Icons are Lucide (`lucide-react-native`), 2px stroke, 24px grid,
  inheriting text color. Monsters are art (`assets/monsters/*.tsx`), never icons.
- **Voice.** Second person to the writer, third person about the monster. Sentence case.
  Warm, literary, calm. Tagline: *"Feed your monster. Build your habit."*

## When building UI

- Reach for NativeWind token classes (`bg-paper`, `bg-surface`, `bg-ink`, `bg-ink-surface`,
  `text-brass`, `bg-olive`, `bg-oxblood`, `mood-*`) — never raw hex in components.
- Cards: `bg-surface` (light) / `bg-ink-surface` (dark), 1px `border-border`, `rounded-lg`,
  soft shadow.
- Use the `/new-component`, `/new-screen`, and `/add-monster-animation` skills for
  scaffolding; this skill governs how the result should look and read.
