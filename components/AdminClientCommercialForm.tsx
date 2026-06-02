'use client';

import { useState } from 'react';

type AdminClientCommercialFormProps = {
  adminApiBase: string;
  adminPassword: string;
  client: {
    id: string;
    isInternalAccount: boolean;
    qoobixPlan: 'analysis' | 'analysis_discovery';
    licenceStartsAt: string;
    licenceEndsAt: string;
    maxAnalysisJobsPerYear: number;
    maxDiscoveryJobsPerYear: number;
    maxTotalJobsPerYear: number;
    maxCountriesPerDiscoveryJob: number;
    maxCandidatesPerDiscoveryJob: number;
    extraAnalysisJobCredits: number;
    extraDiscoveryJobCredits: number;
    extraCountryCredits: number;
    extraCandidatePackCredits: number;
  };
  onSaved: () => Promise<void>;
};

function numberValue(value: number) {
  return Number.isFinite(value) ? String(value) : '0';
}

export function AdminClientCommercialForm({
  adminApiBase,
  adminPassword,
  client,
  onSaved
}: AdminClientCommercialFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    isInternalAccount: client.isInternalAccount,
    qoobixPlan: client.qoobixPlan,
    licenceStartsAt: client.licenceStartsAt,
    licenceEndsAt: client.licenceEndsAt,
    maxAnalysisJobsPerYear: numberValue(client.maxAnalysisJobsPerYear),
    maxDiscoveryJobsPerYear: numberValue(client.maxDiscoveryJobsPerYear),
    maxTotalJobsPerYear: numberValue(client.maxTotalJobsPerYear),
    maxCountriesPerDiscoveryJob: numberValue(client.maxCountriesPerDiscoveryJob),
    maxCandidatesPerDiscoveryJob: numberValue(client.maxCandidatesPerDiscoveryJob),
    extraAnalysisJobCredits: numberValue(client.extraAnalysisJobCredits),
    extraDiscoveryJobCredits: numberValue(client.extraDiscoveryJobCredits),
    extraCountryCredits: numberValue(client.extraCountryCredits),
    extraCandidatePackCredits: numberValue(client.extraCandidatePackCredits)
  });

  function updateField(name: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function saveSettings() {
    setMessage('');
    setIsSaving(true);

    try {
      const response = await fetch(`${adminApiBase}/clients/${client.id}/commercial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adminPassword,
          ...form,
          maxAnalysisJobsPerYear: Number(form.maxAnalysisJobsPerYear),
          maxDiscoveryJobsPerYear: Number(form.maxDiscoveryJobsPerYear),
          maxTotalJobsPerYear: Number(form.maxTotalJobsPerYear),
          maxCountriesPerDiscoveryJob: Number(form.maxCountriesPerDiscoveryJob),
          maxCandidatesPerDiscoveryJob: Number(form.maxCandidatesPerDiscoveryJob),
          extraAnalysisJobCredits: Number(form.extraAnalysisJobCredits),
          extraDiscoveryJobCredits: Number(form.extraDiscoveryJobCredits),
          extraCountryCredits: Number(form.extraCountryCredits),
          extraCandidatePackCredits: Number(form.extraCandidatePackCredits)
        })
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        setMessage(payload.error ?? 'Could not save commercial settings.');
        return;
      }

      setMessage('Commercial settings saved.');
      await onSaved();
    } catch {
      setMessage('Could not save commercial settings because the request failed.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mt-3 rounded-lg border border-[var(--qoobix-border)] bg-white/55 p-3">
      <button
        type="button"
        className="w-full text-left text-xs font-semibold text-[var(--qoobix-orange)]"
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? 'Close commercial settings' : 'Commercial settings'}
      </button>

      {isOpen ? (
        <div className="mt-4 space-y-4">
          <label className="flex items-center gap-2 text-xs font-semibold">
            <input
              type="checkbox"
              checked={form.isInternalAccount}
              onChange={(event) => updateField('isInternalAccount', event.target.checked)}
            />
            Internal account / limits not enforced
          </label>

          <label className="block text-xs font-semibold">
            Plan
            <select
              value={form.qoobixPlan}
              onChange={(event) =>
                updateField(
                  'qoobixPlan',
                  event.target.value === 'analysis_discovery' ? 'analysis_discovery' : 'analysis'
                )
              }
              className="mt-1 w-full rounded-md border border-[var(--qoobix-border)] bg-white px-3 py-2 text-xs"
            >
              <option value="analysis">QOOBIX Analysis</option>
              <option value="analysis_discovery">QOOBIX Analysis + Discovery</option>
            </select>
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block text-xs font-semibold">
              Licence starts
              <input
                type="date"
                value={form.licenceStartsAt}
                onChange={(event) => updateField('licenceStartsAt', event.target.value)}
                className="mt-1 w-full rounded-md border border-[var(--qoobix-border)] bg-white px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs font-semibold">
              Licence ends
              <input
                type="date"
                value={form.licenceEndsAt}
                onChange={(event) => updateField('licenceEndsAt', event.target.value)}
                className="mt-1 w-full rounded-md border border-[var(--qoobix-border)] bg-white px-3 py-2 text-xs"
              />
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block text-xs font-semibold">
              Analysis jobs/year
              <input
                type="number"
                min="0"
                value={form.maxAnalysisJobsPerYear}
                onChange={(event) => updateField('maxAnalysisJobsPerYear', event.target.value)}
                className="mt-1 w-full rounded-md border border-[var(--qoobix-border)] bg-white px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs font-semibold">
              Discovery jobs/year
              <input
                type="number"
                min="0"
                value={form.maxDiscoveryJobsPerYear}
                onChange={(event) => updateField('maxDiscoveryJobsPerYear', event.target.value)}
                className="mt-1 w-full rounded-md border border-[var(--qoobix-border)] bg-white px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs font-semibold">
              Total jobs/year
              <input
                type="number"
                min="0"
                value={form.maxTotalJobsPerYear}
                onChange={(event) => updateField('maxTotalJobsPerYear', event.target.value)}
                className="mt-1 w-full rounded-md border border-[var(--qoobix-border)] bg-white px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs font-semibold">
              Countries per Discovery
              <input
                type="number"
                min="0"
                value={form.maxCountriesPerDiscoveryJob}
                onChange={(event) => updateField('maxCountriesPerDiscoveryJob', event.target.value)}
                className="mt-1 w-full rounded-md border border-[var(--qoobix-border)] bg-white px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs font-semibold">
              Candidates per Discovery
              <input
                type="number"
                min="0"
                value={form.maxCandidatesPerDiscoveryJob}
                onChange={(event) => updateField('maxCandidatesPerDiscoveryJob', event.target.value)}
                className="mt-1 w-full rounded-md border border-[var(--qoobix-border)] bg-white px-3 py-2 text-xs"
              />
            </label>
          </div>

          <div className="rounded-md border border-[var(--qoobix-border)] bg-white/60 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--qoobix-muted)]">
              Extra credits
            </p>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="block text-xs font-semibold">
                Extra Analysis jobs
                <input
                  type="number"
                  min="0"
                  value={form.extraAnalysisJobCredits}
                  onChange={(event) => updateField('extraAnalysisJobCredits', event.target.value)}
                  className="mt-1 w-full rounded-md border border-[var(--qoobix-border)] bg-white px-3 py-2 text-xs"
                />
              </label>

              <label className="block text-xs font-semibold">
                Extra Discovery jobs
                <input
                  type="number"
                  min="0"
                  value={form.extraDiscoveryJobCredits}
                  onChange={(event) => updateField('extraDiscoveryJobCredits', event.target.value)}
                  className="mt-1 w-full rounded-md border border-[var(--qoobix-border)] bg-white px-3 py-2 text-xs"
                />
              </label>

              <label className="block text-xs font-semibold">
                Extra Discovery countries
                <input
                  type="number"
                  min="0"
                  value={form.extraCountryCredits}
                  onChange={(event) => updateField('extraCountryCredits', event.target.value)}
                  className="mt-1 w-full rounded-md border border-[var(--qoobix-border)] bg-white px-3 py-2 text-xs"
                />
              </label>

              <label className="block text-xs font-semibold">
                Extra candidate packs
                <input
                  type="number"
                  min="0"
                  value={form.extraCandidatePackCredits}
                  onChange={(event) => updateField('extraCandidatePackCredits', event.target.value)}
                  className="mt-1 w-full rounded-md border border-[var(--qoobix-border)] bg-white px-3 py-2 text-xs"
                />
              </label>
            </div>
          </div>

          {message ? (
            <p className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-3 py-2 text-xs font-semibold">
              {message}
            </p>
          ) : null}

          <button
            type="button"
            className="rounded-md border border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] px-3 py-2 text-xs font-semibold text-white"
            onClick={saveSettings}
            disabled={isSaving || !adminPassword}
          >
            {isSaving ? 'Saving…' : 'Save commercial settings'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
