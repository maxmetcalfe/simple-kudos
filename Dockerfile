FROM node:14

COPY server.js server.js
COPY package.json .
COPY package-lock.json .

RUN npm install

EXPOSE 3000

CMD [ "node", "server.js" ]
