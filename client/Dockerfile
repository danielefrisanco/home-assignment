FROM node:18.17.0-alpine

# WORKDIR /usr/src/app/client
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5137
EXPOSE 8080