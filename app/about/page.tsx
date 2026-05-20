import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MarkdownContent from '@/components/MarkdownContent';
import { getAboutContent } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About | QOOBIX',
  description:
    'The explanatory foundation for Da QOOBIX, Proteus, Goalverse, Punkia, Sienda Media, and the antidote ecosystem.'
};

export default function AboutPage() {
  const page = getAboutContent();

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
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: '#E85A2A' }}
          >
            QOOBIX explained, regrettably
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
