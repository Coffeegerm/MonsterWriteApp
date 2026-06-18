import { useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text as UIText } from '@/components/ui/text';
import { signInWithEmail, signInWithApple, getUserProfile } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

export default function SignInScreen() {
  const { setSession, setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!email.includes('@')) e.email = 'Enter a valid email address';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleEmailSignIn() {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await signInWithEmail(email, password);
      setSession(data.session);
      if (data.session?.user) {
        const profile = await getUserProfile(data.session.user.id);
        setUser(profile);
      }
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Sign In Failed', err.message ?? 'Check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAppleSignIn() {
    setLoading(true);
    try {
      const data = await signInWithApple();
      setSession(data.session);
      if (data.session?.user) {
        const profile = await getUserProfile(data.session.user.id);
        setUser(profile);
        if (!profile) {
          router.replace('/(auth)/choose-monster');
        } else {
          router.replace('/(tabs)');
        }
      }
    } catch (err: any) {
      if (err.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Apple Sign In Failed', err.message ?? 'Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-paper dark:bg-ink"
      contentContainerClassName="flex-grow justify-center px-6 py-12"
      keyboardShouldPersistTaps="handled">
      {/* Logo / title */}
      <View className="mb-10 items-center">
        <View className="h-16 w-16 items-center justify-center rounded-lg bg-ink dark:bg-ink-surface">
          <Text className="font-display text-3xl text-brass">M</Text>
        </View>
        <Text className="mt-3 font-display text-4xl text-ink dark:text-paper">MonsterWrite</Text>
        <Text className="mt-1 font-serif text-sm text-muted-foreground">
          Feed your monster. Build your habit.
        </Text>
      </View>

      {/* Form */}
      <View className="gap-4">
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          error={errors.email}
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          secureTextEntry
          autoComplete="current-password"
          error={errors.password}
        />

        <Button
          onPress={handleEmailSignIn}
          disabled={loading}
          className="mt-2 h-14 rounded-lg bg-ink dark:bg-paper active:bg-ink/90 dark:active:bg-paper/90">
          {loading ? (
            <ActivityIndicator color="#B0822F" />
          ) : (
            <UIText className="font-serif text-base font-semibold text-paper dark:text-ink">Sign in</UIText>
          )}
        </Button>

        {/* Apple Sign In — iOS only */}
        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={12}
            style={{ width: '100%', height: 56 }}
            onPress={handleAppleSignIn}
          />
        )}
      </View>

      {/* Footer */}
      <View className="mt-8 flex-row items-center justify-center gap-1">
        <Text className="font-serif text-sm text-muted-foreground">
          Don&apos;t have an account?
        </Text>
        <Button
          variant="link"
          onPress={() => router.push('/(auth)/sign-up')}
          className="p-0">
          <UIText className="font-serif text-sm font-semibold text-accent">Sign up</UIText>
        </Button>
      </View>
    </ScrollView>
  );
}
