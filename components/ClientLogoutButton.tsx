'use client';

import { useState } from 'react';

type ClientLogoutButtonProps = {
  className?: string;
  label?: string;
  loadingLabel?: string;
};

export function ClientLogoutButton({
  className = '',
  label = 'Sign out',
  loadingLabel = 'Signing out…'
}: ClientLogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logout() {
    setIsLoggingOut(true);

    try {
      await fetch('/api/logout', {
        method: 'POST'
      });
    } finally {
      window.location.href = '/access';
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={isLoggingOut}
      className={`qoobix-focus-ring inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--qoobix-border)] bg-white/58 px-4 py-2.5 text-sm font-semibold text-[var(--qoobix-muted)] shadow-[0_8px_22px_rgba(51,36,26,0.045)] transition hover:border-[var(--qoobix-border-strong)] hover:bg-white hover:text-[var(--qoobix-text)] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {isLoggingOut ? loadingLabel : label}
    </button>
  );
}
