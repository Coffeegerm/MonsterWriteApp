# MonsterWrite

A Tamagotchi-style writing habit tracker built with React Native (Expo). Write 500+ words/day to feed and evolve your virtual monster.

## Prerequisites

- Node.js 18+
- Xcode (iOS) or Android Studio (Android)
- [EAS CLI](https://docs.expo.dev/eas/): `npm install -g eas-cli`

## Setup

```bash
npm install
cp .env.example .env  # fill in Supabase credentials
```

## Development

This project uses native modules (MMKV, Lottie, RevenueCat) that **require a development build** — Expo Go is not supported.

### Local builds (recommended)

```bash
npm run ios       # expo run:ios  — builds & launches in iOS Simulator
npm run android   # expo run:android — builds & launches in Android Emulator
npm run web       # expo start --web
npm start         # Metro bundler only (connect via installed dev client)
```

The first run compiles native code (~5 min). Subsequent JS changes hot-reload instantly.

### EAS cloud builds

```bash
npm run build:dev:ios        # development client for iOS
npm run build:dev:android    # development client for Android
npm run build:preview:ios    # internal TestFlight / internal track
npm run build:prod:ios       # App Store production build
npm run build:prod:android   # Play Store production build
```

## Other commands

```bash
npm run lint        # ESLint
npm run prebuild    # expo prebuild (regenerate ios/ android/ folders)
```

## Architecture

See [`../architecture.md`](../architecture.md) for full project structure and conventions.

**Key stack:**

- Expo SDK 54 / React Native 0.81 / React 19
- Expo Router (file-based navigation)
- NativeWind (Tailwind CSS)
- Zustand + MMKV (state & local persistence)
- Supabase (auth + database)
- RevenueCat (in-app purchases)
- Lottie (monster animations)
