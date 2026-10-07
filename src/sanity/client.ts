import { createClient } from '@sanity/client';
import { projectId, dataset, apiVersion } from './env';

// Server-only by convention: import this from Server Components and build-time code
// (generateStaticParams, page data loaders), never from a "use client" file.
// Static generation at build, no client fetching, no ISR — per handoff/README.md.
//
// - useCdn: false — fetches only happen at build, which wants the freshest published
//   content rather than the CDN's cached copy.
// - perspective: 'published' — explicit, so drafts can never reach the site even if
//   a token is added later. The dataset is public, so no token is configured.
//
// Freshness: Next stores fetch results from static pages in .next/cache/fetch-cache
// for a year and reuses them on the next build, so a publish would never reach the
// site. `npm run clean:fetch-cache` runs before every build and dev start to force
// fresh reads. Not `cache: 'no-store'` here — that would make the pages dynamic.
// Relies on Next's internal cache path; re-check it on Next upgrades.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
});
