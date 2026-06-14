# --- STAGE 1: Dependencies ---
# Changed from node:18-alpine to node:20-alpine
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN \
  if [ -f "package-lock.json" ]; then npm ci; \
  elif [ -f "yarn.lock" ]; then yarn --frozen-lockfile; \
  elif [ -f "pnpm-lock.yaml" ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# --- STAGE 2: Builder ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 2. Convert them to ENV variables so the build process can read them
ENV NEXT_PUBLIC_API_URL=http://metacode-gateway:8080
ENV NEXT_PUBLIC_AUTH_REFRESH_PATH=/v1/auth/token/refresh
ENV NEXT_PUBLIC_SHOW_NAV=false

RUN npm run build
# --- STAGE 3: Runner ---
# Changed from node:18-alpine to node:20-alpine
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Fixed warning: Used modern ENV syntax
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]