import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppSettingsProvider, useAppSettings } from '@/contexts/AppSettingsContext';
import { Colors } from '@/constants/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <AppSettingsProvider>
      <RootNavigator />
    </AppSettingsProvider>
  );
}

function RootNavigator() {
  const { darkMode, colors } = useAppSettings();

  return (
    <ThemeProvider value={darkMode ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerBackTitle: 'Back',
          headerTintColor: darkMode ? colors.text : Colors.primary,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            color: colors.text,
            fontWeight: '600',
            fontSize: 17,
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="student-detail" options={{ headerShown: true, title: 'Student Detail' }} />
        <Stack.Screen name="assessment-detail" options={{ headerShown: true, title: 'Assessment Detail' }} />
        <Stack.Screen name="planner-detail" options={{ headerShown: true, title: 'Planner Detail' }} />
        <Stack.Screen name="analytics-topic-detail" options={{ headerShown: true, title: 'Analytics Detail' }} />
      </Stack>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

