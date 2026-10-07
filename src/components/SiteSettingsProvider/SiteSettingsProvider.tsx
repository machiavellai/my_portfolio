'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { SITE_SETTINGS_QUERY_RESULT } from '@/sanity/types';

const SiteSettingsContext = createContext<SITE_SETTINGS_QUERY_RESULT>(null);

export type SiteSettingsProviderProps = {
  settings: SITE_SETTINGS_QUERY_RESULT;
  children: ReactNode;
};

/**
 * Hands the build-time site settings to the one route that can't fetch them: the 500
 * page. Next requires error.tsx to be a client component, so it can't query Sanity on
 * the server like every other route. No state, no effects — a context bridge only.
 *
 * Not one of the two client components handoff/README.md names (rail observer,
 * contact form). Flagged, like CopyButton; error.tsx itself the README already lists.
 */
export function SiteSettingsProvider({ settings, children }: SiteSettingsProviderProps) {
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
