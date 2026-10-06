import { defineQuery } from 'groq';

// Work index: card fields only. `body` is left out on purpose — it's the heaviest field
// and only the case-study route needs it. Image assets are expanded here so the card
// gets a URL without a second request. Published perspective comes from the client.
export const WORK_INDEX_QUERY = defineQuery(`
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    order,
    featured,
    metric,
    failureMode,
    scope,
    stack,
    liveUrl,
    repoUrl,
    media { alt, image { asset->{ url } } }
  }
`);
