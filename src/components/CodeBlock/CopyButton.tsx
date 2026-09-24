'use client';

import { useState } from 'react';
import { Button } from '../Button/Button';

export type CopyButtonProps = {
  code: string;
};

// The one bit of real interactivity in CodeBlock — isolated here so CodeBlock itself
// stays a Server Component. Not one of the "exactly two client components" the
// handoff README names (rail observer, contact form); flagged as a third.
export function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        void navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </Button>
  );
}
