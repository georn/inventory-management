# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install ALL dependencies (including dev for building)
RUN npm install

# Copy source code and config
COPY . .

# Build CSS and Application
RUN npm run build

# --- Stage 2: Production ---
FROM node:20-alpine

WORKDIR /usr/src/app

# Set production environment
ENV NODE_ENV=production

# Copy built application and views
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/views ./views
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/package*.json ./

# Install ONLY production dependencies
RUN npm install --only=production

# Ensure the data directory exists (volume will be mounted here)
RUN mkdir -p data

# Expose the port
EXPOSE 4500

# Start the application directly from the built entry point
CMD ["node", "dist/src/main.js"]
