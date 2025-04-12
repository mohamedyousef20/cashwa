# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.11.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Set working directory for the app
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# --- Build Stage ---
FROM base AS build

# Install packages needed to build node modules (including Python)
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    node-gyp \
    pkg-config \
    python-is-python3

# Copy package files and install dependencies
COPY package-lock.json package.json ./
RUN npm ci

# Copy application code
COPY . .

# --- Final Production Stage ---
FROM base

# Install Python runtime for production
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

# Copy built application from build stage
COPY --from=build /app /app

# Expose port 3000 for the application
EXPOSE 3000

# Start the server (can be overwritten at runtime)
CMD [ "node", "index.js" ]
