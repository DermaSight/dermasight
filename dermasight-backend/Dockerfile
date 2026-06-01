# ---- Build Stage ----
FROM oven/bun:1-alpine AS build
WORKDIR /app

# Install all dependencies (dev + prod) for Prisma generation
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Generate Prisma client
COPY prisma/ prisma/
COPY prisma.config.ts ./
ENV DB_HOST=localhost DB_PORT=5432 DB_USER=dummy DB_PASSWORD=dummy DB_NAME=dummy
RUN bunx prisma generate

# ---- Runtime Stage ----
FROM oven/bun:1-alpine AS runtime
WORKDIR /app

# Install only production dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Copy Prisma client from build stage
COPY --from=build /app/src/engine/prisma src/engine/prisma/

# Copy Prisma schema and migrations for runtime migrations
COPY --from=build /app/prisma/schema prisma/schema/
COPY --from=build /app/prisma/migrations prisma/migrations/
COPY --from=build /app/prisma.config.ts ./

# Copy application source + tsconfig for path aliases
COPY src/ src/
COPY tsconfig.json ./

EXPOSE ${PORT:-5000}
CMD ["bun", "run", "src/index.ts"]
