import type { Heading } from '@/sanity/caseStudy';

export type CaseStudyContentsProps = {
  headings: Heading[];
};

/**
 * Long template only: the sticky ToC in the rail column, at lg and up (layouts.md).
 * Below lg it isn't rendered — the spec has no ToC there.
 *
 * Plain anchor links with no active-section highlight: the spec doesn't ask for one,
 * and it would need client JavaScript. Smooth scrolling and its reduced-motion fallback
 * come from globals.css, as do the 80px scroll margins that keep each heading clear of
 * the sticky nav. Comes first in the DOM, as the rail does on the homepage, so DOM
 * order matches what's on screen.
 */
export function CaseStudyContents({ headings }: CaseStudyContentsProps) {
  if (headings.length === 0) return null;

  return (
    <nav aria-label="Contents" className="hidden lg:sticky lg:top-14 lg:flex lg:flex-col lg:gap-3">
      {/* The nav's aria-label already names it; this is the visible label. */}
      <p aria-hidden="true" className="font-mono text-rail uppercase text-ink-600">
        Contents
      </p>
      <ul className="flex flex-col">
        {headings.map((heading) => (
          <li key={heading.id}>
            {/* 14px text + 4px block padding ≈ 30px tall: clears 2.5.8's 24px. Desktop only. */}
            <a
              href={`#${heading.id}`}
              className="inline-block rounded py-1 text-ui-sm text-ink-700 decoration-1 underline-offset-4 transition-colors duration-state ease-state hover:text-ink-900 hover:underline"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
