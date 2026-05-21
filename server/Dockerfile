# ---- Stage 1: Install dependencies ----
FROM oven/bun:1.1 AS deps

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# ---- Stage 2: Production image ----
FROM oven/bun:1.1-slim AS runner

WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Expose the port your Express app listens on
EXPOSE 5000

# Run directly with Bun (no build step needed — Bun runs TS natively)
CMD ["bun", "run", "index.ts"]