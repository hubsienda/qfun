'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { InputField } from '@/components/Field';

export function AccessRecoveryForm() {
  const [form, setForm] = useState({
    clientSlug: '',
    recoveryPhrase: ''
  });

  const [message, setMessage] = useState('');
  const [generatedAccessCode, setGeneratedAccessCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitRecovery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setGeneratedAccessCode('');
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
        accessCode?: string;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.accessCode) {
        setMessage(payload.error ?? 'Access recovery failed.');
        return;
      }

      setMessage('Proteus generated a new access code. Copy it now, then use it to enter.');
      setGeneratedAccessCode(payload.accessCode);

      setForm({
        clientSlug: '',
        recoveryPhrase: ''
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
