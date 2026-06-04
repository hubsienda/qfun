import Image from 'next/image';
import Link from 'next/link';

export function BrandHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--qoobix-border)] bg-[rgba(255,250,244,0.72)] shadow-[0_10px_34px_rgba(51,36,26,0.045)] backdrop-blur-2xl">
      <div className="qoobix-container flex items-center justify-between gap-4 py-2">
        <Link
          href="/"
          className="qoobix-focus-ring flex items-center rounded-lg"
          aria-label="QOOBIX home"
        >
          <Image
            src="/logo.png"
            alt="QOOBIX"
            width={260}
            height={260}
            priority
            className="h-24 w-24 object-contain sm:h-32 sm:w-32 md:h-40 md:w-40"
          />
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/access"
            style={{ color: '#ffffff' }}
            className="qoobix-focus-ring inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] px-5 py-2.5 font-bold shadow-[0_14px_34px_rgba(232,90,42,0.22)] transition duration-200 hover:bg-[var(--qoobix-orange-dark)] hover:shadow-[0_18px_44px_rgba(232,90,42,0.26)]"
          >
            Client access
          </Link>
        </nav>
      </div>
    </header>
  );
}
