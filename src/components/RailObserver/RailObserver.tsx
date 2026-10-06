'use client';

import { useEffect, useRef } from 'react';

/**
 * The homepage's only client component (handoff/README.md allows two in total: this
 * and the contact form). It renders no visible UI. It does two things, both with
 * IntersectionObserver rather than scroll listeners:
 *
 * 1. Marks the section in view with `data-active`, which Section's rail label reads.
 * 2. Sets `data-scrolled` on <html> once the page is scrolled past 24px, which fades in
 *    the nav's bottom rule (components.md "Nav"). Folded in here rather than a third
 *    client component — approved 2026-10-06.
 *
 * Without JS nothing breaks: no label is marked active and the nav rule stays hidden.
 */
export function RailObserver() {
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-rail-section]'));

    // A section is "in view" when it crosses a thin band just above the viewport's middle.
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const section of sections) {
            section.toggleAttribute('data-active', section === entry.target);
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((section) => sectionObserver.observe(section));

    // The sentinel sits 24px down the document; once it leaves the viewport, we've scrolled past 24px.
    const target = sentinel.current;
    const scrollObserver = new IntersectionObserver(([entry]) => {
      root.toggleAttribute('data-scrolled', entry ? !entry.isIntersecting : false);
    });
    if (target) scrollObserver.observe(target);

    return () => {
      sectionObserver.disconnect();
      scrollObserver.disconnect();
      root.removeAttribute('data-scrolled');
    };
  }, []);

  return <div ref={sentinel} aria-hidden="true" className="pointer-events-none absolute left-0 top-6 h-px w-px" />;
}
