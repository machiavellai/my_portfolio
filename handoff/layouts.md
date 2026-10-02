# Layout specs

Design frames: `7b` (rules), `7c` (measured), `8d` (390), `8f` (breakpoints),
`8g` (768 + 1024), `8h` (1920), `5d` (1440).

## Breakpoints

Four, all Tailwind defaults, one unused. **There is no custom breakpoint.** The 900px
rail threshold from earlier drafts was dropped in frame `8f` — it bought a 124px
window and cost every rail rule a bespoke variant.

| Range | Tailwind | What changes |
|---|---|---|
| `< 768` | base | One column. 24px gutters. Rail → inline numbered overline. Buttons full-width. Evidence stacked. Nav 56px (wordmark + Résumé only). Section padding 72. Card padding 20. Meta strip stacks. |
| `≥ 768` | `md` | 6-col grid, 32px gutters. Cards 2-up. Nav 64px + three links. Buttons intrinsic width. Card padding 28. Meta strip one row. |
| `≥ 1024` | `lg` | 12-col grid, 48px gutters. **Sticky rail appears** (200 + 64 gap, content restarts at 936). Evidence 2×2 at 4 items. Section padding 112. Hero top 128. |
| `≥ 1280` | `xl` | Nothing. Declared, unused. |
| `≥ 1440` | — | Nothing changes; container stops at 1200 and page padding becomes `(100vw − 1200) / 2`. |

## Container

```
padding-inline: max(var(--gutter), (100vw - 1200px) / 2)
```

Never a bare `mx-auto` with no floor. Media may exceed the container to 1440px on
case-study routes only, for a full-bleed diagram. Nothing else breaks 1200.

## Vertical rhythm

| Gap | Desktop | Mobile |
|---|---|---|
| Section block padding | 112 | 72 |
| Hero top (nav is 64 above it) | 128 | 80 |
| Section label → first content | 40 | 28 |
| Between cards / index rows | 24 | 24 |
| Between prose paragraphs | 32 | 32 |
| Card interior (all four sides) | 28 | 20 |
| Footer block padding | 64 | 48 |

Sections are separated by **padding, not margin**, so a hairline rule can sit on the
boundary without collapsing. **Nothing centres vertically** — no `min-h-screen`, no
`place-items-center` on a section. The first screen is a top-aligned document.

At the page edge on mobile a card reads 24 outside / 20 inside. That is the only
nested spacing pair in the design and it is intentional.

## Homepage

Sections in order: hero → work → experience → about (stack inside) → contact.
Writing and Code sections exist in the schema and render `null` when empty.

**Hero.** Meta strip (12px mono) → h1 → evidence → metric callout → CTA.
Headline 30/40/52px at base/`md`/`lg`. Evidence: 2 inline, 3 stacked, 4 as 2×2 at
`lg`, always hanging indent (`pl-3.5 -indent-3.5`) so over-length items wrap under
themselves rather than being truncated.

**Work.** At 3 projects: one column of three equal rows, **no tier split** — three
full cards plus a "more work" heading advertises the shortfall. Tier 2 appears at 5+.
At 6: 2 featured cards (2-up) + 4 index rows under an "Also shipped" label. Holds to
8; past that it paginates rather than growing a third tier.
Card column at 1200 3-up = 384px, media 240px tall (measured, frame `7c`).

Prose is `59ch` = 602px. At `lg` the content column is 936px, so 334px sits unused to the
right of the measure — **leave it empty.** No margin notes, no pull-quotes, no sidebar.
The only thing that may use it is a full-bleed figure to 1440px. Code blocks are 660px and
are the one element wider than the prose column; they align flush left and scroll.

**Experience.** One line per role, no prose, no cards, no logos. Not focusable.

**About.** Prose at `59ch` + stack chips grouped by area. Chips are a wrapping row on the
full content column, not inside the measure.

**Contact.** Intro line, then name / email / message / submit. Submit full-width
below `md`.

## Case study — `/work/[slug]`

Two templates, chosen by body length, not by a CMS toggle.

**Long.** h1 → metric callout → prose at 59ch with `h2` sections (The problem / What
I did / What broke / Result) → code blocks and figures inline → next-project link.
Sticky ToC in the rail column at `lg` only.

**Short (two paragraphs).** h1 → metric callout → two paragraphs → optional code
block. **No ToC, no sidebar, no section headings** — a ToC over two paragraphs is
furniture. Floor for a route to exist: title + metric + failure line + 2 paragraphs +
one code block or figure. Below that the project stays an index row with no link.

Nav on this route replaces the section links with a single "← All work".

## 404 / 500

Page shell with the case-study nav variant. h1 is the single sentence. 404 offers
three links (All work / Home / Email me); 500 offers two and names the fault as its
own. No illustration, no oversized numeral, no joke.

## Zoom and reflow

- 1280 at 200% = 640 CSS px → serves the base layout. Nothing lost, no sideways scroll.
- 1.4.10 reflow holds at 320 CSS px. The code block is the only non-reflowing element
  and is explicitly exempt; it scrolls in its own box, never the page.
- Prose is in `ch` specifically so text-only zoom grows the column instead of the
  line count.
