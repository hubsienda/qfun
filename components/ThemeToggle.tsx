'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
    root.dataset.theme = 'dark';
  } else {
    root.classList.remove('dark');
    root.dataset.theme = 'light';
  }

  localStorage.setItem('qoobix-theme', theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stored = localStorage.getItem('qoobix-theme') as Theme | null;
    const systemTheme: Theme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';

    const initialTheme = stored ?? systemTheme;

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="qoobix-focus inline-flex h-10 items-center gap-2 rounded-full border px-3 text-sm transition hover:-translate-y-0.5"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--panel)',
        color: 'var(--foreground)'
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span aria-hidden="true" className="text-base">
        {theme === 'dark' ? '☀︎' : '☾'}
      </span>
      <span className="hidden sm:inline">
        {theme === 'dark' ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}
