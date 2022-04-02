FROM node:17 as base

WORKDIR /home/node/app

COPY package*.json ./

RUN npm i
COPY . .
RUN npm run build



################################################################################
FROM base as production

ENV NODE_PATH=./build
ENV NODE_ENV=production

RUN npm run start
