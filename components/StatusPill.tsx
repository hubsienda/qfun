import type { JobStatus } from '@/lib/qoobix/types';

const statusLabels: Record<JobStatus, string> = {
  received: 'Received',
  processing: 'Processing',
  generating_outputs: 'Generating outputs',
  ready: 'Ready',
  failed: 'Failed'
};

const statusClassNames: Record<JobStatus, string> = {
  received: 'border-[var(--qoobix-border)] bg-white/70 text-[var(--qoobix-muted)]',
  processing: 'border-blue-200 bg-blue-50 text-blue-800',
  generating_outputs: 'border-amber-200 bg-amber-50 text-amber-800',
  ready: 'border-green-200 bg-green-50 text-green-800',
  failed: 'border-red-200 bg-red-50 text-red-800'
};

type StatusPillProps = {
  status: JobStatus;
};

export function StatusPill({ status }: StatusPillProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClassNames[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
