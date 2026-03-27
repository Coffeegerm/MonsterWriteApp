## Overview

**Concept:** A daily writing habit app where users write 500 (or custom set number of) words per day to feed and nurture a virtual monster. Missed days cause the monster to grow sad and hungry. Consistent writing builds streaks, evolves the monster, and unlocks rewards.

**Platform:** Web + Mobile (React Native) **Team:** Solo developer + commissioned artist **Timeline:** ~3 months to MVP launch **Monetization:** Free at launch → Freemium with cosmetic purchases post-launch

---

## Product Summary

| Decision            | Choice                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------- |
| Monster personality | User chooses from 3–5 starter monsters, each with a unique vibe                         |
| Writing saved?      | Optional — user decides whether entries are stored or discarded                         |
| Daily goal          | 500 words, flexible across multiple sessions per day                                    |
| Missed day penalty  | Monster mood declines gradually over missed days                                        |
| Incentive phases    | Phase 1: Streaks & stats → Phase 2: Monster evolution → Phase 3: Social → Phase 4: Lore |

---

## Phase 1 — Foundation (Weeks 1–4)

**Goal:** Core writing loop + monster feeding mechanic working end to end.

### Week 1–2: Project Setup & Core Writing

- Initialize React Native project (Expo recommended for solo dev speed)
- Set up navigation structure (Home / Write / Monster / Profile)
- Build the writing editor screen
  - Word counter (real-time, counting toward 500)
  - Session save — allow partial progress throughout the day
  - "Feed Monster" button activates once 500-word threshold is hit
- Set up backend (Firebase or Supabase recommended for speed)
  - User auth (email + social login)
  - Daily writing log (date, word count, content if user opts in)

### Week 2–3: Monster System

- Monster data model: name, type, mood, hunger, streak
- **Mood engine** — the emotional heart of the app:
  - Day fed → mood improves (happy, excited, playful)
  - 1 day missed → slightly sad
  - 2–3 days missed → visibly upset, hunger grows
  - 5+ days missed → distressed (but never "dies" — always recoverable)
- Monster display screen with mood-based states
  - Minimum 3 visual states per monster: happy, neutral, sad
  - Placeholder art is fine here — swap in commissioned art later
- Daily reset logic (midnight local time or user-configured)

### Week 3–4: Streak Tracking & Basic Stats (Incentive Phase 1)

- Streak counter (current streak + longest streak)
- Calendar heatmap view (days written vs. missed)
- Basic stats dashboard: total words written, total days, average words/session
- Simple milestone badges: 7-day streak, 30-day streak, 10k words, 50k words
- Push notification reminders ("Your monster is getting hungry!")

### Art & Design (parallel track, starts Week 1)

- **Week 1:** Find and hire an illustrator (Fiverr, ArtStation, or referral)
- **Week 1–2:** Creative brief — define 3–5 monster personalities with mood boards
  - Example roster: Friendly Blob, Grumpy Gremlin, Shy Ghost, Energetic Dragon, Chill Mushroom
- **Week 3–4:** First round of monster art (3 mood states × 3–5 monsters = 9–15 illustrations)
- Budget estimate: $500–$1,500 depending on artist and style complexity

### Phase 1 Deliverable

A working app where you can sign up, write daily, feed your chosen monster, see it react to your habits, and track your streak. This alone is a testable product.

---

## Phase 2 — Monster Evolution & Polish (Weeks 5–8)

**Goal:** Make the monster feel alive and give users long-term progression.

### Week 5–6: Monster Evolution (Incentive Phase 2)

- Evolution system: monsters visually evolve at streak milestones
  - Stage 1: Base form (day 1)
  - Stage 2: Evolved form (7-day streak)
  - Stage 3: Final form (30-day streak)
- Small idle animations or expressions (can be simple frame swaps)
- Monster naming — let users name their creature
- Monster profile screen showing evolution timeline

### Week 6–7: Writing Experience Polish

- Optional writing prompts (daily prompt generator for users who want inspiration)
- Journal mode: toggle to save/browse past entries (with date search)
- Privacy controls: local-only storage option for sensitive writing
- Session resume — pick up where you left off mid-day
- Dark mode

### Week 7–8: Onboarding & Retention

