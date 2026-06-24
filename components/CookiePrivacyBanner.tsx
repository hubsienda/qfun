'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'qoobix-cookie-privacy-choice';

type BannerLocale = 'en' | 'es' | 'it';

const labels: Record<
  BannerLocale,
  {
    title: string;
    text: string;
    read: string;
    cookiePolicy: string;
    and: string;
    privacyPolicy: string;
    accept: string;
    reject: string;
  }
> = {
  en: {
    title: 'Cookies and privacy',
    text:
      'QOOBIX uses essential cookies for private access, session security, and application operation. We do not use advertising or behavioural tracking cookies at launch.',
    read: 'Read the',
    cookiePolicy: 'Cookie Policy',
    and: 'and',
    privacyPolicy: 'Privacy Policy',
    accept: 'Accept essential cookies',
    reject: 'Reject optional cookies'
  },
  es: {
    title: 'Cookies y privacidad',
    text:
      'QOOBIX utiliza cookies esenciales para el acceso privado, la seguridad de sesión y el funcionamiento de la aplicación. No utilizamos cookies publicitarias ni de seguimiento conductual en el lanzamiento.',
    read: 'Lea la',
    cookiePolicy: 'Política de cookies',
    and: 'y la',
    privacyPolicy: 'Política de privacidad',
    accept: 'Aceptar cookies esenciales',
    reject: 'Rechazar cookies opcionales'
  },
  it: {
    title: 'Cookie e privacy',
    text:
      'QOOBIX utilizza cookie essenziali per l’accesso privato, la sicurezza della sessione e il funzionamento dell’applicazione. Al lancio non utilizziamo cookie pubblicitari o di tracciamento comportamentale.',
    read: 'Leggi la',
    cookiePolicy: 'Cookie Policy',
    and: 'e la',
    privacyPolicy: 'Privacy Policy',
    accept: 'Accetta cookie essenziali',
    reject: 'Rifiuta cookie opzionali'
  }
};

function getBrowserLocale(): BannerLocale {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const language = window.navigator.language.toLowerCase();

  if (language.startsWith('es')) return 'es';
  if (language.startsWith('it')) return 'it';

  return 'en';
}

export function CookiePrivacyBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [locale, setLocale] = useState<BannerLocale>('en');

  useEffect(() => {
    setLocale(getBrowserLocale());

    try {
      const storedChoice = window.localStorage.getItem(STORAGE_KEY);
      setIsVisible(!storedChoice);
    } catch {
      setIsVisible(false);
    }
  }, []);

  function saveChoice(choice: 'accepted' | 'rejected_optional') {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          choice,
          date: new Date().toISOString()
        })
      );
    } catch {
      // Ignore storage failure. The banner is informational and non-essential.
    }

    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  const t = labels[locale];

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 md:inset-x-auto md:right-5 md:max-w-xl">
      <div className="rounded-xl border border-[var(--qoobix-border)] bg-white/94 p-5 shadow-[0_24px_70px_rgba(51,36,26,0.18)] backdrop-blur-2xl">
        <h2 className="text-base font-semibold tracking-[-0.02em] text-[var(--qoobix-text)]">
          {t.title}
        </h2>

        <p className="mt-3 text-sm leading-7 text-[var(--qoobix-muted)]">{t.text}</p>

        <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
          {t.read}{' '}
          <Link
            href="/legal/cookie-policy"
            className="font-semibold text-[var(--qoobix-orange)] transition hover:text-[var(--qoobix-orange-dark)]"
          >
            {t.cookiePolicy}
          </Link>{' '}
          {t.and}{' '}
          <Link
            href="/legal/privacy-policy"
            className="font-semibold text-[var(--qoobix-orange)] transition hover:text-[var(--qoobix-orange-dark)]"
          >
            {t.privacyPolicy}
          </Link>
          .
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => saveChoice('accepted')}
            style={{ color: '#ffffff' }}
            className="qoobix-focus-ring inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] px-4 py-2.5 text-sm font-semibold shadow-[0_12px_28px_rgba(232,90,42,0.18)] transition hover:bg-[var(--qoobix-orange-dark)]"
          >
            {t.accept}
          </button>

          <button
            type="button"
            onClick={() => saveChoice('rejected_optional')}
            className="qoobix-focus-ring inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--qoobix-border)] bg-white/68 px-4 py-2.5 text-sm font-semibold shadow-[0_8px_22px_rgba(51,36,26,0.04)] transition hover:border-[var(--qoobix-border-strong)] hover:bg-white"
          >
            {t.reject}
          </button>
        </div>
      </div>
    </div>
  );
}
