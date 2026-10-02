// One set of variables for the site, the Sanity CLI and the hosted Studio. The Studio
// only receives SANITY_STUDIO_* values; the site reads them server-side at build,
// where Next.js exposes every env var. Set in .env.local and in Vercel (see .env.example).
//
// Static `process.env.NAME` reads, not `process.env[name]`, so bundlers can replace them.

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const projectId = required(process.env.SANITY_STUDIO_PROJECT_ID, 'SANITY_STUDIO_PROJECT_ID');
export const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';

// Pinned, not read from env and not "today's date": the API version fixes query
// semantics, so changing it is a deliberate code change reviewed like any other.
export const apiVersion = '2026-10-01';
