# =============================================
# Knowledge Hub - Production Dockerfile
# Multi-stage: builds React, then serves via Node
# =============================================

# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Install frontend deps
RUN npm ci --legacy-peer-deps

# Copy source
COPY . .

# Build React app
ARG REACT_APP_API_BASE_URL=""
ARG REACT_APP_RAZORPAY_KEY=""
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV REACT_APP_RAZORPAY_KEY=$REACT_APP_RAZORPAY_KEY

RUN npm run build

# Stage 2: Production Node server
FROM node:18-alpine AS production

WORKDIR /app

# Copy server package files and install deps
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev

# Copy server source
COPY server/ ./server/

# Copy React build output from stage 1
COPY --from=frontend-builder /app/build ./build

# Set environment
ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "server/index.js"]
