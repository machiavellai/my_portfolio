import { PortableText, type PortableTextComponents, type PortableTextTypeComponentProps } from '@portabletext/react';
import type { Heading } from '@/sanity/caseStudy';
import type { CASE_STUDY_QUERY_RESULT } from '@/sanity/types';
import { CodeBlock } from '../CodeBlock/CodeBlock';
import { Figure } from '../Figure/Figure';
import { Link } from '../Link/Link';

type Body = NonNullable<NonNullable<CASE_STUDY_QUERY_RESULT>['body']>;
type CodeBlockValue = Extract<Body[number], { _type: 'codeBlock' }>;
type FigureValue = Extract<Body[number], { _type: 'figure' }>;

export type CaseStudyBodyProps = {
  body: Body;
  // h2 anchor ids by block key, from headingsOf(). Empty on the short template.
  headings: Heading[];
};

/**
 * The case-study body: paragraphs and h2s at the 59ch measure, code blocks and figures
 * stepping out to 660px, flush left (layouts.md). 32px between blocks. Rendered on the
 * server — @portabletext/react adds no client JavaScript.
 */
export function CaseStudyBody({ body, headings }: CaseStudyBodyProps) {
  const idByKey = new Map(headings.map((heading) => [heading.key, heading.id]));

  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className="max-w-prose">{children}</p>,
      h2: ({ children, value }) => (
        <h2 id={value._key ? idByKey.get(value._key) : undefined} className="max-w-prose text-pretty text-h2 text-ink-900">
          {children}
        </h2>
      ),
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold text-ink-900">{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      link: ({ children, value }) => {
        const href: unknown = value?.href;
        return typeof href === 'string' ? <Link href={href}>{children}</Link> : <>{children}</>;
      },
    },
    types: {
      codeBlock: ({ value }: PortableTextTypeComponentProps<CodeBlockValue>) => (
        <CodeBlock filename={value.filename} language={value.language} code={value.code} />
      ),
      figure: ({ value }: PortableTextTypeComponentProps<FigureValue>) => {
        const src = value.image.asset?.url;
        // Alt is a required field, so a published figure always has one. If the asset
        // or alt is somehow missing, render nothing rather than an image with a guessed alt.
        if (!src || value.alt === undefined) return null;
        return <Figure src={src} alt={value.alt} caption={value.caption} />;
      },
    },
  };

  return (
    <div className="flex flex-col gap-8 text-prose text-ink-700">
      <PortableText value={body} components={components} />
    </div>
  );
}
