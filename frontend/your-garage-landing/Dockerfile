# --- Build Stage ---
FROM --platform=$BUILDPLATFORM node:18-alpine AS builder
WORKDIR /app
COPY index.html ./

# --- Runner Stage ---
FROM nginx:alpine AS runner
COPY --from=builder /app/index.html /usr/share/nginx/html/index.html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
