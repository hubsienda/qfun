import Image from 'next/image';
import Link from 'next/link';

const navLinks = [
  { href: '/what-qoobix-idaas-does', label: 'What it does' },
  { href: '/services', label: 'Services' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/operator-model', label: 'Operator model' }
];

export function BrandHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--qoobix-border)] bg-[rgba(255,255,255,0.82)] shadow-[0_8px_28px_rgba(51,51,51,0.04)] backdrop-blur-2xl">
      <div className="qoobix-container flex items-center justify-between gap-4 py-2">
        <Link
          href="/"
          className="qoobix-focus-ring flex shrink-0 items-center rounded-md"
          aria-label="QOOBIX IDAAS home"
        >
          <Image
            src="/logo.png"
            alt="QOOBIX"
            width={320}
            height={320}
            priority
            className="h-32 w-32 object-contain sm:h-40 sm:w-40 md:h-48 md:w-48"
          />
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-5 text-sm font-semibold text-[var(--qoobix-muted)] lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-[var(--qoobix-orange)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/contact"
            className="qoobix-focus-ring hidden min-h-10 items-center justify-center rounded-md border border-[var(--qoobix-border)] bg-white/68 px-4 py-2.5 text-sm font-semibold shadow-[0_8px_22px_rgba(51,51,51,0.04)] transition hover:border-[var(--qoobix-border-strong)] hover:bg-white md:inline-flex"
          >
            Request review
          </Link>

          <Link
            href="/access"
            style={{ color: '#ffffff' }}
            className="qoobix-focus-ring inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] px-4 py-2.5 text-sm font-semibold shadow-[0_12px_28px_rgba(0,153,255,0.18)] transition duration-200 hover:bg-[var(--qoobix-orange-dark)] hover:shadow-[0_16px_34px_rgba(0,153,255,0.22)]"
          >
            Client access
          </Link>
        </div>
      </div>
    </header>
  );
}
