import { CopyButton } from './CopyButton';

export type CodeBlockProps = {
  filename: string;
  language: string;
  code: string;
};

// TODO: components.md calls for two tones (comments ink-600, everything else
// ink-900). Parked per decision 2026-09-15 — real syntax highlighting via Shiki at
// build time is coming in a later pass (a dependency decision, not this one).
// Single-tone (ink-900) until then; do not regex a comment-detector in as a stopgap.
export function CodeBlock({ filename, language, code }: CodeBlockProps) {
  return (
    <div className="max-w-code rounded-lg border border-ink-200">
      <div className="flex items-center justify-between rounded-t-lg bg-surface px-4 py-2">
        <span className="font-mono text-mono text-ink-600">{filename}</span>
        <CopyButton code={code} />
      </div>
      <pre className="overflow-x-auto rounded-b-lg bg-sunken p-4">
        <code className="whitespace-pre font-mono text-code text-ink-900" data-language={language}>
          {code}
        </code>
      </pre>
    </div>
  );
}
