import { useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text as UIText } from '@/components/ui/text';
import { signUp } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SignUpScreen() {
  const scheme = useColorScheme() ?? 'light';
  const { setSession } = useAuthStore();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
  }>({});

  function validate() {
    const e: typeof errors = {};
    if (!displayName.trim()) e.displayName = 'Display name is required';
    if (!email.includes('@')) e.email = 'Enter a valid email address';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSignUp() {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await signUp(email, password, displayName.trim());
      setSession(data.session);
      router.replace('/(auth)/choose-monster');
    } catch (err: any) {
      Alert.alert('Sign Up Failed', err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-paper dark:bg-ink"
      contentContainerClassName="flex-grow justify-center px-6 py-12"
      keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View className="mb-10">
        <Button
          variant="ghost"
          onPress={() => router.back()}
          className="mb-4 flex-row items-center gap-1 self-start p-0">
          <ArrowLeft size={18} strokeWidth={2} color={Colors[scheme].tabIconDefault} />
          <UIText className="font-serif text-muted-foreground">Back</UIText>
        </Button>
        <Text className="font-display text-4xl text-ink dark:text-paper">
          Create account
        </Text>
        <Text className="mt-1 font-serif text-sm text-muted-foreground">
          Your monster is waiting to meet you.
        </Text>
      </View>

      {/* Form */}
      <View className="gap-4">
        <Input
          label="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="What should we call you?"
          autoCapitalize="words"
          autoComplete="name"
          error={errors.displayName}
        />
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
          autoComplete="new-password"
          error={errors.password}
        />

        <Button
          onPress={handleSignUp}
          disabled={loading}
          className="mt-2 h-14 rounded-lg bg-ink dark:bg-paper active:bg-ink/90 dark:active:bg-paper/90">
          {loading ? (
            <ActivityIndicator color="#B0822F" />
          ) : (
            <UIText className="font-serif text-base font-semibold text-paper dark:text-ink">Create account</UIText>
          )}
        </Button>
      </View>

      {/* Footer */}
      <View className="mt-8 flex-row items-center justify-center gap-1">
        <Text className="font-serif text-sm text-muted-foreground">
          Already have an account?
        </Text>
        <Button variant="link" onPress={() => router.push('/(auth)/sign-in')} className="p-0">
          <UIText className="font-serif text-sm font-semibold text-accent">Sign in</UIText>
        </Button>
      </View>
    </ScrollView>
  );
}
