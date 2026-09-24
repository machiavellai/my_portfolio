// No Sanity project exists for this repo yet — these read from env vars rather than
// hardcoding a project ID, so nothing here is a placeholder pretending to be real
// config. Create the project at sanity.io/manage, then set these in .env.local:
//   NEXT_PUBLIC_SANITY_PROJECT_ID
//   NEXT_PUBLIC_SANITY_DATASET      (defaults to "production")
//   NEXT_PUBLIC_SANITY_API_VERSION  (defaults to today's date, per Sanity convention)

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const projectId = required('NEXT_PUBLIC_SANITY_PROJECT_ID');
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-01-01';
