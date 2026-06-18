# brand-design-check

Audit a MonsterWrite screen or component against the brand & design guidelines and approved design tokens. Reports issues and fixes — it does not scaffold new files.

## Usage

```
/brand-design-check <file-or-dir> [--fix]
```

Examples:
- `/brand-design-check app/(tabs)/index.tsx` → audit the Home screen
- `/brand-design-check components/monsters/` → audit every monster component
- `/brand-design-check app/write.tsx --fix` → audit and apply safe fixes

## What I do

Read the target, then score it across the dimensions below against [docs/brand-design-guidelines.md](../../../docs/brand-design-guidelines.md) and the `tailwind.config.js` brand tokens. Output a per-dimension score (0–10), the concrete violations with line references, and the exact fix. With `--fix`, apply the unambiguous corrections (e.g. raw hex → token class) and leave judgment calls (copy voice, layout) as recommendations.

### Dimensions audited

| Dimension        | What "10" looks like                                                              |
| ---------------- | --------------------------------------------------------------------------------- |
| Color            | Only brand tokens used; correct semantic mapping (mood → color); dark-first       |
| Typography       | Nunito (display) / Inter (UI) / Lora (editor) via `font-*` classes; correct scale |
| Voice & tone     | Copy sounds like the monster — warm, weird, a little dramatic; uses approved words |
| Layout & UX      | Matches the screen patterns (monster center-stage, subtle word counter, clear CTA) |
| Motion           | Brand micro-interactions present (wiggle, gulp, evolution ceremony)               |
| Slop check       | No generic/sterile defaults; nothing that reads "corporate productivity tool"     |

### Color — approved palette only

| Name          | Hex       | Use                                  | NativeWind            |
| ------------- | --------- | ------------------------------------ | --------------------- |
| Inkwell       | `#1A1625` | Primary dark background              | `bg-background`       |
| Dusk Plum     | `#2D2440` | Cards, panels                        | `bg-card`             |
| Parchment     | `#F2EDE4` | Text on dark                         | `text-foreground`     |
| Monster Green | `#5BF178` | Primary action, fed/happy, progress  | `bg-primary` / `text-primary` |
| Hungry Orange | `#FF7B3A` | Warning, hungry, 1 day missed        | `text-[#FF7B3A]`      |
| Happy Gold    | `#FFD166` | Streaks, milestones, achievements    | `text-[#FFD166]`      |
| Sad Blue      | `#7CA5D4` | Sad / 3+ days missed                 | `text-[#7CA5D4]`      |
| Mystic Violet | `#B388FF` | Evolution, magic, premium            | `text-[#B388FF]`      |

Flag: any hex outside this set, hardcoded grays for text, semantic mismatches (e.g. hungry state not orange), or light-mode-only styling (MonsterWrite is **dark-first**).

### Typography

- `font-display` → Nunito (monster names, big numbers, milestones)
- `font-sans` → Inter (UI labels, body)
- `font-serif` → Lora (writing editor only)
- Scale: Display 32–40 ExtraBold · H1 24 Bold · H2 18 SemiBold · Body 16 · Caption 13 · Editor 17

Flag: system font fallback, Inter used in the editor, Lora used in UI chrome, off-scale sizes.

### Voice & tone

Copy should sound like it came from a creature's mouth — playful, lovingly guilt-trippy, short and dramatic.

- **Use:** feed, hunger, mood, evolve, streak, critter, beastie, sulk, pout, glow, devour, scribbles
- **Avoid:** productivity, efficiency, optimize, hustle, engagement, "fail", "punish", generic "Don't forget to write today!"

Tone shifts by context: onboarding = conspiratorial; in-progress = quietly encouraging; goal reached = euphoric; missed day = pouty; milestone = proudly unhinged. Notifications speak in the **specific monster's** voice, never the brand's.

### Layout & UX patterns

- **Home:** monster large and center-stage, mood unmistakable; today's progress beneath; one clear CTA ("Write Today" → "Feed Monster"); streak a small persistent badge.
- **Writing:** distraction-free, dark/warm; word counter subtle at bottom; monster peeks in near goal; glowing green Feed button at 500.
- **Monster:** full centered monster, mood shown through posture (not a text label), streak + evolution timeline.
- **Onboarding:** ≤4 screens, no sign-up wall before the first writing session.

### Motion

Look for the brand micro-interactions where relevant: word-milestone wiggle, goal bounce + particles, feed gulp, sad slow-entrance on missed day, full-screen evolution ceremony, streak badge pulse. (Use `/add-monster-animation` to add missing ones.)

### Slop check (reject these)

- Dashboards that look like Jira; flat corporate cards with no personality
- Outline-only icons (brand wants filled, hand-drawn-feeling — Phosphor/Lucide stylized)
- Neutral/"professional" copy that could belong to any productivity app
- Perfectly sterile spacing with zero warmth or whimsy

## Output format

```
brand-design-check: <target>

Color          8/10  — line 42: text-gray-400 → use text-muted-foreground
Typography     6/10  — line 18: heading missing font-display (Nunito)
Voice & tone   4/10  — line 55: "Complete your daily goal" → too corporate; try monster voice
Layout & UX    9/10  — matches Home pattern
Motion         —     — n/a for this component
Slop check     pass

Top fixes:
1. …
2. …
```

## Conventions checklist

- [ ] Every color resolves to an approved brand token (no stray hex/grays)
- [ ] Correct font family per role (display/UI/editor)
- [ ] Copy passes the voice test (uses approved words, monster-mouth tone)
- [ ] Dark-first; light mode is secondary, never the only path
- [ ] Mood communicated visually, not just via text labels
- [ ] Matches the documented screen/UX pattern
- [ ] No AI/corporate slop
