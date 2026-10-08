# GleWorks (gleworks-keebs)

Static showcase and shop website for **GleWorks** — a custom mechanical keyboard workshop and craftsmanship studio.

> **Note:** This repository is the source code for the private static web presence of the GleWorks keyboard workshop, not a public software platform or open-source SaaS framework.

---

## About GleWorks

**GleWorks** is an independent custom mechanical keyboard studio based in Ho Chi Minh City, Vietnam, founded by Chí-Cường Nguyễn (*Gleammy*).

Combining mechanical passion with meticulous handcraft, GleWorks specializes in:

- **Custom Keyboard Builds & Assembly:** Bespoke mechanical keyboards assembled with high attention to detail.
- **Tuning & Modifications:** Switch lubing, filming, spring swapping, stabilizer modding, and acoustic tuning.
- **Custom Finishing:** Custom spray coating, case modifications, and curated keycap/switch pairings.
- **Commission Showcase:** Documented past custom commissions and craft archive.

---

## Website Purpose

This repository houses the lightweight, static single-page application (SPA) that powers the public-facing GleWorks web presence.

Key areas of the site include:

- **Home / Landing:** Brand introduction, craftsmanship philosophy, and artisan background.
- **Archive:** A gallery showcase of completed custom keyboard builds and modding commissions.
- **Commission Status:** Notice on current workshop commission availability.
- **Policies:** Customer service policies, terms of service, privacy, and return guidelines.

---

## Tech Stack

- **Framework & Language:** React 18, TypeScript
- **Bundler & Tooling:** Vite
- **Routing:** React Router (SPA with route-level lazy loading)
- **Styling:** Component CSS files
- **Fonts:** Local Bebas Neue 400 Latin WOFF2 for logos (`src/assets/fonts/`); SIL OFL license in `public/fonts/bebas-neue-OFL.txt`, included in `dist/`. Page content uses Arial/system sans-serif.
- **Testing & Quality:** Vitest, React Testing Library, Playwright, ESLint
- **Production Serving:** Static `dist/` served by homelab; optional Nginx container

---

## Local Development

### Prerequisites

- Node.js 22 (also used by the Nix shell and Docker build)
- npm

### Installation

```bash
npm ci
```

### Dev Server

```bash
npm run dev
```

Dev uses `127.0.0.1:5173`; preview uses `127.0.0.1:4173`. Both exit with an error
when their port is occupied instead of moving to another port. Stop them with
Ctrl+C. Do not use dev or preview as the production server.

Choose another port explicitly when needed:

```bash
npm run dev -- --port 5174
npm run preview -- --port 4174
```

Use `--host 0.0.0.0` only when you need access from another device. Vite's cache
stays in `node_modules/.vite`; builds replace the contents of `dist/` and omit
source maps. Neither directory belongs in Git.

### Testing and Future Pipeline Gates

| Check | Command | What it verifies |
| --- | --- | --- |
| Lint | `npm run lint` | Source and test code rules |
| Types | `npm run type-check` | App, component tests, browser tests, and config types |
| Component / integration | `npm run test:run` | Shell routes, navigation, footer, gallery, Policies selection and deep links |
| Coverage | `npm run test:coverage` | Same tests, with coverage reports saved in the dated run folder |
| Static artifact | `npm run test:build` | Rebuild, asset references, photographs, absence of source maps and test reports |
| Vite lifecycle | `npm run test:vite` | Busy-port failure, loopback binding, serving, and port release after stopping |
| Browser / responsive | `npm run test:e2e` | Built site on desktop and mobile Chromium: routes, reloads, images, history, keyboard navigation, Policies anchors, overflow and JS errors |
| Dependency audit | `npm run test:audit` | Installed dependency advisories; fails at high or critical severity |
| Optional container | `npm run test:container` | Docker build, Nginx configuration, SPA fallback routes, and initial JS/CSS assets |

For browser tests, install Chromium once in the developer environment or CI job:

```bash
npx playwright install --with-deps chromium
```

