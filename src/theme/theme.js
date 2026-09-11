import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { colors } from './colors';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: colors.accent,
    background: colors.light.background,
    surface: colors.light.surface,
    surfaceVariant: colors.light.surfaceSubtle,
    onPrimary: colors.white,
    onSecondary: colors.white,
    onBackground: colors.light.textPrimary,
    onSurface: colors.light.textPrimary,
    onSurfaceVariant: colors.light.textSecondary,
    outline: colors.light.border,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: colors.accent,
    background: colors.dark.background,
    surface: colors.dark.surface,
    surfaceVariant: colors.dark.surfaceSubtle,
    onPrimary: colors.white,
    onSecondary: colors.white,
    onBackground: colors.dark.textPrimary,
    onSurface: colors.dark.textPrimary,
    onSurfaceVariant: colors.dark.textSecondary,
    outline: colors.dark.border,
  },
};
