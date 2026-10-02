# Portfolio — build handoff

Static portfolio for a senior full-stack engineer. Primary audience: hiring managers
scanning for reliability and failure-handling. Secondary: contract clients.

Design source of truth: `Portfolio Wireframes.dc.html` in this project. Frame ids
(`7a`, `8i`, …) referenced throughout these docs are anchors in that file.

**Frames `7b` and `7d` are authoritative for geometry**, `8i` for the schema, `9b` for
the prose measure. Earlier frames record how those decisions moved and are deliberately
not redrawn — do not lift a number from one.

## Stack

- **Next.js App Router**, TypeScript strict.
- **RSC by default.** Exactly two client components exist: the rail's active-section
  observer and the contact form. Nothing else needs `"use client"`. If you find
  yourself adding a third, check whether it's actually state or just a CSS state.
- **Tailwind**, config in `tailwind.config.ts`. Every value in it comes from the
  design system — if a component needs a number that isn't in the theme, that's a
  design bug, not a config gap. Raise it rather than inlining an arbitrary value.
- **Sanity** for content, `schema.ts`. Static generation at build; no client fetching,
  no ISR needed for a portfolio. `generateStaticParams` over published projects.
- **Fonts**: IBM Plex Sans (variable, wght 400/500/600) + IBM Plex Mono (400, 600
  static) via `next/font/local`. ~84 KB total, identical on every route. Two families,
  no third. Do not add a serif.

## Routes

| Route | Rendering | Notes |
|---|---|---|
| `/` | RSC, static | Five sections: hero, work, experience, about, contact |
| `/work/[slug]` | RSC, static | Two templates (long/short) chosen by body length |
| `/api/contact` | Route handler | The only server mutation |
| `not-found.tsx` | Static | 404 |
| `error.tsx` | Client (required by Next) | 500 |

## Build order

Do it in this order. Each step is safe to stop at.

1. **Tokens, Tailwind config, fonts.** Everything built before this gets redone.
2. **Button, Link, focus ring.** The ring is one utility shared by six components.
3. **Sanity schema + one real project document.** Real content before layout — the
   edge cases only bite with real strings.
4. **WorkCard, then the work index** at 3 and 6 items.
5. **Page shell**: nav, rail, footer, section rhythm.
6. **Case-study route**, short template first — most projects will use it.
7. **Contact form.** Only stateful component, only route handler.
8. **404, 500, motion, dark theme.** Dark theme is a token swap; if it becomes
   component work, something upstream hardcoded a colour.

## Non-negotiables

- **Focus-visible ring on every interactive element.** 2px `--ink-accent` at 2px
  offset, via `outline`, never `box-shadow`. Never removed on `:focus`.
- **No spacing value outside the scale** in `tailwind.config.ts`.
- **Prose measure is `59ch`**, never a px cap — it must scale with text-only zoom.
  68ch counted 84 characters per line; 59ch counts 70-75 (frame `9b`). Code blocks stay
  660px and step out of the measure, flush left.
- **`prefers-reduced-motion` fallback for every animation**, and no element ships at
  `opacity: 0` waiting for an animation that may never run.
- **Alt text is required** on every image field in the CMS. No exceptions, no defaults.
- **No `scrollIntoView`**, no scroll-linked animation, no count-up on the metrics.

## Assets still needed (not in this bundle)

- 4 project screenshots, 16:10, 2× (≥1536×960), with alt text per `accessibility.md`.
- Résumé PDF.
- Real metric values with their date windows.
- Real code excerpts for case-study code blocks — invented code in a portfolio
  arguing for reliability is the one thing a technical reader will catch.
