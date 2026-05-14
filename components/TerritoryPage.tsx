import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

type TerritoryPageProps = {
  eyebrow: string;
  title: string;
  body: string;
  showStoreLink?: boolean;
};

export default function TerritoryPage({
  eyebrow,
  title,
  body,
  showStoreLink = true
}: TerritoryPageProps) {
  return (
    <div className="qoobix-shell">
      <div className="qoobix-grid pointer-events-none fixed inset-0 opacity-30" />

      <Header />

      <main className="relative mx-auto flex min-h-[calc(100vh-14rem)] w-full max-w-5xl items-center px-5 py-16 sm:px-8 lg:px-10">
        <section
          className="w-full rounded-[2rem] border p-7 shadow-2xl sm:p-10 lg:p-12"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--panel-strong)',
            boxShadow: '0 30px 90px var(--shadow)'
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: '#E85A2A' }}
          >
            {eyebrow}
          </p>

          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.07em] sm:text-6xl">
            {title}
          </h1>

          <p
            className="mt-6 max-w-3xl text-lg leading-8 sm:text-xl"
            style={{ color: 'var(--muted)' }}
          >
            {body}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/"
              className="qoobix-focus inline-flex justify-center rounded-full bg-[#E85A2A] px-6 py-4 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5"
            >
              Return to Da QOOBIX
            </Link>

            {showStoreLink ? (
              <a
                href="https://siendamedia.com"
                target="_blank"
                rel="noreferrer noopener"
                className="qoobix-focus inline-flex justify-center rounded-full border px-6 py-4 text-sm font-semibold transition hover:-translate-y-0.5"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--panel)'
                }}
              >
                Visit Sienda Media
              </a>
            ) : null}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
