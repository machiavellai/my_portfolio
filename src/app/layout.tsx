import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider/SiteSettingsProvider";
import { client } from "@/sanity/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import "./globals.css";

// The spec (handoff/tokens.css) loads these via next/font/local. The repo has no
// font files, so they come from next/font/google instead — next/font still
// self-hosts them at build time, so there's no runtime request to Google.
// Weights match the spec: Plex Sans 400–600, Plex Mono 400 + 600.
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

// Title and description come from Sanity, per route (generateMetadata).
export const metadata: Metadata = {};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Fetched at build for the 500 page only (see SiteSettingsProvider). Every other route
  // fetches its own settings on the server.
  const settings = await client.fetch(SITE_SETTINGS_QUERY);

  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink-700">
        {/* First focusable element on every route (2.4.1). Styled in globals.css. */}
        <a href="#main" className="skip">
          Skip to content
        </a>
        <SiteSettingsProvider settings={settings}>{children}</SiteSettingsProvider>
      </body>
    </html>
  );
}
