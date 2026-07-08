import Link from 'next/link';

const siteLinks = [
  { href: '/what-qoobix-idaas-does', label: 'What QOOBIX IDAAS does' },
  { href: '/services', label: 'Services' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/use-cases', label: 'Use cases' },
  { href: '/operator-model', label: 'Operator model' },
  { href: '/outputs', label: 'Outputs' },
  { href: '/contact', label: 'Request review' }
];

const legalLinks = [
  { href: '/faqs', label: 'FAQs' },
  { href: '/legal', label: 'Legal' },
  { href: '/legal/terms-of-service', label: 'Terms' },
  { href: '/legal/privacy-policy', label: 'Privacy' },
  { href: '/legal/cookie-policy', label: 'Cookies' },
  { href: '/legal/data-sources-and-report-disclaimer', label: 'Data & report disclaimer' },
  { href: '/legal/ai-and-automated-analysis-notice', label: 'AI notice' },
  { href: '/legal/acceptable-use-policy', label: 'Acceptable use' }
];

export function Footer() {
  return (
    <footer className="mt-10 border-t border-[var(--qoobix-border)] bg-[rgba(255,255,255,0.42)]">
      <div className="qoobix-container py-8 text-sm text-[var(--qoobix-muted)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-semibold text-[var(--qoobix-text)]">QOOBIX IDAAS</p>
            <p className="mt-1">
              Intelligence Delivered As A Service for market-entry, competitor mapping and
              candidate organisation discovery for verification.
            </p>
          </div>

          <div className="md:text-right">
            <p>
              Created and managed by Sienda Ltd. Delivered directly or through qualified partner
              workspaces where appropriate.
            </p>
            <p className="mt-1">Built by Sienda Ltd. Managed by Proteus.</p>
          </div>
        </div>

        <div className="mt-6 qoobix-soft-divider" />

        <nav className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs">
          {siteLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[var(--qoobix-orange)]">
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[var(--qoobix-orange)]">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
