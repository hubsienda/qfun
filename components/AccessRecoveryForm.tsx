'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { InputField } from '@/components/Field';

type AccessRecoveryFormLabels = {
  clientSlug: string;
  recoveryPhrase: string;
  failed: string;
  requestFailed: string;
  success: string;
  generatedTitle: string;
  generatedText: string;
  generating: string;
  submit: string;
};

type AccessRecoveryFormProps = {
  labels?: AccessRecoveryFormLabels;
};

const defaultLabels: AccessRecoveryFormLabels = {
  clientSlug: 'Client access name',
  recoveryPhrase: 'Recovery phrase',
  failed: 'Access recovery failed.',
  requestFailed: 'Access recovery failed because the request could not be completed.',
  success: 'Proteus generated a new access code. Copy it now, then use it to enter.',
  generatedTitle: 'New Proteus-generated access code',
  generatedText: 'Copy this now. QOOBIX will not show it again.',
  generating: 'Generating…',
  submit: 'Generate new access code'
};

export function AccessRecoveryForm({ labels = defaultLabels }: AccessRecoveryFormProps) {
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
        setMessage(payload.error ?? labels.failed);
        return;
      }

      setMessage(labels.success);
      setGeneratedAccessCode(payload.accessCode);

      setForm({
        clientSlug: '',
        recoveryPhrase: ''
      });
    } catch {
      setMessage(labels.requestFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitRecovery} className="space-y-5">
      <InputField
        label={labels.clientSlug}
        name="clientSlug"
        value={form.clientSlug}
        onChange={(event) => updateField('clientSlug', event.target.value)}
        required
        autoComplete="off"
      />

      <InputField
        label={labels.recoveryPhrase}
        name="recoveryPhrase"
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
          <h3 className="text-sm font-semibold">{labels.generatedTitle}</h3>
          <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
            {labels.generatedText}
          </p>
          <code className="mt-4 block overflow-x-auto rounded-md bg-white px-4 py-3 text-sm font-semibold">
            {generatedAccessCode}
          </code>
        </div>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? labels.generating : labels.submit}
      </Button>
    </form>
  );
}
