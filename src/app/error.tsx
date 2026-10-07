'use client';

import { ErrorPage } from '@/components/ErrorPage/ErrorPage';
import { Footer } from '@/components/Footer/Footer';
import { Nav } from '@/components/Nav/Nav';
import { useSiteSettings } from '@/components/SiteSettingsProvider/SiteSettingsProvider';

/**
 * 500 — layouts.md "404 / 500", copy from frame 7l. A client component because Next
 * requires it; site settings arrive through SiteSettingsProvider (root layout).
 * Two links (Home / Email me), no retry button — the spec offers two links only.
 *
 * Frame 7l's copy ends "It's logged and I'll see it." Left out: nothing logs errors
 * yet, so the sentence would be false. TODO: restore it if error reporting is added.
 */
export default function ServerErrorPage() {
  const settings = useSiteSettings();

  const links = [
    
    { href: '/', label: 'Home' },
    settings ? { href: `mailto:${settings.email}`, label: 'Email me' } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  return (
    <>
      {/* React hoists this into <head>; error.tsx can't export metadata. */}
      <title>Something broke</title>
      {settings ? <Nav name={settings.name} resumeUrl={settings.resumeUrl} variant="case-study" /> : null}
      <ErrorPage
        code="500"
        title="Something broke on my end."
        detail="Not your connection, not your browser — mine."
        links={links}
      />
      {settings ? <Footer settings={settings} /> : null}
    </>
  );
}
