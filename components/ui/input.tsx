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
        <Text className="text-sm font-medium text-inkwell dark:text-parchment">{label}</Text>
      )}
      <TextInput
        placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9BA1A6'}
        className={cn(
          'h-12 rounded-lg border border-border bg-white dark:bg-dusk-plum px-4 text-base text-inkwell dark:text-parchment',
          error && 'border-red-500',
          className
        )}
        style={{ color: colors.text }}
        {...props}
      />
      {error && (
        <Text className="text-xs text-red-500">{error}</Text>
      )}
    </View>
  );
}
