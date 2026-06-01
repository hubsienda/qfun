import fs from 'node:fs';
import path from 'node:path';

export type FaqDocument = {
  title: string;
  content: string;
  effectiveDate: string;
};

const faqFilePath = path.join(process.cwd(), 'content', 'faqs', 'qoobix-faqs.md');

function stripFrontMatter(markdown: string) {
  return markdown.replace(/^---\n[\s\S]*?\n---\n?/, '').trim();
}

function extractTitle(markdown: string) {
  const match = markdown.match(/^---\n[\s\S]*?title:\s*"?([^"\n]+)"?[\s\S]*?\n---/);

  return match?.[1]?.trim() ?? 'QOOBIX FAQs';
}

function extractEffectiveDate(markdown: string) {
  const match = markdown.match(/^---\n[\s\S]*?effective_date:\s*"?([^"\n]+)"?[\s\S]*?\n---/);

  return match?.[1]?.trim() ?? '';
}

export function getFaqDocument(): FaqDocument {
  if (!fs.existsSync(faqFilePath)) {
    return {
      title: 'QOOBIX FAQs',
      effectiveDate: '',
      content: '# QOOBIX FAQs\n\nThe FAQ document has not been created yet.'
    };
  }

  const raw = fs.readFileSync(faqFilePath, 'utf8');

  return {
    title: extractTitle(raw),
    effectiveDate: extractEffectiveDate(raw),
    content: stripFrontMatter(raw)
  };
}
