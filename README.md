# dibbed

Bilingual portfolio for Python backend engineering, automation, developer tooling, and psychology learning projects. Project descriptions are curated from the linked public repositories, without unverifiable throughput or user-count claims.

- **Live:** [https://dibbed.github.io/](https://dibbed.github.io/)
- **GitHub:** [https://github.com/dibbed](https://github.com/dibbed)
- **GitHub profile README:** [https://github.com/dibbed/dibbed](https://github.com/dibbed/dibbed)
- **Periodic table demo:** [https://dibbed.github.io/smart-periodic-table-fullstack/](https://dibbed.github.io/smart-periodic-table-fullstack/)

Stack: Vite, TypeScript, React, shadcn-ui, Tailwind CSS, Framer Motion, React Router.

---

## Run locally

```sh
git clone https://github.com/dibbed/dibbed.github.io
cd dibbed.github.io
npm i
npm run dev
```

## Scripts

| Command           | Description        |
|-------------------|--------------------|
| `npm run dev`     | Dev server         |
| `npm run build`   | Production build   |
| `npm run preview`| Preview build      |
| `npm run lint`    | ESLint             |
| `npm run test`    | Vitest             |

---

## Deploy (GitHub Pages)

1. In the repo: **Settings → Pages → Build and deployment → Source** → **GitHub Actions**.
2. Push to `main`. The workflow builds and deploys; site: **https://dibbed.github.io/**.

To have the site at the root URL above, use a repo named `dibbed.github.io` under the [dibbed](https://github.com/dibbed) account.

### Content accuracy

- Featured project cards link directly to their public GitHub repositories, with a separate live demo link where available.
- The radar chart counts selected projects in each focus area; it is **not** a percentage-based skill assessment.
- GitHub Activity loads public events from GitHub's API. If the API is unavailable, the site shows an explicit fallback rather than fabricated commits.
- Repository count is a snapshot of the public GitHub profile (November 2026); update it when the count changes.
- Full-stack APIs are not hosted by GitHub Pages. The periodic-table demo is a static frontend build.

### Resume (Download CV)

Place your PDF as `public/resume.pdf`, then commit and push. After deploy, the “Download CV” link and **https://dibbed.github.io/resume.pdf** will work.

### Troubleshooting

- **Blank page / 404 for `/src/main.tsx`** — Source is still “Deploy from a branch”. Switch to **GitHub Actions**.
- **Download CV saves a broken file** — Ensure `public/resume.pdf` exists and is pushed; redeploy.
