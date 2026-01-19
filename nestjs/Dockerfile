FROM node:22.21.1 AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY --chown=node:node . .
RUN yarn build

FROM node:22.21.1-alpine AS production

WORKDIR /usr/src/app

RUN apk add --no-cache git

COPY package.json yarn.lock ./
COPY --from=build /usr/src/app/dist ./dist
COPY --chown=node:node entrypoint.sh ./entrypoint.sh

RUN yarn install --frozen-lockfile --production && yarn cache clean

USER node

EXPOSE 3000 3001

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "dist/src/main.js"]