# Summit 17 official website

Static Astro site for Summit 17. The same source can build for Netlify or GitHub Pages.

## Local development

```sh
nvm install 22
nvm use
npm install
npm run dev
```

Run `npm run build` to type-check and generate the production site in `dist/`.

## Content updates

- Band details, external links, tracks, photos, videos, and the featured show are in `src/data/site.ts`.
- Page copy is in the corresponding file under `src/pages/`.
- Audio previews are in `public/audio/`.
- Original site images and fonts are in `src/assets/` and are optimized automatically during the build.
- Bandsintown remains the source of truth for live event updates using artist ID `15626978`.

## Netlify

The build command, Node version, cache headers, form handling, and legacy redirects are configured in `netlify.toml` and `public/_redirects`.

After the first production deploy, enable email notifications for the `booking` form in Netlify’s Forms settings and route them to `Johnnywicoffmusic@gmail.com`. Test one submission from the production domain before switching DNS.

## GitHub Pages

Pushing to `main` runs `.github/workflows/pages.yml` and publishes the site at `https://cooper-ganglia.github.io/summit17/` once **Settings → Pages → Source** is set to **GitHub Actions**. The workflow builds with the `/summit17` base path. On Pages, the booking page offers a direct email link because GitHub Pages cannot process Netlify forms. This does not change the existing `summit17official.com` domain or its DNS.
