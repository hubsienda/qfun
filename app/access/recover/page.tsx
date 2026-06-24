import Link from 'next/link';
import type { Metadata } from 'next';
import { AccessRecoveryForm } from '@/components/AccessRecoveryForm';
import { Panel } from '@/components/Panel';
import { getAccessDictionary, getAccessLocale } from '@/lib/qoobix/access-i18n';

type RecoverAccessPageProps = {
  searchParams: Promise<{
    lang?: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Recover Access',
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
        ? 'border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] text-white shadow-[0_10px_24px_rgba(232,90,42,0.16)]'
        : 'border-[var(--qoobix-border)] bg-white/62 text-[var(--qoobix-muted)] hover:border-[var(--qoobix-border-strong)] hover:bg-white hover:text-[var(--qoobix-text)]'
    }`;
  }

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Link href="/access/recover?lang=en" className={className('en')} aria-current={lang === 'en'}>
        English
      </Link>
      <Link href="/access/recover?lang=es" className={className('es')} aria-current={lang === 'es'}>
        Español
      </Link>
      <Link href="/access/recover?lang=it" className={className('it')} aria-current={lang === 'it'}>
        Italiano
      </Link>
    </div>
  );
}

export default async function RecoverAccessPage({ searchParams }: RecoverAccessPageProps) {
  const params = await searchParams;
  const lang = getAccessLocale(params.lang);
  const t = getAccessDictionary(lang);

  return (
    <section className="qoobix-narrow py-14 md:py-22">
      <Panel strong className="p-6 md:p-9">
        <LanguageSwitch lang={lang} />

        <p className="qoobix-kicker">{t.recoveryPage.badge}</p>

        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
          {t.recoveryPage.title}
        </h1>

        <p className="mt-5 max-w-2xl leading-8 text-[var(--qoobix-muted)]">
          {t.recoveryPage.intro}
        </p>

        <div className="mt-8 rounded-xl border border-[var(--qoobix-border)] bg-white/44 p-5 shadow-[0_8px_22px_rgba(51,36,26,0.03)]">
          <AccessRecoveryForm labels={t.recoveryForm} />
        </div>

        <div className="mt-8 border-t border-[var(--qoobix-border)] pt-6">
          <Link
            href={`/access?lang=${lang}`}
            className="font-semibold text-[var(--qoobix-orange)] transition hover:text-[var(--qoobix-orange-dark)]"
          >
            ← {t.recoveryPage.back}
          </Link>
        </div>
      </Panel>
    </section>
  );
}
