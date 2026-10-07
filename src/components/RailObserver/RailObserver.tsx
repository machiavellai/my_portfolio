'use client';

import { useEffect, useRef } from 'react';

/**
 * The homepage's only client component (handoff/README.md allows two in total: this
 * and the contact form). It renders no visible UI. It does three things, all with
 * IntersectionObserver rather than scroll listeners:
 *
 * 1. Marks the section in view with `data-active`, which Section's rail label reads.
 * 2. Sets `data-scrolled` on <html> once the page is scrolled past 24px, which fades in
 *    the nav's bottom rule (components.md "Nav"). Folded in here rather than a third
 *    client component — approved 2026-10-06.
 * 3. Runs the one-shot section entrance (motion.md): `.enter` elements below the fold at
 *    load are marked `data-pending` (hidden by globals.css) and get `data-shown` when they
 *    scroll into view. Only when motion is allowed, and never for anything already on
 *    screen at load — so the hero never fades and nothing is hidden before JS runs.
 *
 * Without JS nothing breaks: no label is marked active, the nav rule stays hidden, and
 * every section is simply visible.
 *
 * Also mounted on case-study routes, which have no rail sections — there it only
 * drives the nav rule.
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

    const enterObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-shown', '');
          enterObserver.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    const pending: HTMLElement[] = [];
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      for (const element of document.querySelectorAll<HTMLElement>('.enter')) {
        if (element.hasAttribute('data-shown') || element.getBoundingClientRect().top < window.innerHeight) continue;
        element.setAttribute('data-pending', '');
        pending.push(element);
        enterObserver.observe(element);
      }
    }

    return () => {
      sectionObserver.disconnect();
      scrollObserver.disconnect();
      enterObserver.disconnect();
      pending.forEach((element) => element.removeAttribute('data-pending'));
      root.removeAttribute('data-scrolled');
    };
  }, []);

  return <div ref={sentinel} aria-hidden="true" className="pointer-events-none absolute left-0 top-6 h-px w-px" />;
}
