'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      className="rounded-full p-2 text-gray-400 hover:text-gray-900 focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:text-gray-300 dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-300"
      onClick={toggleTheme}
      aria-label="Toggle Theme"
    >
      {currentTheme === 'dark' ? (
        <SunIcon className="h-6 w-6 text-yellow-500" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-6 w-6 text-gray-300" aria-hidden="true" />
      )}
    </button>
  );
}

