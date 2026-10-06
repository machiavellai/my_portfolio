import type { Metadata } from 'next';
import { About } from '@/components/About/About';
import { Contact } from '@/components/Contact/Contact';
import { Experience } from '@/components/Experience/Experience';
import { Footer } from '@/components/Footer/Footer';
import { Hero } from '@/components/Hero/Hero';
import { Nav } from '@/components/Nav/Nav';
import { RailObserver } from '@/components/RailObserver/RailObserver';
import { Section } from '@/components/Section/Section';
import { WorkIndex } from '@/components/WorkIndex/WorkIndex';
import { client } from '@/sanity/client';
import { HOME_QUERY, ROLES_QUERY, SITE_SETTINGS_QUERY, WORK_INDEX_QUERY } from '@/sanity/queries';

export async function generateMetadata(): Promise<Metadata> {
  const [settings, home] = await Promise.all([client.fetch(SITE_SETTINGS_QUERY), client.fetch(HOME_QUERY)]);
  return {
    title: settings?.name,
    description: home?.headline,
  };
}

/**
 * Homepage: hero → work → experience → about → contact (layouts.md). Fetched at build —
 * static generation, no client fetching (handoff/README.md).
 *
 * Every section depends on published content. Until a singleton is published its
 * query returns null and the sections that need it render nothing — the spec defines
 * no empty state for them, and a placeholder would be invented content.
 * Writing and Code render nothing until they have entries and a decided position.
 */
export default async function Home() {
  const [settings, home, projects, roles] = await Promise.all([
    client.fetch(SITE_SETTINGS_QUERY),
    client.fetch(HOME_QUERY),
    client.fetch(WORK_INDEX_QUERY),
    client.fetch(ROLES_QUERY),
  ]);

  return (
    <>
      <RailObserver />
      {settings ? <Nav name={settings.name} resumeUrl={settings.resumeUrl} /> : null}

      <main id="main" className="flex-1 px-6 md:px-8 lg:px-10">
        <div className="mx-auto max-w-container">
          {home && settings ? <Hero home={home} settings={settings} /> : null}

          {projects.length > 0 ? (
            <Section id="work" number="01" title="Work">
              <WorkIndex projects={projects} />
            </Section>
          ) : null}

          {roles.length > 0 ? <Experience roles={roles} /> : null}
          {home ? <About about={home.about} stack={home.stack} /> : null}
          {home ? <Contact intro={home.contactIntro} /> : null}
        </div>
      </main>

      {settings ? <Footer settings={settings} /> : null}
    </>
  );
}
