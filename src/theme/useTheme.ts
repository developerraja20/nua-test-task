import { useColorScheme } from 'react-native';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '../types';
import { lightTheme, darkTheme, ThemeColors } from './colors';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light',
      setMode: (mode: ThemeMode) => set({ mode }),
      toggleMode: () => {
        const current = get().mode;
        const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
        set({ mode: next });
      },
    }),
    {
      name: 'app-theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function useTheme(): {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
} {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const systemColorScheme = useColorScheme();

  const isDark =
    mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark');

  const colors = isDark ? darkTheme : lightTheme;

  return {
    mode,
    isDark,
    colors,
    setMode,
    toggleMode,
  };
}
