# add-monster-animation

Register a new Lottie monster animation in MonsterWrite, following the naming convention and idle-vs-reaction split.

## Usage

```
/add-monster-animation <monster-type> <mood-or-reaction> [--reaction]
```

Examples:
- `/add-monster-animation blobbsworth happy` → idle loop `assets/animations/blobbsworth-happy.json`
- `/add-monster-animation grimble sad` → idle loop `assets/animations/grimble-sad.json`
- `/add-monster-animation cindra feed --reaction` → one-shot `assets/animations/cindra-feed.json`
- `/add-monster-animation wisper evolve --reaction` → one-shot evolution sequence

## What I do

Place the Lottie JSON under `assets/animations/` with the canonical name, then register it in the animation map and show the `LottieView` usage. Uses `lottie-react-native` (installed).

### Naming convention

```
assets/animations/<monster-type>-<state>.json
```

- **Idle loops** (default): `[monster-type]-[mood].json` — subtle, continuous. e.g. `blobbsworth-happy.json`, `grimble-neutral.json`, `myco-sad.json`
- **Reactions** (`--reaction`): `[monster-type]-[reaction].json` — one-shot, played on an event. e.g. `cindra-feed.json`, `wisper-evolve.json`

Idle and reaction files for the same mood are **distinct files** — never overload one clip for both.

### Valid values

| Slot         | Values                                                                 |
| ------------ | ---------------------------------------------------------------------- |
| Monster type | `blobbsworth`, `grimble`, `wisper`, `myco`, `cindra`                    |
| Mood (idle)  | `happy`, `neutral`, `sad` (min set per brand) · optional `ecstatic`, `distressed` |
| Reaction     | `feed` (gulp), `goal` (excited bounce), `wiggle` (word milestone), `evolve` (transformation), `enter-sad` (missed-day entrance) |

### Animation map (register here)

Keep a typed registry so screens reference animations by `(type, state)`, not raw paths:

```ts
// assets/animations/index.ts (or constants/animations.ts)
import type { MonsterType, MoodState } from '@/types';

export const monsterIdle = {
  blobbsworth: {
    happy: require('./blobbsworth-happy.json'),
    neutral: require('./blobbsworth-neutral.json'),
    sad: require('./blobbsworth-sad.json'),
  },
  // grimble, wisper, myco, cindra…
} as const;

export const monsterReaction = {
  blobbsworth: {
    feed: require('./blobbsworth-feed.json'),
    evolve: require('./blobbsworth-evolve.json'),
  },
  // …
} as const;
```

### Idle loop usage (continuous)

```tsx
import LottieView from 'lottie-react-native';
import { monsterIdle } from '@/assets/animations';

<LottieView
  source={monsterIdle[type][mood]}
  autoPlay
  loop
  style={{ width: 200, height: 200 }}
/>
```

### Reaction usage (one-shot, event-driven)

```tsx
import { useRef } from 'react';
import LottieView from 'lottie-react-native';
import { monsterReaction } from '@/assets/animations';

const ref = useRef<LottieView>(null);

// trigger on event (e.g. Feed Monster pressed):
ref.current?.play();

<LottieView
  ref={ref}
  source={monsterReaction[type].feed}
  loop={false}
  autoPlay={false}
  onAnimationFinish={() => {/* swap back to idle, fire haptic, etc. */}}
/>
```

### Brand moments → animation (from the design guidelines)

| Moment                       | State / file suffix | Loop? |
| ---------------------------- | ------------------- | ----- |
| Word milestone (100, 200…)   | `wiggle`            | one-shot |
| Goal reached (500 words)     | `goal`              | one-shot (+ confetti) |
| Feed Monster pressed         | `feed` (gulp)       | one-shot |
| Missed day, on next open     | `enter-sad`         | one-shot → settles into `sad` idle |
| Evolution trigger            | `evolve`            | one-shot full-screen |
| Resting state                | `happy`/`neutral`/`sad` idle | loop |

Mood must be **readable at a glance** — happy vs sad distinguishable instantly through posture/expression alone.

## Conventions checklist

- [ ] File at `assets/animations/<monster-type>-<state>.json`, kebab-case
- [ ] Monster type is one of the 5 valid roster types
- [ ] Idle (loop) and reaction (one-shot) are separate files
- [ ] Registered in the typed animation map (no raw `require` paths in screens)
- [ ] Idle → `autoPlay loop`; reaction → `loop={false}` triggered via `ref.play()`
- [ ] Reactions resolve back to an idle state via `onAnimationFinish`
- [ ] Emotional state readable at a glance
- [ ] 3× resolution / transparent background per the illustration brief
