import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MarkdownContent from '@/components/MarkdownContent';
import { getAllLegalPages, getLegalPage } from '@/lib/content';

type LegalPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllLegalPages().map((page) => ({
    slug: page.slug
  }));
}

export async function generateMetadata({ params }: LegalPageProps) {
  const { slug } = await params;

  try {
    const page = getLegalPage(slug);

    return {
      title: `${page.title} — QOOBIX`,
      description: page.description
    };
  } catch {
    return {
      title: 'Legal — QOOBIX'
    };
  }
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;

  let page;

  try {
    page = getLegalPage(slug);
  } catch {
    notFound();
  }

  return (
    <div className="qoobix-shell">
      <div className="qoobix-grid pointer-events-none fixed inset-0 opacity-30" />

      <Header />

      <main className="relative mx-auto min-h-[calc(100vh-14rem)] w-full max-w-4xl px-5 py-16 sm:px-8 lg:px-10">
        <article
          className="rounded-3xl border p-7 sm:p-10"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--panel-strong)',
            boxShadow: '0 30px 90px var(--shadow)'
          }}
        >
          <Link
            href="/legal"
            className="qoobix-focus inline-flex rounded-xl border px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
            style={{
              borderColor: 'rgba(232, 90, 42, 0.55)',
              color: '#E85A2A',
              background: 'transparent'
            }}
          >
            Back to Legal index
          </Link>

          <p
            className="mt-8 text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: '#E85A2A' }}
          >
            Effective date: {page.effectiveDate}
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
            {page.title}
          </h1>

          <p
            className="mt-5 max-w-3xl text-lg leading-8"
            style={{ color: 'var(--muted)' }}
          >
            {page.description}
          </p>

          <div className="mt-8">
            <MarkdownContent content={page.content} />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
