'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { InputField } from '@/components/Field';
import type { ClientConfiguration } from '@/lib/qoobix/types';

type ClientAccessCodeFormProps = {
  client: ClientConfiguration;
};

export function ClientAccessCodeForm({ client }: ClientAccessCodeFormProps) {
  const [form, setForm] = useState({
    currentAccessCode: '',
    newAccessCode: '',
    confirmAccessCode: ''
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitAccessCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/client/${client.slug}/access-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientSlug: client.slug,
          ...form
        })
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        setMessage(payload.error ?? 'Access code update failed.');
        return;
      }

      setForm({
        currentAccessCode: '',
        newAccessCode: '',
        confirmAccessCode: ''
      });
      setMessage('Access code updated. The previous code no longer grants access.');
    } catch {
      setMessage('Access code update failed because the request could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitAccessCode} className="space-y-5">
      <InputField
        label="Current access code"
        name="currentAccessCode"
        type="password"
        value={form.currentAccessCode}
        onChange={(event) => updateField('currentAccessCode', event.target.value)}
        required
        autoComplete="off"
      />

      <InputField
        label="New private access code"
        name="newAccessCode"
        type="password"
        value={form.newAccessCode}
        onChange={(event) => updateField('newAccessCode', event.target.value)}
        required
        autoComplete="new-password"
      />

      <InputField
        label="Confirm new private access code"
        name="confirmAccessCode"
        type="password"
        value={form.confirmAccessCode}
        onChange={(event) => updateField('confirmAccessCode', event.target.value)}
        required
        autoComplete="new-password"
      />

      {message ? (
        <p className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-3 text-sm font-semibold">
          {message}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating…' : 'Change access code'}
      </Button>
    </form>
  );
}
