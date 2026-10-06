import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyBody } from '@/components/CaseStudyBody/CaseStudyBody';
import { CaseStudyContents } from '@/components/CaseStudyContents/CaseStudyContents';
import { CaseStudyHeader } from '@/components/CaseStudyHeader/CaseStudyHeader';
import { Footer } from '@/components/Footer/Footer';
import { Nav } from '@/components/Nav/Nav';
import { NextProject } from '@/components/NextProject/NextProject';
import { RailObserver } from '@/components/RailObserver/RailObserver';
import { hasCaseStudy, headingsOf, readingMinutes, templateFor } from '@/sanity/caseStudy';
import { client } from '@/sanity/client';
import { CASE_STUDY_QUERY, SITE_SETTINGS_QUERY, WORK_INDEX_QUERY } from '@/sanity/queries';

// Static generation over published projects that meet the case-study floor
// (handoff/README.md). Any other slug is a 404 — never rendered on demand.
export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await client.fetch(WORK_INDEX_QUERY);
  return projects.filter((project) => hasCaseStudy(project)).map((project) => ({ slug: project.slug }));
}

async function getCaseStudy(slug: string) {
  const project = await client.fetch(CASE_STUDY_QUERY, { slug });
  return project && hasCaseStudy(project) ? project : null;
}

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getCaseStudy(slug), client.fetch(SITE_SETTINGS_QUERY)]);
  if (!project) return {};
  return {
    title: settings ? `${project.title} — ${settings.name}` : project.title,
    description: project.failureMode,
  };
}

/**
 * /work/[slug] — layouts.md "Case study". Two templates, chosen by the body
 * (templateFor): short is header → prose → optional code; long adds the sticky ToC in
 * the rail column at lg and the next-project link.
 *
 * The rail column is kept on both, empty on short, so the title shares the homepage's
 * content edge at lg. RailObserver is mounted for the nav's scroll rule only — there
 * are no rail sections on this route.
 */
export default async function CaseStudyPage({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params;
  const [project, settings, projects] = await Promise.all([
    getCaseStudy(slug),
    client.fetch(SITE_SETTINGS_QUERY),
    client.fetch(WORK_INDEX_QUERY),
  ]);
  if (!project) notFound();

  const body = project.body ?? [];
  const template = templateFor(body);
  const headings = template === 'long' ? headingsOf(body) : [];

  const caseStudies = projects.filter((p) => hasCaseStudy(p));
  const next = template === 'long' ? caseStudies[caseStudies.findIndex((p) => p.slug === slug) + 1] : undefined;

  return (
    <>
      <RailObserver />
      {settings ? <Nav name={settings.name} resumeUrl={settings.resumeUrl} variant="case-study" /> : null}

      <main id="main" className="flex-1 px-6 md:px-8 lg:px-10">
        <article className="mx-auto max-w-container pt-hero-sm pb-12 lg:grid lg:grid-cols-rail lg:gap-x-11 lg:pt-16 lg:pb-14">
          <div>{template === 'long' ? <CaseStudyContents headings={headings} /> : null}</div>

          <div className="flex min-w-0 flex-col gap-7 md:gap-9">
            <CaseStudyHeader
              title={project.title}
              metric={project.metric}
              failureMode={project.failureMode}
              liveUrl={project.liveUrl}
              repoUrl={project.repoUrl}
              readingMinutes={readingMinutes(body)}
            />
            <CaseStudyBody body={body} headings={headings} />
            {next && hasCaseStudy(next) ? <NextProject slug={next.slug} title={next.title} /> : null}
          </div>
        </article>
      </main>

      {settings ? <Footer settings={settings} /> : null}
    </>
  );
}
