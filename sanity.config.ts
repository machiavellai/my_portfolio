import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schema';

// Hosted Studio (`sanity deploy`), not embedded in the Next app. The Studio is built
// by the Sanity CLI, which only exposes SANITY_STUDIO_* variables to this file — the
// same variables src/sanity/env.ts reads for the site.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';

if (!projectId) {
  throw new Error('Missing environment variable: SANITY_STUDIO_PROJECT_ID');
}

// siteSettings and home are singletons (frame 8i). Each lives at a fixed document ID
// equal to its type name, cannot be created from the "new document" menu, and keeps
// only the actions that edit the one document in place — no duplicate, delete or
// unpublish, any of which would leave the site with zero or two of them.
const singletonTypes = new Set(['siteSettings', 'home']);
const singletonActions = new Set(['publish', 'discardChanges', 'restore']);

export default defineConfig({
  name: 'default',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site settings')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem()
              .title('Homepage')
              .id('home')
              .child(S.document().schemaType('home').documentId('home')),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => !singletonTypes.has(item.getId() ?? '')),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action !== undefined && singletonActions.has(action))
        : input,
  },
});
