# syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app

# Cache dependencies qua BuildKit
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy toàn bộ mã nguồn cần cho build cùng một lượt
COPY index.html tsconfig.json vite.config.ts ./
COPY src/ ./src/
COPY public/ ./public/

# Build trực tiếp bằng tool binaries, không cần wrapper logging trong container
RUN npx tsc && npx vite build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
