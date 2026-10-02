# Motion spec

Design frames: `7j` (accepted), `7k` (declined).

Rule: **motion confirms an interaction or eases a transition. Nothing else.**
Everything below is under a quarter second except the one spinner.

| What animates | Duration | Easing / property | prefers-reduced-motion |
|---|---|---|---|
| Button, card, link, field — hover + active | 120ms | `cubic-bezier(.2,0,.2,1)` · background, border, colour | unchanged — colour only, no transform |
| Focus ring | **0ms** | none; `outline`, untransitioned | unchanged — a ring that fades in is a ring that arrives late |
| Section entrance — fade + 8px rise, **once**, on first view | 220ms | `cubic-bezier(0,0,.2,1)` · opacity, translateY | no animation, and **no initial `opacity: 0`** |
| Stagger within an entering group — max 3 children | 60ms | delay only, capped at 180ms total | dropped entirely |
| Work index row expand in place | 200ms | `cubic-bezier(.2,0,.2,1)` · `grid-template-rows: 0fr → 1fr` | instant open |
| Form → success panel crossfade | 200ms | `cubic-bezier(.2,0,.2,1)` · opacity | instant swap; focus move and `role="status"` unchanged |
| Route change (home ⇄ case study) | 160ms | `cubic-bezier(0,0,.2,1)` · opacity out only | instant; scroll restoration and heading focus unchanged |
| Loading spinner — the only looping motion in the design | 900ms | linear · rotate, infinite | rotation off, label becomes "Sending…" |

## Two rules behind the table

1. **Nothing animates on scroll position** except the single one-shot entrance. No
   scroll-linked anything — scroll-linked motion makes a scanner's own speed the
   animation's timeline.
2. **Reduced motion never removes information.** Every fallback keeps the
   announcement, the focus move, and the visible state. It removes only the travel.

## Implementation notes

- Entrance is opt-in: the observer adds `data-shown="true"` to elements carrying
  `.enter`, and `.enter` itself is reduced-motion-neutralised in `tokens.css`.
  **Content must never ship at `opacity: 0` waiting for JS that may not run.**
- Anchor jumps from the rail use `scroll-behavior: smooth` wrapped in the same media
  query, so a reduced-motion reader gets an instant jump.
- The global `prefers-reduced-motion` block in `tokens.css` is a safety net, not the
  design — each component still declares its own fallback so the intent is local.

## Declined — do not re-propose

| Proposal | Declined because |
|---|---|
| **Count-up on the hero metric** | The first screen's whole job is that number, and a count-up withholds it for 800ms from the one reader who came to see it. It animates from a value that was never true and re-fires on scroll back. |
| **Spotlight / cursor glow on cards** | Pointer-only: invisible to keyboard and touch, so it decorates the experience of the audience least likely to need help. Costs a rAF loop per card. |
| **Marquee of stack logos** | There are no client logos — it would be a marquee of framework marks, which is a list pretending to be momentum. |
| **Media zoom / lift on card hover** | Implies depth this design doesn't have (no shadows, no layers) and moves the screenshot the reader is trying to read. |
| **Sliding active-section indicator on the rail** | The nicest one on the list, and still no: the active section is already carried by weight and colour, so the slide animates a state the eye has read. Also needs a layout measurement on scroll — the only one on the page. |
| **Skeleton shimmer** | Nothing fetches on the client. It would animate a wait that doesn't happen. |
| **Typewriter headline · animated gradient · parallax hero** | One reason for all three: each costs the reader time to buy the author personality, on a page whose argument is that the author doesn't spend other people's time. |
