import { ContactForm } from '../ContactForm/ContactForm';
import { Section } from '../Section/Section';

export type ContactProps = {
  intro: string;
  email: string | null; // the owner's address, for the send-error and success messages
};

/** Intro line, then the form (layouts.md "Contact"). */
export function Contact({ intro, email }: ContactProps) {
  return (
    <Section id="contact" number="04" title="Contact">
      <div className="flex flex-col gap-8">
        <p className="max-w-prose text-body text-ink-700">{intro}</p>
        <ContactForm email={email} />
      </div>
    </Section>
  );
}
