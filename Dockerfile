FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache --update libc6-compat
WORKDIR /app

COPY package.json vite.config.ts pnpm-lock.yaml* ./
RUN corepack enable pnpm
RUN pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable
RUN pnpm run build

FROM base AS runner
WORKDIR /app

RUN apk add --no-cache --update curl gettext

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/public ./public
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/vite.config.ts ./vite.config.ts

RUN corepack enable && pnpm --version

COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 4173

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["pnpm", "start"]