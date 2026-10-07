export type MetricCalloutProps = {
  value: string; // '0', '$0', '1.2s' — a string, never a number
  label: string;
  source: string; // required — a number without a window is a claim
  size?: 'hero' | 'inline';
};

// Never a box, never a tinted panel. No count-up (see handoff/motion.md).
export function MetricCallout({ value, label, source, size = 'hero' }: MetricCalloutProps) {
  return (
    <div
      className={
        size === 'hero'
          ? 'flex flex-col gap-2 border-t-2 border-ink-900 pt-4'
          : 'flex flex-row flex-wrap items-baseline gap-x-3 gap-y-1 border-t-2 border-ink-900 pt-4'
      }
    >
      <span className="text-metric-sm text-ink-900 md:text-metric">{value}</span>
      <span className="text-ui text-ink-900">{label}</span>
      {/* Inline: the source drops to its own line so a long window can't overflow a card. */}
      <span className={`font-mono text-mono text-ink-600 ${size === 'inline' ? 'basis-full' : ''}`}>{source}</span>
    </div>
  );
}
