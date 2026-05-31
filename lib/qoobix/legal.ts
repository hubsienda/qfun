import fs from 'node:fs';
import path from 'node:path';

export type LegalDocument = {
  slug: string;
  title: string;
  filename: string;
  content: string;
  effectiveDate: string;
};

const legalDirectory = path.join(process.cwd(), 'content', 'legal');

export const legalDocuments = [
  {
    slug: 'terms-of-service',
    title: 'Terms of Service',
    filename: '01-terms-of-service.md'
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    filename: '02-privacy-policy.md'
  },
  {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    filename: '03-cookie-policy.md'
  },
  {
    slug: 'refund-policy',
    title: 'Refund Policy',
    filename: '04-refund-policy.md'
  },
  {
    slug: 'data-sources-and-report-disclaimer',
    title: 'Data Sources & Report Disclaimer',
    filename: '05-data-sources-and-report-disclaimer.md'
  },
  {
    slug: 'ai-and-automated-analysis-notice',
    title: 'AI and Automated Analysis Notice',
    filename: '06-ai-and-automated-analysis-notice.md'
  },
  {
    slug: 'acceptable-use-policy',
    title: 'Acceptable Use Policy',
    filename: '07-acceptable-use-policy.md'
  },
  {
    slug: 'plain-english-summary',
    title: 'Plain-English Summary',
    filename: '08-plain-english-summary.md'
  }
];

function stripFrontMatter(markdown: string) {
  return markdown.replace(/^---\n[\s\S]*?\n---\n?/, '').trim();
}

function extractEffectiveDate(markdown: string) {
  const match = markdown.match(/^---\n[\s\S]*?effective_date:\s*"?([^"\n]+)"?[\s\S]*?\n---/);

  return match?.[1]?.trim() ?? '[insert date]';
}

export function getLegalDocument(slug: string): LegalDocument | null {
  const entry = legalDocuments.find((document) => document.slug === slug);

  if (!entry) {
    return null;
  }

  const filePath = path.join(legalDirectory, entry.filename);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf8');

  return {
    slug: entry.slug,
    title: entry.title,
    filename: entry.filename,
    content: stripFrontMatter(raw),
    effectiveDate: extractEffectiveDate(raw)
  };
}

export function getAllLegalDocuments() {
  return legalDocuments
    .map((document) => getLegalDocument(document.slug))
    .filter((document): document is LegalDocument => Boolean(document));
}
