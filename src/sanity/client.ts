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
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
});
