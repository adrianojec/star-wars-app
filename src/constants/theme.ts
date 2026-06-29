import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#0F172A",
    background: "#F8FAFC",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#E2E8F0",
    textSecondary: "#64748B",
    accent: "#0284C7",
    warning: "#D97706",
    danger: "#DC2626",
    border: "#E2E8F0",
    cardBackground: "#FFFFFF",
  },
  dark: {
    text: "#F8FAFC",
    background: "#060B13",
    backgroundElement: "#0F172A",
    backgroundSelected: "#1E293B",
    textSecondary: "#94A3B8",
    accent: "#06B6D4",
    warning: "#F59E0B",
    danger: "#EF4444",
    border: "#1E293B",
    cardBackground: "rgba(15, 23, 42, 0.75)",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: "System",
    serif: "Georgia",
    rounded: "System",
    mono: "Courier",
  },
  android: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
});

export const Spacing = {
  half: 4,
  one: 8,
  two: 12,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
} as const;


export const Border = {
  radius: {
    small: 6,
    medium: 12,
    large: 16,
    round: 9999,
  },
  width: {
    thin: 1,
    medium: 2,
  },
};