- First-time user flow: choose your monster, learn the feeding mechanic, write your first entry
- Streak recovery grace period: allow 1 "free pass" per week (or make this a future premium feature)
- Daily push notifications with personality (from the monster's voice)
  - "I'm getting hungry… come write with me?" — Friendly Blob
  - "Whatever. Not like I care if you show up." — Grumpy Gremlin
- App Store / Play Store listing prep (screenshots, description, metadata)

### Art & Design (parallel track)

- Evolution art: 2 additional stages × 3–5 monsters = 6–10 more illustrations
- App icon and store listing graphics
- Budget estimate: additional $300–$800

### Phase 2 Deliverable

A polished, shippable MVP with evolving monsters, onboarding, journal option, and app store readiness. **This is your launch candidate.**

---

## Phase 3 — Post-Launch: Social & Cosmetics (Weeks 9–12)

**Goal:** Add retention loops and prepare monetization.

### Week 9–10: Social Features (Incentive Phase 3)

- Public streak leaderboard (opt-in)
- "Writing buddy" system — pair with a friend, see each other's streak
- Share milestone cards to social media ("My monster just evolved!")
- Community word count — collective goal (e.g., "This community has written 1M words")

### Week 10–11: Cosmetic Shop (Monetization Foundation)

- Monster accessories: hats, glasses, backgrounds, color variants
- Shop UI with preview ("try on" before buying)
- Payment integration (RevenueCat recommended for in-app purchases on both platforms)
- Pricing: $0.99–$2.99 per item, or small bundles
- 2–3 free cosmetics to demonstrate the system

### Week 11–12: Analytics & Iteration

- Track key metrics: DAU, streak distribution, drop-off points, shop conversion
- Instrument onboarding funnel
- Gather user feedback (in-app feedback form or Discord community)
- Plan Phase 4 based on data

### Phase 3 Deliverable

A socially connected app with monetization live. You now have a product that can sustain itself.

---

## Future Roadmap (Post-MVP)

These are the features you'll prioritize based on user data and feedback:

**Incentive Phase 4 — Story & Lore**

- Unlock lore entries about your monster's world as you write
- Narrative events tied to milestones ("Your monster discovered a hidden cave…")
- Seasonal story events

**Additional Features**

- Writing challenges (weekend sprints, themed weeks)
- Pro subscription tier: advanced stats, streak recovery tokens, journal export, unlimited monsters
- New unlockable monsters (earned through achievements or purchased)
- Widgets (iOS/Android) showing monster mood at a glance
- Apple Watch / wearable companion notification

---

## Tech Stack Recommendation

| Layer              | Tool                                  | Why                                        |
| ------------------ | ------------------------------------- | ------------------------------------------ |
| Framework          | React Native (Expo)                   | Fast cross-platform dev, solo-dev friendly |
| Backend            | Supabase or Firebase                  | Auth, database, storage with minimal setup |
| State management   | Zustand or Redux Toolkit              | Lightweight, good React Native support     |
| Push notifications | Expo Notifications + OneSignal        | Easy setup, scheduling support             |
| Payments           | RevenueCat                            | Abstracts App Store + Play Store purchases |
| Analytics          | Mixpanel or PostHog                   | Event tracking, funnel analysis            |
| Art pipeline       | Procreate/Illustrator → exported PNGs | Standard mobile asset workflow             |

---

## Risk Register

| Risk                                | Impact                | Mitigation                                                            |
| ----------------------------------- | --------------------- | --------------------------------------------------------------------- |
| Art delays from commissioned artist | Blocks monster polish | Start art process in Week 1; use placeholder art so dev isn't blocked |
| Scope creep on monster features     | Delays MVP launch     | Strict phase gates — no social/shop features before launch            |
| Low retention after launch          | Product fails to grow | Build notification system and streak psychology into Phase 1–2        |
| Solo dev burnout                    | Everything slows down | Timebox work sessions; Phase 1 is the minimum viable product          |
| App store rejection                 | Delays launch         | Follow guidelines early; plan 1–2 weeks buffer for review             |

---

## Key Milestones

| Week    | Milestone                                              |
| ------- | ------------------------------------------------------ |
| Week 4  | Internal alpha: core loop working with placeholder art |
| Week 6  | Commissioned monster art integrated                    |
| Week 8  | MVP feature-complete — begin beta testing              |
| Week 9  | App store submission                                   |
| Week 10 | **Public launch**                                      |
| Week 12 | Social features + cosmetic shop live                   |

---

## Estimated Budget (MVP through Week 12)

| Item                                          | Estimate             |
| --------------------------------------------- | -------------------- |
| Monster art (all phases)                      | $800–$2,300          |
| Apple Developer Account                       | $99/year             |
| Google Play Developer Account                 | $25 one-time         |
| Backend hosting (Supabase/Firebase free tier) | $0 at launch         |
| RevenueCat                                    | Free under $2.5k MRR |
| Push notification service                     | Free tier            |
| **Total to launch**                           | **~$950–$2,500**     |

---

## Next Steps

1. **This week:** Set up the React Native project and post an artist brief on ArtStation/Fiverr
2. **Define your 3–5 monster personalities** — names, vibes, what makes each one distinct
3. **Set up Supabase or Firebase** — auth + basic data model
4. **Start building the writing editor** — this is the core of everything

The most important thing in Week 1 is to have a screen where you can type words and see a counter tick toward 500. Everything else builds on that.
