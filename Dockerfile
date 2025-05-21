FROM node:slim

ENV NODE_ENV=production

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5000

CMD ["node", "app.js"]

