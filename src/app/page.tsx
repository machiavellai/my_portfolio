import { WorkIndex } from '@/components/WorkIndex/WorkIndex';
import { client } from '@/sanity/client';
import { WORK_INDEX_QUERY } from '@/sanity/queries';

// Build step 4: only the Work section exists yet. Nav, rail, hero (and with it the
// page's one <h1>), the other sections and the footer arrive with the page shell in
// step 5. Fetched at build — static generation, no client fetching (handoff/README.md).
export default async function Home() {
  const projects = await client.fetch(WORK_INDEX_QUERY);

  return (
    <main className="mx-auto w-full max-w-container flex-1 bg-paper px-6 py-12 md:px-8 lg:px-10 lg:py-14">
      <WorkIndex projects={projects} />
    </main>
  );
}
