import Image from 'next/image';
import NextLink from 'next/link';
import { hasCaseStudy } from '@/sanity/caseStudy';
import type { WORK_INDEX_QUERY_RESULT } from '@/sanity/types';
import { MetricCallout } from '../MetricCallout/MetricCallout';
import { StackChip } from '../StackChip/StackChip';

export type WorkProject = WORK_INDEX_QUERY_RESULT[number];

export type WorkCardProps = {
  project: WorkProject;
  index: number; // 1-based, rendered as the '01' label
  layout?: 'card' | 'row'; // 'row' = tier-2 index line, no media
  sizes?: string; // next/image sizes for the column this card sits in
};

// Below md: 5 chips, then "+N more" — never a third line.
const MOBILE_CHIP_LIMIT = 5;

const label = (index: number) => String(index).padStart(2, '0');

export function WorkCard({ project, index, layout = 'card', sizes = '100vw' }: WorkCardProps) {
  // A project with no case study is an index row, never a dead card (frame 7g).
  if (layout === 'row' || !hasCaseStudy(project)) {
    return <WorkRow project={project} index={index} />;
  }

  const { title, metric, failureMode, scope, stack, liveUrl, repoUrl, media } = project;
  const imageUrl = media?.image.asset?.url;
  const isPrivate = !liveUrl && !repoUrl;
  const hiddenOnMobile = stack.length - MOBILE_CHIP_LIMIT;

  // One <a> wrapping the whole card: one tab stop, and the global focus ring outlines
  // the card. Live and repo links live on the case-study page, not here — a link
  // can't nest inside a link.
  return (
    <NextLink
      href={`/work/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded border border-ink-200 bg-surface transition-colors duration-state ease-state hover:border-ink-400"
    >
      {/* Absent media renders no frame — not an empty box. */}
      {media && imageUrl ? (
        <div className="relative aspect-media w-full border-b border-ink-200">
          <Image src={imageUrl} alt={media.alt} fill sizes={sizes} className="object-cover" />
        </div>
      ) : null}

      {/* Equal height comes from the grid; the body is not stretched, so short cards end early. */}
      <div className="flex flex-col gap-4 p-5 md:p-7">
        <p className="font-mono text-mono text-ink-600">
          {label(index)} · {scope}
        </p>

        <h3 className="line-clamp-2 text-pretty text-h2 text-ink-900 decoration-1 underline-offset-4 group-hover:underline">
          {title}
        </h3>

        {metric ? (
          <>
            <MetricCallout value={metric.value} label={metric.label} source={metric.source} size="inline" />
            <p className="text-ui-sm text-ink-700">
              <span className="font-semibold text-ink-900">Handled:</span> {failureMode}
            </p>
          </>
        ) : (
          // No metric: the failure line promotes into the metric's slot and takes its weight.
          <p className="border-t-2 border-ink-900 pt-4 text-ui text-ink-900">
            <span className="font-semibold">Handled:</span> {failureMode}
          </p>
        )}

        {isPrivate ? (
          <p className="font-mono text-mono text-ink-600">Private — walkthrough on request</p>
        ) : null}

        <ul className="flex flex-wrap gap-2" aria-label="Stack">
          {stack.map((item, i) => (
            <li key={item} className={i >= MOBILE_CHIP_LIMIT ? 'hidden md:block' : undefined}>
              <StackChip>{item}</StackChip>
            </li>
          ))}
          {hiddenOnMobile > 0 ? (
            <li className="md:hidden">
              <StackChip>+{hiddenOnMobile} more</StackChip>
            </li>
          ) : null}
        </ul>
      </div>
    </NextLink>
  );
}

// Tier-2 index line: no media, no metric callout. Links to the case study when one
// exists; otherwise it's plain text and not focusable.
function WorkRow({ project, index }: { project: WorkProject; index: number }) {
  const content = (
    <>
      <span className="font-mono text-mono text-ink-600">{label(index)}</span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="text-ui text-ink-900 decoration-1 underline-offset-4 group-hover:underline">
          {project.title}
        </span>
        <span className="text-ui-sm text-ink-700">
          <span className="font-semibold text-ink-900">Handled:</span> {project.failureMode}
        </span>
      </span>
    </>
  );
  const rowClass = 'flex items-baseline gap-4 border-b border-ink-200 py-4';

  return hasCaseStudy(project) ? (
    <NextLink href={`/work/${project.slug}`} className={`group ${rowClass}`}>
      {content}
    </NextLink>
  ) : (
    <div className={rowClass}>{content}</div>
  );
}
