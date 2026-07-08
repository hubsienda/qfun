'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/Button';
import { InputField, SelectField, TextAreaField } from '@/components/Field';
import { getClientDictionary } from '@/lib/qoobix/client-i18n';
import type { ClientConfiguration, IntelligenceMode } from '@/lib/qoobix/types';

type NewJobFormProps = {
  client: ClientConfiguration;
};

const objectiveValues = [
  'Market analysis',
  'Competitor mapping',
  'Distributor discovery',
  'Partner discovery',
  'Market-entry intelligence',
  'Location intelligence',
  'Campaign readiness',
  'Other'
];

const contaminationTerms = [
  'consulting',
  'consultancy',
  'marketing',
  'market research',
  'business intelligence',
  'software',
  'ai ',
  'training'
];

function splitList(value: string) {
  return value
    .split(/[;\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function FormGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--qoobix-border)] bg-white/44 p-5 shadow-[0_8px_22px_rgba(51,36,26,0.03)]">
      {children}
    </div>
  );
}

function DiscoveryPreview({ form }: { form: Record<string, string> }) {
  const includeCategories = splitList(form.includeCategories).slice(0, 10);
  const excludeCategories = splitList(form.excludeCategories).slice(0, 10);
  const geographies = splitList(form.targetGeography || form.targetCountries).slice(0, 8);
  const searchTerms = includeCategories.length ? includeCategories : [form.discoveryTarget].filter(Boolean);
  const searchQueries = searchTerms
    .flatMap((term) => geographies.map((geo) => `${term} ${geo}`.trim()))
    .slice(0, 12);
  const previewText = [form.discoveryTarget, ...searchQueries].join(' ').toLowerCase();
  const warningTerms = contaminationTerms.filter((term) => previewText.includes(term));

  if (form.intelligenceMode !== 'discovery') {
    return null;
  }

  return (
    <FormGroup>
      <div className="space-y-5">
        <div>
          <span className="text-sm font-semibold tracking-[-0.015em] text-[var(--qoobix-text)]">
            Pre-flight Discovery preview
          </span>
          <p className="mt-2 text-sm leading-6 text-[var(--qoobix-muted)]">
            Review this before running the job. If the query families are wrong, correct the
            Discovery target, include categories, exclude categories, or geography before submitting.
          </p>
        </div>

        <div className="rounded-lg border border-[var(--qoobix-border)] bg-white/58 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--qoobix-orange)]">
            Search target
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
            {form.discoveryTarget || 'Discovery target not yet defined.'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--qoobix-border)] bg-white/58 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--qoobix-orange)]">
              Search queries
            </p>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--qoobix-muted)]">
              {searchQueries.length ? (
                searchQueries.map((query) => <li key={query}>• {query}</li>)
              ) : (
                <li>Define include categories and target geography to preview queries.</li>
              )}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--qoobix-border)] bg-white/58 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--qoobix-orange)]">
                Include categories
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
                {includeCategories.join('; ') || 'Not defined.'}
              </p>
            </div>

            <div className="rounded-lg border border-[var(--qoobix-border)] bg-white/58 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--qoobix-orange)]">
                Exclude categories
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
                {excludeCategories.join('; ') || 'Not defined.'}
              </p>
            </div>
          </div>
        </div>

        {warningTerms.length ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-800">
            Discovery Scope Warning: preview contains potentially contaminating terms:{' '}
            {warningTerms.join(', ')}. The job should not run until the scope is corrected, unless
            those terms are truly part of the analysed business.
          </p>
        ) : null}
      </div>
    </FormGroup>
  );
}

