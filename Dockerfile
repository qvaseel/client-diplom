FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3030

CMD ["npm", "start", "--", "-p", "3030"]
