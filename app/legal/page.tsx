import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/Panel';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { getClientBySlug } from '@/lib/qoobix/db';
import { getClientLocale, type ClientLocale } from '@/lib/qoobix/client-i18n';
import { getAllLegalDocuments } from '@/lib/qoobix/legal';

type LegalIndexPageProps = {
  searchParams: Promise<{
    lang?: string;
  }>;
};

type LegalLocale = ClientLocale;

const legalUi = {
  en: {
    metadataTitle: 'Legal',
    secureAccess: 'Secure Access',
    backToClientArea: 'Back to client area',
    kicker: 'Legal and data notices',
    title: 'QOOBIX IDAAS legal documents.',
    intro:
      'These documents explain the terms, privacy, cookies, AI-assisted analysis, report limitations, acceptable use, and refund position for QOOBIX IDAAS.',
    languageNoticeTitle: 'English version controls.',
    languageNotice:
      'The QOOBIX IDAAS legal documents are written and maintained in English. The English version is the controlling version. Any translation, browser translation, simplified explanation, or localised wording is provided for convenience only and does not replace, modify, or override the English legal text.',
    translateNotice:
      'Need this in another language? You may use your browser’s built-in translation function. Browser translations are automatic convenience translations and are not legally binding.',
    cardTextPrefix: 'Read the current QOOBIX IDAAS',
    readDocument: 'Read document',
    languageLinks: 'Language'
  },
  es: {
    metadataTitle: 'Legal',
    secureAccess: 'Acceso seguro',
    backToClientArea: 'Volver al área de cliente',
    kicker: 'Avisos legales y de datos',
    title: 'Documentos legales de QOOBIX IDAAS.',
    intro:
      'Estos documentos explican los términos, privacidad, cookies, análisis asistido por IA, limitaciones de informes, uso aceptable y política de reembolsos de QOOBIX IDAAS.',
    languageNoticeTitle: 'Prevalece la versión inglesa.',
    languageNotice:
      'Los documentos legales de QOOBIX IDAAS están redactados y mantenidos en inglés. La versión inglesa es la versión vinculante. Cualquier traducción, traducción del navegador, explicación simplificada o texto localizado se proporciona solo por comodidad y no sustituye, modifica ni prevalece sobre el texto legal inglés.',
    translateNotice:
      '¿Necesita leer esta página en otro idioma? Puede utilizar la función de traducción integrada en su navegador. Las traducciones del navegador son traducciones automáticas de conveniencia y no son legalmente vinculantes.',
    cardTextPrefix: 'Lea el documento actual de QOOBIX IDAAS:',
    readDocument: 'Leer documento',
    languageLinks: 'Idioma'
  },
  it: {
    metadataTitle: 'Legale',
    secureAccess: 'Accesso sicuro',
    backToClientArea: 'Torna all’area cliente',
    kicker: 'Avvisi legali e sui dati',
    title: 'Documenti legali QOOBIX IDAAS.',
    intro:
      'Questi documenti spiegano termini, privacy, cookie, analisi assistita da IA, limiti dei report, uso accettabile e posizione sui rimborsi per QOOBIX IDAAS.',
    languageNoticeTitle: 'Prevale la versione inglese.',
    languageNotice:
      'I documenti legali QOOBIX IDAAS sono redatti e mantenuti in inglese. La versione inglese è la versione vincolante. Qualsiasi traduzione, traduzione del browser, spiegazione semplificata o testo localizzato viene fornito solo per comodità e non sostituisce, modifica o prevale sul testo legale inglese.',
    translateNotice:
      'Hai bisogno di leggere questa pagina in un’altra lingua? Puoi usare la funzione di traduzione integrata nel browser. Le traduzioni del browser sono traduzioni automatiche di cortesia e non sono legalmente vincolanti.',
    cardTextPrefix: 'Leggi il documento QOOBIX IDAAS attuale:',
    readDocument: 'Leggi documento',
    languageLinks: 'Lingua'
  }
};

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Legal',
  description: 'Legal documents, policies, notices, and disclaimers for QOOBIX IDAAS.'
};

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

function langHref(locale: LegalLocale) {
  return `/legal?lang=${locale}`;
}

export default async function LegalIndexPage({ searchParams }: LegalIndexPageProps) {
  const params = await searchParams;
  const documents = getAllLegalDocuments();
  const clientSlug = await getClientSessionSlug();
  const locale = await resolveLegalLocale(params.lang, clientSlug);
  const t = legalUi[locale];

  return (
    <section className="qoobix-container py-12 md:py-18">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {clientSlug ? (
          <Link
            href={`/client/${clientSlug}`}
            className="qoobix-focus-ring inline-flex items-center justify-center rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-2 text-sm font-semibold"
          >
            ← {t.backToClientArea}
          </Link>
        ) : (
          <Link
            href="/access"
            className="qoobix-focus-ring inline-flex items-center justify-center rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-2 text-sm font-semibold"
          >
            {t.secureAccess}
          </Link>
        )}

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="text-[var(--qoobix-muted)]">{t.languageLinks}</span>
          <Link href={langHref('en')} className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-3 py-2">
            English
          </Link>
          <Link href={langHref('es')} className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-3 py-2">
            Español
          </Link>
          <Link href={langHref('it')} className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-3 py-2">
            Italiano
          </Link>
        </div>
      </div>

      <div className="max-w-3xl">
        <p className="qoobix-kicker">{t.kicker}</p>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl">{t.title}</h1>

        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">{t.intro}</p>

        <div className="mt-6 rounded-md border border-[var(--qoobix-border)] bg-white/70 p-4 text-sm leading-7 text-[var(--qoobix-muted)]">
          <p>
            <strong className="text-[var(--qoobix-text)]">{t.languageNoticeTitle}</strong>{' '}
            {t.languageNotice}
          </p>

          <p className="mt-3">{t.translateNotice}</p>
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {documents.map((document) => (
          <Panel key={document.slug}>
            <h2 className="text-xl font-semibold">{document.title}</h2>

            <p className="mt-3 text-sm leading-7 text-[var(--qoobix-muted)]">
              {t.cardTextPrefix} {document.title}.
            </p>

            <div className="mt-5">
              <Link
                href={`/legal/${document.slug}?lang=${locale}`}
                className="font-semibold text-[var(--qoobix-orange)]"
              >
                {t.readDocument} →
              </Link>
            </div>
          </Panel>
        ))}
      </div>
    </section>
  );
}
