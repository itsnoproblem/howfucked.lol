# Stage 1: Build environment
FROM node:20-slim AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Stage 2: Production environment
FROM node:20-slim AS runner
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the application
CMD ["pnpm", "start"] 