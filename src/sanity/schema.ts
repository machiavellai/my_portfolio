import { defineType, defineField, defineArrayMember } from 'sanity';

/**
 * Authoritative content model — reconciled against the finished design in frame 8i.
 *
 * Two fields from earlier turns are deliberately absent because nothing renders them:
 *   - project.summary  (replaced by failureMode in turn 3)
 *   - home.subhead     (orphaned when the hero went to headline + evidence)
 * Do not re-add them. If a field here has no home in the design, that's a bug.
 *
 * Alt text is a required sibling of every image. There are no decorative images in
 * this design, so an empty alt is always a deliberate authoring choice, never a default.
 *
 * KNOWN UNRECONCILED GAPS (reported, not patched — see build notes):
 *   - project.scope is required here but no component in components.md or
 *     handoff/layouts.md renders it anywhere (WorkCard's own field list omits it).
 *   - handoff/layouts.md says "Writing and Code sections exist in the schema and
 *     render null when empty" — only `writing` exists below. There is no `code`
 *     document type at all.
 */

const mediaImage = defineField({
  name: 'media',
  title: 'Media',
  type: 'object',
  description: 'Cropped to 16:10 on upload. Absent: the card renders with no media frame.',
  fields: [
    defineField({ name: 'image', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alt text',
      description:
        'Describe what the screen shows, not that it is a screenshot. Good: "the reconciliation dashboard showing zero flagged charges". Bad: "screenshot of dashboard".',
      validation: (r) => r.required().min(10).error('Alt text is required on every image.'),
    }),
  ],
});

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'location', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'timezone', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'yearsExperience', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'availability', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'email', type: 'string', validation: (r) => r.required().email() }),
    // Omitted -> the link drops. Never render a placeholder social link.
    defineField({ name: 'githubUrl', type: 'url' }),
    defineField({ name: 'linkedinUrl', type: 'url' }),
    defineField({ name: 'resumeFile', type: 'file', validation: (r) => r.required() }),
    defineField({
      name: 'lastUpdated',
      type: 'date',
      description: 'Shown in the footer. A content date, not a build timestamp.',
      validation: (r) => r.required(),
    }),
  ],
});

export const home = defineType({
  name: 'home',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({ name: 'headline', type: 'string', title: 'Hero headline (h1)', validation: (r) => r.required() }),
    defineField({
      name: 'evidence',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description:
        '2 renders inline on one line, 3 stacks, 4 goes 2x2 at >=1024. Above 4 a list of strengths is a list of none.',
      validation: (r) => r.required().min(2).max(4),
    }),
    defineField({
      name: 'heroMetric',
      type: 'object',
      fields: [
        defineField({ name: 'value', type: 'string', description: 'A string: "0", "$0", "1.2s".', validation: (r) => r.required() }),
        defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
        // Promoted to required in frame 8i: the most load-bearing credibility line on
        // the page must not be the one an author can skip.
        defineField({
          name: 'source',
          type: 'string',
          description: 'The window the number is true in. e.g. "Stripe ledger reconciliation, Mar 2025 - May 2026".',
          validation: (r) => r.required(),
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({ name: 'ctaLabel', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'ctaTarget', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'about', type: 'array', of: [defineArrayMember({ type: 'block', styles: [{ title: 'Body', value: 'normal' }] })], validation: (r) => r.required() }),
    defineField({
      name: 'stack',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'group', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'items', type: 'array', of: [defineArrayMember({ type: 'string' })], validation: (r) => r.required().min(1) }),
          ],
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: 'contactIntro', type: 'string', validation: (r) => r.required() }),
  ],
});

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Clamps at 2 lines on the card above roughly 64 characters.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      description:
        'Only generate a slug when the case-study floor is met: title + metric + failureMode + 2 paragraphs + one code block or figure. Below that the project stays an index row with no route.',
    }),
    defineField({ name: 'order', type: 'number', validation: (r) => r.required() }),
    defineField({
      name: 'featured',
      type: 'boolean',
      initialValue: false,
      description:
        'Drives the index tier. At exactly 1 featured project the layout renders it full-width instead of leaving half a 2-up row — handled in code, not content.',
    }),
    defineField({
      name: 'metric',
      type: 'object',
      description: 'Absent: failureMode promotes into this slot and takes its weight.',
      fields: [
        defineField({ name: 'value', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'source', type: 'string', validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: 'failureMode',
      type: 'string',
      title: 'Failure mode handled',
      description: 'The "Handled:" line — the card\'s real argument. e.g. "webhook replay, refund-after-download".',
      validation: (r) => r.required(),
    }),
    // KNOWN GAP: required by this schema, but no component in components.md or
    // handoff/layouts.md renders it anywhere. Reported, not removed — see file header.
    defineField({
      name: 'scope',
      type: 'string',
      options: { list: ['Solo', 'Team of 2', 'Team of 3', 'Team of 5', 'Team of 8+'] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'stack',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Shows 5 then "+N more" below 768. Must not break at 1.',
      validation: (r) => r.required().min(1),
    }),
    mediaImage,
    defineField({ name: 'liveUrl', type: 'url' }),
    defineField({
      name: 'repoUrl',
      type: 'url',
      description: 'Both URLs absent: the card reads "Private — walkthrough on request". Never a dead link.',
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        defineArrayMember({ type: 'block', styles: [{ title: 'Body', value: 'normal' }, { title: 'Section (h2)', value: 'h2' }] }),
        defineArrayMember({
          type: 'object',
          name: 'codeBlock',
          fields: [
            defineField({ name: 'filename', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'language', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'code', type: 'text', rows: 12, validation: (r) => r.required() }),
          ],
        }),
        defineArrayMember({
          type: 'object',
          name: 'figure',
          fields: [
            defineField({ name: 'image', type: 'image', validation: (r) => r.required() }),
            defineField({
              name: 'alt',
              type: 'string',
              description:
                'Describe the content. If the caption already does, use "" and let the caption carry it — never both. For diagrams: alt names the relationship, caption names the conclusion.',
              validation: (r) => r.required(),
            }),
            defineField({ name: 'caption', type: 'string' }),
          ],
        }),
      ],
      description:
        'Two paragraphs is a valid case study — the short template drops the ToC, sidebar and section headings.',
    }),
    // readingMinutes is computed at build from body length. Do not author it.
  ],
  orderings: [{ title: 'Index order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
});

export const role = defineType({
  name: 'role',
  title: 'Role',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'company', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'start', type: 'date', validation: (r) => r.required() }),
    defineField({ name: 'end', type: 'date', description: 'Empty means current.' }),
    defineField({
      name: 'summary',
      type: 'string',
      description: 'One sentence. There is deliberately no prose field on a role.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'order', type: 'number', validation: (r) => r.required() }),
  ],
});

/**
 * Defined, renders nothing today — kept on purpose from turn 2. Both sections return
 * null when empty rather than rendering an empty state.
 *
 * handoff/layouts.md refers to this and a sibling "Code" section together ("Writing
 * and Code sections exist in the schema..."). Only `writing` actually exists — there
 * is no `code` document type. Reported, not invented.
 */
export const writing = defineType({
  name: 'writing',
  title: 'Writing',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'url', type: 'url', validation: (r) => r.required() }),
    defineField({ name: 'published', type: 'date', validation: (r) => r.required() }),
  ],
});

export const schemaTypes = [siteSettings, home, project, role, writing];
