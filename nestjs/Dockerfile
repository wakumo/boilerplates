FROM node:26.13.0 AS build

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock .yarnrc.yml ./
RUN npm install --global corepack@0.36.0 && corepack enable && corepack prepare yarn@4.14.1 --activate
RUN yarn install --immutable

COPY --chown=node:node . .
RUN yarn build

FROM node:26.13.0-alpine AS production

WORKDIR /usr/src/app

ENV COREPACK_HOME=/opt/corepack

RUN apk add --no-cache git
RUN npm install --global corepack@0.36.0 && corepack enable && corepack prepare yarn@4.14.1 --activate

COPY package.json yarn.lock .yarnrc.yml ./
COPY --from=build /usr/src/app/dist ./dist
COPY --chown=node:node entrypoint.sh ./entrypoint.sh

RUN yarn workspaces focus --all --production && yarn cache clean --all

USER node

EXPOSE 3000 3001

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "dist/src/main.js"]
