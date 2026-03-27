# new-service

Create a new service file for MonsterWrite's data/backend layer.

## Usage

```
/new-service <service-name>
```

Examples:
- `/new-service monster` → `services/monster.service.ts`
- `/new-service auth` → `services/auth.service.ts`
- `/new-service writing` → `services/writing.service.ts`
- `/new-service notifications` → `services/notifications.service.ts`

## What I do

Create `services/<name>.service.ts` — the layer between Zustand stores and Supabase/device APIs. Components and stores never call Supabase directly.

### Full service template

```ts
import { supabase } from '@/lib/supabase';
import type { /* relevant types */ } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

// Service-specific input/output types if needed
type ServiceResult<T> = { data: T; error: null } | { data: null; error: Error };

// ─── <Name>Service ────────────────────────────────────────────────────────────

export const <name>Service = {

  async get(id: string): Promise<ServiceResult<<Type>>> {
    const { data, error } = await supabase
      .from('<table>')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data, error: null };
  },

  async create(input: Omit<<Type>, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceResult<<Type>>> {
    const { data, error } = await supabase
      .from('<table>')
      .insert(input)
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data, error: null };
  },

  async update(id: string, input: Partial<<Type>>): Promise<ServiceResult<<Type>>> {
    const { data, error } = await supabase
      .from('<table>')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data, error: null };
  },

  async delete(id: string): Promise<ServiceResult<void>> {
    const { error } = await supabase
      .from('<table>')
      .delete()
      .eq('id', id);

    if (error) return { data: null, error: new Error(error.message) };
    return { data: undefined, error: null };
  },

};
```

### Supabase client setup (create if missing)

`lib/supabase.ts` should exist:

```ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: /* MMKV adapter */ undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### The 4 planned services

| Service | Supabase tables | Key methods |
|---|---|---|
| `auth.service` | `users` (via Supabase Auth) | `signIn`, `signUp`, `signOut`, `getSession`, `onAuthStateChange` |
| `monster.service` | `monsters` | `getByUserId`, `create`, `update`, `feedMonster` |
| `writing.service` | `writing_sessions`, `streaks` | `createSession`, `getTodaysSessions`, `getStreak`, `updateStreak` |
| `notifications.service` | — (device API) | `scheduleDailyReminder`, `cancelAll`, `requestPermissions` |

### Error handling pattern

Always return `{ data, error }` tuples — never throw. Stores handle error display:

```ts
// In store action:
const { data, error } = await monsterService.update(id, { hunger: 100 });
if (error) {
  set({ syncError: error.message });
  return;
}
set({ monster: data, isSyncing: false });
```

### Offline-first pattern

Services handle remote sync. Stores update local (MMKV) state immediately, then call service in background:

```ts
// Pattern: optimistic update → remote sync
updateMood: async (newMood: MoodState) => {
  // 1. Update local state immediately
  set((state) => ({ monster: { ...state.monster!, moodState: newMood } }));
  // 2. Sync to Supabase in background
  const { error } = await monsterService.update(get().monster!.id, { moodState: newMood });
  if (error) console.warn('Sync failed, will retry:', error.message);
},
```

## Conventions checklist

- [ ] File at `services/<name>.service.ts`
- [ ] All Supabase calls here — never in components or directly in stores
- [ ] Return `{ data, error }` tuples — never throw
- [ ] Type all inputs/outputs using `@/types` domain types
- [ ] `@/` imports only
- [ ] No React imports — services are pure TS modules
- [ ] Export as a named const object (not a class)
