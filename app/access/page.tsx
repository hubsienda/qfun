import Link from 'next/link';
import type { Metadata } from 'next';
import { AccessForm } from '@/components/AccessForm';
import { AccessRecoveryPanel } from '@/components/AccessRecoveryPanel';
import { ButtonLink } from '@/components/ButtonLink';
import { Panel } from '@/components/Panel';
import { getAccessDictionary, getAccessLocale } from '@/lib/qoobix/access-i18n';

type AccessPageProps = {
  searchParams: Promise<{
    lang?: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Secure Access',
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

function LanguageSwitch({ lang }: { lang: string }) {
  const baseClass =
    'qoobix-focus-ring inline-flex min-h-9 items-center justify-center rounded-md border px-3 py-2 text-xs font-semibold transition';

  function className(value: string) {
    return `${baseClass} ${
      lang === value
        ? 'border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] text-white shadow-[0_10px_24px_rgba(0,153,255,0.16)]'
        : 'border-[var(--qoobix-border)] bg-white/62 text-[var(--qoobix-muted)] hover:border-[var(--qoobix-border-strong)] hover:bg-white hover:text-[var(--qoobix-text)]'
    }`;
  }

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Link href="/access?lang=en" className={className('en')} aria-current={lang === 'en'}>
        English
      </Link>
      <Link href="/access?lang=es" className={className('es')} aria-current={lang === 'es'}>
        Español
      </Link>
      <Link href="/access?lang=it" className={className('it')} aria-current={lang === 'it'}>
        Italiano
      </Link>
    </div>
  );
}

export default async function AccessPage({ searchParams }: AccessPageProps) {
  const params = await searchParams;
  const lang = getAccessLocale(params.lang);
  const t = getAccessDictionary(lang);

  return (
    <section className="qoobix-container py-14 md:py-22">
      <div className="mx-auto max-w-4xl">
        <Panel strong className="p-6 md:p-9">
          <LanguageSwitch lang={lang} />

          <p className="qoobix-kicker">{t.accessPage.badge}</p>

          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.045em] md:text-5xl">
            {t.accessPage.title}
          </h1>

          <p className="mt-5 max-w-3xl leading-8 text-[var(--qoobix-muted)]">
            {t.accessPage.intro}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact">{t.accessPage.requestButton}</ButtonLink>
            <a href="#authorised-login" className="qoobix-focus-ring inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--qoobix-border)] bg-white/72 px-5 py-3 text-sm font-bold tracking-[-0.01em] text-[var(--qoobix-text)] shadow-[0_10px_28px_rgba(51,51,51,0.06)] transition hover:border-[var(--qoobix-border-strong)] hover:bg-white">
              {t.accessPage.loginButton}
            </a>
          </div>
        </Panel>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Panel>
            <h2 className="text-xl font-semibold tracking-[-0.025em]">
              {t.accessPage.authorisedTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--qoobix-muted)]">
              {t.accessPage.authorisedText}
            </p>
          </Panel>

          <Panel>
            <h2 className="text-xl font-semibold tracking-[-0.025em]">
              {t.accessPage.clientsTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--qoobix-muted)]">
              {t.accessPage.clientsText}
            </p>
          </Panel>

          <Panel>
            <h2 className="text-xl font-semibold tracking-[-0.025em]">
              {t.accessPage.requestTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--qoobix-muted)]">
              {t.accessPage.requestText}
            </p>
          </Panel>
        </div>

        <div id="authorised-login" className="mt-8 rounded-[var(--qoobix-radius-large)] border border-[var(--qoobix-border)] bg-white/52 p-6 shadow-[0_8px_22px_rgba(51,51,51,0.03)] md:p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.035em]">
            {t.accessPage.loginTitle}
          </h2>
          <div className="mt-6">
            <AccessForm labels={t.accessForm} />
          </div>
          <div className="mt-7">
            <AccessRecoveryPanel labels={t.recoveryPanel} lang={lang} />
          </div>
        </div>
      </div>
    </section>
  );
}
