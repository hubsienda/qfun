import Image from 'next/image';
import Link from 'next/link';

export function BrandHeader() {
  return (
    <header className="border-b border-[var(--qoobix-border)] bg-white/45 backdrop-blur-xl">
      <div className="qoobix-container flex items-center justify-between py-3">
        <Link href="/" className="qoobix-focus-ring flex items-center rounded-xl">
          <Image
            src="/logo.png"
            alt="QOOBIX"
            width={180}
            height={180}
            priority
            className="h-32 w-32 object-contain md:h-44 md:w-44"
          />
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/access"
            className="qoobix-focus-ring inline-flex items-center justify-center rounded-md border border-[var(--qoobix-orange)] bg-white/55 px-4 py-2 font-semibold text-[var(--qoobix-orange)] shadow-sm transition hover:bg-[var(--qoobix-orange)] hover:text-white"
          >
            Client access
          </Link>
        </nav>
      </div>
    </header>
  );
}
