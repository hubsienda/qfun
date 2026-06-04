import { getClientLocale } from '@/lib/qoobix/client-i18n';
import type { JobStatus } from '@/lib/qoobix/types';

const statusLabels: Record<'en' | 'es' | 'it', Record<JobStatus, string>> = {
  en: {
    received: 'Received',
    processing: 'Processing',
    generating_outputs: 'Generating outputs',
    ready: 'Ready',
    failed: 'Failed',
    cancelled: 'Cancelled'
  },
  es: {
    received: 'Recibido',
    processing: 'Procesando',
    generating_outputs: 'Generando archivos',
    ready: 'Listo',
    failed: 'Fallido',
    cancelled: 'Cancelado'
  },
  it: {
    received: 'Ricevuto',
    processing: 'In elaborazione',
    generating_outputs: 'Generazione output',
    ready: 'Pronto',
    failed: 'Non riuscito',
    cancelled: 'Annullato'
  }
};

const statusClassNames: Record<JobStatus, string> = {
  received: 'border-[var(--qoobix-border)] bg-white/70 text-[var(--qoobix-muted)]',
  processing: 'border-blue-200 bg-blue-50 text-blue-800',
  generating_outputs: 'border-amber-200 bg-amber-50 text-amber-800',
  ready: 'border-green-200 bg-green-50 text-green-800',
  failed: 'border-red-200 bg-red-50 text-red-800',
  cancelled: 'border-slate-200 bg-slate-50 text-slate-700'
};

type StatusPillProps = {
  status: JobStatus;
  language?: string | null;
};

export function StatusPill({ status, language }: StatusPillProps) {
  const locale = getClientLocale(language);

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        statusClassNames[status] ?? statusClassNames.received
      }`}
    >
      {statusLabels[locale][status] ?? status}
    </span>
  );
}
