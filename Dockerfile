# Build stage
FROM node:20-alpine AS builder

# Add build dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files first for better caching
COPY package*.json .
COPY pnpm-lock.yaml .

# Install pnpm and dependencies
RUN npm i -g pnpm@latest
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the app and prune dependencies
RUN pnpm run build
RUN pnpm prune --prod

# Production stage
FROM node:20-alpine AS deployer

# Add production dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy built assets and dependencies
COPY --from=builder /app/build build/
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules node_modules/

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000 

# Use non-root user for better security
USER node

CMD [ "node", "build" ]