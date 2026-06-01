import Link from 'next/link';
import type { ReactNode } from 'react';

type LegalMarkdownProps = {
  content: string;
};

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*([^*]+)\*\*)|\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      nodes.push(
        <strong key={`${match.index}-bold`} className="font-semibold">
          {match[2]}
        </strong>
      );
    } else if (match[3] && match[4]) {
      const href = match[4];
      const isExternal = href.startsWith('http') || href.startsWith('mailto:');

      if (isExternal) {
        nodes.push(
          <a
            key={`${match.index}-link`}
            href={href}
            className="font-semibold text-[var(--qoobix-orange)]"
          >
            {match[3]}
          </a>
        );
      } else {
        nodes.push(
          <Link
            key={`${match.index}-link`}
            href={href}
            className="font-semibold text-[var(--qoobix-orange)]"
          >
            {match[3]}
          </Link>
        );
      }
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function flushParagraph(buffer: string[], output: ReactNode[], keyBase: string) {
  if (!buffer.length) {
    return;
  }

  output.push(
    <p key={`${keyBase}-${output.length}`} className="leading-8 text-[var(--qoobix-muted)]">
      {renderInline(buffer.join(' '))}
    </p>
  );

  buffer.length = 0;
}

function flushList(items: string[], output: ReactNode[], keyBase: string, ordered = false) {
  if (!items.length) {
    return;
  }

  const ListTag = ordered ? 'ol' : 'ul';

  output.push(
    <ListTag
      key={`${keyBase}-${output.length}`}
      className={`space-y-2 leading-8 text-[var(--qoobix-muted)] ${
        ordered ? 'list-decimal' : 'list-disc'
      } pl-6`}
    >
      {items.map((item, index) => (
        <li key={`${keyBase}-${output.length}-${index}`}>{renderInline(item)}</li>
      ))}
    </ListTag>
  );

  items.length = 0;
}

export function LegalMarkdown({ content }: LegalMarkdownProps) {
  const lines = content.split(/\r?\n/);
  const output: ReactNode[] = [];
  const paragraphBuffer: string[] = [];
  const bulletItems: string[] = [];
  const orderedItems: string[] = [];

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph(paragraphBuffer, output, 'p');
      flushList(bulletItems, output, 'ul');
      flushList(orderedItems, output, 'ol', true);
      return;
    }

    if (line === '---') {
      flushParagraph(paragraphBuffer, output, 'p');
      flushList(bulletItems, output, 'ul');
      flushList(orderedItems, output, 'ol', true);
      output.push(<hr key={`hr-${index}`} className="border-[var(--qoobix-border)]" />);
      return;
    }

    if (line.startsWith('# ')) {
      flushParagraph(paragraphBuffer, output, 'p');
      flushList(bulletItems, output, 'ul');
      flushList(orderedItems, output, 'ol', true);
      output.push(
        <h1 key={`h1-${index}`} className="text-2xl font-semibold tracking-tight md:text-3xl">
          {renderInline(line.replace(/^#\s+/, ''))}
        </h1>
      );
      return;
    }

    if (line.startsWith('## ')) {
      flushParagraph(paragraphBuffer, output, 'p');
      flushList(bulletItems, output, 'ul');
      flushList(orderedItems, output, 'ol', true);
      output.push(
        <h2 key={`h2-${index}`} className="pt-5 text-xl font-semibold tracking-tight md:text-2xl">
          {renderInline(line.replace(/^##\s+/, ''))}
        </h2>
      );
      return;
    }

    if (line.startsWith('### ')) {
      flushParagraph(paragraphBuffer, output, 'p');
      flushList(bulletItems, output, 'ul');
      flushList(orderedItems, output, 'ol', true);
      output.push(
        <h3 key={`h3-${index}`} className="pt-3 text-lg font-semibold tracking-tight md:text-xl">
          {renderInline(line.replace(/^###\s+/, ''))}
        </h3>
      );
      return;
    }

    if (/^[-*]\s+/.test(line)) {
      flushParagraph(paragraphBuffer, output, 'p');
      flushList(orderedItems, output, 'ol', true);
      bulletItems.push(line.replace(/^[-*]\s+/, ''));
      return;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph(paragraphBuffer, output, 'p');
      flushList(bulletItems, output, 'ul');
      orderedItems.push(line.replace(/^\d+\.\s+/, ''));
      return;
    }

    paragraphBuffer.push(line);
  });

  flushParagraph(paragraphBuffer, output, 'p');
  flushList(bulletItems, output, 'ul');
  flushList(orderedItems, output, 'ol', true);

  return <div className="space-y-5">{output}</div>;
}
