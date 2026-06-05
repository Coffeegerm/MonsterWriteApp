# Architecture

This document describes the project structure and conventions for MonsterWrite. All implementation decisions should follow these patterns.

---

## Directory Structure

```text
app/                        # Expo Router screens (file-based routing)
  (tabs)/                   # Bottom tab group — Home, Write, Monster, Profile
  (auth)/                   # Auth flow screens (sign-in, onboarding)
  monster/[id].tsx          # Dynamic monster detail screen
  modal.tsx                 # Shared modal screen
  _layout.tsx               # Root Stack navigator + ThemeProvider
components/
  ui/                       # Design system primitives (Button, Card, Input, etc.)
  monsters/                 # Monster display, mood state visuals, animations
  writing/                  # Editor, word counter, progress bar
  shared/                   # App-wide reuse (Badge, StreakDisplay, Avatar, etc.)
stores/                     # Zustand global state slices
  auth.store.ts
  monster.store.ts
  writing.store.ts
  ui.store.ts
services/                   # External integrations (never called directly from components)
  supabase.ts               # Supabase client init + typed query helpers
  auth.service.ts           # Apple/email sign-in, session management
  monster.service.ts        # Monster state mutations, mood logic
  notifications.service.ts  # Push notification scheduling
  purchases.service.ts      # RevenueCat in-app purchases
lib/                        # Pure utility functions, no side effects
  word-counter.ts           # Word counting algorithm
  streak.ts                 # Streak and evolution stage calculations
  date.ts                   # Timezone-aware date helpers
hooks/                      # Domain-specific React hooks (compose stores + services)
  use-auth.ts
  use-monster.ts
  use-writing-session.ts
  use-notifications.ts
types/                      # Shared TypeScript interfaces and types
  monster.ts
  user.ts
  writing.ts
  supabase.ts               # Database row types (generated or hand-written)
constants/
  theme.ts                  # Colors and Fonts design tokens
assets/
  images/                   # PNG icons, splash, app icon
  animations/               # Lottie JSON files for monster animations
```

---

## Navigation

**Expo Router 6** with typed routes enabled (`expo-router/entry` entrypoint).

- Root `Stack` navigator in `app/_layout.tsx` — no header shown on `(tabs)`
- `(tabs)/` group — bottom tab navigator with `HapticTab` buttons
  - Planned tabs: **Home**, **Write**, **Monster**, **Profile**
- `(auth)/` group — sign-in and onboarding screens, separate from tabs
- `app/modal.tsx` — overlay screen accessible from anywhere via `router.push('/modal')`
- Deep links handled via `expo-linking` (configured in `app.json`)

Navigation is type-safe. Use `router.push()` / `router.replace()` from `expo-router`; never pass untyped strings.

---

## State Management

State lives in **Zustand** stores under `stores/`. Each store defines state and actions together in a single file — no separate selectors files.

| Store              | State                                            | Key Actions                     |
| ------------------ | ------------------------------------------------ | ------------------------------- |
| `auth.store.ts`    | `session`, `user`                                | `signIn()`, `signOut()`         |
| `monster.store.ts` | `monster` (mood, hunger, streak, evolutionStage) | `feedMonster()`, `updateMood()` |
| `writing.store.ts` | `todayWordCount`, `sessionWordCount`, `goalMet`  | `addWords()`, `resetSession()`  |
| `ui.store.ts`      | `toasts`, `activeModal`                          | `showToast()`, `openModal()`    |

**Persistence:** Zustand `persist` middleware with a custom MMKV storage adapter — do not use AsyncStorage. Auth session, monster state, and today's progress survive app restarts without a network call.

---

## Data Layer

### Remote — Supabase

Auth: email + Apple Sign-In via `expo-apple-authentication`.

Core tables:

| Table              | Key Columns                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| `users`            | id, email, display_name, daily_goal                                         |
| `monsters`         | id, user_id, name, type, mood, hunger, streak, evolution_stage, last_fed_at |
| `writing_sessions` | id, user_id, date, word_count, content (nullable), created_at               |
| `streaks`          | id, user_id, current_streak, longest_streak, last_active_date               |

All Supabase queries go through `services/` — components never import `supabase` directly.

### Local — MMKV

Used for Zustand persistence and any other fast key-value storage (user preferences, cached monster state). **Offline-first:** write to local state first, sync to Supabase in the background.

---

## Styling

- **NativeWind** (Tailwind CSS) is the primary styling tool — use utility classes in JSX.
- **`constants/theme.ts`** for `Colors` and `Fonts` tokens used in the navigation theme and legacy `StyleSheet` code.
- **Platform files:** use `.ios.tsx` / `.web.ts` suffixes for platform-specific implementations.
- **Light/dark mode:** `useColorScheme()` hook + Tailwind `dark:` variant.

Brand colors are defined in `tailwind.config.js` as custom theme extensions:

| Token           | Hex     | Usage                                  |
| --------------- | ------- | -------------------------------------- |
| `inkwell`       | #1A1625 | Primary dark background                |
| `dusk-plum`     | #2D2440 | Secondary background, cards            |
| `parchment`     | #F2EDE4 | Light mode background, writing surface |
| `monster-green` | #5BF178 | Success, goal met, fed state           |
| `hungry-orange` | #FF7B3A | Warning, hungry monster state          |
| `happy-gold`    | #FFD166 | Streaks, achievements, milestones      |
| `sad-blue`      | #7CA5D4 | Sad/missed day monster state           |
| `mystic-violet` | #B388FF | Accents, evolution events              |

---

## Domain Types

Defined in `types/`. Import from here — never inline domain types in component files.

```typescript
// types/monster.ts
type MonsterType = "blobbsworth" | "grimble" | "wisper" | "myco" | "cindra";
type MoodState = "ecstatic" | "happy" | "neutral" | "sad" | "distressed";
type EvolutionStage = "hatchling" | "companion" | "elder";

interface Monster {
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
interface WritingSession {
  id: string;
  userId: string;
  date: string; // ISO date string YYYY-MM-DD
  wordCount: number;
  content?: string; // null if user opted not to save
  createdAt: string;
}

interface DailyProgress {
  date: string;
  wordCount: number;
  goalMet: boolean;
  sessions: WritingSession[];
}

// types/user.ts
interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  dailyGoal: number; // default: 500
  createdAt: string;
}
```

---

## Hooks Pattern

Hooks in `hooks/` compose stores and services into component-friendly APIs. Components import hooks, not stores directly.

```typescript
// hooks/use-writing-session.ts
export function useWritingSession() {
  const { sessionWordCount, addWords, goalMet } = useWritingStore();
  const dailyGoal = useAuthStore((s) => s.user?.dailyGoal ?? 500);
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

---

## Animations

- **Lottie** (lottie-react-native) for monster mood animations. Files live in `assets/animations/`.
- Naming convention: `[monster-type]-[mood].json` — e.g., `blobbsworth-happy.json`, `grimble-distressed.json`
- **Reanimated** for UI transitions: word count progress bars, feed button burst, tab transitions.
- Idle animations (subtle loops) are distinct Lottie files from reaction animations (one-shot).

---

## Environment Variables

Supabase URL and anon key are stored as EAS Secrets and exposed via `app.json` `extra` field. Never hard-code credentials.

```typescript
import Constants from "expo-constants";

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string;
```

---

## Path Aliases

The `@/` alias maps to the project root (configured in `tsconfig.json`). Always use it for imports:

```typescript
import { useMonster } from "@/hooks/use-monster";
import { Monster } from "@/types/monster";
import { Colors } from "@/constants/theme";
```
