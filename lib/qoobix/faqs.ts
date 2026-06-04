import fs from 'node:fs';
import path from 'node:path';
import type { ClientLocale } from '@/lib/qoobix/client-i18n';

export type FaqDocument = {
  title: string;
  content: string;
  effectiveDate: string;
  locale: ClientLocale;
};

const faqDirectory = path.join(process.cwd(), 'content', 'faqs');

function normaliseLocale(locale?: ClientLocale): ClientLocale {
  if (locale === 'es' || locale === 'it') {
    return locale;
  }

  return 'en';
}

function getFaqFilePath(locale: ClientLocale) {
  if (locale === 'es') {
    return path.join(faqDirectory, 'es', 'qoobix-faqs.md');
  }

  if (locale === 'it') {
    return path.join(faqDirectory, 'it', 'qoobix-faqs.md');
  }

  return path.join(faqDirectory, 'qoobix-faqs.md');
}

function stripFrontMatter(markdown: string) {
  return markdown.replace(/^---\n[\s\S]*?\n---\n?/, '').trim();
}

function extractTitle(markdown: string, fallback: string) {
  const match = markdown.match(/^---\n[\s\S]*?title:\s*"?([^"\n]+)"?[\s\S]*?\n---/);

  return match?.[1]?.trim() ?? fallback;
}

function extractEffectiveDate(markdown: string) {
  const match = markdown.match(/^---\n[\s\S]*?effective_date:\s*"?([^"\n]+)"?[\s\S]*?\n---/);

  return match?.[1]?.trim() ?? '';
}

function fallbackTitle(locale: ClientLocale) {
  if (locale === 'es') return 'Preguntas frecuentes de QOOBIX';
  if (locale === 'it') return 'FAQ QOOBIX';
  return 'QOOBIX FAQs';
}

function fallbackContent(locale: ClientLocale) {
  if (locale === 'es') {
    return '# Preguntas frecuentes de QOOBIX\n\nEl documento de preguntas frecuentes aún no se ha creado.';
  }

  if (locale === 'it') {
    return '# FAQ QOOBIX\n\nIl documento FAQ non è ancora stato creato.';
  }

  return '# QOOBIX FAQs\n\nThe FAQ document has not been created yet.';
}

export function getFaqDocument(locale: ClientLocale = 'en'): FaqDocument {
  const safeLocale = normaliseLocale(locale);
  const localisedPath = getFaqFilePath(safeLocale);
  const englishPath = getFaqFilePath('en');

  const filePath = fs.existsSync(localisedPath) ? localisedPath : englishPath;
  const resolvedLocale = fs.existsSync(localisedPath) ? safeLocale : 'en';

  if (!fs.existsSync(filePath)) {
    return {
      title: fallbackTitle(resolvedLocale),
      effectiveDate: '',
      content: fallbackContent(resolvedLocale),
      locale: resolvedLocale
    };
  }

  const raw = fs.readFileSync(filePath, 'utf8');

  return {
    title: extractTitle(raw, fallbackTitle(resolvedLocale)),
    effectiveDate: extractEffectiveDate(raw),
    content: stripFrontMatter(raw),
    locale: resolvedLocale
  };
}
