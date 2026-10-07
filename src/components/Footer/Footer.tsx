import type { SITE_SETTINGS_QUERY_RESULT } from '@/sanity/types';
import { Link } from '../Link/Link';
import { MetaStrip } from '../MetaStrip/MetaStrip';

export type FooterProps = {
  settings: NonNullable<SITE_SETTINGS_QUERY_RESULT>;
};

const monthYear = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/**
 * Hairline rule, then: meta strip, a link row, and lastUpdated — a content date from
 * the CMS, not a build timestamp. The email link is in the same place in every footer
 * (3.2.6). Omitted social links drop rather than render a placeholder.
 */
export function Footer({ settings }: FooterProps) {
  const meta = [settings.location, settings.timezone, settings.availability].filter((item): item is string =>
    Boolean(item),
  );

  const links = [
    { href: `mailto:${settings.email}`, label: 'Email' },
    settings.githubUrl ? { href: settings.githubUrl, label: 'GitHub' } : null,
    settings.linkedinUrl ? { href: settings.linkedinUrl, label: 'LinkedIn' } : null,
    settings.resumeUrl ? { href: settings.resumeUrl, label: 'Résumé (PDF)' } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  return (
    <footer className="border-t border-ink-200 px-6 md:px-8 lg:px-10">
      <div className="mx-auto flex max-w-container flex-col gap-6 py-10 md:py-11">
        <MetaStrip items={meta} />

        {/* Standalone link row: 15px block padding so the targets clear 2.5.8 without the
            inline-text exception; 20px gap so they don't touch (components.md "Link"). */}
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5">
            {links.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="inline-block py-link-y text-ui">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="font-mono text-mono text-ink-600">
          Last updated <time dateTime={settings.lastUpdated}>{monthYear.format(new Date(settings.lastUpdated))}</time>
        </p>
      </div>
    </footer>
  );
}
