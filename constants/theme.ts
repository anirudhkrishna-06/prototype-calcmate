/**
 * CALCMATE — "Calm Intelligence" design system
 * File: constants/theme.ts
 *
 * This replaces the default Expo template theme. Every screen should
 * import tokens from here instead of hardcoding colors/sizes.
 */

export const Colors = {
  primary: '#17233C',      // Deep Navy — headers, nav, primary text
  accent: '#147D7A',       // Calcmate Teal — buttons, active states, AI
  background: '#F7F8F5',   // Warm Ivory — screen background
  surface: '#FFFFFF',      // Cards
  text: '#17233C',
  textSecondary: '#667085',
  border: '#E4E7EC',
  attention: '#C58A24',    // Muted amber — needs attention
  critical: '#C94A4A',     // Restrained red — absent / critical gap
  success: '#2F9E63',      // Used sparingly for "resolved" / mastered
  white: '#FFFFFF',
} as const;

export const Typography = {
  screenTitle: { fontSize: 26, fontWeight: '700' as const, color: Colors.text },
  sectionTitle: { fontSize: 18, fontWeight: '600' as const, color: Colors.text },
  cardTitle: { fontSize: 16, fontWeight: '600' as const, color: Colors.text },
  body: { fontSize: 14, fontWeight: '400' as const, color: Colors.text },
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 18,
};

export const Shadow = {
  card: {
    shadowColor: '#0B1220',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
};

// Status → color mapping used across student/group/priority components
export type StatusLevel = 'strong' | 'developing' | 'attention' | 'critical' | 'neutral';

export const StatusColor: Record<StatusLevel, string> = {
  strong: Colors.success,
  developing: Colors.accent,
  attention: Colors.attention,
  critical: Colors.critical,
  neutral: Colors.textSecondary,
};
