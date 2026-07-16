# Stage 1: build da aplicação
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: serve o build com Apache
FROM httpd:alpine
COPY --from=build /app/dist/ /usr/local/apache2/htdocs/