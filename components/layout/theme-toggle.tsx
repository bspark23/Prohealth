'use client';

import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
const [theme, setThemeState] = useState<'light' | 'dark'>('light');
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
  // Simple theme detection for demo
  const isDark = document.documentElement.classList.contains('dark');
  setThemeState(isDark ? 'dark' : 'light');
}, []);

const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setThemeState(newTheme);
  
  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('mental_health_theme', newTheme);
  }
};

if (!mounted) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      className="transition-transform duration-300 hover:scale-110"
    >
      <Sun className="h-[1.2rem] w-[1.2rem]" />
    </Button>
  );
}

return (
  <Button
    variant="ghost"
    size="icon"
    onClick={toggleTheme}
    aria-label="Toggle theme"
    className="transition-transform duration-300 hover:scale-110"
  >
    {theme === 'light' ? (
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
    ) : (
      <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
    )}
    <span className="sr-only">Toggle theme</span>
  </Button>
);
}
