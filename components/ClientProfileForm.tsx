'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { InputField, TextAreaField } from '@/components/Field';
import type { ClientConfiguration } from '@/lib/qoobix/types';

type ClientProfileFormProps = {
  client: ClientConfiguration;
};

export function ClientProfileForm({ client }: ClientProfileFormProps) {
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
    preferredLanguage: client.preferredLanguage
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
        setMessage(payload.error ?? 'Profile update failed.');
        return;
      }

      window.location.href = `/client/${client.slug}`;
    } catch {
      setMessage('Profile update failed because the request could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitProfile} className="space-y-6">
      <InputField
        label="Sector"
        name="sector"
        value={form.sector}
        onChange={(event) => updateField('sector', event.target.value)}
        required
      />

      <TextAreaField
        label="Description"
        name="description"
        value={form.description}
        onChange={(event) => updateField('description', event.target.value)}
      />

      <InputField
        label="Website"
        name="website"
        value={form.website}
        onChange={(event) => updateField('website', event.target.value)}
        placeholder="https://example.com"
      />

      <TextAreaField
        label="Products/services"
        name="productsServices"
        value={form.productsServices}
        onChange={(event) => updateField('productsServices', event.target.value)}
        required
      />

      <div className="grid gap-5 md:grid-cols-2">
        <TextAreaField
          label="Target countries"
          name="targetCountries"
          hint="Comma or line separated."
          value={form.targetCountries}
          onChange={(event) => updateField('targetCountries', event.target.value)}
          required
        />

        <TextAreaField
          label="Target customer types"
          name="targetCustomerTypes"
          hint="Comma or line separated."
          value={form.targetCustomerTypes}
          onChange={(event) => updateField('targetCustomerTypes', event.target.value)}
        />
      </div>

      <TextAreaField
        label="Target channels"
        name="targetChannels"
        hint="Distributors, installers, agents, representatives, wholesalers, direct clients, etc."
        value={form.targetChannels}
        onChange={(event) => updateField('targetChannels', event.target.value)}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <TextAreaField
          label="Known competitors"
          name="knownCompetitors"
          value={form.knownCompetitors}
          onChange={(event) => updateField('knownCompetitors', event.target.value)}
        />

        <TextAreaField
          label="Known representatives/distributors/partners"
          name="knownRepresentatives"
          value={form.knownRepresentatives}
          onChange={(event) => updateField('knownRepresentatives', event.target.value)}
        />
      </div>

      <InputField
        label="Preferred language"
        name="preferredLanguage"
        value={form.preferredLanguage}
        onChange={(event) => updateField('preferredLanguage', event.target.value)}
      />

      {message ? (
        <p className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-3 text-sm font-semibold">
          {message}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save business profile'}
      </Button>
    </form>
  );
}
