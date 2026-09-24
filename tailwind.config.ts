import type { Config } from 'tailwindcss';

/**
 * Every value here is from the design system. Nothing is a Tailwind default that
 * happens to look close. Spacing scale: frame 7a. Breakpoints: frame 8f.
 *
 * `content` globs point at `src/` — the handoff draft assumed a root `app/`, this
 * repo scaffolds with `src/`.
 */
export default {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    // Replaces, not extends — the defaults are the main source of drift.
    screens: {
      md: '768px',
      lg: '1024px',
      xl: '1280px', // declared because Tailwind ships it; no rule in this design uses it
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      // Ink ramp. 900 is display + primary fill, 700 body, 600 meta, 500 field border,
      // 400 is decorative only (fails 3:1 on white — see accessibility.md).
      ink: {
        950: '#090d18', // NOT in handoff/tokens.css — see Button `active`/primary. Flagged.
        900: 'var(--ink-900)',
        800: 'var(--ink-800)',
        700: 'var(--ink-700)',
        600: 'var(--ink-600)',
        500: 'var(--ink-500)',
        400: 'var(--ink-400)',
        300: 'var(--ink-300)',
        200: 'var(--ink-200)',
        100: 'var(--ink-100)',
      },
      paper: 'var(--paper)', // page background
      surface: 'var(--surface)', // cards, inputs
      sunken: 'var(--sunken)', // code blocks
      // Base accent is the CSS var (themeable). hover/active are components.md's
      // literal hex values for the Link component — not in handoff/tokens.css as a
      // ramp, and not redefined for dark theme there either.
      // BLOCKED 2026-09-15: this is a palette gap in the design spec, not an
      // implementation question — reusing these light-mode blues on a dark ground is
      // likely a contrast failure. Do not invent dark values here; taken back to the
      // design spec. Dark theme currently falls back to these light-mode hex codes.
      accent: {
        DEFAULT: 'var(--accent)',
        hover: '#16308a',
        active: '#0f2470',
      },
      success: 'var(--success)',
      warn: 'var(--warn)',
      danger: 'var(--danger)',
      info: 'var(--info)',
      white: '#ffffff',
    },
    fontFamily: {
      sans: ['var(--font-plex-sans)', 'system-ui', 'sans-serif'],
      mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
    },
    // [size, { lineHeight, letterSpacing, fontWeight }]
    fontSize: {
      'display-lg': ['3.25rem', { lineHeight: '1.08', letterSpacing: '-0.024em', fontWeight: '500' }], // 52 — hero, >=1024
      display: ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.022em', fontWeight: '500' }], // 40 — hero, 768
      'display-sm': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.022em', fontWeight: '500' }], // 30 — hero, mobile
      h1: ['1.6875rem', { lineHeight: '1.25', letterSpacing: '-0.02em', fontWeight: '500' }], // 27 — case study title
      h2: ['1.1875rem', { lineHeight: '1.3', letterSpacing: '-0.015em', fontWeight: '500' }], // 19 — card title
      metric: ['2.5rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '500' }], // 40 — callout number
      'metric-sm': ['2.125rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '500' }], // 34 — mobile
      prose: ['1.0625rem', { lineHeight: '1.75', fontWeight: '400' }], // 17 — body prose at 59ch
      body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }], // 16 — evidence, intros
      ui: ['0.9375rem', { lineHeight: '1.5', fontWeight: '400' }], // 15 — buttons md, labels, metric label
      'ui-lg': ['1.0625rem', { lineHeight: '1.5', fontWeight: '400' }], // 17 — button lg only. Not in handoff/tailwind.config.ts; added so the lg button label is visibly larger than md, per spec intent (components.md's own 17px, UI line-height/weight rather than borrowing `prose`'s serif-adjacent 1.75).
      'ui-sm': ['0.875rem', { lineHeight: '1.55', fontWeight: '400' }], // 14 — failure line, nav
      caption: ['0.8125rem', { lineHeight: '1.5', fontWeight: '400' }], // 13 — form label, hint, error
      mono: ['0.75rem', { lineHeight: '1.6', fontWeight: '400' }], // 12 — meta strip, chips, source line
      code: ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }], // 14 — code blocks
      rail: ['0.625rem', { lineHeight: '1', letterSpacing: '0.17em', fontWeight: '600' }], // 10 — rail label (an h2)
    },
    // Frame 7a. No 56, no 96 — deliberate. See README.
    // 11.5 (44px) added: the WCAG target-size floor used verbatim by Button `md`
    // height and FormField height. Not on the 8px rhythm; kept as its own step
    // rather than folded into 40 or 48. Flagged — see build notes.
    spacing: {
      0: '0',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '28px',
      8: '32px',
      9: '40px',
      10: '48px',
      11: '64px',
      11.5: '44px',
      12: '72px',
      14: '112px',
      16: '128px',
      full: '100%',
    },
    borderRadius: { none: '0', sm: '4px', DEFAULT: '6px', md: '6px', lg: '8px', full: '9999px' },
    borderWidth: { 0: '0', DEFAULT: '1px', 1.5: '1.5px', 2: '2px' },
    maxWidth: {
      container: '1200px', // the only container width
      content: '936px', // 1200 - 200 rail - 64 gap
      prose: '59ch', // 602px / 70-75 counted chars in Plex Sans 17 (frame 9b)
      media: '1440px', // full-bleed diagram, case studies only
      panel: '52ch',
      // Not reconciled against `prose` (59ch / 602px) in the handoff — implemented
      // verbatim per handoff/README.md, flagged rather than resolved.
      code: '660px',
    },
    aspectRatio: { media: '16 / 10' }, // every card + figure image. Cropped on upload.
    transitionDuration: {
      state: '120ms', // hover, active — colour and border only
      enter: '220ms', // one-shot section entrance
      expand: '200ms', // index row expand, form/success crossfade
      route: '160ms',
      spin: '900ms',
    },
    transitionTimingFunction: {
      state: 'cubic-bezier(0.2, 0, 0.2, 1)',
      enter: 'cubic-bezier(0, 0, 0.2, 1)',
    },
    extend: {
      outlineWidth: { ring: '2px' },
      outlineOffset: { ring: '2px' },
    },
  },
  plugins: [],
} satisfies Config;
