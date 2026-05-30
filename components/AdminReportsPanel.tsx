'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { InputField } from '@/components/Field';
import { Panel } from '@/components/Panel';

type AdminReportsPanelProps = {
  adminPath: string;
};

type AdminReportSummary = {
  id: string;
  clientName: string;
  clientAccessName: string;
  jobId: string;
  jobStatus: string;
  resultToken: string | null;
  fileName: string;
  fileType: string;
  storagePath: string | null;
  createdAt: string;
  expiresAt: string | null;
  isExpired: boolean;
};

type ReportsResponse = {
  ok?: boolean;
  reports?: AdminReportSummary[];
  error?: string;
};

type CleanupResponse = {
  ok?: boolean;
  result?: {
    expiredRecordsFound: number;
    storageFilesDeleted: number;
    reportRecordsDeleted: number;
  };
  error?: string;
};

function formatDate(value: string | null) {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function AdminReportsPanel({ adminPath }: AdminReportsPanelProps) {
  const [adminPassword, setAdminPassword] = useState('');
  const [reports, setReports] = useState<AdminReportSummary[]>([]);
  const [message, setMessage] = useState('');
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [isCleaningReports, setIsCleaningReports] = useState(false);

  const adminApiBase = `/api/${adminPath}`;

  async function loadReports() {
    setMessage('');
    setIsLoadingReports(true);

    try {
      const response = await fetch(`${adminApiBase}/reports/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adminPassword
        })
      });

      const payload = (await response.json()) as ReportsResponse;

      if (!response.ok || !payload.ok) {
        setMessage(payload.error ?? 'Could not load reports.');
        return;
      }

      setReports(payload.reports ?? []);
      setMessage(`Loaded ${payload.reports?.length ?? 0} report record(s).`);
    } catch {
      setMessage('Could not load reports because the request failed.');
    } finally {
      setIsLoadingReports(false);
    }
  }

  async function cleanExpiredReports() {
    setMessage('');
    setIsCleaningReports(true);

    try {
      const response = await fetch(`${adminApiBase}/reports/cleanup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adminPassword
        })
      });

      const payload = (await response.json()) as CleanupResponse;

      if (!response.ok || !payload.ok || !payload.result) {
        setMessage(payload.error ?? 'Cleanup failed.');
        return;
      }

      setMessage(
        `Cleanup complete. Found ${payload.result.expiredRecordsFound} expired report record(s), deleted ${payload.result.storageFilesDeleted} storage file(s), and removed ${payload.result.reportRecordsDeleted} report record(s).`
      );

      await loadReports();
    } catch {
      setMessage('Cleanup failed because the request could not be completed.');
    } finally {
      setIsCleaningReports(false);
    }
  }

  return (
    <Panel>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Generated report inventory</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
            View generated files, expiry dates, and cleanup status. This is operational visibility,
            not a file-hoarding museum.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <InputField
            label="Admin password"
            name="reportsAdminPassword"
            type="password"
            value={adminPassword}
            onChange={(event) => setAdminPassword(event.target.value)}
            required
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              onClick={loadReports}
              disabled={isLoadingReports || !adminPassword}
            >
              {isLoadingReports ? 'Loading…' : 'Load reports'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={cleanExpiredReports}
              disabled={isCleaningReports || !adminPassword}
            >
              {isCleaningReports ? 'Cleaning…' : 'Clean expired'}
            </Button>
          </div>
        </div>
      </div>

      {message ? (
        <p className="mt-5 rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-3 text-sm font-semibold">
          {message}
        </p>
      ) : null}

      {reports.length ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[1040px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--qoobix-border)] text-left">
                <th className="py-3 pr-4">Created</th>
                <th className="py-3 pr-4">Client</th>
                <th className="py-3 pr-4">File</th>
                <th className="py-3 pr-4">Type</th>
                <th className="py-3 pr-4">Expires</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-[var(--qoobix-border)]">
                  <td className="py-3 pr-4 text-[var(--qoobix-muted)]">
                    {formatDate(report.createdAt)}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="font-semibold">{report.clientName}</div>
                    <div className="text-xs text-[var(--qoobix-muted)]">
                      {report.clientAccessName}
                    </div>
                  </td>
                  <td className="py-3 pr-4">{report.fileName}</td>
                  <td className="py-3 pr-4">{report.fileType.toUpperCase()}</td>
                  <td className="py-3 pr-4 text-[var(--qoobix-muted)]">
                    {formatDate(report.expiresAt)}
                  </td>
                  <td className="py-3 pr-4">
                    {report.isExpired ? (
                      <span className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-800">
                        Expired
                      </span>
                    ) : (
                      <span className="rounded-md border border-green-200 bg-green-50 px-2 py-1 text-xs font-semibold text-green-800">
                        Retained
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`/job/${report.jobId}`}
                        className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-3 py-2 text-xs font-semibold"
                      >
                        Job
                      </a>

                      {report.resultToken ? (
                        <a
                          href={`/result/${report.resultToken}`}
                          className="rounded-md border border-[var(--qoobix-orange)] bg-white/70 px-3 py-2 text-xs font-semibold text-[var(--qoobix-orange)]"
                        >
                          Result
                        </a>
                      ) : null}
                    </div>

                    {report.storagePath ? (
                      <p className="mt-2 max-w-xs truncate text-xs text-[var(--qoobix-muted)]">
                        {report.storagePath}
                      </p>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-5 leading-7 text-[var(--qoobix-muted)]">
          Enter the admin password and load reports.
        </p>
      )}
    </Panel>
  );
}
