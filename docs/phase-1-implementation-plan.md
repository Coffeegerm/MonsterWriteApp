# MonsterWrite — Phase 1 Implementation Plan

> **Purpose:** A task-by-task guide for building the core loop of MonsterWrite. Each task specifies the files to create or modify, what goes in them, and acceptance criteria. Follow tasks in order — later tasks depend on earlier ones.
>
> **Phase 1 Goal:** A working app where a user can sign up, write daily toward a customizable word goal, auto-feed their monster when the goal is met, see the monster react to their habits, track streaks on a calendar heatmap, and earn milestone badges.

---

## Prerequisites

Before starting any tasks, ensure the following are in place:

- Expo project initialized (already done — `MonsterWriteApp/` exists)
- Node modules installed (`npm install` in `MonsterWriteApp/`)
- A Supabase project created with URL and anon key ready
- Environment variables configured in `app.json` → `extra` field

---

## ✅ Task 1: Project Foundation — Dependencies & Configuration

### Install dependencies

```bash
npx expo install expo-router expo-linking expo-constants expo-status-bar
npx expo install @supabase/supabase-js expo-apple-authentication expo-crypto expo-secure-store
npx expo install zustand react-native-mmkv
npx expo install nativewind tailwindcss
npx expo install react-native-reanimated lottie-react-native
npx expo install expo-notifications expo-device
npx expo install react-native-svg
```

### Files to create/modify

| File                 | Action | Purpose                                                                                                                                                        |
| -------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tailwind.config.js` | Modify | Add brand color tokens (inkwell, dusk-plum, parchment, monster-green, hungry-orange, happy-gold, sad-blue, mystic-violet) with hex values from architecture.md |
| `tsconfig.json`      | Modify | Ensure `@/` path alias is configured                                                                                                                           |
| `app.json`           | Modify | Add `extra.supabaseUrl` and `extra.supabaseAnonKey` placeholder fields, configure notification permissions                                                     |
| `constants/theme.ts` | Modify | Export `Colors` object with all brand tokens and `Fonts` object. Include light/dark mode variants                                                              |

### Acceptance criteria

- `npx expo start` runs without errors
- All dependencies resolve
- `@/` imports work in TypeScript
- Brand colors accessible via both Tailwind classes and `Colors` constant

---

## ✅ Task 2: TypeScript Types

### Files to create

| File                | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `types/monster.ts`  | Monster domain types                        |
| `types/user.ts`     | User profile types                          |
| `types/writing.ts`  | Writing session and daily progress types    |
| `types/supabase.ts` | Database row types matching Supabase schema |

### Type definitions

**`types/monster.ts`**

```typescript
export type MonsterType =
  | "blobbsworth"
  | "grimble"
  | "wisper"
  | "myco"
  | "cindra";
export type MoodState = "ecstatic" | "happy" | "neutral" | "sad" | "distressed";
export type EvolutionStage = "hatchling" | "companion" | "elder";

export interface Monster {
  id: string;
  userId: string;
  name: string;
  type: MonsterType;
  mood: MoodState;
  hunger: number; // 0–100, 0 = full, 100 = starving
  streak: number;
  evolutionStage: EvolutionStage;
  lastFedAt: string | null; // ISO datetime
  createdAt: string;
}
```

**`types/user.ts`**

```typescript
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  dailyGoal: number; // default: 500, user-configurable
  saveWriting: boolean; // whether to persist writing content
  notificationTime: string | null; // HH:MM format, null = disabled
  createdAt: string;
}
```

**`types/writing.ts`**

```typescript
export interface WritingSession {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  wordCount: number;
  content?: string; // null if user opted out of saving
  createdAt: string;
}

export interface DailyProgress {
  date: string;
  totalWordCount: number;
  goalMet: boolean;
  sessions: WritingSession[];
}
```

**`types/supabase.ts`**

```typescript
// Mirror the Supabase table schemas as Row types
// These should match the exact column names from the database (snake_case)
export interface UsersRow { ... }
export interface MonstersRow { ... }
export interface WritingSessionsRow { ... }
export interface StreaksRow { ... }
export interface BadgesRow { ... }
```

### Acceptance criteria

- All types compile without errors
- No `any` types used
- Types are importable via `@/types/monster` etc.

---

## ✅ Task 3: Supabase Setup & Auth Service

### Supabase tables to create (document the SQL for reference)

```sql
-- users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users(id) primary key,
  email text not null,
  display_name text not null default '',
  daily_goal integer not null default 500,
  save_writing boolean not null default true,
  notification_time text,
  created_at timestamptz not null default now()
);

