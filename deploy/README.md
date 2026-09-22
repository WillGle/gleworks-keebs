# GleWorks Static Deploy

Deploys the static GleWorks portfolio to a public VPS.

## Architecture

```text
internet -> Caddy (auto-TLS) -> frontend (nginx static SPA)
```

There is no backend, database, or auth service in this portfolio stack. The
previous full-stack app lives in `gleworks-sme`.

An optional Loki+Prometheus+Grafana overlay (`docker-compose.monitoring.yml`)
is available — see [Monitoring](#monitoring) below.

## Prerequisites

1. A VPS with Docker and the Docker Compose plugin.
2. A domain with a DNS A record pointing to the VPS.
3. Ports 80 and 443 open.

## Manual Deploy

```bash
git clone https://github.com/WillGle/gleworks-portfolio.git
cd gleworks-portfolio
cp deploy/.env.example deploy/.env
$EDITOR deploy/.env
docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build
```

Visit `https://$DOMAIN`.

## Verify

```bash
curl -fsS https://$DOMAIN/
docker compose -f deploy/docker-compose.yml --env-file deploy/.env ps
```

## Validate Config

```bash
cd deploy
make validate
docker compose -f docker-compose.yml --env-file .env config
```

## Jenkins

Configure the Jenkins pipeline script path as `deploy/Jenkinsfile`.

## Monitoring

`docker-compose.monitoring.yml` is an optional overlay that adds a small
Loki + Prometheus + Grafana stack watching the Caddy/nginx layer above. It's a
learning sandbox for the LGTM stack, built against this repo's own real
deploy instead of a toy example:

```text
node-exporter    -> host CPU/mem/disk (USE metrics)
nginx-exporter   -> frontend's nginx stub_status (basic RED-ish counters)
caddy            -> Caddy's built-in admin /metrics (reverse-proxy RED metrics)
promtail + loki  -> Caddy/nginx container logs, queried with LogQL for
                    request rate / error rate — since this is a static site
                    with no application-level metrics endpoint of its own,
                    the JSON access log is the only place RED metrics
                    (request rate, error rate, duration) can come from.
```

Run it alongside the base stack (must be run together, not standalone):

```bash
cd deploy
docker compose -f docker-compose.yml -f docker-compose.monitoring.yml \
  --env-file .env up -d --build
```

Set a strong, unique `GRAFANA_ADMIN_PASSWORD` in `deploy/.env` before starting
the overlay. Grafana binds only to localhost; reach it over SSH:

```bash
ssh -L 3000:127.0.0.1:3000 <user>@<host>
```

Then open `http://127.0.0.1:3000` (admin / `$GRAFANA_ADMIN_PASSWORD`). The
"GleWorks Overview" dashboard is auto-provisioned with host, reverse-proxy,
and log-derived panels.

Notes:

- Caddy's admin API (which exposes `/metrics`) is bound to `0.0.0.0:2019` so
  Prometheus can scrape it, but it is never published to the host in any
  compose file — only reachable from other containers on the same docker
  network. The admin API also allows *changing* Caddy's config, not just
  reading metrics, so don't add a `ports:` mapping for it.
- `nginx_status` (nginx's `stub_status` module) is exposed the same way, on
  port 8080 of the `frontend` container.
- Promtail mounts the Docker socket for discovery/log scraping. A `:ro` bind
  does not make the Docker API read-only; treat this as root-equivalent host
  access and run only in a trusted environment.
- Six extra containers is real memory pressure on a small VPS — this overlay
  is meant for local learning or a VPS with more headroom than the 2 GB
  `docker-compose.fallback.yml` box, not for running everything at once on
  the smallest box.
