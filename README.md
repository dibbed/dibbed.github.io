# dibbed

Portfolio / resume site.

- **Live:** [https://dibbed.github.io/](https://dibbed.github.io/)
- **GitHub:** [https://github.com/dibbed](https://github.com/dibbed)

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

### Resume (Download CV)

Place your PDF as `public/resume.pdf`, then commit and push. After deploy, the “Download CV” link and **https://dibbed.github.io/resume.pdf** will work.

### Troubleshooting

- **Blank page / 404 for `/src/main.tsx`** — Source is still “Deploy from a branch”. Switch to **GitHub Actions**.
- **Download CV saves a broken file** — Ensure `public/resume.pdf` exists and is pushed; redeploy.
