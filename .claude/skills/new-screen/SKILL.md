# new-screen

Scaffold a new Expo Router screen for MonsterWrite.

## Usage

```
/new-screen <screen-name> [--tab] [--store <store-name>] [--modal]
```

Examples:
- `/new-screen write --tab` → `app/(tabs)/write.tsx`
- `/new-screen monster --tab --store monster` → tab screen connected to monster store
- `/new-screen choose-monster --modal` → `app/choose-monster.tsx` (modal/standalone)
- `/new-screen profile --tab --store auth` → profile tab with auth store

## What I do

When invoked, create a new screen file following MonsterWrite conventions:

### File placement
- `--tab` flag → `app/(tabs)/<screen-name>.tsx`
- `--modal` or no flag → `app/<screen-name>.tsx`
- Always kebab-case filename

### Template for tab screen (`--tab`)

```tsx
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function <PascalCaseName>Screen() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
        {/* Screen content */}
      </ScrollView>
    </SafeAreaView>
  );
}
```

### Template for standalone/modal screen

```tsx
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function <PascalCaseName>Screen() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 py-6">
        {/* Screen content */}
        <Pressable onPress={() => router.back()}>
          <Text className="text-muted-foreground">Back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
```

### When `--store <name>` is provided

Add the store import and usage:

```tsx
import { use<Name>Store } from '@/stores/<name>.store';
// Inside component:
const { /* relevant state */ } = use<Name>Store();
```

### Registering a new tab

If creating a tab screen, also update `app/(tabs)/_layout.tsx` to add the new tab entry with the correct icon and label. MonsterWrite tabs: Home, Write, Monster, Profile.

## Brand/Style notes

- Background: `bg-background` (maps to Inkwell #1A1625 in dark, white in light)
- Primary action color: `text-primary` or `bg-primary` (Monster Green #5BF178)
- Text: `text-foreground` for body, `text-muted-foreground` for secondary
- Always use NativeWind classes — no inline StyleSheet unless unavoidable
- Font families: Nunito for headings (display), Inter for UI text, Lora for writing editor
- Dark mode via `dark:` Tailwind variants or `useColorScheme()` hook

## Conventions checklist

- [ ] Kebab-case filename
- [ ] `@/` imports (never relative `../../`)
- [ ] SafeAreaView wrapper on all top-level screens
- [ ] TypeScript — no `any` types
- [ ] No direct Supabase calls in screens — use store actions or service hooks