On NixOS, use a compatible installed Chromium if the downloaded browser cannot
run, for example:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH="$(command -v chromium)" npm run test:e2e
```

Playwright builds the app, starts its own preview server, and stops that server
when the run ends. It refuses to reuse a process already on port 4173. Reports,
failure traces, and screenshots stay in the dated run folder; they are ignored
by Git and excluded from the Docker context. No automatic
retries hide failures. See [Playwright web server management](https://playwright.dev/docs/test-webserver).

For the future static-site pipeline, run:

```bash
npm ci
npx playwright install --with-deps chromium
npm run test:ci
```

`test:ci` stops at the first failed gate. If publishing a container, run
`npm run test:container` as an additional gate before publishing. There is no
CI/CD workflow or host deployment automation in this repo.

Use `npm run test` for local watch mode, or `npm run test:ui` for Vitest UI.
Coverage is reported; a percentage alone does not establish release readiness.

### Run Logs

Every npm script streams its output to the terminal and saves a run under
`logs/<UTC-date-time>-<command>-<unique-id>/`. `result.json` records the command,
start/end time, duration, exit code, interruption signal, Node version, Git
revision, and whether the working tree was dirty. Dated `.log` files capture
stdout and stderr; nested commands save their own dated JSON results in the
same folder. A failed command keeps its nonzero exit code.

Coverage HTML/LCOV/JSON and Playwright HTML reports, screenshots, and traces
belong to that same run. For `test:ci`, the top-level result and all completed
stage results stay together; stages after a failure are not run.

The wrapper keeps the **latest 20 completed runs**, including failures and
interruptions. Older completed folders are removed when a top-level run ends.
Active runs are never pruned. A forcibly killed wrapper may leave a `running`
result; inspect and remove that folder manually. Logs are local artifacts and
must be uploaded from `logs/` by a future CI pipeline before its workspace is
discarded. Commands run directly with `npx` do not use the wrapper.

Direct Vitest coverage and Playwright runs still write reports under dated
`logs/<UTC-date-time>-direct-<tool>-<pid>/` folders instead of the repository root.
They do not have the wrapper's top-level output capture, result metadata, or
automatic retention; use the npm scripts for those features. Explicit CLI or
environment output-directory overrides can change these locations.

Old root-level `coverage/`, `playwright-report/`, and `test-results/` were moved
intact into a dated `logs/` archive run. Its migration log records original
locations and timestamps; it does not establish the original tests' status.
`dist/` remains the deployment artifact, and tool caches stay in `node_modules/`.

To capture an extra command, for example dependency installation:

```bash
node scripts/run-logged.mjs install npm ci
```

The Nix shell provides development tools without installing dependencies on
entry or creating a project-local global npm directory. Run `npm ci` explicitly.
Vite debug output is opt-in: `DEBUG=vite:* npm run dev`.

### Known Product Issues

- Policies on mobile: opening `/policies#return-policy` does not keep the
  Return Policy sidebar link highlighted. The browser regression test remains
  active and blocks the browser gate until this behavior is fixed.
- Newsletter: the email input and send button remain as requested. Submission
  is not implemented yet; current tests preserve the UI, not email delivery.

Dependency audit after removing unused Jest types on 2026-10-07 reported 27 affected package
entries: 4 critical, 16 high, 6 moderate, and 1 low. These include development
tools and runtime dependencies; the counts do not establish exploitability
of the deployed static site. `test:audit` is currently a separate failing gate.
Dependency upgrades are outside this cleanup and testing change.

---

## Project Structure

```text
├── Dockerfile               # Optional static-site container build
├── nginx.conf               # Optional container SPA serving
├── e2e/                     # Desktop/mobile browser tests
├── scripts/                 # Shared run logging and artifact/server/container checks
├── logs/                    # Dated local results and reports (ignored; latest 20 completed runs)
├── index.html               # SPA HTML entry point
├── src/
│   ├── assets/              # Photography and image assets of keyboard builds
│   ├── components/
│   │   ├── Archive/         # Gallery showcase of past keyboard builds and mods
│   │   ├── Landing/         # Brand landing page and craftsman introduction
│   │   ├── Policies/        # Terms, privacy, and return policy pages
│   │   ├── Footer.tsx       # Global footer with social links and contact info
│   │   ├── Header.tsx       # Navigation header
│   │   ├── NotFound.tsx     # 404 fallback page
│   │   └── ServicePaused.tsx# Commission status notice
│   ├── test/                # Component and route integration tests
│   ├── App.tsx              # Shell layout and route definitions (lazy-loaded routes)
│   ├── main.tsx             # Application entrypoint
│   └── index.css            # Base global styles
└── vite.config.ts           # Vite configuration
```

---

## Deployment

The primary delivery artifact is the static build:

```bash
npm ci
npm run build
```

Copy the **contents of `dist/`** to the directory served by homelab. The public
site is `https://keebs.gleworks.io.vn`. Homelab owns LXC provisioning,
cloudflared, Caddy, domain routing, HTTPS, deployment, and monitoring.

```text
Internet → homelab cloudflared / Caddy → static dist/ files
```

The static server must fall back to `index.html` for SPA routes such as `/home`,
`/archive`, `/service`, and `/policies`, including direct navigation and reloads.
Vite preview tests do not prove the live Caddy configuration; check those routes
after a homelab deployment.

For optional container delivery:

```bash
docker build -t gleworks-keebs:local .
docker run --rm -p 127.0.0.1:8080:80 gleworks-keebs:local
```

The image contains Nginx and the built files, listens on HTTP port 80, and
requires no application environment variables or persistent volumes. Homelab
still owns HTTPS and routing. `test:container` creates a temporary container
without external networking or host ports, then removes its container and image
tag even on failure. Docker's normal build cache remains available for reuse.

---

## Copyright & Notice

All brand assets, photography, logos, and custom build designs belong to **GleWorks** / Chí-Cường Nguyễn.
