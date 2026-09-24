import { createClient } from '@sanity/client';
import { projectId, dataset, apiVersion } from './env';

// Static generation at build, no client fetching, no ISR — per handoff/README.md.
// useCdn: false because build-time fetches want the freshest content, not the CDN's
// cached copy.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});
