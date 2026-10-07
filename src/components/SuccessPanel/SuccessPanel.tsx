import { useEffect, useRef } from 'react';
import { Link } from '../Link/Link';

export type SuccessPanelProps = {
  email: string | null; // the owner's address, from siteSettings
};

/**
 * Replaces the contact form in place once a message is sent (components.md). Takes
 * focus on mount and announces via role="status". Left 2px success rule, no green fill.
 * Fades in over 200ms (motion.md); instant under reduced motion.
 *
 * Rendered only by ContactForm, which is a client component — this file has no
 * "use client" of its own and isn't meant to be imported from the server.
 */
export function SuccessPanel({ email }: SuccessPanelProps) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panel.current?.focus();
  }, []);

  return (
    <div
      ref={panel}
      role="status"
      tabIndex={-1}
      className="fade-in flex max-w-panel flex-col gap-2 border-l-2 border-success pl-5"
    >
      <p className="text-ui font-semibold text-ink-900">Message sent.</p>
      {/* TODO(content): the spec's copy promises a reply "within one business day, usually
          sooner". Left out until the owner confirms that's true; add it here if so. */}
      {email ? (
        <p className="text-ui text-ink-700">
          If it&apos;s urgent, email me directly at <Link href={`mailto:${email}`}>{email}</Link> — same inbox, no
          form in the way.
        </p>
      ) : null}
    </div>
  );
}
