/**
 * CALCMATE — DIKSHA-Inspired Government Design System
 * File: constants/theme.ts
 *
 * Core Principle: Less Text. Greater Understanding.
 */

export const Colors = {
  primary: '#1A2B4C',      // Deep Navy Blue (Top bars, Headers, Nav, Important text)
  accent: '#006A4E',       // Indian Ashoka Teal (Primary buttons, Active nav, Active tabs, Chips)
  background: '#F9F9F6',   // Warm Off-White (Entire application background)
  surface: '#FFFFFF',      // Card Surface (Cards, Bottom sheets, Containers)
  attention: '#FF9933',    // Saffron Accent (Pending tasks, Focus areas, Priorities)
  border: '#DDE3EA',       // Divider (Card separation, Dividers, Subtle borders)
  critical: '#D9534F',     // Alert (Absent students, Critical intervention)
  text: '#1A2B4C',         // Primary Text
  textSecondary: '#5C6B73',// Secondary Text
  white: '#FFFFFF',        // Inverse Text
  success: '#006A4E',      // Using Teal as success in this palette
} as const;

export const Typography = {
  screenTitle: { fontSize: 28, fontWeight: '700' as const, color: Colors.text },
  sectionTitle: { fontSize: 18, fontWeight: '600' as const, color: Colors.text },
  cardTitle: { fontSize: 16, fontWeight: '600' as const, color: Colors.text },
  body: { fontSize: 14, fontWeight: '400' as const, color: Colors.text },
  caption: { fontSize: 12, fontWeight: '400' as const, color: Colors.textSecondary },
  // Keeping backwards compatibility aliases:
  bodySecondary: { fontSize: 14, fontWeight: '400' as const, color: Colors.textSecondary },
  supporting: { fontSize: 12, fontWeight: '400' as const, color: Colors.textSecondary },
  button: { fontSize: 15, fontWeight: '600' as const, color: Colors.white },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export const Shadow = {
  card: {
    shadowColor: Colors.primary,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
};

export type StatusLevel = 'strong' | 'developing' | 'attention' | 'critical' | 'neutral';

export const StatusColor: Record<StatusLevel, string> = {
  strong: Colors.accent,
  developing: Colors.attention,
  attention: Colors.attention,
  critical: Colors.critical,
  neutral: Colors.textSecondary,
};
