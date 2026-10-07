import { Link } from '../Link/Link';

export type ErrorPageProps = {
  code: '404' | '500';
  title: string; // the page's single h1 sentence
  detail: string;
  links: { href: string; label: string }[];
};

/**
 * Body of the 404 and 500 pages (layouts.md "404 / 500", frame 7l): code, the h1
 * sentence, one line of detail, a link row. No illustration, no oversized numeral, no
 * joke. The 500 carries a 2px danger rule — it names the fault as the owner's own.
 *
 * Same grid as the case-study route, rail column empty, so the h1 shares the site's
 * content edge at lg. Callers render the shell (nav, footer) around it.
 */
export function ErrorPage({ code, title, detail, links }: ErrorPageProps) {
  return (
    <main id="main" className="flex-1 px-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-container pt-hero-sm pb-12 lg:grid lg:grid-cols-rail lg:gap-x-11 lg:pt-16 lg:pb-14">
        <div />
        <div className={`flex max-w-prose flex-col gap-3 ${code === '500' ? 'border-l-2 border-danger pl-5' : ''}`}>
          <p className="font-mono text-rail uppercase text-ink-600">{code}</p>
          <h1 className="text-pretty text-h1 text-ink-900">{title}</h1>
          <p className="text-body text-ink-700">{detail}</p>
          {/* Standalone link row: 15px block padding, 20px gap (components.md "Link"). */}
          <ul className="flex flex-wrap gap-x-5">
            {links.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="inline-block py-link-y text-ui">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
