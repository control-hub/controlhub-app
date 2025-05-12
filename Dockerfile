FROM node:22-slim AS builder

WORKDIR /app

# Установим зависимости для сборки нативных модулей
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Копируем package.json и lock-файл
COPY package*.json ./

# Устанавливаем зависимости
RUN npm i

# Проверяем установку Rollup
# RUN npm ls rollup || true

# Копируем исходный код
COPY . .

# Сборка
RUN npm run build

FROM node:22-slim AS deploy

WORKDIR /app

# Runtime зависимости
RUN apt-get update

# Копируем собранные файлы
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/build ./build

# Открываем порт
EXPOSE 3000

# Настройка переменных окружения
ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=production

# Запуск
CMD ["node", "build"]
