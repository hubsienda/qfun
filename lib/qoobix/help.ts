import fs from 'node:fs';
import path from 'node:path';

export type HelpDocument = {
  slug: string;
  title: string;
  filename: string;
  content: string;
};

const helpDirectory = path.join(process.cwd(), 'content', 'help');

export const helpDocuments = [
  {
    slug: 'user-guide',
    title: 'User Guide',
    filename: 'user-guide.md',
    description: 'How to access QOOBIX, create requests, generate files, and use the outputs.'
  },
  {
    slug: 'request-examples',
    title: 'Request Examples',
    filename: 'request-examples.md',
    description:
      'Field-by-field examples for market questions, objectives, channels, competitors, and partners.'
  },
  {
    slug: 'case-studies',
    title: 'Case Studies',
    filename: 'case-studies.md',
    description: 'Practical examples of how QOOBIX can support commercial decisions.'
  }
];

function stripFrontMatter(markdown: string) {
  return markdown.replace(/^---\n[\s\S]*?\n---\n?/, '').trim();
}

function extractTitle(markdown: string, fallback: string) {
  const match = markdown.match(/^---\n[\s\S]*?title:\s*"?([^"\n]+)"?[\s\S]*?\n---/);

  return match?.[1]?.trim() ?? fallback;
}

export function getHelpDocument(slug: string): HelpDocument | null {
  const entry = helpDocuments.find((document) => document.slug === slug);

  if (!entry) {
    return null;
  }

  const filePath = path.join(helpDirectory, entry.filename);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf8');

  return {
    slug: entry.slug,
    title: extractTitle(raw, entry.title),
    filename: entry.filename,
    content: stripFrontMatter(raw)
  };
}

export function getAllHelpDocuments() {
  return helpDocuments
    .map((document) => {
      const fullDocument = getHelpDocument(document.slug);

      if (!fullDocument) {
        return null;
      }

      return {
        ...fullDocument,
        description: document.description
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
