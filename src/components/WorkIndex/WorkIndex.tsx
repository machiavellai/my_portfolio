import { hasCaseStudy } from '@/sanity/caseStudy';
import { WorkCard, type WorkProject } from '../WorkCard/WorkCard';

export type WorkIndexProps = {
  projects: WorkProject[]; // already sorted by `order`
};

// Tier 2 (index rows under "Also shipped") appears at 5+ projects (layouts.md).
const TIER_TWO_FROM = 5;

// next/image sizes. The content column is 936px at lg (1200 − 200 rail − 64 gap);
// 2-up cards split it around the 24px card gap.
const SIZES_FULL = '(min-width: 1024px) 936px, 100vw';
const SIZES_HALF = '(min-width: 1024px) 456px, (min-width: 768px) 50vw, 100vw';

/**
 * Layout by count — layouts.md "Work", plus the rules agreed where it's silent:
 *   1     one full-width card (schema: a lone featured card never sits in half a row)
 *   2, 4  cards 2-up from md
 *   3     one column of three — spec: "no tier split"
 *   5–8   featured cards 2-up, then everything else as rows under "Also shipped"
 * A lone card left in a 2-up row spans the full row. Projects without a case study
 * are always rows (WorkCard handles that), never dead cards.
 *
 * TODO(content): past 8 the spec paginates. Not built — it needs a route decision
 * (?page or /work/page/[n]) and there's one project today. Until then 9+ render as rows.
 */
export function WorkIndex({ projects }: WorkIndexProps) {
  // The spec defines no empty state for Work; like Writing and Code, render nothing.
  if (projects.length === 0) return null;

  const linkable = projects.filter((p) => hasCaseStudy(p));
  const tiered = projects.length >= TIER_TWO_FROM;

  let cards: WorkProject[];
  if (tiered) {
    const featured = linkable.filter((p) => p.featured);
    // No project flagged featured: fall back to the first two by order.
    cards = featured.length > 0 ? featured : linkable.slice(0, 2);
  } else {
    cards = linkable;
  }
  // Everything not shown as a card — including every project without a case study.
  const rows = projects.filter((p) => !cards.includes(p));

  const singleColumn = cards.length === 1 || (!tiered && cards.length === 3);
  const sizes = singleColumn ? SIZES_FULL : SIZES_HALF;

  // Labels number projects in display order: cards first (1..n), then rows.
  // The section and its "01 / Work" label come from Section (page.tsx).
  return (
    <div className="flex flex-col gap-6">
      {cards.length > 0 ? (
        // Entrance: cards fade in one after another, 60ms apart, capped at three steps (motion.md).
        <div className={`enter-stagger grid grid-cols-1 gap-6 ${singleColumn ? '' : 'md:grid-cols-2'}`}>
          {cards.map((project, i) => {
            const lonelyLast = !singleColumn && cards.length % 2 === 1 && i === cards.length - 1;
            return (
              <div key={project._id} className={lonelyLast ? 'enter md:col-span-2' : 'enter'}>
                <WorkCard project={project} index={i + 1} sizes={lonelyLast ? SIZES_FULL : sizes} />
              </div>
            );
          })}
        </div>
      ) : null}

      {rows.length > 0 ? (
        <div className="enter flex flex-col gap-4">
          {tiered ? (
            <h3 className="font-mono text-rail uppercase text-ink-600">Also shipped</h3>
          ) : null}
          <div className="flex flex-col border-t border-ink-200">
            {rows.map((project, i) => (
              <WorkCard key={project._id} project={project} index={cards.length + i + 1} layout="row" />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
