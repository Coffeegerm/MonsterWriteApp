# new-store

Create a new Zustand store with MMKV persistence for MonsterWrite.

## Usage

```
/new-store <store-name>
```

Examples:
- `/new-store monster` → `stores/monster.store.ts`
- `/new-store writing` → `stores/writing.store.ts`
- `/new-store auth` → `stores/auth.store.ts`
- `/new-store ui` → `stores/ui.store.ts`

## What I do

Create `stores/<name>.store.ts` following MonsterWrite's offline-first, MMKV-persisted Zustand pattern.

### Required packages (already installed)
- `zustand`
- `react-native-mmkv`
- `zustand/middleware` (persist)

### Full store template

```ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

// MMKV instance — one per store to avoid key collisions
const storage = new MMKV({ id: '<name>-store' });

const mmkvStorage = {
  getItem: (key: string) => storage.getString(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
};

// ─── State interface ──────────────────────────────────────────────────────────

interface <Name>State {
  // Add state fields here
}

// ─── Actions interface ────────────────────────────────────────────────────────

interface <Name>Actions {
  // Add action signatures here
  reset: () => void;
}

type <Name>Store = <Name>State & <Name>Actions;

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: <Name>State = {
  // Initialize fields here
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const use<Name>Store = create<<Name>Store>()(
  persist(
    (set, get) => ({
      ...initialState,

      reset: () => set(initialState),

      // Implement actions here
    }),
    {
      name: '<name>-storage',
      storage: createJSONStorage(() => mmkvStorage),
      // Only persist specific fields if needed:
      // partialize: (state) => ({ field1: state.field1 }),
    }
  )
);

// ─── Selectors (derived values) ───────────────────────────────────────────────

// Export selector functions for derived/computed values
// export const selectIsAuthenticated = (state: <Name>Store) => !!state.user;
```

### Domain types to reference (from `@/types`)

Existing MonsterWrite types to use in store state:
- `Monster` — `{ id, userId, type: MonsterType, name, evolutionStage, moodState, hunger, lastFedAt, createdAt }`
- `MonsterType` — `'blobbsworth' | 'grimble' | 'wisper' | 'myco' | 'cindra'`
- `MoodState` — `'ecstatic' | 'happy' | 'neutral' | 'sad' | 'distressed'`
- `EvolutionStage` — `'hatchling' | 'companion' | 'elder'`
- `WritingSession` — `{ id, userId, content?, wordCount, dailyGoalMet, createdAt }`
- `DailyProgress` — `{ date, totalWords, goalMet, sessionsCount }`
- `UserProfile` — `{ id, email, displayName, dailyGoalWords, currentStreak, longestStreak }`

### The 4 planned stores

| Store | Key state | Key actions |
|---|---|---|
| `auth.store` | `user`, `session`, `isLoading` | `signIn`, `signUp`, `signOut`, `setUser` |
| `monster.store` | `monster`, `isSyncing` | `feedMonster`, `setMonster`, `updateMood`, `syncToSupabase` |
| `writing.store` | `currentSession`, `dailyProgress`, `wordCount` | `startSession`, `updateWordCount`, `endSession`, `checkGoal` |
| `ui.store` | `isOnboarded`, `activeTab`, `feedCelebrationVisible` | `setOnboarded`, `showFeedCelebration`, `hideFeedCelebration` |

## Conventions checklist

- [ ] MMKV instance with unique `id: '<name>-store'`
- [ ] Separate `State` and `Actions` interfaces
- [ ] `initialState` object defined outside store (enables clean `reset()`)
- [ ] `persist` middleware always used (offline-first)
- [ ] `@/` imports for all project types
- [ ] Selectors exported as plain functions (not hooks) for performance
- [ ] No direct Supabase calls — delegate to service layer, call from actions
