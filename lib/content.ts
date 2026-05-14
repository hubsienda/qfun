import fs from 'node:fs';
import path from 'node:path';
import type {
  HomeContent,
  LegalPageContent,
  ParsedMarkdown,
  TerritoryContent
} from '@/lib/content-types';

const contentRoot = path.join(process.cwd(), 'content');

function readFile(relativePath: string) {
  return fs.readFileSync(path.join(contentRoot, relativePath), 'utf8');
}

function parseMarkdown(raw: string): ParsedMarkdown {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    return {
      data: {},
      content: raw.trim()
    };
  }

  const frontmatter = match[1];
  const content = match[2].trim();

  const data = frontmatter
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, line) => {
      const separatorIndex = line.indexOf(':');

      if (separatorIndex === -1) {
        return acc;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line
        .slice(separatorIndex + 1)
        .trim()
        .replace(/^["']|["']$/g, '');

      acc[key] = value;
      return acc;
    }, {});

  return {
    data,
    content
  };
}

export function getHomeContent(): HomeContent {
  const parsed = parseMarkdown(readFile('home.md'));

  return parsed.data as HomeContent;
}

export function getTerritoryContent(slug: string): TerritoryContent {
  const parsed = parseMarkdown(readFile(`territories/${slug}.md`));

  return {
    slug,
    eyebrow: parsed.data.eyebrow,
    title: parsed.data.title,
    description: parsed.data.description,
    cardButton: parsed.data.cardButton,
    pageButton: parsed.data.pageButton,
    showStoreLink: parsed.data.showStoreLink ?? 'false',
    content: parsed.content
  };
}

export function getLegalPage(slug: string): LegalPageContent {
  const parsed = parseMarkdown(readFile(`legal/${slug}.md`));

  return {
    slug,
    title: parsed.data.title,
    description: parsed.data.description,
    effectiveDate: parsed.data.effectiveDate,
    content: parsed.content
  };
}

export function getAllLegalPages(): LegalPageContent[] {
  const legalPath = path.join(contentRoot, 'legal');

  return fs
    .readdirSync(legalPath)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))
    .map((slug) => getLegalPage(slug))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getTerritoryCards() {
  return ['goalverse', 'punkia', 'proteus'].map((slug) => {
    const territory = getTerritoryContent(slug);

    return {
      title: territory.title,
      description: territory.description,
      button: territory.cardButton,
      href: `/${slug}`
    };
  });
}
