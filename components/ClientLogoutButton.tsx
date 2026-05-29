'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';

export function ClientLogoutButton() {
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
    <Button type="button" variant="secondary" onClick={logout} disabled={isLoggingOut}>
      {isLoggingOut ? 'Logging out…' : 'Log out'}
    </Button>
  );
}
