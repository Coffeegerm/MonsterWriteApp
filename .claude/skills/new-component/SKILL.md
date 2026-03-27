# new-component

Create a new UI component for MonsterWrite following project conventions.

## Usage

```
/new-component <component-name> [--primitive] [--monster] [--location <path>]
```

Examples:
- `/new-component word-count-badge` → `components/word-count-badge.tsx`
- `/new-component progress-ring --primitive` → `components/ui/progress-ring.tsx` with CVA variants
- `/new-component monster-card --monster` → `components/monsters/monster-card.tsx`
- `/new-component streak-flame --location components/home/` → custom location

## What I do

Create a component file following MonsterWrite's conventions: kebab-case filenames, NativeWind styling, TypeScript props, and appropriate use of the design system.

### Standard component template

```tsx
import { View, Text, Pressable } from 'react-native';
import { cn } from '@/lib/utils';

interface <PascalCaseName>Props {
  className?: string;
  // Add props here
}

export function <PascalCaseName>({ className, ...props }: <PascalCaseName>Props) {
  return (
    <View className={cn('', className)}>
      {/* Component content */}
    </View>
  );
}
```

### Design system primitive template (`--primitive`)

For buttons, badges, inputs — components that need multiple visual variants. Uses CVA (class-variance-authority):

```tsx
import { Pressable, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { TextClassContext } from '@/components/ui/text';

const <name>Variants = cva(
  'base-classes-here',
  {
    variants: {
      variant: {
        default: '',
        secondary: '',
        outline: '',
        ghost: '',
      },
      size: {
        sm: '',
        default: '',
        lg: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface <PascalCaseName>Props
  extends React.ComponentPropsWithoutRef<typeof Pressable>,
    VariantProps<typeof <name>Variants> {
  className?: string;
}

export function <PascalCaseName>({ variant, size, className, children, ...props }: <PascalCaseName>Props) {
  return (
    <TextClassContext.Provider value={/* text classes */}>
      <Pressable
        className={cn(<name>Variants({ variant, size }), className)}
        {...props}
      >
        {children}
      </Pressable>
    </TextClassContext.Provider>
  );
}
```

### Monster component template (`--monster`)

```tsx
import { View } from 'react-native';
import type { MonsterType, MoodState } from '@/types';
import { cn } from '@/lib/utils';

interface <PascalCaseName>Props {
  type: MonsterType;
  mood: MoodState;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function <PascalCaseName>({ type, mood, size = 'md', className }: <PascalCaseName>Props) {
  return (
    <View className={cn('items-center justify-center', className)}>
      {/* Monster render logic */}
    </View>
  );
}
```

## Brand color reference (NativeWind classes)

Map to `tailwind.config.js` extended colors:

| Intent | Class | Hex |
|---|---|---|
| Dark background | `bg-background` | Inkwell #1A1625 |
| Primary action / happy | `bg-primary` / `text-primary` | Monster Green #5BF178 |
| Warning / hungry | `text-[#FF7B3A]` | Hungry Orange |
| Celebration / streak | `text-[#FFD166]` | Happy Gold |
| Sad / missed | `text-[#7CA5D4]` | Sad Blue |
| Evolution / magic | `text-[#B388FF]` | Mystic Violet |
| Body text | `text-foreground` | — |
| Secondary text | `text-muted-foreground` | — |
| Card surface | `bg-card` | — |
| Border | `border-border` | — |

## Typography classes (NativeWind)

Using Nunito (display/headings), Inter (UI), Lora (editor):
- `font-display` — Nunito, for monster names, big numbers
- `font-sans` — Inter, for UI labels and body text
- `font-serif` — Lora, for the writing editor textarea

## File placement rules

| Flag | Location |
|---|---|
| `--primitive` | `components/ui/` |
| `--monster` | `components/monsters/` |
| `--location <path>` | Custom path |
| (none) | `components/` |

## Conventions checklist

- [ ] Kebab-case filename
- [ ] `@/` imports only
- [ ] `cn()` from `@/lib/utils` for className merging
- [ ] TypeScript props interface (no `any`)
- [ ] `className?: string` prop accepted for composability
- [ ] NativeWind classes — no `StyleSheet.create()` unless unavoidable
- [ ] Dark mode via `dark:` prefix variants
- [ ] Export as named export (not default)
