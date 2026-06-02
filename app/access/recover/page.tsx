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
  const linkClass =
    'rounded-md border border-[var(--qoobix-border)] bg-white/70 px-3 py-2 text-xs font-semibold';

  return (
    <div className="mb-5 flex flex-wrap gap-2">
      <Link href="/access/recover?lang=en" className={linkClass} aria-current={lang === 'en'}>
        English
      </Link>
      <Link href="/access/recover?lang=es" className={linkClass} aria-current={lang === 'es'}>
        Español
      </Link>
      <Link href="/access/recover?lang=it" className={linkClass} aria-current={lang === 'it'}>
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
    <section className="qoobix-narrow py-16 md:py-24">
      <Panel className="p-8 md:p-10">
        <LanguageSwitch lang={lang} />

        <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
          {t.recoveryPage.badge}
        </p>

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {t.recoveryPage.title}
        </h1>

        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">{t.recoveryPage.intro}</p>

        <div className="mt-8">
          <AccessRecoveryForm labels={t.recoveryForm} />
        </div>

        <div className="mt-8 border-t border-[var(--qoobix-border)] pt-6">
          <Link href={`/access?lang=${lang}`} className="font-semibold text-[var(--qoobix-orange)]">
            {t.recoveryPage.back} →
          </Link>
        </div>
      </Panel>
    </section>
  );
}
