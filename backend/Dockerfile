FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose WebSocket port (matches WS_PORT default in server.ts)
EXPOSE 8080

CMD ["npm", "start"]