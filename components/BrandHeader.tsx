import Image from 'next/image';
import Link from 'next/link';

export function BrandHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--qoobix-border)] bg-white/58 backdrop-blur-xl">
      <div className="qoobix-container flex items-center justify-between gap-4 py-2">
        <Link
          href="/"
          className="qoobix-focus-ring flex items-center rounded-md"
          aria-label="QOOBIX home"
        >
          <Image
            src="/logo.png"
            alt="QOOBIX"
            width={260}
            height={260}
            priority
            className="h-32 w-32 object-contain sm:h-40 sm:w-40 md:h-52 md:w-52"
          />
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/access"
            style={{ color: '#ffffff' }}
            className="qoobix-focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] px-4 py-2 font-semibold shadow-sm transition hover:bg-[var(--qoobix-orange-dark)]"
          >
            Client access
          </Link>
        </nav>
      </div>
    </header>
  );
}
