'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { InputField, selectFieldClassName, TextAreaField } from '@/components/Field';
import { getClientDictionary } from '@/lib/qoobix/client-i18n';
import type { ClientConfiguration, IntelligenceMode } from '@/lib/qoobix/types';

type NewJobFormProps = {
  client: ClientConfiguration;
};

const objectiveValues = [
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

function SectionShell({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--qoobix-border)] bg-white/44 p-5 shadow-[0_8px_22px_rgba(51,36,26,0.03)]">
      <div className="mb-5">
        <h2 className="text-sm font-semibold tracking-[-0.01em] text-[var(--qoobix-text)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-[var(--qoobix-muted)]">{description}</p>
        ) : null}
      </div>

      {children}
    </section>
  );
}

export function NewJobForm({ client }: NewJobFormProps) {
  const t = getClientDictionary(client);

  const [form, setForm] = useState({
    intelligenceMode: 'analysis' as IntelligenceMode,
    productOrService: client.productsServices ?? '',
    targetCountries: client.targetCountries.join(', '),
    marketQuestion: '',
    commercialObjective: objectiveValues[0],
    targetCustomerTypes: client.targetCustomerTypes.join(', '),
    targetChannels: client.targetChannels.join(', '),
    knownCompetitors: client.knownCompetitors ?? '',
    knownPartners: client.knownRepresentatives ?? '',

    /**
     * Important:
     * This comes from the client's default output/report language, not the application language.
     */
    preferredOutputLanguage: client.preferredOutputLanguage || client.preferredLanguage
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
    setNotice(t.newJobForm.creatingNotice);
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
        setError(payload.error ?? t.newJobForm.genericCreateError);
        return;
      }

      window.location.href = `/job/${payload.jobId}`;
    } catch {
      setNotice('');
      setError(t.newJobForm.requestFailedError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitJob} className="space-y-6">
      <SectionShell title={t.newJobForm.intelligenceMode}>
        <div className="grid gap-3 md:grid-cols-2">
          {(['analysis', 'discovery'] as IntelligenceMode[]).map((mode) => {
            const selected = form.intelligenceMode === mode;

            return (
              <button
                key={mode}
                type="button"
                onClick={() => updateField('intelligenceMode', mode)}
                className={`qoobix-focus-ring rounded-xl border p-4 text-left shadow-[0_8px_22px_rgba(51,36,26,0.025)] transition duration-200 ${
                  selected
                    ? 'border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] text-white shadow-[0_12px_28px_rgba(232,90,42,0.18)]'
                    : 'border-[var(--qoobix-border)] bg-white/60 hover:border-[var(--qoobix-border-strong)] hover:bg-white'
                }`}
              >
                <span className="block text-base font-semibold tracking-[-0.02em]">
                  {mode === 'analysis' ? t.newJobForm.analysis : t.newJobForm.discovery}
                </span>

                <span
                  className={`mt-2 block text-sm leading-6 ${
                    selected ? 'text-white/84' : 'text-[var(--qoobix-muted)]'
                  }`}
                >
                  {mode === 'analysis'
                    ? t.newJobForm.analysisDescription
                    : t.newJobForm.discoveryDescription}
                </span>
              </button>
            );
          })}
        </div>
      </SectionShell>

      <SectionShell title={t.newJobForm.productOrService}>
        <TextAreaField
          label={t.newJobForm.productOrService}
          name="productOrService"
          value={form.productOrService}
          onChange={(event) => updateField('productOrService', event.target.value)}
          required
        />
      </SectionShell>

      <SectionShell title={t.newJobForm.marketQuestion}>
        <div className="space-y-5">
          <InputField
            label={t.newJobForm.targetCountries}
            name="targetCountries"
            value={form.targetCountries}
            onChange={(event) => updateField('targetCountries', event.target.value)}
            required
          />

          <TextAreaField
            label={t.newJobForm.marketQuestion}
            name="marketQuestion"
            hint={t.newJobForm.marketQuestionHint}
            value={form.marketQuestion}
            onChange={(event) => updateField('marketQuestion', event.target.value)}
            required
          />

          <label className="block">
            <span className="text-sm font-semibold tracking-[-0.015em] text-[var(--qoobix-text)]">
              {t.newJobForm.commercialObjective}
            </span>
            <select
              name="commercialObjective"
              value={form.commercialObjective}
              onChange={(event) => updateField('commercialObjective', event.target.value)}
              className={selectFieldClassName}
            >
              {objectiveValues.map((objective) => (
                <option key={objective} value={objective}>
                  {t.newJobForm.objectives[objective] ?? objective}
                </option>
              ))}
            </select>
          </label>
        </div>
      </SectionShell>

      <SectionShell title={t.newJobForm.targetCustomerTypes}>
        <div className="grid gap-5 md:grid-cols-2">
          <TextAreaField
            label={t.newJobForm.targetCustomerTypes}
            name="targetCustomerTypes"
            value={form.targetCustomerTypes}
            onChange={(event) => updateField('targetCustomerTypes', event.target.value)}
          />

          <TextAreaField
            label={t.newJobForm.targetChannels}
            name="targetChannels"
            value={form.targetChannels}
            onChange={(event) => updateField('targetChannels', event.target.value)}
          />
        </div>
      </SectionShell>

      <SectionShell title={t.newJobForm.knownCompetitors}>
        <div className="grid gap-5 md:grid-cols-2">
          <TextAreaField
            label={t.newJobForm.knownCompetitors}
            name="knownCompetitors"
            value={form.knownCompetitors}
            onChange={(event) => updateField('knownCompetitors', event.target.value)}
          />

          <TextAreaField
            label={t.newJobForm.knownPartners}
            name="knownPartners"
            value={form.knownPartners}
            onChange={(event) => updateField('knownPartners', event.target.value)}
          />
        </div>
      </SectionShell>

      <SectionShell title={t.newJobForm.preferredOutputLanguage}>
        <InputField
          label={t.newJobForm.preferredOutputLanguage}
          name="preferredOutputLanguage"
          value={form.preferredOutputLanguage}
          onChange={(event) => updateField('preferredOutputLanguage', event.target.value)}
        />
      </SectionShell>

      <div className="rounded-xl border border-[var(--qoobix-border)] bg-white/46 p-4 text-sm leading-7 text-[var(--qoobix-muted)] shadow-[0_8px_22px_rgba(51,36,26,0.03)]">
        {t.newJobForm.outputNotice}
      </div>

      {notice ? (
        <p className="rounded-xl border border-[var(--qoobix-border)] bg-white/56 px-4 py-3 text-sm font-semibold leading-6 text-[var(--qoobix-text)] shadow-[0_8px_22px_rgba(51,36,26,0.035)]">
          {notice}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-800">
          {error}
        </p>
      ) : null}

      <div className="pt-1">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t.newJobForm.creatingButton : t.newJobForm.submitButton}
        </Button>
      </div>
    </form>
  );
}
