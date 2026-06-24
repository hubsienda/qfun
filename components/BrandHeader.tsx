import Image from 'next/image';
import Link from 'next/link';

export function BrandHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--qoobix-border)] bg-[rgba(251,247,241,0.78)] shadow-[0_8px_28px_rgba(51,36,26,0.04)] backdrop-blur-2xl">
      <div className="qoobix-container flex items-center justify-between gap-4 py-3">
        <Link
          href="/"
          className="qoobix-focus-ring flex items-center rounded-md"
          aria-label="QOOBIX home"
        >
          <Image
            src="/logo.png"
            alt="QOOBIX"
            width={220}
            height={220}
            priority
            className="h-24 w-24 object-contain sm:h-28 sm:w-28 md:h-36 md:w-36"
          />
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/access"
            style={{ color: '#ffffff' }}
            className="qoobix-focus-ring inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] px-4 py-2.5 font-semibold shadow-[0_12px_28px_rgba(232,90,42,0.18)] transition duration-200 hover:bg-[var(--qoobix-orange-dark)] hover:shadow-[0_16px_34px_rgba(232,90,42,0.22)]"
          >
            Client access
          </Link>
        </nav>
      </div>
    </header>
  );
}
