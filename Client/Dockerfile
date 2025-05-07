# Stage 1: build React via Vite
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Install deps
COPY package*.json ./
RUN npm install

# Copy app + env so VITE_… vars are available
COPY . .
RUN npm run build

# Stage 2: serve with Nginx
FROM nginx:stable-alpine
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]