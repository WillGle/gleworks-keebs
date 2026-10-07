#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
image="gleworks-keebs-test:$$"
container="gleworks-keebs-test-$$"

# Clean up only resources created by this invocation, including failed builds.
cleanup() {
  docker rm -f "$container" >/dev/null 2>&1 || true
  docker image rm "$image" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

docker build -t "$image" .
docker run --name "$container" --network none "$image" sh -ec '
  nginx -t
  nginx
  for route in / /home /archive /service /policies /unknown; do
    wget -q -O /tmp/page.html "http://127.0.0.1$route"
    cmp /tmp/page.html /usr/share/nginx/html/index.html
  done
  for asset in $(grep -oE "/assets/[^\" ]+\.(js|css)" /usr/share/nginx/html/index.html); do
    wget -q -O /tmp/asset "http://127.0.0.1$asset"
    cmp /tmp/asset "/usr/share/nginx/html$asset"
  done
  echo "Container routes and assets: PASS"
'
