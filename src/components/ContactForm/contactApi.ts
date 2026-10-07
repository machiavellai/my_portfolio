/**
 * The contact form's only connection to the server. Both functions are stubs.
 *
 * TODO(server): build `/api/contact` (src/app/api/contact/route.ts) once Resend is set
 * up — RESEND_API_KEY in .env.local and Vercel, never in a SANITY_STUDIO_* variable.
 * Then replace the two bodies below with POSTs to it. Nothing else in the form changes:
 * it already handles every result these can return. Spam protection belongs with the
 * server work too: a hidden trap field plus a minimum fill time, no CAPTCHA.
 *
 * Until then, by the owner's choice (2026-10-06): the form validates in the browser,
 * but a valid submit does nothing, and the domain check is skipped. DO NOT DEPLOY to
 * production like this — a visitor's message would go nowhere and they'd never know.
 */

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
};

/** 'sent' shows the success panel; 'failed' shows the send error. null: not wired yet. */
export type SendResult = 'sent' | 'failed' | null;

export async function sendContact(message: ContactMessage): Promise<SendResult> {
  // TODO(server): POST `message` as JSON to /api/contact; 2xx → 'sent', anything else
  // (including a network error) → 'failed'.
  void message;
  return null;
}

/**
 * Does the email's domain accept mail? Needs a DNS lookup, which only the server can
 * do. true / false when checked; null when it couldn't check — the form then lets the
 * address through rather than blocking a real person.
 */
export async function checkEmailDomain(email: string): Promise<boolean | null> {
  // TODO(server): ask /api/contact to resolve the domain's MX (falling back to A)
  // records, with a short timeout.
  void email;
  return null;
}
