# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MonsterWrite is a Tamagotchi-style writing habit tracker built with React Native (Expo). Users write at least 500 words/day to feed and evolve a virtual monster. See `../project-plan.md` for full product roadmap and phase breakdown. Read this file at the start of every conversation.

When making design considerations always looks to `../brand-design-guidelines.md` for tone, style, and UX guidance. When making implementation decisions, refer to `../architecture.md` for project structure and conventions.

## Commands

```bash
# Start development server
npm start

# Run on specific platforms
npm run ios
npm run android
npm run web

# Lint
npm run lint

# Reset to blank project (moves starter code to app-example/)
npm run reset-project
```

## Architecture

**Framework:** Expo (SDK 54) with Expo Router for file-based navigation. React 19, React Native 0.81.

**Navigation structure** (`app/` directory):

- `_layout.tsx` — root Stack navigator, wraps everything in `ThemeProvider`
- `(tabs)/` — bottom tab navigator (current tabs: Home, Explore — expand to Write / Monster / Profile per plan)
- `modal.tsx` — modal screen accessible from any tab

**Styling:** NativeWind (Tailwind CSS for React Native) + `constants/theme.ts` for design tokens (`Colors`, `Fonts`). Use NativeWind utility classes first; fall back to `StyleSheet` only when needed. The `useColorScheme` hook and `Colors` object handle light/dark mode.

**State management:** Zustand (installed, not yet wired up). All global state should go through Zustand stores.

**Backend:** Supabase (`@supabase/supabase-js` installed). Handles auth (email + Apple Sign-In via `expo-apple-authentication`) and data persistence.

**Local storage:** `react-native-mmkv` for fast synchronous key-value storage (offline caching, user preferences).

**Animations:** Lottie (`lottie-react-native`) for monster animations; `react-native-reanimated` for UI transitions.

**Payments:** RevenueCat (`react-native-purchases`) for in-app purchases (cosmetics shop, future premium tier).

**Analytics:** PostHog (`posthog-react-native`).

**Push notifications:** `expo-notifications`.

## Key Conventions

- Path alias `@/` maps to the project root (configured in `tsconfig.json`)
- Component filenames use kebab-case (e.g., `themed-text.tsx`, `haptic-tab.tsx`)
- Platform-specific files use `.ios.tsx` / `.web.ts` suffixes (e.g., `icon-symbol.ios.tsx`)
- `components/ui/` — low-level UI primitives
- `hooks/` — custom React hooks
- `constants/` — static config (theme tokens, etc.)

## Tech Stack

See `../docs/tech-stack.md` for the full tech stack.
