import fs from 'node:fs';
import path from 'node:path';
import type { ClientLocale } from '@/lib/qoobix/client-i18n';

export type HelpDocument = {
  slug: string;
  title: string;
  filename: string;
  content: string;
};

type HelpDocumentEntry = {
  slug: string;
  title: Record<ClientLocale, string>;
  filename: string;
  description: Record<ClientLocale, string>;
};

const helpDirectory = path.join(process.cwd(), 'content', 'help');

export const helpDocuments: HelpDocumentEntry[] = [
  {
    slug: 'user-guide',
    title: {
      en: 'User Guide',
      es: 'Guía de usuario',
      it: 'Guida utente'
    },
    filename: 'user-guide.md',
    description: {
      en: 'How to access QOOBIX, create requests, generate files, and use the outputs.',
      es: 'Cómo acceder a QOOBIX, crear solicitudes, generar archivos y utilizar los resultados.',
      it: 'Come accedere a QOOBIX, creare richieste, generare file e usare gli output.'
    }
  },
  {
    slug: 'request-examples',
    title: {
      en: 'Request Examples',
      es: 'Ejemplos de solicitud',
      it: 'Esempi di richiesta'
    },
    filename: 'request-examples.md',
    description: {
      en: 'Field-by-field examples for market questions, objectives, channels, competitors, and partners.',
      es: 'Ejemplos campo por campo para preguntas de mercado, objetivos, canales, competidores y socios.',
      it: 'Esempi campo per campo per domande di mercato, obiettivi, canali, concorrenti e partner.'
    }
  },
  {
    slug: 'case-studies',
    title: {
      en: 'Case Studies',
      es: 'Casos prácticos',
      it: 'Casi studio'
    },
    filename: 'case-studies.md',
    description: {
      en: 'Practical examples of how QOOBIX can support commercial decisions.',
      es: 'Ejemplos prácticos de cómo QOOBIX puede apoyar decisiones comerciales.',
      it: 'Esempi pratici di come QOOBIX può supportare decisioni commerciali.'
    }
  }
];

function normaliseLocale(locale?: ClientLocale): ClientLocale {
  if (locale === 'es' || locale === 'it') {
    return locale;
  }

  return 'en';
}

function stripFrontMatter(markdown: string) {
  return markdown.replace(/^---\n[\s\S]*?\n---\n?/, '').trim();
}

function extractTitle(markdown: string, fallback: string) {
  const match = markdown.match(/^---\n[\s\S]*?title:\s*"?([^"\n]+)"?[\s\S]*?\n---/);

  return match?.[1]?.trim() ?? fallback;
}

function resolveHelpFilePath(filename: string, locale: ClientLocale) {
  const localisedPath = path.join(helpDirectory, locale, filename);

  if (fs.existsSync(localisedPath)) {
    return localisedPath;
  }

  return path.join(helpDirectory, filename);
}

export function getHelpDocument(slug: string, locale: ClientLocale = 'en'): HelpDocument | null {
  const safeLocale = normaliseLocale(locale);
  const entry = helpDocuments.find((document) => document.slug === slug);

  if (!entry) {
    return null;
  }

  const filePath = resolveHelpFilePath(entry.filename, safeLocale);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const fallbackTitle = entry.title[safeLocale] ?? entry.title.en;

  return {
    slug: entry.slug,
    title: extractTitle(raw, fallbackTitle),
    filename: entry.filename,
    content: stripFrontMatter(raw)
  };
}

export function getAllHelpDocuments(locale: ClientLocale = 'en') {
  const safeLocale = normaliseLocale(locale);

  return helpDocuments
    .map((document) => {
      const fullDocument = getHelpDocument(document.slug, safeLocale);

      if (!fullDocument) {
        return null;
      }

      return {
        ...fullDocument,
        title: document.title[safeLocale] ?? document.title.en,
        description: document.description[safeLocale] ?? document.description.en
      };
    })
    .filter(
      (
        document
      ): document is HelpDocument & {
        description: string;
      } => Boolean(document)
    );
}
