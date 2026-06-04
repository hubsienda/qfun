'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { InputField, TextAreaField } from '@/components/Field';
import { getClientDictionary, getClientLocale } from '@/lib/qoobix/client-i18n';
import type { ClientConfiguration } from '@/lib/qoobix/types';

type ClientProfileFormProps = {
  client: ClientConfiguration;
};

const languageLabels = {
  en: {
    applicationLanguage: 'Application language',
    applicationLanguageHint: 'Controls the QOOBIX interface shown to this client.',
    preferredOutputLanguage: 'Default report/output language',
    preferredOutputLanguageHint:
      'Controls the language proposed for generated reports. It does not change the application interface.',
    languageExamples: 'Examples: English, Spanish, Italian'
  },
  es: {
    applicationLanguage: 'Idioma de la aplicación',
    applicationLanguageHint: 'Controla la interfaz de QOOBIX que ve este cliente.',
    preferredOutputLanguage: 'Idioma predeterminado de informes/resultados',
    preferredOutputLanguageHint:
      'Controla el idioma propuesto para los informes generados. No cambia la interfaz de la aplicación.',
    languageExamples: 'Ejemplos: English, Spanish, Italian'
  },
  it: {
    applicationLanguage: 'Lingua dell’applicazione',
    applicationLanguageHint: 'Controlla l’interfaccia QOOBIX mostrata a questo cliente.',
    preferredOutputLanguage: 'Lingua predefinita dei report/output',
    preferredOutputLanguageHint:
      'Controlla la lingua proposta per i report generati. Non cambia l’interfaccia dell’applicazione.',
    languageExamples: 'Esempi: English, Spanish, Italian'
  }
};

export function ClientProfileForm({ client }: ClientProfileFormProps) {
  const t = getClientDictionary(client);
  const languageT = languageLabels[getClientLocale(client)];

  const [form, setForm] = useState({
    sector: client.sector === 'Not configured' ? '' : client.sector,
    description: client.description ?? '',
    website: client.website ?? '',
    productsServices: client.productsServices ?? '',
    targetCountries: client.targetCountries.join(', '),
    targetCustomerTypes: client.targetCustomerTypes.join(', '),
    targetChannels: client.targetChannels.join(', '),
    knownCompetitors: client.knownCompetitors ?? '',
    knownRepresentatives: client.knownRepresentatives ?? '',
    preferredLanguage: client.preferredLanguage,
    preferredOutputLanguage: client.preferredOutputLanguage || client.preferredLanguage
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/client/${client.slug}/profile`, {
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
        setMessage(payload.error ?? t.profileForm.updateFailed);
        return;
      }

      window.location.href = `/client/${client.slug}`;
    } catch {
      setMessage(t.profileForm.requestFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitProfile} className="space-y-6">
      <InputField
        label={t.profileForm.sector}
        name="sector"
        value={form.sector}
        onChange={(event) => updateField('sector', event.target.value)}
        required
      />

      <TextAreaField
        label={t.profileForm.description}
        name="description"
        value={form.description}
        onChange={(event) => updateField('description', event.target.value)}
      />

      <InputField
        label={t.profileForm.website}
        name="website"
        value={form.website}
        onChange={(event) => updateField('website', event.target.value)}
        placeholder="https://example.com"
      />

      <TextAreaField
        label={t.profileForm.productsServices}
        name="productsServices"
        value={form.productsServices}
        onChange={(event) => updateField('productsServices', event.target.value)}
        required
      />

      <div className="grid gap-5 md:grid-cols-2">
        <TextAreaField
          label={t.profileForm.targetCountries}
          name="targetCountries"
          hint={t.profileForm.targetCountriesHint}
          value={form.targetCountries}
          onChange={(event) => updateField('targetCountries', event.target.value)}
          required
        />

        <TextAreaField
          label={t.profileForm.targetCustomerTypes}
          name="targetCustomerTypes"
          hint={t.profileForm.targetCustomerTypesHint}
          value={form.targetCustomerTypes}
          onChange={(event) => updateField('targetCustomerTypes', event.target.value)}
        />
      </div>

      <TextAreaField
        label={t.profileForm.targetChannels}
        name="targetChannels"
        hint={t.profileForm.targetChannelsHint}
        value={form.targetChannels}
        onChange={(event) => updateField('targetChannels', event.target.value)}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <TextAreaField
          label={t.profileForm.knownCompetitors}
          name="knownCompetitors"
          value={form.knownCompetitors}
          onChange={(event) => updateField('knownCompetitors', event.target.value)}
        />

        <TextAreaField
          label={t.profileForm.knownRepresentatives}
          name="knownRepresentatives"
          value={form.knownRepresentatives}
          onChange={(event) => updateField('knownRepresentatives', event.target.value)}
        />
      </div>

      <div className="rounded-lg border border-[var(--qoobix-border)] bg-white/65 p-5">
        <h2 className="text-sm font-semibold">{languageT.applicationLanguage}</h2>

        <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
          {languageT.applicationLanguageHint}
        </p>

        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <InputField
            label={languageT.applicationLanguage}
            name="preferredLanguage"
            hint={languageT.languageExamples}
            value={form.preferredLanguage}
            onChange={(event) => updateField('preferredLanguage', event.target.value)}
          />

          <InputField
            label={languageT.preferredOutputLanguage}
            name="preferredOutputLanguage"
            hint={languageT.preferredOutputLanguageHint}
            value={form.preferredOutputLanguage}
            onChange={(event) => updateField('preferredOutputLanguage', event.target.value)}
          />
        </div>
      </div>

      {message ? (
        <p className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-3 text-sm font-semibold">
          {message}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t.profileForm.saving : t.profileForm.save}
      </Button>
    </form>
  );
}
