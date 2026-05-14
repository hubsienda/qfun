import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { getAllLegalPages } from '@/lib/content';

export const metadata = {
  title: 'Legal — QOOBIX',
  description: 'Legal documents for QOOBIX.'
};

export default function LegalIndexPage() {
  const pages = getAllLegalPages();

  return (
    <div className="qoobix-shell">
      <div className="qoobix-grid pointer-events-none fixed inset-0 opacity-30" />

      <Header />

      <main className="relative mx-auto min-h-[calc(100vh-14rem)] w-full max-w-5xl px-5 py-16 sm:px-8 lg:px-10">
        <section
          className="rounded-3xl border p-7 sm:p-10"
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
            QOOBIX
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
            Legal
          </h1>

          <p
            className="mt-5 max-w-3xl text-lg leading-8"
            style={{ color: 'var(--muted)' }}
          >
            The necessary documents. Written down so civilisation can pretend it
            read them.
          </p>

          <div className="mt-8 grid gap-3">
            {pages.map((page) => (
              <Link
                key={page.slug}
                href={`/legal/${page.slug}`}
                className="qoobix-focus rounded-xl border p-5 transition hover:-translate-y-0.5"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--panel)'
                }}
              >
                <span className="block text-lg font-semibold">{page.title}</span>
                <span className="mt-2 block text-sm" style={{ color: 'var(--muted)' }}>
                  {page.description}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
