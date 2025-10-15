# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install

RUN chmod -R 755 node_modules/ && \
    find node_modules -name "*.js" -exec chmod +x {} + && \
    find node_modules -name "*" -type f -executable -exec chmod +x {} + && \
    chmod -R +x node_modules/.bin/ 2>/dev/null || true

COPY . .

# Accept build arguments
ARG VITE_SERVER_URL=http://localhost:8080
ARG VITE_MAP_API_KEY
ARG VITE_GEOLOCATION_API_KEY

# Create a temporary .env.production for Docker build only
RUN echo "VITE_SERVER_URL=$VITE_SERVER_URL" > .env.production.docker && \
    echo "VITE_MAP_API_KEY=$VITE_MAP_API_KEY" >> .env.production.docker && \
    echo "VITE_GEOLOCATION_API_KEY=$VITE_GEOLOCATION_API_KEY" >> .env.production.docker && \
    mv .env.production .env.production.backup && \
    mv .env.production.docker .env.production

RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
