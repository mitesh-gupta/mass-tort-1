FROM node:22.21.0-alpine3.22 AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install pnpm and dependencies with frozen lockfile for reproducible builds
RUN npm i -g pnpm && pnpm install --frozen-lockfile


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma

# Copy source code
COPY . .

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install pnpm and build the application
RUN npm i -g pnpm && pnpm build

# Remove development dependencies and clean up
# RUN pnpm prune --prod

# Clean up unnecessary files to reduce size
RUN find . -name "*.md" -delete && \
    find . -name "*.ts" ! -name "*.d.ts" -delete && \
    find . -name "*.map" -delete && \
    find . -name "*.test.*" -delete && \
    find . -name "*.spec.*" -delete && \
    find . -name "CHANGELOG*" -delete && \
    find . -name "README*" -delete && \
    find . -name "LICENSE*" -delete && \
    find . -name ".git*" -delete


# Production stage - Create minimal runtime image
FROM base AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

# Copy only necessary files and Next.js build output from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set hostname
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Start the application
CMD ["node", "server.js"]