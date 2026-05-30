import Image from 'next/image';
import Link from 'next/link';

export function BrandHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--qoobix-border)] bg-white/58 backdrop-blur-xl">
      <div className="qoobix-container flex items-center justify-between gap-4 py-2">
        <Link href="/" className="qoobix-focus-ring flex items-center rounded-md" aria-label="QOOBIX home">
          <Image
            src="/logo.png"
            alt="QOOBIX"
            width={180}
            height={180}
            priority
            className="h-24 w-24 object-contain sm:h-28 sm:w-28 md:h-36 md:w-36"
          />
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/access"
            className="qoobix-focus-ring inline-flex items-center justify-center rounded-md border border-[var(--qoobix-orange)] bg-white/72 px-4 py-2 font-semibold text-[var(--qoobix-orange)] shadow-sm transition hover:bg-[var(--qoobix-orange)] hover:text-white"
          >
            Client access
          </Link>
        </nav>
      </div>
    </header>
  );
}
