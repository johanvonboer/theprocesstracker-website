# Build stage: compile the site with webpack
FROM docker.io/library/node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY webpack.common.js webpack.prod.js ./
COPY src ./src
RUN npm run build

# Runtime stage: serve the static output with nginx
FROM docker.io/library/nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
