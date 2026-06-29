import { Colors } from "@/constants/theme";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { Platform, StatusBar, useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "light" ? Colors.light : Colors.dark;

  const currentTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  const customTheme = {
    ...currentTheme,
    colors: {
      ...currentTheme.colors,
      background: colors.background,
      card: colors.backgroundElement,
      text: colors.text,
      border: colors.border,
      primary: colors.accent,
    },
  };

  return (
    <ThemeProvider value={customTheme}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.backgroundElement,
          },
          headerTintColor: colors.accent,
          headerTitleStyle: {
            fontWeight: "bold",
            ...Platform.select({
              ios: { fontFamily: "System" },
              android: { fontFamily: "normal" },
            }),
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Star Wars Codex",
            headerTitleStyle: {
              fontWeight: "900",
              fontSize: 20,
              color: colors.text,
            },
          }}
        />
        <Stack.Screen
          name="details/[id]"
          options={{
            title: "Character Dossier",
            headerBackTitle: "Archives",
            headerTitleStyle: {
              fontWeight: "900",
              fontSize: 18,
              color: colors.text,
            },
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