-- monsters table
create table public.monsters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) not null,
  name text not null default 'Monster',
  type text not null,
  mood text not null default 'happy',
  hunger integer not null default 0,
  streak integer not null default 0,
  evolution_stage text not null default 'hatchling',
  last_fed_at timestamptz,
  created_at timestamptz not null default now()
);

-- writing_sessions table
create table public.writing_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) not null,
  date date not null,
  word_count integer not null default 0,
  content text,
  created_at timestamptz not null default now()
);

-- streaks table
create table public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) not null unique,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active_date date
);

-- badges table
create table public.badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) not null,
  badge_type text not null,
  earned_at timestamptz not null default now(),
  unique(user_id, badge_type)
);
```

Enable Row Level Security on all tables. Each table gets a policy: `auth.uid() = user_id`.

### Files to create

| File                       | Purpose                                               |
| -------------------------- | ----------------------------------------------------- |
| `services/supabase.ts`     | Supabase client initialization with typed helpers     |
| `services/auth.service.ts` | Sign-in (Apple + email), sign-out, session management |

### `services/supabase.ts` details

- Initialize Supabase client using `Constants.expoConfig.extra` values
- Use `expo-secure-store` as the auth storage adapter (not AsyncStorage)
- Export typed query helpers for each table
- Never export the raw client — only typed functions

### `services/auth.service.ts` details

- `signInWithApple()` — uses `expo-apple-authentication` → passes credential to Supabase
- `signInWithEmail(email, password)` — Supabase email auth
- `signUp(email, password, displayName)` — creates auth user + inserts into `public.users`
- `signOut()` — clears session, resets local stores
- `getSession()` — returns current Supabase session
- `onAuthStateChange(callback)` — subscribes to auth state changes

### Acceptance criteria

- Supabase client connects successfully
- User can sign up with email and appear in both `auth.users` and `public.users`
- Apple Sign-In flow works on iOS
- Session persists across app restarts via secure store
- RLS prevents users from reading other users' data

---

## ✅ Task 4: Zustand Stores with MMKV Persistence

### Files to create

| File                      | Purpose                                             |
| ------------------------- | --------------------------------------------------- |
| `stores/auth.store.ts`    | Auth session and user profile state                 |
| `stores/monster.store.ts` | Monster state, mood, hunger, streak                 |
| `stores/writing.store.ts` | Today's writing progress, session management        |
| `stores/ui.store.ts`      | Toasts, modals, loading states                      |
| `lib/mmkv-storage.ts`     | MMKV storage adapter for Zustand persist middleware |

### Store specifications

**`stores/auth.store.ts`**

- State: `session`, `user: UserProfile | null`, `isLoading`
- Actions: `setSession()`, `setUser()`, `updateDailyGoal(goal: number)`, `clearAuth()`
- Persisted via MMKV

**`stores/monster.store.ts`**

- State: `monster: Monster | null`, `isFeedingAnimation: boolean`
- Actions: `setMonster()`, `feedMonster()` (sets mood to happy, resets hunger, updates lastFedAt, increments streak), `updateMood()` (recalculates based on time since last fed), `clearMonster()`
- Persisted via MMKV
- `feedMonster()` is called automatically when goal is met (auto-feed behavior)

**`stores/writing.store.ts`**

- State: `todayWordCount: number`, `dailyGoal: number`, `goalMet: boolean`, `sessions: WritingSession[]`, `currentSessionContent: string`
- Actions: `addWords(count: number)`, `setContent(text: string)`, `saveSession()`, `resetDay()`, `loadTodayProgress()`
- Persisted via MMKV
- `addWords()` should check if `todayWordCount >= dailyGoal` and if so, set `goalMet = true` and trigger the auto-feed flow

**`stores/ui.store.ts`**

- State: `toasts: Toast[]`, `activeModal: string | null`
- Actions: `showToast()`, `dismissToast()`, `openModal()`, `closeModal()`
- NOT persisted

### Acceptance criteria

- Stores survive app restart (check MMKV persistence)
- Writing progress accumulates across multiple sessions in a single day
- `goalMet` flips to `true` at exactly the daily goal threshold
- Auto-feed triggers monster store update when goal is met
- Day reset works correctly at midnight (or app open after midnight)

---

## ✅ Task 5: Utility Libraries

### Files to create

| File                  | Purpose                                           |
| --------------------- | ------------------------------------------------- |
| `lib/word-counter.ts` | Word counting algorithm                           |
| `lib/streak.ts`       | Streak calculation and evolution stage logic      |
| `lib/date.ts`         | Timezone-aware date helpers                       |
| `lib/mood-engine.ts`  | Monster mood calculation based on feeding history |
| `lib/badges.ts`       | Badge definitions and earning logic               |

### Specifications

**`lib/word-counter.ts`**

- `countWords(text: string): number` — splits on whitespace, filters empty strings, returns count
- Should handle edge cases: multiple spaces, newlines, tabs, leading/trailing whitespace
- Should NOT count empty strings or whitespace-only input as words

**`lib/streak.ts`**

- `calculateStreak(lastActiveDate: string | null, today: string): { current: number, isActive: boolean }` — determines if streak continues or resets
- `getEvolutionStage(streak: number): EvolutionStage` — hatchling (0-6), companion (7-29), elder (30+)
- `shouldEvolve(oldStreak: number, newStreak: number): boolean` — returns true if crossing an evolution boundary

**`lib/date.ts`**

- `getToday(): string` — returns YYYY-MM-DD in user's local timezone
- `isSameDay(date1: string, date2: string): boolean`
- `isYesterday(date: string): boolean`
- `daysBetween(date1: string, date2: string): number`
- `getDateRange(startDate: string, days: number): string[]` — for calendar heatmap

**`lib/mood-engine.ts`**

- `calculateMood(lastFedAt: string | null, currentStreak: number): MoodState`
  - Fed today → "ecstatic" (if streak >= 7) or "happy"
  - 1 day missed → "neutral"
  - 2-3 days missed → "sad"
  - 4+ days missed → "distressed"
- `calculateHunger(lastFedAt: string | null): number` — 0-100 scale, increases ~20 per missed day
- Mood updates immediately when fed (instant gratification)

**`lib/badges.ts`**

- Badge type definitions:
  - `streak_7` — 7-day writing streak
  - `streak_30` — 30-day writing streak
  - `words_10k` — 10,000 total words written
  - `words_50k` — 50,000 total words written
  - `first_feed` — Fed your monster for the first time
  - `first_evolution` — Monster evolved for the first time
- `checkNewBadges(stats: UserStats, existingBadges: string[]): string[]` — returns newly earned badge types
- Badge metadata: `getBadgeInfo(type: string): { name, description, icon }` — for display

### Acceptance criteria

- Word counter handles all whitespace edge cases correctly
- Streak logic correctly handles: first day, consecutive days, 1-day gap (resets), same-day multiple feeds
- Mood engine returns correct mood for each missed-day threshold
- Badge checker returns only NEW badges (not already earned ones)
- All functions are pure (no side effects) and unit-testable

---

## ✅ Task 6: Navigation Structure — Four Tabs

### Files to modify/create

| File                            | Action | Purpose                                                                          |
| ------------------------------- | ------ | -------------------------------------------------------------------------------- |
| `app/_layout.tsx`               | Modify | Root Stack navigator with `(tabs)` and `(auth)` groups, ThemeProvider, auth gate |
| `app/(tabs)/_layout.tsx`        | Modify | Bottom tab navigator with 4 tabs: Home, Write, Monster, Profile                  |
| `app/(tabs)/index.tsx`          | Modify | Home tab (dashboard)                                                             |
| `app/(tabs)/write.tsx`          | Create | Write tab (editor)                                                               |
| `app/(tabs)/monster.tsx`        | Create | Monster tab                                                                      |
| `app/(tabs)/profile.tsx`        | Create | Profile tab (stats + settings)                                                   |
| `app/(auth)/sign-in.tsx`        | Create | Sign-in screen                                                                   |
| `app/(auth)/sign-up.tsx`        | Create | Sign-up screen                                                                   |
| `app/(auth)/choose-monster.tsx` | Create | Monster selection during onboarding                                              |
| `app/(auth)/_layout.tsx`        | Create | Auth stack layout                                                                |

Remove the existing `explore.tsx` tab — it's boilerplate from Expo template.

### Navigation behavior

- **Root layout** checks auth state:
  - No session → show `(auth)` group
  - Has session but no monster → redirect to `choose-monster`
  - Has session and monster → show `(tabs)` group
- **Tab bar** uses brand colors:
  - Active tab: `monster-green` (#5BF178)
  - Inactive tab: muted gray
  - Tab bar background: `inkwell` (#1A1625) in dark mode, `parchment` (#F2EDE4) in light
- **Tab icons** — use simple SVG icons or expo vector icons:
  - Home: house icon
  - Write: pencil/edit icon
  - Monster: creature/paw icon
  - Profile: user icon

### Acceptance criteria

- Four tabs render with correct icons and labels
- Tab navigation works smoothly
- Auth gate redirects unauthenticated users to sign-in
- New users without a monster are sent to monster selection
- No remnants of Expo boilerplate (explore tab removed)

---

## ✅ Task 7: Auth Screens

### Files to create/modify

| File                            | Purpose                                              |
| ------------------------------- | ---------------------------------------------------- |
| `app/(auth)/sign-in.tsx`        | Email + Apple sign-in                                |
| `app/(auth)/sign-up.tsx`        | Email registration with display name                 |
| `app/(auth)/choose-monster.tsx` | Onboarding monster picker                            |
| `components/ui/Button.tsx`      | Reusable button component (used across auth and app) |
| `components/ui/Input.tsx`       | Reusable text input component                        |

### Sign-in screen

- App logo/title at top
- Email + password fields
- "Sign In" button
- "Sign in with Apple" button (uses `expo-apple-authentication`)
- Link to sign-up screen
- Background: `parchment` (light) / `inkwell` (dark)

### Sign-up screen

- Display name, email, password fields
- "Create Account" button
- Link back to sign-in
- On success: creates user in Supabase → navigates to `choose-monster`

### Choose monster screen

- Display 5 monster options in a horizontal scroll or grid:
  - **Blobbsworth** — Friendly Blob, cheerful and encouraging
  - **Grimble** — Grumpy Gremlin, sarcastic but secretly caring
  - **Wisper** — Shy Ghost, gentle and soft-spoken
  - **Myco** — Chill Mushroom, laid-back and philosophical
  - **Cindra** — Energetic Dragon, excitable and fiery
- Each option shows: placeholder SVG art, name, short personality tagline
- User taps to select → "Choose" button confirms
- On confirm: creates monster record in Supabase → navigates to `(tabs)` Home

### Acceptance criteria

- Full sign-up → monster selection → home flow works end to end
- Sign-in with existing account works
- Apple Sign-In works on iOS
- Input validation: email format, password minimum length, display name required
- Error states shown for invalid credentials or network errors

---

## ✅ Task 8: Home Tab — Dashboard

### Files to create

| File                                     | Purpose                                          |
| ---------------------------------------- | ------------------------------------------------ |
| `app/(tabs)/index.tsx`                   | Home dashboard screen                            |
| `components/shared/StreakDisplay.tsx`    | Current streak counter with flame icon           |
| `components/shared/ProgressRing.tsx`     | Circular progress indicator for daily word count |
| `components/monsters/MonsterPreview.tsx` | Small monster display with current mood          |

### Home screen layout (top to bottom)

1. **Greeting section** — "Good morning, {displayName}!" with current date
2. **Monster preview** — medium-sized monster with mood state, name underneath
3. **Today's progress** — circular progress ring showing `todayWordCount / dailyGoal`
   - Text inside ring: "{wordCount} / {goal} words"
   - Ring color: `monster-green` when goal met, `hungry-orange` when in progress, `sad-blue` if no words yet
4. **Streak display** — flame icon + "{streak} day streak" (or "Start your streak!" if 0)
5. **"Start Writing" CTA button** — large, prominent, navigates to Write tab
   - Text changes to "Keep Writing" if some words written today but goal not met
   - Text changes to "Goal Complete!" (disabled style) if already fed today

### Data flow

- On mount: load today's progress from writing store, monster state from monster store
- Recalculate mood on app foreground (in case days were missed while app was closed)
- Pull streak from streak store

### Acceptance criteria

- Dashboard shows correct real-time data for today's progress
- Monster preview reflects current mood state
- CTA button text changes based on daily progress
- Streak counter is accurate
- Screen refreshes when returning from Write tab after writing

---

## ✅ Task 9: Write Tab — The Core Editor

### Files to create

| File                                        | Purpose                                           |
| ------------------------------------------- | ------------------------------------------------- |
| `app/(tabs)/write.tsx`                      | Writing editor screen                             |
| `components/writing/Editor.tsx`             | Plain text editor with word counting              |
| `components/writing/WordCounter.tsx`        | Real-time word count display with progress bar    |
| `components/writing/GoalReachedOverlay.tsx` | Celebration overlay when goal is hit              |
| `hooks/use-writing-session.ts`              | Composes writing store + monster store for editor |

### Editor screen layout

1. **Top bar** — date display, session word count
2. **Progress bar** — horizontal bar showing progress toward daily goal
   - Fills from left to right
   - Color transitions: `sad-blue` (0-25%) → `hungry-orange` (25-75%) → `monster-green` (75-100%)
   - Subtle animation on progress changes
3. **Text editor** — full-screen plain text area
   - Large, comfortable font for writing
   - Placeholder text: "Start writing to feed your monster..."
   - Auto-focus on tab navigation
   - Real-time word counting as user types
4. **Bottom bar** — total today word count display: "{todayTotal} / {goal} words today"

### Word counting behavior

- Use `lib/word-counter.ts` to count words on every text change (debounced at ~300ms for performance)
- Display both **session** word count (this sitting) and **today total** (accumulated)
- Progress bar reflects **today total** against daily goal

### Auto-feed behavior (critical flow)

When `todayWordCount >= dailyGoal` (goal threshold crossed):

1. Progress bar fills to 100% with a satisfying animation
2. Show `GoalReachedOverlay` — a brief (2-3 second) celebration:
   - "Monster Fed!" text with monster-green background burst
   - Small monster happy animation/emoji
   - Auto-dismisses after animation completes
3. Behind the scenes (triggered by writing store):
   - `monster.store.feedMonster()` is called
   - Monster mood → "happy" or "ecstatic"
   - Hunger → 0
   - Streak incremented
   - Writing session saved to Supabase
   - Badge check runs (`lib/badges.ts`)
4. User can continue writing past the goal — extra words still count toward stats

### Session persistence

- Current session text is saved to MMKV on every change (debounced)
- If user leaves Write tab and comes back same day, text is restored
- On day change (midnight), session text clears for the new day
- If `user.saveWriting` is true, content is saved to Supabase `writing_sessions` table
- If false, only the word count is saved (content field = null)

### Multiple sessions per day

- Each time the user opens the editor and writes, it's a new session
- `todayWordCount` accumulates across all sessions
- Previous session content is NOT shown (fresh editor each time), but the progress bar reflects the cumulative count
- Clarification: the current session's content persists if the user tabs away and comes back. It resets when the user explicitly finishes or when a new day starts.

### Acceptance criteria

- Word counter updates in real-time as user types
- Progress bar fills smoothly and changes color at thresholds
- Auto-feed triggers exactly when `todayWordCount` crosses `dailyGoal`
- Celebration overlay appears and auto-dismisses
- Monster store is updated correctly on feed
- Writing past the goal continues to count words
- Session content persists across tab switches
- Multiple sessions in a day accumulate correctly
- Text clears on new day

---

## ✅ Task 10: Monster Tab — Creature Display

### Files to create

| File                                         | Purpose                                          |
| -------------------------------------------- | ------------------------------------------------ |
| `app/(tabs)/monster.tsx`                     | Monster display screen                           |
| `components/monsters/MonsterDisplay.tsx`     | Full-size monster with mood-based visuals        |
| `components/monsters/MoodIndicator.tsx`      | Visual mood state label/icon                     |
| `components/monsters/HungerBar.tsx`          | Hunger level visualization                       |
| `components/monsters/MonsterPlaceholder.tsx` | SVG placeholder art for each monster type × mood |
| `services/monster.service.ts`                | Monster state mutations, sync to Supabase        |

### Monster screen layout

1. **Monster name** — large display of the monster's name (tappable to rename? → no, defer to Phase 2)
2. **Monster art** — large centered display of the monster
   - Shows mood-appropriate placeholder art
   - Subtle idle animation (CSS pulsing/breathing effect or Lottie if available)
3. **Mood indicator** — text label + icon showing current mood
   - Ecstatic: star-eyes emoji + "Ecstatic!"
   - Happy: smile + "Happy"
   - Neutral: neutral face + "Doing okay"
   - Sad: frown + "Hungry..."
   - Distressed: crying + "Very hungry!"
4. **Hunger bar** — horizontal bar, 0 (full) to 100 (starving)
   - Color: `monster-green` (0-30) → `hungry-orange` (30-70) → red (70-100)
5. **Stats summary** — below monster:
   - Current streak: "{n} days"
   - Evolution stage: "Hatchling" / "Companion" / "Elder"
   - Total words fed: "{n} words"
6. **"Write Now" button** — navigates to Write tab (shown only if goal not yet met today)

### Placeholder monster art strategy

Create simple SVG components for each monster type. Each has 5 mood variants (can be as simple as different facial expressions on the same body shape):

- **Blobbsworth** — round blob shape, different mouth/eye expressions per mood
- **Grimble** — angular gremlin, eyebrow positions change with mood
- **Wisper** — ghost shape with opacity/expression changes
- **Myco** — mushroom with cap color/expression changes
- **Cindra** — dragon with flame intensity varying by mood

These are temporary — commissioned art replaces them later. Build the component so swapping in PNG/Lottie assets later is trivial (props-based rendering).

### Mood recalculation

- On screen focus: call `lib/mood-engine.ts` → `calculateMood(lastFedAt, streak)` and update store
- This handles the case where days passed while the app was closed

### Acceptance criteria

- Monster displays correct type chosen during onboarding
- Mood visuals update correctly based on feeding history
- Hunger bar reflects accurate hunger level
- Placeholder SVGs render for all 5 monster types × 5 moods (25 variants)
- Stats are accurate and update after feeding
- Swapping placeholder art for real assets later requires only changing the image source, not the component structure

---

## ✅ Task 11: Profile Tab — Stats, Settings & Badges

### Files to create

| File                                    | Purpose                                        |
| --------------------------------------- | ---------------------------------------------- |
| `app/(tabs)/profile.tsx`                | Profile screen with stats and settings         |
| `components/shared/CalendarHeatmap.tsx` | GitHub-style calendar heatmap for writing days |
| `components/shared/BadgeGrid.tsx`       | Grid display of earned and locked badges       |
| `components/shared/StatCard.tsx`        | Reusable stat display card                     |
| `hooks/use-stats.ts`                    | Aggregates writing data for stats display      |

### Profile screen layout (scrollable)

1. **User info** — display name, email, member since date
2. **Quick stats row** — 3-4 `StatCard` components side by side:
   - Total words written (all time)
   - Current streak
   - Longest streak
   - Total days written
3. **Calendar heatmap** — shows the last 3 months (or 12 weeks)
   - Each day cell is colored by intensity:
     - No writing: empty/gray
     - Wrote but didn't hit goal: light `hungry-orange`
     - Goal met: `monster-green` (intensity increases with words over goal)
   - Today is highlighted/outlined
   - Tappable days show a tooltip: "{date}: {wordCount} words"
4. **Badges section** — grid of badge icons
   - Earned badges: full color with name and date earned
   - Unearned badges: grayed out with "???" or lock icon, name visible
   - Phase 1 badges: `first_feed`, `streak_7`, `streak_30`, `words_10k`, `words_50k`, `first_evolution`
5. **Settings section** — below stats
   - **Daily word goal** — number input, default 500, min 100, max 5000
   - **Save writing content** — toggle (on/off), with explanation text
   - **Notification reminder** — time picker for daily reminder, with on/off toggle
   - **Sign out** button

### Calendar heatmap data

- `hooks/use-stats.ts` queries `writing_sessions` table grouped by date
- Returns: `{ date: string, wordCount: number, goalMet: boolean }[]` for the display range
- Cache locally to avoid re-querying on every tab switch

### Acceptance criteria

- All stats are accurate and derived from real writing session data
- Calendar heatmap renders correctly for the past 12 weeks
- Heatmap colors correctly reflect writing activity
- Badges show earned vs. locked states accurately
- Settings changes (daily goal, save preference, notification time) persist to both local store and Supabase
- Sign out clears all local state and returns to auth screen

---

## ✅ Task 12: Monster Service & Sync Layer

### Files to create

| File                          | Purpose                                   |
| ----------------------------- | ----------------------------------------- |
| `services/monster.service.ts` | Monster CRUD and state sync with Supabase |
| `services/writing.service.ts` | Writing session CRUD and stats queries    |
| `services/streak.service.ts`  | Streak read/write and badge management    |

### `services/monster.service.ts`

- `createMonster(userId, type, name)` → inserts into `monsters` table
- `getMonster(userId)` → fetches user's monster
- `updateMonster(monsterId, updates)` → partial update (mood, hunger, streak, etc.)
- `feedMonster(monsterId)` → sets mood, resets hunger, updates lastFedAt, called by store

### `services/writing.service.ts`

- `saveSession(session: WritingSession)` → inserts into `writing_sessions`
- `getTodaySessions(userId, date)` → fetches all sessions for a given day
- `getSessionsInRange(userId, startDate, endDate)` → for calendar heatmap
- `getTotalWordCount(userId)` → sum of all word counts
- `getTotalDaysWritten(userId)` → count of distinct dates

### `services/streak.service.ts`

- `getStreak(userId)` → fetches current streak record
- `updateStreak(userId, newStreak, longestStreak, lastActiveDate)` → updates streak
- `getBadges(userId)` → fetches all earned badges
- `awardBadge(userId, badgeType)` → inserts badge if not already earned

### Offline-first sync pattern

All writes follow this pattern:

1. Update local Zustand store (via MMKV) immediately — UI reflects change instantly
2. Fire Supabase mutation in the background
3. On failure: queue for retry (simple retry with exponential backoff)
4. On app launch: sync local state with remote (remote wins on conflict for monster/streak, local wins for unsaved sessions)

### Acceptance criteria

- All CRUD operations work against Supabase
- Local-first: UI updates before network call completes
- App works offline (reads from local state, queues writes)
- No data loss on poor network conditions
- Conflict resolution is predictable

---

## ✅ Task 13: Push Notifications

### Files to create

| File                                | Purpose                                      |
| ----------------------------------- | -------------------------------------------- |
| `services/notifications.service.ts` | Push notification scheduling and permissions |
| `hooks/use-notifications.ts`        | Hook for notification setup in app lifecycle |

### Notification behavior

- On first launch: request notification permissions
- If user sets a reminder time in Profile settings:
  - Schedule a daily local notification at that time
  - Notification text varies by monster mood:
    - Happy: "Your monster is well-fed! Keep the streak going today."
    - Neutral: "Time to write! Your monster is waiting."
    - Sad: "Your monster is getting hungry... come write!"
    - Distressed: "Your monster really misses you! Even a few words help."
- If user turns off notifications: cancel all scheduled
- Reschedule on app launch (in case OS cleared them)

### Implementation

- Use `expo-notifications` for local scheduled notifications
- Store notification preference in user profile (both local and Supabase)
- No server-side push needed for Phase 1 — all local scheduling

### Acceptance criteria

- Permission request shows on first launch
- Daily notification fires at the user-configured time
- Notification text reflects current monster mood
- Turning off notifications cancels scheduled ones
- Changing time reschedules correctly

---

## ✅ Task 14: Daily Reset & App Lifecycle Logic

### Files to create/modify

| File                         | Purpose                                         |
| ---------------------------- | ----------------------------------------------- |
| `hooks/use-app-lifecycle.ts` | Handles app foreground, day changes, state sync |
| Modify `app/_layout.tsx`     | Wire up lifecycle hook at root level            |

### Day change logic

When the app comes to the foreground or on an interval check:

1. Check if today's date (local timezone) differs from the stored "last active date"
2. If new day detected:
   - Save any unsaved writing session from yesterday
   - Reset `writing.store` for the new day (clear content, reset session word count, keep todayWordCount at 0)
   - Recalculate monster mood based on whether yesterday's goal was met
   - If yesterday's goal was met: streak continues (or increment if not already counted)
   - If yesterday's goal was NOT met: streak resets to 0
   - Update streak in store and Supabase
   - Check for any newly earned badges
   - Reschedule notifications with updated mood text

### App launch sync

On app start (after auth is confirmed):

1. Fetch latest monster state from Supabase
2. Fetch today's sessions from Supabase
3. Reconcile with local MMKV state (take whichever has more progress)
4. Recalculate mood
5. Update local stores

### Acceptance criteria

- Day transitions are seamless (no stale data from yesterday)
- Streak correctly increments on consecutive fed days
- Streak correctly resets after a missed day
- App launch syncs local and remote state without data loss
- Monster mood is accurate after being away from the app for multiple days

---

## ✅ Task 15: Placeholder Monster SVG Art

### Files to create

| File                                      | Purpose                                           |
| ----------------------------------------- | ------------------------------------------------- |
| `assets/monsters/blobbsworth.tsx`         | SVG component for Blobbsworth (5 mood variants)   |
| `assets/monsters/grimble.tsx`             | SVG component for Grimble (5 mood variants)       |
| `assets/monsters/wisper.tsx`              | SVG component for Wisper (5 mood variants)        |
| `assets/monsters/myco.tsx`                | SVG component for Myco (5 mood variants)          |
| `assets/monsters/cindra.tsx`              | SVG component for Cindra (5 mood variants)        |
| `components/monsters/MonsterRenderer.tsx` | Takes `type` + `mood` props → renders correct SVG |

### Design approach

Each monster SVG is a single React Native SVG component that accepts a `mood: MoodState` prop and renders the appropriate variant. Keep them simple but charming:

- Use `react-native-svg` for rendering
- Each monster should be recognizable and have a distinct silhouette
- Mood changes should be primarily facial expression changes (eyes, mouth) for simplicity
- Use brand colors from the theme
- Target size: 200x200 points, scalable

### `MonsterRenderer.tsx`

```typescript
interface MonsterRendererProps {
  type: MonsterType;
  mood: MoodState;
  size?: number; // default 200
}
```

This is the single component used everywhere monsters are displayed. Swapping from placeholder SVGs to commissioned PNG/Lottie art later requires only changing the internals of this component.

### Acceptance criteria

- All 25 variants render (5 types × 5 moods)
- Monsters are visually distinct from each other
- Mood states are visually distinguishable within each monster
- Component is reusable at different sizes
- Architecture allows easy swap to real art assets

---

## Task 16: Integration Testing & Polish

### Verify these end-to-end flows

**Flow 1: New user onboarding**

1. Open app → sign-up screen
2. Create account → choose monster screen
3. Pick Blobbsworth → Home tab with dashboard
4. Monster shows "happy" mood, streak at 0

**Flow 2: Daily writing core loop**

1. Home tab shows 0/500 progress
2. Tap "Start Writing" → Write tab
3. Type 500+ words → auto-feed triggers
4. Celebration overlay appears and dismisses
5. Monster tab shows "happy" or "ecstatic" mood, hunger at 0
6. Home tab shows completed state
7. Profile tab shows 1-day streak, calendar dot for today

**Flow 3: Multiple sessions in a day**

1. Write 200 words → tab away
2. Come back → editor is fresh but progress bar shows 200/{goal}
3. Write 300+ more words → goal met, auto-feed triggers

**Flow 4: Missed day decay**

1. (Simulate by setting lastFedAt to 2 days ago)
2. Open app → monster shows "sad" mood
3. Hunger bar is elevated
4. Streak has reset to 0

**Flow 5: Streak and badges**

1. Feed monster 7 days in a row
2. Streak counter shows 7
3. "7-Day Streak" badge appears in Profile
4. Monster evolves from Hatchling to Companion

**Flow 6: Settings changes**

1. Change daily goal from 500 to 250 in Profile
2. Write tab now shows progress toward 250
3. Toggle save writing off → sessions save word count but not content

### Polish items

- Ensure keyboard avoidance works correctly on Write tab
- Tab bar doesn't overlap editor content
- Loading states while Supabase syncs
- Error toasts for network failures
- Smooth tab transitions
- Dark mode works across all screens

### Acceptance criteria

- All 6 flows pass without errors
- No crashes on common interaction patterns
- Offline usage works (writes queue, sync on reconnect)
- Dark mode is consistent across all screens

---

## Task Dependency Order

```
Task 1:  Dependencies & Config          (no dependencies)
Task 2:  TypeScript Types                (no dependencies)
Task 3:  Supabase & Auth Service         (depends on 1, 2)
Task 4:  Zustand Stores                  (depends on 2)
Task 5:  Utility Libraries               (depends on 2)
Task 6:  Navigation Structure            (depends on 1, 3, 4)
Task 7:  Auth Screens                    (depends on 3, 6)
Task 8:  Home Tab                        (depends on 4, 5, 6, 15)
Task 9:  Write Tab — Core Editor         (depends on 4, 5, 6)
Task 10: Monster Tab                     (depends on 4, 5, 6, 15)
Task 11: Profile Tab                     (depends on 4, 5, 6)
Task 12: Monster & Writing Services      (depends on 3, 4, 5)
Task 13: Push Notifications              (depends on 4, 12)
Task 14: App Lifecycle & Day Reset       (depends on 4, 5, 12)
Task 15: Placeholder Monster SVGs        (depends on 2)
Task 16: Integration Testing             (depends on ALL)
```

**Recommended build order for Claude Code sessions:**

1. Tasks 1, 2 (foundation — do together)
2. Tasks 3, 4, 5, 15 (services, stores, libs, art — can parallelize)
3. Task 6 (navigation wiring)
4. Tasks 7, 8, 9, 10, 11 (screens — can parallelize)
5. Tasks 12, 13, 14 (backend sync, notifications, lifecycle)
6. Task 16 (integration testing)

---

## Out of Scope for Phase 1

These are explicitly NOT included and should not be built:

- Monster naming (Phase 2)
- Monster evolution animations (Phase 2)
- Rich text or markdown editor
- Writing prompts
- Journal browsing / past entry viewer
- Social features (leaderboards, buddies)
- Cosmetic shop / in-app purchases
- Onboarding tutorial walkthrough
- App Store / Play Store submission
- Analytics tracking (Mixpanel/PostHog)
- Streak recovery / grace periods

---

## Key Technical Decisions Summary

| Decision      | Choice                           | Rationale                                              |
| ------------- | -------------------------------- | ------------------------------------------------------ |
| Editor type   | Plain text                       | Fastest to build, keeps focus on word count habit      |
| Tab layout    | Home / Write / Monster / Profile | Matches architecture doc, clear separation of concerns |
| Feed mechanic | Auto-feed on goal reached        | Less friction, immediate gratification                 |
| Auth timing   | Phase 1 includes auth            | Avoid painful data migration later                     |
| Sessions      | Multiple per day, cumulative     | Flexible for writers who write in bursts               |
| Mood updates  | Immediate on feed                | Instant feedback loop, decay on app open               |
| Word goal     | Customizable (default 500)       | Respects different writer preferences                  |
| Home tab      | Dashboard overview               | One-glance status + clear CTA                          |
| Notifications | Included in Phase 1              | Critical for retention, project plan scope             |
| Stats scope   | Calendar heatmap + badges        | Full Phase 1 per project plan                          |
| Monster art   | SVG placeholders                 | Unblocks development, easy to swap later               |
| Plan detail   | Task-by-task with file paths     | Maximum clarity for Claude Code execution              |
