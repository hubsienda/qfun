type MarkdownContentProps = {
  content: string;
};

type Block =
  | {
      type: 'heading';
      level: 2 | 3;
      text: string;
    }
  | {
      type: 'paragraph';
      text: string;
    }
  | {
      type: 'list';
      ordered: boolean;
      items: string[];
    };

function parseMarkdown(content: string): Block[] {
  const lines = content.split('\n');
  const blocks: Block[] = [];

  let paragraph: string[] = [];
  let listItems: string[] = [];
  let listOrdered = false;

  function flushParagraph() {
    if (paragraph.length > 0) {
      blocks.push({
        type: 'paragraph',
        text: paragraph.join(' ').trim()
      });
      paragraph = [];
    }
  }

  function flushList() {
    if (listItems.length > 0) {
      blocks.push({
        type: 'list',
        ordered: listOrdered,
        items: listItems
      });
      listItems = [];
      listOrdered = false;
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();

      blocks.push({
        type: 'heading',
        level: 2,
        text: line.replace(/^##\s+/, '')
      });

      continue;
    }

    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();

      blocks.push({
        type: 'heading',
        level: 3,
        text: line.replace(/^###\s+/, '')
      });

      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();

      listOrdered = true;
      listItems.push(line.replace(/^\d+\.\s+/, ''));
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      flushParagraph();

      listOrdered = false;
      listItems.push(line.replace(/^[-*]\s+/, ''));
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const blocks = parseMarkdown(content);

  return (
    <div className="space-y-5 text-base leading-8" style={{ color: 'var(--muted)' }}>
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const Tag = block.level === 2 ? 'h2' : 'h3';

          return (
            <Tag
              key={`${block.type}-${index}`}
              className="pt-4 text-xl font-semibold tracking-[-0.03em]"
              style={{ color: 'var(--foreground)' }}
            >
              {block.text}
            </Tag>
          );
        }

        if (block.type === 'list') {
          const Tag = block.ordered ? 'ol' : 'ul';

          return (
            <Tag
              key={`${block.type}-${index}`}
              className={block.ordered ? 'list-decimal space-y-2 pl-5' : 'list-disc space-y-2 pl-5'}
            >
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </Tag>
          );
        }

        return <p key={`${block.type}-${index}`}>{block.text}</p>;
      })}
    </div>
  );
}
