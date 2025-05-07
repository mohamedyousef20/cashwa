# ──── STAGE 1: build bcrypt & deps ────────────────────
FROM node:18-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN apk del make g++

# ──── STAGE 2: final image ────────────────────────────
FROM node:18-alpine

# Create uploads directory with proper permissions
RUN mkdir -p /uploads && chown -R node:node /uploads

WORKDIR /app

# Copy from builder stage
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app ./

# Switch to non-root user
USER node

ENV PORT=3000
EXPOSE 3000

CMD ["node", "index.js"]