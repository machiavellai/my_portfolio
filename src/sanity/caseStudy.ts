/**
 * Case-study rules shared by the work index and the /work/[slug] route.
 */

type Metric = { value: string; label: string; source: string };

export type FloorFields = {
  slug: string | null;
  metric: Metric | null;
  failureMode: string;
  paragraphCount: number | null;
  evidenceCount: number | null;
};

/**
 * The floor for a route to exist (layouts.md "Case study"): title + metric + failure
 * line + 2 paragraphs + one code block or figure. Below it the project stays an index
 * row with no link. Checked in code as well as in the slug field's description, so a
 * slug added too early can't make the homepage link to a 404 — the card and the route
 * both use this one function. Title is required by the schema, so it isn't re-checked.
 */
export function hasCaseStudy<T extends FloorFields>(project: T): project is T & { slug: string; metric: Metric } {
  return (
    Boolean(project.slug) &&
    project.metric !== null &&
    project.failureMode.trim() !== '' &&
    (project.paragraphCount ?? 0) >= 2 &&
    (project.evidenceCount ?? 0) >= 1
  );
}

// Structural subset of a Portable Text body — enough for the rules below, without tying
// them to one query's generated type.
type BodyItem = {
  _type: string;
  _key: string;
  style?: string;
  children?: Array<{ text?: string }>;
};

type TextBlock = BodyItem & { _type: 'block' };

const isTextBlock = (item: BodyItem): item is TextBlock => item._type === 'block';
const blockText = (block: TextBlock) => (block.children ?? []).map((child) => child.text ?? '').join('');

export type CaseStudyTemplate = 'short' | 'long';

/**
 * layouts.md: "two templates, chosen by body length", with no threshold given. Agreed
 * reading (2026-10-06): any h2 means long. The short template has no section headings,
 * so it can't render a body that has them; a long one without them has an empty ToC.
 */
export function templateFor(body: BodyItem[]): CaseStudyTemplate {
  return body.some((item) => isTextBlock(item) && item.style === 'h2') ? 'long' : 'short';
}

// Not given in the spec — agreed 2026-10-06. Prose words only; code isn't read at
// prose speed and figures have no words.
const WORDS_PER_MINUTE = 200;

/** schema.ts: "readingMinutes is computed at build from body length. Do not author it." */
export function readingMinutes(body: BodyItem[]): number {
  const words = body
    .filter(isTextBlock)
    .map(blockText)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export type Heading = { key: string; id: string; text: string };

// `main` is the skip link's target on every route.
const RESERVED_IDS = ['main'];

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Every h2 in the body with a stable anchor id from its text, for the ToC links and
 * the headings themselves. Duplicate headings get -2, -3… so no two share an id.
 */
export function headingsOf(body: BodyItem[]): Heading[] {
  const used = new Set(RESERVED_IDS);
  const headings: Heading[] = [];

  for (const item of body) {
    if (!isTextBlock(item) || item.style !== 'h2') continue;
    const text = blockText(item).trim();
    if (text === '') continue;

    const base = slugify(text) || 'section';
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);

    headings.push({ key: item._key, id, text });
  }
  return headings;
}
