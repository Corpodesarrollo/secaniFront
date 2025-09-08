# Etapa 1: Build Angular
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Production
FROM nginx:1.28-alpine

# Copiar TU aplicación Angular
COPY --from=build /app/dist/secani-front/browser /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
