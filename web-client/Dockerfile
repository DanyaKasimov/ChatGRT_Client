# 1. Этап сборки
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальной исходный код
COPY . .

# Собираем проект
RUN npm run build

# 2. Этап запуска (production)
FROM nginx:alpine

# Копируем собранный фронтенд в nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем кастомный конфиг nginx (опционально)
# COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]