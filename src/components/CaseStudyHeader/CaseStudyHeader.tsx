import { Link } from '../Link/Link';
import { MetricCallout } from '../MetricCallout/MetricCallout';

export type CaseStudyHeaderProps = {
  title: string;
  metric: { value: string; label: string; source: string };
  failureMode: string;
  liveUrl: string | null;
  repoUrl: string | null;
  readingMinutes: number;
};

/**
 * Top of a case study: overline → h1 → metric callout → failure line → links.
 *
 * layouts.md gives the order as h1 → metric → prose and doesn't place the rest. Agreed
 * 2026-10-06: the "Case study · N min read" overline from frame 7l sits above the h1;
 * the failure line sits under the metric, worded as on the card; the live/repo links
 * (moved here from the card in step 4) sit under that. No stack chips or media — the
 * current layout spec lists neither, though older frames (6b, 1e) did.
 */
export function CaseStudyHeader({ title, metric, failureMode, liveUrl, repoUrl, readingMinutes }: CaseStudyHeaderProps) {
  const links = [
    liveUrl ? { href: liveUrl, label: 'Live' } : null,
    repoUrl ? { href: repoUrl, label: 'Repo' } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  return (
    <header className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="font-mono text-rail uppercase text-ink-600">Case study · {readingMinutes} min read</p>
        <h1 className="max-w-prose text-pretty text-h1 text-ink-900">{title}</h1>
      </div>

      <div className="max-w-prose">
        <MetricCallout value={metric.value} label={metric.label} source={metric.source} />
      </div>

      <p className="max-w-prose text-ui-sm text-ink-700">
        <span className="font-semibold text-ink-900">Handled:</span> {failureMode}
      </p>

      {links.length > 0 ? (
        // Standalone link row: 15px block padding so each target clears 44px without the
        // inline-text exception; 20px gap so they don't touch (components.md "Link").
        <ul className="flex flex-wrap gap-x-5">
          {links.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="inline-block py-link-y text-ui">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        // Same wording as the card: never a dead link, never "coming soon".
        <p className="font-mono text-mono text-ink-600">Private — walkthrough on request</p>
      )}
    </header>
  );
}
