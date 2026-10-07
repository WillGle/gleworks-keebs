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
- **Styling:** Custom Modular CSS
- **Testing & Quality:** Vitest, React Testing Library, ESLint
- **Production Serving:** Nginx container behind Caddy (automatic TLS)

---

## Local Development

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

```bash
npm install
```

### Dev Server

Start the local development server with hot-module replacement (HMR):

```bash
npm run dev
```

### Validation & Testing

Run code quality checks and tests:

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Run test suite
npm run test:run

# Production build test
npm run build
```

---

## Project Structure

```text
├── deploy/                  # Docker, Compose, Caddy, Ansible, and Jenkins deploy configurations
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
│   ├── test/                # Unit and integration test suites
│   ├── App.tsx              # Shell layout and route definitions (lazy-loaded routes)
│   ├── main.tsx             # Application entrypoint
│   └── index.css            # Base global styles
└── vite.config.ts           # Vite configuration
```

---

## Deployment

The production deployment runs a completely static stack:

```text
Internet ──> Caddy (Auto-TLS Reverse Proxy) ──> Frontend (Nginx SPA Container)
```

No database, backend API, or stateful application server is required for this portfolio shop site.

To build and run the production container locally or on a VPS:

```bash
docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build
```

Detailed deployment instructions, CI/CD pipelines, and optional monitoring stack configs can be found in [`deploy/README.md`](deploy/README.md).

---

## Copyright & Notice

All brand assets, photography, logos, and custom build designs belong to **GleWorks** / Chí-Cường Nguyễn.
