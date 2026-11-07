import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';

// Aplikasi memakai satu layar dengan palet terang, jadi tab bawaan template tidak dipakai.
const tema = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#F2FAF4' },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={tema}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
