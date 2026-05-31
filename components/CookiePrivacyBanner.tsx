'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'qoobix-cookie-privacy-choice';

export function CookiePrivacyBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
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

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 md:inset-x-auto md:right-5 md:max-w-xl">
      <div className="rounded-xl border border-[var(--qoobix-border)] bg-white/95 p-5 shadow-2xl backdrop-blur-xl">
        <h2 className="text-base font-semibold">Cookies and privacy</h2>

        <p className="mt-3 text-sm leading-7 text-[var(--qoobix-muted)]">
          QOOBIX uses essential cookies for private access, session security, and application
          operation. We do not use advertising or behavioural tracking cookies at launch.
        </p>

        <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
          Read the{' '}
          <Link href="/legal/cookie-policy" className="font-semibold text-[var(--qoobix-orange)]">
            Cookie Policy
          </Link>{' '}
          and{' '}
          <Link href="/legal/privacy-policy" className="font-semibold text-[var(--qoobix-orange)]">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => saveChoice('accepted')}
            style={{ color: '#ffffff' }}
            className="qoobix-focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] px-5 py-3 text-sm font-semibold"
          >
            Accept essential cookies
          </button>

          <button
            type="button"
            onClick={() => saveChoice('rejected_optional')}
            className="qoobix-focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--qoobix-border)] bg-white/70 px-5 py-3 text-sm font-semibold"
          >
            Reject optional cookies
          </button>
        </div>
      </div>
    </div>
  );
}
