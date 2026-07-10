# Build stage
FROM node:26-trixie-slim AS builder

WORKDIR /usr/app

# Install build dependencies for native modules (better-sqlite3)
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev for building)
RUN npm ci

# Copy source code
COPY tsconfig.json nest-cli.json .swcrc tsconfexiig.build.json ./
COPY src ./src

# Build the application
RUN npm run build

# Production stage
FROM node:26-trixie-slim AS production

WORKDIR /usr/app

# Install runtime dependencies for native modules and wget for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ wget && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev && \
    npm cache clean --force

# Remove build tools after native module compilation
RUN apt-get remove -y python3 make g++ && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy built application from builder stage
COPY --from=builder /usr/app/dist/src ./dist

# Create data directory for SQLite
RUN mkdir -p /usr/app/data && chown -R node:node /usr/app/data

# Set ownership
RUN chown -R node:node /usr/app

# Switch to non-root user
USER node

# Environment defaults
ENV NODE_ENV=production
ENV PORT=3080
ENV HOST=0.0.0.0
ENV DB_PATH=/usr/app/data/radius-proxy.sqlite

# Expose the application port
EXPOSE 3080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:3080/health || exit 1

# Start the application
CMD ["node", "dist/main"]
