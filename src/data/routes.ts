// src/data/routes.ts
// Single source of truth for site navigation.
//
// Consumed by:
//   - NavBlock.astro  (inline tab-completion row — `primary` routes only)
//   - SiteMenu.astro  (full tree overlay — every route, grouped)
//
// To add a page: add one entry here. Pick a group (or add a new one to
// GROUP_ORDER) and set `primary: true` only if it belongs in the always-visible
// inline row — the overlay absorbs everything else, so the inline row stays
// short as the site grows.

export interface SiteRoute {
  /** URL path, with trailing slash (except `/`). */
  path: string;
  /** Directory-style label rendered in nav contexts, e.g. `skills/`. */
  label: string;
  /** Short lowercase description shown in the sitemap tree. */
  description: string;
  /** Section of the sitemap tree this route renders under. */
  group: (typeof GROUP_ORDER)[number];
  /** Show in the compact inline NavBlock row. Keep this set small. */
  primary?: boolean;
}

/** Render order of sitemap tree sections. */
export const GROUP_ORDER = ["registry", "resources", "docs", "site"] as const;

export const routes: SiteRoute[] = [
  { path: "/",              label: "/",             description: "main landing page",      group: "site",     primary: true },
  { path: "/about/",        label: "about/",        description: "what quirgs is & who builds it", group: "site",     primary: true },
  { path: "/skills/",       label: "skills/",       description: "skills registry",        group: "registry", primary: true },
  { path: "/resources/",    label: "resources/",    description: "case studies & writeups", group: "resources" },
  { path: "/gate/",         label: "gate/",         description: "HITL Gate infrastructure", group: "resources" },
  { path: "/demo/",         label: "demo/",         description: "HITL Gate demo queue",   group: "resources" },
  { path: "/review/",       label: "review/",       description: "HITL gate review queue", group: "resources" },
  { path: "/guides/",       label: "guides/",       description: "reference guides",       group: "docs",     primary: true },
  { path: "/bundles/",      label: "bundles/",      description: "skill bundles",          group: "registry", primary: true },
  { path: "/transparency/", label: "transparency/", description: "AI transparency notice", group: "docs" },
  { path: "/security/",     label: "security/",     description: "security & trust posture", group: "docs" },
  { path: "/hitl/",         label: "hitl/",         description: "human approval queue",   group: "docs" },
  { path: "/support/",      label: "support/",      description: "help & contact",         group: "site" },
  { path: "/privacy/",      label: "privacy/",      description: "privacy policy",         group: "site" },
  { path: "/terms/",        label: "terms/",        description: "terms of use",           group: "site" },
];

export const primaryRoutes = routes.filter((r) => r.primary);

export const routesByGroup = GROUP_ORDER.map((group) => ({
  group,
  routes: routes.filter((r) => r.group === group),
}));
