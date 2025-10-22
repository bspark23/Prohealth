'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTheme, saveTheme } from '@/lib/local-storage';
import { Theme } from '@/lib/types';

type ThemeContextType = {
theme: Theme;
setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
const [theme, setThemeState] = useState<Theme>('light');
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
  if (typeof window !== 'undefined') {
    const storedTheme = getTheme();
    setThemeState(storedTheme);
    document.documentElement.classList.add(storedTheme);
  }
}, []);

const setTheme = (newTheme: Theme) => {
  if (typeof window !== 'undefined') {
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
    saveTheme(newTheme);
    setThemeState(newTheme);
  }
};

return (
  <ThemeContext.Provider value={{ theme, setTheme }}>
    {children}
  </ThemeContext.Provider>
);
}

export const useTheme = () => {
const context = useContext(ThemeContext);
if (context === undefined) {
  throw new Error('useTheme must be used within a ThemeProvider');
}
return context;
};
