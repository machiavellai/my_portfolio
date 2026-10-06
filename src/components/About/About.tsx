import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { HOME_QUERY_RESULT } from '@/sanity/types';
import { Link } from '../Link/Link';
import { Section } from '../Section/Section';
import { StackChip } from '../StackChip/StackChip';

type Home = NonNullable<HOME_QUERY_RESULT>;

export type AboutProps = {
  about: Home['about'];
  stack: Home['stack'];
};

// The schema allows only the normal block style and bold, italic and links (schema.ts).
// Rendered on the server: @portabletext/react adds no client JavaScript.
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink-900">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href: unknown = value?.href;
      return typeof href === 'string' ? <Link href={href}>{children}</Link> : <>{children}</>;
    },
  },
};

/** Prose at 59ch, then stack chips grouped by area on the full content column (layouts.md). */
export function About({ about, stack }: AboutProps) {
  return (
    <Section id="about" number="03" title="About">
      <div className="flex flex-col gap-9">
        <div className="flex max-w-prose flex-col gap-8 text-prose text-ink-700">
          <PortableText value={about} components={components} />
        </div>

        <div className="flex flex-col gap-6">
          {stack.map((group) => (
            <div key={group._key} className="flex flex-col gap-2">
              <h3 className="font-mono text-mono text-ink-600">{group.group}</h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <StackChip>{item}</StackChip>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
