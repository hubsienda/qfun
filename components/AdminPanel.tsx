'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { InputField } from '@/components/Field';
import { Panel } from '@/components/Panel';

type AdminPanelProps = {
  adminPath: string;
};

type CreatedClientResponse = {
  ok?: boolean;
  client?: {
    name: string;
    slug: string;
  };
  accessCode?: string;
  clientUrl?: string;
  error?: string;
};

type AdminClientSummary = {
  id: string;
  name: string;
  slug: string;
  sector: string;
  preferredLanguage: string;
  isActive: boolean;
  createdAt: string;
  jobCount: number;
  failedJobCount: number;
  latestJobStatus: string | null;
  latestJobCreatedAt: string | null;
};

type ResetAccessResponse = {
  ok?: boolean;
  accessCode?: string;
  clientName?: string;
  clientUrl?: string;
  error?: string;
};

const initialForm = {
  adminPassword: '',
  name: '',
  slug: '',
  preferredLanguage: 'English',
  availableReportTypes: 'docx,xlsx',
  fileRetentionDays: '30'
};

export function AdminPanel({ adminPath }: AdminPanelProps) {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [created, setCreated] = useState<CreatedClientResponse | null>(null);
  const [clients, setClients] = useState<AdminClientSummary[]>([]);
  const [resetAccess, setResetAccess] = useState<ResetAccessResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(false);

  const adminApiBase = `/api/${adminPath}/clients`;

  function updateField(name: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setCreated(null);
    setResetAccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(adminApiBase, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const payload = (await response.json()) as CreatedClientResponse;

      if (!response.ok || !payload.ok) {
        setMessage(payload.error ?? 'Client creation failed.');
        return;
      }

      setCreated(payload);
      setMessage('Client environment created. Temporary first-access code generated.');

      setForm((current) => ({
        ...initialForm,
        adminPassword: current.adminPassword
      }));

      await loadClients(form.adminPassword);
    } catch {
      setMessage('Client creation failed because the request could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function loadClients(password = form.adminPassword) {
    setMessage('');
    setIsLoadingClients(true);

    try {
      const response = await fetch(`${adminApiBase}/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adminPassword: password
        })
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        clients?: AdminClientSummary[];
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        setMessage(payload.error ?? 'Could not load clients.');
        return;
      }

      setClients(payload.clients ?? []);
    } catch {
      setMessage('Could not load clients because the request failed.');
    } finally {
      setIsLoadingClients(false);
    }
  }

  async function setClientStatus(clientId: string, isActive: boolean) {
    setMessage('');
    setResetAccess(null);

    try {
      const response = await fetch(`${adminApiBase}/${clientId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adminPassword: form.adminPassword,
          isActive
        })
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        setMessage(payload.error ?? 'Could not update client status.');
        return;
      }

      setMessage(isActive ? 'Client reactivated.' : 'Client suspended.');
      await loadClients();
    } catch {
      setMessage('Could not update client status because the request failed.');
    }
  }

  async function issueResetAccess(clientId: string) {
    setMessage('');
    setResetAccess(null);

    try {
      const response = await fetch(`${adminApiBase}/${clientId}/reset-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adminPassword: form.adminPassword
        })
      });

      const payload = (await response.json()) as ResetAccessResponse;

      if (!response.ok || !payload.ok) {
        setMessage(payload.error ?? 'Could not issue temporary access code.');
        return;
      }

      setResetAccess(payload);
      setMessage('Temporary access code issued.');
      await loadClients();
    } catch {
      setMessage('Could not issue temporary access code because the request failed.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel>
          <form onSubmit={submitClient} className="space-y-6">
            <InputField
              label="Admin password"
              name="adminPassword"
              type="password"
              value={form.adminPassword}
              onChange={(event) => updateField('adminPassword', event.target.value)}
              required
            />

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Client name"
                name="name"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                required
              />

              <InputField
                label="Client slug"
                name="slug"
                hint="Example: isobell-europe. Lowercase letters, numbers and hyphens."
                value={form.slug}
                onChange={(event) => updateField('slug', event.target.value)}
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Preferred language"
                name="preferredLanguage"
                value={form.preferredLanguage}
                onChange={(event) => updateField('preferredLanguage', event.target.value)}
              />

              <InputField
                label="Available report types"
                name="availableReportTypes"
                hint="Usually: docx,xlsx"
                value={form.availableReportTypes}
                onChange={(event) => updateField('availableReportTypes', event.target.value)}
              />
            </div>

            <InputField
              label="File retention days"
              name="fileRetentionDays"
              type="number"
              min="1"
              value={form.fileRetentionDays}
              onChange={(event) => updateField('fileRetentionDays', event.target.value)}
            />

            {message ? (
              <p className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-3 text-sm font-semibold">
                {message}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating…' : 'Create client environment'}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => loadClients()}
                disabled={isLoadingClients || !form.adminPassword}
              >
                {isLoadingClients ? 'Loading…' : 'Load clients'}
              </Button>
            </div>
          </form>
        </Panel>

        <Panel>
          <h2 className="text-xl font-semibold">Temporary access</h2>

          {created?.client && created.accessCode ? (
            <div className="mt-5 space-y-4 text-sm leading-7">
              <p>
                <span className="font-semibold">Client:</span> {created.client.name}
              </p>
              <p>
                <span className="font-semibold">Slug:</span> {created.client.slug}
              </p>
              <p>
                <span className="font-semibold">Temporary access code:</span>{' '}
                <code className="rounded-md bg-white px-2 py-1">{created.accessCode}</code>
              </p>
              {created.clientUrl ? (
                <p>
                  <span className="font-semibold">Client URL:</span>{' '}
                  <a href={created.clientUrl} className="text-[var(--qoobix-orange)]">
                    {created.clientUrl}
                  </a>
                </p>
              ) : null}
              <p className="text-[var(--qoobix-muted)]">
                Give this temporary code to the client once. The client should replace it
                immediately.
              </p>
            </div>
          ) : resetAccess?.accessCode ? (
            <div className="mt-5 space-y-4 text-sm leading-7">
              <p>
                <span className="font-semibold">Client:</span> {resetAccess.clientName}
              </p>
              <p>
                <span className="font-semibold">Temporary reset code:</span>{' '}
                <code className="rounded-md bg-white px-2 py-1">{resetAccess.accessCode}</code>
              </p>
              {resetAccess.clientUrl ? (
                <p>
                  <span className="font-semibold">Client URL:</span>{' '}
                  <a href={resetAccess.clientUrl} className="text-[var(--qoobix-orange)]">
                    {resetAccess.clientUrl}
                  </a>
                </p>
              ) : null}
              <p className="text-[var(--qoobix-muted)]">
                This code should be used once, then replaced by the client.
              </p>
            </div>
          ) : (
            <p className="mt-5 leading-7 text-[var(--qoobix-muted)]">
              Temporary access codes appear here only when created or reset.
            </p>
          )}
        </Panel>
      </div>

      <Panel>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Clients</h2>
            <p className="mt-2 text-sm text-[var(--qoobix-muted)]">
              Operational visibility only. Still not a dashboard monster.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() => loadClients()}
            disabled={isLoadingClients || !form.adminPassword}
          >
            {isLoadingClients ? 'Loading…' : 'Refresh clients'}
          </Button>
        </div>

        {clients.length ? (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--qoobix-border)] text-left">
                  <th className="py-3 pr-4">Client</th>
                  <th className="py-3 pr-4">Slug</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Sector</th>
                  <th className="py-3 pr-4">Jobs</th>
                  <th className="py-3 pr-4">Latest job</th>
                  <th className="py-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-[var(--qoobix-border)]">
                    <td className="py-3 pr-4 font-semibold">{client.name}</td>
                    <td className="py-3 pr-4">{client.slug}</td>
                    <td className="py-3 pr-4">
                      {client.isActive ? (
                        <span className="rounded-md border border-green-200 bg-green-50 px-2 py-1 text-xs font-semibold text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-800">
                          Suspended
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-[var(--qoobix-muted)]">{client.sector}</td>
                    <td className="py-3 pr-4">
                      {client.jobCount} total
                      {client.failedJobCount ? ` · ${client.failedJobCount} failed` : ''}
                    </td>
                    <td className="py-3 pr-4 text-[var(--qoobix-muted)]">
                      {client.latestJobStatus ?? '—'}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-3 py-2 text-xs font-semibold"
                          onClick={() => issueResetAccess(client.id)}
                          disabled={!client.isActive}
                        >
                          Reset access
                        </button>

                        {client.isActive ? (
                          <button
                            type="button"
                            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800"
                            onClick={() => setClientStatus(client.id, false)}
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-800"
                            onClick={() => setClientStatus(client.id, true)}
                          >
                            Reactivate
                          </button>
                        )}

                        <a
                          href={`/client/${client.slug}`}
                          className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-3 py-2 text-xs font-semibold"
                        >
                          Open
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-5 leading-7 text-[var(--qoobix-muted)]">
            Enter the admin password and load clients.
          </p>
        )}
      </Panel>
    </div>
  );
}
