// File: components/calcmate/Card.tsx
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Colors, Radius, Shadow, Spacing } from '@/constants/theme';

interface CardProps extends ViewProps {
  variant?: 'default' | 'flat';
}

export function Card({ style, variant = 'default', children, ...rest }: CardProps) {
  return (
    <View
      style={[styles.base, variant === 'default' && Shadow.card, style]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
});
