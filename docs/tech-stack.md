> Cross-platform React Native app · Solo dev · 3-month MVP

---

## Runtime & Framework

- **Expo** (managed workflow) — stay off native tooling as long as possible
- **Expo Router** — file-based navigation

## Language

- **TypeScript** throughout

## State Management

- **Zustand** — lightweight, minimal boilerplate, ideal for solo dev
- **MMKV** — fast local persistence for monster state, streak data, session drafts

## Backend & Database

- **Supabase** — Postgres, auth, real-time sync, and storage in one platform
- Free tier is generous for MVP
- Use Row Level Security (RLS) for data isolation

## Auth

- **Supabase Auth** with:
  - **Apple Sign-In** (required for App Store)
  - **Google Sign-In**
- Expo has solid modules for both

## Payments

- **RevenueCat** — abstracts App Store and Play Store IAP/subscriptions
- Essential for the freemium cosmetic purchases model

## Animations

- **React Native Reanimated** — performant gesture and layout animations
- **Lottie** — monster animations and evolution transitions

## Styling

- **NativeWind** (Tailwind for RN) — fast iteration, consistent styling

## Push Notifications

- **Expo Notifications** — daily writing reminders and streak nudges

## Analytics

- **PostHog** (free tier) or Expo's built-in analytics
- Track streaks, retention, session length

## OTA Updates

- **EAS Update** — push JS-side fixes without app store review

## Build & Deploy

- **EAS Build** — cloud builds for iOS and Android
- **EAS Submit** — CI/CD to both stores

---

## Key Decision Rationale

| Choice                     | Why                                                        |
| -------------------------- | ---------------------------------------------------------- |
| Expo over bare RN          | Faster iteration, managed native modules, EAS pipeline     |
| Supabase over Firebase     | Postgres flexibility, SQL queries, better RLS, open source |
| Zustand over Redux         | Zero boilerplate, tiny bundle, scales fine for this scope  |
| RevenueCat over raw IAP    | Cross-platform billing abstracted, analytics included      |
| NativeWind over StyleSheet | Rapid prototyping, familiar Tailwind utilities             |
| MMKV over AsyncStorage     | 30x faster reads/writes, critical for snappy writing UX    |
