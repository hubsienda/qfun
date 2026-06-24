'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { InputField, SelectField, TextAreaField } from '@/components/Field';
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
      'Controls the language proposed for generated reports. It does not change the application interface.'
  },
  es: {
    applicationLanguage: 'Idioma de la aplicación',
    applicationLanguageHint: 'Controla la interfaz de QOOBIX que ve este cliente.',
    preferredOutputLanguage: 'Idioma predeterminado de informes/resultados',
    preferredOutputLanguageHint:
      'Controla el idioma propuesto para los informes generados. No cambia la interfaz de la aplicación.'
  },
  it: {
    applicationLanguage: 'Lingua dell’applicazione',
    applicationLanguageHint: 'Controlla l’interfaccia QOOBIX mostrata a questo cliente.',
    preferredOutputLanguage: 'Lingua predefinita dei report/output',
    preferredOutputLanguageHint:
      'Controlla la lingua proposta per i report generati. Non cambia l’interfaccia dell’applicazione.'
  }
};

const applicationLanguageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'Italian', label: 'Italian' }
];

function FormGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--qoobix-border)] bg-white/44 p-5 shadow-[0_8px_22px_rgba(51,36,26,0.03)]">
      {children}
    </div>
  );
}

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
      <FormGroup>
        <InputField
          label={t.profileForm.sector}
          name="sector"
          value={form.sector}
          onChange={(event) => updateField('sector', event.target.value)}
          required
        />
      </FormGroup>

      <FormGroup>
        <TextAreaField
          label={t.profileForm.description}
          name="description"
          value={form.description}
          onChange={(event) => updateField('description', event.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <InputField
          label={t.profileForm.website}
          name="website"
          value={form.website}
          onChange={(event) => updateField('website', event.target.value)}
          placeholder="https://example.com"
        />
      </FormGroup>

      <FormGroup>
        <TextAreaField
          label={t.profileForm.productsServices}
          name="productsServices"
          value={form.productsServices}
          onChange={(event) => updateField('productsServices', event.target.value)}
          required
        />
      </FormGroup>

      <FormGroup>
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
      </FormGroup>

      <FormGroup>
        <TextAreaField
          label={t.profileForm.targetChannels}
          name="targetChannels"
          hint={t.profileForm.targetChannelsHint}
          value={form.targetChannels}
          onChange={(event) => updateField('targetChannels', event.target.value)}
        />
      </FormGroup>

      <FormGroup>
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
      </FormGroup>

      <FormGroup>
        <div className="space-y-5">
          <SelectField
            label={languageT.applicationLanguage}
            name="preferredLanguage"
            hint={languageT.applicationLanguageHint}
            value={form.preferredLanguage}
            onChange={(event) => updateField('preferredLanguage', event.target.value)}
          >
            {applicationLanguageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>

          <InputField
            label={languageT.preferredOutputLanguage}
            name="preferredOutputLanguage"
            hint={languageT.preferredOutputLanguageHint}
            value={form.preferredOutputLanguage}
            onChange={(event) => updateField('preferredOutputLanguage', event.target.value)}
          />
        </div>
      </FormGroup>

      {message ? (
        <p className="rounded-xl border border-[var(--qoobix-border)] bg-white/56 px-4 py-3 text-sm font-semibold leading-6 text-[var(--qoobix-text)] shadow-[0_8px_22px_rgba(51,36,26,0.035)]">
          {message}
        </p>
      ) : null}

      <div className="pt-1">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t.profileForm.saving : t.profileForm.save}
        </Button>
      </div>
    </form>
  );
}
