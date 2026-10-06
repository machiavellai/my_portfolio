import { Section } from '../Section/Section';

export type ContactProps = {
  intro: string;
};

/** Intro line, then the form. */
export function Contact({ intro }: ContactProps) {
  return (
    <Section id="contact" number="04" title="Contact">
      <p className="max-w-prose text-body text-ink-700">{intro}</p>
      {/* TODO(step 7): name / email / message / submit form — the second client component. */}
    </Section>
  );
}
