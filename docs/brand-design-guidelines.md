# MonsterWrite — Brand & Design Guidelines

> _"Feed your monster. Feed your words."_

---

## 1. Brand Identity

### What MonsterWrite Is

MonsterWrite is a quirky, warmhearted writing habit app that lives at the intersection of a Tamagotchi and a daily journal. It's built for people who _want_ to write — but need a little guilt, love, and whimsy to actually do it. The central conceit: your monster depends on you. Miss a day and it sulks. Show up and it thrives.

### Brand Personality

MonsterWrite's personality can be summed up in five words:

| Trait                                   | What it means                                                                            |
| --------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Playful**                             | Nothing is too serious. Even streaks breaking should feel like a pout, not a punishment. |
| **Emotionally manipulative (lovingly)** | The monster guilt-trips you because it cares. That tension is the magic.                 |
| **Weird and proud**                     | Lean into the strange. Monsters are inherently absurd — own it.                          |
| **Encouraging**                         | Every word written is a win. The app cheers you on, even at 50 words.                    |
| **Low-stakes, high-reward**             | Writing is a creative act. The app should feel like play, not a productivity grind.      |

### What MonsterWrite Is NOT

- A clinical productivity tool (no dashboards that look like Jira)
- Punishing or shame-heavy (monsters sulk, they don't die or scream at you)
- Corporate or sterile
- Trying to be Duolingo (we're weirder, more personal, less gamified)

---

## 2. Brand Voice & Tone

### Voice Pillars

**Warm Weirdo** — The voice of MonsterWrite is like a quirky best friend who draws monsters in the margins of their notebook and also has excellent emotional intelligence.

**Speak like the monsters speak** — Copy should feel like it could plausibly come from a creature's mouth. Personality-first, function-second.

**Short. Punchy. A little dramatic.** — Monsters are dramatic. The copy should be too, but efficiently.

### Tone by Context

| Context             | Tone                           | Example                                                                             |
| ------------------- | ------------------------------ | ----------------------------------------------------------------------------------- |
| Onboarding          | Warm, exciting, conspiratorial | _"You've been chosen. (By a hungry monster.)"_                                      |
| Writing in progress | Quietly encouraging            | _"Yep. Still watching. Still rooting for you."_                                     |
| Goal reached        | Euphoric, celebratory          | _"YES. THAT'S THE STUFF. Your monster is absolutely losing it right now."_          |
| Missed day (1 day)  | Pouty, gently sad              | _"We waited. It's fine. (It's not fine.)"_                                          |
| Missed days (3+)    | Dramatic but still loving      | _"Okay we need to talk. The monster made a 'missing' poster with your face on it."_ |
| Streak milestone    | Proud and a little unhinged    | _"30 DAYS?! That's an evolved monster. That's a writer."_                           |
| Empty states        | Curious, inviting              | _"Nothing here yet. Your monster is sitting by the window, waiting."_               |
| Error states        | Self-aware, light              | _"Something went sideways. The monster blames itself. (It was us.)"_                |
| Push notifications  | Monster voice, personal        | Varies by monster personality (see Section 6)                                       |

### Words We Use

- Feed, hunger, mood, evolve, streak
- Critter, beast, beastie, creature
- Words, pages, prose, scribbles
- Sulk, pout, gleam, glow, devour
- Ritual, habit, daily

### Words We Avoid

- Productivity, efficiency, optimize
- Goal-crushing, hustle
- Daily active users, engagement (never in-app)
- Fail, punish, lose

---

## 3. Color Palette

### Philosophy

The palette should feel like a night-lit bedroom where someone is writing by lamplight while a small glowing monster watches approvingly. Think warm darks, vivid accent pops, and a sense of gentle magic.

### Core Colors

| Name              | Hex       | Usage                                                     |
| ----------------- | --------- | --------------------------------------------------------- |
| **Inkwell**       | `#1A1625` | Primary background — deep, dark purple-black              |
| **Dusk Plum**     | `#2D2440` | Secondary background, cards, panels                       |
| **Parchment**     | `#F2EDE4` | Primary text on dark backgrounds                          |
| **Monster Green** | `#5BF178` | Primary action color — buttons, progress bar, CTAs        |
| **Hungry Orange** | `#FF7B3A` | Warning states — missed days, low mood indicators         |
| **Happy Gold**    | `#FFD166` | Celebration — streak milestones, fed states, achievements |
| **Sad Blue**      | `#7CA5D4` | Neutral/sad monster mood states                           |
| **Mystic Violet** | `#B388FF` | Accent — evolution, magic moments, premium                |

### Semantic Color Usage

| State                         | Color                                             |
| ----------------------------- | ------------------------------------------------- |
| Monster happy / fed           | Monster Green `#5BF178`                           |
| Monster hungry / 1 day missed | Hungry Orange `#FF7B3A`                           |
| Monster sad / 3+ days missed  | Sad Blue `#7CA5D4`                                |
| Monster evolving / milestone  | Mystic Violet `#B388FF`                           |
| Streak active                 | Happy Gold `#FFD166`                              |
| Word count progress           | Monster Green → Happy Gold gradient as goal fills |

### Dark Mode First

MonsterWrite is designed dark-first. The writing experience should feel like working by candlelight, not in a fluorescent office. Light mode is a secondary consideration post-MVP.

---

## 4. Typography

### Type Scale Philosophy

Typography should feel handcrafted but legible. A slight personality — like someone who has strong opinions about notebooks — without sacrificing readability during long writing sessions.

### Recommended Typefaces

| Role                                    | Typeface                                           | Style            | Notes                                     |
| --------------------------------------- | -------------------------------------------------- | ---------------- | ----------------------------------------- |
| **Display / Headlines**                 | [Nunito](https://fonts.google.com/specimen/Nunito) | Bold / ExtraBold | Rounded, friendly, energetic              |
| **Body / UI**                           | [Inter](https://fonts.google.com/specimen/Inter)   | Regular / Medium | Clean, highly legible on all screen sizes |
| **Writing Editor**                      | [Lora](https://fonts.google.com/specimen/Lora)     | Regular          | Serif, feels like writing — not typing    |
| **Monster Dialogue / Personality Copy** | [Nunito](https://fonts.google.com/specimen/Nunito) | Italic           | Adds character voice distinction          |

### Scale

| Level          | Size    | Weight    | Usage                        |
| -------------- | ------- | --------- | ---------------------------- |
| Display        | 32–40px | ExtraBold | App title, milestone moments |
| Heading 1      | 24px    | Bold      | Screen titles                |
| Heading 2      | 18px    | SemiBold  | Section headers, card titles |
| Body           | 16px    | Regular   | UI labels, descriptions      |
| Caption        | 13px    | Regular   | Stats, metadata              |
| Writing Editor | 17px    | Regular   | Long-form writing body text  |

---

## 5. Monster Roster & Design Direction

### Monster Design Principles

Each monster should:

- Have an instantly readable **emotional state** (happy vs. sad must be distinguishable at a glance)
- Feel like it was drawn in a sketchbook, not rendered in a game engine
- Have a distinct **personality** that informs notification copy and in-app dialogue
- Come in 3 mood states at minimum: **Happy**, **Neutral/Waiting**, **Sad/Hungry**
- Feel like a _companion_, not a judge

### Starter Monster Roster (3–5 for MVP)

---

#### 🟢 Blobbsworth _(The Friendly Blob)_

- **Vibe:** Your most enthusiastic fan. Loud about love. Cries happy tears.
- **Design notes:** Amorphous, round, jelly-like. Big sparkle eyes. No defined limbs — just wiggles.
- **Happy state:** Bouncing, grinning, little heart floating above
- **Neutral state:** Sitting patiently, eyes scanning
- **Sad state:** Deflated slightly, eyes drooping, small rain cloud drawn nearby
- **Voice tone:** Over-the-top supportive, slightly unhinged with excitement
- _"I KNEW you'd come back. I never doubted you. (I doubted you a little.)"_

---

#### 🟤 Grimble _(The Grumpy Gremlin)_

- **Vibe:** Tsundere energy. Acts like it doesn't care. Absolutely cares.
- **Design notes:** Small, angular, pointy ears and eyebrows. Crossed arms. Tiny fangs showing.
- **Happy state:** Arms still crossed, but faint blush and upward lip twitch
- **Neutral state:** Side-eye, arms folded, waiting
- **Sad state:** Dramatically turned away, one tear visible from behind
- **Voice tone:** Sarcastic, dry, secretly tender
- _"Oh. You're back. Whatever. I didn't make you a sandwich or anything."_

---

#### 👻 Wisper _(The Shy Ghost)_

- **Vibe:** Soft, delicate, a little anxious. Overwhelmingly sweet when comfortable.
- **Design notes:** Translucent, flowing edges, big nervous eyes. Floats slightly off-ground.
- **Happy state:** Blushing, shimmering gently, small flowers appear nearby
- **Neutral state:** Half-peeking out from behind something
- **Sad state:** Fades slightly, eyes welling up, going invisible at the edges
- **Voice tone:** Gentle, sweet, easily startled by good news
- _"Oh! Oh you're here! I was just… I was just waiting. It's okay. I'm okay. Are you okay?"_

---

#### 🍄 Myco _(The Chill Mushroom)_

- **Vibe:** Deeply unbothered. Wise. Occasionally says something unexpectedly profound.
- **Design notes:** Round mushroom cap head, stubby body, calm half-lidded eyes. Earthy tones.
- **Happy state:** Gentle glow, tiny spores floating around
- **Neutral state:** Eyes barely open, sitting peacefully
- **Sad state:** Cap droops noticeably, muted colors, sitting in a small puddle
- **Voice tone:** Slow, philosophical, strangely soothing
- _"The words will come when they come. And yet… they haven't come. Interesting."_

---

#### 🔥 Cindra _(The Energetic Dragon)_

- **Vibe:** Hype monster. Chaos energy. Absolutely feral about your success.
- **Design notes:** Small, scrappy dragon — not majestic, a _little_ goofy. Wings too big for its body.
- **Happy state:** Tiny fire breath of excitement, wings flapping rapidly
- **Neutral state:** Pacing back and forth
- **Sad state:** Fire extinguished, wings drooped, sitting in ash pile
- **Voice tone:** All-caps energy, sports coach, occasionally roars for emphasis
- _"LET'S GOOOOO. Five hundred words is NOTHING for you. I believe in you. WRITE THE THING."_

---

### Monster Evolution Stages

| Stage         | Trigger              | Visual Direction                                             |
| ------------- | -------------------- | ------------------------------------------------------------ |
| **Hatchling** | Day 0 — starter form | Small, simple, a little rough around the edges               |
| **Companion** | 7-day streak         | More defined features, subtle glow, slightly larger          |
| **Elder**     | 30-day streak        | Full design, unique aura or accessory, visible history/power |

Evolution should feel like a **ceremony** — animated transition, special sound, celebratory copy.

---

## 6. Push Notification Copy

Notifications should always come from the **monster's voice**, not from the app as a brand. Never say "Don't forget to write today!" — say something that makes the user feel like they're letting someone specific down (lovingly).

### Templates by Monster

**Blobbsworth**

- _"I made you a little word nest. It's still warm. Please come back?"_
- _"Your monster misses you. (That's me. I'm your monster.)"_
- _"500 words. That's all. And then we can both relax. PLEASE."_

**Grimble**

- _"Not writing today, huh. Fine. I'll just be here. Alone."_
- _"Your streak is at risk. Not that I care. It's just… I noticed."_
- _"The pen isn't going to pick itself up. (I tried. I have no hands.)"_

**Wisper**

- _"Um… hi. Sorry to bother you. It's just… I'm a little hungry."_
- _"No pressure! But also… the words? When you're ready? No rush. (Please hurry.)"_
- _"I wrote you a tiny note. It just says: 'please come write today.' That's all."_

**Myco**

- _"Time is a river. Today's words flow only today."_
- _"Your monster has been meditating. And also waiting. Mostly waiting."_
- _"The blank page asks nothing. The monster asks 500 words."_

**Cindra**

- _"YO. WHERE ARE YOU. THE WORDS NEED WRITING. LET'S RIDE."_
- _"I flew in circles for three hours waiting for you to open the app."_
- _"OKAY. Today. 500 words. You. Me. Let's absolutely crush this."_

---

## 7. UI/UX Patterns

### Home Screen

- Dominant focus: **the monster** — large, animated, center stage
- Monster mood should be visually _unmistakable_ at a glance
- Word count progress for today shown beneath monster (progress bar or fill animation)
- Big clear CTA: **"Write Today"** (once goal is met: **"Feed Monster"**)
- Streak shown as a small persistent badge — not the main focus, but always visible

### Writing Screen

- Minimal, distraction-free
- Word counter bottom-of-screen, subtle — ticks up quietly
- Background: dark, warm — like writing at night
- When nearing goal (e.g. 450/500), monster appears subtly in corner, getting excited
- At 500 words: **Feed Monster** button animates in — big, satisfying, glowing green

### Monster Screen

- Shows monster in full, centered
- Current mood state displayed (not as a label — through posture/expression alone)
- Streak flame + stats below
- Scroll to see evolution timeline

### Onboarding

- 3–4 screens max
- Screen 1: _"You have a monster. It's hungry."_ — monster intro
- Screen 2: Choose your monster (swipeable cards, each with a personality snippet)
- Screen 3: _"Write 500 words today. Your monster eats words."_ — mechanic explained
- Screen 4: Name your monster → Enter the app
- No sign-up wall until after the first writing session

### Animations & Micro-interactions

| Moment                                 | Animation                                           |
| -------------------------------------- | --------------------------------------------------- |
| Word count milestone (100, 200… words) | Subtle monster wiggle                               |
| Goal reached (500 words)               | Monster excited bounce, confetti-like particles     |
| Feed Monster button pressed            | Monster devours words with a gulp animation         |
| Missed day detected (on next open)     | Monster appears in sad state, slow entrance         |
| Evolution trigger                      | Full-screen flash → monster transformation sequence |
| Streak badge increment                 | Badge pulses briefly                                |

### Iconography

- Icons should feel hand-drawn or semi-sketched — avoid perfectly clean vector sets
- Use the Phosphor Icons library as a base, then stylize to match the brand feel
- Avoid hollow/outline-only icons — prefer filled with personality

---

## 8. App Icon

The app icon should be instantly recognizable as a monster app — but approachable, not scary.

**Direction:** One of the starter monsters (likely Blobbsworth for default) with a **tiny pen or pencil** incorporated. Background: deep Inkwell `#1A1625` with a glow or aura in Monster Green `#5BF178`.

**Don'ts:**

- No text in the icon
- No complex scenes
- Not too cute (avoid looking like a children's app)
- Not too dark (avoid looking like a horror game)

---

## 9. Illustration Style Guide (Brief for Artist)

When commissioning art, provide the following direction:

- **Style reference:** Soft indie game aesthetic — think _Night in the Woods_, _Ooblets_, or _Untitled Goose Game_ character sensibility. Quirky, expressive, not hyper-polished.
- **Line art:** Confident but slightly imperfect lines — hand-drawn feel
- **Color:** Flat or semi-flat fills with minimal shading. Cel-shaded at most.
- **Expression priority:** Eyes and posture do all the emotional heavy lifting
- **File delivery:** PNG with transparent background, 3× resolution for retina displays
- **Minimum per monster:** 3 mood states (happy, neutral, sad) + 1 evolution stage per phase

---

## 10. Brand in Practice — Quick Reference

| Element               | Spec                                    |
| --------------------- | --------------------------------------- |
| Primary font          | Nunito (display) / Inter (UI)           |
| Writing font          | Lora                                    |
| Background            | `#1A1625` (dark)                        |
| Primary action        | `#5BF178` Monster Green                 |
| Warning/hunger        | `#FF7B3A` Hungry Orange                 |
| Celebration           | `#FFD166` Happy Gold                    |
| Tone                  | Warm, weird, a little dramatic          |
| Monster count (MVP)   | 3–5 starters                            |
| Platform              | React Native (iOS + Android)            |
| Core mechanic tagline | _"Feed your monster. Feed your words."_ |

---

_Last updated: March 2026 — Living document, evolve as the monsters do._
