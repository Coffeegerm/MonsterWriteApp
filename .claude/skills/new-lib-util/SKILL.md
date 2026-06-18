# new-lib-util

Create a pure utility function in `lib/` for MonsterWrite, with a colocated test.

## Usage

```
/new-lib-util <util-name> [--no-test]
```

Examples:
- `/new-lib-util word-counter` → `lib/word-counter.ts` + `lib/word-counter.test.ts`
- `/new-lib-util streak` → streak/evolution-stage calculations
- `/new-lib-util date` → timezone-aware date helpers
- `/new-lib-util format-word-count --no-test` → util without a test

## What I do

Create `lib/<name>.ts` — a **pure**, side-effect-free module. No React, no Zustand, no Supabase, no device APIs. These are the deterministic building blocks (word counting, streak math, date handling) that stores, services, and hooks call into.

`lib/` is for logic; `services/` is for I/O. If your function awaits anything or touches the network/device, it belongs in `services/`, not here.

### Full util template

```ts
// ─── <name> ─────────────────────────────────────────────────────────────────

/**
 * One-line description of what this computes.
 */
export function <camelCaseName>(input: <InputType>): <OutputType> {
  // pure logic — same input always yields same output
  return /* ... */;
}
```

### Reference implementations

```ts
// lib/word-counter.ts
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

// lib/streak.ts
import type { EvolutionStage } from '@/types';

export function evolutionStageForStreak(streak: number): EvolutionStage {
  if (streak >= 30) return 'elder';
  if (streak >= 7) return 'companion';
  return 'hatchling';
}

// lib/date.ts
/** Local-timezone ISO date (YYYY-MM-DD), not UTC — streaks are per local day. */
export function todayKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
```

### Colocated test template

```ts
// lib/<name>.test.ts
import { <camelCaseName> } from './<name>';

describe('<camelCaseName>', () => {
  it('handles the empty / edge case', () => {
    expect(<camelCaseName>(/* edge input */)).toBe(/* expected */);
  });

  it('handles the typical case', () => {
    expect(<camelCaseName>(/* normal input */)).toBe(/* expected */);
  });
});
```

### Test runner setup (one-time, if missing)

The project has no test runner yet. Pure `lib/` functions are the cheapest place to start. Add the Expo-standard setup:

```bash
npx expo install jest-expo jest @types/jest
```

Then add to `package.json`:

```json
{
  "scripts": { "test": "jest" },
  "jest": { "preset": "jest-expo" }
}
```

Run with `npm test`. Pure utils need no RN/Expo mocks, so they run fast and deterministically.

## Distinction from other layers

| Layer       | Location          | Purpose                              | Side effects? |
| ----------- | ----------------- | ------------------------------------ | ------------- |
| `lib/`      | `lib/<name>.ts`   | Pure logic / calculations            | Never         |
| `services/` | `services/*.ts`   | Supabase / device I/O                | Yes (async)   |
| `stores/`   | `stores/*.store.ts` | Persisted app state                | Local (MMKV)  |
| `hooks/`    | `hooks/use-*.ts`  | Compose the above for components     | Via stores    |

## Conventions checklist

- [ ] File at `lib/<name>.ts`, kebab-case
- [ ] Pure: deterministic, no `async`, no I/O, no React/Zustand/Supabase imports
- [ ] Named exports only (no default export)
- [ ] Domain types imported from `@/types`
- [ ] Explicit input/output types — no `any`
- [ ] Colocated `lib/<name>.test.ts` unless `--no-test`
- [ ] Tests cover at least the empty/edge case and a typical case
