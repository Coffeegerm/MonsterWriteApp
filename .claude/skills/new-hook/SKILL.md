# new-hook

Create a domain hook for MonsterWrite that composes Zustand stores and services into a component-friendly API.

## Usage

```
/new-hook <hook-name> [--store <store-name>] [--service <service-name>]
```

Examples:
- `/new-hook writing-session --store writing` → `hooks/use-writing-session.ts`
- `/new-hook monster --store monster --service monster` → monster hook backed by store + service
- `/new-hook auth --store auth --service auth` → `hooks/use-auth.ts`
- `/new-hook notifications --service notifications` → device-only hook (no store)

## What I do

Create `hooks/use-<name>.ts`. Hooks are the **only** layer components consume — components never import stores or services directly. A hook composes one or more stores, calls service actions, and exposes derived/computed values ready for the UI.

### Architecture position

```
component  →  hook  →  store (local/MMKV state)  →  service  →  Supabase / device APIs
```

A hook may also call a service directly for one-shot reads, but any persisted state belongs in a store.

### Full hook template

```ts
import { useMemo } from 'react';
import { use<Store>Store } from '@/stores/<store>.store';
import type { /* domain types */ } from '@/types';

export function use<PascalCaseName>() {
  // 1. Pull state + actions from store(s). Use selectors to avoid re-renders.
  const value = use<Store>Store((s) => s.value);
  const action = use<Store>Store((s) => s.action);

  // 2. Compute derived values (memoize anything non-trivial)
  const derived = useMemo(() => {
    return value; // transform here
  }, [value]);

  // 3. Return a flat, component-friendly API
  return {
    value,
    derived,
    action,
  };
}
```

### Reference implementation (`use-writing-session`)

```ts
import { useWritingStore } from '@/stores/writing.store';
import { useAuthStore } from '@/stores/auth.store';

export function useWritingSession() {
  const sessionWordCount = useWritingStore((s) => s.sessionWordCount);
  const addWords = useWritingStore((s) => s.addWords);
  const goalMet = useWritingStore((s) => s.goalMet);
  const dailyGoal = useAuthStore((s) => s.user?.dailyGoalWords ?? 500);

  const progress = Math.min(sessionWordCount / dailyGoal, 1);

  return {
    wordCount: sessionWordCount,
    progress,
    goalMet,
    addWords,
    canFeedMonster: goalMet,
  };
}
```

### When `--service <name>` is provided

For data the store doesn't already hold, call the service inside an action and surface loading/error state. Keep the `{ data, error }` tuple contract from the service layer:

```ts
const refresh = async () => {
  const { data, error } = await <name>Service.getByUserId(userId);
  if (error) {
    set<Error>(error.message);
    return;
  }
  set<Name>(data);
};
```

Prefer routing async work through a store action (offline-first, optimistic update) rather than calling the service straight from the hook.

### The 4 planned hooks

| Hook                  | Composes                       | Exposes                                                 |
| --------------------- | ------------------------------ | ------------------------------------------------------- |
| `use-auth`            | `auth.store` + `auth.service`  | `user`, `session`, `isAuthenticated`, `signIn`, `signOut` |
| `use-monster`         | `monster.store`                | `monster`, `mood`, `isHungry`, `feed`, `evolutionStage` |
| `use-writing-session` | `writing.store` + `auth.store` | `wordCount`, `progress`, `goalMet`, `addWords`, `canFeedMonster` |
| `use-notifications`   | `notifications.service`        | `permission`, `requestPermission`, `scheduleReminder`   |

## Conventions checklist

- [ ] File at `hooks/use-<name>.ts`, kebab-case, `use-` prefix
- [ ] Exported as a named function `use<PascalCaseName>` (not default)
- [ ] Composes stores/services — never calls Supabase directly
- [ ] Uses store selectors (`useStore((s) => s.x)`) to minimize re-renders
- [ ] Derived values memoized with `useMemo` when non-trivial
- [ ] `@/` imports only; domain types from `@/types`
- [ ] Returns a flat object — no nested store internals leaked to components
- [ ] No JSX — hooks return data/handlers, not UI
