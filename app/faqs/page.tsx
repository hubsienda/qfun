import type { Metadata } from 'next';
import { LegalMarkdown } from '@/components/LegalMarkdown';
import { Panel } from '@/components/Panel';
import { getFaqDocument } from '@/lib/qoobix/faqs';

export const metadata: Metadata = {
  title: 'FAQs',
  description: 'Frequently asked questions about QOOBIX.'
};

export default function FaqsPage() {
  const faqDocument = getFaqDocument();

  return (
    <section className="qoobix-narrow py-12 md:py-18">
      <Panel className="p-7 md:p-10">
        <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
          Help and product information
        </p>

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {faqDocument.title}
        </h1>

        <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">
          Practical answers about access, reports, file formats, verification, retention, and how
          QOOBIX works.
        </p>

        <div className="mt-8 border-t border-[var(--qoobix-border)] pt-8">
          <LegalMarkdown content={faqDocument.content} />
        </div>
      </Panel>
    </section>
  );
}
