import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { useAppLifecycle } from '@/hooks/use-app-lifecycle';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useNotifications } from '@/hooks/use-notifications';
import { getUserProfile, onAuthStateChange } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { PortalHost } from '@rn-primitives/portal';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { session, setSession, setUser } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // App-wide lifecycle and notification hooks
  useAppLifecycle();
  useNotifications();

  // Subscribe to Supabase auth state changes
  useEffect(() => {
    const { data: listener } = onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        const profile = await getUserProfile(newSession.user.id);
        setUser(profile);
      } else {
        setUser(null);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Auth guard: deferred one tick so Expo Router's navigation container has time to mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const inAuthGroup = segments[0] === '(auth)';
      if (!session && !inAuthGroup) {
        router.replace('/(auth)/sign-in');
      } else if (session && inAuthGroup) {
        router.replace('/(tabs)');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [session, segments, router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
      <PortalHost />
    </ThemeProvider>
  );
}
