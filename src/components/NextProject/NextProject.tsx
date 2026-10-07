import { Link } from '../Link/Link';

export type NextProjectProps = {
  slug: string;
  title: string;
};

/**
 * Long template only: the closing link to the next case study by index order
 * (layouts.md). The page renders nothing when there's no next one — no wrap-around
 * to the first, no placeholder.
 */
export function NextProject({ slug, title }: NextProjectProps) {
  return (
    <nav aria-label="Next case study" className="flex flex-col gap-1 border-t border-ink-200 pt-6">
      <p className="font-mono text-rail uppercase text-ink-600">Next case study</p>
      {/* Standalone link: 15px block padding so the target clears 44px (components.md "Link"). */}
      <Link href={`/work/${slug}`} className="self-start py-link-y text-ui">
        {title} →
      </Link>
    </nav>
  );
}
