FROM node:20

# Создаём рабочую директорию
WORKDIR /app

# Устанавливаем зависимости
COPY package.json package-lock.json ./
RUN npm install

# Копируем оставшиеся файлы
COPY . .

# Открываем порт
EXPOSE 3030

# Запускаем dev-сервер
CMD ["npm", "run", "dev", "--", "-p", "3030"]
