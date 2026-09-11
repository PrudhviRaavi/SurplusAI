import { StyleSheet, Platform } from 'react-native';

const fontFamilyHeading = Platform.select({
  ios: 'System',
  android: 'Poppins_700Bold',
  web: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  default: 'System',
});

const fontFamilySerif = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: '"Playfair Display", "Cormorant Garamond", Georgia, "Times New Roman", serif',
  default: 'serif',
});

const fontFamilyBody = Platform.select({
  ios: 'System',
  android: 'Inter_400Regular',
  web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  default: 'System',
});

export const fontFamily = {
  headingBold: fontFamilyHeading,
  headingSemiBold: fontFamilyHeading,
  headingMedium: fontFamilyHeading,
  headingRegular: fontFamilyHeading,
  headingExtra: fontFamilyHeading,
  heading: fontFamilyHeading,
  bodyBold: fontFamilyBody,
  bodySemiBold: fontFamilyBody,
  bodyMedium: fontFamilyBody,
  bodyRegular: fontFamilyBody,
  bodySmall: fontFamilyBody,
  body: fontFamilyBody,
  medium: fontFamilyBody,
  caption: fontFamilyBody,
  button: fontFamilyHeading,
  serif: fontFamilySerif,
};

export const typography = {
  fontFamily,
  
  sizes: {
    hero: 34,
    h1: 28,
    h2: 22,
    h3: 18,
    bodyLarge: 16,
    body: 14,
    caption: 12,
    small: 10,
  },
  
  styles: StyleSheet.create({
    heroTitle: {
      fontSize: 34,
      fontWeight: '800',
      letterSpacing: -0.8,
      lineHeight: 40,
      color: '#1F1F1F',
      fontFamily: fontFamilyHeading,
    },
    serifHeadline: {
      fontSize: 32,
      fontStyle: 'italic',
      fontWeight: '600',
      letterSpacing: -0.4,
      lineHeight: 40,
      color: '#1F1F1F',
      fontFamily: fontFamilySerif,
    },
    h1: {
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: -0.5,
      lineHeight: 34,
      color: '#1F1F1F',
      fontFamily: fontFamilyHeading,
    },
    h2: {
      fontSize: 22,
      fontWeight: '700',
      letterSpacing: -0.3,
      lineHeight: 28,
      color: '#1F1F1F',
      fontFamily: fontFamilyHeading,
    },
    h3: {
      fontSize: 18,
      fontWeight: '600',
      letterSpacing: -0.2,
      lineHeight: 24,
      color: '#1F1F1F',
      fontFamily: fontFamilyHeading,
    },
    bodyLarge: {
      fontSize: 16,
      fontWeight: '400',
      letterSpacing: -0.1,
      lineHeight: 24,
      color: '#6B7280',
      fontFamily: fontFamilyBody,
    },
    body: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      color: '#6B7280',
      fontFamily: fontFamilyBody,
    },
    caption: {
      fontSize: 12,
      fontWeight: '500',
      letterSpacing: 0.2,
      color: '#6B7280',
      fontFamily: fontFamilyBody,
    },
    badge: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      fontFamily: fontFamilyHeading,
    },
  }),
};
