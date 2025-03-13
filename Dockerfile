# Use Node 18 alpine as the base image
FROM node:22.12.0-alpine AS base

FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN yarn global add pnpm

WORKDIR /app

COPY package.json  ./
RUN pnpm install

FROM base AS builder
RUN yarn global add pnpm

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Set the correct permission for prerender cache
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use the new JSON format for CMD
CMD ["/bin/ash", "start.sh"]