export function NewJobForm({ client }: NewJobFormProps) {
  const t = getClientDictionary(client);

  const [form, setForm] = useState({
    intelligenceMode: 'analysis' as IntelligenceMode,
    productOrService: client.productsServices ?? '',
    targetCountries: client.targetCountries.join(', '),
    targetGeography: client.targetCountries.join(', '),
    marketQuestion: '',
    commercialObjective: objectiveValues[0],
    commercialObjectiveDetails: '',
    discoveryTarget: '',
    includeCategories: '',
    excludeCategories: '',
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

  const discoveryWarning = useMemo(() => {
    if (form.intelligenceMode !== 'discovery') return '';

    const previewText = [
      form.discoveryTarget,
      form.includeCategories,
      form.targetGeography,
      form.commercialObjectiveDetails
    ]
      .join(' ')
      .toLowerCase();

    const warningTerms = contaminationTerms.filter((term) => previewText.includes(term));

    if (!warningTerms.length) return '';

    return `Discovery preview contains potentially contaminating terms: ${warningTerms.join(', ')}.`;
  }, [form]);

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitJob(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (form.intelligenceMode === 'discovery') {
      const required = [
        form.targetGeography,
        form.commercialObjectiveDetails,
        form.discoveryTarget,
        form.includeCategories,
        form.excludeCategories
      ];

      if (required.some((value) => value.trim().length < 8)) {
        setError(
          'Discovery jobs require target geography, commercial objective details, Discovery target, include categories, and exclude categories.'
        );
        return;
      }
    }

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
            ? Array.from(new Set([...client.availableReportTypes, 'md']))
            : ['docx', 'xlsx', 'rtf', 'csv', 'md']
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
      <FormGroup>
        <span className="text-sm font-semibold tracking-[-0.015em] text-[var(--qoobix-text)]">
          {t.newJobForm.intelligenceMode}
        </span>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(['analysis', 'discovery'] as IntelligenceMode[]).map((mode) => {
            const selected = form.intelligenceMode === mode;

            return (
              <button
                key={mode}
                type="button"
                onClick={() => updateField('intelligenceMode', mode)}
                className={`qoobix-focus-ring rounded-xl border p-4 text-left shadow-[0_8px_22px_rgba(51,36,26,0.025)] transition duration-200 ${
                  selected
                    ? 'border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] text-white shadow-[0_12px_28px_rgba(0,153,255,0.18)]'
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
      </FormGroup>

      <FormGroup>
        <TextAreaField
          label={t.newJobForm.productOrService}
          name="productOrService"
          value={form.productOrService}
          onChange={(event) => updateField('productOrService', event.target.value)}
          required
        />
      </FormGroup>

      <FormGroup>
        <InputField
          label={t.newJobForm.targetCountries}
          name="targetCountries"
          value={form.targetCountries}
          onChange={(event) => updateField('targetCountries', event.target.value)}
          required
        />
      </FormGroup>

      <FormGroup>
        <TextAreaField
          label="Target geography / radius"
          name="targetGeography"
          hint="Specific towns, regions, areas, or radius to use for Discovery queries. Example: Mijas Costa; La Cala de Mijas; Calahonda; Fuengirola."
          value={form.targetGeography}
          onChange={(event) => updateField('targetGeography', event.target.value)}
          required={form.intelligenceMode === 'discovery'}
        />
      </FormGroup>

      <FormGroup>
        <TextAreaField
          label={t.newJobForm.marketQuestion}
          name="marketQuestion"
          hint={t.newJobForm.marketQuestionHint}
          value={form.marketQuestion}
          onChange={(event) => updateField('marketQuestion', event.target.value)}
          required
        />
      </FormGroup>

      <FormGroup>
        <SelectField
          label={t.newJobForm.commercialObjective}
          name="commercialObjective"
          value={form.commercialObjective}
          onChange={(event) => updateField('commercialObjective', event.target.value)}
        >
          {objectiveValues.map((objective) => (
            <option key={objective} value={objective}>
              {t.newJobForm.objectives[objective] ?? objective}
            </option>
          ))}
        </SelectField>
      </FormGroup>

      <FormGroup>
        <TextAreaField
          label="Commercial objective details"
          name="commercialObjectiveDetails"
          hint="Explain what this objective means for this specific job, including what must not be included."
          value={form.commercialObjectiveDetails}
          onChange={(event) => updateField('commercialObjectiveDetails', event.target.value)}
          required={form.intelligenceMode === 'discovery'}
        />
      </FormGroup>

      {form.intelligenceMode === 'discovery' ? (
        <>
          <FormGroup>
            <TextAreaField
              label="Discovery target"
              name="discoveryTarget"
              hint="Exactly what type of organisations QOOBIX must discover. Example: named restaurants and local hospitality businesses competing with an Asian restaurant."
              value={form.discoveryTarget}
              onChange={(event) => updateField('discoveryTarget', event.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <TextAreaField
              label="Include categories"
              name="includeCategories"
              hint="Allowed candidate categories. Use semicolons or new lines."
              value={form.includeCategories}
              onChange={(event) => updateField('includeCategories', event.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <TextAreaField
              label="Exclude categories"
              name="excludeCategories"
              hint="Candidate categories that must be rejected programmatically before export. Use semicolons or new lines."
              value={form.excludeCategories}
              onChange={(event) => updateField('excludeCategories', event.target.value)}
              required
            />
          </FormGroup>

          <DiscoveryPreview form={form} />
        </>
      ) : null}

      <FormGroup>
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
      </FormGroup>

      <FormGroup>
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
      </FormGroup>

      <FormGroup>
        <InputField
          label={t.newJobForm.preferredOutputLanguage}
          name="preferredOutputLanguage"
          value={form.preferredOutputLanguage}
          onChange={(event) => updateField('preferredOutputLanguage', event.target.value)}
        />
      </FormGroup>

      <div className="rounded-xl border border-[var(--qoobix-border)] bg-white/46 p-4 text-sm leading-7 text-[var(--qoobix-muted)] shadow-[0_8px_22px_rgba(51,36,26,0.03)]">
        {t.newJobForm.outputNotice}
      </div>

      {discoveryWarning ? (
        <p className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-semibold leading-6 text-yellow-900">
          {discoveryWarning} Check the Discovery preview before submitting.
        </p>
      ) : null}

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
