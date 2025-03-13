#!/bin/sh

set -e

echo "Generating Payload Types..."
pnpm payload generate:types

echo "Running Payload migrations..."
npx payload migrate

echo "Building..."
pnpm run build
ln .next/standalone/server.js .

echo "Starting Next.js server..."
node server.js
