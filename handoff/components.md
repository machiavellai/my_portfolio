# Component inventory

Eleven components. Design frames: `7e`–`7i` (states), `7l` (edge cases), `8d` (390).
State columns are the contract: if a component has a state below, it must implement it.

Shared rule — **the focus ring is in `tokens.css`**, applied by a `:focus-visible`
selector on every interactive element. No component defines its own ring, and no
component may set `outline: none`.

---

## Button

```ts
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';  // default 'primary'
  size?: 'sm' | 'md' | 'lg';                    // default 'md'
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;                          // true below md for primary actions
} & ({ href: string } | { onClick: () => void; type?: 'button' | 'submit' });
```

| Size | Height | Padding X | Font | Where |
|---|---|---|---|---|
| `sm` | 36px | 14px | 13.5px | **Desktop only.** Under the 44px floor — only for controls with a second path (code-block copy). Never a primary action. |
| `md` | 44px | 20px | 15px | Default everywhere |
| `lg` | 52px | 26px | 17px | Hero CTA at ≥1024 only |

| State | primary | secondary | ghost |
|---|---|---|---|
| default | `bg-ink-900` / white | `bg-surface`, `border-ink-200`, `text-ink-900` | transparent, `text-ink-700` |
| hover | `bg-ink-800` | `bg-sunken`, `border-ink-400` | `bg-sunken`, `text-ink-900` |
| focus-visible | ring (shared) | ring | ring |
| active | `#090d18` | `bg-ink-100` | `bg-ink-100` |
| disabled | `bg-ink-100` / `text-ink-400`, `cursor-not-allowed` | same | same |
| loading | spinner + label, `aria-busy`, width locked to the default label | n/a — never async | n/a — never async |

- `loading` keeps the label ("Sending") so there is no layout shift and the state is
  readable. Reduced motion: spinner does not rotate, label reads "Sending…".
- **Disabled is almost unused on purpose.** Never disable submit to mean "not yet" —
  keep it enabled and answer on submit. Contrast is 2.36:1 (exempt, still unreadable).
- Renders `<a>` when given `href`, `<button>` otherwise. Never a `<div onClick>`.
- `fullWidth` below `md` for the hero CTA and the form submit — that's how mobile
  targets clear 44 without size bumps.

## Link

Inline prose link. `text-accent`, underline 1px at 3px offset → 2px thickness on
hover, `#16308a` hover, `#0f2470` active, shared ring on focus.
`:visited` is unstyled — a half-read portfolio shouldn't look half-used.
External links get a trailing mono `↗` (`aria-hidden`) and `rel="noopener"`.

**Standalone link rows (footer, 404) need 15px block padding** (`py-3` measures 39px) — four links in a flex row don't
get SC 2.5.8's inline-text exception. Gap stays 20px so targets don't touch.

## WorkCard

```ts
type WorkCardProps = {
  project: Project;      // schema.ts
  index: number;         // 1-based, rendered as the '01' label
  layout?: 'card' | 'row';  // 'row' = tier-2 index line, no media
};
```

- **The whole card is one `<a>`** — one tab stop per project, ring outlines the card.
- default → hover (`border-ink-400` + title underline, 120ms) → focus-visible (ring)
  → active (no transform; the browser's own press). No disabled, no loading.
- Media `aspect-[16/10]`, flush to the card edge, `sizes` set for the 3-up column
  (384px at 1200). **Absent media renders no frame** — not an empty box.
- Absent metric: `failureMode` promotes into the metric's slot and takes its weight.
- Absent `liveUrl` and `repoUrl`: renders "Private — walkthrough on request". Never a
  dead link, never "coming soon".
- Title clamps at 2 lines (`line-clamp-2`, `text-wrap: pretty`).
- Cards are equal height by grid but **the body is not stretched** — short cards end
  early. Ragged bottoms over invented spacing.

## StackChip

Static `<span>`. `border-ink-200`, radius 4, `px-2 py-1`, 12px mono, `text-ink-700`.
**One state only** — not a link, not a filter, no hover, no cursor change.
Overflow: 5 chips then `+N more` below `md`, never a third line.
If these ever become filters they inherit Button/ghost's full state set *and* the
border must go `ink-500` (1.4.11).

## MetaStrip

```ts
type MetaStripProps = { items: string[]; as?: 'div' | 'footer' };
```

12px mono, `text-ink-600`, `·` separators with 12px either side. Below `md` it stacks
to label/value pairs and the separators drop.

## MetricCallout

```ts
type MetricCalloutProps = {
  value: string;      // '0', '$0', '1.2s' — a string, never a number
  label: string;
  source: string;     // required. A number without a window is a claim.
  size?: 'hero' | 'inline';
};
```

2px `ink-900` rule above, 40px value (34 on mobile), 15px label, 12px mono source.
Never a box, never a tinted panel. **No count-up** — see `motion.md`.

## CodeBlock

```ts
type CodeBlockProps = { filename: string; language: string; code: string };
```

Filename bar on `surface` with a persistent ghost/`sm` Copy button — **never
hover-revealed**; hover-only controls don't exist for keyboards or touch.
Body on `sunken`, 14px mono, `overflow-x: auto`, never wrapped.
**Two tones only**: comments `ink-600`, everything else `ink-900`. No syntax
highlighting — the code is an argument, not a screenshot of an editor.
Filenames are captions, not headings.

## Nav

Sticky, `bg-paper`, **no backdrop blur**. 64px at ≥`md`, 56px below.
Wordmark (links home) + three section links (ghost, **40px tall**, 15px) + Résumé
(secondary). Bottom hairline fades in after 24px of scroll (120ms, opacity only).
Below `md`: wordmark + Résumé only — **no hamburger**; the homepage is one scroll and
the rail already indexes it. Case-study routes replace the links with "← All work".

## Rail

Client component (the only one on the homepage). At ≥`lg`: 200px column + 64px gap,
sticky, `position: sticky` not scroll listeners where possible.
**Each rail label is its section's `<h2>`** — positioned by grid into the rail, styled
at 10px tracked mono. Active section: weight + colour change, **no sliding indicator**.
Below `lg` the label renders inline above its section as `01 / Work`.

## FormField

```ts
type FormFieldProps = {
  name: string; label: string; hint?: string; error?: string;
  type?: 'text' | 'email' | 'textarea'; required?: boolean;
};
```

Visible `<label>` always — placeholders are examples, never labels.
44px height, `border-ink-500` (4.26:1), radius 6, 15px.

| State | Treatment |
|---|---|
| empty | `border-ink-500`, placeholder `ink-600` |
| hover | `border-ink-600` |
| focus-visible | `border-accent` + shared ring |
| validating | spinner inside the field, hint reads "Checking the domain…". **On blur only, never per keystroke** |
| error | `border-danger` at 1.5px **and** the message — never colour alone |

`aria-describedby` points at one node that holds the hint *or* the error, so the
description never grows. Error node is `role="alert"`, field gets `aria-invalid`.
Submit re-validates everything and moves focus to the first invalid field.
**No per-field success ticks.**

## SuccessPanel

Replaces the form in place. `role="status"`, receives focus. Left 2px `success` rule,
no green fill. Includes the direct email address — "same inbox, no form in the way".

## Footer

Hairline rule, then: meta strip, a link row (`py-3` each), and `lastUpdated` from the
CMS — a content date, not a build timestamp. 64px block padding, 48 below `md`.

---

## Build first

`tokens.css` → `Button` + `Link` + the ring → `WorkCard`. Six components consume the
ring; get it right once.
