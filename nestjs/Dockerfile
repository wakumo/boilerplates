FROM node:22.23.4@sha256:63538dfe497cc29dfafdda25ada09b46db68a3f4cc205abf1f5d6bf0913f3384 AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY --chown=node:node . .
RUN yarn build

FROM node:22.23.4-alpine3.23@sha256:6abbcf5dd6b231da109bcde1181db1d92bf78015ae1a9514d9807c1f857869db AS production

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
