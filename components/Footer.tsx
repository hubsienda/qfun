import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[var(--qoobix-border)] bg-white/35">
      <div className="qoobix-container flex flex-col gap-5 py-8 text-sm text-[var(--qoobix-muted)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>QOOBIX · Private market intelligence · No CRM-shaped swamp.</p>
          <p>Built by Sienda Ltd. · Managed by Proteus, proprietary algorithm.</p>
        </div>

        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
          <Link href="/legal" className="hover:text-[var(--qoobix-orange)]">
            Legal
          </Link>
          <Link href="/legal/terms-of-service" className="hover:text-[var(--qoobix-orange)]">
            Terms
          </Link>
          <Link href="/legal/privacy-policy" className="hover:text-[var(--qoobix-orange)]">
            Privacy
          </Link>
          <Link href="/legal/cookie-policy" className="hover:text-[var(--qoobix-orange)]">
            Cookies
          </Link>
          <Link href="/legal/refund-policy" className="hover:text-[var(--qoobix-orange)]">
            Refunds
          </Link>
          <Link
            href="/legal/data-sources-and-report-disclaimer"
            className="hover:text-[var(--qoobix-orange)]"
          >
            Data & report disclaimer
          </Link>
          <Link
            href="/legal/ai-and-automated-analysis-notice"
            className="hover:text-[var(--qoobix-orange)]"
          >
            AI notice
          </Link>
          <Link href="/legal/acceptable-use-policy" className="hover:text-[var(--qoobix-orange)]">
            Acceptable use
          </Link>
        </nav>
      </div>
    </footer>
  );
}
