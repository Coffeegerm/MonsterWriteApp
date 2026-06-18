import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';
import { cn } from '@/components/lib/utils';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View className="w-full gap-1.5">
      {label && (
        <Text className="font-serif text-sm font-medium text-ink dark:text-paper">{label}</Text>
      )}
      <TextInput
        placeholderTextColor={colorScheme === 'dark' ? '#9A8868' : '#7A6A50'}
        className={cn(
          'h-12 rounded-lg border border-border bg-surface dark:bg-ink-surface px-4 font-serif text-base text-ink dark:text-paper',
          error && 'border-oxblood',
          className
        )}
        style={{ color: colors.text }}
        {...props}
      />
      {error && (
        <Text className="font-serif text-xs text-oxblood">{error}</Text>
      )}
    </View>
  );
}
