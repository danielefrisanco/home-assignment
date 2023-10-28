FROM node:18.17.0-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 8082
EXPOSE 7071