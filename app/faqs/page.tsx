import Link from 'next/link';
import type { Metadata } from 'next';
import { LegalMarkdown } from '@/components/LegalMarkdown';
import { Panel } from '@/components/Panel';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { getClientBySlug } from '@/lib/qoobix/db';
import { getClientLocale, type ClientLocale } from '@/lib/qoobix/client-i18n';
import { getFaqDocument } from '@/lib/qoobix/faqs';

type FaqsPageProps = {
  searchParams: Promise<{
    lang?: string;
  }>;
};

const faqUi: Record<
  ClientLocale,
  {
    metadataTitle: string;
    secureAccess: string;
    backToClientArea: string;
    languageLabel: string;
    kicker: string;
    intro: string;
  }
> = {
  en: {
    metadataTitle: 'FAQs',
    secureAccess: 'Secure Access',
    backToClientArea: 'Back to client area',
    languageLabel: 'Language',
    kicker: 'Help and product information',
    intro:
      'Practical answers about QOOBIX IDAAS, intelligence packages, verification, outputs, retention, and secure access.'
  },
  es: {
    metadataTitle: 'Preguntas frecuentes',
    secureAccess: 'Acceso seguro',
    backToClientArea: 'Volver al área de cliente',
    languageLabel: 'Idioma',
    kicker: 'Ayuda e información del producto',
    intro:
      'Respuestas prácticas sobre QOOBIX IDAAS, paquetes de inteligencia, verificación, resultados, retención y acceso seguro.'
  },
  it: {
    metadataTitle: 'FAQ',
    secureAccess: 'Accesso sicuro',
    backToClientArea: 'Torna all’area cliente',
    languageLabel: 'Lingua',
    kicker: 'Aiuto e informazioni sul prodotto',
    intro:
      'Risposte pratiche su QOOBIX IDAAS, pacchetti di intelligence, verifica, output, conservazione e accesso sicuro.'
  }
};

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'FAQs',
  description: 'Frequently asked questions about QOOBIX IDAAS.'
};

function normaliseLang(value?: string): ClientLocale | null {
  if (value === 'en' || value === 'es' || value === 'it') {
    return value;
  }

  return null;
}

async function resolveFaqLocale(lang: string | undefined, clientSlug: string | null) {
  const explicitLocale = normaliseLang(lang);

  if (explicitLocale) {
    return explicitLocale;
  }

  if (clientSlug) {
    const client = await getClientBySlug(clientSlug);

    if (client) {
      return getClientLocale(client);
    }
  }

  return 'en';
}

function langHref(locale: ClientLocale) {
  return `/faqs?lang=${locale}`;
}

export default async function FaqsPage({ searchParams }: FaqsPageProps) {
  const params = await searchParams;
  const clientSlug = await getClientSessionSlug();
  const locale = await resolveFaqLocale(params.lang, clientSlug);
  const t = faqUi[locale];
  const faqDocument = getFaqDocument(locale);

  return (
    <section className="qoobix-narrow py-12 md:py-18">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {clientSlug ? (
          <Link
            href={`/client/${clientSlug}`}
            className="qoobix-focus-ring inline-flex items-center justify-center rounded-lg border border-[var(--qoobix-border)] bg-white/70 px-4 py-2 text-sm font-semibold"
          >
            ← {t.backToClientArea}
          </Link>
        ) : (
          <Link
            href="/access"
            className="qoobix-focus-ring inline-flex items-center justify-center rounded-lg border border-[var(--qoobix-border)] bg-white/70 px-4 py-2 text-sm font-semibold"
          >
            {t.secureAccess}
          </Link>
        )}

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="text-[var(--qoobix-muted)]">{t.languageLabel}</span>

          <Link
            href={langHref('en')}
            className="rounded-lg border border-[var(--qoobix-border)] bg-white/70 px-3 py-2"
          >
            English
          </Link>

          <Link
            href={langHref('es')}
            className="rounded-lg border border-[var(--qoobix-border)] bg-white/70 px-3 py-2"
          >
            Español
          </Link>

          <Link
            href={langHref('it')}
            className="rounded-lg border border-[var(--qoobix-border)] bg-white/70 px-3 py-2"
          >
            Italiano
          </Link>
        </div>
      </div>

      <Panel className="p-7 md:p-10">
        <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
          {t.kicker}
        </p>

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {faqDocument.title}
        </h1>

        <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">{t.intro}</p>

        <div className="mt-8 border-t border-[var(--qoobix-border)] pt-8">
          <LegalMarkdown content={faqDocument.content} />
        </div>
      </Panel>
    </section>
  );
}
