# -- Build Stage --
# Force this heavy stage to run natively on your Mac's Intel chip ($BUILDPLATFORM)
FROM --platform=$BUILDPLATFORM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Runner Stage ---
# The final runtime stage targets the Pi's ARM64 ecosystem
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy the compiled production assets from the native Intel builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install only production dependencies
RUN npm ci --only=production

EXPOSE 3000
CMD ["npm", "start"]