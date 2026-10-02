# Accessibility requirements

Target: **WCAG 2.2 AA**. Design frames: `6e` (measured contrast), `8a` (audit ledger),
`8b` (scope), `8c` (focus order + headings), `8d`/`8e` (390 targets, zoom).

All contrast ratios below were computed from WCAG 2.1 relative luminance in the design
file, not estimated. Re-measure if any colour changes.

## Requirements — treat as acceptance criteria

**Contrast**
- Body prose `ink-700` on paper: 9.58:1. Meta/rail `ink-600` on paper: 6.50:1.
- Accent `#1e3fa8` for links and the ring only: 8.62:1 on paper, 9.01:1 on surface.
- **Code comments are `ink-600`, not `ink-500`.** `ink-500` measured 3.90:1 on the
  sunken fill — a 1.4.3 failure. Fixed.
- **Field borders are `ink-500` (4.26:1).** Velli's line colour `#d4d6dd` measures
  1.45:1 and cannot identify a control (1.4.11). Hover goes `ink-600`.
- `ink-400` is **decorative only** — 2.74:1. Never text, never a control boundary.
- Card and chip borders keep `ink-200` and are exempt: a card is identified by its
  content, a chip is static text. **If chips become filters, their border must go
  `ink-500`** or that exemption dies.
- Disabled label is 2.36:1 — exempt under 1.4.3, and the design reaches for disabled
  almost nowhere, so the exemption is never load-bearing.

**Focus**
- Ring: 2px `--accent`, 2px offset, `outline` (not `box-shadow` — outline survives
  forced-colors mode). Declared once in `tokens.css`.
- `:focus-visible` only. **Never `:focus { outline: none }`.**
- `scroll-margin-top: 80px` on every anchor target so the 64px sticky nav can't
  obscure a focused element (2.4.11).
- Dark theme ring is `#93a8ff`, measured against both dark grounds in frame 6e.

**Focus order** (frame `8c`)
1. Skip to content (hidden until focused) → 2. wordmark → 3–5. section links →
6. Résumé → 7. hero CTA → 8+. work cards, **one stop per card** → form fields →
submit → footer links.
- Experience rows have no tab stops — they're text.
- **DOM order is visual order at every width.** The rail is positioned by grid, never
  reordered, so no breakpoint needs a different tab sequence.
- The rail links *are* the nav links. There is no second copy.

**Headings** (1.3.1)
- One `h1` per route: the hero headline on home, the project title on a case study,
  the single sentence on 404/500. **Never the wordmark.**
- **Each rail label is its section's `<h2>`** — not a decorative string beside an
  unlabelled section. Rail typography is h2 styling here; the hierarchy is carried by
  position, not size.
- Project titles are `h3` on home, `h1` on their own route.
- Code-block filenames are captions, **not headings**.

**Targets** (2.5.8 — 24px minimum; 44px is the floor this design holds on mobile)
- **Desktop nav links are 40px and that is accepted**, not a gap: 2.5.8 AA is 24x24, and
  44 is 2.5.5 AAA, which is not this build's target. The 64px nav is worth more than 4px.
- Every target at 390 clears 44. Two shapes do the work: buttons go full-width, and
  the footer's link column uses 15px block padding with 24px between rows — so no two
  targets sit within 24px of each other and the spacing exception isn't needed.
- **Standalone link rows need 15px block padding.** Four links in a flex row do not get the
  inline-text exception. This was a real failure at 36×19 (and still 39px at `py-3`); fixed at 45px.
- `sm` buttons (36px) are desktop-only and only for controls with a second path.

**Forms** (3.3.1, 3.3.2, 4.1.3)
- Visible `<label>` on every field. Placeholders are examples, never labels.
- `aria-describedby` points at **one** node holding the hint *or* the error, so the
  description never grows.
- Error node is `role="alert"`; field gets `aria-invalid`. Error carries a 1.5px
  `danger` border **and** the message — never colour alone.
- Error text names the fix, not the rule: "that domain doesn't resolve", not
  "invalid email".
- Validation on **blur**, never per keystroke; re-validate on submit and move focus to
  the first invalid field.
- Success panel is `role="status"`, replaces the form in place, and receives focus.

**Images** (1.1.1)
- Alt is a **required** CMS field on every image. There are no decorative images in
  this design, so an empty alt is always a deliberate authoring choice.
- Card media: describe what the screen shows, not that it's a screenshot.
- Figures: describe the content; if the caption already does, `alt=""` and let the
  caption carry it — never both, never "image of".
- Diagrams: alt names the relationship, caption names the conclusion.

**Zoom / reflow** (1.4.4, 1.4.10, 1.4.12)
- 1280 at 200% = 640 CSS px → base layout, no horizontal scroll.
- Reflow holds at 320 CSS px. The code block is the documented exemption and scrolls
  in its own box.
- Prose is `59ch` (602px, 70-75 counted characters per line), never a px cap, so text-only
  zoom grows the column.
- No fixed-height text containers, no `vh` typography, no `!important` line-heights.

**Other**
- Skip link is the first focusable element (2.4.1).
- Nothing drags (2.5.7). Nothing times out or auto-advances (2.2.1, 2.2.2).
- The same email link appears in every footer, in the same place (3.2.6).

## Not done — do not claim these

- **AAA is not the target.** Prose already passes 1.4.6 at 9.58:1; `ink-600` meta at 6.50:1
  does not, and raising it flattens the two-tone hierarchy the design runs on.
- **Screen-reader testing** — NVDA/Firefox and VoiceOver/Safari against the built
  site. The markup contract above is written to be testable; it isn't tested.
- **Forced-colors mode** is designed for (outline over shadow, no colour-only meaning)
  but not verified.
- **The résumé PDF** has its own tagging requirements and will be the least accessible
  thing the site links to.
