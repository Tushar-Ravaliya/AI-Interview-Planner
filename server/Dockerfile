# ---- Stage 1: Install dependencies ----
FROM oven/bun:latest AS deps

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# ---- Stage 2: Production image ----
FROM oven/bun:latest AS runner

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["bun", "run", "index.ts"]