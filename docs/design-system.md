# MonsterWrite Design System

> Warm dark academia. A candle-lit study by day, a midnight library by night.
> Parchment and espresso, brass and oxblood, serif type, and no emoji — the only
> whimsy comes from the monsters.

Source of truth lives in code: [`constants/theme.ts`](../constants/theme.ts),
[`global.css`](../global.css), [`tailwind.config.js`](../tailwind.config.js). This doc
explains intent; the token files are authoritative.

---

## Brand & voice

MonsterWrite is a writing-habit companion. A small monster depends on your daily words —
feed it and it flourishes, neglect it and it fades. The product should feel like a
beloved, slightly worn notebook: literary, warm, calm, a little gothic.

- **Tagline:** _Feed your monster. Build your habit._
- **Voice:** second person to the writer, third person about the monster. Sentence case
  everywhere except UPPERCASE wide-tracked section labels. Warm, literary, no hype, no
  emoji. Full rules in [`content-style.md`](./content-style.md).

---

## Color

Two themes, both warm. **No pure white, no pure grey, no pure black.**

### Brand neutrals & accents — `BrandColors`

| Token         | Hex       | Role                              |
| ------------- | --------- | --------------------------------- |
| `paper`       | `#F0E6D1` | Light background (parchment)      |
| `surface`     | `#FBF6EB` | Light card / raised surface       |
| `ink`         | `#14100A` | Espresso — dark bg & primary text |
| `ink-surface` | `#2A2117` | Dark card / raised surface        |
| `brass`       | `#B0822F` | Primary accent / gilt             |
| `oxblood`     | `#74302E` | Emphasis + destructive            |
| `olive`       | `#5E6535` | Success / "fed"                   |
| `terracotta`  | `#B05C36` | Warning / hunger                  |
| `study-teal`  | `#3F6B66` | Info                              |

### Mood scale — `MoodColors` (flourishing → fading)

| Mood         | Hex       | Reads as                  |
| ------------ | --------- | ------------------------- |
| `ecstatic`   | `#6E7A33` | Flourishing (olive-green) |
| `happy`      | `#C2902F` | Amber gold                |
| `neutral`    | `#A87B4E` | Clay                      |
| `sad`        | `#6E8597` | Cold dusty slate-blue     |
| `distressed` | `#6B5560` | Ashen plum                |

### Semantic usage

- **Primary CTA:** ink button — `bg-ink` (light) / `bg-paper` (dark). **Not green.**
- **Success / goal met / fed:** `bg-olive`.
- **Destructive:** `bg-oxblood`.
- **Hunger bar:** runs `olive → terracotta → oxblood` as hunger rises.
- **Accents / active tab / links:** `brass` (light) / lighter brass `#C99A45` (dark).
- **Surfaces:** `surface` (light) / `ink-surface` (dark) with a 1px `border-border`.

```tsx
// good — token classes
<Pressable className="bg-ink dark:bg-paper rounded-lg px-5 py-3">
  <Text className="text-paper dark:text-ink font-serif">Start writing</Text>
</Pressable>

// bad — raw hex / old cool palette
<Pressable className="bg-monster-green"> {/* removed */} </Pressable>
```

---

## Type

Three real webfonts, loaded in [`app/_layout.tsx`](../app/_layout.tsx) via `useFonts`.

| Class          | Font               | Use for                                   |
| -------------- | ------------------ | ----------------------------------------- |
| `font-display` | Cormorant Garamond | Titles, screen headings, monster names    |
| `font-serif`   | EB Garamond        | Body copy, labels, most UI text (default) |
| `font-mono`    | Courier Prime      | Word counts, stats/numbers, the editor    |

- Headings (`text-2xl`/`text-3xl`) and monster names → `font-display`.
- Word counts, streak numbers, the `write.tsx` editor `TextInput` → `font-mono`.
- Section labels (`Stats`, `Badges`, `Settings`…) → UPPERCASE, `tracking-[0.16em]`,
  muted color.

```tsx
<Text className="font-display text-3xl text-ink dark:text-paper">Wisper</Text>
<Text className="font-mono text-4xl text-ink dark:text-paper">512</Text>
<Text className="font-serif text-base text-ink/80 dark:text-paper/80">words today</Text>
<Text className="font-serif uppercase tracking-[0.16em] text-xs text-ink/50">Stats</Text>
```

---

## Spacing / radius / shadow / motion

- **Spacing:** 4px base grid (Tailwind scale). Cards pad `p-4`; screens pad `px-5`/`px-6`.
- **Radius:** `--radius: 0.625rem` (10px). Use `rounded-lg` for cards/buttons; pills only
  for small chips.
- **Shadow:** soft and low — a faint warm drop, not a hard material elevation. One level.
- **Motion:** calm and brief. Reanimated for transitions; Lottie for monster reactions
  (see [`add-monster-animation`](../.claude/skills/add-monster-animation/SKILL.md)).
  Evolution is the one "ceremony" moment.

---

## Iconography

Lucide only (`lucide-react-native`): 2px stroke, round caps, 24px grid. Icons inherit the
current text color and are tinted to an accent only to signal state. Monsters are art,
never icons. **No emoji, no unicode-glyph icons.** Full rules in
[`iconography.md`](./iconography.md).

---

## Components

- **Cards:** `bg-surface dark:bg-ink-surface`, `border border-border`, `rounded-lg`, soft
  shadow.
- **Primary button:** ink fill (`bg-ink` / dark `bg-paper`), contrasting label, `rounded-lg`.
- **Success button** (fed / goal met): `bg-olive`.
- **Destructive:** `bg-oxblood`.
- **Inputs:** `bg-surface dark:bg-ink-surface`, `border-border`, ink text, brass focus ring.
- **Section header:** UPPERCASE label + wide tracking, muted, above the content block.

Scaffold with [`/new-component`](../.claude/skills/new-component/SKILL.md) and
[`/new-screen`](../.claude/skills/new-screen/SKILL.md); style per this doc.

---

## Monsters & moods

Five monsters — Blobbsworth, Grimble, Wisper, Myco, Cindra — each a hand-drawn SVG in
[`assets/monsters/`](../assets/monsters). Mood is conveyed through **fill color + posture**,
never a label or emoji. Per-mood fills come from `MoodColors`:

| Mood       | Label (UI)  | Fill      |
| ---------- | ----------- | --------- |
| ecstatic   | Flourishing | `#6E7A33` |
| happy      | Content     | `#C2902F` |
| neutral    | Getting by  | `#A87B4E` |
| sad        | Hungry      | `#6E8597` |
| distressed | Fading      | `#6B5560` |

Ink stroke for eyes/mouth: `#1E1810`. Wisper's ghost body: warm `#EFE6D2`. Myco's stem:
`#EFE0C2`. Hunger labels (HungerBar): _Full / Content / Peckish / Starving_.

---

## Do / Don't

| Do                                               | Don't                                      |
| ------------------------------------------------ | ------------------------------------------ |
| Warm parchment & espresso, both themes           | Pure white, pure grey, cool/purple palette |
| Ink primary CTA; olive only for fed/goal-met     | Green primary buttons                      |
| Serif display titles, mono numbers/editor        | System sans for headings or counts         |
| Lucide icons inheriting text color               | Emoji or unicode glyphs (🐾, ✓, 🎉)        |
| Convey mood via monster color + posture          | Mood emoji faces                           |
| Sentence case; UPPERCASE only for section labels | Title Case buttons, shouty marketing copy  |
