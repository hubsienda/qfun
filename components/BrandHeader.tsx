import Image from 'next/image';
import Link from 'next/link';

export function BrandHeader() {
  return (
    <header className="border-b border-[var(--qoobix-border)] bg-white/45 backdrop-blur-xl">
      <div className="qoobix-container flex items-center justify-between py-4">
        <Link href="/" className="qoobix-focus-ring flex items-center rounded-xl">
          <Image
            src="/logo.png"
            alt="QOOBIX"
            width={160}
            height={160}
            priority
            className="h-24 w-24 object-contain md:h-32 md:w-32"
          />
        </Link>

        <nav className="flex items-center gap-4 text-sm text-[var(--qoobix-muted)]">
          <Link href="/access" className="qoobix-focus-ring rounded-md hover:text-[var(--qoobix-text)]">
            Access
          </Link>
          <Link href="/admin" className="qoobix-focus-ring rounded-md hover:text-[var(--qoobix-text)]">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
