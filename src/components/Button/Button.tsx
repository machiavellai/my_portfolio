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

// Height / padding-x / font, exactly per components.md's size table.
// `sm` is desktop-only (36px is under the 44 touch floor), so below `md` it renders as `md`.
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-11.5 px-5 text-ui md:h-8.5 md:px-3.5 md:text-ui-xs', // 44 / 20 / 15 → 36 / 14 / 13.5
  md: 'h-11.5 px-5 text-ui', // 44 / 20 / 15
  lg: 'h-10.5 px-6.5 text-ui-lg', // 52 / 26 / 17
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
