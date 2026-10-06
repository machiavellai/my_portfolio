import type { ROLES_QUERY_RESULT } from '@/sanity/types';
import { Section } from '../Section/Section';

export type ExperienceProps = {
  roles: ROLES_QUERY_RESULT;
};

// Role dates are stored as YYYY-MM-DD; read them in UTC so a timezone can't shift the month.
const monthYear = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const formatDate = (date: string) => monthYear.format(new Date(date));

/**
 * One line per role — no prose, no cards, no logos. Not focusable: these are text,
 * so they add no tab stops (accessibility.md).
 */
export function Experience({ roles }: ExperienceProps) {
  return (
    <Section id="experience" number="02" title="Experience">
      <ol className="flex flex-col border-t border-ink-200">
        {roles.map((role) => (
          <li key={role._id} className="flex flex-col gap-1 border-b border-ink-200 py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-ui text-ink-900">
                <span className="font-semibold">{role.title}</span> · {role.company}
              </p>
              <p className="font-mono text-mono text-ink-600">
                <time dateTime={role.start}>{formatDate(role.start)}</time>
                {' – '}
                {role.end ? <time dateTime={role.end}>{formatDate(role.end)}</time> : 'Present'}
              </p>
            </div>
            <p className="text-ui-sm text-ink-700">{role.summary}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
