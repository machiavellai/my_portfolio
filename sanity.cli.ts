import { defineCliConfig } from 'sanity/cli';

// The Sanity CLI loads .env files into process.env before reading this file, so the
// same SANITY_STUDIO_* variables that sanity.config.ts uses are available here.
// projectId is left undefined when unset rather than defaulted: commands that need a
// project fail with the CLI's own error instead of silently targeting a wrong one.
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  // Hosted Studio at https://victor-oghene-portfolio.sanity.studio. The appId is a
  // public identifier, not a secret; it stops `sanity deploy` prompting for one.
  deployment: {
    appId: 'lw1ctno2dskofbtovsig7f5u',
  },
  typegen: {
    path: './src/**/*.{ts,tsx}',
    schema: './schema.json',
    generates: './src/sanity/types.ts',
  },
});
