import type { Metadata } from 'next';
import { ErrorPage } from '@/components/ErrorPage/ErrorPage';
import { Footer } from '@/components/Footer/Footer';
import { Nav } from '@/components/Nav/Nav';
import { RailObserver } from '@/components/RailObserver/RailObserver';
import { client } from '@/sanity/client';
import { SITE_SETTINGS_QUERY } from '@/sanity/queries';

export const metadata: Metadata = { title: 'Page not found' };

/**
 * 404 — layouts.md "404 / 500", copy from frame 7l. Page shell with the case-study nav
 * variant; three links (All work / Home / Email me). Email drops if Site settings
 * hasn't been published, rather than linking nowhere.
 */
export default async function NotFound() {
  const settings = await client.fetch(SITE_SETTINGS_QUERY);

  const links = [
    { href: '/#work', label: 'All work' },
    { href: '/', label: 'Home' },
    settings ? { href: `mailto:${settings.email}`, label: 'Email me' } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  return (
    <>
      <RailObserver />
      {settings ? <Nav name={settings.name} resumeUrl={settings.resumeUrl} variant="case-study" /> : null}
      <ErrorPage
        code="404"
        title="That page isn't here."
        detail="It may have moved when I reorganised the work index."
        links={links}
      />
      {settings ? <Footer settings={settings} /> : null}
    </>
  );
}
