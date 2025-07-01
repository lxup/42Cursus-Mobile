import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/lib/react-query';
import { SupabaseProvider } from '@/context/SupabaseProvider';
import { AuthProvider, useAuth } from '@/context/AuthProvider';
import { ThemeProvider as CustomThemeProvider } from '@/context/ThemeProvider';
import { BottomSheetManager } from '@/components/BottomSheets/BottomSheetManager';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const ProtectedLayout = () => {
  const { session } = useAuth();
  if (session === undefined) return null; // Wait for session to be defined
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // animation: 'fade',
      }}
    >
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="note/[id]/index" options={{ presentation: 'modal' }}/>
      <Stack.Screen name="user/[username]/index" options={{ presentation: 'modal' }}/>
    </Stack>
  );
};

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const unlockScreenOerientation = async () => {
      await ScreenOrientation.unlockAsync()
    }
    unlockScreenOerientation()
  }, [])

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <CustomThemeProvider>
          <SupabaseProvider>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <ProtectedLayout />
                <BottomSheetManager />
                <StatusBar style="auto" />
              </AuthProvider>
            </QueryClientProvider>
          </SupabaseProvider>
        </CustomThemeProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
