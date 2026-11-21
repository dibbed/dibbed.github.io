/** Stable URLs for featured and non-featured projects. */
export function projectAnchor(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return "project-" + slug;
}

export function projectShareUrl(name: string, currentHref: string): string {
  const url = new URL(currentHref);
  url.search = "";
  url.hash = projectAnchor(name);
  return url.toString();
}
