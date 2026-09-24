import type { ReactNode } from 'react';

export type StackChipProps = {
  children: ReactNode;
};

// Static — one state only. If chips ever become filters they inherit Button/ghost's
// full state set and the border must move to ink-500 (see accessibility.md, 1.4.11).
export function StackChip({ children }: StackChipProps) {
  return (
    <span className="inline-block rounded-sm border border-ink-200 px-2 py-1 text-mono font-mono text-ink-700">
      {children}
    </span>
  );
}
