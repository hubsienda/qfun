'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type CookieChoice = 'accepted' | 'declined';

const storageKey = 'qoobix-cookie-privacy-choice';

export default function CookiePrivacyBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const storedChoice = localStorage.getItem(storageKey) as CookieChoice | null;

    if (!storedChoice) {
      setIsVisible(true);
    }
  }, []);

  function saveChoice(choice: CookieChoice) {
    localStorage.setItem(storageKey, choice);
    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6">
      <section
        className="mx-auto max-w-4xl rounded-3xl border p-5 shadow-2xl backdrop-blur-xl sm:p-6"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--panel-strong)',
          boxShadow: '0 24px 80px var(--shadow)'
        }}
        aria-label="Cookie and privacy notice"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p
              className="text-xs font-semibold uppercase tracking-[0.26em]"
              style={{ color: '#E85A2A' }}
            >
              Privacy, without ceremonial fog
            </p>

            <p className="mt-3 text-sm leading-7" style={{ color: 'var(--muted)' }}>
              QOOBIX uses minimal local storage for choices such as theme and
              this notice. Accept or decline; Proteus will judge neither. Well,
              not officially. Read more in the{' '}
              <Link
                href="/legal"
                className="qoobix-focus font-semibold transition hover:text-[#E85A2A]"
                style={{ color: 'var(--foreground)' }}
              >
                Legal page
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
            <button
              type="button"
              onClick={() => saveChoice('declined')}
              className="qoobix-focus inline-flex justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                background: 'transparent'
              }}
            >
              Decline
            </button>

            <button
              type="button"
              onClick={() => saveChoice('accepted')}
              className="qoobix-focus inline-flex justify-center rounded-xl bg-[#E85A2A] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Accept
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
