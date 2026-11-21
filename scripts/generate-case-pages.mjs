/**
 * GitHub Pages has no server-side SPA fallback with an HTTP 200 status.
 * Pre-render route-specific entry HTML using the Vite-generated root document
 * so public case study links resolve with 200 and source-specific social tags.
 * The React app still renders the actual case study on the client.
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const index = await readFile(join(dist, "index.html"), "utf8");

if (!index.includes('src="/assets/') || !index.includes('href="/assets/')) {
  throw new Error("Case study entrypoints require absolute root asset URLs in the Vite build.");
}

const pages = [
  {
    slug: "computerpilot-mcp",
    title: "ComputerPilot MCP | Durable Automation Case Study | Ali Khalili",
    description:
      "How ComputerPilot MCP handles typed developer tools, uncertain side effects, durable jobs, crash recovery and cross-platform capabilities. Source-backed architecture and tests.",
  },
  {
    slug: "tenant-rag",
    title: "TenantRAG | Multi-Tenant RAG Security Case Study | Ali Khalili",
    description:
      "Engineering a FastAPI retrieval service with tenant-scoped vector search, API-key hashing, semantic cache isolation and security tests. Inspect the real source.",
  },
  {
    slug: "psychology-atlas",
    title: "Psychology Atlas | Scientific Provenance Case Study | Ali Khalili",
    description:
      "Building a Persian-first educational psychology atlas with reviewed brain data, assessment metadata, source attribution and clearly bounded, non-diagnostic claims.",
  },
];

const escapeHtml = (value) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function setField(html, pattern, value, label) {
  if (!pattern.test(html)) throw new Error("Missing expected HTML metadata: " + label);
  return html.replace(pattern, value);
}

for (const page of pages) {
  const url = "https://dibbed.github.io/case-studies/" + page.slug + "/";
  const title = escapeHtml(page.title);
  const desc = escapeHtml(page.description);
  const image = "https://dibbed.github.io/og-" + page.slug + ".png";
  let html = index;
  html = setField(html, /<title>[^<]*<\/title>/, "<title>" + title + "</title>", "title");
  html = setField(html, /<link rel="canonical" href="[^"]+" \/>/, '<link rel="canonical" href="' + url + '" />', "canonical");
  html = setField(html, /<meta name="description" content="[^"]*" \/>/, '<meta name="description" content="' + desc + '" />', "description");
  html = setField(html, /<meta property="og:url" content="[^"]*" \/>/, '<meta property="og:url" content="' + url + '" />', "og:url");
  html = setField(html, /<meta property="og:title" content="[^"]*" \/>/, '<meta property="og:title" content="' + title + '" />', "og:title");
  html = setField(html, /<meta property="og:description" content="[^"]*" \/>/, '<meta property="og:description" content="' + desc + '" />', "og:description");
  html = setField(html, /<meta property="og:image" content="[^"]*" \/>/,
    '<meta property="og:image" content="' + image + '" />', "og:image");
  html = setField(html, /<meta property="og:image:alt" content="[^"]*" \/>/,
    '<meta property="og:image:alt" content="' + title + '" />', "og:image:alt");
  html = setField(html, /<meta name="twitter:image" content="[^"]*" \/>/,
    '<meta name="twitter:image" content="' + image + '" />', "twitter:image");
  html = setField(html, /<meta name="twitter:title" content="[^"]*" \/>/, '<meta name="twitter:title" content="' + title + '" />', "twitter:title");
  html = setField(html, /<meta name="twitter:description" content="[^"]*" \/>/, '<meta name="twitter:description" content="' + desc + '" />', "twitter:description");
  const directory = join(dist, "case-studies", page.slug);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "index.html"), html, "utf8");
  console.log("Case study entrypoint:", url);
}
