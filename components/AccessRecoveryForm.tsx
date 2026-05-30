'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { InputField } from '@/components/Field';

export function AccessRecoveryForm() {
  const [form, setForm] = useState({
    clientSlug: '',
    recoveryPhrase: '',
    newAccessCode: '',
    confirmAccessCode: ''
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitRecovery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/access/recover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        clientSlug?: string;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.clientSlug) {
        setMessage(payload.error ?? 'Access recovery failed.');
        return;
      }

      setMessage('Access code reset. You can now enter with your new access code.');

      setForm({
        clientSlug: '',
        recoveryPhrase: '',
        newAccessCode: '',
        confirmAccessCode: ''
      });
    } catch {
      setMessage('Access recovery failed because the request could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitRecovery} className="space-y-5">
      <InputField
        label="Business access name"
        name="clientSlug"
        hint="Use your business name without spaces, for example: sienda"
        value={form.clientSlug}
        onChange={(event) => updateField('clientSlug', event.target.value)}
        required
        autoComplete="off"
      />

      <InputField
        label="Recovery phrase"
        name="recoveryPhrase"
        hint="8–80 characters, no spaces. Hyphens are allowed."
        type="password"
        value={form.recoveryPhrase}
        onChange={(event) => updateField('recoveryPhrase', event.target.value)}
        required
        autoComplete="off"
      />

      <div className="rounded-md border border-[var(--qoobix-border)] bg-white/65 p-4">
        <h3 className="text-sm font-semibold">New access code rules</h3>
        <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
          Use 8–80 characters, no spaces, at least one lowercase letter, one uppercase letter, and
          one number.
        </p>

        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <InputField
            label="New access code"
            name="newAccessCode"
            type="password"
            value={form.newAccessCode}
            onChange={(event) => updateField('newAccessCode', event.target.value)}
            required
            autoComplete="new-password"
          />

          <InputField
            label="Confirm new access code"
            name="confirmAccessCode"
            type="password"
            value={form.confirmAccessCode}
            onChange={(event) => updateField('confirmAccessCode', event.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
      </div>

      {message ? (
        <p className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-3 text-sm font-semibold">
          {message}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Resetting…' : 'Reset access code'}
      </Button>
    </form>
  );
}
