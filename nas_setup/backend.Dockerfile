FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY backend/. ./

RUN mkdir -p /app/uploads

EXPOSE 3000

CMD ["sh", "-c", "node init-db.js && node server.js"]

