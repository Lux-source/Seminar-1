'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <div className="flex items-center space-x-2">
      <span>The current theme is: {currentTheme}</span>
      <button
        className="px-2 py-1 bg-gray-200 rounded dark:bg-gray-700"
        onClick={() => setTheme('light')}
      >
        Light Mode
      </button>
      <button
        className="px-2 py-1 bg-gray-800 text-white rounded dark:bg-gray-200 dark:text-black"
        onClick={() => setTheme('dark')}
      >
        Dark Mode
      </button>
      <button
        className="px-2 py-1 bg-blue-500 text-white rounded"
        onClick={() => setTheme('system')}
      >
        System Mode
      </button>
    </div>
  );
}
