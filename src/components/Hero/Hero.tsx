import type { HOME_QUERY_RESULT, SITE_SETTINGS_QUERY_RESULT } from '@/sanity/types';
import { Button } from '../Button/Button';
import { MetaStrip } from '../MetaStrip/MetaStrip';
import { MetricCallout } from '../MetricCallout/MetricCallout';
import { Section } from '../Section/Section';

export type HeroProps = {
  home: NonNullable<HOME_QUERY_RESULT>;
  settings: NonNullable<SITE_SETTINGS_QUERY_RESULT>;
};

// Evidence: 2 inline, 3 stacked, 4 as 2×2 at lg — always stacked below md (layouts.md).
const evidenceLayout: Record<number, string> = {
  2: 'flex flex-col gap-2 md:flex-row md:gap-8',
  3: 'flex flex-col gap-2',
  4: 'grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-x-8',
};

/** Meta strip → h1 → evidence → metric callout → CTA (layouts.md "Hero"). */
export function Hero({ home, settings }: HeroProps) {
  // location is optional by the owner's choice; omitted, it simply drops from the strip.
  const meta = [settings.location, settings.timezone, settings.yearsExperience, settings.availability].filter(
    (item): item is string => Boolean(item),
  );

  return (
    <Section id="intro" number="00" title="Intro" variant="hero">
      <div className="flex flex-col gap-8">
        <MetaStrip items={meta} />

        <h1 className="text-balance text-display-sm text-ink-900 md:text-display lg:text-display-lg">{home.headline}</h1>

        {/* Hanging indent, so an over-length item wraps under itself instead of truncating. */}
        <ul className={evidenceLayout[home.evidence.length] ?? evidenceLayout[3]}>
          {home.evidence.map((item) => (
            <li key={item} className="-indent-3.5 pl-3.5 text-body text-ink-700">
              <span aria-hidden="true">— </span>
              {item}
            </li>
          ))}
        </ul>

        <MetricCallout value={home.heroMetric.value} label={home.heroMetric.label} source={home.heroMetric.source} />

        {/* flex-col stretches the button full-width below md; md+ it's intrinsic width. */}
        <div className="flex flex-col md:flex-row">
          <Button href={home.ctaTarget}>{home.ctaLabel}</Button>
        </div>
      </div>
    </Section>
  );
}
