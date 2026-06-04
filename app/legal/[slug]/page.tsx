import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { LegalMarkdown } from '@/components/LegalMarkdown';
import { Panel } from '@/components/Panel';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { getClientBySlug } from '@/lib/qoobix/db';
import { getClientLocale, type ClientLocale } from '@/lib/qoobix/client-i18n';
import { getLegalDocument, legalDocuments } from '@/lib/qoobix/legal';

type LegalDocumentPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    lang?: string;
  }>;
};

type LegalLocale = ClientLocale;

const legalUi = {
  en: {
    backToLegal: 'Back to legal documents',
    clientAccess: 'Client access',
    backToClientArea: 'Back to client area',
    documentKicker: 'Legal document',
    languageNoticeTitle: 'English version controls.',
    languageNotice:
      'The English version of this document is the controlling version. Any translation, browser translation, simplified explanation, or localised wording is provided for convenience only and does not replace, modify, or override the English legal text.',
    translateNotice:
      'Need this in another language? You may use your browser’s built-in translation function. Browser translations are automatic convenience translations and are not legally binding.',
    languageLinks: 'Language'
  },
  es: {
    backToLegal: 'Volver a documentos legales',
    clientAccess: 'Acceso de cliente',
    backToClientArea: 'Volver al área de cliente',
    documentKicker: 'Documento legal',
    languageNoticeTitle: 'Prevalece la versión inglesa.',
    languageNotice:
      'La versión inglesa de este documento es la versión vinculante. Cualquier traducción, traducción del navegador, explicación simplificada o texto localizado se proporciona solo por comodidad y no sustituye, modifica ni prevalece sobre el texto legal inglés.',
    translateNotice:
      '¿Necesita leer esta página en otro idioma? Puede utilizar la función de traducción integrada en su navegador. Las traducciones del navegador son traducciones automáticas de conveniencia y no son legalmente vinculantes.',
    languageLinks: 'Idioma'
  },
  it: {
    backToLegal: 'Torna ai documenti legali',
    clientAccess: 'Accesso cliente',
    backToClientArea: 'Torna all’area cliente',
    documentKicker: 'Documento legale',
    languageNoticeTitle: 'Prevale la versione inglese.',
    languageNotice:
      'La versione inglese di questo documento è la versione vincolante. Qualsiasi traduzione, traduzione del browser, spiegazione semplificata o testo localizzato viene fornito solo per comodità e non sostituisce, modifica o prevale sul testo legale inglese.',
    translateNotice:
      'Hai bisogno di leggere questa pagina in un’altra lingua? Puoi usare la funzione di traduzione integrata nel browser. Le traduzioni del browser sono traduzioni automatiche di cortesia e non sono legalmente vincolanti.',
    languageLinks: 'Lingua'
  }
};

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return legalDocuments.map((document) => ({
    slug: document.slug
  }));
}

export async function generateMetadata({ params }: LegalDocumentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const document = getLegalDocument(slug);

  if (!document) {
    return {
      title: 'Legal'
    };
  }

  return {
    title: document.title,
    description: `${document.title} for QOOBIX.`
  };
}

function normaliseLang(value?: string): LegalLocale | null {
  if (value === 'es' || value === 'it' || value === 'en') {
    return value;
  }

  return null;
}

async function resolveLegalLocale(lang: string | undefined, clientSlug: string | null) {
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

function langHref(slug: string, locale: LegalLocale) {
  return `/legal/${slug}?lang=${locale}`;
}

export default async function LegalDocumentPage({ params, searchParams }: LegalDocumentPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const document = getLegalDocument(slug);
  const clientSlug = await getClientSessionSlug();

  if (!document) {
    notFound();
  }

  const locale = await resolveLegalLocale(query.lang, clientSlug);
  const t = legalUi[locale];

  return (
    <section className="qoobix-narrow py-12 md:py-18">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href={`/legal?lang=${locale}`} className="font-semibold text-[var(--qoobix-orange)]">
          ← {t.backToLegal}
        </Link>

        {clientSlug ? (
          <Link
            href={`/client/${clientSlug}`}
            className="qoobix-focus-ring inline-flex items-center justify-center rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-2 text-sm font-semibold"
          >
            {t.backToClientArea}
          </Link>
        ) : (
          <Link
            href="/access"
            className="qoobix-focus-ring inline-flex items-center justify-center rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-2 text-sm font-semibold"
          >
            {t.clientAccess}
          </Link>
        )}
      </div>

      <Panel className="p-7 md:p-10">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="text-[var(--qoobix-muted)]">{t.languageLinks}</span>
          <Link href={langHref(slug, 'en')} className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-3 py-2">
            English
          </Link>
          <Link href={langHref(slug, 'es')} className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-3 py-2">
            Español
          </Link>
          <Link href={langHref(slug, 'it')} className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-3 py-2">
            Italiano
          </Link>
        </div>

        <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
          {t.documentKicker}
        </p>

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{document.title}</h1>

        <div className="mt-6 rounded-md border border-[var(--qoobix-border)] bg-white/70 p-4 text-sm leading-7 text-[var(--qoobix-muted)]">
          <p>
            <strong className="text-[var(--qoobix-text)]">{t.languageNoticeTitle}</strong>{' '}
            {t.languageNotice}
          </p>

          <p className="mt-3">{t.translateNotice}</p>
        </div>

        <div className="mt-8 border-t border-[var(--qoobix-border)] pt-8">
          <LegalMarkdown content={document.content} />
        </div>
      </Panel>
    </section>
  );
}
