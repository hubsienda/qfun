import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      className="mx-auto mt-14 w-full max-w-7xl px-5 pb-8 pt-10 text-sm sm:px-8 lg:px-10"
      style={{ color: 'var(--muted)' }}
    >
      <div
        className="flex flex-col gap-5 border-t pt-7 md:flex-row md:items-center md:justify-between"
        style={{ borderColor: 'var(--border)' }}
      >
        <p>
          QOOBIX with{' '}
          <span aria-label="love" role="img" style={{ color: '#E85A2A' }}>
            ♥
          </span>{' '}
          by{' '}
          <a
            href="https://sienda.co.uk"
            target="_blank"
            rel="noreferrer noopener"
            className="qoobix-focus rounded-md transition hover:text-[#E85A2A]"
          >
            Sienda Ltd
          </a>
        </p>

        <nav className="flex flex-wrap gap-x-5 gap-y-3" aria-label="Footer">
          <a
            href="https://siendamedia.com"
            target="_blank"
            rel="noreferrer noopener"
            className="qoobix-focus rounded-md transition hover:text-[#E85A2A]"
          >
            Sienda Media
          </a>

          <Link
            href="/goalverse"
            className="qoobix-focus rounded-md transition hover:text-[#E85A2A]"
          >
            Goalverse
          </Link>

          <Link
            href="/punkia"
            className="qoobix-focus rounded-md transition hover:text-[#E85A2A]"
          >
            Punkia
          </Link>

          <Link
            href="/proteus"
            className="qoobix-focus rounded-md transition hover:text-[#E85A2A]"
          >
            Proteus
          </Link>

          <Link
            href="/legal"
            className="qoobix-focus rounded-md transition hover:text-[#E85A2A]"
          >
            Legal
          </Link>
        </nav>
      </div>
    </footer>
  );
}
