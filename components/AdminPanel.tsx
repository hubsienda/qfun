'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { InputField } from '@/components/Field';
import { Panel } from '@/components/Panel';

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

const initialForm = {
  adminPassword: '',
  name: '',
  slug: '',
  preferredLanguage: 'English',
  availableReportTypes: 'docx,xlsx',
  accessCode: '',
  fileRetentionDays: '30'
};

export function AdminPanel() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [created, setCreated] = useState<CreatedClientResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(name: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setCreated(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/a80a8bf27ed2/clients', {
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
      setMessage('Client environment created. Access code generated.');

      setForm((current) => ({
        ...initialForm,
        adminPassword: current.adminPassword
      }));
    } catch {
      setMessage('Client creation failed because the request could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
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

          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Access code"
              name="accessCode"
              hint="Leave empty to auto-generate."
              value={form.accessCode}
              onChange={(event) => updateField('accessCode', event.target.value)}
            />

            <InputField
              label="File retention days"
              name="fileRetentionDays"
              type="number"
              min="1"
              value={form.fileRetentionDays}
              onChange={(event) => updateField('fileRetentionDays', event.target.value)}
            />
          </div>

          {message ? (
            <p className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-3 text-sm font-semibold">
              {message}
            </p>
          ) : null}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create client environment'}
          </Button>
        </form>
      </Panel>

      <Panel>
        <h2 className="text-xl font-semibold">Created access</h2>

        {created?.client && created.accessCode ? (
          <div className="mt-5 space-y-4 text-sm leading-7">
            <p>
              <span className="font-semibold">Client:</span> {created.client.name}
            </p>
            <p>
              <span className="font-semibold">Slug:</span> {created.client.slug}
            </p>
            <p>
              <span className="font-semibold">Access code:</span>{' '}
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
              The client must complete their business profile inside their private area.
            </p>
          </div>
        ) : (
          <p className="mt-5 leading-7 text-[var(--qoobix-muted)]">
            Create a client environment and the private access details will appear here.
          </p>
        )}
      </Panel>
    </div>
  );
}
