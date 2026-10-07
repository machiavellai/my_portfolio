import type { ReactNode } from 'react';

export type SectionProps = {
  id: string;
  number: string; // '01'
  title: string; // 'Work'
  children: ReactNode;
  // The hero's label isn't a heading: the hero's h1 is its heading, and an h2 before
  // the page's h1 would break the heading order.
  variant?: 'default' | 'hero';
  // One-shot entrance on first view (motion.md). Off for the hero (first screen, the
  // LCP) and for sections that animate their own children instead (Work's stagger).
  enter?: boolean;
};

/**
 * One homepage section with its rail label. At lg the label is positioned by grid
 * into the 200px rail column and sticks; below lg it sits inline above the content
 * as "01 / Work". DOM order is visual order at every width (accessibility.md).
 *
 * RailObserver sets `data-active` on the section in view; the label shows it with
 * weight and colour only — no sliding indicator (motion.md, declined).
 */
export function Section({ id, number, title, children, variant = 'default', enter = variant !== 'hero' }: SectionProps) {
  const labelText = `${number} / ${title}`;
  const labelClass =
    'mb-7 font-mono text-rail font-normal uppercase text-ink-600 md:mb-9 lg:sticky lg:top-14 lg:mb-0 lg:self-start group-data-active/section:font-semibold group-data-active/section:text-ink-900';

  return (
    <section
      id={id}
      data-rail-section=""
      aria-labelledby={variant === 'hero' ? undefined : `${id}-heading`}
      className={`group/section lg:grid lg:grid-cols-rail lg:gap-x-11 ${
        variant === 'hero' ? 'pt-hero-sm pb-12 lg:pt-16 lg:pb-14' : 'py-12 lg:py-14'
      }`}
    >
      {variant === 'hero' ? (
        <p aria-hidden="true" className={labelClass}>
          {labelText}
        </p>
      ) : (
        <h2 id={`${id}-heading`} className={labelClass}>
          {labelText}
        </h2>
      )}
      <div className={enter ? 'enter min-w-0' : 'min-w-0'}>{children}</div>
    </section>
  );
}
