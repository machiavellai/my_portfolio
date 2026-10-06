import NextLink from 'next/link';
import type { ReactNode } from 'react';

export type LinkProps = {
  href: string;
  children: ReactNode;
  // Layout only (e.g. standalone link rows' block padding). Never colour or type.
  className?: string;
};

const EXTERNAL_HREF = /^https?:\/\//;

// Underline offset per spec is 3px; Tailwind's default underline-offset scale only
// steps 0/1/2/4/8, so this rounds up to 4px rather than using an arbitrary value.
const linkClass =
  'text-accent underline decoration-1 underline-offset-4 hover:text-accent-hover hover:decoration-2 active:text-accent-active visited:text-accent';

export function Link({ href, children, className: layoutClass }: LinkProps) {
  const className = layoutClass ? `${linkClass} ${layoutClass}` : linkClass;

  if (EXTERNAL_HREF.test(href)) {
    return (
      <a href={href} rel="noopener" className={className}>
        {children}
        <span aria-hidden="true" className="font-mono">
          {' '}
          ↗
        </span>
      </a>
    );
  }

  return (
    <NextLink href={href} className={className}>
      {children}
    </NextLink>
  );
}
