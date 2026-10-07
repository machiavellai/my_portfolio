'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button } from '../Button/Button';
import { FormField } from '../FormField/FormField';
import { Link } from '../Link/Link';
import { SuccessPanel } from '../SuccessPanel/SuccessPanel';
import { checkEmailDomain, sendContact } from './contactApi';

export type ContactFormProps = {
  email: string | null; // the owner's address, from siteSettings
};

type Field = 'name' | 'email' | 'message';
type Errors = Partial<Record<Field, string>>;
type Status = 'idle' | 'sending' | 'failed' | 'sent';

const FIELDS: Field[] = ['name', 'email', 'message'];
const NAME_MAX = 100;
const MESSAGE_MAX = 5000;
// Shape only: something@something.tld. Whether the domain takes mail is the server's job.
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Error text names the fix, not the rule (accessibility.md).
function validate(field: Field, raw: string): string | undefined {
  const value = raw.trim();
  switch (field) {
    case 'name':
      if (!value) return 'Add your name so I know who to reply to.';
      if (value.length > NAME_MAX) return `Keep it under ${NAME_MAX} characters.`;
      return undefined;
    case 'email':
      if (!value) return 'Add an email so I can reply.';
      if (!EMAIL_SHAPE.test(value)) return "That doesn't look like a full address — check for a missing @ or domain.";
      return undefined;
    case 'message':
      if (!value) return 'Add a message — even a line is enough.';
      if (value.length > MESSAGE_MAX) return `That's over ${MESSAGE_MAX.toLocaleString('en')} characters — trim it, or email me directly.`;
      return undefined;
  }
}

const DOMAIN_ERROR = "That domain doesn't resolve — typo, or should I use a different address?";

/**
 * Contact form: name → email → message → submit (layouts.md "Contact"). The second and
 * last client component the spec allows.
 *
 * - Validates on blur (only once a field has a value or is already showing an error, so
 *   tabbing past an empty field doesn't scold), and re-validates everything on submit,
 *   moving focus to the first invalid field.
 * - Submit is never disabled; "not yet" is answered on submit (components.md).
 * - Fields are uncontrolled, so a failed send keeps everything the reader typed.
 * - Server calls go through contactApi.ts, which is stubbed until Resend is set up.
 */
export function ContactForm({ email }: ContactFormProps) {
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [checkingDomain, setCheckingDomain] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  // Only the latest domain check may report back.
  const domainCheck = useRef(0);

  const valueOf = (field: Field): string => {
    const element = form.current?.elements.namedItem(field);
    return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement ? element.value : '';
  };

  const setError = (field: Field, error: string | undefined) =>
    setErrors((current) => ({ ...current, [field]: error }));

  // true: domain accepts mail, or it couldn't be checked (let a real person through).
  const domainOk = async (address: string): Promise<boolean> => {
    const run = ++domainCheck.current;
    setCheckingDomain(true);
    const result = await checkEmailDomain(address.trim());
    if (run !== domainCheck.current) return true;
    setCheckingDomain(false);
    return result !== false;
  };

  const handleBlur = async (field: Field) => {
    const value = valueOf(field);
    if (!value.trim() && !errors[field]) return;

    const error = validate(field, value);
    setError(field, error);
    if (field === 'email' && !error && !(await domainOk(value))) setError('email', DOMAIN_ERROR);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;

    const next: Errors = {};
    for (const field of FIELDS) next[field] = validate(field, valueOf(field));
    if (!next.email && !(await domainOk(valueOf('email')))) next.email = DOMAIN_ERROR;
    setErrors(next);

    const firstInvalid = FIELDS.find((field) => next[field]);
    if (firstInvalid) {
      const element = form.current?.elements.namedItem(firstInvalid);
      if (element instanceof HTMLElement) element.focus();
      return;
    }

    setStatus('sending');
    const result = await sendContact({
      name: valueOf('name').trim(),
      email: valueOf('email').trim(),
      message: valueOf('message').trim(),
    });
    // null: the server isn't wired yet (contactApi.ts) — by choice, nothing happens.
    setStatus(result ?? 'idle');
  };

  if (status === 'sent') return <SuccessPanel email={email} />;

  const sending = status === 'sending';

  return (
    // method="post": if someone submits before this hydrates (slow network, no JS), the
    // browser's native submit must not put their name, email and message in the URL.
    // TODO(server): add action="/api/contact" so a no-JS submit reaches the handler.
    <form ref={form} method="post" noValidate onSubmit={handleSubmit} className="flex max-w-panel flex-col gap-6">
      <FormField name="name" label="Name" required autoComplete="name" error={errors.name} onBlur={() => void handleBlur('name')} />
      {/* TODO(content): the spec's email hint is "I reply within a day." Left out until the
          owner confirms that's true; pass it as `hint` if so. */}
      <FormField
        name="email"
        label="Email"
        type="email"
        required
        autoComplete="email"
        error={errors.email}
        validating={checkingDomain && !errors.email}
        onBlur={() => void handleBlur('email')}
      />
      <FormField name="message" label="Message" type="textarea" required error={errors.message} onBlur={() => void handleBlur('message')} />

      {status === 'failed' ? (
        <p role="alert" className="border-l-2 border-danger pl-4 text-ui text-ink-900">
          That didn&apos;t send — the problem&apos;s on my end. Your message is still here; try again
          {email ? (
            <>
              , or email me at <Link href={`mailto:${email}`}>{email}</Link>.
            </>
          ) : (
            ' in a minute.'
          )}
        </p>
      ) : null}

      {/* Full-width below md, intrinsic from md (components.md "Button"). */}
      <div className="flex flex-col md:flex-row">
        <Button type="submit" loading={sending} loadingLabel="Sending">
          Send message
        </Button>
      </div>
    </form>
  );
}
