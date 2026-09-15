# CLAUDE.md

Project rules for this repo. Read before starting any task.

## What this is

Personal portfolio site. Next.js App Router, TypeScript, Tailwind, Sanity for content.
Primary audience: hiring managers evaluating senior full-stack engineering roles.
Secondary: contract clients.

The design was produced in Claude Design and handed off as a spec. **The spec is the source of truth for layout, tokens, and states.** Where the spec and your instinct disagree, follow the spec and flag the disagreement rather than silently improving it.

## Hard rules

### Content
- **Never invent content.** No placeholder project names, no fabricated metrics, no lorem ipsum, no example copy that looks real. If content is missing, render the empty state defined in the spec or leave a `TODO(content):` comment. A fake metric that ships is worse than a blank.
- All display content comes from Sanity. The only hardcoded strings are section labels, nav labels, and UI microcopy (button text, form validation messages).
- Never fabricate numbers in metric callouts, ever, including during development.

### Types
- `strict: true`. No `any`. If a type is genuinely unknown, use `unknown` and narrow.
- No `@ts-ignore` or `@ts-expect-error` without a comment explaining why and what would remove it.
- Sanity query results get explicit types. Don't rely on inference from untyped GROQ.
- Props interfaces are exported when the component is used outside its own file.

### Design tokens
- Every colour, spacing value, font size, radius, and duration comes from the Tailwind theme config generated from the design tokens.
- **No arbitrary values** (`w-[347px]`, `text-[#3a3a3a]`, `mt-[13px]`). If a value you need isn't in the scale, stop and ask — either the scale is wrong or the layout is.
- No inline styles except where a value is genuinely dynamic at runtime.

### Accessibility
The design passed a WCAG 2.2 AA audit. Don't regress it.
- Every interactive element has a visible `focus-visible` state matching the spec. Never `outline: none` without a replacement.
- Semantic HTML first. A `<button>` before a `div` with onClick. One `<h1>` per page, no skipped heading levels.
- Form inputs have visible labels — not placeholder-as-label. Errors are associated via `aria-describedby`.
- Every image needs alt text from a CMS field. Decorative images get `alt=""`.
- All motion respects `prefers-reduced-motion`.
- Touch targets ≥44px at mobile.

### Components
- Server Components by default. `"use client"` only when a component needs state, effects, or browser APIs — and push it as far down the tree as possible.
- One component per file. Colocate a component's types with it.
- No component library. Build from the spec's component inventory.
- Handle every state the spec defines: default, hover, focus-visible, active, disabled, loading, empty, error. A component that only handles the happy path isn't done.

## Working style

### Scope
- Do what was asked. Don't add features, refactor adjacent code, or "improve" things outside the task.
- If you notice a real problem outside scope, mention it and wait. Don't fix it uninvited.
- Don't create files that weren't asked for — no extra READMEs, no summary docs, no example files.

### When something is ambiguous
Ask. Do not guess and proceed. A wrong assumption compounds across a build, and an unanswered question costs one message.

### Verification
- Run `npx tsc --noEmit` and the linter before saying a task is complete.
- Never report something as working that you haven't run. If you couldn't verify it, say so plainly.
- If you introduce a dependency, say why and what the alternative was.

### Honesty
- If an approach you took has a downside, name it. Don't present a tradeoff as a clean win.
- If a request seems wrong, push back before implementing it rather than after.
- If something is half-working, say it's half-working.

## Commits

- Conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, `style:`, `docs:`.
- One logical change per commit. Don't bundle unrelated work.
- Message says what changed and why, not a list of files.
- No co-author trailers, no attribution lines.
- Never commit unless asked.
- Never force push, never rewrite history, never commit secrets or `.env`.

## Performance

This site's LCP is a text hero. Protect it.
- Fonts load via `next/font`. Plex Serif is route-scoped to `/work/[slug]` — never move it to the root layout.
- All images go through `next/image` with explicit dimensions. No CLS.
- No client-side data fetching for content that could be fetched on the server.
- Before adding a client-side library, check whether the same thing can be done server-side or with CSS.

## Order of work

Follow the implementation order in the handoff spec. Build primitives before compositions — tokens, then base components, then sections, then pages.

## Definition of done

A task is done when: it matches the spec, types pass, lint passes, every state in the spec is handled, accessibility requirements hold, and you've actually run it. Not before.
