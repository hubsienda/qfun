'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { InputField } from '@/components/Field';
import { Panel } from '@/components/Panel';
import type { Json } from '@/lib/qoobix/types';

type AdminLogsPanelProps = {
  adminPath: string;
};

type AdminLogSummary = {
  id: string;
  createdAt: string;
  level: string;
  message: string;
  details: Json | null;
  jobId: string | null;
  jobStatus: string | null;
  clientName: string | null;
  clientAccessName: string | null;
};

type LogsResponse = {
  ok?: boolean;
  logs?: AdminLogSummary[];
  error?: string;
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function levelClassName(level: string) {
  if (level === 'error') {
    return 'border-red-200 bg-red-50 text-red-800';
  }

  if (level === 'warning') {
    return 'border-amber-200 bg-amber-50 text-amber-800';
  }

  return 'border-green-200 bg-green-50 text-green-800';
}

function stringifyDetails(details: Json | null) {
  if (!details) {
    return '';
  }

  try {
    return JSON.stringify(details, null, 2);
  } catch {
    return String(details);
  }
}

export function AdminLogsPanel({ adminPath }: AdminLogsPanelProps) {
  const [adminPassword, setAdminPassword] = useState('');
  const [logs, setLogs] = useState<AdminLogSummary[]>([]);
  const [message, setMessage] = useState('');
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const adminApiBase = `/api/${adminPath}`;

  async function loadLogs() {
    setMessage('');
    setIsLoadingLogs(true);

    try {
      const response = await fetch(`${adminApiBase}/logs/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adminPassword
        })
      });

      const payload = (await response.json()) as LogsResponse;

      if (!response.ok || !payload.ok) {
        setMessage(payload.error ?? 'Could not load logs.');
        return;
      }

      setLogs(payload.logs ?? []);
      setMessage(`Loaded ${payload.logs?.length ?? 0} log record(s).`);
    } catch {
      setMessage('Could not load logs because the request failed.');
    } finally {
      setIsLoadingLogs(false);
    }
  }

  return (
    <Panel>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Operational logs</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
            Recent generation, retry, cancellation, and system events. Useful when Proteus has been
            dramatic and you need evidence.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <InputField
            label="Admin password"
            name="logsAdminPassword"
            type="password"
            value={adminPassword}
            onChange={(event) => setAdminPassword(event.target.value)}
            required
          />

          <Button
            type="button"
            variant="secondary"
            onClick={loadLogs}
            disabled={isLoadingLogs || !adminPassword}
          >
            {isLoadingLogs ? 'Loading…' : 'Load logs'}
          </Button>
        </div>
      </div>

      {message ? (
        <p className="mt-5 rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-3 text-sm font-semibold">
          {message}
        </p>
      ) : null}

      {logs.length ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[1080px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--qoobix-border)] text-left">
                <th className="py-3 pr-4">Time</th>
                <th className="py-3 pr-4">Level</th>
                <th className="py-3 pr-4">Client</th>
                <th className="py-3 pr-4">Message</th>
                <th className="py-3 pr-4">Job</th>
                <th className="py-3 pr-4">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const details = stringifyDetails(log.details);

                return (
                  <tr key={log.id} className="border-b border-[var(--qoobix-border)] align-top">
                    <td className="py-3 pr-4 text-[var(--qoobix-muted)]">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-md border px-2 py-1 text-xs font-semibold ${levelClassName(
                          log.level
                        )}`}
                      >
                        {log.level}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      {log.clientName ? (
                        <>
                          <div className="font-semibold">{log.clientName}</div>
                          <div className="text-xs text-[var(--qoobix-muted)]">
                            {log.clientAccessName}
                          </div>
                        </>
                      ) : (
                        <span className="text-[var(--qoobix-muted)]">System</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">{log.message}</td>
                    <td className="py-3 pr-4">
                      {log.jobId ? (
                        <div className="space-y-2">
                          <a
                            href={`/job/${log.jobId}`}
                            className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-3 py-2 text-xs font-semibold"
                          >
                            Job
                          </a>
                          {log.jobStatus ? (
                            <div className="text-xs text-[var(--qoobix-muted)]">
                              {log.jobStatus}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-[var(--qoobix-muted)]">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {details ? (
                        <pre className="max-w-sm overflow-x-auto rounded-md bg-white/70 p-3 text-xs leading-5 text-[var(--qoobix-muted)]">
                          {details}
                        </pre>
                      ) : (
                        <span className="text-[var(--qoobix-muted)]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-5 leading-7 text-[var(--qoobix-muted)]">
          Enter the admin password and load logs.
        </p>
      )}
    </Panel>
  );
}
