'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { InputField, TextAreaField } from '@/components/Field';
import type { ClientConfiguration, IntelligenceMode } from '@/lib/qoobix/types';

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

const modeDescriptions: Record<IntelligenceMode, string> = {
  analysis:
    'Analysis Mode produces strategic intelligence, positioning, risks, priorities, and commercial reasoning without live named-organisation discovery.',
  discovery:
    'Discovery Mode is for named candidate organisations such as possible partners, distributors, competitors, suppliers, operators, or other market actors. These candidates are for verification, not confirmed leads.'
};

export function NewJobForm({ client }: NewJobFormProps) {
  const [form, setForm] = useState({
    intelligenceMode: 'analysis' as IntelligenceMode,
    productOrService: client.productsServices ?? '',
    targetCountries: client.targetCountries.join(', '),
    marketQuestion: '',
    commercialObjective: objectives[0],
    targetCustomerTypes: client.targetCustomerTypes.join(', '),
    targetChannels: client.targetChannels.join(', '),
    knownCompetitors: client.knownCompetitors ?? '',
    knownPartners: client.knownRepresentatives ?? '',
    preferredOutputLanguage: client.preferredLanguage
  });

  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitJob(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('Creating the request and preparing the job page…');
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
          requiredOutputTypes: client.availableReportTypes.length
            ? client.availableReportTypes
            : ['docx', 'xlsx', 'rtf', 'csv']
        })
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        jobId?: string;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.jobId) {
        setNotice('');
        setError(payload.error ?? 'The intelligence request could not be created.');
        return;
      }

      window.location.href = `/job/${payload.jobId}`;
    } catch {
      setNotice('');
      setError('The intelligence request could not be created because the request failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitJob} className="space-y-6">
      <div className="rounded-lg border border-[var(--qoobix-border)] bg-white/65 p-5">
        <span className="text-sm font-semibold">Intelligence mode</span>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(['analysis', 'discovery'] as IntelligenceMode[]).map((mode) => {
            const selected = form.intelligenceMode === mode;

            return (
              <button
                key={mode}
                type="button"
                onClick={() => updateField('intelligenceMode', mode)}
                className={`qoobix-focus-ring rounded-lg border p-4 text-left transition ${
                  selected
                    ? 'border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] text-white shadow-sm'
                    : 'border-[var(--qoobix-border)] bg-white/70 hover:border-[var(--qoobix-orange)]'
                }`}
              >
                <span className="block text-base font-semibold">
                  {mode === 'analysis' ? 'Analysis' : 'Discovery'}
                </span>

                <span
                  className={`mt-2 block text-sm leading-6 ${
                    selected ? 'text-white/85' : 'text-[var(--qoobix-muted)]'
                  }`}
                >
                  {modeDescriptions[mode]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

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
        hint="Describe the commercial question QOOBIX should answer."
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
          className="qoobix-focus-ring mt-2 w-full rounded-md border border-[var(--qoobix-border)] bg-white/75 px-4 py-3 text-sm outline-none"
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

      <InputField
        label="Preferred output language"
        name="preferredOutputLanguage"
        value={form.preferredOutputLanguage}
        onChange={(event) => updateField('preferredOutputLanguage', event.target.value)}
      />

      <div className="rounded-md border border-[var(--qoobix-border)] bg-white/65 p-4 text-sm leading-7 text-[var(--qoobix-muted)]">
        QOOBIX will generate the provisioned output files for this environment. Current output
        formats are DOCX, XLSX, RTF, and CSV. Discovery Mode prepares the request for candidate
        organisation discovery, but candidates must still be independently verified.
      </div>

      {notice ? (
        <p className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-3 text-sm font-semibold">
          {notice}
        </p>
      ) : null}

      {error ? <p className="text-sm font-semibold text-[var(--qoobix-danger)]">{error}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating request…' : 'Create intelligence request'}
      </Button>
    </form>
  );
}
