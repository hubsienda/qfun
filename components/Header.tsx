import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

const navItems = [
  { label: 'GOALVERSE', href: '/goalverse' },
  { label: 'Punkia', href: '/punkia' },
  { label: 'Products', href: 'https://siendamedia.com', external: true },
  { label: 'About Proteus', href: '/proteus' }
];

export default function Header() {
  return (
    <header className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">
      <Link
        href="/"
        className="qoobix-focus inline-flex items-center gap-3 rounded-xl"
        aria-label="QOOBIX home"
      >
        <Image
          src="/logo.png"
          alt="QOOBIX"
          width={190}
          height={58}
          priority
          className="h-auto w-32 sm:w-40 md:w-44"
        />
      </Link>

      <div className="flex items-center justify-end gap-3">
        <nav
          className="hidden items-center gap-1 rounded-full border px-2 py-2 md:flex"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--panel)'
          }}
          aria-label="Main navigation"
        >
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                className="qoobix-focus rounded-full px-3 py-2 text-sm transition hover:bg-black/5 dark:hover:bg-white/10"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="qoobix-focus rounded-full px-3 py-2 text-sm transition hover:bg-black/5 dark:hover:bg-white/10"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
