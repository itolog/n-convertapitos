# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.0.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory for all build stages.
WORKDIR /usr/src/app

################################################################################
# Install production dependencies.
FROM base AS deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --production --frozen-lockfile

################################################################################
# Build the application.
FROM base AS build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

COPY . .
RUN yarn run build

################################################################################
# Final runtime image with minimal footprint.
FROM node:${NODE_VERSION}-alpine AS final

WORKDIR /usr/src/app

ENV NODE_ENV="production"

# Add a non-root user and switch to it
USER node

# Copy only necessary files
COPY --chown=node:node package.json .
COPY --from=deps --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=node:node /usr/src/app/dist ./dist

# Optional: prune unnecessary files
RUN rm -rf node_modules/**/*.md node_modules/**/*.ts node_modules/**/test node_modules/**/__tests__

# Expose the port the app runs on
EXPOSE 3000
# Start the app
CMD ["yarn", "start:prod"]
