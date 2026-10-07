import NextLink from 'next/link';
import { Button } from '../Button/Button';

export type NavProps = {
  name: string;
  resumeUrl: string | null;
  // Case-study routes replace the section links with a single "← All work" (step 6).
  variant?: 'home' | 'case-study';
};

// Section links are ghost-style and 40px tall at 15px — accepted at 40, not 44
// (accessibility.md: 2.5.8 AA is 24×24). They only exist at md and up.
const sectionLinkClass =
  'inline-flex h-9 items-center rounded px-3 text-ui text-ink-700 transition-colors duration-state ease-state hover:bg-sunken hover:text-ink-900 active:bg-ink-100';

const SECTION_LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

/**
 * Sticky, page-coloured, no backdrop blur. 64px at md+, 56px below with the wordmark
 * and Résumé only — no hamburger. The bottom rule fades in once RailObserver sets
 * `data-scrolled` (opacity only, 120ms; the global reduced-motion block removes the fade).
 */
export function Nav({ name, resumeUrl, variant = 'home' }: NavProps) {
  return (
    <header className="sticky top-0 z-10 bg-paper px-6 md:px-8 lg:px-10">
      <nav aria-label="Primary" className="mx-auto flex h-nav-sm max-w-container items-center justify-between gap-4 md:h-11">
        {/* The wordmark is never the h1 (accessibility.md). */}
        <NextLink href="/" className="rounded text-ui font-semibold text-ink-900">
          {name}
        </NextLink>

        <div className="flex items-center gap-2">
          {variant === 'home' ? (
            <ul className="hidden items-center gap-1 md:flex">
              {SECTION_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={sectionLinkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            // Lands on the work index, not the top of the homepage. Below md it's hidden
            // with the other links (spec); the wordmark is the way home there. Hidden on
            // a wrapper: sectionLinkClass sets inline-flex, which would override `hidden`.
            <div className="hidden md:block">
              <NextLink href="/#work" className={sectionLinkClass}>
                ← All work
              </NextLink>
            </div>
          )}
          {/* No résumé uploaded: the button drops rather than linking nowhere. */}
          {resumeUrl ? (
            <Button href={resumeUrl} variant="secondary">
              Résumé (PDF)
            </Button>
          ) : null}
        </div>
      </nav>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 border-b border-ink-200 opacity-0 transition-opacity duration-state ease-state in-data-scrolled:opacity-100"
      />
    </header>
  );
}
