'use client';

type RichTextContentProps = {
  content: string;
  className?: string;
};

type InlineToken =
  | { type: 'text'; value: string }
  | { type: 'link'; value: string; href: string };

const INLINE_LINK_PATTERN = /\[([^\]]+)\]\s*\(\s*(https?:\/\/[^\s)]+)\s*\)|(https?:\/\/[^\s<]+[^\s<.,:;"')\]\}])/g;

const tokenizeInlineContent = (value: string): InlineToken[] => {
  const tokens: InlineToken[] = [];
  let cursor = 0;

  for (const match of value.matchAll(INLINE_LINK_PATTERN)) {
    const matchedText = match[0];
    const matchIndex = match.index ?? 0;

    if (matchIndex > cursor) {
      tokens.push({ type: 'text', value: value.slice(cursor, matchIndex) });
    }

    const label = match[1];
    const markdownHref = match[2];
    const bareHref = match[3];

    tokens.push({
      type: 'link',
      value: label || bareHref || matchedText,
      href: markdownHref || bareHref || '',
    });
    cursor = matchIndex + matchedText.length;
  }

  if (cursor < value.length) {
    tokens.push({ type: 'text', value: value.slice(cursor) });
  }

  return tokens.length > 0 ? tokens : [{ type: 'text', value }];
};

const renderInlineContent = (value: string) => {
  return tokenizeInlineContent(value).map((token, index) => {
    if (token.type === 'link') {
      return (
        <a
          key={`${token.href}-${index}`}
          href={token.href}
          target="_blank"
          rel="noreferrer"
          className="text-accent-text underline decoration-line underline-offset-4 hover:decoration-accent break-all"
        >
          {token.value}
        </a>
      );
    }

    return <span key={`${index}-${token.value}`}>{token.value}</span>;
  });
};

export default function RichTextContent({ content, className }: RichTextContentProps) {
  const normalized = content.replace(/\r\n/g, '\n').trim();
  if (!normalized) return null;

  const blocks = normalized.split(/\n{2,}/);

  return (
    <div className={className}>
      {blocks.map((block, blockIndex) => {
        const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
        const isListBlock = lines.length > 1 || lines.every((line) => line.startsWith('- ') || line.startsWith('• '));

        if (isListBlock) {
          return (
            <div key={`block-${blockIndex}`} className="space-y-3">
              {lines.map((line, lineIndex) => {
                const itemText = line.replace(/^[-•]\s*/, '');
                return (
                  <div key={`line-${blockIndex}-${lineIndex}`} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="min-w-0 break-words">{renderInlineContent(itemText)}</span>
                  </div>
                );
              })}
            </div>
          );
        }

        return (
          <p key={`block-${blockIndex}`} className="whitespace-pre-wrap break-words">
            {renderInlineContent(block)}
          </p>
        );
      })}
    </div>
  );
}
