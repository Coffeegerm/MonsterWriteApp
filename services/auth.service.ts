import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { supabase, db } from '@/services/supabase';
import { UserProfile } from '@/types/user';
import { UsersRow } from '@/types/supabase';

function rowToUserProfile(row: UsersRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    dailyGoal: row.daily_goal,
    saveWriting: row.save_writing,
    notificationTime: row.notification_time,
    createdAt: row.created_at,
  };
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string, displayName: string) {
  // Pass display_name in user metadata so the DB trigger can use it when
  // auto-creating the public.users row (avoids RLS timing issues on INSERT)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });
  if (error) throw error;
  if (!data.user) throw new Error('Sign up succeeded but no user returned');
  return data;
}

export async function signInWithApple() {
  const nonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    nonce
  );

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    ],
    nonce: hashedNonce,
  });

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: credential.identityToken!,
    nonce,
  });
  if (error) throw error;

  // Upsert into public.users (Apple only sends name on first sign-in)
  const displayName =
    credential.fullName?.givenName
      ? `${credential.fullName.givenName} ${credential.fullName.familyName ?? ''}`.trim()
      : data.user?.email?.split('@')[0] ?? 'Writer';

  await db.users().upsert({
    id: data.user!.id,
    email: data.user!.email ?? '',
    display_name: displayName,
    daily_goal: 500,
    save_writing: true,
    notification_time: null,
  });

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await db.users().select('*').eq('id', userId).single();
  if (error) return null;
  return rowToUserProfile(data as UsersRow);
}

export async function updateUserProfile(userId: string, updates: Partial<UsersRow>) {
  const { error } = await db.users().update(updates).eq('id', userId);
  if (error) throw error;
}

export function onAuthStateChange(callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) {
  return supabase.auth.onAuthStateChange(callback);
}
