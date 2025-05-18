# NestJS Microservices Dockerfile

# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Set environment to production
ENV NODE_ENV=production

WORKDIR /app

# Copy production dependencies and build artifacts
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# Expose default port
EXPOSE 3000

# Use CMD in the docker-compose file to specify which app to run 