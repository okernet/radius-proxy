# Build stage
FROM node:24-alpine AS builder

WORKDIR /usr/app

# Install build dependencies for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev for building)
RUN npm ci

# Copy source code
COPY tsconfig.json nest-cli.json ./
COPY src ./src

# Build the application
RUN npm run build

# Production stage
FROM node:24-alpine AS production

WORKDIR /usr/app

# Install runtime dependencies for native modules
RUN apk add --no-cache python3 make g++

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev && \
    npm cache clean --force

# Remove build tools after native module compilation
RUN apk del python3 make g++

# Copy built application from builder stage
COPY --from=builder /usr/app/dist ./dist

# Create data directory for SQLite
RUN mkdir -p /usr/app/data && chown -R nestjs:nodejs /usr/app/data

# Set ownership
RUN chown -R nestjs:nodejs /usr/app

# Switch to non-root user
USER nestjs

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
