import Image from 'next/image';
import Link from 'next/link';

export function BrandHeader() {
  return (
    <header className="border-b border-[var(--qoobix-border)] bg-white/45 backdrop-blur-xl">
      <div className="qoobix-container flex items-center justify-between py-5">
        <Link href="/" className="qoobix-focus-ring flex items-center gap-3 rounded-xl">
          <Image
            src="/logo.png"
            alt="QOOBIX"
            width={44}
            height={44}
            priority
            className="h-11 w-11 object-contain"
          />
          <div>
            <p className="text-lg font-semibold tracking-[0.18em] text-[var(--qoobix-orange)]">
              QOOBIX
            </p>
            <p className="text-xs text-[var(--qoobix-muted)]">managed by Proteus</p>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-sm text-[var(--qoobix-muted)]">
          <Link href="/access" className="qoobix-focus-ring rounded-lg hover:text-[var(--qoobix-text)]">
            Access
          </Link>
          <Link href="/admin" className="qoobix-focus-ring rounded-lg hover:text-[var(--qoobix-text)]">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
