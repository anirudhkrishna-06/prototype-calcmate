// File: components/calcmate/AIButton.tsx
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors, Radius, Shadow, Spacing } from '@/constants/theme';

interface AIButtonProps {
  href?: string; // defaults to the general AI assistant route
  params?: Record<string, string>;
}

// Persistent bottom-right "✦ Calcmate" button. Meant to be rendered once
// per screen (Home, Class Mode, etc.), not inside scrollable content.
export function AIButton({ href = '/ai', params }: AIButtonProps) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.85}
      onPress={() =>
        router.push(
          params
            ? ({ pathname: href, params } as never)
            : (href as never)
        )
      }
    >
      <Feather name="star" size={16} color={Colors.white} />
      <Text style={styles.label}>Calcmate</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.lg,
    backgroundColor: Colors.accent,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    ...Shadow.card,
  },
  label: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
