/**
 * FoodieExpress Design System
 * Unified colors, typography, and spacing for consistent UI
 */

// Brand Colors - Primary Orange Theme
export const Colors = {
  // Primary Brand Colors
  primary: '#FF6B35',        // Main brand orange
  primaryLight: '#FF8A65',   // Lighter orange
  primaryDark: '#FF5722',    // Darker orange
  
  // Role-Based Colors (consistent across all user types)
  customer: '#FF6B35',       // Primary orange for customers
  restaurant: '#FF5722',     // Darker orange for restaurants
  delivery: '#FF8A50',       // Medium orange for delivery
  admin: '#FF4500',          // Strong orange for admin
  
  // Semantic Colors
  success: '#4CAF50',        // Green for success states
  warning: '#FF9800',        // Amber for warnings
  error: '#F44336',          // Red for errors
  info: '#2196F3',           // Blue for information
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Text Colors
  textPrimary: '#333333',    // Main text
  textSecondary: '#666666',  // Secondary text
  textTertiary: '#999999',   // Tertiary text
  textLight: '#FFFFFF',      // Light text on dark backgrounds
  textDisabled: '#CCCCCC',   // Disabled text
  
  // Background Colors
  background: '#F8F9FA',     // Main app background
  surface: '#FFFFFF',        // Card/surface background
  surfaceAlt: '#F5F5F5',     // Alternative surface
  
  // Border Colors
  border: '#E0E0E0',         // Light borders
  borderDark: '#CCCCCC',     // Darker borders
  
  // Shadow
  shadow: '#000000',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

// Typography Scale
export const Typography = {
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 48,
  },
  
  // Font Weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  
  // Line Heights
  lineHeight: {
    tight: 16,
    normal: 20,
    relaxed: 24,
    loose: 28,
  },
};

// Spacing Scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

// Border Radius
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
};

// Shadows
export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Gradients
export const Gradients = {
  primary: [Colors.primary, Colors.primaryLight] as const,
  auth: [Colors.primary, Colors.primaryLight] as const,
  customer: [Colors.customer, Colors.primaryLight] as const,
  restaurant: [Colors.restaurant, Colors.primaryLight] as const,
  delivery: [Colors.delivery, Colors.primaryLight] as const,
  admin: [Colors.admin, Colors.primaryLight] as const,
  overlay: ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)'] as const,
};

// Common Styles
export const CommonStyles = {
  // Container styles
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Card styles
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  
  // Button styles
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  
  // Text styles
  text: {
    primary: {
      color: Colors.textPrimary,
      fontSize: Typography.fontSize.base,
      fontWeight: Typography.fontWeight.normal,
    },
    secondary: {
      color: Colors.textSecondary,
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.normal,
    },
    heading: {
      color: Colors.textPrimary,
      fontSize: Typography.fontSize.xl,
      fontWeight: Typography.fontWeight.bold,
    },
  },
  
  // Input styles
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
  },
  
  // Header styles
  header: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
};