'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { InputField, TextAreaField } from '@/components/Field';
import type { ClientConfiguration } from '@/lib/qoobix/types';

type NewJobFormProps = {
  client: ClientConfiguration;
};

const objectives = [
  'Market-entry analysis',
  'Distributor discovery',
  'Partner discovery',
  'Competitor mapping',
  'Regional opportunity assessment',
  'Lead/prospect discovery',
  'Positioning analysis',
  'Pricing/channel analysis',
  'Action-priority report'
];

export function NewJobForm({ client }: NewJobFormProps) {
  const [form, setForm] = useState({
    productOrService: client.productsServices ?? '',
    targetCountries: client.targetCountries.join(', '),
    marketQuestion: '',
    commercialObjective: objectives[0],
    targetCustomerTypes: client.targetCustomerTypes.join(', '),
    targetChannels: client.targetChannels.join(', '),
    knownCompetitors: client.knownCompetitors ?? '',
    knownPartners: client.knownRepresentatives ?? '',
    preferredOutputLanguage: client.preferredLanguage,
    requiredOutputTypes: client.availableReportTypes.join(',')
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitJob(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientId: client.id,
          clientSlug: client.slug,
          ...form,
          requiredOutputTypes: form.requiredOutputTypes
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        })
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        jobId?: string;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.jobId) {
        setError(payload.error ?? 'The job could not be created.');
        return;
      }

      window.location.href = `/job/${payload.jobId}`;
    } catch {
      setError('The job could not be created because the request failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitJob} className="space-y-6">
      <TextAreaField
        label="Product or service to analyse"
        name="productOrService"
        value={form.productOrService}
        onChange={(event) => updateField('productOrService', event.target.value)}
        required
      />

      <InputField
        label="Target country or countries"
        name="targetCountries"
        value={form.targetCountries}
        onChange={(event) => updateField('targetCountries', event.target.value)}
        required
      />

      <TextAreaField
        label="Market question"
        name="marketQuestion"
        hint="Example: Which regions in Germany should we prioritise for distributor discovery?"
        value={form.marketQuestion}
        onChange={(event) => updateField('marketQuestion', event.target.value)}
        required
      />

      <label className="block">
        <span className="text-sm font-semibold">Commercial objective</span>
        <select
          name="commercialObjective"
          value={form.commercialObjective}
          onChange={(event) => updateField('commercialObjective', event.target.value)}
          className="qoobix-focus-ring mt-2 w-full rounded-2xl border border-[var(--qoobix-border)] bg-white/75 px-4 py-3 text-sm outline-none"
        >
          {objectives.map((objective) => (
            <option key={objective} value={objective}>
              {objective}
            </option>
          ))}
        </select>
      </label>

      <TextAreaField
        label="Target customer types"
        name="targetCustomerTypes"
        value={form.targetCustomerTypes}
        onChange={(event) => updateField('targetCustomerTypes', event.target.value)}
      />

      <TextAreaField
        label="Target channels"
        name="targetChannels"
        value={form.targetChannels}
        onChange={(event) => updateField('targetChannels', event.target.value)}
      />

      <TextAreaField
        label="Known competitors"
        name="knownCompetitors"
        value={form.knownCompetitors}
        onChange={(event) => updateField('knownCompetitors', event.target.value)}
      />

      <TextAreaField
        label="Known partners/distributors/representatives"
        name="knownPartners"
        value={form.knownPartners}
        onChange={(event) => updateField('knownPartners', event.target.value)}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <InputField
          label="Preferred output language"
          name="preferredOutputLanguage"
          value={form.preferredOutputLanguage}
          onChange={(event) => updateField('preferredOutputLanguage', event.target.value)}
        />

        <InputField
          label="Required output types"
          name="requiredOutputTypes"
          hint="docx,xlsx"
          value={form.requiredOutputTypes}
          onChange={(event) => updateField('requiredOutputTypes', event.target.value)}
        />
      </div>

      {error ? <p className="text-sm font-semibold text-[var(--qoobix-danger)]">{error}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating job…' : 'Create intelligence job'}
      </Button>
    </form>
  );
}
