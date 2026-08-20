// File: components/calcmate/Button.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
}

export function Button({ label, onPress, variant = 'primary', style }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], style]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Text style={[styles.label, variant === 'outline' && styles.labelOutline]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Colors.accent,
  },
  secondary: {
    backgroundColor: Colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  label: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  labelOutline: {
    color: Colors.text,
  },
});
