# MonsterWrite Iconography

Icons are quiet wayfinding, not decoration. One library, one weight, no emoji.

---

## Rules

- **Lucide only** — [`lucide-react-native`](https://lucide.dev). No other icon sets, no
  `@expo/vector-icons` for product UI, no emoji, no unicode-glyph icons (✓, →, 🔥, 🎉…).
- **Weight:** 2px stroke, round line caps, on a 24px grid. Keep the default Lucide
  proportions.
- **Color:** icons **inherit the current text color** by default. Tint to an accent
  (`brass`, `olive`, `terracotta`, `oxblood`, `study-teal`) **only to signal state**
  (active, success, warning, danger).
- **Sizing:** 16 / 20 / 24 px. Pair with text at the matching optical size.
- **Monsters are art, never icons.** Use the SVG monsters in
  [`assets/monsters/`](../assets/monsters); never substitute an icon for a monster or a
  monster for an icon.

---

## Usage

```tsx
import { PenLine, Flame, Gem, CalendarDays } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

// inherits text color
<PenLine size={20} color={isDark ? '#F6EEDD' : '#14100A'} strokeWidth={2} />

// tinted only to signal state (e.g. active streak)
<Flame size={20} color="#B05C36" strokeWidth={2} />
```

In NativeWind contexts, drive the `color` prop from the theme rather than hardcoding when
possible (see [`constants/theme.ts`](../constants/theme.ts)).

---

## Common mappings (replacing former emoji)

| Was   | Use (Lucide)  | Where                     |
| ----- | ------------- | ------------------------- |
| ✍️    | `PenLine`     | Total words stat          |
| 🔥    | `Flame`       | Streak                    |
| 💎    | `Gem`         | Best streak               |
| 📅    | `CalendarDays`| Days written              |
| 🍖    | `Drumstick`   | "First feed" badge        |
| ✨    | `Sparkles`    | Milestone badge           |
| 📖    | `BookOpen`    | Reading/journal badge     |
| 🏆    | `Trophy`      | Achievement badge         |
| ✓     | `Check`       | Selected / done states    |
| 🐾    | brass "M" monogram tile | Auth logo       |

Pick the closest semantic Lucide glyph; never reintroduce an emoji to fill a gap.
