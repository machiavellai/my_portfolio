import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonBase = {
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
};

// Deliberately stricter than components.md's ButtonProps, which puts loading/disabled
// on links and requires onClick on submit:
// - Links take neither loading nor disabled. A disabled <a> still takes focus and still
//   navigates — a broken affordance, not a state.
// - Submit is driven by the parent form's onSubmit, so onClick is optional there.
// - Loading is primary-only: the state table marks it "n/a — never async" for the rest.
type LinkProps = { href: string; variant?: ButtonVariant; onClick?: never; type?: never; loading?: never; disabled?: never };
type ActionProps = { href?: never; onClick: () => void; type?: 'button' };
type SubmitProps = { href?: never; onClick?: () => void; type: 'submit' };
type LoadingProps = { variant?: 'primary'; loading?: boolean } | { variant: 'secondary' | 'ghost'; loading?: never };

export type ButtonProps = ButtonBase &
  (LinkProps | ((ActionProps | SubmitProps) & LoadingProps & { disabled?: boolean }));

// Height/padding/font per components.md's size table, mapped onto tailwind.config.ts's
// scale. `md` lands exactly on scale values (44 is the a11y-floor spacing.11.5, 20 is
// spacing.5, 15 is the `ui` fontSize). `sm` and `lg` do not: the spec's own numbers
// (36/14px/13.5px and 52/26px/17px) aren't reachable from the scale, so these round to
// the nearest existing token rather than introduce arbitrary values. Flagged for review.
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-ui-sm', // spec: 36px / 14px / 13.5px
  md: 'h-11.5 px-5 text-ui',
  lg: 'h-12 px-7 text-ui-lg', // spec: 52px / 26px / 17px
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-ink-900 text-white hover:bg-ink-800 active:bg-ink-950',
  secondary: 'bg-surface border border-ink-200 text-ink-900 hover:border-ink-400 hover:bg-sunken active:bg-ink-100',
  ghost: 'bg-transparent text-ink-700 hover:bg-sunken hover:text-ink-900 active:bg-ink-100',
};

const disabledClasses = 'disabled:bg-ink-100 disabled:text-ink-400 disabled:cursor-not-allowed disabled:hover:bg-ink-100 disabled:border-ink-100';

const base =
  'inline-flex items-center justify-center gap-2 rounded whitespace-nowrap transition-colors duration-state ease-state';

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      className="spinner h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  ...rest
}: ButtonProps) {
  const className = [base, sizeClasses[size], variantClasses[variant], disabledClasses, fullWidth ? 'w-full' : '']
    .filter(Boolean)
    .join(' ');

  if (rest.href !== undefined) {
    return (
      <a href={rest.href} className={className}>
        {children}
      </a>
    );
  }

  const { onClick } = rest;

  // Loading blocks repeat clicks (and the form submit they'd trigger) without the native
  // `disabled` attribute: that would swap in the grey disabled styles, which the spec's
  // loading state doesn't use, and drop keyboard focus off a button the user just pressed.
  return (
    <button
      type={rest.type ?? 'button'}
      onClick={(event) => {
        if (loading) {
          event.preventDefault();
          return;
        }
        onClick?.();
      }}
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      className={className}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}
