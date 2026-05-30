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
    recoveryPhrase: '',
    confirmRecoveryPhrase: ''
  });

  const [message, setMessage] = useState('');
  const [generatedAccessCode, setGeneratedAccessCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function rotateAccessCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setGeneratedAccessCode('');
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
        accessCode?: string;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.accessCode) {
        setMessage(payload.error ?? 'Access code rotation failed.');
        return;
      }

      setForm({
        currentAccessCode: '',
        recoveryPhrase: '',
        confirmRecoveryPhrase: ''
      });

      setGeneratedAccessCode(payload.accessCode);
      setMessage(
        'Proteus generated a new access code. Copy it now. The previous access code no longer grants access.'
      );
    } catch {
      setMessage('Access code rotation failed because the request could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={rotateAccessCode} className="space-y-5">
      <InputField
        label="Current access code"
        name="currentAccessCode"
        type="password"
        value={form.currentAccessCode}
        onChange={(event) => updateField('currentAccessCode', event.target.value)}
        required
        autoComplete="off"
      />

      <div className="rounded-md border border-[var(--qoobix-border)] bg-white/65 p-4">
        <h3 className="text-sm font-semibold">Access code rotation</h3>
        <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
          Clients do not choose access codes. Proteus generates a strong code, shows it once, and
          stores only the hash. Rotate the code if you believe the current one has been exposed or
          if you simply want fresh access.
        </p>
      </div>

      <div className="rounded-md border border-[var(--qoobix-border)] bg-white/65 p-4">
        <h3 className="text-sm font-semibold">Recovery phrase</h3>
        <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
          Use 8–80 characters and no spaces. Hyphens are allowed. This phrase lets you recover
          access if you forget the generated access code.
        </p>

        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <InputField
            label="Recovery phrase"
            name="recoveryPhrase"
            type="password"
            value={form.recoveryPhrase}
            onChange={(event) => updateField('recoveryPhrase', event.target.value)}
            required
            autoComplete="new-password"
          />

          <InputField
            label="Confirm recovery phrase"
            name="confirmRecoveryPhrase"
            type="password"
            value={form.confirmRecoveryPhrase}
            onChange={(event) => updateField('confirmRecoveryPhrase', event.target.value)}
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

      {generatedAccessCode ? (
        <div className="rounded-md border border-[var(--qoobix-orange)] bg-white/85 p-5">
          <h3 className="text-sm font-semibold">New Proteus-generated access code</h3>
          <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
            Copy this now. QOOBIX will not show it again.
          </p>
          <code className="mt-4 block overflow-x-auto rounded-md bg-white px-4 py-3 text-sm font-semibold">
            {generatedAccessCode}
          </code>
        </div>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Generating…' : 'Generate new access code'}
      </Button>
    </form>
  );
}
