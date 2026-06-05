import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// expo-secure-store adapter for Supabase auth session persistence (native only)
const SecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

// SecureStore has no web implementation. Use localStorage in the browser,
// guarded so it no-ops during static/SSR rendering. Expo's static renderer
// injects a partial localStorage stub, so we check each method exists.
const hasLocalStorage = (): boolean =>
  typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function';

const WebStorageAdapter = {
  getItem: async (key: string) => (hasLocalStorage() ? localStorage.getItem(key) : null),
  setItem: async (key: string, value: string) => {
    if (hasLocalStorage()) localStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (hasLocalStorage()) localStorage.removeItem(key);
  },
};

const authStorage = Platform.OS === 'web' ? WebStorageAdapter : SecureStoreAdapter;

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_KEY in environment');
}

// Untyped client — each service file casts query results to the correct row types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: SupabaseClient<any> = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: authStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Table helpers — short-hand for supabase.from(tableName)
export const db = {
  users: () => supabase.from('users'),
  monsters: () => supabase.from('monsters'),
  writingSessions: () => supabase.from('writing_sessions'),
  streaks: () => supabase.from('streaks'),
  badges: () => supabase.from('badges'),
};
