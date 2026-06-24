import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-10 border-t border-[var(--qoobix-border)] bg-[rgba(255,255,255,0.32)]">
      <div className="qoobix-container py-8 text-sm text-[var(--qoobix-muted)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-semibold text-[var(--qoobix-text)]">QOOBIX</p>
            <p className="mt-1">
              Private market intelligence and candidate discovery for verification.
            </p>
          </div>

          <div className="md:text-right">
            <p>Built by Sienda Ltd.</p>
            <p className="mt-1">Managed by Proteus, proprietary intelligence layer.</p>
          </div>
        </div>

        <div className="mt-6 qoobix-soft-divider" />

        <nav className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs">
          <Link href="/faqs" className="transition hover:text-[var(--qoobix-orange)]">
            FAQs
          </Link>
          <Link href="/legal" className="transition hover:text-[var(--qoobix-orange)]">
            Legal
          </Link>
          <Link
            href="/legal/terms-of-service"
            className="transition hover:text-[var(--qoobix-orange)]"
          >
            Terms
          </Link>
          <Link
            href="/legal/privacy-policy"
            className="transition hover:text-[var(--qoobix-orange)]"
          >
            Privacy
          </Link>
          <Link
            href="/legal/cookie-policy"
            className="transition hover:text-[var(--qoobix-orange)]"
          >
            Cookies
          </Link>
          <Link
            href="/legal/refund-policy"
            className="transition hover:text-[var(--qoobix-orange)]"
          >
            Refunds
          </Link>
          <Link
            href="/legal/data-sources-and-report-disclaimer"
            className="transition hover:text-[var(--qoobix-orange)]"
          >
            Data & report disclaimer
          </Link>
          <Link
            href="/legal/ai-and-automated-analysis-notice"
            className="transition hover:text-[var(--qoobix-orange)]"
          >
            AI notice
          </Link>
          <Link
            href="/legal/acceptable-use-policy"
            className="transition hover:text-[var(--qoobix-orange)]"
          >
            Acceptable use
          </Link>
        </nav>
      </div>
    </footer>
  );
}
