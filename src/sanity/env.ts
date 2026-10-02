// No Sanity project exists for this repo yet — the project ID is read from env rather
// than hardcoded, so nothing here is a placeholder pretending to be real config.
// Create the project at sanity.io/manage, then set in .env.local:
//   NEXT_PUBLIC_SANITY_PROJECT_ID
//   NEXT_PUBLIC_SANITY_DATASET      (optional, defaults to "production")
//
// Each variable is read with a static `process.env.NAME` expression, not a dynamic
// `process.env[name]` lookup: Next.js only inlines NEXT_PUBLIC_* values it can see
// statically at build time.

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const projectId = required(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
);
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

// Pinned, not read from env and not "today's date": the API version fixes query
// semantics, so changing it is a deliberate code change reviewed like any other.
export const apiVersion = '2026-10-01';
