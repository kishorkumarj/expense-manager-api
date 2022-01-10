FROM node:14.17.5-alpine

ENV NODE_ENV production

RUN mkdir -p /var/assets
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install pm2@5.1.2 -g
COPY . .

ENV PORT 80
EXPOSE 80

CMD ["pm2-runtime", "ecosystem.config.js"]
