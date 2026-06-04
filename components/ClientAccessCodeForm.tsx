'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { InputField } from '@/components/Field';
import { getClientLocale } from '@/lib/qoobix/client-i18n';
import type { ClientConfiguration } from '@/lib/qoobix/types';

type ClientAccessCodeFormProps = {
  client: ClientConfiguration;
};

const labels = {
  en: {
    currentAccessCode: 'Current access code',
    recoveryPhraseTitle: 'Recovery phrase',
    recoveryPhraseText:
      'Choose a recovery phrase before Proteus generates your new access code. Use 8–80 characters, no spaces. Hyphens are allowed. Store it safely; it lets you recover access if you lose the generated access code.',
    recoveryPhrase: 'Recovery phrase',
    confirmRecoveryPhrase: 'Confirm recovery phrase',
    generationTitle: 'Access code generation',
    generationText:
      'Clients do not choose access codes. Proteus generates a strong code, shows it once, and stores only the hash.',
    rotationFailed: 'Access code rotation failed.',
    requestFailed: 'Access code rotation failed because the request could not be completed.',
    generatedMessage:
      'Proteus generated a new access code. Copy it now. The previous access code no longer grants access.',
    generatedTitle: 'New Proteus-generated access code',
    generatedText: 'Copy this now. QOOBIX will not show it again.',
    generating: 'Generating…',
    submit: 'Set recovery phrase and generate access code'
  },
  es: {
    currentAccessCode: 'Código de acceso actual',
    recoveryPhraseTitle: 'Frase de recuperación',
    recoveryPhraseText:
      'Elija una frase de recuperación antes de que Proteus genere su nuevo código de acceso. Use entre 8 y 80 caracteres, sin espacios. Se permiten guiones. Guárdela de forma segura; le permitirá recuperar el acceso si pierde el código generado.',
    recoveryPhrase: 'Frase de recuperación',
    confirmRecoveryPhrase: 'Confirmar frase de recuperación',
    generationTitle: 'Generación del código de acceso',
    generationText:
      'Los clientes no eligen los códigos de acceso. Proteus genera un código fuerte, lo muestra una sola vez y guarda solo el hash.',
    rotationFailed: 'La rotación del código de acceso ha fallado.',
    requestFailed:
      'La rotación del código de acceso ha fallado porque la petición no se ha completado.',
    generatedMessage:
      'Proteus ha generado un nuevo código de acceso. Cópielo ahora. El código anterior ya no permite acceder.',
    generatedTitle: 'Nuevo código de acceso generado por Proteus',
    generatedText: 'Cópielo ahora. QOOBIX no volverá a mostrarlo.',
    generating: 'Generando…',
    submit: 'Definir frase de recuperación y generar código de acceso'
  },
  it: {
    currentAccessCode: 'Codice di accesso attuale',
    recoveryPhraseTitle: 'Frase di recupero',
    recoveryPhraseText:
      'Scegli una frase di recupero prima che Proteus generi il nuovo codice di accesso. Usa 8–80 caratteri, senza spazi. I trattini sono consentiti. Conservala in modo sicuro; permette di recuperare l’accesso se perdi il codice generato.',
    recoveryPhrase: 'Frase di recupero',
    confirmRecoveryPhrase: 'Conferma frase di recupero',
    generationTitle: 'Generazione del codice di accesso',
    generationText:
      'I clienti non scelgono i codici di accesso. Proteus genera un codice forte, lo mostra una sola volta e conserva solo l’hash.',
    rotationFailed: 'Rotazione del codice di accesso non riuscita.',
    requestFailed:
      'Rotazione del codice di accesso non riuscita perché la richiesta non è stata completata.',
    generatedMessage:
      'Proteus ha generato un nuovo codice di accesso. Copialo ora. Il codice precedente non consente più l’accesso.',
    generatedTitle: 'Nuovo codice di accesso generato da Proteus',
    generatedText: 'Copialo ora. QOOBIX non lo mostrerà di nuovo.',
    generating: 'Generazione…',
    submit: 'Imposta frase di recupero e genera codice di accesso'
  }
};

export function ClientAccessCodeForm({ client }: ClientAccessCodeFormProps) {
  const t = labels[getClientLocale(client)];

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
        setMessage(payload.error ?? t.rotationFailed);
        return;
      }

      setForm({
        currentAccessCode: '',
        recoveryPhrase: '',
        confirmRecoveryPhrase: ''
      });

      setGeneratedAccessCode(payload.accessCode);
      setMessage(t.generatedMessage);
    } catch {
      setMessage(t.requestFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={rotateAccessCode} className="space-y-5">
      <InputField
        label={t.currentAccessCode}
        name="currentAccessCode"
        type="password"
        value={form.currentAccessCode}
        onChange={(event) => updateField('currentAccessCode', event.target.value)}
        required
        autoComplete="off"
      />

      <div className="rounded-md border border-[var(--qoobix-border)] bg-white/65 p-4">
        <h3 className="text-sm font-semibold">{t.recoveryPhraseTitle}</h3>
        <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
          {t.recoveryPhraseText}
        </p>

        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <InputField
            label={t.recoveryPhrase}
            name="recoveryPhrase"
            type="password"
            value={form.recoveryPhrase}
            onChange={(event) => updateField('recoveryPhrase', event.target.value)}
            required
            autoComplete="new-password"
          />

          <InputField
            label={t.confirmRecoveryPhrase}
            name="confirmRecoveryPhrase"
            type="password"
            value={form.confirmRecoveryPhrase}
            onChange={(event) => updateField('confirmRecoveryPhrase', event.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
      </div>

      <div className="rounded-md border border-[var(--qoobix-border)] bg-white/65 p-4">
        <h3 className="text-sm font-semibold">{t.generationTitle}</h3>
        <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">{t.generationText}</p>
      </div>

      {message ? (
        <p className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-3 text-sm font-semibold">
          {message}
        </p>
      ) : null}

      {generatedAccessCode ? (
        <div className="rounded-md border border-[var(--qoobix-orange)] bg-white/85 p-5">
          <h3 className="text-sm font-semibold">{t.generatedTitle}</h3>
          <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">{t.generatedText}</p>
          <code className="mt-4 block overflow-x-auto rounded-md bg-white px-4 py-3 text-sm font-semibold">
            {generatedAccessCode}
          </code>
        </div>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t.generating : t.submit}
      </Button>
    </form>
  );
}
