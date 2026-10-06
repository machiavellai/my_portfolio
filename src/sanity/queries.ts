import { defineQuery } from 'groq';

// Work index: card fields only. `body` is left out on purpose — it's the heaviest field
// and only the case-study route needs it. Image assets are expanded here so the card
// gets a URL without a second request. Published perspective comes from the client.
//
// paragraphCount / evidenceCount feed the case-study floor (src/sanity/caseStudy.ts).
// The same two expressions are in CASE_STUDY_QUERY — keep them identical, or the card
// and the route can disagree about whether a page exists.
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
    media { alt, image { asset->{ url } } },
    "paragraphCount": count(body[_type == "block" && style == "normal" && length(pt::text(@)) > 0]),
    "evidenceCount": count(body[_type in ["codeBlock", "figure"]])
  }
`);

// One case study by slug: the header fields plus the full body. Figure assets are
// expanded to a URL, as on the card.
export const CASE_STUDY_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    metric,
    failureMode,
    liveUrl,
    repoUrl,
    "paragraphCount": count(body[_type == "block" && style == "normal" && length(pt::text(@)) > 0]),
    "evidenceCount": count(body[_type in ["codeBlock", "figure"]]),
    body[] {
      ...,
      _type == "figure" => { image { asset->{ url } } }
    }
  }
`);

// Singletons live at fixed IDs (sanity.config.ts). The résumé is resolved to its CDN
// URL so the nav and footer can link straight to the PDF.
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    name,
    location,
    timezone,
    yearsExperience,
    availability,
    email,
    githubUrl,
    linkedinUrl,
    "resumeUrl": resumeFile.asset->url,
    lastUpdated
  }
`);

export const HOME_QUERY = defineQuery(`
  *[_type == "home" && _id == "home"][0] {
    headline,
    evidence,
    heroMetric,
    ctaLabel,
    ctaTarget,
    about,
    stack[] { _key, group, items },
    contactIntro
  }
`);

export const ROLES_QUERY = defineQuery(`
  *[_type == "role"] | order(order asc) {
    _id,
    title,
    company,
    start,
    end,
    summary
  }
`);
