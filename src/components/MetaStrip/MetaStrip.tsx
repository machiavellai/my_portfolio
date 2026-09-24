export type MetaStripProps = {
  items: string[];
  as?: 'div' | 'footer';
};

// Row of dot-separated meta at md+; stacks to one item per line below md and the
// separators drop (each item is expected to already read as a label/value pair,
// e.g. "Calgary, AB" or "Available Mar 2026").
export function MetaStrip({ items, as: Tag = 'div' }: MetaStripProps) {
  return (
    <Tag className="flex flex-col gap-1 font-mono text-mono text-ink-600 md:flex-row md:items-center md:gap-0">
      {items.map((item, index) => (
        <span key={index} className="md:flex md:items-center">
          {index > 0 ? <span aria-hidden="true" className="hidden px-3 md:inline">·</span> : null}
          {item}
        </span>
      ))}
    </Tag>
  );
}
