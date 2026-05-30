'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { InputField } from '@/components/Field';

export function AccessForm() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitAccessCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        clientSlug?: string;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.clientSlug) {
        setError(payload.error ?? 'Access rejected. Proteus remained unimpressed.');
        return;
      }

      window.location.href = `/client/${payload.clientSlug}`;
    } catch {
      setError('Something failed while checking the access code.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitAccessCode} className="space-y-5">
      <InputField
        label="Access code"
        name="code"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        required
        autoComplete="off"
      />

      {error ? <p className="text-sm font-semibold text-[var(--qoobix-danger)]">{error}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Checking…' : 'Enter'}
      </Button>
    </form>
  );
}
