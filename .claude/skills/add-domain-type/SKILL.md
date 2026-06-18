# add-domain-type

Add or extend a shared domain type in MonsterWrite's `types/` directory and wire it through the barrel.

## Usage

```
/add-domain-type <name> [--file <domain-file>] [--enum]
```

Examples:
- `/add-domain-type Badge --file user` → add `Badge` interface to `types/user.ts`
- `/add-domain-type CosmeticItem` → new `types/cosmetic.ts` (its own domain file)
- `/add-domain-type MonsterAccessory --file monster --enum` → union type on `types/monster.ts`
- `/add-domain-type DailyProgress --file writing` → extend the writing domain

## What I do

Add a TypeScript type to the right `types/<domain>.ts` file (or create one), then export it from the `types/index.ts` barrel so it's reachable via `@/types`. **Domain types are never inlined in components, stores, or services** — they live here and are imported.

### Where types live

| File                | Owns                                                              |
| ------------------- | ----------------------------------------------------------------- |
| `types/monster.ts`  | `Monster`, `MonsterType`, `MoodState`, `EvolutionStage`           |
| `types/writing.ts`  | `WritingSession`, `DailyProgress`                                 |
| `types/user.ts`     | `UserProfile`, streak/goal fields                                 |
| `types/supabase.ts` | DB **Row** types + `Insert<T>` / `Update<T>` helpers (snake_case) |

Domain types are camelCase app-facing shapes. Database row types (snake_case) belong in `types/supabase.ts` — use the `/supabase-migration` skill for those. Map between them in the service layer.

### Existing domain types (reference)

```ts
// types/monster.ts
export type MonsterType = 'blobbsworth' | 'grimble' | 'wisper' | 'myco' | 'cindra';
export type MoodState = 'ecstatic' | 'happy' | 'neutral' | 'sad' | 'distressed';
export type EvolutionStage = 'hatchling' | 'companion' | 'elder';

export interface Monster {
  id: string;
  userId: string;
  name: string;
  type: MonsterType;
  mood: MoodState;
  hunger: number; // 0–100
  streak: number;
  evolutionStage: EvolutionStage;
  lastFedAt: string | null;
}

// types/writing.ts
export interface WritingSession {
  id: string;
  userId: string;
  date: string;      // ISO date YYYY-MM-DD
  wordCount: number;
  content?: string;  // undefined if user opted not to save
  createdAt: string;
}

export interface DailyProgress {
  date: string;
  wordCount: number;
  goalMet: boolean;
  sessions: WritingSession[];
}

// types/user.ts
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  dailyGoal: number; // default 500
  createdAt: string;
}
```

### Interface template

```ts
export interface <PascalCaseName> {
  id: string;
  // fields — use existing domain types where possible
  createdAt: string;
}
```

### Union/enum template (`--enum`)

```ts
export type <PascalCaseName> = 'value-a' | 'value-b' | 'value-c';
```

Prefer string-literal unions over TS `enum` (smaller output, plays well with Supabase `check` constraints — keep the union members in sync with the DB `check (... in (...))`).

### Barrel export

Ensure `types/index.ts` re-exports the domain file so `import { X } from '@/types'` works:

```ts
// types/index.ts
export * from './monster';
export * from './writing';
export * from './user';
export * from './<new-domain>'; // add when creating a new domain file
```

## Conventions checklist

- [ ] Type added to the correct `types/<domain>.ts` (or a new file created)
- [ ] App-facing types are camelCase; DB row types stay in `types/supabase.ts` (snake_case)
- [ ] String-literal unions over `enum`; members kept in sync with any DB `check` constraint
- [ ] Reuses existing domain types (`MonsterType`, `MoodState`, etc.) instead of redefining
- [ ] Exported from `types/index.ts` barrel
- [ ] Imported via `@/types` everywhere — never inlined in components/stores/services
- [ ] No `any`
